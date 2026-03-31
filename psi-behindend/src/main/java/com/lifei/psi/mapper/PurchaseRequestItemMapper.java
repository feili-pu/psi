package com.lifei.psi.mapper;

import com.lifei.psi.entity.PurchaseRequestItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PurchaseRequestItemMapper {

    // 根据申请单ID查询明细
    @Select("SELECT * FROM purchase_request_item WHERE request_id = #{requestId}")
    List<PurchaseRequestItem> findByRequestId(Long requestId);

    // 根据ID查询明细
    @Select("SELECT * FROM purchase_request_item WHERE id = #{id}")
    PurchaseRequestItem findById(Long id);

    // 插入申请明细
    @Insert("INSERT INTO purchase_request_item(request_id, product_name, product_code, specification, " +
            "unit, quantity, estimated_price, amount, purpose, remarks) " +
            "VALUES(#{requestId}, #{productName}, #{productCode}, #{specification}, " +
            "#{unit}, #{quantity}, #{estimatedPrice}, #{amount}, #{purpose}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(PurchaseRequestItem item);

    // 更新申请明细
    @Update("UPDATE purchase_request_item SET product_name=#{productName}, product_code=#{productCode}, " +
            "specification=#{specification}, unit=#{unit}, quantity=#{quantity}, " +
            "estimated_price=#{estimatedPrice}, amount=#{amount}, purpose=#{purpose}, " +
            "remarks=#{remarks} WHERE id=#{id}")
    int update(PurchaseRequestItem item);

    // 根据申请单ID删除明细
    @Delete("DELETE FROM purchase_request_item WHERE request_id = #{requestId}")
    int deleteByRequestId(Long requestId);

    // 删除明细
    @Delete("DELETE FROM purchase_request_item WHERE id = #{id}")
    int deleteById(Long id);
}