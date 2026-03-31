package com.lifei.psi.dto;

import java.math.BigDecimal;

/**
 * 采购订单汇总-部门报表DTO
 */
public class PurchaseDepartmentReport {
    private String department;         // 申请部门
    private Integer orderCount;        // 订单数量
    private BigDecimal totalAmount;    // 订单总金额
    private BigDecimal avgAmount;      // 平均订单金额
    private Integer itemCount;         // 明细数量
    private BigDecimal totalQuantity;  // 总采购数量
    private BigDecimal completionRate; // 完成率

    // 构造函数
    public PurchaseDepartmentReport() {}

    // Getter和Setter方法
    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
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

    public Integer getItemCount() {
        return itemCount;
    }

    public void setItemCount(Integer itemCount) {
        this.itemCount = itemCount;
    }

    public BigDecimal getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(BigDecimal totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(BigDecimal completionRate) {
        this.completionRate = completionRate;
    }
}