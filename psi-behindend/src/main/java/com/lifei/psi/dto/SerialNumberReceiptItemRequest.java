package com.lifei.psi.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 序列号入库明细请求DTO
 */
public class SerialNumberReceiptItemRequest {
    
    @NotNull(message = "产品ID不能为空")
    private Long productId;            // 产品ID
    
    @NotBlank(message = "序列号不能为空")
    private String serialNumber;       // 序列号
    
    @DecimalMin(value = "0", message = "单价不能为负数")
    private BigDecimal unitPrice;      // 单价
    
    private String batchNo;            // 批次号
    
    private LocalDate productionDate;  // 生产日期
    
    private LocalDate expiryDate;      // 有效期
    
    private String qualityStatus;      // 质量状态：QUALIFIED(合格), UNQUALIFIED(不合格), PENDING(待检)
    
    private String location;           // 存放位置
    
    private String remarks;            // 备注

    // 构造函数
    public SerialNumberReceiptItemRequest() {}

    // Getter和Setter方法
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}