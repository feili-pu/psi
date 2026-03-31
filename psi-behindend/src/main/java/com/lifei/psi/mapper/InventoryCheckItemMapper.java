package com.lifei.psi.mapper;

import com.lifei.psi.entity.InventoryCheckItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface InventoryCheckItemMapper {

    @Select("SELECT * FROM inventory_check_item WHERE check_id = #{checkId}")
    List<InventoryCheckItem> findByCheckId(@Param("checkId") Long checkId);

    @Select("SELECT * FROM inventory_check_item WHERE id = #{id}")
    InventoryCheckItem findById(@Param("id") Long id);

    @Select("SELECT * FROM inventory_check_item WHERE check_id = #{checkId} AND difference_type = #{differenceType}")
    List<InventoryCheckItem> findByCheckIdAndDifferenceType(@Param("checkId") Long checkId, @Param("differenceType") String differenceType);

    @Insert("INSERT INTO inventory_check_item (check_id, product_id, book_quantity, actual_quantity, " +
            "difference_quantity, unit_cost, difference_amount, difference_type, remarks) " +
            "VALUES (#{checkId}, #{productId}, #{bookQuantity}, #{actualQuantity}, #{differenceQuantity}, " +
            "#{unitCost}, #{differenceAmount}, #{differenceType}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(InventoryCheckItem item);

    @Update("UPDATE inventory_check_item SET product_id = #{productId}, book_quantity = #{bookQuantity}, " +
            "actual_quantity = #{actualQuantity}, difference_quantity = #{differenceQuantity}, " +
            "unit_cost = #{unitCost}, difference_amount = #{differenceAmount}, difference_type = #{differenceType}, " +
            "remarks = #{remarks} WHERE id = #{id}")
    int update(InventoryCheckItem item);

    @Delete("DELETE FROM inventory_check_item WHERE check_id = #{checkId}")
    int deleteByCheckId(@Param("checkId") Long checkId);

    @Delete("DELETE FROM inventory_check_item WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}