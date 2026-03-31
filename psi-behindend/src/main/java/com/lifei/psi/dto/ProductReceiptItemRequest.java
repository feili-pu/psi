package com.lifei.psi.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 产品入库明细请求DTO
 */
public class ProductReceiptItemRequest {
    
    @NotNull(message = "产品ID不能为空")
    private Long productId;            // 产品ID
    
    @NotNull(message = "入库数量不能为空")
    @DecimalMin(value = "0.01", message = "入库数量必须大于0")
    private BigDecimal quantity;       // 入库数量
    
    @NotBlank(message = "单位不能为空")
    private String unit;               // 单位
    
    @DecimalMin(value = "0", message = "单位成本不能为负数")
    private BigDecimal unitCost;       // 单位成本
    
    private String batchNo;            // 批次号
    
    private LocalDate productionDate;  // 生产日期
    
    private LocalDate expiryDate;      // 有效期
    
    private String remarks;            // 备注

    // 构造函数
    public ProductReceiptItemRequest() {}

    // Getter和Setter方法
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