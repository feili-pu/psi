package com.lifei.psi.mapper;

import com.lifei.psi.entity.MaterialReturn;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MaterialReturnMapper {

    @Select("SELECT * FROM material_return WHERE id = #{id}")
    MaterialReturn findById(@Param("id") Long id);

    @Select("SELECT * FROM material_return ORDER BY created_time DESC")
    List<MaterialReturn> findAll();

    @Select("SELECT * FROM material_return WHERE department = #{department}")
    List<MaterialReturn> findByDepartment(@Param("department") String department);

    @Select("SELECT * FROM material_return WHERE returner = #{returner}")
    List<MaterialReturn> findByReturner(@Param("returner") String returner);

    @Select("SELECT * FROM material_return WHERE status = #{status}")
    List<MaterialReturn> findByStatus(@Param("status") String status);

    @Select("SELECT * FROM material_return WHERE requisition_id = #{requisitionId}")
    List<MaterialReturn> findByRequisitionId(@Param("requisitionId") Long requisitionId);

    @Insert("INSERT INTO material_return (return_no, requisition_id, production_order_no, department, returner, " +
            "return_date, warehouse_id, return_reason, status, remarks, created_time, updated_time) " +
            "VALUES (#{returnNo}, #{requisitionId}, #{productionOrderNo}, #{department}, #{returner}, " +
            "#{returnDate}, #{warehouseId}, #{returnReason}, #{status}, #{remarks}, #{createdTime}, #{updatedTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(MaterialReturn materialReturn);

    @Update("UPDATE material_return SET requisition_id = #{requisitionId}, production_order_no = #{productionOrderNo}, " +
            "department = #{department}, returner = #{returner}, return_date = #{returnDate}, " +
            "warehouse_id = #{warehouseId}, return_reason = #{returnReason}, status = #{status}, " +
            "remarks = #{remarks}, updated_time = #{updatedTime} WHERE id = #{id}")
    int update(MaterialReturn materialReturn);

    @Update("UPDATE material_return SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    @Delete("DELETE FROM material_return WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}