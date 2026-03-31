package com.lifei.psi.mapper;

import com.lifei.psi.entity.ProductAssembly;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ProductAssemblyMapper {

    @Select("SELECT * FROM product_assembly WHERE id = #{id}")
    ProductAssembly findById(@Param("id") Long id);

    @Select("SELECT * FROM product_assembly ORDER BY created_time DESC")
    List<ProductAssembly> findAll();

    @Select("SELECT * FROM product_assembly WHERE bom_id = #{bomId}")
    List<ProductAssembly> findByBomId(@Param("bomId") Long bomId);

    @Select("SELECT * FROM product_assembly WHERE operator = #{operator}")
    List<ProductAssembly> findByOperator(@Param("operator") String operator);

    @Select("SELECT * FROM product_assembly WHERE status = #{status}")
    List<ProductAssembly> findByStatus(@Param("status") String status);

    @Select("SELECT * FROM product_assembly WHERE warehouse_id = #{warehouseId}")
    List<ProductAssembly> findByWarehouse(@Param("warehouseId") Long warehouseId);

    @Insert("INSERT INTO product_assembly (assembly_no, bom_id, assembly_quantity, warehouse_id, assembly_date, " +
            "operator, status, remarks, created_time, updated_time) " +
            "VALUES (#{assemblyNo}, #{bomId}, #{assemblyQuantity}, #{warehouseId}, #{assemblyDate}, " +
            "#{operator}, #{status}, #{remarks}, #{createdTime}, #{updatedTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ProductAssembly assembly);

    @Update("UPDATE product_assembly SET bom_id = #{bomId}, assembly_quantity = #{assemblyQuantity}, " +
            "warehouse_id = #{warehouseId}, assembly_date = #{assemblyDate}, operator = #{operator}, " +
            "status = #{status}, remarks = #{remarks}, updated_time = #{updatedTime} WHERE id = #{id}")
    int update(ProductAssembly assembly);

    @Update("UPDATE product_assembly SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    @Delete("DELETE FROM product_assembly WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}