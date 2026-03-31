package com.lifei.psi.dto;

import java.math.BigDecimal;

/**
 * 采购订单汇总-供应商报表DTO
 */
public class PurchaseSupplierReport {
    private String supplierName;       // 供应商名称
    private String supplierContact;    // 供应商联系方式
    private Integer orderCount;        // 订单数量
    private BigDecimal totalAmount;    // 订单总金额
    private BigDecimal avgAmount;      // 平均订单金额
    private Integer productCount;      // 供应产品种类数
    private BigDecimal completionRate; // 完成率
    private BigDecimal onTimeRate;     // 按时交货率
    private String lastOrderDate;      // 最近订单日期

    // 构造函数
    public PurchaseSupplierReport() {}

    // Getter和Setter方法
    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getSupplierContact() {
        return supplierContact;
    }

    public void setSupplierContact(String supplierContact) {
        this.supplierContact = supplierContact;
    }

    public Integer getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Integer orderCount) {
        this.orderCount = orderCount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getAvgAmount() {
        return avgAmount;
    }

    public void setAvgAmount(BigDecimal avgAmount) {
        this.avgAmount = avgAmount;
    }

    public Integer getProductCount() {
        return productCount;
    }

    public void setProductCount(Integer productCount) {
        this.productCount = productCount;
    }

    public BigDecimal getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(BigDecimal completionRate) {
        this.completionRate = completionRate;
    }

    public BigDecimal getOnTimeRate() {
        return onTimeRate;
    }

    public void setOnTimeRate(BigDecimal onTimeRate) {
        this.onTimeRate = onTimeRate;
    }

    public String getLastOrderDate() {
        return lastOrderDate;
    }

    public void setLastOrderDate(String lastOrderDate) {
        this.lastOrderDate = lastOrderDate;
    }
}