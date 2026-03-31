package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 生产领料单实体类
 */
public class MaterialRequisition {
    private Long id;
    private String requisitionNo;      // 领料单号
    private Long bomId;                // 关联BOM ID
    private String productionOrderNo;  // 生产订单号
    private String department;         // 领料部门
    private String applicant;          // 申请人
    private LocalDateTime requisitionDate; // 领料日期
    private BigDecimal productionQuantity; // 生产数量
    private Long warehouseId;          // 出库仓库ID
    private String status;             // 状态
    private String remarks;            // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public MaterialRequisition() {}

    public MaterialRequisition(String department, String applicant, Long warehouseId) {
        this.department = department;
        this.applicant = applicant;
        this.warehouseId = warehouseId;
        this.requisitionDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRequisitionNo() {
        return requisitionNo;
    }

    public void setRequisitionNo(String requisitionNo) {
        this.requisitionNo = requisitionNo;
    }

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

    public LocalDateTime getRequisitionDate() {
        return requisitionDate;
    }

    public void setRequisitionDate(LocalDateTime requisitionDate) {
        this.requisitionDate = requisitionDate;
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