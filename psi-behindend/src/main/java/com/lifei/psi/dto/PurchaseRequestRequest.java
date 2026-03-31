package com.lifei.psi.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * 采购申请请求DTO
 */
@Schema(description = "采购申请请求对象")
public class PurchaseRequestRequest {
    @Schema(description = "申请部门", example = "技术部", required = true)
    @NotBlank(message = "申请部门不能为空")
    @Size(max = 100, message = "申请部门长度不能超过100个字符")
    private String department;
    
    @Schema(description = "申请人", example = "张三", required = true)
    @NotBlank(message = "申请人不能为空")
    @Size(max = 50, message = "申请人长度不能超过50个字符")
    private String applicant;
    
    @Schema(description = "需求日期", example = "2024-02-15", format = "date")
    private String requiredDate;       // 需求日期字符串
    
    @Schema(description = "备注", example = "紧急采购需求")
    @Size(max = 1000, message = "备注长度不能超过1000个字符")
    private String remarks;
    
    @Schema(description = "申请明细列表", required = true)
    @NotEmpty(message = "申请明细不能为空")
    @Valid
    private List<PurchaseRequestItemRequest> items;

    // 构造函数
    public PurchaseRequestRequest() {}

    // Getter和Setter方法
    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getApplicant() {
        return applicant;
    }

    public void setApplicant(String applicant) {
        this.applicant = applicant;
    }

    public String getRequiredDate() {
        return requiredDate;
    }

    public void setRequiredDate(String requiredDate) {
        this.requiredDate = requiredDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<PurchaseRequestItemRequest> getItems() {
        return items;
    }

    public void setItems(List<PurchaseRequestItemRequest> items) {
        this.items = items;
    }
}