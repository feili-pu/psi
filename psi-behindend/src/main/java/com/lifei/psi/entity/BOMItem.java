package com.lifei.psi.entity;

import java.math.BigDecimal;

/**
 * BOM明细实体类
 */
public class BOMItem {
    private Long id;
    private Long bomId;                // BOM ID
    private Long materialId;           // 物料ID
    private BigDecimal quantity;       // 用量
    private String unit;               // 单位
    private BigDecimal lossRate;       // 损耗率(%)
    private String remarks;            // 备注

    // 构造函数
    public BOMItem() {}

    public BOMItem(Long bomId, Long materialId, BigDecimal quantity, String unit) {
        this.bomId = bomId;
        this.materialId = materialId;
        this.quantity = quantity;
        this.unit = unit;
        this.lossRate = BigDecimal.ZERO;
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBomId() {
        return bomId;
    }

    public void setBomId(Long bomId) {
        this.bomId = bomId;
    }

    public Long getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Long materialId) {
        this.materialId = materialId;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getLossRate() {
        return lossRate;
    }

    public void setLossRate(BigDecimal lossRate) {
        this.lossRate = lossRate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}