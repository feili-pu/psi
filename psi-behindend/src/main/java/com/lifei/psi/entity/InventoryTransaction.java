package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存流水实体类
 */
public class InventoryTransaction {
    private Long id;
    private String transactionNo;      // 流水号
    private Long warehouseId;          // 仓库ID
    private Long productId;            // 产品ID
    private String transactionType;    // 交易类型：IN(入库), OUT(出库)
    private String businessType;       // 业务类型：REQUISITION(领料), RETURN(退料), RECEIPT(入库), ASSEMBLY(组装), DISASSEMBLY(拆卸)
    private Long referenceId;          // 关联单据ID
    private String referenceNo;        // 关联单据号
    private BigDecimal quantity;       // 数量
    private BigDecimal unitCost;       // 单位成本
    private BigDecimal totalCost;      // 总成本
    private BigDecimal balanceQuantity; // 结余数量
    private LocalDateTime transactionDate; // 交易日期
    private String operator;           // 操作员
    private String remarks;            // 备注
    private LocalDateTime createdTime;

    // 构造函数
    public InventoryTransaction() {}

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

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public BigDecimal getBalanceQuantity() {
        return balanceQuantity;
    }

    public void setBalanceQuantity(BigDecimal balanceQuantity) {
        this.balanceQuantity = balanceQuantity;
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