package com.lifei.psi.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * 采购询价请求DTO
 */
public class PurchaseInquiryRequest {
    private Long requestId;            // 关联申请单ID（可选）
    
    @NotBlank(message = "询价标题不能为空")
    @Size(max = 200, message = "询价标题长度不能超过200个字符")
    private String title;
    
    @NotBlank(message = "询价人不能为空")
    @Size(max = 50, message = "询价人名称长度不能超过50个字符")
    private String inquirer;
    
    private String deadlineDate;       // 报价截止日期字符串
    
    @Size(max = 1000, message = "备注长度不能超过1000个字符")
    private String remarks;
    
    @NotEmpty(message = "询价明细不能为空")
    @Valid
    private List<PurchaseInquiryItemRequest> items;

    // 构造函数
    public PurchaseInquiryRequest() {}

    // Getter和Setter方法
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

    public String getDeadlineDate() {
        return deadlineDate;
    }

    public void setDeadlineDate(String deadlineDate) {
        this.deadlineDate = deadlineDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<PurchaseInquiryItemRequest> getItems() {
        return items;
    }

    public void setItems(List<PurchaseInquiryItemRequest> items) {
        this.items = items;
    }
}