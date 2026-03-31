package com.lifei.psi.dto;

import java.math.BigDecimal;

/**
 * 采购订单汇总报表DTO
 */
public class PurchaseSummaryReport {
    private String period;             // 统计期间
    private Integer orderCount;        // 订单数量
    private BigDecimal totalAmount;    // 订单总金额
    private BigDecimal avgAmount;      // 平均订单金额
    private Integer pendingCount;      // 待确认订单数
    private Integer confirmedCount;    // 已确认订单数
    private Integer completedCount;    // 已完成订单数
    private Integer cancelledCount;    // 已取消订单数
    private BigDecimal completionRate; // 完成率

    // 构造函数
    public PurchaseSummaryReport() {}

    // Getter和Setter方法
    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
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

    public Integer getPendingCount() {
        return pendingCount;
    }

    public void setPendingCount(Integer pendingCount) {
        this.pendingCount = pendingCount;
    }

    public Integer getConfirmedCount() {
        return confirmedCount;
    }

    public void setConfirmedCount(Integer confirmedCount) {
        this.confirmedCount = confirmedCount;
    }

    public Integer getCompletedCount() {
        return completedCount;
    }

    public void setCompletedCount(Integer completedCount) {
        this.completedCount = completedCount;
    }

    public Integer getCancelledCount() {
        return cancelledCount;
    }

    public void setCancelledCount(Integer cancelledCount) {
        this.cancelledCount = cancelledCount;
    }

    public BigDecimal getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(BigDecimal completionRate) {
        this.completionRate = completionRate;
    }
}