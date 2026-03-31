package com.lifei.psi.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * 采购询价明细请求DTO
 */
public class PurchaseInquiryItemRequest {
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
    
    @NotNull(message = "询价数量不能为空")
    @DecimalMin(value = "0.01", message = "询价数量必须大于0")
    private BigDecimal quantity;
    
    private String technicalRequirements; // 技术要求
    
    @Size(max = 500, message = "备注长度不能超过500个字符")
    private String remarks;

    // 构造函数
    public PurchaseInquiryItemRequest() {}

    // Getter和Setter方法
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