package com.lifei.psi.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * 生产领料明细请求DTO
 */
@Schema(description = "生产领料明细请求对象")
public class MaterialRequisitionItemRequest {
    @Schema(description = "物料ID", example = "1", required = true)
    @NotNull(message = "物料ID不能为空")
    private Long productId;
    
    @Schema(description = "需求数量", example = "50", required = true)
    @NotNull(message = "需求数量不能为空")
    @DecimalMin(value = "0.01", message = "需求数量必须大于0")
    private BigDecimal requiredQuantity;
    
    @Schema(description = "单位", example = "个", required = true)
    @Size(max = 20, message = "单位长度不能超过20个字符")
    private String unit;
    
    @Schema(description = "备注", example = "优先使用批次号ABC001的物料")
    @Size(max = 500, message = "备注长度不能超过500个字符")
    private String remarks;

    // 构造函数
    public MaterialRequisitionItemRequest() {}

    // Getter和Setter方法
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getRequiredQuantity() {
        return requiredQuantity;
    }

    public void setRequiredQuantity(BigDecimal requiredQuantity) {
        this.requiredQuantity = requiredQuantity;
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