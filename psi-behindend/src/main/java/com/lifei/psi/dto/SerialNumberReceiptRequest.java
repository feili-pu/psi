package com.lifei.psi.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 序列号入库单请求DTO
 */
public class SerialNumberReceiptRequest {
    
    @NotBlank(message = "入库类型不能为空")
    private String receiptType;        // 入库类型：PURCHASE_SN(采购入库SN), PURCHASE_RETURN_SN(采购退货出库SN), INVENTORY_GAIN_SN(盘盈入库SN), OTHER_SN(其他入库SN)
    
    @NotNull(message = "仓库ID不能为空")
    private Long warehouseId;          // 仓库ID
    
    private Long supplierId;           // 供应商ID
    
    private Long purchaseOrderId;      // 关联采购订单ID
    
    @NotBlank(message = "操作员不能为空")
    private String operator;           // 操作员
    
    private Boolean autoGeneratePayable; // 是否自动生成应付款
    
    private String remarks;            // 备注
    
    @Valid
    private List<SerialNumberReceiptItemRequest> items; // 入库明细

    // 构造函数
    public SerialNumberReceiptRequest() {}

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

    public List<SerialNumberReceiptItemRequest> getItems() {
        return items;
    }

    public void setItems(List<SerialNumberReceiptItemRequest> items) {
        this.items = items;
    }
}