package com.lifei.psi.service;

import com.lifei.psi.entity.Inventory;
import com.lifei.psi.mapper.InventoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class InventoryService {

    @Autowired
    private InventoryMapper inventoryMapper;

    @Autowired
    private InventoryTransactionService transactionService;

    // 获取库存信息
    public Inventory getInventory(Long warehouseId, Long productId) {
        return inventoryMapper.findByWarehouseAndProduct(warehouseId, productId);
    }

    // 获取单位成本
    public BigDecimal getUnitCost(Long warehouseId, Long productId) {
        Inventory inventory = getInventory(warehouseId, productId);
        return inventory != null ? inventory.getUnitCost() : BigDecimal.ZERO;
    }

    // 检查库存是否充足
    public boolean checkInventory(Long warehouseId, Long productId, BigDecimal requiredQuantity) {
        Inventory inventory = getInventory(warehouseId, productId);
        if (inventory == null) {
            return false;
        }
        return inventory.getAvailableQuantity().compareTo(requiredQuantity) >= 0;
    }

    // 出库
    @Transactional
    public boolean issueInventory(Long warehouseId, Long productId, BigDecimal quantity, 
                                String businessType, String referenceNo, String operator) {
        Inventory inventory = getInventory(warehouseId, productId);
        if (inventory == null || inventory.getAvailableQuantity().compareTo(quantity) < 0) {
            return false;
        }
        
        // 更新库存
        inventory.setQuantity(inventory.getQuantity().subtract(quantity));
        inventory.setAvailableQuantity(inventory.getAvailableQuantity().subtract(quantity));
        inventory.setTotalCost(inventory.getQuantity().multiply(inventory.getUnitCost()));
        inventory.setLastOutDate(LocalDateTime.now());
        inventory.setUpdatedTime(LocalDateTime.now());
        
        inventoryMapper.update(inventory);
        
        // 记录库存流水
        transactionService.recordTransaction(
            warehouseId, productId, "OUT", businessType, 
            quantity, inventory.getUnitCost(), referenceNo, 
            inventory.getQuantity(), operator
        );
        
        return true;
    }

    // 入库
    @Transactional
    public boolean receiveInventory(Long warehouseId, Long productId, BigDecimal quantity, 
                                  BigDecimal unitCost, String businessType, String referenceNo, String operator) {
        Inventory inventory = getInventory(warehouseId, productId);
        
        if (inventory == null) {
            // 创建新库存记录
            inventory = new Inventory(warehouseId, productId);
            inventory.setQuantity(quantity);
            inventory.setAvailableQuantity(quantity);
            inventory.setUnitCost(unitCost);
            inventory.setTotalCost(quantity.multiply(unitCost));
            inventory.setLastInDate(LocalDateTime.now());
            inventory.setCreatedTime(LocalDateTime.now());
            inventory.setUpdatedTime(LocalDateTime.now());
            
            inventoryMapper.insert(inventory);
        } else {
            // 更新现有库存 - 使用加权平均成本
            BigDecimal totalCost = inventory.getTotalCost().add(quantity.multiply(unitCost));
            BigDecimal totalQuantity = inventory.getQuantity().add(quantity);
            BigDecimal newUnitCost = totalQuantity.compareTo(BigDecimal.ZERO) > 0 ? 
                totalCost.divide(totalQuantity, 2, BigDecimal.ROUND_HALF_UP) : unitCost;
            
            inventory.setQuantity(totalQuantity);
            inventory.setAvailableQuantity(inventory.getAvailableQuantity().add(quantity));
            inventory.setUnitCost(newUnitCost);
            inventory.setTotalCost(totalCost);
            inventory.setLastInDate(LocalDateTime.now());
            inventory.setUpdatedTime(LocalDateTime.now());
            
            inventoryMapper.update(inventory);
        }
        
        // 记录库存流水
        transactionService.recordTransaction(
            warehouseId, productId, "IN", businessType, 
            quantity, unitCost, referenceNo, 
            inventory.getQuantity(), operator
        );
        
        return true;
    }
}