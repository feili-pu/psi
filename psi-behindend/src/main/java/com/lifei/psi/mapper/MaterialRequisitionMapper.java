package com.lifei.psi.mapper;

import com.lifei.psi.entity.MaterialRequisition;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MaterialRequisitionMapper {

    // 查询所有生产领料单
    @Select("SELECT * FROM material_requisition ORDER BY created_time DESC")
    List<MaterialRequisition> findAll();

    // 根据ID查询生产领料单
    @Select("SELECT * FROM material_requisition WHERE id = #{id}")
    MaterialRequisition findById(Long id);

    // 根据领料单号查询
    @Select("SELECT * FROM material_requisition WHERE requisition_no = #{requisitionNo}")
    MaterialRequisition findByRequisitionNo(String requisitionNo);

    // 根据部门查询
    @Select("SELECT * FROM material_requisition WHERE department LIKE CONCAT('%', #{department}, '%') ORDER BY created_time DESC")
    List<MaterialRequisition> findByDepartment(String department);

    // 根据申请人查询
    @Select("SELECT * FROM material_requisition WHERE applicant = #{applicant} ORDER BY created_time DESC")
    List<MaterialRequisition> findByApplicant(String applicant);

    // 根据状态查询
    @Select("SELECT * FROM material_requisition WHERE status = #{status} ORDER BY created_time DESC")
    List<MaterialRequisition> findByStatus(String status);

    // 根据生产订单号查询
    @Select("SELECT * FROM material_requisition WHERE production_order_no = #{productionOrderNo}")
    List<MaterialRequisition> findByProductionOrderNo(String productionOrderNo);

    // 根据BOM ID查询
    @Select("SELECT * FROM material_requisition WHERE bom_id = #{bomId} ORDER BY created_time DESC")
    List<MaterialRequisition> findByBomId(Long bomId);

    // 插入生产领料单
    @Insert("INSERT INTO material_requisition(requisition_no, bom_id, production_order_no, department, applicant, " +
            "requisition_date, production_quantity, warehouse_id, status, remarks, created_time, updated_time) " +
            "VALUES(#{requisitionNo}, #{bomId}, #{productionOrderNo}, #{department}, #{applicant}, " +
            "#{requisitionDate}, #{productionQuantity}, #{warehouseId}, #{status}, #{remarks}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(MaterialRequisition requisition);

    // 更新生产领料单
    @Update("UPDATE material_requisition SET bom_id=#{bomId}, production_order_no=#{productionOrderNo}, " +
            "department=#{department}, applicant=#{applicant}, production_quantity=#{productionQuantity}, " +
            "warehouse_id=#{warehouseId}, status=#{status}, remarks=#{remarks}, updated_time=NOW() " +
            "WHERE id=#{id}")
    int update(MaterialRequisition requisition);

    // 更新状态
    @Update("UPDATE material_requisition SET status=#{status}, updated_time=NOW() WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    // 删除生产领料单
    @Delete("DELETE FROM material_requisition WHERE id = #{id}")
    int deleteById(Long id);
}