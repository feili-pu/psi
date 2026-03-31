package com.lifei.psi.service;

import com.lifei.psi.entity.InventoryTransaction;
import com.lifei.psi.mapper.InventoryTransactionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class InventoryTransactionService {

    @Autowired
    private InventoryTransactionMapper transactionMapper;

    // 记录库存流水
    public void recordTransaction(Long warehouseId, Long productId, String transactionType, 
                                String businessType, BigDecimal quantity, BigDecimal unitCost,
                                String referenceNo, BigDecimal balanceQuantity, String operator) {
        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setTransactionNo(generateTransactionNo());
        transaction.setWarehouseId(warehouseId);
        transaction.setProductId(productId);
        transaction.setTransactionType(transactionType);
        transaction.setBusinessType(businessType);
        transaction.setQuantity(quantity);
        transaction.setUnitCost(unitCost);
        transaction.setTotalCost(quantity.multiply(unitCost));
        transaction.setReferenceNo(referenceNo);
        transaction.setBalanceQuantity(balanceQuantity);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setOperator(operator);
        transaction.setCreatedTime(LocalDateTime.now());
        
        transactionMapper.insert(transaction);
    }

    // 获取库存流水记录
    public List<InventoryTransaction> getTransactionsByProduct(Long warehouseId, Long productId) {
        return transactionMapper.findByWarehouseAndProduct(warehouseId, productId);
    }

    // 根据业务类型查询
    public List<InventoryTransaction> getTransactionsByBusinessType(String businessType) {
        return transactionMapper.findByBusinessType(businessType);
    }

    // 根据日期范围查询
    public List<InventoryTransaction> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionMapper.findByDateRange(startDate, endDate);
    }

    // 生成流水号
    private String generateTransactionNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "IT" + dateStr + String.format("%03d", System.currentTimeMillis() % 1000);
    }
}