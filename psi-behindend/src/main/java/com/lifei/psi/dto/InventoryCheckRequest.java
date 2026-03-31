package com.lifei.psi.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 盘点单请求DTO
 */
public class InventoryCheckRequest {
    
    @NotNull(message = "仓库ID不能为空")
    private Long warehouseId;          // 仓库ID
    
    @NotBlank(message = "盘点类型不能为空")
    private String checkType;          // 盘点类型：FULL(全盘), PARTIAL(部分盘点), CYCLE(循环盘点)
    
    @NotBlank(message = "盘点人不能为空")
    private String checker;            // 盘点人
    
    private String remarks;            // 备注
    
    @Valid
    private List<InventoryCheckItemRequest> items; // 盘点明细

    // 构造函数
    public InventoryCheckRequest() {}

    // Getter和Setter方法
    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getCheckType() {
        return checkType;
    }

    public void setCheckType(String checkType) {
        this.checkType = checkType;
    }

    public String getChecker() {
        return checker;
    }

    public void setChecker(String checker) {
        this.checker = checker;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<InventoryCheckItemRequest> getItems() {
        return items;
    }

    public void setItems(List<InventoryCheckItemRequest> items) {
        this.items = items;
    }
}