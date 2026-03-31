package com.lifei.psi.dto;

import java.math.BigDecimal;

/**
 * 采购订单汇总-物料报表DTO
 */
public class PurchaseProductReport {
    private String productName;        // 产品名称
    private String productCode;        // 产品编码
    private String specification;      // 规格型号
    private String unit;               // 单位
    private BigDecimal totalQuantity;  // 总采购数量
    private BigDecimal totalAmount;    // 总采购金额
    private BigDecimal avgPrice;       // 平均采购单价
    private BigDecimal minPrice;       // 最低采购单价
    private BigDecimal maxPrice;       // 最高采购单价
    private Integer orderCount;        // 订单次数
    private Integer supplierCount;     // 供应商数量
    private String mainSupplier;       // 主要供应商
    private BigDecimal receivedQty;    // 已收货数量
    private BigDecimal remainingQty;   // 剩余数量

    // 构造函数
    public PurchaseProductReport() {}

    // Getter和Setter方法
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getSpecification() {
        return specification;
    }

    public void setSpecification(String specification) {
        this.specification = specification;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(BigDecimal totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getAvgPrice() {
        return avgPrice;
    }

    public void setAvgPrice(BigDecimal avgPrice) {
        this.avgPrice = avgPrice;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public Integer getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Integer orderCount) {
        this.orderCount = orderCount;
    }

    public Integer getSupplierCount() {
        return supplierCount;
    }

    public void setSupplierCount(Integer supplierCount) {
        this.supplierCount = supplierCount;
    }

    public String getMainSupplier() {
        return mainSupplier;
    }

    public void setMainSupplier(String mainSupplier) {
        this.mainSupplier = mainSupplier;
    }

    public BigDecimal getReceivedQty() {
        return receivedQty;
    }

    public void setReceivedQty(BigDecimal receivedQty) {
        this.receivedQty = receivedQty;
    }

    public BigDecimal getRemainingQty() {
        return remainingQty;
    }

    public void setRemainingQty(BigDecimal remainingQty) {
        this.remainingQty = remainingQty;
    }
}