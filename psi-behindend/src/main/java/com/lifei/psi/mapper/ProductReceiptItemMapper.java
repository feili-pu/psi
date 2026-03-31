package com.lifei.psi.mapper;

import com.lifei.psi.entity.ProductReceiptItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ProductReceiptItemMapper {

    @Select("SELECT * FROM product_receipt_item WHERE receipt_id = #{receiptId}")
    List<ProductReceiptItem> findByReceiptId(@Param("receiptId") Long receiptId);

    @Select("SELECT * FROM product_receipt_item WHERE id = #{id}")
    ProductReceiptItem findById(@Param("id") Long id);

    @Insert("INSERT INTO product_receipt_item (receipt_id, product_id, quantity, unit, unit_cost, total_cost, " +
            "batch_no, production_date, expiry_date, remarks) " +
            "VALUES (#{receiptId}, #{productId}, #{quantity}, #{unit}, #{unitCost}, #{totalCost}, " +
            "#{batchNo}, #{productionDate}, #{expiryDate}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ProductReceiptItem item);

    @Update("UPDATE product_receipt_item SET product_id = #{productId}, quantity = #{quantity}, unit = #{unit}, " +
            "unit_cost = #{unitCost}, total_cost = #{totalCost}, batch_no = #{batchNo}, " +
            "production_date = #{productionDate}, expiry_date = #{expiryDate}, remarks = #{remarks} " +
            "WHERE id = #{id}")
    int update(ProductReceiptItem item);

    @Delete("DELETE FROM product_receipt_item WHERE receipt_id = #{receiptId}")
    int deleteByReceiptId(@Param("receiptId") Long receiptId);

    @Delete("DELETE FROM product_receipt_item WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}