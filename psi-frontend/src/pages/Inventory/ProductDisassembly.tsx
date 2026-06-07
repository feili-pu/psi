import React from 'react';
import InventoryResourcePage from './InventoryResourcePage';
import { InventoryRealApi } from '../../services/realResourceService';

const ProductDisassembly: React.FC = () => (
  <InventoryResourcePage
    title="产品拆解"
    rowNoKey="disassemblyNo"
    rowNoPrefix="PD"
    list={InventoryRealApi.listProductDisassemblies}
    save={InventoryRealApi.saveProductDisassembly}
    remove={InventoryRealApi.deleteProductDisassembly}
    actions={[
      { label: '审批', statuses: ['PENDING'], action: InventoryRealApi.approveProductDisassembly },
      { label: '拆解处理', statuses: ['APPROVED'], action: InventoryRealApi.processProductDisassembly },
      { label: '取消', statuses: ['PENDING', 'APPROVED'], action: InventoryRealApi.cancelProductDisassembly }
    ]}
    fields={[
      { name: 'bomId', label: 'BOM ID', type: 'number', required: true },
      { name: 'disassemblyQuantity', label: '拆解数量', type: 'number', required: true },
      { name: 'warehouseId', label: '仓库ID', type: 'number', required: true },
      { name: 'operator', label: '经办人', required: true },
      { name: 'remarks', label: '备注', type: 'textarea' }
    ]}
  />
);

export default ProductDisassembly;
