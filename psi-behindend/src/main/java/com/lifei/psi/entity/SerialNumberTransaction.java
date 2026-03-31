package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 序列号流水实体类
 */
public class SerialNumberTransaction {
    private Long id;
    private String transactionNo;      // 流水号
    private Long warehouseId;          // 仓库ID
    private Long productId;            // 产品ID
    private String serialNumber;       // 序列号
    private String transactionType;    // 交易类型：IN(入库), OUT(出库)
    private String businessType;       // 业务类型：PURCHASE_SN(采购入库), PURCHASE_RETURN_SN(采购退货), INVENTORY_GAIN_SN(盘盈), OTHER_SN(其他)
    private Long referenceId;          // 关联单据ID
    private String referenceNo;        // 关联单据号
    private BigDecimal unitCost;       // 单位成本
    private String fromStatus;         // 原状态
    private String toStatus;           // 新状态
    private LocalDateTime transactionDate; // 交易日期
    private String operator;           // 操作员
    private String remarks;            // 备注
    private LocalDateTime createdTime;

    // 构造函数
    public SerialNumberTransaction() {}

    public SerialNumberTransaction(Long warehouseId, Long productId, String serialNumber, 
                                 String transactionType, String businessType) {
        this.warehouseId = warehouseId;
        this.productId = productId;
        this.serialNumber = serialNumber;
        this.transactionType = transactionType;
        this.businessType = businessType;
        this.transactionDate = LocalDateTime.now();
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionNo() {
        return transactionNo;
    }

    public void setTransactionNo(String transactionNo) {
        this.transactionNo = transactionNo;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
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

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public Long getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Long referenceId) {
        this.referenceId = referenceId;
    }

    public String getReferenceNo() {
        return referenceNo;
    }

    public void setReferenceNo(String referenceNo) {
        this.referenceNo = referenceNo;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public String getFromStatus() {
        return fromStatus;
    }

    public void setFromStatus(String fromStatus) {
        this.fromStatus = fromStatus;
    }

    public String getToStatus() {
        return toStatus;
    }

    public void setToStatus(String toStatus) {
        this.toStatus = toStatus;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
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

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }
}