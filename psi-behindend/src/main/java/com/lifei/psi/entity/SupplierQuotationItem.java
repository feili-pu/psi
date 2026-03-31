package com.lifei.psi.entity;

import java.math.BigDecimal;

/**
 * 供应商报价明细实体类
 */
public class SupplierQuotationItem {
    private Long id;
    private Long quotationId;          // 报价单ID
    private Long inquiryItemId;        // 询价明细ID
    private String productName;        // 产品名称
    private String productCode;        // 产品编码
    private String specification;      // 规格型号
    private String unit;               // 单位
    private BigDecimal quantity;       // 报价数量
    private BigDecimal unitPrice;      // 单价
    private BigDecimal amount;         // 金额
    private String deliveryPeriod;     // 交货期
    private String brand;              // 品牌
    private String origin;             // 产地
    private String remarks;            // 备注

    // 构造函数
    public SupplierQuotationItem() {}

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

    public Long getInquiryItemId() {
        return inquiryItemId;
    }

    public void setInquiryItemId(Long inquiryItemId) {
        this.inquiryItemId = inquiryItemId;
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
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDeliveryPeriod() {
        return deliveryPeriod;
    }

    public void setDeliveryPeriod(String deliveryPeriod) {
        this.deliveryPeriod = deliveryPeriod;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}