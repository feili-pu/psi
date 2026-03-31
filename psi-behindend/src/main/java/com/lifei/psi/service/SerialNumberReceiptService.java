package com.lifei.psi.service;

import com.lifei.psi.entity.PurchasePayable;
import com.lifei.psi.entity.SerialNumberReceipt;
import com.lifei.psi.entity.SerialNumberReceiptItem;
import com.lifei.psi.mapper.SerialNumberReceiptMapper;
import com.lifei.psi.mapper.SerialNumberReceiptItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SerialNumberReceiptService {

    @Autowired
    private SerialNumberReceiptMapper receiptMapper;

    @Autowired
    private SerialNumberReceiptItemMapper receiptItemMapper;

    @Autowired
    private SerialNumberInventoryService snInventoryService;

    @Autowired
    private PurchasePayableService payableService;

    // 获取所有序列号入库单
    public List<SerialNumberReceipt> getAllReceipts() {
        return receiptMapper.findAll();
    }

    // 根据ID获取序列号入库单
    public SerialNumberReceipt getReceiptById(Long id) {
        return receiptMapper.findById(id);
    }

    // 获取入库明细
    public List<SerialNumberReceiptItem> getReceiptItems(Long receiptId) {
        return receiptItemMapper.findByReceiptId(receiptId);
    }

    // 根据入库类型查询
    public List<SerialNumberReceipt> getReceiptsByType(String receiptType) {
        return receiptMapper.findByReceiptType(receiptType);
    }

    // 根据操作员查询
    public List<SerialNumberReceipt> getReceiptsByOperator(String operator) {
        return receiptMapper.findByOperator(operator);
    }

    // 根据状态查询
    public List<SerialNumberReceipt> getReceiptsByStatus(String status) {
        return receiptMapper.findByStatus(status);
    }

    // 根据仓库查询
    public List<SerialNumberReceipt> getReceiptsByWarehouse(Long warehouseId) {
        return receiptMapper.findByWarehouse(warehouseId);
    }

    // 根据供应商查询
    public List<SerialNumberReceipt> getReceiptsBySupplier(Long supplierId) {
        return receiptMapper.findBySupplier(supplierId);
    }

    // 验证序列号唯一性
    public void validateSerialNumbers(List<SerialNumberReceiptItem> items) {
        for (SerialNumberReceiptItem item : items) {
            if (receiptItemMapper.countBySerialNumber(item.getSerialNumber()) > 0) {
                throw new RuntimeException("序列号已存在: " + item.getSerialNumber());
            }
            if (snInventoryService.checkSerialNumberExists(item.getSerialNumber())) {
                throw new RuntimeException("序列号已在库存中: " + item.getSerialNumber());
            }
        }
    }

    // 创建序列号入库单
    @Transactional
    public SerialNumberReceipt createReceipt(SerialNumberReceipt receipt, List<SerialNumberReceiptItem> items) {
        // 验证序列号唯一性
        if (items != null && !items.isEmpty()) {
            validateSerialNumbers(items);
        }
        
        // 生成入库单号
        receipt.setReceiptNo(generateReceiptNo(receipt.getReceiptType()));
        receipt.setReceiptDate(LocalDateTime.now());
        receipt.setCreatedTime(LocalDateTime.now());
        receipt.setUpdatedTime(LocalDateTime.now());
        
        // 计算总数量和总金额
        int totalQuantity = 0;
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        if (items != null && !items.isEmpty()) {
            totalQuantity = items.size();
            for (SerialNumberReceiptItem item : items) {
                if (item.getUnitPrice() != null) {
                    totalAmount = totalAmount.add(item.getUnitPrice());
                }
            }
        }
        
        receipt.setTotalQuantity(totalQuantity);
        receipt.setTotalAmount(totalAmount);
        
        // 插入入库单
        receiptMapper.insert(receipt);
        
        // 插入明细
        if (items != null && !items.isEmpty()) {
            for (SerialNumberReceiptItem item : items) {
                item.setReceiptId(receipt.getId());
                receiptItemMapper.insert(item);
            }
        }
        
        return receipt;
    }

    // 更新序列号入库单
    @Transactional
    public SerialNumberReceipt updateReceipt(SerialNumberReceipt receipt, List<SerialNumberReceiptItem> items) {
        receipt.setUpdatedTime(LocalDateTime.now());
        
        // 删除原有明细
        receiptItemMapper.deleteByReceiptId(receipt.getId());
        
        // 验证序列号唯一性
        if (items != null && !items.isEmpty()) {
            validateSerialNumbers(items);
        }
        
        // 计算总数量和总金额
        int totalQuantity = 0;
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        if (items != null && !items.isEmpty()) {
            totalQuantity = items.size();
            for (SerialNumberReceiptItem item : items) {
                if (item.getUnitPrice() != null) {
                    totalAmount = totalAmount.add(item.getUnitPrice());
                }
            }
        }
        
        receipt.setTotalQuantity(totalQuantity);
        receipt.setTotalAmount(totalAmount);
        
        // 更新入库单
        receiptMapper.update(receipt);
        
        // 插入新明细
        if (items != null && !items.isEmpty()) {
            for (SerialNumberReceiptItem item : items) {
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
        SerialNumberReceipt receipt = receiptMapper.findById(id);
        if (receipt == null || !"APPROVED".equals(receipt.getStatus())) {
            return false;
        }
        
        List<SerialNumberReceiptItem> items = receiptItemMapper.findByReceiptId(id);
        String receiptType = receipt.getReceiptType();
        
        // 根据入库类型处理序列号库存
        for (SerialNumberReceiptItem item : items) {
            boolean success;
            
            if ("PURCHASE_RETURN_SN".equals(receiptType)) {
                // 采购退货出库 - 出库操作
                success = snInventoryService.issueSerialNumber(
                    item.getSerialNumber(),
                    receiptType,
                    receipt.getReceiptNo(),
                    receipt.getOperator()
                );
            } else {
                // 其他类型都是入库操作
                BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                success = snInventoryService.receiveSerialNumber(
                    receipt.getWarehouseId(),
                    item.getProductId(),
                    item.getSerialNumber(),
                    unitPrice,
                    receiptType,
                    receipt.getReceiptNo(),
                    receipt.getOperator()
                );
            }
            
            if (!success) {
                throw new RuntimeException("序列号处理失败: " + item.getSerialNumber());
            }
        }
        
        // 自动生成应付款（采购入库和采购退货）
        if (receipt.getAutoGeneratePayable() && !receipt.getPayableGenerated() && 
            ("PURCHASE_SN".equals(receiptType) || "PURCHASE_RETURN_SN".equals(receiptType))) {
            generatePayable(receipt);
        }
        
        return updateReceiptStatus(id, "RECEIVED");
    }

    // 生成应付款
    @Transactional
    public void generatePayable(SerialNumberReceipt receipt) {
        if (receipt.getSupplierId() == null || receipt.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }
        
        String payableType = "PURCHASE_RETURN_SN".equals(receipt.getReceiptType()) ? "RED_LETTER" : "NORMAL";
        BigDecimal amount = "PURCHASE_RETURN_SN".equals(receipt.getReceiptType()) ? 
            receipt.getTotalAmount().negate() : receipt.getTotalAmount();
        
        PurchasePayable payable = new PurchasePayable(receipt.getSupplierId(), amount, payableType);
        payable.setPurchaseOrderId(receipt.getPurchaseOrderId());
        payable.setReceiptId(receipt.getId());
        
        payableService.createPayable(payable);
        
        // 更新入库单应付款生成状态
        receiptMapper.updatePayableGenerated(receipt.getId(), true);
    }

    // 批量扫码入库
    @Transactional
    public SerialNumberReceipt batchScanReceipt(SerialNumberReceipt receipt, List<String> serialNumbers, 
                                              Long productId, BigDecimal unitPrice) {
        // 创建明细列表
        List<SerialNumberReceiptItem> items = serialNumbers.stream()
            .map(sn -> {
                SerialNumberReceiptItem item = new SerialNumberReceiptItem();
                item.setProductId(productId);
                item.setSerialNumber(sn);
                item.setUnitPrice(unitPrice);
                item.setQualityStatus("QUALIFIED");
                return item;
            }).collect(java.util.stream.Collectors.toList());
        
        return createReceipt(receipt, items);
    }

    // 更新入库状态
    public boolean updateReceiptStatus(Long id, String status) {
        return receiptMapper.updateStatus(id, status) > 0;
    }

    // 取消入库
    public boolean cancelReceipt(Long id) {
        return updateReceiptStatus(id, "CANCELLED");
    }

    // 删除序列号入库单
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
            case "PURCHASE_SN":
                prefix = "PSN";
                break;
            case "PURCHASE_RETURN_SN":
                prefix = "PRS";
                break;
            case "INVENTORY_GAIN_SN":
                prefix = "IGS";
                break;
            default:
                prefix = "SNR";
                break;
        }
        
        return prefix + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }
}