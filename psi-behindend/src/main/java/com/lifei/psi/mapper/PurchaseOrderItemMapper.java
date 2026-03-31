package com.lifei.psi.mapper;

import com.lifei.psi.entity.PurchaseOrderItem;
import org.apache.ibatis.annotations.*;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface PurchaseOrderItemMapper {

    // 根据订单ID查询明细
    @Select("SELECT * FROM purchase_order_item WHERE order_id = #{orderId}")
    List<PurchaseOrderItem> findByOrderId(Long orderId);

    // 根据ID查询明细
    @Select("SELECT * FROM purchase_order_item WHERE id = #{id}")
    PurchaseOrderItem findById(Long id);

    // 插入订单明细
    @Insert("INSERT INTO purchase_order_item(order_id, product_name, product_code, specification, " +
            "unit, quantity, unit_price, amount, received_qty, remaining_qty, delivery_period, remarks) " +
            "VALUES(#{orderId}, #{productName}, #{productCode}, #{specification}, " +
            "#{unit}, #{quantity}, #{unitPrice}, #{amount}, #{receivedQty}, #{remainingQty}, #{deliveryPeriod}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(PurchaseOrderItem item);

    // 更新订单明细
    @Update("UPDATE purchase_order_item SET product_name=#{productName}, product_code=#{productCode}, " +
            "specification=#{specification}, unit=#{unit}, quantity=#{quantity}, " +
            "unit_price=#{unitPrice}, amount=#{amount}, received_qty=#{receivedQty}, " +
            "remaining_qty=#{remainingQty}, delivery_period=#{deliveryPeriod}, remarks=#{remarks} WHERE id=#{id}")
    int update(PurchaseOrderItem item);

    // 更新收货数量
    @Update("UPDATE purchase_order_item SET received_qty=#{receivedQty}, " +
            "remaining_qty=quantity-#{receivedQty} WHERE id=#{id}")
    int updateReceivedQty(@Param("id") Long id, @Param("receivedQty") BigDecimal receivedQty);

    // 根据订单ID删除明细
    @Delete("DELETE FROM purchase_order_item WHERE order_id = #{orderId}")
    int deleteByOrderId(Long orderId);

    // 删除明细
    @Delete("DELETE FROM purchase_order_item WHERE id = #{id}")
    int deleteById(Long id);
}