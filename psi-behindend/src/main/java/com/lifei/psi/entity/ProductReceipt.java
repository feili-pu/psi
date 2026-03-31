package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 产品入库单实体类
 */
public class ProductReceipt {
    private Long id;
    private String receiptNo;          // 入库单号
    private String productionOrderNo;  // 生产订单号
    private String receiptType;        // 入库类型：PRODUCTION(生产入库), PURCHASE(采购入库), OTHER(其他入库)
    private Long warehouseId;          // 入库仓库ID
    private LocalDateTime receiptDate; // 入库日期
    private String operator;           // 操作员
    private BigDecimal totalQuantity;  // 总数量
    private BigDecimal totalCost;      // 总成本
    private String status;             // 状态
    private String remarks;            // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public ProductReceipt() {}

    public ProductReceipt(String receiptType, Long warehouseId, String operator) {
        this.receiptType = receiptType;
        this.warehouseId = warehouseId;
        this.operator = operator;
        this.receiptDate = LocalDateTime.now();
        this.status = "PENDING";
        this.totalQuantity = BigDecimal.ZERO;
        this.totalCost = BigDecimal.ZERO;
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReceiptNo() {
        return receiptNo;
    }

    public void setReceiptNo(String receiptNo) {
        this.receiptNo = receiptNo;
    }

    public String getProductionOrderNo() {
        return productionOrderNo;
    }

    public void setProductionOrderNo(String productionOrderNo) {
        this.productionOrderNo = productionOrderNo;
    }

    public String getReceiptType() {
        return receiptType;
    }

    public void setReceiptType(String receiptType) {
        this.receiptType = receiptType;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public LocalDateTime getReceiptDate() {
        return receiptDate;
    }

    public void setReceiptDate(LocalDateTime receiptDate) {
        this.receiptDate = receiptDate;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public BigDecimal getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(BigDecimal totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public LocalDateTime getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(LocalDateTime updatedTime) {
        this.updatedTime = updatedTime;
    }
}