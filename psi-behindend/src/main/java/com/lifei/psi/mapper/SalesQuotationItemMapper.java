package com.lifei.psi.mapper;

import com.lifei.psi.entity.SalesQuotationItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SalesQuotationItemMapper {

    // 根据报价单ID查询明细
    @Select("SELECT * FROM sales_quotation_item WHERE quotation_id = #{quotationId} ORDER BY id")
    List<SalesQuotationItem> findByQuotationId(Long quotationId);

    // 根据ID查询明细
    @Select("SELECT * FROM sales_quotation_item WHERE id = #{id}")
    SalesQuotationItem findById(Long id);

    // 插入明细
    @Insert("INSERT INTO sales_quotation_item(quotation_id, product_name, product_code, specification, " +
            "unit, quantity, unit_price, amount, remarks) " +
            "VALUES(#{quotationId}, #{productName}, #{productCode}, #{specification}, " +
            "#{unit}, #{quantity}, #{unitPrice}, #{amount}, #{remarks})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SalesQuotationItem item);

    // 更新明细
    @Update("UPDATE sales_quotation_item SET product_name=#{productName}, product_code=#{productCode}, " +
            "specification=#{specification}, unit=#{unit}, quantity=#{quantity}, unit_price=#{unitPrice}, " +
            "amount=#{amount}, remarks=#{remarks} WHERE id=#{id}")
    int update(SalesQuotationItem item);

    // 删除明细
    @Delete("DELETE FROM sales_quotation_item WHERE id = #{id}")
    int deleteById(Long id);

    // 根据报价单ID删除所有明细
    @Delete("DELETE FROM sales_quotation_item WHERE quotation_id = #{quotationId}")
    int deleteByQuotationId(Long quotationId);
}