package com.lifei.psi.mapper;

import com.lifei.psi.entity.ProductDisassembly;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ProductDisassemblyMapper {

    @Select("SELECT * FROM product_disassembly WHERE id = #{id}")
    ProductDisassembly findById(@Param("id") Long id);

    @Select("SELECT * FROM product_disassembly ORDER BY created_time DESC")
    List<ProductDisassembly> findAll();

    @Select("SELECT * FROM product_disassembly WHERE bom_id = #{bomId}")
    List<ProductDisassembly> findByBomId(@Param("bomId") Long bomId);

    @Select("SELECT * FROM product_disassembly WHERE operator = #{operator}")
    List<ProductDisassembly> findByOperator(@Param("operator") String operator);

    @Select("SELECT * FROM product_disassembly WHERE status = #{status}")
    List<ProductDisassembly> findByStatus(@Param("status") String status);

    @Select("SELECT * FROM product_disassembly WHERE warehouse_id = #{warehouseId}")
    List<ProductDisassembly> findByWarehouse(@Param("warehouseId") Long warehouseId);

    @Insert("INSERT INTO product_disassembly (disassembly_no, bom_id, disassembly_quantity, warehouse_id, " +
            "disassembly_date, operator, status, remarks, created_time, updated_time) " +
            "VALUES (#{disassemblyNo}, #{bomId}, #{disassemblyQuantity}, #{warehouseId}, #{disassemblyDate}, " +
            "#{operator}, #{status}, #{remarks}, #{createdTime}, #{updatedTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ProductDisassembly disassembly);

    @Update("UPDATE product_disassembly SET bom_id = #{bomId}, disassembly_quantity = #{disassemblyQuantity}, " +
            "warehouse_id = #{warehouseId}, disassembly_date = #{disassemblyDate}, operator = #{operator}, " +
            "status = #{status}, remarks = #{remarks}, updated_time = #{updatedTime} WHERE id = #{id}")
    int update(ProductDisassembly disassembly);

    @Update("UPDATE product_disassembly SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    @Delete("DELETE FROM product_disassembly WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}