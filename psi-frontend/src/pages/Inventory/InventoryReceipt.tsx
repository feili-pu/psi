import React from 'react';
import InventoryResourcePage from './InventoryResourcePage';
import { InventoryRealApi } from '../../services/realResourceService';

const InventoryReceipt: React.FC = () => (
  <InventoryResourcePage
    title="库存入库"
    rowNoKey="receiptNo"
    rowNoPrefix="IR"
    list={InventoryRealApi.listReceipts}
    get={InventoryRealApi.getReceipt}
    save={InventoryRealApi.saveReceipt}
    remove={InventoryRealApi.deleteReceipt}
    actions={[
      { label: '审批', statuses: ['PENDING'], action: InventoryRealApi.approveReceipt },
      { label: '入库处理', statuses: ['APPROVED'], action: InventoryRealApi.processReceipt },
      { label: '取消', statuses: ['PENDING', 'APPROVED'], action: InventoryRealApi.cancelReceipt }
    ]}
    fields={[
      { name: 'receiptType', label: '入库类型', type: 'select', required: true, options: [
        { label: '采购入库', value: 'PURCHASE' },
        { label: '退货入库', value: 'RETURN' },
        { label: '调拨入库', value: 'TRANSFER' },
        { label: '其他入库', value: 'OTHER' }
      ] },
      { name: 'warehouseId', label: '仓库ID', type: 'number', required: true },
      { name: 'supplierId', label: '供应商ID', type: 'number' },
      { name: 'purchaseOrderId', label: '采购订单ID', type: 'number' },
      { name: 'operator', label: '经办人', required: true },
      { name: 'productId', label: '产品ID', type: 'number', required: true },
      { name: 'quantity', label: '数量', type: 'number', required: true },
      { name: 'unitPrice', label: '单价', type: 'number' },
      { name: 'remarks', label: '备注', type: 'textarea' }
    ]}
  />
);

export default InventoryReceipt;
