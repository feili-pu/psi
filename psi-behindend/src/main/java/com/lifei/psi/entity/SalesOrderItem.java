package com.lifei.psi.entity;

import java.math.BigDecimal;

public class SalesOrderItem {
    private Long id;
    private Long orderId;              // 订单ID
    private String productName;        // 产品名称
    private String productCode;        // 产品编码
    private String specification;      // 规格型号
    private String unit;              // 单位
    private BigDecimal quantity;       // 订单数量
    private BigDecimal unitPrice;      // 单价
    private BigDecimal amount;         // 金额
    private BigDecimal deliveredQty;   // 已交货数量
    private BigDecimal remainingQty;   // 剩余数量
    private String remarks;            // 备注

    // 构造函数
    public SalesOrderItem() {}

    public SalesOrderItem(Long orderId, String productName, BigDecimal quantity, BigDecimal unitPrice) {
        this.orderId = orderId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.amount = quantity.multiply(unitPrice);
        this.deliveredQty = BigDecimal.ZERO;
        this.remainingQty = quantity;
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

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

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
        if (this.unitPrice != null) {
            this.amount = quantity.multiply(this.unitPrice);
        }
        // 重新计算剩余数量
        if (this.deliveredQty != null) {
            this.remainingQty = quantity.subtract(this.deliveredQty);
        } else {
            this.remainingQty = quantity;
        }
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
        if (this.quantity != null) {
            this.amount = this.quantity.multiply(unitPrice);
        }
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getDeliveredQty() {
        return deliveredQty;
    }

    public void setDeliveredQty(BigDecimal deliveredQty) {
        this.deliveredQty = deliveredQty;
        if (this.quantity != null) {
            this.remainingQty = this.quantity.subtract(deliveredQty);
        }
    }

    public BigDecimal getRemainingQty() {
        return remainingQty;
    }

    public void setRemainingQty(BigDecimal remainingQty) {
        this.remainingQty = remainingQty;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}