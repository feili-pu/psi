import React from 'react';
import InventoryResourcePage from './InventoryResourcePage';
import { InventoryRealApi } from '../../services/realResourceService';

const InventoryCheck: React.FC = () => (
  <InventoryResourcePage
    title="库存盘点"
    rowNoKey="checkNo"
    rowNoPrefix="IC"
    list={InventoryRealApi.listChecks}
    save={InventoryRealApi.saveCheck}
    remove={InventoryRealApi.deleteCheck}
    actions={[
      { label: '完成盘点', statuses: ['PENDING'], action: InventoryRealApi.completeCheck },
      { label: '审批', statuses: ['COMPLETED'], action: InventoryRealApi.approveCheck },
      { label: '处理差异', statuses: ['APPROVED'], action: InventoryRealApi.processCheck }
    ]}
    fields={[
      { name: 'warehouseId', label: '仓库ID', type: 'number', required: true },
      { name: 'checkType', label: '盘点类型', type: 'select', required: true, options: [
        { label: '全盘', value: 'FULL' },
        { label: '抽盘', value: 'PARTIAL' },
        { label: '循环盘点', value: 'CYCLE' },
        { label: '临时盘点', value: 'SPOT' }
      ] },
      { name: 'checker', label: '盘点人', required: true },
      { name: 'remarks', label: '备注', type: 'textarea' }
    ]}
  />
);

export default InventoryCheck;
