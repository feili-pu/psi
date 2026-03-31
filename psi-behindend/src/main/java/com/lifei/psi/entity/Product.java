package com.lifei.psi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 产品/物料主数据实体类
 */
public class Product {
    private Long id;
    private String productCode;        // 产品编码
    private String productName;        // 产品名称
    private String productType;        // 产品类型：MATERIAL(原料), SEMI_FINISHED(半成品), FINISHED(成品)
    private String specification;      // 规格型号
    private String unit;               // 基本单位
    private String category;           // 产品分类
    private String brand;              // 品牌
    private String model;              // 型号
    private BigDecimal standardCost;   // 标准成本
    private BigDecimal sellingPrice;   // 销售价格
    private BigDecimal safetyStock;    // 安全库存
    private BigDecimal minStock;       // 最小库存
    private BigDecimal maxStock;       // 最大库存
    private String status;             // 状态
    private String remarks;            // 备注
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    // 构造函数
    public Product() {}

    public Product(String productCode, String productName, String productType, String unit) {
        this.productCode = productCode;
        this.productName = productName;
        this.productType = productType;
        this.unit = unit;
        this.status = "ACTIVE";
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public BigDecimal getStandardCost() {
        return standardCost;
    }

    public void setStandardCost(BigDecimal standardCost) {
        this.standardCost = standardCost;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public BigDecimal getSafetyStock() {
        return safetyStock;
    }

    public void setSafetyStock(BigDecimal safetyStock) {
        this.safetyStock = safetyStock;
    }

    public BigDecimal getMinStock() {
        return minStock;
    }

    public void setMinStock(BigDecimal minStock) {
        this.minStock = minStock;
    }

    public BigDecimal getMaxStock() {
        return maxStock;
    }

    public void setMaxStock(BigDecimal maxStock) {
        this.maxStock = maxStock;
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