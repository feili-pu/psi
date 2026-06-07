import React from 'react';
import InventoryResourcePage from './InventoryResourcePage';
import { InventoryRealApi } from '../../services/realResourceService';

const SerialReceipt: React.FC = () => (
  <InventoryResourcePage
    title="序列号入库"
    rowNoKey="receiptNo"
    rowNoPrefix="SNR"
    list={InventoryRealApi.listSerialReceipts}
    save={InventoryRealApi.saveSerialReceipt}
    remove={InventoryRealApi.deleteSerialReceipt}
    actions={[
      { label: '审批', statuses: ['PENDING'], action: InventoryRealApi.approveSerialReceipt },
      { label: '入库处理', statuses: ['APPROVED'], action: InventoryRealApi.processSerialReceipt },
      { label: '取消', statuses: ['PENDING', 'APPROVED'], action: InventoryRealApi.cancelSerialReceipt }
    ]}
    fields={[
      { name: 'receiptType', label: '入库类型', type: 'select', required: true, options: [
        { label: '采购序列号入库', value: 'PURCHASE_SN' },
        { label: '生产序列号入库', value: 'PRODUCTION_SN' },
        { label: '其他序列号入库', value: 'OTHER_SN' }
      ] },
      { name: 'warehouseId', label: '仓库ID', type: 'number', required: true },
      { name: 'supplierId', label: '供应商ID', type: 'number' },
      { name: 'purchaseOrderId', label: '采购订单ID', type: 'number' },
      { name: 'operator', label: '经办人', required: true },
      { name: 'productId', label: '产品ID', type: 'number', required: true },
      { name: 'serialNumber', label: '序列号', required: true },
      { name: 'unitPrice', label: '单价', type: 'number' },
      { name: 'remarks', label: '备注', type: 'textarea' }
    ]}
  />
);

export default SerialReceipt;
