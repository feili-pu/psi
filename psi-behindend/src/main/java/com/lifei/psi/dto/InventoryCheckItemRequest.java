package com.lifei.psi.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * 盘点明细请求DTO
 */
public class InventoryCheckItemRequest {
    
    @NotNull(message = "产品ID不能为空")
    private Long productId;            // 产品ID
    
    @NotNull(message = "账面数量不能为空")
    @DecimalMin(value = "0", message = "账面数量不能为负数")
    private BigDecimal bookQuantity;   // 账面数量
    
    @NotNull(message = "实盘数量不能为空")
    @DecimalMin(value = "0", message = "实盘数量不能为负数")
    private BigDecimal actualQuantity; // 实盘数量
    
    private String remarks;            // 备注

    // 构造函数
    public InventoryCheckItemRequest() {}

    // Getter和Setter方法
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getBookQuantity() {
        return bookQuantity;
    }

    public void setBookQuantity(BigDecimal bookQuantity) {
        this.bookQuantity = bookQuantity;
    }

    public BigDecimal getActualQuantity() {
        return actualQuantity;
    }

    public void setActualQuantity(BigDecimal actualQuantity) {
        this.actualQuantity = actualQuantity;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}