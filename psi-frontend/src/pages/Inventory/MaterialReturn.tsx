import React from 'react';
import InventoryResourcePage from './InventoryResourcePage';
import { InventoryRealApi } from '../../services/realResourceService';

const MaterialReturn: React.FC = () => (
  <InventoryResourcePage
    title="物料退库"
    rowNoKey="returnNo"
    rowNoPrefix="MRT"
    list={InventoryRealApi.listMaterialReturns}
    save={InventoryRealApi.saveMaterialReturn}
    remove={InventoryRealApi.deleteMaterialReturn}
    actions={[
      { label: '审批', statuses: ['PENDING'], action: InventoryRealApi.approveMaterialReturn },
      { label: '退库处理', statuses: ['APPROVED'], action: InventoryRealApi.processMaterialReturn },
      { label: '取消', statuses: ['PENDING', 'APPROVED'], action: InventoryRealApi.cancelMaterialReturn }
    ]}
    fields={[
      { name: 'requisitionId', label: '领用单ID', type: 'number' },
      { name: 'productionOrderNo', label: '生产订单号' },
      { name: 'department', label: '部门', required: true },
      { name: 'returner', label: '退库人', required: true },
      { name: 'warehouseId', label: '仓库ID', type: 'number', required: true },
      { name: 'productId', label: '物料ID', type: 'number', required: true },
      { name: 'returnQty', label: '退库数量', type: 'number', required: true },
      { name: 'returnReason', label: '退库原因', required: true },
      { name: 'remarks', label: '备注', type: 'textarea' }
    ]}
  />
);

export default MaterialReturn;
