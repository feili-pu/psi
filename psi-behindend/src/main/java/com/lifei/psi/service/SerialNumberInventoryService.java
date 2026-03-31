package com.lifei.psi.service;

import com.lifei.psi.entity.SerialNumberInventory;
import com.lifei.psi.entity.SerialNumberTransaction;
import com.lifei.psi.mapper.SerialNumberInventoryMapper;
import com.lifei.psi.mapper.SerialNumberTransactionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SerialNumberInventoryService {

    @Autowired
    private SerialNumberInventoryMapper inventoryMapper;

    @Autowired
    private SerialNumberTransactionMapper transactionMapper;

    // 根据序列号获取库存
    public SerialNumberInventory getInventoryBySerialNumber(String serialNumber) {
        return inventoryMapper.findBySerialNumber(serialNumber);
    }

    // 根据仓库和产品获取库存列表
    public List<SerialNumberInventory> getInventoryByWarehouseAndProduct(Long warehouseId, Long productId) {
        return inventoryMapper.findByWarehouseAndProduct(warehouseId, productId);
    }

    // 根据仓库获取库存列表
    public List<SerialNumberInventory> getInventoryByWarehouse(Long warehouseId) {
        return inventoryMapper.findByWarehouse(warehouseId);
    }

    // 根据状态获取库存列表
    public List<SerialNumberInventory> getInventoryByStatus(String status) {
        return inventoryMapper.findByStatus(status);
    }

    // 根据批次号获取库存列表
    public List<SerialNumberInventory> getInventoryByBatchNo(String batchNo) {
        return inventoryMapper.findByBatchNo(batchNo);
    }

    // 统计在库数量
    public int countInStockByWarehouseAndProduct(Long warehouseId, Long productId) {
        return inventoryMapper.countInStockByWarehouseAndProduct(warehouseId, productId);
    }

    // 检查序列号是否存在
    public boolean checkSerialNumberExists(String serialNumber) {
        return inventoryMapper.findBySerialNumber(serialNumber) != null;
    }

    // 检查序列号是否可用（在库状态）
    public boolean checkSerialNumberAvailable(String serialNumber) {
        SerialNumberInventory inventory = inventoryMapper.findBySerialNumber(serialNumber);
        return inventory != null && "IN_STOCK".equals(inventory.getStatus());
    }

    // 序列号入库
    @Transactional
    public boolean receiveSerialNumber(Long warehouseId, Long productId, String serialNumber, 
                                     BigDecimal unitCost, String businessType, String referenceNo, String operator) {
        // 检查序列号是否已存在
        if (checkSerialNumberExists(serialNumber)) {
            throw new RuntimeException("序列号已存在: " + serialNumber);
        }
        
        // 创建库存记录
        SerialNumberInventory inventory = new SerialNumberInventory(warehouseId, productId, serialNumber);
        inventory.setUnitCost(unitCost);
        inventory.setInDate(LocalDateTime.now());
        inventory.setCreatedTime(LocalDateTime.now());
        inventory.setUpdatedTime(LocalDateTime.now());
        
        inventoryMapper.insert(inventory);
        
        // 记录流水
        recordTransaction(warehouseId, productId, serialNumber, "IN", businessType, 
                        referenceNo, unitCost, null, "IN_STOCK", operator);
        
        return true;
    }

    // 序列号出库
    @Transactional
    public boolean issueSerialNumber(String serialNumber, String businessType, String referenceNo, String operator) {
        SerialNumberInventory inventory = inventoryMapper.findBySerialNumber(serialNumber);
        if (inventory == null) {
            throw new RuntimeException("序列号不存在: " + serialNumber);
        }
        
        if (!"IN_STOCK".equals(inventory.getStatus())) {
            throw new RuntimeException("序列号状态不可出库: " + serialNumber + ", 当前状态: " + inventory.getStatus());
        }
        
        // 更新状态为出库
        String oldStatus = inventory.getStatus();
        inventory.setStatus("OUT_STOCK");
        inventory.setOutDate(LocalDateTime.now());
        inventory.setUpdatedTime(LocalDateTime.now());
        
        inventoryMapper.update(inventory);
        
        // 记录流水
        recordTransaction(inventory.getWarehouseId(), inventory.getProductId(), serialNumber, "OUT", businessType, 
                        referenceNo, inventory.getUnitCost(), oldStatus, "OUT_STOCK", operator);
        
        return true;
    }

    // 更新序列号状态
    @Transactional
    public boolean updateSerialNumberStatus(String serialNumber, String newStatus, String businessType, 
                                          String referenceNo, String operator) {
        SerialNumberInventory inventory = inventoryMapper.findBySerialNumber(serialNumber);
        if (inventory == null) {
            throw new RuntimeException("序列号不存在: " + serialNumber);
        }
        
        String oldStatus = inventory.getStatus();
        if (oldStatus.equals(newStatus)) {
            return true; // 状态相同，无需更新
        }
        
        // 更新状态
        LocalDateTime now = LocalDateTime.now();
        if ("OUT_STOCK".equals(newStatus) && inventory.getOutDate() == null) {
            inventory.setOutDate(now);
        }
        
        inventory.setStatus(newStatus);
        inventory.setUpdatedTime(now);
        inventoryMapper.update(inventory);
        
        // 记录流水
        String transactionType = "OUT_STOCK".equals(newStatus) ? "OUT" : "IN";
        recordTransaction(inventory.getWarehouseId(), inventory.getProductId(), serialNumber, transactionType, 
                        businessType, referenceNo, inventory.getUnitCost(), oldStatus, newStatus, operator);
        
        return true;
    }

    // 删除序列号库存
    @Transactional
    public boolean deleteSerialNumber(String serialNumber, String operator) {
        SerialNumberInventory inventory = inventoryMapper.findBySerialNumber(serialNumber);
        if (inventory == null) {
            return false;
        }
        
        // 记录删除流水
        recordTransaction(inventory.getWarehouseId(), inventory.getProductId(), serialNumber, "OUT", "DELETE", 
                        null, inventory.getUnitCost(), inventory.getStatus(), "DELETED", operator);
        
        return inventoryMapper.deleteBySerialNumber(serialNumber) > 0;
    }

    // 记录序列号流水
    @Transactional
    public void recordTransaction(Long warehouseId, Long productId, String serialNumber, String transactionType,
                                String businessType, String referenceNo, BigDecimal unitCost, 
                                String fromStatus, String toStatus, String operator) {
        SerialNumberTransaction transaction = new SerialNumberTransaction();
        transaction.setTransactionNo(generateTransactionNo());
        transaction.setWarehouseId(warehouseId);
        transaction.setProductId(productId);
        transaction.setSerialNumber(serialNumber);
        transaction.setTransactionType(transactionType);
        transaction.setBusinessType(businessType);
        transaction.setReferenceNo(referenceNo);
        transaction.setUnitCost(unitCost);
        transaction.setFromStatus(fromStatus);
        transaction.setToStatus(toStatus);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setOperator(operator);
        transaction.setCreatedTime(LocalDateTime.now());
        
        transactionMapper.insert(transaction);
    }

    // 获取序列号流水记录
    public List<SerialNumberTransaction> getTransactionsBySerialNumber(String serialNumber) {
        return transactionMapper.findBySerialNumber(serialNumber);
    }

    // 根据业务类型获取流水记录
    public List<SerialNumberTransaction> getTransactionsByBusinessType(String businessType) {
        return transactionMapper.findByBusinessType(businessType);
    }

    // 根据日期范围获取流水记录
    public List<SerialNumberTransaction> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionMapper.findByDateRange(startDate, endDate);
    }

    // 生成流水号
    private String generateTransactionNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "SNT" + dateStr + String.format("%03d", System.currentTimeMillis() % 1000);
    }
}