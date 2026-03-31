package com.lifei.psi.mapper;

import com.lifei.psi.entity.BOM;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BOMMapper {

    // 查询所有BOM
    @Select("SELECT * FROM bom ORDER BY created_time DESC")
    List<BOM> findAll();

    // 根据ID查询BOM
    @Select("SELECT * FROM bom WHERE id = #{id}")
    BOM findById(Long id);

    // 根据BOM编码查询
    @Select("SELECT * FROM bom WHERE bom_code = #{bomCode}")
    BOM findByBomCode(String bomCode);

    // 根据产品ID查询
    @Select("SELECT * FROM bom WHERE product_id = #{productId} AND status = 'ACTIVE' ORDER BY created_time DESC")
    List<BOM> findByProductId(Long productId);

    // 根据状态查询
    @Select("SELECT * FROM bom WHERE status = #{status} ORDER BY created_time DESC")
    List<BOM> findByStatus(String status);

    // 插入BOM
    @Insert("INSERT INTO bom(bom_code, product_id, bom_version, bom_name, quantity, status, " +
            "effective_date, expiry_date, remarks, created_time, updated_time) " +
            "VALUES(#{bomCode}, #{productId}, #{bomVersion}, #{bomName}, #{quantity}, #{status}, " +
            "#{effectiveDate}, #{expiryDate}, #{remarks}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(BOM bom);

    // 更新BOM
    @Update("UPDATE bom SET product_id=#{productId}, bom_version=#{bomVersion}, bom_name=#{bomName}, " +
            "quantity=#{quantity}, status=#{status}, effective_date=#{effectiveDate}, " +
            "expiry_date=#{expiryDate}, remarks=#{remarks}, updated_time=NOW() WHERE id=#{id}")
    int update(BOM bom);

    // 更新状态
    @Update("UPDATE bom SET status=#{status}, updated_time=NOW() WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    // 删除BOM
    @Delete("DELETE FROM bom WHERE id = #{id}")
    int deleteById(Long id);
}