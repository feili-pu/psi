package com.lifei.psi.service;

import com.lifei.psi.entity.InventoryReceipt;
import com.lifei.psi.entity.InventoryReceiptItem;
import com.lifei.psi.entity.PurchasePayable;
import com.lifei.psi.mapper.InventoryReceiptMapper;
import com.lifei.psi.mapper.InventoryReceiptItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class InventoryReceiptService {

    @Autowired
    private InventoryReceiptMapper receiptMapper;

    @Autowired
    private InventoryReceiptItemMapper receiptItemMapper;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private PurchasePayableService payableService;

    // 获取所有库存入库单
    public List<InventoryReceipt> getAllReceipts() {
        return receiptMapper.findAll();
    }

    // 根据ID获取库存入库单
    public InventoryReceipt getReceiptById(Long id) {
        return receiptMapper.findById(id);
    }

    // 获取入库明细
    public List<InventoryReceiptItem> getReceiptItems(Long receiptId) {
        return receiptItemMapper.findByReceiptId(receiptId);
    }

    // 根据入库类型查询
    public List<InventoryReceipt> getReceiptsByType(String receiptType) {
        return receiptMapper.findByReceiptType(receiptType);
    }

    // 根据操作员查询
    public List<InventoryReceipt> getReceiptsByOperator(String operator) {
        return receiptMapper.findByOperator(operator);
    }

    // 根据状态查询
    public List<InventoryReceipt> getReceiptsByStatus(String status) {
        return receiptMapper.findByStatus(status);
    }

    // 根据仓库查询
    public List<InventoryReceipt> getReceiptsByWarehouse(Long warehouseId) {
        return receiptMapper.findByWarehouse(warehouseId);
    }

    // 根据供应商查询
    public List<InventoryReceipt> getReceiptsBySupplier(Long supplierId) {
        return receiptMapper.findBySupplier(supplierId);
    }

    // 创建库存入库单
    @Transactional
    public InventoryReceipt createReceipt(InventoryReceipt receipt, List<InventoryReceiptItem> items) {
        // 生成入库单号
        receipt.setReceiptNo(generateReceiptNo(receipt.getReceiptType()));
        receipt.setReceiptDate(LocalDateTime.now());
        receipt.setCreatedTime(LocalDateTime.now());
        receipt.setUpdatedTime(LocalDateTime.now());
        
        // 计算总数量和总金额
        BigDecimal totalQuantity = BigDecimal.ZERO;
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        if (items != null && !items.isEmpty()) {
            for (InventoryReceiptItem item : items) {
                totalQuantity = totalQuantity.add(item.getQuantity());
                if (item.getUnitPrice() != null) {
                    item.setTotalAmount(item.getQuantity().multiply(item.getUnitPrice()));
                    totalAmount = totalAmount.add(item.getTotalAmount());
                }
            }
        }
        
        receipt.setTotalQuantity(totalQuantity);
        receipt.setTotalAmount(totalAmount);
        
        // 插入入库单
        receiptMapper.insert(receipt);
        
        // 插入明细
        if (items != null && !items.isEmpty()) {
            for (InventoryReceiptItem item : items) {
                item.setReceiptId(receipt.getId());
                receiptItemMapper.insert(item);
            }
        }
        
        return receipt;
    }

    // 更新库存入库单
    @Transactional
    public InventoryReceipt updateReceipt(InventoryReceipt receipt, List<InventoryReceiptItem> items) {
        receipt.setUpdatedTime(LocalDateTime.now());
        
        // 计算总数量和总金额
        BigDecimal totalQuantity = BigDecimal.ZERO;
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        if (items != null && !items.isEmpty()) {
            for (InventoryReceiptItem item : items) {
                totalQuantity = totalQuantity.add(item.getQuantity());
                if (item.getUnitPrice() != null) {
                    item.setTotalAmount(item.getQuantity().multiply(item.getUnitPrice()));
                    totalAmount = totalAmount.add(item.getTotalAmount());
                }
            }
        }
        
        receipt.setTotalQuantity(totalQuantity);
        receipt.setTotalAmount(totalAmount);
        
        // 更新入库单
        receiptMapper.update(receipt);
        
        // 删除原有明细
        receiptItemMapper.deleteByReceiptId(receipt.getId());
        
        // 插入新明细
        if (items != null && !items.isEmpty()) {
            for (InventoryReceiptItem item : items) {
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
        InventoryReceipt receipt = receiptMapper.findById(id);
        if (receipt == null || !"APPROVED".equals(receipt.getStatus())) {
            return false;
        }
        
        List<InventoryReceiptItem> items = receiptItemMapper.findByReceiptId(id);
        String receiptType = receipt.getReceiptType();
        
        // 根据入库类型处理库存
        for (InventoryReceiptItem item : items) {
            boolean success;
            
            if ("PURCHASE_RETURN".equals(receiptType)) {
                // 采购退货出库 - 出库操作
                success = inventoryService.issueInventory(
                    receipt.getWarehouseId(), 
                    item.getProductId(), 
                    item.getQuantity(),
                    receiptType,
                    receipt.getReceiptNo(),
                    receipt.getOperator()
                );
            } else {
                // 其他类型都是入库操作
                success = inventoryService.receiveInventory(
                    receipt.getWarehouseId(), 
                    item.getProductId(), 
                    item.getQuantity(),
                    item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO,
                    receiptType,
                    receipt.getReceiptNo(),
                    receipt.getOperator()
                );
            }
            
            if (!success) {
                throw new RuntimeException("库存处理失败: " + item.getProductId());
            }
        }
        
        // 自动生成应付款（采购入库和采购退货）
        if (receipt.getAutoGeneratePayable() && !receipt.getPayableGenerated() && 
            ("PURCHASE".equals(receiptType) || "PURCHASE_RETURN".equals(receiptType))) {
            generatePayable(receipt);
        }
        
        return updateReceiptStatus(id, "RECEIVED");
    }

    // 生成应付款
    @Transactional
    public void generatePayable(InventoryReceipt receipt) {
        if (receipt.getSupplierId() == null || receipt.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }
        
        String payableType = "PURCHASE_RETURN".equals(receipt.getReceiptType()) ? "RED_LETTER" : "NORMAL";
        BigDecimal amount = "PURCHASE_RETURN".equals(receipt.getReceiptType()) ? 
            receipt.getTotalAmount().negate() : receipt.getTotalAmount();
        
        PurchasePayable payable = new PurchasePayable(receipt.getSupplierId(), amount, payableType);
        payable.setPurchaseOrderId(receipt.getPurchaseOrderId());
        payable.setReceiptId(receipt.getId());
        
        payableService.createPayable(payable);
        
        // 更新入库单应付款生成状态
        receiptMapper.updatePayableGenerated(receipt.getId(), true);
    }

    // 更新入库状态
    public boolean updateReceiptStatus(Long id, String status) {
        return receiptMapper.updateStatus(id, status) > 0;
    }

    // 取消入库
    public boolean cancelReceipt(Long id) {
        return updateReceiptStatus(id, "CANCELLED");
    }

    // 删除库存入库单
    @Transactional
    public boolean deleteReceipt(Long id) {
        // 先删除明细
        receiptItemMapper.deleteByReceiptId(id);
        // 再删除主表
        return receiptMapper.deleteById(id) > 0;
    }

    // 生成入库单号
    private String generateReceiptNo(String receiptType) {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix;
        
        switch (receiptType) {
            case "PURCHASE":
                prefix = "PI";
                break;
            case "PURCHASE_RETURN":
                prefix = "PR";
                break;
            case "INVENTORY_GAIN":
                prefix = "IG";
                break;
            case "WEIGHT_GAIN":
                prefix = "WG";
                break;
            default:
                prefix = "IR";
                break;
        }
        
        return prefix + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }
}