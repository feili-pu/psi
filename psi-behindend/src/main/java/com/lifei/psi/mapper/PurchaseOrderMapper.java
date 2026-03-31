package com.lifei.psi.mapper;

import com.lifei.psi.entity.PurchaseOrder;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PurchaseOrderMapper {

    // 查询所有采购订单
    @Select("SELECT * FROM purchase_order ORDER BY created_time DESC")
    List<PurchaseOrder> findAll();

    // 根据ID查询采购订单
    @Select("SELECT * FROM purchase_order WHERE id = #{id}")
    PurchaseOrder findById(Long id);

    // 根据订单号查询
    @Select("SELECT * FROM purchase_order WHERE order_no = #{orderNo}")
    PurchaseOrder findByOrderNo(String orderNo);

    // 根据供应商名称查询
    @Select("SELECT * FROM purchase_order WHERE supplier_name LIKE CONCAT('%', #{supplierName}, '%') ORDER BY created_time DESC")
    List<PurchaseOrder> findBySupplierName(String supplierName);

    // 根据采购员查询
    @Select("SELECT * FROM purchase_order WHERE purchaser = #{purchaser} ORDER BY created_time DESC")
    List<PurchaseOrder> findByPurchaser(String purchaser);

    // 根据状态查询
    @Select("SELECT * FROM purchase_order WHERE status = #{status} ORDER BY created_time DESC")
    List<PurchaseOrder> findByStatus(String status);

    // 根据报价单ID查询
    @Select("SELECT * FROM purchase_order WHERE quotation_id = #{quotationId}")
    List<PurchaseOrder> findByQuotationId(Long quotationId);

    // 插入采购订单
    @Insert("INSERT INTO purchase_order(order_no, quotation_id, supplier_name, supplier_contact, purchaser, " +
            "order_date, delivery_date, total_amount, include_tax, tax_rate, payment_terms, delivery_address, " +
            "status, remarks, created_time, updated_time) " +
            "VALUES(#{orderNo}, #{quotationId}, #{supplierName}, #{supplierContact}, #{purchaser}, " +
            "#{orderDate}, #{deliveryDate}, #{totalAmount}, #{includeTax}, #{taxRate}, #{paymentTerms}, #{deliveryAddress}, " +
            "#{status}, #{remarks}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(PurchaseOrder order);

    // 更新采购订单
    @Update("UPDATE purchase_order SET supplier_name=#{supplierName}, supplier_contact=#{supplierContact}, " +
            "purchaser=#{purchaser}, delivery_date=#{deliveryDate}, total_amount=#{totalAmount}, " +
            "include_tax=#{includeTax}, tax_rate=#{taxRate}, payment_terms=#{paymentTerms}, " +
            "delivery_address=#{deliveryAddress}, status=#{status}, remarks=#{remarks}, updated_time=NOW() " +
            "WHERE id=#{id}")
    int update(PurchaseOrder order);

    // 更新状态
    @Update("UPDATE purchase_order SET status=#{status}, updated_time=NOW() WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    // 删除采购订单
    @Delete("DELETE FROM purchase_order WHERE id = #{id}")
    int deleteById(Long id);
}