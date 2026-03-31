package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 采购应付款实体类
 */
public class PurchasePayable {
    private Long id;
    private String payableNo;          // 应付款单号
    private Long supplierId;           // 供应商ID
    private Long purchaseOrderId;      // 关联采购订单ID
    private Long receiptId;            // 关联入库单ID
    private String payableType;        // 应付类型：NORMAL(正常), RED_LETTER(红字)
    private BigDecimal totalAmount;    // 应付总金额
    private BigDecimal paidAmount;     // 已付金额
    private BigDecimal unpaidAmount;   // 未付金额
    private LocalDate dueDate;         // 到期日期
    private String status;             // 状态：UNPAID(未付), PARTIAL_PAID(部分已付), PAID(已付)
    private String remarks;            // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public PurchasePayable() {}

    public PurchasePayable(Long supplierId, BigDecimal totalAmount, String payableType) {
        this.supplierId = supplierId;
        this.totalAmount = totalAmount;
        this.payableType = payableType;
        this.paidAmount = BigDecimal.ZERO;
        this.unpaidAmount = totalAmount;
        this.status = "UNPAID";
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPayableNo() {
        return payableNo;
    }

    public void setPayableNo(String payableNo) {
        this.payableNo = payableNo;
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

    public Long getReceiptId() {
        return receiptId;
    }

    public void setReceiptId(Long receiptId) {
        this.receiptId = receiptId;
    }

    public String getPayableType() {
        return payableType;
    }

    public void setPayableType(String payableType) {
        this.payableType = payableType;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }

    public BigDecimal getUnpaidAmount() {
        return unpaidAmount;
    }

    public void setUnpaidAmount(BigDecimal unpaidAmount) {
        this.unpaidAmount = unpaidAmount;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
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