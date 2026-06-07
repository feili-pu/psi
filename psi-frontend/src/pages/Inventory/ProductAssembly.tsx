import React from 'react';
import InventoryResourcePage from './InventoryResourcePage';
import { InventoryRealApi } from '../../services/realResourceService';

const ProductAssembly: React.FC = () => (
  <InventoryResourcePage
    title="产品组装"
    rowNoKey="assemblyNo"
    rowNoPrefix="PA"
    list={InventoryRealApi.listProductAssemblies}
    save={InventoryRealApi.saveProductAssembly}
    remove={InventoryRealApi.deleteProductAssembly}
    actions={[
      { label: '审批', statuses: ['PENDING'], action: InventoryRealApi.approveProductAssembly },
      { label: '组装处理', statuses: ['APPROVED'], action: InventoryRealApi.processProductAssembly },
      { label: '取消', statuses: ['PENDING', 'APPROVED'], action: InventoryRealApi.cancelProductAssembly }
    ]}
    fields={[
      { name: 'bomId', label: 'BOM ID', type: 'number', required: true },
      { name: 'assemblyQuantity', label: '组装数量', type: 'number', required: true },
      { name: 'warehouseId', label: '仓库ID', type: 'number', required: true },
      { name: 'operator', label: '经办人', required: true },
      { name: 'remarks', label: '备注', type: 'textarea' }
    ]}
  />
);

export default ProductAssembly;
