package com.lifei.psi.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * 供应商报价明细请求DTO
 */
public class SupplierQuotationItemRequest {
    private Long inquiryItemId;        // 询价明细ID
    
    @NotBlank(message = "产品名称不能为空")
    @Size(max = 100, message = "产品名称长度不能超过100个字符")
    private String productName;
    
    @Size(max = 50, message = "产品编码长度不能超过50个字符")
    private String productCode;
    
    @Size(max = 200, message = "规格型号长度不能超过200个字符")
    private String specification;
    
    @NotBlank(message = "单位不能为空")
    @Size(max = 20, message = "单位长度不能超过20个字符")
    private String unit;
    
    @NotNull(message = "报价数量不能为空")
    @DecimalMin(value = "0.01", message = "报价数量必须大于0")
    private BigDecimal quantity;
    
    @NotNull(message = "单价不能为空")
    @DecimalMin(value = "0.00", message = "单价不能为负数")
    private BigDecimal unitPrice;
    
    @Size(max = 50, message = "交货期长度不能超过50个字符")
    private String deliveryPeriod;
    
    @Size(max = 50, message = "品牌长度不能超过50个字符")
    private String brand;
    
    @Size(max = 50, message = "产地长度不能超过50个字符")
    private String origin;
    
    @Size(max = 500, message = "备注长度不能超过500个字符")
    private String remarks;

    // 构造函数
    public SupplierQuotationItemRequest() {}

    // Getter和Setter方法
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