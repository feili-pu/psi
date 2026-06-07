import React from 'react';
import InventoryResourcePage from './InventoryResourcePage';
import { InventoryRealApi } from '../../services/realResourceService';

const SerialInventory: React.FC = () => (
  <InventoryResourcePage
    title="序列号库存"
    rowNoKey="serialNumber"
    rowNoPrefix="SN"
    list={InventoryRealApi.listSerialInventory}
    fields={[]}
  />
);

export default SerialInventory;
