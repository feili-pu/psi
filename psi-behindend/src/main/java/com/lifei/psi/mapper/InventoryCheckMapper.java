package com.lifei.psi.mapper;

import com.lifei.psi.entity.InventoryCheck;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface InventoryCheckMapper {

    @Select("SELECT * FROM inventory_check WHERE id = #{id}")
    InventoryCheck findById(@Param("id") Long id);

    @Select("SELECT * FROM inventory_check ORDER BY created_time DESC")
    List<InventoryCheck> findAll();

    @Select("SELECT * FROM inventory_check WHERE warehouse_id = #{warehouseId}")
    List<InventoryCheck> findByWarehouse(@Param("warehouseId") Long warehouseId);

    @Select("SELECT * FROM inventory_check WHERE check_type = #{checkType}")
    List<InventoryCheck> findByCheckType(@Param("checkType") String checkType);

    @Select("SELECT * FROM inventory_check WHERE checker = #{checker}")
    List<InventoryCheck> findByChecker(@Param("checker") String checker);

    @Select("SELECT * FROM inventory_check WHERE status = #{status}")
    List<InventoryCheck> findByStatus(@Param("status") String status);

    @Insert("INSERT INTO inventory_check (check_no, warehouse_id, check_date, check_type, checker, status, " +
            "total_gain_quantity, total_loss_quantity, total_gain_amount, total_loss_amount, remarks, " +
            "created_time, updated_time) " +
            "VALUES (#{checkNo}, #{warehouseId}, #{checkDate}, #{checkType}, #{checker}, #{status}, " +
            "#{totalGainQuantity}, #{totalLossQuantity}, #{totalGainAmount}, #{totalLossAmount}, #{remarks}, " +
            "#{createdTime}, #{updatedTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(InventoryCheck check);

    @Update("UPDATE inventory_check SET warehouse_id = #{warehouseId}, check_date = #{checkDate}, " +
            "check_type = #{checkType}, checker = #{checker}, status = #{status}, " +
            "total_gain_quantity = #{totalGainQuantity}, total_loss_quantity = #{totalLossQuantity}, " +
            "total_gain_amount = #{totalGainAmount}, total_loss_amount = #{totalLossAmount}, " +
            "remarks = #{remarks}, updated_time = #{updatedTime} WHERE id = #{id}")
    int update(InventoryCheck check);

    @Update("UPDATE inventory_check SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    @Delete("DELETE FROM inventory_check WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}