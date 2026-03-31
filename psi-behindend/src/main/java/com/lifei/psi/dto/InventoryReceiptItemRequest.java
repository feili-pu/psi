package com.lifei.psi.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 库存入库明细请求DTO
 */
public class InventoryReceiptItemRequest {
    
    @NotNull(message = "产品ID不能为空")
    private Long productId;            // 产品ID
    
    @NotNull(message = "数量不能为空")
    @DecimalMin(value = "0.01", message = "数量必须大于0")
    private BigDecimal quantity;       // 数量
    
    @NotBlank(message = "单位不能为空")
    private String unit;               // 单位
    
    @DecimalMin(value = "0", message = "单价不能为负数")
    private BigDecimal unitPrice;      // 单价
    
    private String batchNo;            // 批次号
    
    private LocalDate productionDate;  // 生产日期
    
    private LocalDate expiryDate;      // 有效期
    
    private String qualityStatus;      // 质量状态：QUALIFIED(合格), UNQUALIFIED(不合格), PENDING(待检)
    
    private String remarks;            // 备注

    // 构造函数
    public InventoryReceiptItemRequest() {}

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

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
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

    public String getQualityStatus() {
        return qualityStatus;
    }

    public void setQualityStatus(String qualityStatus) {
        this.qualityStatus = qualityStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}