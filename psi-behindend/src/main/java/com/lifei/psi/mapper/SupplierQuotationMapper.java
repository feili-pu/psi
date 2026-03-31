package com.lifei.psi.mapper;

import com.lifei.psi.entity.SupplierQuotation;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SupplierQuotationMapper {

    // 查询所有供应商报价
    @Select("SELECT * FROM supplier_quotation ORDER BY created_time DESC")
    List<SupplierQuotation> findAll();

    // 根据ID查询供应商报价
    @Select("SELECT * FROM supplier_quotation WHERE id = #{id}")
    SupplierQuotation findById(Long id);

    // 根据报价单号查询
    @Select("SELECT * FROM supplier_quotation WHERE quotation_no = #{quotationNo}")
    SupplierQuotation findByQuotationNo(String quotationNo);

    // 根据询价单ID查询
    @Select("SELECT * FROM supplier_quotation WHERE inquiry_id = #{inquiryId} ORDER BY created_time DESC")
    List<SupplierQuotation> findByInquiryId(Long inquiryId);

    // 根据供应商名称查询
    @Select("SELECT * FROM supplier_quotation WHERE supplier_name LIKE CONCAT('%', #{supplierName}, '%') ORDER BY created_time DESC")
    List<SupplierQuotation> findBySupplierName(String supplierName);

    // 根据状态查询
    @Select("SELECT * FROM supplier_quotation WHERE status = #{status} ORDER BY created_time DESC")
    List<SupplierQuotation> findByStatus(String status);

    // 插入供应商报价
    @Insert("INSERT INTO supplier_quotation(quotation_no, inquiry_id, supplier_name, supplier_contact, " +
            "quotation_date, valid_until, total_amount, include_tax, tax_rate, payment_terms, delivery_terms, " +
            "status, remarks, created_time, updated_time) " +
            "VALUES(#{quotationNo}, #{inquiryId}, #{supplierName}, #{supplierContact}, " +
            "#{quotationDate}, #{validUntil}, #{totalAmount}, #{includeTax}, #{taxRate}, #{paymentTerms}, #{deliveryTerms}, " +
            "#{status}, #{remarks}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SupplierQuotation quotation);

    // 更新供应商报价
    @Update("UPDATE supplier_quotation SET supplier_name=#{supplierName}, supplier_contact=#{supplierContact}, " +
            "valid_until=#{validUntil}, total_amount=#{totalAmount}, include_tax=#{includeTax}, tax_rate=#{taxRate}, " +
            "payment_terms=#{paymentTerms}, delivery_terms=#{deliveryTerms}, status=#{status}, " +
            "remarks=#{remarks}, updated_time=NOW() WHERE id=#{id}")
    int update(SupplierQuotation quotation);

    // 更新状态
    @Update("UPDATE supplier_quotation SET status=#{status}, updated_time=NOW() WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    // 删除供应商报价
    @Delete("DELETE FROM supplier_quotation WHERE id = #{id}")
    int deleteById(Long id);
}