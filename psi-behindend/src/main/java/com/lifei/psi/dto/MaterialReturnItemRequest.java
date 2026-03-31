package com.lifei.psi.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * 生产退料明细请求DTO
 */
public class MaterialReturnItemRequest {
    
    @NotNull(message = "物料ID不能为空")
    private Long productId;            // 物料ID
    
    @NotNull(message = "退料数量不能为空")
    @DecimalMin(value = "0.01", message = "退料数量必须大于0")
    private BigDecimal returnQuantity; // 退料数量
    
    @NotBlank(message = "单位不能为空")
    private String unit;               // 单位
    
    private String remarks;            // 备注

    // 构造函数
    public MaterialReturnItemRequest() {}

    // Getter和Setter方法
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getReturnQuantity() {
        return returnQuantity;
    }

    public void setReturnQuantity(BigDecimal returnQuantity) {
        this.returnQuantity = returnQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}