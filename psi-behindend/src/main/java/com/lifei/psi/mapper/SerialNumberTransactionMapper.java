package com.lifei.psi.mapper;

import com.lifei.psi.entity.SerialNumberTransaction;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface SerialNumberTransactionMapper {

    @Select("SELECT * FROM serial_number_transaction WHERE serial_number = #{serialNumber} ORDER BY transaction_date DESC")
    List<SerialNumberTransaction> findBySerialNumber(@Param("serialNumber") String serialNumber);

    @Select("SELECT * FROM serial_number_transaction WHERE warehouse_id = #{warehouseId} AND product_id = #{productId} ORDER BY transaction_date DESC")
    List<SerialNumberTransaction> findByWarehouseAndProduct(@Param("warehouseId") Long warehouseId, @Param("productId") Long productId);

    @Select("SELECT * FROM serial_number_transaction WHERE business_type = #{businessType} ORDER BY transaction_date DESC")
    List<SerialNumberTransaction> findByBusinessType(@Param("businessType") String businessType);

    @Select("SELECT * FROM serial_number_transaction WHERE transaction_date BETWEEN #{startDate} AND #{endDate} ORDER BY transaction_date DESC")
    List<SerialNumberTransaction> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Select("SELECT * FROM serial_number_transaction WHERE reference_no = #{referenceNo}")
    List<SerialNumberTransaction> findByReferenceNo(@Param("referenceNo") String referenceNo);

    @Select("SELECT * FROM serial_number_transaction ORDER BY transaction_date DESC LIMIT #{limit}")
    List<SerialNumberTransaction> findRecent(@Param("limit") int limit);

    @Insert("INSERT INTO serial_number_transaction (transaction_no, warehouse_id, product_id, serial_number, " +
            "transaction_type, business_type, reference_id, reference_no, unit_cost, from_status, to_status, " +
            "transaction_date, operator, remarks, created_time) " +
            "VALUES (#{transactionNo}, #{warehouseId}, #{productId}, #{serialNumber}, #{transactionType}, " +
            "#{businessType}, #{referenceId}, #{referenceNo}, #{unitCost}, #{fromStatus}, #{toStatus}, " +
            "#{transactionDate}, #{operator}, #{remarks}, #{createdTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SerialNumberTransaction transaction);
}