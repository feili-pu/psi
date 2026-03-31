package com.lifei.psi.mapper;

import com.lifei.psi.entity.MaterialRequisitionItem;
import org.apache.ibatis.annotations.*;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface MaterialRequisitionItemMapper {

    // 根据领料单ID查询明细
    @Select("SELECT * FROM material_requisition_item WHERE requisition_id = #{requisitionId}")
    List<MaterialRequisitionItem> findByRequisitionId(Long requisitionId);

    // 根据ID查询明细
    @Select("SELECT * FROM material_requisition_item WHERE id = #{id}")
    MaterialRequisitionItem findById(Long id);

    // 插入领料明细
    @Insert("INSERT INTO material_requisition_item(requisition_id, product_id, required_quantity, " +
            "issued_quantity, unit, unit_cost, total_cost, remarks) " +
            "VALUES(#{requisitionId}, #{productId}, #{requiredQuantity}, " +
            "#{issuedQuantity}, #{unit}, #{unitCost}, #{totalCost}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(MaterialRequisitionItem item);

    // 更新领料明细
    @Update("UPDATE material_requisition_item SET product_id=#{productId}, required_quantity=#{requiredQuantity}, " +
            "issued_quantity=#{issuedQuantity}, unit=#{unit}, unit_cost=#{unitCost}, " +
            "total_cost=#{totalCost}, remarks=#{remarks} WHERE id=#{id}")
    int update(MaterialRequisitionItem item);

    // 更新已发数量
    @Update("UPDATE material_requisition_item SET issued_quantity=#{issuedQuantity}, " +
            "total_cost=unit_cost*#{issuedQuantity} WHERE id=#{id}")
    int updateIssuedQuantity(@Param("id") Long id, @Param("issuedQuantity") BigDecimal issuedQuantity);

    // 根据领料单ID删除明细
    @Delete("DELETE FROM material_requisition_item WHERE requisition_id = #{requisitionId}")
    int deleteByRequisitionId(Long requisitionId);

    // 删除明细
    @Delete("DELETE FROM material_requisition_item WHERE id = #{id}")
    int deleteById(Long id);
}