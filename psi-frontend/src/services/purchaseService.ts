// 采购管理相关的 API 服务
import AuthService from './authService';

// 采购订单接口
export interface PurchaseOrder {
  id?: number;
  orderNo?: string;
  requestId?: number;
  supplierName: string;
  supplierContact: string;
  purchaser: string;
  orderDate?: string;
  expectedDate: string;
  totalAmount?: number;
  includeTax: boolean;
  taxRate?: number;
  paymentTerms?: string;
  deliveryAddress?: string;
  status?: string;
  remarks?: string;
}

// 采购订单明细接口
export interface PurchaseOrderItem {
  id?: number;
  orderId?: number;
  productName: string;
  productCode?: string;
  specification?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount?: number;
  receivedQty?: number;
  remainingQty?: number;
  remarks?: string;
}

// 采购订单请求接口
export interface PurchaseOrderRequest {
  requestId?: number;
  supplierName: string;
  supplierContact: string;
  purchaser: string;
  expectedDate: string;
  includeTax: boolean;
  taxRate?: number;
  paymentTerms?: string;
  deliveryAddress?: string;
  remarks?: string;
  items: PurchaseOrderItem[];
}

// 采购申请接口
export interface PurchaseRequest {
  id?: number;
  requestNo?: string;
  applicant: string;
  department: string;
  requestDate?: string;
  expectedDate: string;
  totalAmount?: number;
  status?: string;
  remarks?: string;
}

// 采购申请明细接口
export interface PurchaseRequestItem {
  id?: number;
  requestId?: number;
  productName: string;
  productCode?: string;
  specification?: string;
  unit: string;
  quantity: number;
  estimatedPrice: number;
  amount?: number;
  purpose: string;
  remarks?: string;
}

// 采购申请请求接口
export interface PurchaseRequestRequest {
  applicant: string;
  department: string;
  expectedDate: string;
  remarks?: string;
  items: PurchaseRequestItem[];
}

// 供应商报价接口
export interface SupplierQuotation {
  id?: number;
  quotationNo?: string;
  supplierName: string;
  supplierContact: string;
  quotationDate?: string;
  validUntil?: string;
  totalAmount?: number;
  includeTax: boolean;
  taxRate?: number;
  status?: string;
  remarks?: string;
}

// 供应商报价明细接口
export interface SupplierQuotationItem {
  id?: number;
  quotationId?: number;
  productName: string;
  productCode?: string;
  specification?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount?: number;
  deliveryDays?: number;
  remarks?: string;
}

// 采购订单服务类
export class PurchaseOrderService {
  private static baseUrl = 'http://localhost:8080/api/purchase/orders';

  // 获取所有采购订单
  static async getAllOrders(): Promise<PurchaseOrder[]> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`获取采购订单列表失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据ID获取订单详情
  static async getOrderById(id: number): Promise<{ order: PurchaseOrder; items: PurchaseOrderItem[] }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`获取采购订单详情失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 创建采购订单
  static async createOrder(orderData: PurchaseOrderRequest): Promise<PurchaseOrder> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '创建采购订单失败');
    }
    
    return result.order;
  }

  // 从采购申请创建订单
  static async createOrderFromRequest(requestId: number, orderData: PurchaseOrderRequest): Promise<PurchaseOrder> {
    const response = await fetch(`${this.baseUrl}/from-request/${requestId}`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '从采购申请创建订单失败');
    }
    
    return result.order;
  }

  // 更新采购订单
  static async updateOrder(id: number, orderData: PurchaseOrderRequest): Promise<PurchaseOrder> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '更新采购订单失败');
    }
    
    return result.order;
  }

  // 删除采购订单
  static async deleteOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '删除采购订单失败');
    }
  }

  // 提交订单
  static async submitOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/confirm`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '确认订单失败');
    }
  }

  // 审批订单
  static async approveOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/start-production`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '开始生产失败');
    }
  }

  // 下单
  static async placeOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/ship`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '发货失败');
    }
  }

  // 收货
  static async receiveOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/receive`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '收货失败');
    }
  }

  // 完成订单
  static async completeOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/complete`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '完成订单失败');
    }
  }

  // 取消订单
  static async cancelOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/cancel`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '取消订单失败');
    }
  }

  // 根据供应商名称搜索
  static async searchBySupplier(supplierName: string): Promise<PurchaseOrder[]> {
    const response = await fetch(`${this.baseUrl}/search?supplierName=${encodeURIComponent(supplierName)}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`搜索采购订单失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据状态查询
  static async getOrdersByStatus(status: string): Promise<PurchaseOrder[]> {
    const response = await fetch(`${this.baseUrl}/status/${status}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`按状态查询采购订单失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据采购员查询
  static async getOrdersByPurchaser(purchaser: string): Promise<PurchaseOrder[]> {
    const response = await fetch(`${this.baseUrl}/purchaser/${encodeURIComponent(purchaser)}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`按采购员查询订单失败: ${response.statusText}`);
    }
    
    return await response.json();
  }
}

// 采购申请服务类
export class PurchaseRequestService {
  private static baseUrl = 'http://localhost:8080/api/purchase/requests';

  // 获取所有采购申请
  static async getAllRequests(): Promise<PurchaseRequest[]> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`获取采购申请列表失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据ID获取申请详情
  static async getRequestById(id: number): Promise<{ request: PurchaseRequest; items: PurchaseRequestItem[] }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`获取采购申请详情失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 创建采购申请
  static async createRequest(requestData: PurchaseRequestRequest): Promise<PurchaseRequest> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(requestData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '创建采购申请失败');
    }
    
    return result.request;
  }

  // 更新采购申请
  static async updateRequest(id: number, requestData: PurchaseRequestRequest): Promise<PurchaseRequest> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(requestData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '更新采购申请失败');
    }
    
    return result.request;
  }

  // 删除采购申请
  static async deleteRequest(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '删除采购申请失败');
    }
  }

  // 提交申请
  static async submitRequest(id: number): Promise<void> {
    await this.approveRequest(id);
  }

  // 审批申请
  static async approveRequest(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/approve`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '审批申请失败');
    }
  }

  // 拒绝申请
  static async rejectRequest(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/reject`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '拒绝申请失败');
    }
  }

  // 根据申请人搜索
  static async searchByApplicant(applicant: string): Promise<PurchaseRequest[]> {
    const response = await fetch(`${this.baseUrl}/applicant/${encodeURIComponent(applicant)}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`搜索采购申请失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据状态查询
  static async getRequestsByStatus(status: string): Promise<PurchaseRequest[]> {
    const response = await fetch(`${this.baseUrl}/status/${status}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`按状态查询采购申请失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据部门查询
  static async getRequestsByDepartment(department: string): Promise<PurchaseRequest[]> {
    const response = await fetch(`${this.baseUrl}/search?department=${encodeURIComponent(department)}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`按部门查询申请失败: ${response.statusText}`);
    }
    
    return await response.json();
  }
}

