package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 盘点单实体类
 */
public class InventoryCheck {
    private Long id;
    private String checkNo;            // 盘点单号
    private Long warehouseId;          // 仓库ID
    private LocalDateTime checkDate;   // 盘点日期
    private String checkType;          // 盘点类型：FULL(全盘), PARTIAL(部分盘点), CYCLE(循环盘点)
    private String checker;            // 盘点人
    private String status;             // 状态：PENDING(盘点中), COMPLETED(已完成), APPROVED(已审核), PROCESSED(已处理)
    private BigDecimal totalGainQuantity;  // 总盘盈数量
    private BigDecimal totalLossQuantity;  // 总盘亏数量
    private BigDecimal totalGainAmount;    // 总盘盈金额
    private BigDecimal totalLossAmount;    // 总盘亏金额
    private String remarks;            // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public InventoryCheck() {}

    public InventoryCheck(Long warehouseId, String checkType, String checker) {
        this.warehouseId = warehouseId;
        this.checkType = checkType;
        this.checker = checker;
        this.checkDate = LocalDateTime.now();
        this.status = "PENDING";
        this.totalGainQuantity = BigDecimal.ZERO;
        this.totalLossQuantity = BigDecimal.ZERO;
        this.totalGainAmount = BigDecimal.ZERO;
        this.totalLossAmount = BigDecimal.ZERO;
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCheckNo() {
        return checkNo;
    }

    public void setCheckNo(String checkNo) {
        this.checkNo = checkNo;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public LocalDateTime getCheckDate() {
        return checkDate;
    }

    public void setCheckDate(LocalDateTime checkDate) {
        this.checkDate = checkDate;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalGainQuantity() {
        return totalGainQuantity;
    }

    public void setTotalGainQuantity(BigDecimal totalGainQuantity) {
        this.totalGainQuantity = totalGainQuantity;
    }

    public BigDecimal getTotalLossQuantity() {
        return totalLossQuantity;
    }

    public void setTotalLossQuantity(BigDecimal totalLossQuantity) {
        this.totalLossQuantity = totalLossQuantity;
    }

    public BigDecimal getTotalGainAmount() {
        return totalGainAmount;
    }

    public void setTotalGainAmount(BigDecimal totalGainAmount) {
        this.totalGainAmount = totalGainAmount;
    }

    public BigDecimal getTotalLossAmount() {
        return totalLossAmount;
    }

    public void setTotalLossAmount(BigDecimal totalLossAmount) {
        this.totalLossAmount = totalLossAmount;
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