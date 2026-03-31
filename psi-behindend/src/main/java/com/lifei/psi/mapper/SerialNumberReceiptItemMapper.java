package com.lifei.psi.mapper;

import com.lifei.psi.entity.SerialNumberReceiptItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SerialNumberReceiptItemMapper {

    @Select("SELECT * FROM serial_number_receipt_item WHERE receipt_id = #{receiptId}")
    List<SerialNumberReceiptItem> findByReceiptId(@Param("receiptId") Long receiptId);

    @Select("SELECT * FROM serial_number_receipt_item WHERE id = #{id}")
    SerialNumberReceiptItem findById(@Param("id") Long id);

    @Select("SELECT * FROM serial_number_receipt_item WHERE serial_number = #{serialNumber}")
    SerialNumberReceiptItem findBySerialNumber(@Param("serialNumber") String serialNumber);

    @Select("SELECT * FROM serial_number_receipt_item WHERE product_id = #{productId}")
    List<SerialNumberReceiptItem> findByProductId(@Param("productId") Long productId);

    @Select("SELECT * FROM serial_number_receipt_item WHERE batch_no = #{batchNo}")
    List<SerialNumberReceiptItem> findByBatchNo(@Param("batchNo") String batchNo);

    @Insert("INSERT INTO serial_number_receipt_item (receipt_id, product_id, serial_number, unit_price, " +
            "batch_no, production_date, expiry_date, quality_status, location, remarks) " +
            "VALUES (#{receiptId}, #{productId}, #{serialNumber}, #{unitPrice}, " +
            "#{batchNo}, #{productionDate}, #{expiryDate}, #{qualityStatus}, #{location}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SerialNumberReceiptItem item);

    @Update("UPDATE serial_number_receipt_item SET product_id = #{productId}, serial_number = #{serialNumber}, " +
            "unit_price = #{unitPrice}, batch_no = #{batchNo}, production_date = #{productionDate}, " +
            "expiry_date = #{expiryDate}, quality_status = #{qualityStatus}, location = #{location}, " +
            "remarks = #{remarks} WHERE id = #{id}")
    int update(SerialNumberReceiptItem item);

    @Delete("DELETE FROM serial_number_receipt_item WHERE receipt_id = #{receiptId}")
    int deleteByReceiptId(@Param("receiptId") Long receiptId);

    @Delete("DELETE FROM serial_number_receipt_item WHERE id = #{id}")
    int deleteById(@Param("id") Long id);

    @Select("SELECT COUNT(*) FROM serial_number_receipt_item WHERE serial_number = #{serialNumber}")
    int countBySerialNumber(@Param("serialNumber") String serialNumber);
}