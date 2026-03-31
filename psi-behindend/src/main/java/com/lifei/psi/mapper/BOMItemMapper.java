package com.lifei.psi.mapper;

import com.lifei.psi.entity.BOMItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BOMItemMapper {

    // 根据BOM ID查询明细
    @Select("SELECT * FROM bom_item WHERE bom_id = #{bomId}")
    List<BOMItem> findByBomId(Long bomId);

    // 根据ID查询明细
    @Select("SELECT * FROM bom_item WHERE id = #{id}")
    BOMItem findById(Long id);

    // 插入BOM明细
    @Insert("INSERT INTO bom_item(bom_id, material_id, quantity, unit, loss_rate, remarks) " +
            "VALUES(#{bomId}, #{materialId}, #{quantity}, #{unit}, #{lossRate}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(BOMItem item);

    // 更新BOM明细
    @Update("UPDATE bom_item SET material_id=#{materialId}, quantity=#{quantity}, " +
            "unit=#{unit}, loss_rate=#{lossRate}, remarks=#{remarks} WHERE id=#{id}")
    int update(BOMItem item);

    // 根据BOM ID删除明细
    @Delete("DELETE FROM bom_item WHERE bom_id = #{bomId}")
    int deleteByBomId(Long bomId);

    // 删除明细
    @Delete("DELETE FROM bom_item WHERE id = #{id}")
    int deleteById(Long id);
}