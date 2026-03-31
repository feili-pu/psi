package com.lifei.psi.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * 采购申请明细请求DTO
 */
@Schema(description = "采购申请明细请求对象")
public class PurchaseRequestItemRequest {
    @Schema(description = "产品名称", example = "笔记本电脑", required = true)
    @NotBlank(message = "产品名称不能为空")
    @Size(max = 100, message = "产品名称长度不能超过100个字符")
    private String productName;
    
    @Schema(description = "产品编码", example = "NB001")
    @Size(max = 50, message = "产品编码长度不能超过50个字符")
    private String productCode;
    
    @Schema(description = "规格型号", example = "ThinkPad X1 Carbon")
    @Size(max = 200, message = "规格型号长度不能超过200个字符")
    private String specification;
    
    @Schema(description = "单位", example = "台", required = true)
    @NotBlank(message = "单位不能为空")
    @Size(max = 20, message = "单位长度不能超过20个字符")
    private String unit;
    
    @Schema(description = "申请数量", example = "5", required = true)
    @NotNull(message = "申请数量不能为空")
    @DecimalMin(value = "0.01", message = "申请数量必须大于0")
    private BigDecimal quantity;
    
    @Schema(description = "预估单价", example = "8000.00")
    @DecimalMin(value = "0.00", message = "预估单价不能为负数")
    private BigDecimal estimatedPrice;
    
    @Schema(description = "用途说明", example = "办公使用")
    @Size(max = 200, message = "用途说明长度不能超过200个字符")
    private String purpose;
    
    @Schema(description = "备注", example = "需要预装Office软件")
    @Size(max = 500, message = "备注长度不能超过500个字符")
    private String remarks;

    // 构造函数
    public PurchaseRequestItemRequest() {}

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

    public BigDecimal getEstimatedPrice() {
        return estimatedPrice;
    }

    public void setEstimatedPrice(BigDecimal estimatedPrice) {
        this.estimatedPrice = estimatedPrice;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}