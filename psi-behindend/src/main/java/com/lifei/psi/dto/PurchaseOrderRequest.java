package com.lifei.psi.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * 采购订单请求DTO
 */
public class PurchaseOrderRequest {
    private Long quotationId;          // 关联报价单ID（可选）
    
    @NotBlank(message = "供应商名称不能为空")
    @Size(max = 100, message = "供应商名称长度不能超过100个字符")
    private String supplierName;
    
    @Size(max = 100, message = "供应商联系方式长度不能超过100个字符")
    private String supplierContact;
    
    @NotBlank(message = "采购员不能为空")
    @Size(max = 50, message = "采购员名称长度不能超过50个字符")
    private String purchaser;
    
    private String deliveryDate;       // 交货日期字符串
    private Boolean includeTax;
    
    @Size(max = 200, message = "付款条件长度不能超过200个字符")
    private String paymentTerms;       // 付款条件
    
    @Size(max = 500, message = "交货地址长度不能超过500个字符")
    private String deliveryAddress;    // 交货地址
    
    @Size(max = 1000, message = "备注长度不能超过1000个字符")
    private String remarks;
    
    @NotEmpty(message = "订单明细不能为空")
    @Valid
    private List<PurchaseOrderItemRequest> items;

    // 构造函数
    public PurchaseOrderRequest() {}

    // Getter和Setter方法
    public Long getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(Long quotationId) {
        this.quotationId = quotationId;
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

    public String getPurchaser() {
        return purchaser;
    }

    public void setPurchaser(String purchaser) {
        this.purchaser = purchaser;
    }

    public String getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(String deliveryDate) {
        this.deliveryDate = deliveryDate;
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

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<PurchaseOrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<PurchaseOrderItemRequest> items) {
        this.items = items;
    }
}