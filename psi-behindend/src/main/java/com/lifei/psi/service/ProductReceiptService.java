package com.lifei.psi.service;

import com.lifei.psi.entity.ProductReceipt;
import com.lifei.psi.entity.ProductReceiptItem;
import com.lifei.psi.mapper.ProductReceiptMapper;
import com.lifei.psi.mapper.ProductReceiptItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ProductReceiptService {

    @Autowired
    private ProductReceiptMapper receiptMapper;

    @Autowired
    private ProductReceiptItemMapper receiptItemMapper;

    @Autowired
    private InventoryService inventoryService;

    // 获取所有产品入库单
    public List<ProductReceipt> getAllReceipts() {
        return receiptMapper.findAll();
    }

    // 根据ID获取产品入库单
    public ProductReceipt getReceiptById(Long id) {
        return receiptMapper.findById(id);
    }

    // 获取入库明细
    public List<ProductReceiptItem> getReceiptItems(Long receiptId) {
        return receiptItemMapper.findByReceiptId(receiptId);
    }

    // 根据入库类型查询
    public List<ProductReceipt> getReceiptsByType(String receiptType) {
        return receiptMapper.findByReceiptType(receiptType);
    }

    // 根据操作员查询
    public List<ProductReceipt> getReceiptsByOperator(String operator) {
        return receiptMapper.findByOperator(operator);
    }

    // 根据状态查询
    public List<ProductReceipt> getReceiptsByStatus(String status) {
        return receiptMapper.findByStatus(status);
    }

    // 根据仓库查询
    public List<ProductReceipt> getReceiptsByWarehouse(Long warehouseId) {
        return receiptMapper.findByWarehouse(warehouseId);
    }

    // 创建产品入库单
    @Transactional
    public ProductReceipt createReceipt(ProductReceipt receipt, List<ProductReceiptItem> items) {
        // 生成入库单号
        receipt.setReceiptNo(generateReceiptNo());
        if (isBlank(receipt.getStatus())) {
            receipt.setStatus("PENDING");
        }
        receipt.setReceiptDate(LocalDateTime.now());
        receipt.setCreatedTime(LocalDateTime.now());
        receipt.setUpdatedTime(LocalDateTime.now());
        
        // 计算总数量和总成本
        BigDecimal totalQuantity = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        
        if (items != null && !items.isEmpty()) {
            for (ProductReceiptItem item : items) {
                totalQuantity = totalQuantity.add(item.getQuantity());
                if (item.getUnitCost() != null) {
                    item.setTotalCost(item.getQuantity().multiply(item.getUnitCost()));
                    totalCost = totalCost.add(item.getTotalCost());
                }
            }
        }
        
        receipt.setTotalQuantity(totalQuantity);
        receipt.setTotalCost(totalCost);
        
        // 插入入库单
        receiptMapper.insert(receipt);
        
        // 插入明细
        if (items != null && !items.isEmpty()) {
            for (ProductReceiptItem item : items) {
                item.setReceiptId(receipt.getId());
                receiptItemMapper.insert(item);
            }
        }
        
        return receipt;
    }

    // 更新产品入库单
    @Transactional
    public ProductReceipt updateReceipt(ProductReceipt receipt, List<ProductReceiptItem> items) {
        receipt.setUpdatedTime(LocalDateTime.now());
        
        // 计算总数量和总成本
        BigDecimal totalQuantity = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        
        if (items != null && !items.isEmpty()) {
            for (ProductReceiptItem item : items) {
                totalQuantity = totalQuantity.add(item.getQuantity());
                if (item.getUnitCost() != null) {
                    item.setTotalCost(item.getQuantity().multiply(item.getUnitCost()));
                    totalCost = totalCost.add(item.getTotalCost());
                }
            }
        }
        
        receipt.setTotalQuantity(totalQuantity);
        receipt.setTotalCost(totalCost);
        
        // 更新入库单
        receiptMapper.update(receipt);
        
        // 删除原有明细
        receiptItemMapper.deleteByReceiptId(receipt.getId());
        
        // 插入新明细
        if (items != null && !items.isEmpty()) {
            for (ProductReceiptItem item : items) {
                item.setReceiptId(receipt.getId());
                receiptItemMapper.insert(item);
            }
        }
        
        return receipt;
    }

    // 审核入库单
    public boolean approveReceipt(Long id) {
        return updateReceiptStatus(id, "APPROVED");
    }

    // 入库处理
    @Transactional
    public boolean processReceipt(Long id) {
        ProductReceipt receipt = receiptMapper.findById(id);
        if (receipt == null || !"APPROVED".equals(receipt.getStatus())) {
            return false;
        }
        
        List<ProductReceiptItem> items = receiptItemMapper.findByReceiptId(id);
        
        // 产品入库
        for (ProductReceiptItem item : items) {
            boolean success = inventoryService.receiveInventory(
                receipt.getWarehouseId(), 
                item.getProductId(), 
                item.getQuantity(),
                item.getUnitCost(),
                "RECEIPT",
                receipt.getReceiptNo(),
                receipt.getOperator()
            );
            
            if (!success) {
                throw new RuntimeException("产品入库失败: " + item.getProductId());
            }
        }
        
        return updateReceiptStatus(id, "RECEIVED");
    }

    // 更新入库状态
    public boolean updateReceiptStatus(Long id, String status) {
        return receiptMapper.updateStatus(id, status) > 0;
    }

    // 取消入库
    public boolean cancelReceipt(Long id) {
        return updateReceiptStatus(id, "CANCELLED");
    }

    // 删除产品入库单
    @Transactional
    public boolean deleteReceipt(Long id) {
        // 先删除明细
        receiptItemMapper.deleteByReceiptId(id);
        // 再删除主表
        return receiptMapper.deleteById(id) > 0;
    }

    // 生成入库单号
    private String generateReceiptNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "PR" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
