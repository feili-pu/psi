package com.lifei.psi.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 采购订单执行情况报表DTO
 */
public class PurchaseExecutionReport {
    private Long orderId;              // 订单ID
    private String orderNo;            // 订单号
    private String supplierName;       // 供应商名称
    private String purchaser;          // 采购员
    private LocalDateTime orderDate;   // 订单日期
    private LocalDate deliveryDate;    // 要求交货日期
    private BigDecimal totalAmount;    // 订单总金额
    private String status;             // 订单状态
    private String productName;        // 产品名称
    private String productCode;        // 产品编码
    private String unit;               // 单位
    private BigDecimal quantity;       // 订购数量
    private BigDecimal unitPrice;      // 单价
    private BigDecimal amount;         // 金额
    private BigDecimal receivedQty;    // 已收货数量
    private BigDecimal remainingQty;   // 剩余数量
    private BigDecimal executionRate;  // 执行率(已收货/订购数量)

    // 构造函数
    public PurchaseExecutionReport() {}

    // Getter和Setter方法
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getPurchaser() {
        return purchaser;
    }

    public void setPurchaser(String purchaser) {
        this.purchaser = purchaser;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getReceivedQty() {
        return receivedQty;
    }

    public void setReceivedQty(BigDecimal receivedQty) {
        this.receivedQty = receivedQty;
    }

    public BigDecimal getRemainingQty() {
        return remainingQty;
    }

    public void setRemainingQty(BigDecimal remainingQty) {
        this.remainingQty = remainingQty;
    }

    public BigDecimal getExecutionRate() {
        return executionRate;
    }

    public void setExecutionRate(BigDecimal executionRate) {
        this.executionRate = executionRate;
    }
}