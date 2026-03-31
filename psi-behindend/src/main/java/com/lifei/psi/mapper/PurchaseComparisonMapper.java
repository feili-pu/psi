package com.lifei.psi.mapper;

import com.lifei.psi.entity.PurchaseComparison;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PurchaseComparisonMapper {

    // 查询所有采购比价
    @Select("SELECT * FROM purchase_comparison ORDER BY created_time DESC")
    List<PurchaseComparison> findAll();

    // 根据ID查询采购比价
    @Select("SELECT * FROM purchase_comparison WHERE id = #{id}")
    PurchaseComparison findById(Long id);

    // 根据比价单号查询
    @Select("SELECT * FROM purchase_comparison WHERE comparison_no = #{comparisonNo}")
    PurchaseComparison findByComparisonNo(String comparisonNo);

    // 根据询价单ID查询
    @Select("SELECT * FROM purchase_comparison WHERE inquiry_id = #{inquiryId} ORDER BY created_time DESC")
    List<PurchaseComparison> findByInquiryId(Long inquiryId);

    // 根据比价人查询
    @Select("SELECT * FROM purchase_comparison WHERE comparer = #{comparer} ORDER BY created_time DESC")
    List<PurchaseComparison> findByComparer(String comparer);

    // 根据状态查询
    @Select("SELECT * FROM purchase_comparison WHERE status = #{status} ORDER BY created_time DESC")
    List<PurchaseComparison> findByStatus(String status);

    // 插入采购比价
    @Insert("INSERT INTO purchase_comparison(comparison_no, inquiry_id, title, comparer, comparison_date, " +
            "selected_quotation_id, selection_reason, status, remarks, created_time, updated_time) " +
            "VALUES(#{comparisonNo}, #{inquiryId}, #{title}, #{comparer}, #{comparisonDate}, " +
            "#{selectedQuotationId}, #{selectionReason}, #{status}, #{remarks}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(PurchaseComparison comparison);

    // 更新采购比价
    @Update("UPDATE purchase_comparison SET title=#{title}, comparer=#{comparer}, " +
            "selected_quotation_id=#{selectedQuotationId}, selection_reason=#{selectionReason}, " +
            "status=#{status}, remarks=#{remarks}, updated_time=NOW() WHERE id=#{id}")
    int update(PurchaseComparison comparison);

    // 更新状态
    @Update("UPDATE purchase_comparison SET status=#{status}, updated_time=NOW() WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    // 删除采购比价
    @Delete("DELETE FROM purchase_comparison WHERE id = #{id}")
    int deleteById(Long id);
}