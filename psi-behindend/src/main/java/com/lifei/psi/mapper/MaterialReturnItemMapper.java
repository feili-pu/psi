package com.lifei.psi.mapper;

import com.lifei.psi.entity.MaterialReturnItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MaterialReturnItemMapper {

    @Select("SELECT * FROM material_return_item WHERE return_id = #{returnId}")
    List<MaterialReturnItem> findByReturnId(@Param("returnId") Long returnId);

    @Select("SELECT * FROM material_return_item WHERE id = #{id}")
    MaterialReturnItem findById(@Param("id") Long id);

    @Insert("INSERT INTO material_return_item (return_id, product_id, return_quantity, unit, unit_cost, total_cost, remarks) " +
            "VALUES (#{returnId}, #{productId}, #{returnQuantity}, #{unit}, #{unitCost}, #{totalCost}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(MaterialReturnItem item);

    @Update("UPDATE material_return_item SET product_id = #{productId}, return_quantity = #{returnQuantity}, " +
            "unit = #{unit}, unit_cost = #{unitCost}, total_cost = #{totalCost}, remarks = #{remarks} " +
            "WHERE id = #{id}")
    int update(MaterialReturnItem item);

    @Delete("DELETE FROM material_return_item WHERE return_id = #{returnId}")
    int deleteByReturnId(@Param("returnId") Long returnId);

    @Delete("DELETE FROM material_return_item WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}