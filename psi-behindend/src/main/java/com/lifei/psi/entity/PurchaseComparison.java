package com.lifei.psi.entity;

import java.time.LocalDateTime;

/**
 * 采购比价实体类
 */
public class PurchaseComparison {
    private Long id;
    private String comparisonNo;       // 比价单号
    private Long inquiryId;            // 询价单ID
    private String title;              // 比价标题
    private String comparer;           // 比价人
    private LocalDateTime comparisonDate; // 比价日期
    private Long selectedQuotationId;  // 选中的报价单ID
    private String selectionReason;    // 选择理由
    private String status;             // 状态
    private String remarks;            // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public PurchaseComparison() {}

    public PurchaseComparison(Long inquiryId, String title, String comparer) {
        this.inquiryId = inquiryId;
        this.title = title;
        this.comparer = comparer;
        this.comparisonDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComparisonNo() {
        return comparisonNo;
    }

    public void setComparisonNo(String comparisonNo) {
        this.comparisonNo = comparisonNo;
    }

    public Long getInquiryId() {
        return inquiryId;
    }

    public void setInquiryId(Long inquiryId) {
        this.inquiryId = inquiryId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getComparer() {
        return comparer;
    }

    public void setComparer(String comparer) {
        this.comparer = comparer;
    }

    public LocalDateTime getComparisonDate() {
        return comparisonDate;
    }

    public void setComparisonDate(LocalDateTime comparisonDate) {
        this.comparisonDate = comparisonDate;
    }

    public Long getSelectedQuotationId() {
        return selectedQuotationId;
    }

    public void setSelectedQuotationId(Long selectedQuotationId) {
        this.selectedQuotationId = selectedQuotationId;
    }

    public String getSelectionReason() {
        return selectionReason;
    }

    public void setSelectionReason(String selectionReason) {
        this.selectionReason = selectionReason;
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