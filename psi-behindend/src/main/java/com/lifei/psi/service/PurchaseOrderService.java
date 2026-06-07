package com.lifei.psi.service;

import com.lifei.psi.entity.PurchaseOrder;
import com.lifei.psi.entity.PurchaseOrderItem;
import com.lifei.psi.entity.InventoryReceipt;
import com.lifei.psi.entity.InventoryReceiptItem;
import com.lifei.psi.mapper.InventoryReceiptMapper;
import com.lifei.psi.mapper.MasterDataMapper;
import com.lifei.psi.mapper.PurchaseOrderMapper;
import com.lifei.psi.mapper.PurchaseOrderItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderMapper orderMapper;

    @Autowired
    private PurchaseOrderItemMapper orderItemMapper;

    @Autowired
    private MasterDataMapper masterDataMapper;

    @Autowired
    private InventoryReceiptMapper receiptMapper;

    @Autowired
    private InventoryReceiptService receiptService;

    // 获取所有采购订单
    public List<PurchaseOrder> getAllOrders() {
        return orderMapper.findAll();
    }

    // 根据ID获取采购订单
    public PurchaseOrder getOrderById(Long id) {
        return orderMapper.findById(id);
    }

    // 获取订单明细
    public List<PurchaseOrderItem> getOrderItems(Long orderId) {
        return orderItemMapper.findByOrderId(orderId);
    }

    // 根据供应商名称搜索
    public List<PurchaseOrder> searchBySupplier(String supplierName) {
        return orderMapper.findBySupplierName(supplierName);
    }

    // 根据采购员查询
    public List<PurchaseOrder> getOrdersByPurchaser(String purchaser) {
        return orderMapper.findByPurchaser(purchaser);
    }

    // 根据状态查询
    public List<PurchaseOrder> getOrdersByStatus(String status) {
        return orderMapper.findByStatus(status);
    }

    // 创建采购订单
    @Transactional
    public PurchaseOrder createOrder(PurchaseOrder order, List<PurchaseOrderItem> items) {
        // 生成订单号
        order.setOrderNo(generateOrderNo());
        if (isBlank(order.getStatus())) {
            order.setStatus("PENDING");
        }
        order.setOrderDate(LocalDateTime.now());
        order.setCreatedTime(LocalDateTime.now());
        order.setUpdatedTime(LocalDateTime.now());
        
        // 计算总金额
        BigDecimal totalAmount = calculateTotalAmount(items);
        order.setTotalAmount(totalAmount);
        
        // 插入订单
        orderMapper.insert(order);
        
        // 插入明细
        if (items != null && !items.isEmpty()) {
            for (PurchaseOrderItem item : items) {
                item.setOrderId(order.getId());
                // 重新计算金额和剩余数量
                item.setAmount(item.getQuantity().multiply(item.getUnitPrice()));
                item.setReceivedQty(BigDecimal.ZERO);
                item.setRemainingQty(item.getQuantity());
                orderItemMapper.insert(item);
            }
        }
        
        return order;
    }

    // 更新采购订单
    @Transactional
    public PurchaseOrder updateOrder(PurchaseOrder order, List<PurchaseOrderItem> items) {
        order.setUpdatedTime(LocalDateTime.now());
        
        // 计算总金额
        if (items != null) {
            BigDecimal totalAmount = calculateTotalAmount(items);
            order.setTotalAmount(totalAmount);
        }
        
        // 更新订单
        orderMapper.update(order);
        
        // 删除原有明细
        orderItemMapper.deleteByOrderId(order.getId());
        
        // 插入新明细
        if (items != null && !items.isEmpty()) {
            for (PurchaseOrderItem item : items) {
                item.setOrderId(order.getId());
                item.setAmount(item.getQuantity().multiply(item.getUnitPrice()));
                if (item.getReceivedQty() == null) {
                    item.setReceivedQty(BigDecimal.ZERO);
                }
                item.setRemainingQty(item.getQuantity().subtract(item.getReceivedQty()));
                orderItemMapper.insert(item);
            }
        }
        
        return order;
    }

    // 更新订单状态
    public boolean updateOrderStatus(Long id, String status) {
        return orderMapper.updateStatus(id, status) > 0;
    }

    // 确认订单
    public boolean confirmOrder(Long id) {
        return updateOrderStatus(id, "CONFIRMED");
    }

    // 开始生产
    public boolean startProduction(Long id) {
        return updateOrderStatus(id, "PRODUCING");
    }

    // 发货
    public boolean shipOrder(Long id) {
        return updateOrderStatus(id, "SHIPPED");
    }

    // 收货
    @Transactional
    public boolean receiveOrder(Long id) {
        PurchaseOrder order = orderMapper.findById(id);
        if (order == null) {
            throw new RuntimeException("采购订单不存在");
        }
        if ("RECEIVED".equals(order.getStatus()) || "COMPLETED".equals(order.getStatus())) {
            return true;
        }
        if (!"SHIPPED".equals(order.getStatus())) {
            throw new RuntimeException("采购订单必须先发货后收货");
        }

        List<PurchaseOrderItem> orderItems = orderItemMapper.findByOrderId(id);
        if (orderItems == null || orderItems.isEmpty()) {
            throw new RuntimeException("采购订单没有明细，不能收货");
        }

        List<InventoryReceipt> existingReceipts = receiptMapper.findByPurchaseOrder(id);
        if (existingReceipts != null && !existingReceipts.isEmpty()) {
            boolean processed = false;
            for (InventoryReceipt existingReceipt : existingReceipts) {
                if ("CANCELLED".equals(existingReceipt.getStatus())) {
                    continue;
                }
                if ("PENDING".equals(existingReceipt.getStatus()) && !receiptService.approveReceipt(existingReceipt.getId())) {
                    throw new RuntimeException("已有入库单审核失败: " + existingReceipt.getReceiptNo());
                }
                InventoryReceipt latestReceipt = receiptMapper.findById(existingReceipt.getId());
                if ("APPROVED".equals(latestReceipt.getStatus()) && !receiptService.processReceipt(latestReceipt.getId())) {
                    throw new RuntimeException("已有入库单入库失败: " + latestReceipt.getReceiptNo());
                }
                processed = true;
            }
            if (!processed) {
                throw new RuntimeException("采购订单只有已取消的入库单，不能收货");
            }
            for (PurchaseOrderItem orderItem : orderItems) {
                orderItemMapper.updateReceivedQty(orderItem.getId(), safeQuantity(orderItem.getQuantity()));
            }
            return updateOrderStatus(id, "RECEIVED");
        }

        InventoryReceipt receipt = new InventoryReceipt();
        receipt.setReceiptType("PURCHASE");
        receipt.setWarehouseId(getDefaultWarehouseId());
        receipt.setSupplierId(resolveSupplierId(order.getSupplierName()));
        receipt.setPurchaseOrderId(order.getId());
        receipt.setOperator(defaultOperator(order.getPurchaser()));
        receipt.setStatus("PENDING");
        receipt.setAutoGeneratePayable(true);
        receipt.setPayableGenerated(false);
        receipt.setRemarks("采购订单 " + order.getOrderNo() + " 收货自动生成入库单");

        List<InventoryReceiptItem> receiptItems = new java.util.ArrayList<>();
        for (PurchaseOrderItem orderItem : orderItems) {
            BigDecimal quantity = safeQuantity(orderItem.getQuantity());
            BigDecimal receivedQty = safeQuantity(orderItem.getReceivedQty());
            BigDecimal quantityToReceive = quantity.subtract(receivedQty);
            if (quantityToReceive.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            Long productId = resolveProductId(orderItem.getProductCode(), orderItem.getProductName());
            InventoryReceiptItem receiptItem = new InventoryReceiptItem(null, productId, quantityToReceive, orderItem.getUnit());
            receiptItem.setUnitPrice(orderItem.getUnitPrice() != null ? orderItem.getUnitPrice() : BigDecimal.ZERO);
            receiptItem.setTotalAmount(quantityToReceive.multiply(receiptItem.getUnitPrice()));
            receiptItem.setQualityStatus("QUALIFIED");
            receiptItem.setRemarks("采购订单明细自动收货");
            receiptItems.add(receiptItem);
        }

        if (receiptItems.isEmpty()) {
            return updateOrderStatus(id, "RECEIVED");
        }

        InventoryReceipt createdReceipt = receiptService.createReceipt(receipt, receiptItems);
        if (!receiptService.approveReceipt(createdReceipt.getId()) || !receiptService.processReceipt(createdReceipt.getId())) {
            throw new RuntimeException("采购收货入库处理失败");
        }

        for (PurchaseOrderItem orderItem : orderItems) {
            orderItemMapper.updateReceivedQty(orderItem.getId(), safeQuantity(orderItem.getQuantity()));
        }

        return updateOrderStatus(id, "RECEIVED");
    }

    // 完成订单
    public boolean completeOrder(Long id) {
        return updateOrderStatus(id, "COMPLETED");
    }

    // 取消订单
    public boolean cancelOrder(Long id) {
        PurchaseOrder order = orderMapper.findById(id);
        if (order != null && ("RECEIVED".equals(order.getStatus()) || "COMPLETED".equals(order.getStatus()))) {
            throw new RuntimeException("已收货或已完成的采购订单不能直接取消，请先做退货/红字处理");
        }
        return updateOrderStatus(id, "CANCELLED");
    }

    // 更新收货数量
    @Transactional
    public boolean updateReceivedQuantity(Long itemId, BigDecimal receivedQty) {
        return orderItemMapper.updateReceivedQty(itemId, receivedQty) > 0;
    }

    // 删除采购订单
    @Transactional
    public boolean deleteOrder(Long id) {
        // 先删除明细
        orderItemMapper.deleteByOrderId(id);
        // 再删除主表
        return orderMapper.deleteById(id) > 0;
    }

    // 生成订单号
    private String generateOrderNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "PO" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }

    // 计算总金额
    private BigDecimal calculateTotalAmount(List<PurchaseOrderItem> items) {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal total = BigDecimal.ZERO;
        for (PurchaseOrderItem item : items) {
            if (item.getAmount() != null) {
                total = total.add(item.getAmount());
            } else if (item.getQuantity() != null && item.getUnitPrice() != null) {
                total = total.add(item.getQuantity().multiply(item.getUnitPrice()));
            }
        }
        return total;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private Long getDefaultWarehouseId() {
        Long warehouseId = masterDataMapper.findWarehouseIdByCode("WH001");
        if (warehouseId == null) {
            warehouseId = masterDataMapper.findDefaultWarehouseId();
        }
        if (warehouseId == null) {
            throw new RuntimeException("未找到可用仓库，请先维护仓库主数据");
        }
        return warehouseId;
    }

    private Long resolveProductId(String productCode, String productName) {
        if (isBlank(productCode)) {
            throw new RuntimeException("产品缺少编码，无法匹配库存: " + productName);
        }
        Long productId = masterDataMapper.findProductIdByCode(productCode);
        if (productId == null) {
            throw new RuntimeException("产品编码未建档，无法匹配库存: " + productCode);
        }
        return productId;
    }

    private Long resolveSupplierId(String supplierName) {
        if (isBlank(supplierName)) {
            throw new RuntimeException("供应商名称为空，无法生成应付");
        }
        Long supplierId = masterDataMapper.findSupplierIdByName(supplierName);
        if (supplierId == null) {
            throw new RuntimeException("供应商未建档，无法生成应付: " + supplierName);
        }
        return supplierId;
    }

    private BigDecimal safeQuantity(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private String defaultOperator(String operator) {
        return isBlank(operator) ? "系统" : operator;
    }
}
