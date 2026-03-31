package com.lifei.psi.mapper;

import com.lifei.psi.entity.PurchaseInquiryItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PurchaseInquiryItemMapper {

    // 根据询价单ID查询明细
    @Select("SELECT * FROM purchase_inquiry_item WHERE inquiry_id = #{inquiryId}")
    List<PurchaseInquiryItem> findByInquiryId(Long inquiryId);

    // 根据ID查询明细
    @Select("SELECT * FROM purchase_inquiry_item WHERE id = #{id}")
    PurchaseInquiryItem findById(Long id);

    // 插入询价明细
    @Insert("INSERT INTO purchase_inquiry_item(inquiry_id, product_name, product_code, specification, " +
            "unit, quantity, technical_requirements, remarks) " +
            "VALUES(#{inquiryId}, #{productName}, #{productCode}, #{specification}, " +
            "#{unit}, #{quantity}, #{technicalRequirements}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(PurchaseInquiryItem item);

    // 更新询价明细
    @Update("UPDATE purchase_inquiry_item SET product_name=#{productName}, product_code=#{productCode}, " +
            "specification=#{specification}, unit=#{unit}, quantity=#{quantity}, " +
            "technical_requirements=#{technicalRequirements}, remarks=#{remarks} WHERE id=#{id}")
    int update(PurchaseInquiryItem item);

    // 根据询价单ID删除明细
    @Delete("DELETE FROM purchase_inquiry_item WHERE inquiry_id = #{inquiryId}")
    int deleteByInquiryId(Long inquiryId);

    // 删除明细
    @Delete("DELETE FROM purchase_inquiry_item WHERE id = #{id}")
    int deleteById(Long id);
}