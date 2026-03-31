package com.lifei.psi.mapper;

import com.lifei.psi.entity.InventoryReceiptItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface InventoryReceiptItemMapper {

    @Select("SELECT * FROM inventory_receipt_item WHERE receipt_id = #{receiptId}")
    List<InventoryReceiptItem> findByReceiptId(@Param("receiptId") Long receiptId);

    @Select("SELECT * FROM inventory_receipt_item WHERE id = #{id}")
    InventoryReceiptItem findById(@Param("id") Long id);

    @Insert("INSERT INTO inventory_receipt_item (receipt_id, product_id, quantity, unit, unit_price, total_amount, " +
            "batch_no, production_date, expiry_date, quality_status, remarks) " +
            "VALUES (#{receiptId}, #{productId}, #{quantity}, #{unit}, #{unitPrice}, #{totalAmount}, " +
            "#{batchNo}, #{productionDate}, #{expiryDate}, #{qualityStatus}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(InventoryReceiptItem item);

    @Update("UPDATE inventory_receipt_item SET product_id = #{productId}, quantity = #{quantity}, unit = #{unit}, " +
            "unit_price = #{unitPrice}, total_amount = #{totalAmount}, batch_no = #{batchNo}, " +
            "production_date = #{productionDate}, expiry_date = #{expiryDate}, quality_status = #{qualityStatus}, " +
            "remarks = #{remarks} WHERE id = #{id}")
    int update(InventoryReceiptItem item);

    @Delete("DELETE FROM inventory_receipt_item WHERE receipt_id = #{receiptId}")
    int deleteByReceiptId(@Param("receiptId") Long receiptId);

    @Delete("DELETE FROM inventory_receipt_item WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}