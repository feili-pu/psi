package com.lifei.psi.dto;

import java.util.List;

public class SalesQuotationRequest {
    private String customerName;
    private String customerContact;
    private String salesperson;
    private Boolean includeTax;
    private String remarks;
    private List<SalesQuotationItemRequest> items;

    // 构造函数
    public SalesQuotationRequest() {}

    // Getter和Setter方法
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

    public Boolean getIncludeTax() {
        return includeTax;
    }

    public void setIncludeTax(Boolean includeTax) {
        this.includeTax = includeTax;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<SalesQuotationItemRequest> getItems() {
        return items;
    }

    public void setItems(List<SalesQuotationItemRequest> items) {
        this.items = items;
    }
}