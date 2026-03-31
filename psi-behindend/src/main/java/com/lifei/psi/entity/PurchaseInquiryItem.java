package com.lifei.psi.entity;

import java.math.BigDecimal;

/**
 * 采购询价明细实体类
 */
public class PurchaseInquiryItem {
    private Long id;
    private Long inquiryId;            // 询价单ID
    private String productName;        // 产品名称
    private String productCode;        // 产品编码
    private String specification;      // 规格型号
    private String unit;               // 单位
    private BigDecimal quantity;       // 询价数量
    private String technicalRequirements; // 技术要求
    private String remarks;            // 备注

    // 构造函数
    public PurchaseInquiryItem() {}

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInquiryId() {
        return inquiryId;
    }

    public void setInquiryId(Long inquiryId) {
        this.inquiryId = inquiryId;
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

    public String getTechnicalRequirements() {
        return technicalRequirements;
    }

    public void setTechnicalRequirements(String technicalRequirements) {
        this.technicalRequirements = technicalRequirements;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}