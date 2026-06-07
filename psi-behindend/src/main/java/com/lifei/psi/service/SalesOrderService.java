package com.lifei.psi.service;

import com.lifei.psi.entity.SalesOrder;
import com.lifei.psi.entity.SalesOrderItem;
import com.lifei.psi.entity.SalesQuotation;
import com.lifei.psi.entity.SalesQuotationItem;
import com.lifei.psi.mapper.SalesOrderMapper;
import com.lifei.psi.mapper.SalesOrderItemMapper;
import com.lifei.psi.mapper.SalesQuotationMapper;
import com.lifei.psi.mapper.SalesQuotationItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SalesOrderService {

    @Autowired
    private SalesOrderMapper orderMapper;

    @Autowired
    private SalesOrderItemMapper orderItemMapper;

    @Autowired
    private SalesQuotationMapper quotationMapper;

    @Autowired
    private SalesQuotationItemMapper quotationItemMapper;

    // 获取所有订单
    public List<SalesOrder> getAllOrders() {
        return orderMapper.findAll();
    }

    // 根据ID获取订单
    public SalesOrder getOrderById(Long id) {
        return orderMapper.findById(id);
    }

    // 获取订单明细
    public List<SalesOrderItem> getOrderItems(Long orderId) {
        return orderItemMapper.findByOrderId(orderId);
    }

    // 根据客户名称搜索
    public List<SalesOrder> searchByCustomer(String customerName) {
        return orderMapper.findByCustomerName(customerName);
    }

    // 根据销售员查询
    public List<SalesOrder> getOrdersBySalesperson(String salesperson) {
        return orderMapper.findBySalesperson(salesperson);
    }

    // 根据状态查询
    public List<SalesOrder> getOrdersByStatus(String status) {
        return orderMapper.findByStatus(status);
    }

    // 创建订单
    @Transactional
    public SalesOrder createOrder(SalesOrder order, List<SalesOrderItem> items) {
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
        
        System.out.println("订单创建成功，ID: " + order.getId() + ", 状态: " + order.getStatus());
        
        // 插入明细
        if (items != null && !items.isEmpty()) {
            for (SalesOrderItem item : items) {
                item.setOrderId(order.getId());
                // 重新计算金额和剩余数量
                item.setAmount(item.getQuantity().multiply(item.getUnitPrice()));
                item.setDeliveredQty(BigDecimal.ZERO);
                item.setRemainingQty(item.getQuantity());
                orderItemMapper.insert(item);
            }
        }
        
        return order;
    }

    // 从报价单创建订单
    @Transactional
    public SalesOrder createOrderFromQuotation(Long quotationId, SalesOrder orderInfo) {
        // 获取报价单信息
        SalesQuotation quotation = quotationMapper.findById(quotationId);
        if (quotation == null) {
            throw new RuntimeException("报价单不存在");
        }
        
        // 获取报价单明细
        List<SalesQuotationItem> quotationItems = quotationItemMapper.findByQuotationId(quotationId);
        
        // 创建订单主表
        SalesOrder order = new SalesOrder();
        order.setQuotationId(quotationId);
        order.setCustomerName(quotation.getCustomerName());
        order.setCustomerContact(quotation.getCustomerContact());
        order.setSalesperson(quotation.getSalesperson());
        order.setIncludeTax(quotation.getIncludeTax());
        order.setTaxRate(quotation.getTaxRate());
        
        // 使用传入的订单信息覆盖
        if (orderInfo.getDeliveryDate() != null) {
            order.setDeliveryDate(orderInfo.getDeliveryDate());
        }
        if (orderInfo.getPaymentTerms() != null) {
            order.setPaymentTerms(orderInfo.getPaymentTerms());
        }
        if (orderInfo.getDeliveryAddress() != null) {
            order.setDeliveryAddress(orderInfo.getDeliveryAddress());
        }
        if (orderInfo.getRemarks() != null) {
            order.setRemarks(orderInfo.getRemarks());
        }
        
        // 转换明细
        List<SalesOrderItem> orderItems = new java.util.ArrayList<>();
        for (SalesQuotationItem quotationItem : quotationItems) {
            SalesOrderItem orderItem = new SalesOrderItem();
            orderItem.setProductName(quotationItem.getProductName());
            orderItem.setProductCode(quotationItem.getProductCode());
            orderItem.setSpecification(quotationItem.getSpecification());
            orderItem.setUnit(quotationItem.getUnit());
            orderItem.setQuantity(quotationItem.getQuantity());
            orderItem.setUnitPrice(quotationItem.getUnitPrice());
            orderItem.setRemarks(quotationItem.getRemarks());
            orderItems.add(orderItem);
        }
        
        return createOrder(order, orderItems);
    }

    // 更新订单
    @Transactional
    public SalesOrder updateOrder(SalesOrder order, List<SalesOrderItem> items) {
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
            for (SalesOrderItem item : items) {
                item.setOrderId(order.getId());
                item.setAmount(item.getQuantity().multiply(item.getUnitPrice()));
                if (item.getDeliveredQty() == null) {
                    item.setDeliveredQty(BigDecimal.ZERO);
                }
                item.setRemainingQty(item.getQuantity().subtract(item.getDeliveredQty()));
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

    // 交付
    public boolean deliverOrder(Long id) {
        return updateOrderStatus(id, "DELIVERED");
    }

    // 完成订单
    public boolean completeOrder(Long id) {
        return updateOrderStatus(id, "COMPLETED");
    }

    // 取消订单
    public boolean cancelOrder(Long id) {
        return updateOrderStatus(id, "CANCELLED");
    }

    // 更新交货数量
    @Transactional
    public boolean updateDeliveredQuantity(Long itemId, BigDecimal deliveredQty) {
        return orderItemMapper.updateDeliveredQty(itemId, deliveredQty) > 0;
    }

    // 删除订单
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
        return "SO" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }

    // 计算总金额
    private BigDecimal calculateTotalAmount(List<SalesOrderItem> items) {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal total = BigDecimal.ZERO;
        for (SalesOrderItem item : items) {
            if (item.getAmount() != null) {
                total = total.add(item.getAmount());
            }
        }
        return total;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
