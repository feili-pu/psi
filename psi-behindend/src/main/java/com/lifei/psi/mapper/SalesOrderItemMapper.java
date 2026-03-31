package com.lifei.psi.mapper;

import com.lifei.psi.entity.SalesOrderItem;
import org.apache.ibatis.annotations.*;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface SalesOrderItemMapper {

    // 根据订单ID查询明细
    @Select("SELECT * FROM sales_order_item WHERE order_id = #{orderId} ORDER BY id")
    List<SalesOrderItem> findByOrderId(Long orderId);

    // 根据ID查询明细
    @Select("SELECT * FROM sales_order_item WHERE id = #{id}")
    SalesOrderItem findById(Long id);

    // 插入明细
    @Insert("INSERT INTO sales_order_item(order_id, product_name, product_code, specification, " +
            "unit, quantity, unit_price, amount, delivered_qty, remaining_qty, remarks) " +
            "VALUES(#{orderId}, #{productName}, #{productCode}, #{specification}, " +
            "#{unit}, #{quantity}, #{unitPrice}, #{amount}, #{deliveredQty}, #{remainingQty}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SalesOrderItem item);

    // 更新明细
    @Update("UPDATE sales_order_item SET product_name=#{productName}, product_code=#{productCode}, " +
            "specification=#{specification}, unit=#{unit}, quantity=#{quantity}, unit_price=#{unitPrice}, " +
            "amount=#{amount}, delivered_qty=#{deliveredQty}, remaining_qty=#{remainingQty}, remarks=#{remarks} " +
            "WHERE id=#{id}")
    int update(SalesOrderItem item);

    // 更新交货数量
    @Update("UPDATE sales_order_item SET delivered_qty=#{deliveredQty}, remaining_qty=quantity-#{deliveredQty} " +
            "WHERE id=#{id}")
    int updateDeliveredQty(@Param("id") Long id, @Param("deliveredQty") BigDecimal deliveredQty);

    // 删除明细
    @Delete("DELETE FROM sales_order_item WHERE id = #{id}")
    int deleteById(Long id);

    // 根据订单ID删除所有明细
    @Delete("DELETE FROM sales_order_item WHERE order_id = #{orderId}")
    int deleteByOrderId(Long orderId);
}