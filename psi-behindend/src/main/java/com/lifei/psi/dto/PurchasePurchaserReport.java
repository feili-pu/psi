package com.lifei.psi.dto;

import java.math.BigDecimal;

/**
 * 采购订单汇总-采购员报表DTO
 */
public class PurchasePurchaserReport {
    private String purchaser;          // 采购员
    private Integer orderCount;        // 订单数量
    private BigDecimal totalAmount;    // 订单总金额
    private BigDecimal avgAmount;      // 平均订单金额
    private Integer supplierCount;     // 合作供应商数量
    private BigDecimal completionRate; // 完成率
    private BigDecimal onTimeRate;     // 按时交货率

    // 构造函数
    public PurchasePurchaserReport() {}

    // Getter和Setter方法
    public String getPurchaser() {
        return purchaser;
    }

    public void setPurchaser(String purchaser) {
        this.purchaser = purchaser;
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

    public Integer getSupplierCount() {
        return supplierCount;
    }

    public void setSupplierCount(Integer supplierCount) {
        this.supplierCount = supplierCount;
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
}