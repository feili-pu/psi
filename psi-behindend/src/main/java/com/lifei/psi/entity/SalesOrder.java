package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;

public class SalesOrder {
    private Long id;
    private String orderNo;            // 订单号
    private Long quotationId;          // 关联的报价单ID（可选）
    private String customerName;       // 客户名称
    private String customerContact;    // 客户联系方式
    private String salesperson;        // 销售员
    private LocalDateTime orderDate;   // 订单日期
    private LocalDate deliveryDate;    // 要求交货日期
    private BigDecimal totalAmount;    // 订单总金额
    private Boolean includeTax;        // 是否含税
    private BigDecimal taxRate;        // 税率
    private String paymentTerms;       // 付款条件
    private String deliveryAddress;    // 交货地址
    private String status;             // 状态：PENDING(待确认), CONFIRMED(已确认), PRODUCING(生产中), SHIPPED(已发货), DELIVERED(已交付), COMPLETED(已完成), CANCELLED(已取消)
    private String remarks;            // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public SalesOrder() {}

    public SalesOrder(String customerName, String salesperson, LocalDate deliveryDate) {
        this.customerName = customerName;
        this.salesperson = salesperson;
        this.deliveryDate = deliveryDate;
        this.orderDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public Long getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(Long quotationId) {
        this.quotationId = quotationId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerContact() {
        return customerContact;
    }

    public void setCustomerContact(String customerContact) {
        this.customerContact = customerContact;
    }

    public String getSalesperson() {
        return salesperson;
    }

    public void setSalesperson(String salesperson) {
        this.salesperson = salesperson;
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

    public Boolean getIncludeTax() {
        return includeTax;
    }

    public void setIncludeTax(Boolean includeTax) {
        this.includeTax = includeTax;
    }

    public BigDecimal getTaxRate() {
        return taxRate;
    }

    public void setTaxRate(BigDecimal taxRate) {
        this.taxRate = taxRate;
    }

    public String getPaymentTerms() {
        return paymentTerms;
    }

    public void setPaymentTerms(String paymentTerms) {
        this.paymentTerms = paymentTerms;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public LocalDateTime getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(LocalDateTime updatedTime) {
        this.updatedTime = updatedTime;
    }
}