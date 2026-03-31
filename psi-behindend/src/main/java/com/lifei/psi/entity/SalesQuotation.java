package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SalesQuotation {
    private Long id;
    private String quotationNo;        // 报价单号
    private String customerName;       // 客户名称
    private String customerContact;    // 客户联系方式
    private String salesperson;        // 销售员
    private LocalDateTime quotationDate;   // 报价日期
    private LocalDateTime validUntil;      // 有效期至
    private BigDecimal totalAmount;        // 总金额
    private Boolean includeTax;            // 是否含税
    private BigDecimal taxRate;            // 税率
    private String status;                 // 状态：DRAFT(草稿), SENT(已发送), ACCEPTED(已接受), REJECTED(已拒绝), EXPIRED(已过期)
    private String remarks;                // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public SalesQuotation() {}

    public SalesQuotation(String customerName, String salesperson, LocalDateTime validUntil, Boolean includeTax) {
        this.customerName = customerName;
        this.salesperson = salesperson;
        this.validUntil = validUntil;
        this.includeTax = includeTax;
        this.quotationDate = LocalDateTime.now();
        this.status = "DRAFT";
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuotationNo() {
        return quotationNo;
    }

    public void setQuotationNo(String quotationNo) {
        this.quotationNo = quotationNo;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerContact() {
        return customerContact;
    }

    public void setCustomerContact(String customerContact) {
        this.customerContact = customerContact;
    }

    public String getSalesperson() {
        return salesperson;
    }

    public void setSalesperson(String salesperson) {
        this.salesperson = salesperson;
    }

    public LocalDateTime getQuotationDate() {
        return quotationDate;
    }

    public void setQuotationDate(LocalDateTime quotationDate) {
        this.quotationDate = quotationDate;
    }

    public LocalDateTime getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDateTime validUntil) {
        this.validUntil = validUntil;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Boolean getIncludeTax() {
        return includeTax;
    }

    public void setIncludeTax(Boolean includeTax) {
        this.includeTax = includeTax;
    }

    public BigDecimal getTaxRate() {
        return taxRate;
    }

    public void setTaxRate(BigDecimal taxRate) {
        this.taxRate = taxRate;
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