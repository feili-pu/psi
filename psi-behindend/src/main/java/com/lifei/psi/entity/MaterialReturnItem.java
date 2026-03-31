package com.lifei.psi.entity;

import java.math.BigDecimal;

/**
 * 生产退料明细实体类
 */
public class MaterialReturnItem {
    private Long id;
    private Long returnId;             // 退料单ID
    private Long productId;            // 物料ID
    private BigDecimal returnQuantity; // 退料数量
    private String unit;               // 单位
    private BigDecimal unitCost;       // 单位成本
    private BigDecimal totalCost;      // 总成本
    private String remarks;            // 备注

    // 构造函数
    public MaterialReturnItem() {}

    public MaterialReturnItem(Long returnId, Long productId, BigDecimal returnQuantity, String unit) {
        this.returnId = returnId;
        this.productId = productId;
        this.returnQuantity = returnQuantity;
        this.unit = unit;
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReturnId() {
        return returnId;
    }

    public void setReturnId(Long returnId) {
        this.returnId = returnId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getReturnQuantity() {
        return returnQuantity;
    }

    public void setReturnQuantity(BigDecimal returnQuantity) {
        this.returnQuantity = returnQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}