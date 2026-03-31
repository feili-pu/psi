package com.lifei.psi.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 生产退料单请求DTO
 */
public class MaterialReturnRequest {
    
    private Long requisitionId;        // 关联领料单ID
    
    private String productionOrderNo;  // 生产订单号
    
    @NotBlank(message = "退料部门不能为空")
    private String department;         // 退料部门
    
    @NotBlank(message = "退料人不能为空")
    private String returner;           // 退料人
    
    @NotNull(message = "入库仓库不能为空")
    private Long warehouseId;          // 入库仓库ID
    
    private String returnReason;       // 退料原因
    
    private String remarks;            // 备注
    
    @Valid
    private List<MaterialReturnItemRequest> items; // 退料明细

    // 构造函数
    public MaterialReturnRequest() {}

    // Getter和Setter方法
    public Long getRequisitionId() {
        return requisitionId;
    }

    public void setRequisitionId(Long requisitionId) {
        this.requisitionId = requisitionId;
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

    public String getReturner() {
        return returner;
    }

    public void setReturner(String returner) {
        this.returner = returner;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getReturnReason() {
        return returnReason;
    }

    public void setReturnReason(String returnReason) {
        this.returnReason = returnReason;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<MaterialReturnItemRequest> getItems() {
        return items;
    }

    public void setItems(List<MaterialReturnItemRequest> items) {
        this.items = items;
    }
}