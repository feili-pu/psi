package com.lifei.psi.entity;

import java.math.BigDecimal;

/**
 * 盘点明细实体类
 */
public class InventoryCheckItem {
    private Long id;
    private Long checkId;              // 盘点单ID
    private Long productId;            // 产品ID
    private BigDecimal bookQuantity;   // 账面数量
    private BigDecimal actualQuantity; // 实盘数量
    private BigDecimal differenceQuantity; // 差异数量
    private BigDecimal unitCost;       // 单位成本
    private BigDecimal differenceAmount; // 差异金额
    private String differenceType;     // 差异类型：GAIN(盘盈), LOSS(盘亏), NORMAL(正常)
    private String remarks;            // 备注

    // 构造函数
    public InventoryCheckItem() {}

    public InventoryCheckItem(Long checkId, Long productId, BigDecimal bookQuantity, BigDecimal actualQuantity) {
        this.checkId = checkId;
        this.productId = productId;
        this.bookQuantity = bookQuantity;
        this.actualQuantity = actualQuantity;
        this.differenceQuantity = actualQuantity.subtract(bookQuantity);
        
        // 判断差异类型
        int comparison = this.differenceQuantity.compareTo(BigDecimal.ZERO);
        if (comparison > 0) {
            this.differenceType = "GAIN";
        } else if (comparison < 0) {
            this.differenceType = "LOSS";
        } else {
            this.differenceType = "NORMAL";
        }
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCheckId() {
        return checkId;
    }

    public void setCheckId(Long checkId) {
        this.checkId = checkId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getBookQuantity() {
        return bookQuantity;
    }

    public void setBookQuantity(BigDecimal bookQuantity) {
        this.bookQuantity = bookQuantity;
    }

    public BigDecimal getActualQuantity() {
        return actualQuantity;
    }

    public void setActualQuantity(BigDecimal actualQuantity) {
        this.actualQuantity = actualQuantity;
    }

    public BigDecimal getDifferenceQuantity() {
        return differenceQuantity;
    }

    public void setDifferenceQuantity(BigDecimal differenceQuantity) {
        this.differenceQuantity = differenceQuantity;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public BigDecimal getDifferenceAmount() {
        return differenceAmount;
    }

    public void setDifferenceAmount(BigDecimal differenceAmount) {
        this.differenceAmount = differenceAmount;
    }

    public String getDifferenceType() {
        return differenceType;
    }

    public void setDifferenceType(String differenceType) {
        this.differenceType = differenceType;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}