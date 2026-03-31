package com.lifei.psi.mapper;

import com.lifei.psi.entity.ProductReceipt;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ProductReceiptMapper {

    @Select("SELECT * FROM product_receipt WHERE id = #{id}")
    ProductReceipt findById(@Param("id") Long id);

    @Select("SELECT * FROM product_receipt ORDER BY created_time DESC")
    List<ProductReceipt> findAll();

    @Select("SELECT * FROM product_receipt WHERE receipt_type = #{receiptType}")
    List<ProductReceipt> findByReceiptType(@Param("receiptType") String receiptType);

    @Select("SELECT * FROM product_receipt WHERE operator = #{operator}")
    List<ProductReceipt> findByOperator(@Param("operator") String operator);

    @Select("SELECT * FROM product_receipt WHERE status = #{status}")
    List<ProductReceipt> findByStatus(@Param("status") String status);

    @Select("SELECT * FROM product_receipt WHERE warehouse_id = #{warehouseId}")
    List<ProductReceipt> findByWarehouse(@Param("warehouseId") Long warehouseId);

    @Insert("INSERT INTO product_receipt (receipt_no, production_order_no, receipt_type, warehouse_id, " +
            "receipt_date, operator, total_quantity, total_cost, status, remarks, created_time, updated_time) " +
            "VALUES (#{receiptNo}, #{productionOrderNo}, #{receiptType}, #{warehouseId}, #{receiptDate}, " +
            "#{operator}, #{totalQuantity}, #{totalCost}, #{status}, #{remarks}, #{createdTime}, #{updatedTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ProductReceipt receipt);

    @Update("UPDATE product_receipt SET production_order_no = #{productionOrderNo}, receipt_type = #{receiptType}, " +
            "warehouse_id = #{warehouseId}, receipt_date = #{receiptDate}, operator = #{operator}, " +
            "total_quantity = #{totalQuantity}, total_cost = #{totalCost}, status = #{status}, " +
            "remarks = #{remarks}, updated_time = #{updatedTime} WHERE id = #{id}")
    int update(ProductReceipt receipt);

    @Update("UPDATE product_receipt SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    @Delete("DELETE FROM product_receipt WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}