// 供应商报价服务类
export class SupplierQuotationService {
  private static baseUrl = 'http://localhost:8080/api/purchase/quotations';

  // 获取所有供应商报价
  static async getAllQuotations(): Promise<SupplierQuotation[]> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`获取供应商报价列表失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据ID获取报价详情
  static async getQuotationById(id: number): Promise<{ quotation: SupplierQuotation; items: SupplierQuotationItem[] }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`获取供应商报价详情失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 创建供应商报价
  static async createQuotation(quotationData: any): Promise<SupplierQuotation> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(quotationData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '创建供应商报价失败');
    }
    
    return result.quotation;
  }

  // 更新供应商报价
  static async updateQuotation(id: number, quotationData: any): Promise<SupplierQuotation> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(quotationData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '更新供应商报价失败');
    }
    
    return result.quotation;
  }

  // 删除供应商报价
  static async deleteQuotation(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '删除供应商报价失败');
    }
  }

  // 接受报价
  static async acceptQuotation(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/select`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '接受报价失败');
    }
  }

  // 拒绝报价
  static async rejectQuotation(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/reject`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '拒绝报价失败');
    }
  }

  // 根据供应商名称搜索
  static async searchBySupplier(supplierName: string): Promise<SupplierQuotation[]> {
    const response = await fetch(`${this.baseUrl}/search?supplierName=${encodeURIComponent(supplierName)}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`搜索供应商报价失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据状态查询
  static async getQuotationsByStatus(status: string): Promise<SupplierQuotation[]> {
    const response = await fetch(`${this.baseUrl}/status/${status}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`按状态查询供应商报价失败: ${response.statusText}`);
    }
    
    return await response.json();
  }
}

// 采购统计服务类
export class PurchaseStatisticsService {
  private static baseUrl = 'http://localhost:8080/api/purchase/statistics';

  // 获取采购仪表板数据
  static async getDashboardData(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/dashboard`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取采购仪表板数据失败');
    }
    
    return result.data;
  }

  // 获取采购执行情况报表
  static async getExecutionReport(startDate?: string, endDate?: string): Promise<any[]> {
    let url = `${this.baseUrl}/execution`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取采购执行情况报表失败');
    }
    
    return result.data;
  }

  // 获取采购成本分析
  static async getCostAnalysis(startDate?: string, endDate?: string): Promise<any> {
    let url = `${this.baseUrl}/cost-analysis`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取采购成本分析失败');
    }
    
    return result.data;
  }

  // 按供应商获取采购汇总
  static async getSummaryBySupplier(startDate?: string, endDate?: string): Promise<any[]> {
    let url = `${this.baseUrl}/summary/supplier`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取供应商采购汇总失败');
    }
    
    return result.data;
  }

  // 按部门获取采购汇总
  static async getSummaryByDepartment(startDate?: string, endDate?: string): Promise<any[]> {
    let url = `${this.baseUrl}/summary/department`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取部门采购汇总失败');
    }
    
    return result.data;
  }

  // 按采购员获取采购汇总
  static async getSummaryByPurchaser(startDate?: string, endDate?: string): Promise<any[]> {
    let url = `${this.baseUrl}/summary/purchaser`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取采购员采购汇总失败');
    }
    
    return result.data;
  }

  // 按产品获取采购汇总
  static async getSummaryByProduct(startDate?: string, endDate?: string): Promise<any[]> {
    let url = `${this.baseUrl}/summary/product`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取产品采购汇总失败');
    }
    
    return result.data;
  }
}
