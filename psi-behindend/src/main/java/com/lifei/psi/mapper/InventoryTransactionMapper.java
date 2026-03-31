package com.lifei.psi.mapper;

import com.lifei.psi.entity.InventoryTransaction;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface InventoryTransactionMapper {

    @Select("SELECT * FROM inventory_transaction WHERE warehouse_id = #{warehouseId} AND product_id = #{productId} ORDER BY transaction_date DESC")
    List<InventoryTransaction> findByWarehouseAndProduct(@Param("warehouseId") Long warehouseId, @Param("productId") Long productId);

    @Select("SELECT * FROM inventory_transaction WHERE business_type = #{businessType} ORDER BY transaction_date DESC")
    List<InventoryTransaction> findByBusinessType(@Param("businessType") String businessType);

    @Select("SELECT * FROM inventory_transaction WHERE transaction_date BETWEEN #{startDate} AND #{endDate} ORDER BY transaction_date DESC")
    List<InventoryTransaction> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Select("SELECT * FROM inventory_transaction WHERE reference_no = #{referenceNo}")
    List<InventoryTransaction> findByReferenceNo(@Param("referenceNo") String referenceNo);

    @Select("SELECT * FROM inventory_transaction ORDER BY transaction_date DESC LIMIT #{limit}")
    List<InventoryTransaction> findRecent(@Param("limit") int limit);

    @Insert("INSERT INTO inventory_transaction (transaction_no, warehouse_id, product_id, transaction_type, " +
            "business_type, reference_id, reference_no, quantity, unit_cost, total_cost, balance_quantity, " +
            "transaction_date, operator, remarks, created_time) " +
            "VALUES (#{transactionNo}, #{warehouseId}, #{productId}, #{transactionType}, #{businessType}, " +
            "#{referenceId}, #{referenceNo}, #{quantity}, #{unitCost}, #{totalCost}, #{balanceQuantity}, " +
            "#{transactionDate}, #{operator}, #{remarks}, #{createdTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(InventoryTransaction transaction);
}