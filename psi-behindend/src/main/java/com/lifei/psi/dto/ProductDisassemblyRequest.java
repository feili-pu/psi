package com.lifei.psi.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * 产品拆卸单请求DTO
 */
public class ProductDisassemblyRequest {
    
    @NotNull(message = "BOM ID不能为空")
    private Long bomId;                // BOM ID
    
    @NotNull(message = "拆卸数量不能为空")
    @DecimalMin(value = "0.01", message = "拆卸数量必须大于0")
    private BigDecimal disassemblyQuantity; // 拆卸数量
    
    @NotNull(message = "仓库ID不能为空")
    private Long warehouseId;          // 仓库ID
    
    @NotBlank(message = "操作员不能为空")
    private String operator;           // 操作员
    
    private String remarks;            // 备注

    // 构造函数
    public ProductDisassemblyRequest() {}

    // Getter和Setter方法
    public Long getBomId() {
        return bomId;
    }

    public void setBomId(Long bomId) {
        this.bomId = bomId;
    }

    public BigDecimal getDisassemblyQuantity() {
        return disassemblyQuantity;
    }

    public void setDisassemblyQuantity(BigDecimal disassemblyQuantity) {
        this.disassemblyQuantity = disassemblyQuantity;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}