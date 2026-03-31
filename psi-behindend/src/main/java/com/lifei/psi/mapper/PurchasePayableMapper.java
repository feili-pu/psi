package com.lifei.psi.mapper;

import com.lifei.psi.entity.PurchasePayable;
import org.apache.ibatis.annotations.*;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface PurchasePayableMapper {

    @Select("SELECT * FROM purchase_payable WHERE id = #{id}")
    PurchasePayable findById(@Param("id") Long id);

    @Select("SELECT * FROM purchase_payable ORDER BY created_time DESC")
    List<PurchasePayable> findAll();

    @Select("SELECT * FROM purchase_payable WHERE supplier_id = #{supplierId}")
    List<PurchasePayable> findBySupplier(@Param("supplierId") Long supplierId);

    @Select("SELECT * FROM purchase_payable WHERE status = #{status}")
    List<PurchasePayable> findByStatus(@Param("status") String status);

    @Select("SELECT * FROM purchase_payable WHERE payable_type = #{payableType}")
    List<PurchasePayable> findByPayableType(@Param("payableType") String payableType);

    @Select("SELECT * FROM purchase_payable WHERE receipt_id = #{receiptId}")
    PurchasePayable findByReceiptId(@Param("receiptId") Long receiptId);

    @Select("SELECT * FROM purchase_payable WHERE purchase_order_id = #{purchaseOrderId}")
    List<PurchasePayable> findByPurchaseOrderId(@Param("purchaseOrderId") Long purchaseOrderId);

    @Insert("INSERT INTO purchase_payable (payable_no, supplier_id, purchase_order_id, receipt_id, payable_type, " +
            "total_amount, paid_amount, unpaid_amount, due_date, status, remarks, created_time, updated_time) " +
            "VALUES (#{payableNo}, #{supplierId}, #{purchaseOrderId}, #{receiptId}, #{payableType}, " +
            "#{totalAmount}, #{paidAmount}, #{unpaidAmount}, #{dueDate}, #{status}, #{remarks}, " +
            "#{createdTime}, #{updatedTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(PurchasePayable payable);

    @Update("UPDATE purchase_payable SET supplier_id = #{supplierId}, purchase_order_id = #{purchaseOrderId}, " +
            "receipt_id = #{receiptId}, payable_type = #{payableType}, total_amount = #{totalAmount}, " +
            "paid_amount = #{paidAmount}, unpaid_amount = #{unpaidAmount}, due_date = #{dueDate}, " +
            "status = #{status}, remarks = #{remarks}, updated_time = #{updatedTime} WHERE id = #{id}")
    int update(PurchasePayable payable);

    @Update("UPDATE purchase_payable SET paid_amount = #{paidAmount}, unpaid_amount = #{unpaidAmount}, " +
            "status = #{status} WHERE id = #{id}")
    int updatePayment(@Param("id") Long id, @Param("paidAmount") BigDecimal paidAmount, 
                     @Param("unpaidAmount") BigDecimal unpaidAmount, @Param("status") String status);

    @Delete("DELETE FROM purchase_payable WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}