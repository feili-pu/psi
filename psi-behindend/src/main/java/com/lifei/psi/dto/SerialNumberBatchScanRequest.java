package com.lifei.psi.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

/**
 * 序列号批量扫码入库请求DTO
 */
public class SerialNumberBatchScanRequest {
    
    @NotBlank(message = "入库类型不能为空")
    private String receiptType;        // 入库类型
    
    @NotNull(message = "仓库ID不能为空")
    private Long warehouseId;          // 仓库ID
    
    @NotNull(message = "产品ID不能为空")
    private Long productId;            // 产品ID
    
    @NotEmpty(message = "序列号列表不能为空")
    private List<String> serialNumbers; // 序列号列表
    
    @DecimalMin(value = "0", message = "单价不能为负数")
    private BigDecimal unitPrice;      // 单价
    
    private Long supplierId;           // 供应商ID
    
    private Long purchaseOrderId;      // 关联采购订单ID
    
    @NotBlank(message = "操作员不能为空")
    private String operator;           // 操作员
    
    private Boolean autoGeneratePayable; // 是否自动生成应付款
    
    private String batchNo;            // 批次号
    
    private String location;           // 存放位置
    
    private String remarks;            // 备注

    // 构造函数
    public SerialNumberBatchScanRequest() {}

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

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public List<String> getSerialNumbers() {
        return serialNumbers;
    }

    public void setSerialNumbers(List<String> serialNumbers) {
        this.serialNumbers = serialNumbers;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
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

    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}