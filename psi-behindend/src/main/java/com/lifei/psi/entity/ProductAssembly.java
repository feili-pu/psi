package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 产品组装单实体类
 */
public class ProductAssembly {
    private Long id;
    private String assemblyNo;         // 组装单号
    private Long bomId;                // BOM ID
    private BigDecimal assemblyQuantity; // 组装数量
    private Long warehouseId;          // 仓库ID
    private LocalDateTime assemblyDate; // 组装日期
    private String operator;           // 操作员
    private String status;             // 状态
    private String remarks;            // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public ProductAssembly() {}

    public ProductAssembly(Long bomId, BigDecimal assemblyQuantity, Long warehouseId, String operator) {
        this.bomId = bomId;
        this.assemblyQuantity = assemblyQuantity;
        this.warehouseId = warehouseId;
        this.operator = operator;
        this.assemblyDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAssemblyNo() {
        return assemblyNo;
    }

    public void setAssemblyNo(String assemblyNo) {
        this.assemblyNo = assemblyNo;
    }

    public Long getBomId() {
        return bomId;
    }

    public void setBomId(Long bomId) {
        this.bomId = bomId;
    }

    public BigDecimal getAssemblyQuantity() {
        return assemblyQuantity;
    }

    public void setAssemblyQuantity(BigDecimal assemblyQuantity) {
        this.assemblyQuantity = assemblyQuantity;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public LocalDateTime getAssemblyDate() {
        return assemblyDate;
    }

    public void setAssemblyDate(LocalDateTime assemblyDate) {
        this.assemblyDate = assemblyDate;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public LocalDateTime getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(LocalDateTime updatedTime) {
        this.updatedTime = updatedTime;
    }
}