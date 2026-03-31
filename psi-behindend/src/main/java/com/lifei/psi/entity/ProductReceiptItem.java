package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 产品入库明细实体类
 */
public class ProductReceiptItem {
    private Long id;
    private Long receiptId;            // 入库单ID
    private Long productId;            // 产品ID
    private BigDecimal quantity;       // 入库数量
    private String unit;               // 单位
    private BigDecimal unitCost;       // 单位成本
    private BigDecimal totalCost;      // 总成本
    private String batchNo;            // 批次号
    private LocalDate productionDate;  // 生产日期
    private LocalDate expiryDate;      // 有效期
    private String remarks;            // 备注

    // 构造函数
    public ProductReceiptItem() {}

    public ProductReceiptItem(Long receiptId, Long productId, BigDecimal quantity, String unit) {
        this.receiptId = receiptId;
        this.productId = productId;
        this.quantity = quantity;
        this.unit = unit;
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReceiptId() {
        return receiptId;
    }

    public void setReceiptId(Long receiptId) {
        this.receiptId = receiptId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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

    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public LocalDate getProductionDate() {
        return productionDate;
    }

    public void setProductionDate(LocalDate productionDate) {
        this.productionDate = productionDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}