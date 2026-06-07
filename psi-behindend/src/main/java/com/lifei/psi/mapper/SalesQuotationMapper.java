package com.lifei.psi.mapper;

import com.lifei.psi.entity.SalesQuotation;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SalesQuotationMapper {

    // 查询所有报价单
    @Select("SELECT * FROM sales_quotation ORDER BY created_time DESC")
    List<SalesQuotation> findAll();

    // 根据ID查询报价单
    @Select("SELECT * FROM sales_quotation WHERE id = #{id}")
    SalesQuotation findById(Long id);

    // 根据报价单号查询
    @Select("SELECT * FROM sales_quotation WHERE quotation_no = #{quotationNo}")
    SalesQuotation findByQuotationNo(String quotationNo);

    // 根据客户名称查询
    @Select("SELECT * FROM sales_quotation WHERE customer_name LIKE CONCAT('%', #{customerName}, '%') ORDER BY created_time DESC")
    List<SalesQuotation> findByCustomerName(String customerName);

    // 根据销售员查询
    @Select("SELECT * FROM sales_quotation WHERE salesperson = #{salesperson} ORDER BY created_time DESC")
    List<SalesQuotation> findBySalesperson(String salesperson);

    // 根据状态查询
    @Select("SELECT * FROM sales_quotation WHERE status = #{status} OR (#{status} = 'DRAFT' AND status IS NULL) ORDER BY created_time DESC")
    List<SalesQuotation> findByStatus(String status);

    // 插入报价单
    @Insert("INSERT INTO sales_quotation(quotation_no, customer_name, customer_contact, salesperson, " +
            "quotation_date, valid_until, total_amount, include_tax, tax_rate, status, remarks, created_time, updated_time) " +
            "VALUES(#{quotationNo}, #{customerName}, #{customerContact}, #{salesperson}, " +
            "#{quotationDate}, #{validUntil}, #{totalAmount}, #{includeTax}, #{taxRate}, #{status}, #{remarks}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SalesQuotation quotation);

    // 更新报价单
    @Update("UPDATE sales_quotation SET customer_name=#{customerName}, customer_contact=#{customerContact}, " +
            "salesperson=#{salesperson}, valid_until=#{validUntil}, total_amount=#{totalAmount}, " +
            "include_tax=#{includeTax}, tax_rate=#{taxRate}, status=#{status}, remarks=#{remarks}, updated_time=NOW() " +
            "WHERE id=#{id}")
    int update(SalesQuotation quotation);

    // 更新状态
    @Update("UPDATE sales_quotation SET status=#{status}, updated_time=NOW() WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    // 删除报价单
    @Delete("DELETE FROM sales_quotation WHERE id = #{id}")
    int deleteById(Long id);
}
