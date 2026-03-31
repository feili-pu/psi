package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 序列号入库明细实体类
 */
public class SerialNumberReceiptItem {
    private Long id;
    private Long receiptId;            // 入库单ID
    private Long productId;            // 产品ID
    private String serialNumber;       // 序列号
    private BigDecimal unitPrice;      // 单价
    private String batchNo;            // 批次号
    private LocalDate productionDate;  // 生产日期
    private LocalDate expiryDate;      // 有效期
    private String qualityStatus;      // 质量状态：QUALIFIED(合格), UNQUALIFIED(不合格), PENDING(待检)
    private String location;           // 存放位置
    private String remarks;            // 备注

    // 构造函数
    public SerialNumberReceiptItem() {}

    public SerialNumberReceiptItem(Long receiptId, Long productId, String serialNumber) {
        this.receiptId = receiptId;
        this.productId = productId;
        this.serialNumber = serialNumber;
        this.qualityStatus = "QUALIFIED";
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReceiptId() {
        return receiptId;
    }

    public void setReceiptId(Long receiptId) {
        this.receiptId = receiptId;
    }

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