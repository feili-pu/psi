package com.lifei.psi.entity;

import java.math.BigDecimal;

/**
 * 生产领料明细实体类
 */
public class MaterialRequisitionItem {
    private Long id;
    private Long requisitionId;        // 领料单ID
    private Long productId;            // 物料ID
    private BigDecimal requiredQuantity; // 需求数量
    private BigDecimal issuedQuantity; // 已发数量
    private String unit;               // 单位
    private BigDecimal unitCost;       // 单位成本
    private BigDecimal totalCost;      // 总成本
    private String remarks;            // 备注

    // 构造函数
    public MaterialRequisitionItem() {}

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequisitionId() {
        return requisitionId;
    }

    public void setRequisitionId(Long requisitionId) {
        this.requisitionId = requisitionId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getRequiredQuantity() {
        return requiredQuantity;
    }

    public void setRequiredQuantity(BigDecimal requiredQuantity) {
        this.requiredQuantity = requiredQuantity;
    }

    public BigDecimal getIssuedQuantity() {
        return issuedQuantity;
    }

    public void setIssuedQuantity(BigDecimal issuedQuantity) {
        this.issuedQuantity = issuedQuantity;
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