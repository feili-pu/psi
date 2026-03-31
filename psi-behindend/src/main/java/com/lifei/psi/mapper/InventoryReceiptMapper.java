package com.lifei.psi.mapper;

import com.lifei.psi.entity.InventoryReceipt;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface InventoryReceiptMapper {

    @Select("SELECT * FROM inventory_receipt WHERE id = #{id}")
    InventoryReceipt findById(@Param("id") Long id);

    @Select("SELECT * FROM inventory_receipt ORDER BY created_time DESC")
    List<InventoryReceipt> findAll();

    @Select("SELECT * FROM inventory_receipt WHERE receipt_type = #{receiptType}")
    List<InventoryReceipt> findByReceiptType(@Param("receiptType") String receiptType);

    @Select("SELECT * FROM inventory_receipt WHERE operator = #{operator}")
    List<InventoryReceipt> findByOperator(@Param("operator") String operator);

    @Select("SELECT * FROM inventory_receipt WHERE status = #{status}")
    List<InventoryReceipt> findByStatus(@Param("status") String status);

    @Select("SELECT * FROM inventory_receipt WHERE warehouse_id = #{warehouseId}")
    List<InventoryReceipt> findByWarehouse(@Param("warehouseId") Long warehouseId);

    @Select("SELECT * FROM inventory_receipt WHERE supplier_id = #{supplierId}")
    List<InventoryReceipt> findBySupplier(@Param("supplierId") Long supplierId);

    @Select("SELECT * FROM inventory_receipt WHERE purchase_order_id = #{purchaseOrderId}")
    List<InventoryReceipt> findByPurchaseOrder(@Param("purchaseOrderId") Long purchaseOrderId);

    @Insert("INSERT INTO inventory_receipt (receipt_no, receipt_type, warehouse_id, supplier_id, purchase_order_id, " +
            "receipt_date, operator, total_quantity, total_amount, status, auto_generate_payable, payable_generated, " +
            "remarks, created_time, updated_time) " +
            "VALUES (#{receiptNo}, #{receiptType}, #{warehouseId}, #{supplierId}, #{purchaseOrderId}, " +
            "#{receiptDate}, #{operator}, #{totalQuantity}, #{totalAmount}, #{status}, #{autoGeneratePayable}, " +
            "#{payableGenerated}, #{remarks}, #{createdTime}, #{updatedTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(InventoryReceipt receipt);

    @Update("UPDATE inventory_receipt SET receipt_type = #{receiptType}, warehouse_id = #{warehouseId}, " +
            "supplier_id = #{supplierId}, purchase_order_id = #{purchaseOrderId}, receipt_date = #{receiptDate}, " +
            "operator = #{operator}, total_quantity = #{totalQuantity}, total_amount = #{totalAmount}, " +
            "status = #{status}, auto_generate_payable = #{autoGeneratePayable}, payable_generated = #{payableGenerated}, " +
            "remarks = #{remarks}, updated_time = #{updatedTime} WHERE id = #{id}")
    int update(InventoryReceipt receipt);

    @Update("UPDATE inventory_receipt SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    @Update("UPDATE inventory_receipt SET payable_generated = #{payableGenerated} WHERE id = #{id}")
    int updatePayableGenerated(@Param("id") Long id, @Param("payableGenerated") Boolean payableGenerated);

    @Delete("DELETE FROM inventory_receipt WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}