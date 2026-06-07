package com.lifei.psi.service;

import com.lifei.psi.entity.PurchaseInquiry;
import com.lifei.psi.entity.PurchaseInquiryItem;
import com.lifei.psi.mapper.PurchaseInquiryMapper;
import com.lifei.psi.mapper.PurchaseInquiryItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PurchaseInquiryService {

    @Autowired
    private PurchaseInquiryMapper inquiryMapper;

    @Autowired
    private PurchaseInquiryItemMapper inquiryItemMapper;

    // 获取所有采购询价
    public List<PurchaseInquiry> getAllInquiries() {
        return inquiryMapper.findAll();
    }

    // 根据ID获取采购询价
    public PurchaseInquiry getInquiryById(Long id) {
        return inquiryMapper.findById(id);
    }

    // 获取询价明细
    public List<PurchaseInquiryItem> getInquiryItems(Long inquiryId) {
        return inquiryItemMapper.findByInquiryId(inquiryId);
    }

    // 根据标题搜索
    public List<PurchaseInquiry> searchByTitle(String title) {
        return inquiryMapper.findByTitle(title);
    }

    // 根据询价人查询
    public List<PurchaseInquiry> getInquiriesByInquirer(String inquirer) {
        return inquiryMapper.findByInquirer(inquirer);
    }

    // 根据状态查询
    public List<PurchaseInquiry> getInquiriesByStatus(String status) {
        return inquiryMapper.findByStatus(status);
    }

    // 根据申请单ID查询
    public List<PurchaseInquiry> getInquiriesByRequestId(Long requestId) {
        return inquiryMapper.findByRequestId(requestId);
    }

    // 创建采购询价
    @Transactional
    public PurchaseInquiry createInquiry(PurchaseInquiry inquiry, List<PurchaseInquiryItem> items) {
        // 生成询价单号
        inquiry.setInquiryNo(generateInquiryNo());
        if (isBlank(inquiry.getStatus())) {
            inquiry.setStatus("ACTIVE");
        }
        inquiry.setInquiryDate(LocalDateTime.now());
        inquiry.setCreatedTime(LocalDateTime.now());
        inquiry.setUpdatedTime(LocalDateTime.now());
        
        // 插入询价单
        inquiryMapper.insert(inquiry);
        
        // 插入明细
        if (items != null && !items.isEmpty()) {
            for (PurchaseInquiryItem item : items) {
                item.setInquiryId(inquiry.getId());
                inquiryItemMapper.insert(item);
            }
        }
        
        return inquiry;
    }

    // 从采购申请创建询价
    @Transactional
    public PurchaseInquiry createInquiryFromRequest(Long requestId, PurchaseInquiry inquiryInfo, List<PurchaseInquiryItem> items) {
        inquiryInfo.setRequestId(requestId);
        return createInquiry(inquiryInfo, items);
    }

    // 更新采购询价
    @Transactional
    public PurchaseInquiry updateInquiry(PurchaseInquiry inquiry, List<PurchaseInquiryItem> items) {
        inquiry.setUpdatedTime(LocalDateTime.now());
        
        // 更新询价单
        inquiryMapper.update(inquiry);
        
        // 删除原有明细
        inquiryItemMapper.deleteByInquiryId(inquiry.getId());
        
        // 插入新明细
        if (items != null && !items.isEmpty()) {
            for (PurchaseInquiryItem item : items) {
                item.setInquiryId(inquiry.getId());
                inquiryItemMapper.insert(item);
            }
        }
        
        return inquiry;
    }

    // 更新询价状态
    public boolean updateInquiryStatus(Long id, String status) {
        return inquiryMapper.updateStatus(id, status) > 0;
    }

    // 完成询价
    public boolean completeInquiry(Long id) {
        return updateInquiryStatus(id, "COMPLETED");
    }

    // 取消询价
    public boolean cancelInquiry(Long id) {
        return updateInquiryStatus(id, "CANCELLED");
    }

    // 删除采购询价
    @Transactional
    public boolean deleteInquiry(Long id) {
        // 先删除明细
        inquiryItemMapper.deleteByInquiryId(id);
        // 再删除主表
        return inquiryMapper.deleteById(id) > 0;
    }

    // 生成询价单号
    private String generateInquiryNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "PI" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
