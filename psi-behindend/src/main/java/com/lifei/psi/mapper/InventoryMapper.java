package com.lifei.psi.mapper;

import com.lifei.psi.entity.Inventory;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface InventoryMapper {

    @Select("SELECT * FROM inventory WHERE warehouse_id = #{warehouseId} AND product_id = #{productId}")
    Inventory findByWarehouseAndProduct(@Param("warehouseId") Long warehouseId, @Param("productId") Long productId);

    @Select("SELECT * FROM inventory WHERE warehouse_id = #{warehouseId}")
    List<Inventory> findByWarehouse(@Param("warehouseId") Long warehouseId);

    @Select("SELECT * FROM inventory WHERE product_id = #{productId}")
    List<Inventory> findByProduct(@Param("productId") Long productId);

    @Select("SELECT * FROM inventory")
    List<Inventory> findAll();

    @Insert("INSERT INTO inventory (warehouse_id, product_id, quantity, available_quantity, reserved_quantity, " +
            "unit_cost, total_cost, last_in_date, last_out_date, created_time, updated_time) " +
            "VALUES (#{warehouseId}, #{productId}, #{quantity}, #{availableQuantity}, #{reservedQuantity}, " +
            "#{unitCost}, #{totalCost}, #{lastInDate}, #{lastOutDate}, #{createdTime}, #{updatedTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Inventory inventory);

    @Update("UPDATE inventory SET quantity = #{quantity}, available_quantity = #{availableQuantity}, " +
            "reserved_quantity = #{reservedQuantity}, unit_cost = #{unitCost}, total_cost = #{totalCost}, " +
            "last_in_date = #{lastInDate}, last_out_date = #{lastOutDate}, updated_time = #{updatedTime} " +
            "WHERE id = #{id}")
    int update(Inventory inventory);

    @Delete("DELETE FROM inventory WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}