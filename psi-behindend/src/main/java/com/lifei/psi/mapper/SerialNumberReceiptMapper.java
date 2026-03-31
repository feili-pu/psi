package com.lifei.psi.mapper;

import com.lifei.psi.entity.SerialNumberReceipt;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SerialNumberReceiptMapper {

    @Select("SELECT * FROM serial_number_receipt WHERE id = #{id}")
    SerialNumberReceipt findById(@Param("id") Long id);

    @Select("SELECT * FROM serial_number_receipt ORDER BY created_time DESC")
    List<SerialNumberReceipt> findAll();

    @Select("SELECT * FROM serial_number_receipt WHERE receipt_type = #{receiptType}")
    List<SerialNumberReceipt> findByReceiptType(@Param("receiptType") String receiptType);

    @Select("SELECT * FROM serial_number_receipt WHERE operator = #{operator}")
    List<SerialNumberReceipt> findByOperator(@Param("operator") String operator);

    @Select("SELECT * FROM serial_number_receipt WHERE status = #{status}")
    List<SerialNumberReceipt> findByStatus(@Param("status") String status);

    @Select("SELECT * FROM serial_number_receipt WHERE warehouse_id = #{warehouseId}")
    List<SerialNumberReceipt> findByWarehouse(@Param("warehouseId") Long warehouseId);

    @Select("SELECT * FROM serial_number_receipt WHERE supplier_id = #{supplierId}")
    List<SerialNumberReceipt> findBySupplier(@Param("supplierId") Long supplierId);

    @Select("SELECT * FROM serial_number_receipt WHERE purchase_order_id = #{purchaseOrderId}")
    List<SerialNumberReceipt> findByPurchaseOrder(@Param("purchaseOrderId") Long purchaseOrderId);

    @Insert("INSERT INTO serial_number_receipt (receipt_no, receipt_type, warehouse_id, supplier_id, purchase_order_id, " +
            "receipt_date, operator, total_quantity, total_amount, status, auto_generate_payable, payable_generated, " +
            "remarks, created_time, updated_time) " +
            "VALUES (#{receiptNo}, #{receiptType}, #{warehouseId}, #{supplierId}, #{purchaseOrderId}, " +
            "#{receiptDate}, #{operator}, #{totalQuantity}, #{totalAmount}, #{status}, #{autoGeneratePayable}, " +
            "#{payableGenerated}, #{remarks}, #{createdTime}, #{updatedTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SerialNumberReceipt receipt);

    @Update("UPDATE serial_number_receipt SET receipt_type = #{receiptType}, warehouse_id = #{warehouseId}, " +
            "supplier_id = #{supplierId}, purchase_order_id = #{purchaseOrderId}, receipt_date = #{receiptDate}, " +
            "operator = #{operator}, total_quantity = #{totalQuantity}, total_amount = #{totalAmount}, " +
            "status = #{status}, auto_generate_payable = #{autoGeneratePayable}, payable_generated = #{payableGenerated}, " +
            "remarks = #{remarks}, updated_time = #{updatedTime} WHERE id = #{id}")
    int update(SerialNumberReceipt receipt);

    @Update("UPDATE serial_number_receipt SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    @Update("UPDATE serial_number_receipt SET payable_generated = #{payableGenerated} WHERE id = #{id}")
    int updatePayableGenerated(@Param("id") Long id, @Param("payableGenerated") Boolean payableGenerated);

    @Delete("DELETE FROM serial_number_receipt WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}