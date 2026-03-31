package com.lifei.psi.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 采购询价实体类
 */
public class PurchaseInquiry {
    private Long id;
    private String inquiryNo;          // 询价单号
    private Long requestId;            // 关联申请单ID
    private String title;              // 询价标题
    private String inquirer;           // 询价人
    private LocalDateTime inquiryDate; // 询价日期
    private LocalDate deadlineDate;    // 报价截止日期
    private String status;             // 状态
    private String remarks;            // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public PurchaseInquiry() {}

    public PurchaseInquiry(String title, String inquirer, LocalDate deadlineDate) {
        this.title = title;
        this.inquirer = inquirer;
        this.deadlineDate = deadlineDate;
        this.inquiryDate = LocalDateTime.now();
        this.status = "ACTIVE";
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInquiryNo() {
        return inquiryNo;
    }

    public void setInquiryNo(String inquiryNo) {
        this.inquiryNo = inquiryNo;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInquirer() {
        return inquirer;
    }

    public void setInquirer(String inquirer) {
        this.inquirer = inquirer;
    }

    public LocalDateTime getInquiryDate() {
        return inquiryDate;
    }

    public void setInquiryDate(LocalDateTime inquiryDate) {
        this.inquiryDate = inquiryDate;
    }

    public LocalDate getDeadlineDate() {
        return deadlineDate;
    }

    public void setDeadlineDate(LocalDate deadlineDate) {
        this.deadlineDate = deadlineDate;
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