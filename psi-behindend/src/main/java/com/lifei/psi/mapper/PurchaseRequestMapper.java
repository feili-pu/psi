package com.lifei.psi.mapper;

import com.lifei.psi.entity.PurchaseRequest;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PurchaseRequestMapper {

    // 查询所有采购申请
    @Select("SELECT * FROM purchase_request ORDER BY created_time DESC")
    List<PurchaseRequest> findAll();

    // 根据ID查询采购申请
    @Select("SELECT * FROM purchase_request WHERE id = #{id}")
    PurchaseRequest findById(Long id);

    // 根据申请单号查询
    @Select("SELECT * FROM purchase_request WHERE request_no = #{requestNo}")
    PurchaseRequest findByRequestNo(String requestNo);

    // 根据申请部门查询
    @Select("SELECT * FROM purchase_request WHERE department LIKE CONCAT('%', #{department}, '%') ORDER BY created_time DESC")
    List<PurchaseRequest> findByDepartment(String department);

    // 根据申请人查询
    @Select("SELECT * FROM purchase_request WHERE applicant = #{applicant} ORDER BY created_time DESC")
    List<PurchaseRequest> findByApplicant(String applicant);

    // 根据状态查询
    @Select("SELECT * FROM purchase_request WHERE status = #{status} ORDER BY created_time DESC")
    List<PurchaseRequest> findByStatus(String status);

    // 插入采购申请
    @Insert("INSERT INTO purchase_request(request_no, department, applicant, request_date, required_date, " +
            "total_amount, status, remarks, created_time, updated_time) " +
            "VALUES(#{requestNo}, #{department}, #{applicant}, #{requestDate}, #{requiredDate}, " +
            "#{totalAmount}, #{status}, #{remarks}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(PurchaseRequest request);

    // 更新采购申请
    @Update("UPDATE purchase_request SET department=#{department}, applicant=#{applicant}, " +
            "required_date=#{requiredDate}, total_amount=#{totalAmount}, status=#{status}, " +
            "remarks=#{remarks}, updated_time=NOW() WHERE id=#{id}")
    int update(PurchaseRequest request);

    // 更新状态
    @Update("UPDATE purchase_request SET status=#{status}, updated_time=NOW() WHERE id=#{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    // 删除采购申请
    @Delete("DELETE FROM purchase_request WHERE id = #{id}")
    int deleteById(Long id);
}