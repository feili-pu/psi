package com.lifei.psi.mapper;

import com.lifei.psi.entity.SupplierQuotationItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SupplierQuotationItemMapper {

    // 根据报价单ID查询明细
    @Select("SELECT * FROM supplier_quotation_item WHERE quotation_id = #{quotationId}")
    List<SupplierQuotationItem> findByQuotationId(Long quotationId);

    // 根据ID查询明细
    @Select("SELECT * FROM supplier_quotation_item WHERE id = #{id}")
    SupplierQuotationItem findById(Long id);

    // 根据询价明细ID查询报价明细
    @Select("SELECT * FROM supplier_quotation_item WHERE inquiry_item_id = #{inquiryItemId}")
    List<SupplierQuotationItem> findByInquiryItemId(Long inquiryItemId);

    // 插入报价明细
    @Insert("INSERT INTO supplier_quotation_item(quotation_id, inquiry_item_id, product_name, product_code, " +
            "specification, unit, quantity, unit_price, amount, delivery_period, brand, origin, remarks) " +
            "VALUES(#{quotationId}, #{inquiryItemId}, #{productName}, #{productCode}, " +
            "#{specification}, #{unit}, #{quantity}, #{unitPrice}, #{amount}, #{deliveryPeriod}, #{brand}, #{origin}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SupplierQuotationItem item);

    // 更新报价明细
    @Update("UPDATE supplier_quotation_item SET product_name=#{productName}, product_code=#{productCode}, " +
            "specification=#{specification}, unit=#{unit}, quantity=#{quantity}, " +
            "unit_price=#{unitPrice}, amount=#{amount}, delivery_period=#{deliveryPeriod}, " +
            "brand=#{brand}, origin=#{origin}, remarks=#{remarks} WHERE id=#{id}")
    int update(SupplierQuotationItem item);

    // 根据报价单ID删除明细
    @Delete("DELETE FROM supplier_quotation_item WHERE quotation_id = #{quotationId}")
    int deleteByQuotationId(Long quotationId);

    // 删除明细
    @Delete("DELETE FROM supplier_quotation_item WHERE id = #{id}")
    int deleteById(Long id);
}