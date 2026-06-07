import React from 'react';
import InventoryResourcePage from './InventoryResourcePage';
import { InventoryRealApi } from '../../services/realResourceService';

const ProductReceipt: React.FC = () => (
  <InventoryResourcePage
    title="产品入库"
    rowNoKey="receiptNo"
    rowNoPrefix="PR"
    list={InventoryRealApi.listProductReceipts}
    save={InventoryRealApi.saveProductReceipt}
    remove={InventoryRealApi.deleteProductReceipt}
    actions={[
      { label: '审批', statuses: ['PENDING'], action: InventoryRealApi.approveProductReceipt },
      { label: '入库处理', statuses: ['APPROVED'], action: InventoryRealApi.processProductReceipt },
      { label: '取消', statuses: ['PENDING', 'APPROVED'], action: InventoryRealApi.cancelProductReceipt }
    ]}
    fields={[
      { name: 'productionOrderNo', label: '生产订单号' },
      { name: 'receiptType', label: '入库类型', type: 'select', required: true, options: [
        { label: '生产入库', value: 'PRODUCTION' },
        { label: '返工入库', value: 'REWORK' },
        { label: '其他入库', value: 'OTHER' }
      ] },
      { name: 'warehouseId', label: '仓库ID', type: 'number', required: true },
      { name: 'operator', label: '经办人', required: true },
      { name: 'productId', label: '产品ID', type: 'number', required: true },
      { name: 'quantity', label: '数量', type: 'number', required: true },
      { name: 'unitCost', label: '单位成本', type: 'number' },
      { name: 'remarks', label: '备注', type: 'textarea' }
    ]}
  />
);

export default ProductReceipt;
