package com.lifei.psi.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

/**
 * 生产领料请求DTO
 */
@Schema(description = "生产领料请求对象")
public class MaterialRequisitionRequest {
    @Schema(description = "关联BOM ID", example = "1")
    private Long bomId;
    
    @Schema(description = "生产订单号", example = "MO20240101001")
    @Size(max = 50, message = "生产订单号长度不能超过50个字符")
    private String productionOrderNo;
    
    @Schema(description = "领料部门", example = "生产部", required = true)
    @NotBlank(message = "领料部门不能为空")
    @Size(max = 100, message = "领料部门长度不能超过100个字符")
    private String department;
    
    @Schema(description = "申请人", example = "张三", required = true)
    @NotBlank(message = "申请人不能为空")
    @Size(max = 50, message = "申请人长度不能超过50个字符")
    private String applicant;
    
    @Schema(description = "生产数量", example = "100")
    private BigDecimal productionQuantity;
    
    @Schema(description = "出库仓库ID", example = "1", required = true)
    @NotNull(message = "出库仓库ID不能为空")
    private Long warehouseId;
    
    @Schema(description = "备注", example = "紧急生产需求")
    @Size(max = 1000, message = "备注长度不能超过1000个字符")
    private String remarks;
    
    @Schema(description = "领料明细列表", required = true)
    @NotEmpty(message = "领料明细不能为空")
    @Valid
    private List<MaterialRequisitionItemRequest> items;

    // 构造函数
    public MaterialRequisitionRequest() {}

    // Getter和Setter方法
    public Long getBomId() {
        return bomId;
    }

    public void setBomId(Long bomId) {
        this.bomId = bomId;
    }

    public String getProductionOrderNo() {
        return productionOrderNo;
    }

    public void setProductionOrderNo(String productionOrderNo) {
        this.productionOrderNo = productionOrderNo;
    }

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

    public BigDecimal getProductionQuantity() {
        return productionQuantity;
    }

    public void setProductionQuantity(BigDecimal productionQuantity) {
        this.productionQuantity = productionQuantity;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<MaterialRequisitionItemRequest> getItems() {
        return items;
    }

    public void setItems(List<MaterialRequisitionItemRequest> items) {
        this.items = items;
    }
}