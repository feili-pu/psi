package com.lifei.psi.dto;

import java.math.BigDecimal;

/**
 * 销售汇总报表
 */
public class SalesSummaryReport {
    private String groupKey;          // 分组键（部门、业务员、客户、物料等）
    private String groupName;         // 分组名称
    private Integer orderCount;       // 订单数量
    private BigDecimal totalAmount;   // 总销售金额
    private BigDecimal totalQuantity; // 总销售数量
    private BigDecimal totalCost;     // 总成本
    private BigDecimal grossProfit;   // 毛利润
    private BigDecimal profitRate;    // 毛利率
    private BigDecimal avgOrderAmount; // 平均订单金额

    // 构造函数
    public SalesSummaryReport() {}

    public SalesSummaryReport(String groupKey, String groupName) {
        this.groupKey = groupKey;
        this.groupName = groupName;
        this.orderCount = 0;
        this.totalAmount = BigDecimal.ZERO;
        this.totalQuantity = BigDecimal.ZERO;
        this.totalCost = BigDecimal.ZERO;
        this.grossProfit = BigDecimal.ZERO;
        this.profitRate = BigDecimal.ZERO;
        this.avgOrderAmount = BigDecimal.ZERO;
    }

    // Getter和Setter方法
    public String getGroupKey() {
        return groupKey;
    }

    public void setGroupKey(String groupKey) {
        this.groupKey = groupKey;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
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

    public BigDecimal getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(BigDecimal totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public BigDecimal getGrossProfit() {
        return grossProfit;
    }

    public void setGrossProfit(BigDecimal grossProfit) {
        this.grossProfit = grossProfit;
    }

    public BigDecimal getProfitRate() {
        return profitRate;
    }

    public void setProfitRate(BigDecimal profitRate) {
        this.profitRate = profitRate;
    }

    public BigDecimal getAvgOrderAmount() {
        return avgOrderAmount;
    }

    public void setAvgOrderAmount(BigDecimal avgOrderAmount) {
        this.avgOrderAmount = avgOrderAmount;
    }
}