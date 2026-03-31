package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 序列号入库单实体类
 */
public class SerialNumberReceipt {
    private Long id;
    private String receiptNo;          // 入库单号
    private String receiptType;        // 入库类型：PURCHASE_SN(采购入库SN), PURCHASE_RETURN_SN(采购退货出库SN), INVENTORY_GAIN_SN(盘盈入库SN), OTHER_SN(其他入库SN)
    private Long warehouseId;          // 仓库ID
    private Long supplierId;           // 供应商ID
    private Long purchaseOrderId;      // 关联采购订单ID
    private LocalDateTime receiptDate; // 入库日期
    private String operator;           // 操作员
    private Integer totalQuantity;     // 总数量（序列号个数）
    private BigDecimal totalAmount;    // 总金额
    private String status;             // 状态
    private Boolean autoGeneratePayable; // 是否自动生成应付款
    private Boolean payableGenerated;  // 应付款是否已生成
    private String remarks;            // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public SerialNumberReceipt() {}

    public SerialNumberReceipt(String receiptType, Long warehouseId, String operator) {
        this.receiptType = receiptType;
        this.warehouseId = warehouseId;
        this.operator = operator;
        this.receiptDate = LocalDateTime.now();
        this.status = "PENDING";
        this.totalQuantity = 0;
        this.totalAmount = BigDecimal.ZERO;
        this.autoGeneratePayable = false;
        this.payableGenerated = false;
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

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public Long getPurchaseOrderId() {
        return purchaseOrderId;
    }

    public void setPurchaseOrderId(Long purchaseOrderId) {
        this.purchaseOrderId = purchaseOrderId;
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

    public Integer getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Integer totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getAutoGeneratePayable() {
        return autoGeneratePayable;
    }

    public void setAutoGeneratePayable(Boolean autoGeneratePayable) {
        this.autoGeneratePayable = autoGeneratePayable;
    }

    public Boolean getPayableGenerated() {
        return payableGenerated;
    }

    public void setPayableGenerated(Boolean payableGenerated) {
        this.payableGenerated = payableGenerated;
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