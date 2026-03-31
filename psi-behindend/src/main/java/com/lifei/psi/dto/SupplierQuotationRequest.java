package com.lifei.psi.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * 供应商报价请求DTO
 */
public class SupplierQuotationRequest {
    @NotNull(message = "询价单ID不能为空")
    private Long inquiryId;            // 询价单ID
    
    @NotBlank(message = "供应商名称不能为空")
    @Size(max = 100, message = "供应商名称长度不能超过100个字符")
    private String supplierName;
    
    @Size(max = 100, message = "供应商联系方式长度不能超过100个字符")
    private String supplierContact;
    
    private String validUntil;         // 报价有效期字符串
    private Boolean includeTax;
    
    @Size(max = 200, message = "付款条件长度不能超过200个字符")
    private String paymentTerms;       // 付款条件
    
    @Size(max = 200, message = "交货条件长度不能超过200个字符")
    private String deliveryTerms;      // 交货条件
    
    @Size(max = 1000, message = "备注长度不能超过1000个字符")
    private String remarks;
    
    @NotEmpty(message = "报价明细不能为空")
    @Valid
    private List<SupplierQuotationItemRequest> items;

    // 构造函数
    public SupplierQuotationRequest() {}

    // Getter和Setter方法
    public Long getInquiryId() {
        return inquiryId;
    }

    public void setInquiryId(Long inquiryId) {
        this.inquiryId = inquiryId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getSupplierContact() {
        return supplierContact;
    }

    public void setSupplierContact(String supplierContact) {
        this.supplierContact = supplierContact;
    }

    public String getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(String validUntil) {
        this.validUntil = validUntil;
    }

    public Boolean getIncludeTax() {
        return includeTax;
    }

    public void setIncludeTax(Boolean includeTax) {
        this.includeTax = includeTax;
    }

    public String getPaymentTerms() {
        return paymentTerms;
    }

    public void setPaymentTerms(String paymentTerms) {
        this.paymentTerms = paymentTerms;
    }

    public String getDeliveryTerms() {
        return deliveryTerms;
    }

    public void setDeliveryTerms(String deliveryTerms) {
        this.deliveryTerms = deliveryTerms;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<SupplierQuotationItemRequest> getItems() {
        return items;
    }

    public void setItems(List<SupplierQuotationItemRequest> items) {
        this.items = items;
    }
}