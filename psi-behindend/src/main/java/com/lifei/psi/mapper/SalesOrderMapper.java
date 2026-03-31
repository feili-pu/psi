package com.lifei.psi.mapper;

import com.lifei.psi.entity.SalesOrder;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SalesOrderMapper {

    // 查询所有订单
    @Select("SELECT * FROM sales_order ORDER BY created_time DESC")
    List<SalesOrder> findAll();

    // 根据ID查询订单
    @Select("SELECT * FROM sales_order WHERE id = #{id}")
    SalesOrder findById(Long id);

    // 根据订单号查询
    @Select("SELECT * FROM sales_order WHERE order_no = #{orderNo}")
    SalesOrder findByOrderNo(String orderNo);

    // 根据客户名称查询
    @Select("SELECT * FROM sales_order WHERE customer_name LIKE CONCAT('%', #{customerName}, '%') ORDER BY created_time DESC")
    List<SalesOrder> findByCustomerName(String customerName);

    // 根据销售员查询
    @Select("SELECT * FROM sales_order WHERE salesperson = #{salesperson} ORDER BY created_time DESC")
    List<SalesOrder> findBySalesperson(String salesperson);

    // 根据状态查询
    @Select("SELECT * FROM sales_order WHERE status = #{status} ORDER BY created_time DESC")
    List<SalesOrder> findByStatus(String status);

    // 根据报价单ID查询
    @Select("SELECT * FROM sales_order WHERE quotation_id = #{quotationId}")
    List<SalesOrder> findByQuotationId(Long quotationId);

    // 插入订单
    @Insert("INSERT INTO sales_order(order_no, quotation_id, customer_name, customer_contact, salesperson, " +
            "order_date, delivery_date, total_amount, include_tax, tax_rate, payment_terms, delivery_address, " +
            "remarks, created_time, updated_time) " +
            "VALUES(#{orderNo}, #{quotationId}, #{customerName}, #{customerContact}, #{salesperson}, " +
            "#{orderDate}, #{deliveryDate}, #{totalAmount}, #{includeTax}, #{taxRate}, #{paymentTerms}, #{deliveryAddress}, " +
            "#{remarks}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SalesOrder order);

    // 更新订单
    @Update("UPDATE sales_order SET customer_name=#{customerName}, customer_contact=#{customerContact}, " +
            "salesperson=#{salesperson}, delivery_date=#{deliveryDate}, total_amount=#{totalAmount}, " +
            "include_tax=#{includeTax}, tax_rate=#{taxRate}, payment_terms=#{paymentTerms}, " +
            "delivery_address=#{deliveryAddress}, status=#{status}, remarks=#{remarks}, updated_time=NOW() " +
            "WHERE id=#{id}")
    int update(SalesOrder order);

    // 更新状态
    @Update("UPDATE sales_order SET status=#{status}, updated_time=NOW() WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    // 删除订单
    @Delete("DELETE FROM sales_order WHERE id = #{id}")
    int deleteById(Long id);
}