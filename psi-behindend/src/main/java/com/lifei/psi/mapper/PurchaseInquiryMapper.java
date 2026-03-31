package com.lifei.psi.mapper;

import com.lifei.psi.entity.PurchaseInquiry;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PurchaseInquiryMapper {

    // 查询所有采购询价
    @Select("SELECT * FROM purchase_inquiry ORDER BY created_time DESC")
    List<PurchaseInquiry> findAll();

    // 根据ID查询采购询价
    @Select("SELECT * FROM purchase_inquiry WHERE id = #{id}")
    PurchaseInquiry findById(Long id);

    // 根据询价单号查询
    @Select("SELECT * FROM purchase_inquiry WHERE inquiry_no = #{inquiryNo}")
    PurchaseInquiry findByInquiryNo(String inquiryNo);

    // 根据标题搜索
    @Select("SELECT * FROM purchase_inquiry WHERE title LIKE CONCAT('%', #{title}, '%') ORDER BY created_time DESC")
    List<PurchaseInquiry> findByTitle(String title);

    // 根据询价人查询
    @Select("SELECT * FROM purchase_inquiry WHERE inquirer = #{inquirer} ORDER BY created_time DESC")
    List<PurchaseInquiry> findByInquirer(String inquirer);

    // 根据状态查询
    @Select("SELECT * FROM purchase_inquiry WHERE status = #{status} ORDER BY created_time DESC")
    List<PurchaseInquiry> findByStatus(String status);

    // 根据申请单ID查询
    @Select("SELECT * FROM purchase_inquiry WHERE request_id = #{requestId}")
    List<PurchaseInquiry> findByRequestId(Long requestId);

    // 插入采购询价
    @Insert("INSERT INTO purchase_inquiry(inquiry_no, request_id, title, inquirer, inquiry_date, " +
            "deadline_date, status, remarks, created_time, updated_time) " +
            "VALUES(#{inquiryNo}, #{requestId}, #{title}, #{inquirer}, #{inquiryDate}, " +
            "#{deadlineDate}, #{status}, #{remarks}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(PurchaseInquiry inquiry);

    // 更新采购询价
    @Update("UPDATE purchase_inquiry SET title=#{title}, inquirer=#{inquirer}, " +
            "deadline_date=#{deadlineDate}, status=#{status}, remarks=#{remarks}, updated_time=NOW() " +
            "WHERE id=#{id}")
    int update(PurchaseInquiry inquiry);

    // 更新状态
    @Update("UPDATE purchase_inquiry SET status=#{status}, updated_time=NOW() WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    // 删除采购询价
    @Delete("DELETE FROM purchase_inquiry WHERE id = #{id}")
    int deleteById(Long id);
}