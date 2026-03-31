package com.lifei.psi.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 库存入库单请求DTO
 */
public class InventoryReceiptRequest {
    
    @NotBlank(message = "入库类型不能为空")
    private String receiptType;        // 入库类型：PURCHASE(采购入库), PURCHASE_RETURN(采购退货出库), INVENTORY_GAIN(盘盈入库), WEIGHT_GAIN(涨吨入库), OTHER(其他入库)
    
    @NotNull(message = "仓库ID不能为空")
    private Long warehouseId;          // 仓库ID
    
    private Long supplierId;           // 供应商ID
    
    private Long purchaseOrderId;      // 关联采购订单ID
    
    @NotBlank(message = "操作员不能为空")
    private String operator;           // 操作员
    
    private Boolean autoGeneratePayable; // 是否自动生成应付款
    
    private String remarks;            // 备注
    
    @Valid
    private List<InventoryReceiptItemRequest> items; // 入库明细

    // 构造函数
    public InventoryReceiptRequest() {}

    // Getter和Setter方法
    public String getReceiptType() {
        return receiptType;
    }

    public void setReceiptType(String receiptType) {
        this.receiptType = receiptType;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public Long getPurchaseOrderId() {
        return purchaseOrderId;
    }

    public void setPurchaseOrderId(Long purchaseOrderId) {
        this.purchaseOrderId = purchaseOrderId;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public Boolean getAutoGeneratePayable() {
        return autoGeneratePayable;
    }

    public void setAutoGeneratePayable(Boolean autoGeneratePayable) {
        this.autoGeneratePayable = autoGeneratePayable;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<InventoryReceiptItemRequest> getItems() {
        return items;
    }

    public void setItems(List<InventoryReceiptItemRequest> items) {
        this.items = items;
    }
}