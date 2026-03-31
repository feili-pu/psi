package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存实体类
 */
public class Inventory {
    private Long id;
    private Long warehouseId;          // 仓库ID
    private Long productId;            // 产品ID
    private BigDecimal quantity;       // 库存数量
    private BigDecimal availableQuantity; // 可用数量
    private BigDecimal reservedQuantity;  // 预留数量
    private BigDecimal unitCost;       // 单位成本
    private BigDecimal totalCost;      // 总成本
    private LocalDateTime lastInDate;  // 最后入库日期
    private LocalDateTime lastOutDate; // 最后出库日期
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public Inventory() {}

    public Inventory(Long warehouseId, Long productId) {
        this.warehouseId = warehouseId;
        this.productId = productId;
        this.quantity = BigDecimal.ZERO;
        this.availableQuantity = BigDecimal.ZERO;
        this.reservedQuantity = BigDecimal.ZERO;
        this.unitCost = BigDecimal.ZERO;
        this.totalCost = BigDecimal.ZERO;
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(BigDecimal availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public BigDecimal getReservedQuantity() {
        return reservedQuantity;
    }

    public void setReservedQuantity(BigDecimal reservedQuantity) {
        this.reservedQuantity = reservedQuantity;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public LocalDateTime getLastInDate() {
        return lastInDate;
    }

    public void setLastInDate(LocalDateTime lastInDate) {
        this.lastInDate = lastInDate;
    }

    public LocalDateTime getLastOutDate() {
        return lastOutDate;
    }

    public void setLastOutDate(LocalDateTime lastOutDate) {
        this.lastOutDate = lastOutDate;
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