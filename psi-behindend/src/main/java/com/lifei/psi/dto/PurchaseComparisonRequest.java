package com.lifei.psi.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * 采购比价请求DTO
 */
public class PurchaseComparisonRequest {
    @NotNull(message = "询价单ID不能为空")
    private Long inquiryId;            // 询价单ID
    
    @NotBlank(message = "比价标题不能为空")
    @Size(max = 200, message = "比价标题长度不能超过200个字符")
    private String title;
    
    @NotBlank(message = "比价人不能为空")
    @Size(max = 50, message = "比价人名称长度不能超过50个字符")
    private String comparer;
    
    private Long selectedQuotationId;  // 选中的报价单ID
    
    @Size(max = 1000, message = "选择理由长度不能超过1000个字符")
    private String selectionReason;    // 选择理由
    
    @Size(max = 1000, message = "备注长度不能超过1000个字符")
    private String remarks;

    // 构造函数
    public PurchaseComparisonRequest() {}

    // Getter和Setter方法
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}