package com.lifei.psi.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 销售订单执行情况报表
 */
public class SalesExecutionReport {
    private String orderNo;           // 订单号
    private String customerName;      // 客户名称
    private String salesperson;       // 销售员
    private LocalDate orderDate;      // 订单日期
    private LocalDate deliveryDate;   // 要求交货日期
    private LocalDate actualDeliveryDate; // 实际交货日期
    private BigDecimal totalAmount;   // 订单金额
    private String status;            // 订单状态
    private BigDecimal totalQty;      // 订单总数量
    private BigDecimal deliveredQty;  // 已交货数量
    private BigDecimal remainingQty;  // 剩余数量
    private BigDecimal executionRate; // 执行率（已交货/订单总量）
    private Integer delayDays;        // 延期天数
    private String remarks;

    // 构造函数
    public SalesExecutionReport() {}

    // Getter和Setter方法
    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getSalesperson() {
        return salesperson;
    }

    public void setSalesperson(String salesperson) {
        this.salesperson = salesperson;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public LocalDate getActualDeliveryDate() {
        return actualDeliveryDate;
    }

    public void setActualDeliveryDate(LocalDate actualDeliveryDate) {
        this.actualDeliveryDate = actualDeliveryDate;
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

    public BigDecimal getTotalQty() {
        return totalQty;
    }

    public void setTotalQty(BigDecimal totalQty) {
        this.totalQty = totalQty;
    }

    public BigDecimal getDeliveredQty() {
        return deliveredQty;
    }

    public void setDeliveredQty(BigDecimal deliveredQty) {
        this.deliveredQty = deliveredQty;
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

    public Integer getDelayDays() {
        return delayDays;
    }

    public void setDelayDays(Integer delayDays) {
        this.delayDays = delayDays;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}