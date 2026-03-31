package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 产品拆卸单实体类
 */
public class ProductDisassembly {
    private Long id;
    private String disassemblyNo;      // 拆卸单号
    private Long bomId;                // BOM ID
    private BigDecimal disassemblyQuantity; // 拆卸数量
    private Long warehouseId;          // 仓库ID
    private LocalDateTime disassemblyDate; // 拆卸日期
    private String operator;           // 操作员
    private String status;             // 状态
    private String remarks;            // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public ProductDisassembly() {}

    public ProductDisassembly(Long bomId, BigDecimal disassemblyQuantity, Long warehouseId, String operator) {
        this.bomId = bomId;
        this.disassemblyQuantity = disassemblyQuantity;
        this.warehouseId = warehouseId;
        this.operator = operator;
        this.disassemblyDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDisassemblyNo() {
        return disassemblyNo;
    }

    public void setDisassemblyNo(String disassemblyNo) {
        this.disassemblyNo = disassemblyNo;
    }

    public Long getBomId() {
        return bomId;
    }

    public void setBomId(Long bomId) {
        this.bomId = bomId;
    }

    public BigDecimal getDisassemblyQuantity() {
        return disassemblyQuantity;
    }

    public void setDisassemblyQuantity(BigDecimal disassemblyQuantity) {
        this.disassemblyQuantity = disassemblyQuantity;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public LocalDateTime getDisassemblyDate() {
        return disassemblyDate;
    }

    public void setDisassemblyDate(LocalDateTime disassemblyDate) {
        this.disassemblyDate = disassemblyDate;
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