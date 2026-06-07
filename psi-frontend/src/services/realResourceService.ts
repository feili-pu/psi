import AuthService from './authService';

const API_BASE = 'http://localhost:8080';

type AnyRecord = Record<string, any>;

const toDateString = (value: any): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') return value.slice(0, 10);
  if (value?.format) return value.format('YYYY-MM-DD');
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
};

const numberValue = (value: any, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const idValue = (value: any, fallback = 1): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const firstText = (...values: any[]): string => {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value);
    }
  }
  return '';
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeaders(),
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `请求失败: ${response.status}`);
  }

  if (data && typeof data === 'object' && 'success' in data && data.success === false) {
    throw new Error(data.message || '接口处理失败');
  }

  return data as T;
};

const makeLineItem = (values: AnyRecord, priceKey = 'unitPrice') => {
  const quantity = numberValue(values.quantity ?? values.totalQuantity ?? values.requestQty ?? values.returnQty ?? values.actualQty, 1);
  const price = numberValue(values[priceKey] ?? values.estimatedPrice ?? values.unitPrice ?? values.unitCost ?? values.totalAmount, 0);

  return {
    productName: firstText(values.productName, values.requestTitle, values.title, values.reason, '默认项目'),
    productCode: values.productCode,
    specification: values.specification,
    unit: firstText(values.unit, '件'),
    quantity,
    estimatedPrice: price,
    unitPrice: price,
    amount: numberValue(values.amount, quantity * price),
    purpose: firstText(values.purpose, values.reason, values.remarks, '业务需要'),
    remarks: values.remarks ?? values.remark
  };
};

const makeInventoryItem = (values: AnyRecord, quantityKey = 'quantity') => ({
  productId: idValue(values.productId),
  quantity: numberValue(values[quantityKey] ?? values.quantity ?? values.totalQuantity, 1),
  unit: firstText(values.unit, '件'),
  unitPrice: numberValue(values.unitPrice ?? values.unitCost ?? values.totalAmount, 0),
  unitCost: numberValue(values.unitCost ?? values.unitPrice ?? values.totalAmount, 0),
  batchNo: values.batchNo,
  qualityStatus: values.qualityStatus ?? 'QUALIFIED',
  remarks: values.remarks ?? values.remark
});

