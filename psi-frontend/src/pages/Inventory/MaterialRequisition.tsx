import React from 'react';
import InventoryResourcePage from './InventoryResourcePage';
import { InventoryRealApi } from '../../services/realResourceService';

const MaterialRequisition: React.FC = () => (
  <InventoryResourcePage
    title="物料领用"
    rowNoKey="requisitionNo"
    rowNoPrefix="MR"
    list={InventoryRealApi.listMaterialRequisitions}
    save={InventoryRealApi.saveMaterialRequisition}
    remove={InventoryRealApi.deleteMaterialRequisition}
    actions={[
      { label: '审批', statuses: ['PENDING'], action: InventoryRealApi.approveMaterialRequisition },
      { label: '发料', statuses: ['APPROVED'], action: InventoryRealApi.issueMaterialRequisition },
      { label: '取消', statuses: ['PENDING', 'APPROVED'], action: InventoryRealApi.cancelMaterialRequisition }
    ]}
    fields={[
      { name: 'productionOrderNo', label: '生产订单号' },
      { name: 'department', label: '部门', required: true },
      { name: 'applicant', label: '申请人', required: true },
      { name: 'warehouseId', label: '仓库ID', type: 'number', required: true },
      { name: 'productId', label: '物料ID', type: 'number', required: true },
      { name: 'requestQty', label: '领用数量', type: 'number', required: true },
      { name: 'remarks', label: '备注', type: 'textarea' }
    ]}
  />
);

export default MaterialRequisition;
