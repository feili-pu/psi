package com.lifei.psi.mapper;

import com.lifei.psi.entity.SerialNumberInventory;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SerialNumberInventoryMapper {

    @Select("SELECT * FROM serial_number_inventory WHERE serial_number = #{serialNumber}")
    SerialNumberInventory findBySerialNumber(@Param("serialNumber") String serialNumber);

    @Select("SELECT * FROM serial_number_inventory WHERE warehouse_id = #{warehouseId} AND product_id = #{productId}")
    List<SerialNumberInventory> findByWarehouseAndProduct(@Param("warehouseId") Long warehouseId, @Param("productId") Long productId);

    @Select("SELECT * FROM serial_number_inventory WHERE warehouse_id = #{warehouseId}")
    List<SerialNumberInventory> findByWarehouse(@Param("warehouseId") Long warehouseId);

    @Select("SELECT * FROM serial_number_inventory WHERE product_id = #{productId}")
    List<SerialNumberInventory> findByProduct(@Param("productId") Long productId);

    @Select("SELECT * FROM serial_number_inventory WHERE status = #{status}")
    List<SerialNumberInventory> findByStatus(@Param("status") String status);

    @Select("SELECT * FROM serial_number_inventory WHERE batch_no = #{batchNo}")
    List<SerialNumberInventory> findByBatchNo(@Param("batchNo") String batchNo);

    @Select("SELECT * FROM serial_number_inventory WHERE warehouse_id = #{warehouseId} AND status = #{status}")
    List<SerialNumberInventory> findByWarehouseAndStatus(@Param("warehouseId") Long warehouseId, @Param("status") String status);

    @Select("SELECT COUNT(*) FROM serial_number_inventory WHERE warehouse_id = #{warehouseId} AND product_id = #{productId} AND status = 'IN_STOCK'")
    int countInStockByWarehouseAndProduct(@Param("warehouseId") Long warehouseId, @Param("productId") Long productId);

    @Insert("INSERT INTO serial_number_inventory (warehouse_id, product_id, serial_number, status, unit_cost, " +
            "batch_no, production_date, expiry_date, location, in_date, out_date, last_transaction_id, " +
            "remarks, created_time, updated_time) " +
            "VALUES (#{warehouseId}, #{productId}, #{serialNumber}, #{status}, #{unitCost}, " +
            "#{batchNo}, #{productionDate}, #{expiryDate}, #{location}, #{inDate}, #{outDate}, " +
            "#{lastTransactionId}, #{remarks}, #{createdTime}, #{updatedTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SerialNumberInventory inventory);

    @Update("UPDATE serial_number_inventory SET warehouse_id = #{warehouseId}, product_id = #{productId}, " +
            "status = #{status}, unit_cost = #{unitCost}, batch_no = #{batchNo}, production_date = #{productionDate}, " +
            "expiry_date = #{expiryDate}, location = #{location}, in_date = #{inDate}, out_date = #{outDate}, " +
            "last_transaction_id = #{lastTransactionId}, remarks = #{remarks}, updated_time = #{updatedTime} " +
            "WHERE serial_number = #{serialNumber}")
    int update(SerialNumberInventory inventory);

    @Update("UPDATE serial_number_inventory SET status = #{status}, out_date = #{outDate}, " +
            "last_transaction_id = #{lastTransactionId}, updated_time = #{updatedTime} " +
            "WHERE serial_number = #{serialNumber}")
    int updateStatus(@Param("serialNumber") String serialNumber, @Param("status") String status, 
                    @Param("outDate") java.time.LocalDateTime outDate, @Param("lastTransactionId") Long lastTransactionId,
                    @Param("updatedTime") java.time.LocalDateTime updatedTime);

    @Delete("DELETE FROM serial_number_inventory WHERE serial_number = #{serialNumber}")
    int deleteBySerialNumber(@Param("serialNumber") String serialNumber);

    @Delete("DELETE FROM serial_number_inventory WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}