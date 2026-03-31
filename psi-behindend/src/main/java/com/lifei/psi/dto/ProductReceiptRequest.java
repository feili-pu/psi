package com.lifei.psi.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 产品入库单请求DTO
 */
public class ProductReceiptRequest {
    
    private String productionOrderNo;  // 生产订单号
    
    @NotBlank(message = "入库类型不能为空")
    private String receiptType;        // 入库类型：PRODUCTION(生产入库), PURCHASE(采购入库), OTHER(其他入库)
    
    @NotNull(message = "入库仓库不能为空")
    private Long warehouseId;          // 入库仓库ID
    
    @NotBlank(message = "操作员不能为空")
    private String operator;           // 操作员
    
    private String remarks;            // 备注
    
    @Valid
    private List<ProductReceiptItemRequest> items; // 入库明细

    // 构造函数
    public ProductReceiptRequest() {}

    // Getter和Setter方法
    public String getProductionOrderNo() {
        return productionOrderNo;
    }

    public void setProductionOrderNo(String productionOrderNo) {
        this.productionOrderNo = productionOrderNo;
    }

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

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<ProductReceiptItemRequest> getItems() {
        return items;
    }

    public void setItems(List<ProductReceiptItemRequest> items) {
        this.items = items;
    }
}