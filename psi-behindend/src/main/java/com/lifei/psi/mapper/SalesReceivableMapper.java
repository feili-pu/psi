package com.lifei.psi.mapper;

import com.lifei.psi.entity.SalesReceivable;
import org.apache.ibatis.annotations.*;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface SalesReceivableMapper {

    @Select("SELECT * FROM sales_receivable WHERE id = #{id}")
    SalesReceivable findById(@Param("id") Long id);

    @Select("SELECT * FROM sales_receivable ORDER BY created_time DESC")
    List<SalesReceivable> findAll();

    @Select("SELECT * FROM sales_receivable WHERE sales_order_id = #{salesOrderId}")
    SalesReceivable findBySalesOrderId(@Param("salesOrderId") Long salesOrderId);

    @Select("SELECT * FROM sales_receivable WHERE customer_name LIKE CONCAT('%', #{customerName}, '%') ORDER BY created_time DESC")
    List<SalesReceivable> findByCustomerName(@Param("customerName") String customerName);

    @Select("SELECT * FROM sales_receivable WHERE status = #{status} ORDER BY created_time DESC")
    List<SalesReceivable> findByStatus(@Param("status") String status);

    @Insert("INSERT INTO sales_receivable (receivable_no, customer_name, sales_order_id, receivable_type, " +
            "total_amount, received_amount, unreceived_amount, due_date, status, remarks, created_time, updated_time) " +
            "VALUES (#{receivableNo}, #{customerName}, #{salesOrderId}, #{receivableType}, #{totalAmount}, " +
            "#{receivedAmount}, #{unreceivedAmount}, #{dueDate}, #{status}, #{remarks}, #{createdTime}, #{updatedTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SalesReceivable receivable);

    @Update("UPDATE sales_receivable SET received_amount = #{receivedAmount}, unreceived_amount = #{unreceivedAmount}, " +
            "status = #{status}, updated_time = NOW() WHERE id = #{id}")
    int updateCollection(@Param("id") Long id, @Param("receivedAmount") BigDecimal receivedAmount,
                         @Param("unreceivedAmount") BigDecimal unreceivedAmount, @Param("status") String status);
}
