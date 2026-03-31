package com.lifei.psi.entity;

import java.math.BigDecimal;

public class SalesQuotationItem {
    private Long id;
    private Long quotationId;      // 报价单ID
    private String productName;    // 产品名称
    private String productCode;    // 产品编码
    private String specification;  // 规格型号
    private String unit;          // 单位
    private BigDecimal quantity;   // 数量
    private BigDecimal unitPrice;  // 单价
    private BigDecimal amount;     // 金额
    private String remarks;        // 备注

    // 构造函数
    public SalesQuotationItem() {}

    public SalesQuotationItem(Long quotationId, String productName, BigDecimal quantity, BigDecimal unitPrice) {
        this.quotationId = quotationId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.amount = quantity.multiply(unitPrice);
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(Long quotationId) {
        this.quotationId = quotationId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getSpecification() {
        return specification;
    }

    public void setSpecification(String specification) {
        this.specification = specification;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
        if (this.unitPrice != null) {
            this.amount = quantity.multiply(this.unitPrice);
        }
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
        if (this.quantity != null) {
            this.amount = this.quantity.multiply(unitPrice);
        }
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}