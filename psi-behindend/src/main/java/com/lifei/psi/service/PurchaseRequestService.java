package com.lifei.psi.service;

import com.lifei.psi.entity.PurchaseRequest;
import com.lifei.psi.entity.PurchaseRequestItem;
import com.lifei.psi.mapper.PurchaseRequestMapper;
import com.lifei.psi.mapper.PurchaseRequestItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PurchaseRequestService {

    @Autowired
    private PurchaseRequestMapper requestMapper;

    @Autowired
    private PurchaseRequestItemMapper requestItemMapper;

    // 获取所有采购申请
    public List<PurchaseRequest> getAllRequests() {
        return requestMapper.findAll();
    }

    // 根据ID获取采购申请
    public PurchaseRequest getRequestById(Long id) {
        return requestMapper.findById(id);
    }

    // 获取申请明细
    public List<PurchaseRequestItem> getRequestItems(Long requestId) {
        return requestItemMapper.findByRequestId(requestId);
    }

    // 根据部门搜索
    public List<PurchaseRequest> searchByDepartment(String department) {
        return requestMapper.findByDepartment(department);
    }

    // 根据申请人查询
    public List<PurchaseRequest> getRequestsByApplicant(String applicant) {
        return requestMapper.findByApplicant(applicant);
    }

    // 根据状态查询
    public List<PurchaseRequest> getRequestsByStatus(String status) {
        return requestMapper.findByStatus(status);
    }

    // 创建采购申请
    @Transactional
    public PurchaseRequest createRequest(PurchaseRequest request, List<PurchaseRequestItem> items) {
        // 生成申请单号
        request.setRequestNo(generateRequestNo());
        if (isBlank(request.getStatus())) {
            request.setStatus("PENDING");
        }
        request.setRequestDate(LocalDateTime.now());
        request.setCreatedTime(LocalDateTime.now());
        request.setUpdatedTime(LocalDateTime.now());
        
        // 计算总金额
        BigDecimal totalAmount = calculateTotalAmount(items);
        request.setTotalAmount(totalAmount);
        
        // 插入申请单
        requestMapper.insert(request);
        
        // 插入明细
        if (items != null && !items.isEmpty()) {
            for (PurchaseRequestItem item : items) {
                item.setRequestId(request.getId());
                // 计算金额
                if (item.getQuantity() != null && item.getEstimatedPrice() != null) {
                    item.setAmount(item.getQuantity().multiply(item.getEstimatedPrice()));
                }
                requestItemMapper.insert(item);
            }
        }
        
        return request;
    }

    // 更新采购申请
    @Transactional
    public PurchaseRequest updateRequest(PurchaseRequest request, List<PurchaseRequestItem> items) {
        request.setUpdatedTime(LocalDateTime.now());
        
        // 计算总金额
        if (items != null) {
            BigDecimal totalAmount = calculateTotalAmount(items);
            request.setTotalAmount(totalAmount);
        }
        
        // 更新申请单
        requestMapper.update(request);
        
        // 删除原有明细
        requestItemMapper.deleteByRequestId(request.getId());
        
        // 插入新明细
        if (items != null && !items.isEmpty()) {
            for (PurchaseRequestItem item : items) {
                item.setRequestId(request.getId());
                if (item.getQuantity() != null && item.getEstimatedPrice() != null) {
                    item.setAmount(item.getQuantity().multiply(item.getEstimatedPrice()));
                }
                requestItemMapper.insert(item);
            }
        }
        
        return request;
    }

    // 更新申请状态
    public boolean updateRequestStatus(Long id, String status) {
        return requestMapper.updateStatus(id, status) > 0;
    }

    // 审批通过
    public boolean approveRequest(Long id) {
        return updateRequestStatus(id, "APPROVED");
    }

    // 审批拒绝
    public boolean rejectRequest(Long id) {
        return updateRequestStatus(id, "REJECTED");
    }

    // 取消申请
    public boolean cancelRequest(Long id) {
        return updateRequestStatus(id, "CANCELLED");
    }

    // 删除采购申请
    @Transactional
    public boolean deleteRequest(Long id) {
        // 先删除明细
        requestItemMapper.deleteByRequestId(id);
        // 再删除主表
        return requestMapper.deleteById(id) > 0;
    }

    // 生成申请单号
    private String generateRequestNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "PR" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }

    // 计算总金额
    private BigDecimal calculateTotalAmount(List<PurchaseRequestItem> items) {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal total = BigDecimal.ZERO;
        for (PurchaseRequestItem item : items) {
            if (item.getAmount() != null) {
                total = total.add(item.getAmount());
            } else if (item.getQuantity() != null && item.getEstimatedPrice() != null) {
                total = total.add(item.getQuantity().multiply(item.getEstimatedPrice()));
            }
        }
        return total;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