const exportCsv = (filename: string, rows: AnyRecord[]) => {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]).filter((key) => typeof rows[0][key] !== 'object');
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((key) => `"${String(row[key] ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const PurchaseRealApi = {
  async listRequests() {
    return request<any[]>('/api/purchase/requests');
  },
  async getRequest(id: number) {
    return request<{ request: AnyRecord; items: AnyRecord[] }>(`/api/purchase/requests/${id}`);
  },
  async saveRequest(values: AnyRecord, id?: number) {
    const payload = {
      department: values.department,
      applicant: firstText(values.applicant, values.requester),
      requiredDate: toDateString(values.requiredDate ?? values.expectedDate),
      remarks: firstText(values.remarks, values.remark, values.reason),
      items: values.items?.length ? values.items : [makeLineItem(values)]
    };
    return request<any>(`/api/purchase/requests${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
  },
  approveRequest: (id: number) => request<any>(`/api/purchase/requests/${id}/approve`, { method: 'POST' }),
  rejectRequest: (id: number) => request<any>(`/api/purchase/requests/${id}/reject`, { method: 'POST' }),
  cancelRequest: (id: number) => request<any>(`/api/purchase/requests/${id}/cancel`, { method: 'POST' }),
  deleteRequest: (id: number) => request<any>(`/api/purchase/requests/${id}`, { method: 'DELETE' }),

  async listInquiries() {
    return request<any[]>('/api/purchase/inquiries');
  },
  async getInquiry(id: number) {
    return request<{ inquiry: AnyRecord; items: AnyRecord[] }>(`/api/purchase/inquiries/${id}`);
  },
  async saveInquiry(values: AnyRecord, id?: number) {
    const payload = {
      requestId: values.requestId,
      title: firstText(values.title, values.inquiryTitle),
      inquirer: firstText(values.inquirer, values.purchaser),
      deadlineDate: toDateString(values.deadlineDate ?? values.deadline),
      remarks: values.remarks ?? values.remark,
      items: values.items?.length ? values.items : [makeLineItem(values)]
    };
    return request<any>(`/api/purchase/inquiries${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
  },
  completeInquiry: (id: number) => request<any>(`/api/purchase/inquiries/${id}/complete`, { method: 'POST' }),
  cancelInquiry: (id: number) => request<any>(`/api/purchase/inquiries/${id}/cancel`, { method: 'POST' }),
  deleteInquiry: (id: number) => request<any>(`/api/purchase/inquiries/${id}`, { method: 'DELETE' }),

  async listComparisons() {
    return request<any[]>('/api/purchase/comparisons');
  },
  async saveComparison(values: AnyRecord, id?: number) {
    const payload = {
      inquiryId: idValue(values.inquiryId),
      title: firstText(values.title, values.comparisonTitle),
      comparer: firstText(values.comparer, values.purchaser),
      selectedQuotationId: values.selectedQuotationId,
      selectionReason: values.selectionReason,
      remarks: values.remarks ?? values.remark
    };
    return request<any>(`/api/purchase/comparisons${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
  },
  completeComparison: (id: number, selectedQuotationId?: number, selectionReason = '') =>
    request<any>(`/api/purchase/comparisons/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ selectedQuotationId, selectionReason })
    }),
  cancelComparison: (id: number) => request<any>(`/api/purchase/comparisons/${id}/cancel`, { method: 'POST' }),
  deleteComparison: (id: number) => request<any>(`/api/purchase/comparisons/${id}`, { method: 'DELETE' }),

  async listSupplierQuotations() {
    return request<any[]>('/api/purchase/quotations');
  },
  async getSupplierQuotation(id: number) {
    return request<{ quotation: AnyRecord; items: AnyRecord[] }>(`/api/purchase/quotations/${id}`);
  },
  async saveSupplierQuotation(values: AnyRecord, id?: number) {
    const payload = {
      inquiryId: idValue(values.inquiryId),
      supplierName: values.supplierName,
      supplierContact: firstText(values.supplierContact, values.contact),
      validUntil: toDateString(values.validUntil),
      includeTax: values.includeTax ?? false,
      paymentTerms: values.paymentTerms,
      deliveryTerms: values.deliveryTerms,
      remarks: values.remarks ?? values.remark,
      items: values.items?.length ? values.items : [makeLineItem(values)]
    };
    return request<any>(`/api/purchase/quotations${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
  },
  selectSupplierQuotation: (id: number) => request<any>(`/api/purchase/quotations/${id}/select`, { method: 'POST' }),
  rejectSupplierQuotation: (id: number) => request<any>(`/api/purchase/quotations/${id}/reject`, { method: 'POST' }),
  deleteSupplierQuotation: (id: number) => request<any>(`/api/purchase/quotations/${id}`, { method: 'DELETE' }),

  listPayables: () => request<any[]>('/api/purchase-payables'),
  processPayment: (id: number, paymentAmount: number) =>
    request<any>(`/api/purchase-payables/${id}/payment?paymentAmount=${paymentAmount}`, { method: 'POST' }),
  updatePayable: (id: number, values: AnyRecord) =>
    request<any>(`/api/purchase-payables/${id}`, { method: 'PUT', body: JSON.stringify(values) }),
  deletePayable: (id: number) => request<any>(`/api/purchase-payables/${id}`, { method: 'DELETE' })
};

export const InventoryRealApi = {
  listReceipts: () => request<any[]>('/api/inventory-receipts'),
  getReceipt: (id: number) => request<{ receipt: AnyRecord; items: AnyRecord[] }>(`/api/inventory-receipts/${id}`),
  saveReceipt: (values: AnyRecord, id?: number) => request<any>(`/api/inventory-receipts${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify({
      receiptType: firstText(values.receiptType, 'OTHER'),
      warehouseId: idValue(values.warehouseId),
      supplierId: values.supplierId,
      purchaseOrderId: values.purchaseOrderId,
      operator: firstText(values.operator, values.receiver, '系统用户'),
      autoGeneratePayable: values.autoGeneratePayable ?? false,
      remarks: values.remarks ?? values.remark,
      items: values.items?.length ? values.items : [makeInventoryItem(values)]
    })
  }),
  approveReceipt: (id: number) => request<any>(`/api/inventory-receipts/${id}/approve`, { method: 'POST' }),
  processReceipt: (id: number) => request<any>(`/api/inventory-receipts/${id}/process`, { method: 'POST' }),
  cancelReceipt: (id: number) => request<any>(`/api/inventory-receipts/${id}/cancel`, { method: 'POST' }),
  deleteReceipt: (id: number) => request<any>(`/api/inventory-receipts/${id}`, { method: 'DELETE' }),

  listChecks: () => request<any[]>('/api/inventory-checks'),
  saveCheck: (values: AnyRecord, id?: number) => request<any>(`/api/inventory-checks${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify({
      warehouseId: idValue(values.warehouseId),
      checkType: firstText(values.checkType, 'FULL'),
      checker: firstText(values.checker, '系统用户'),
      remarks: values.remarks ?? values.remark,
      items: values.items || []
    })
  }),
  completeCheck: (id: number) => request<any>(`/api/inventory-checks/${id}/complete`, { method: 'POST' }),
  approveCheck: (id: number) => request<any>(`/api/inventory-checks/${id}/approve`, { method: 'POST' }),
  processCheck: (id: number) => request<any>(`/api/inventory-checks/${id}/process`, { method: 'POST' }),
  deleteCheck: (id: number) => request<any>(`/api/inventory-checks/${id}`, { method: 'DELETE' }),

  listMaterialRequisitions: () => request<any[]>('/api/material-requisitions'),
  saveMaterialRequisition: (values: AnyRecord, id?: number) => request<any>(`/api/material-requisitions${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify({
      bomId: values.bomId,
      productionOrderNo: values.productionOrderNo,
      department: values.department,
      applicant: firstText(values.applicant, values.requester),
      productionQuantity: numberValue(values.productionQuantity, 1),
      warehouseId: idValue(values.warehouseId),
      remarks: values.remarks ?? values.remark,
      items: values.items || [{ productId: idValue(values.productId), requiredQuantity: numberValue(values.requestQty, 1), unit: firstText(values.unit, '件') }]
    })
  }),
  approveMaterialRequisition: (id: number) => request<any>(`/api/material-requisitions/${id}/approve`, { method: 'POST' }),
  issueMaterialRequisition: (id: number) => request<any>(`/api/material-requisitions/${id}/issue`, { method: 'POST' }),
  cancelMaterialRequisition: (id: number) => request<any>(`/api/material-requisitions/${id}/cancel`, { method: 'POST' }),
  deleteMaterialRequisition: (id: number) => request<any>(`/api/material-requisitions/${id}`, { method: 'DELETE' }),

  listMaterialReturns: () => request<any[]>('/api/material-returns'),
  saveMaterialReturn: (values: AnyRecord, id?: number) => request<any>(`/api/material-returns${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify({
      requisitionId: values.requisitionId,
      productionOrderNo: values.productionOrderNo,
      department: values.department,
      returner: firstText(values.returner, values.requester),
      warehouseId: idValue(values.warehouseId),
      returnReason: firstText(values.returnReason, values.reason),
      remarks: values.remarks ?? values.remark,
      items: values.items || [{ productId: idValue(values.productId), returnQuantity: numberValue(values.returnQty, 1), unit: firstText(values.unit, '件') }]
    })
  }),
  approveMaterialReturn: (id: number) => request<any>(`/api/material-returns/${id}/approve`, { method: 'POST' }),
  processMaterialReturn: (id: number) => request<any>(`/api/material-returns/${id}/process`, { method: 'POST' }),
  cancelMaterialReturn: (id: number) => request<any>(`/api/material-returns/${id}/cancel`, { method: 'POST' }),
  deleteMaterialReturn: (id: number) => request<any>(`/api/material-returns/${id}`, { method: 'DELETE' }),

  listProductReceipts: () => request<any[]>('/api/product-receipts'),
  saveProductReceipt: (values: AnyRecord, id?: number) => request<any>(`/api/product-receipts${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify({
      productionOrderNo: values.productionOrderNo,
      receiptType: firstText(values.receiptType, 'OTHER'),
      warehouseId: idValue(values.warehouseId),
      operator: firstText(values.operator, '系统用户'),
      remarks: values.remarks ?? values.remark,
      items: values.items || [makeInventoryItem(values)]
    })
  }),
  approveProductReceipt: (id: number) => request<any>(`/api/product-receipts/${id}/approve`, { method: 'POST' }),
  processProductReceipt: (id: number) => request<any>(`/api/product-receipts/${id}/process`, { method: 'POST' }),
  cancelProductReceipt: (id: number) => request<any>(`/api/product-receipts/${id}/cancel`, { method: 'POST' }),
  deleteProductReceipt: (id: number) => request<any>(`/api/product-receipts/${id}`, { method: 'DELETE' }),

  listProductAssemblies: () => request<any[]>('/api/product-assemblies'),
  saveProductAssembly: (values: AnyRecord, id?: number) => request<any>(`/api/product-assemblies${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify({
      bomId: idValue(values.bomId),
      assemblyQuantity: numberValue(values.assemblyQuantity ?? values.quantity, 1),
      warehouseId: idValue(values.warehouseId),
      operator: firstText(values.operator, '系统用户'),
      remarks: values.remarks ?? values.remark
    })
  }),
  approveProductAssembly: (id: number) => request<any>(`/api/product-assemblies/${id}/approve`, { method: 'POST' }),
  processProductAssembly: (id: number) => request<any>(`/api/product-assemblies/${id}/process`, { method: 'POST' }),
  cancelProductAssembly: (id: number) => request<any>(`/api/product-assemblies/${id}/cancel`, { method: 'POST' }),
  deleteProductAssembly: (id: number) => request<any>(`/api/product-assemblies/${id}`, { method: 'DELETE' }),

  listProductDisassemblies: () => request<any[]>('/api/product-disassemblies'),
  saveProductDisassembly: (values: AnyRecord, id?: number) => request<any>(`/api/product-disassemblies${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify({
      bomId: idValue(values.bomId),
      disassemblyQuantity: numberValue(values.disassemblyQuantity ?? values.quantity, 1),
      warehouseId: idValue(values.warehouseId),
      operator: firstText(values.operator, '系统用户'),
      remarks: values.remarks ?? values.remark
    })
  }),
  approveProductDisassembly: (id: number) => request<any>(`/api/product-disassemblies/${id}/approve`, { method: 'POST' }),
  processProductDisassembly: (id: number) => request<any>(`/api/product-disassemblies/${id}/process`, { method: 'POST' }),
  cancelProductDisassembly: (id: number) => request<any>(`/api/product-disassemblies/${id}/cancel`, { method: 'POST' }),
  deleteProductDisassembly: (id: number) => request<any>(`/api/product-disassemblies/${id}`, { method: 'DELETE' }),

  listSerialInventory: () => request<any[]>('/api/serial-number-inventory/status/IN_STOCK'),
  serialTransactions: (serialNumber: string) => request<any[]>(`/api/serial-number-inventory/transactions/serial/${encodeURIComponent(serialNumber)}`),
  listSerialReceipts: () => request<any[]>('/api/serial-number-receipts'),
  saveSerialReceipt: (values: AnyRecord, id?: number) => request<any>(`/api/serial-number-receipts${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify({
      receiptType: firstText(values.receiptType, 'OTHER_SN'),
      warehouseId: idValue(values.warehouseId),
      supplierId: values.supplierId,
      purchaseOrderId: values.purchaseOrderId,
      operator: firstText(values.operator, '系统用户'),
      autoGeneratePayable: values.autoGeneratePayable ?? false,
      remarks: values.remarks ?? values.remark,
      items: values.items || [{
        productId: idValue(values.productId),
        serialNumber: firstText(values.serialNumber, `SN${Date.now()}`),
        unitPrice: numberValue(values.unitPrice, 0),
        qualityStatus: values.qualityStatus ?? 'QUALIFIED'
      }]
    })
  }),
  approveSerialReceipt: (id: number) => request<any>(`/api/serial-number-receipts/${id}/approve`, { method: 'POST' }),
  processSerialReceipt: (id: number) => request<any>(`/api/serial-number-receipts/${id}/process`, { method: 'POST' }),
  cancelSerialReceipt: (id: number) => request<any>(`/api/serial-number-receipts/${id}/cancel`, { method: 'POST' }),
  deleteSerialReceipt: (id: number) => request<any>(`/api/serial-number-receipts/${id}`, { method: 'DELETE' })
};

export const RealResourceUtils = {
  exportCsv,
  toDateString,
  request
};
