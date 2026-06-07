package com.lifei.psi.service;

import com.lifei.psi.entity.PurchaseOrder;
import com.lifei.psi.entity.PurchaseOrderItem;
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
    public boolean receiveOrder(Long id) {
        return updateOrderStatus(id, "RECEIVED");
    }

    // 完成订单
    public boolean completeOrder(Long id) {
        return updateOrderStatus(id, "COMPLETED");
    }

    // 取消订单
    public boolean cancelOrder(Long id) {
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
}
