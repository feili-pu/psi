package com.lifei.psi.service;

import com.lifei.psi.entity.PurchaseComparison;
import com.lifei.psi.entity.SupplierQuotation;
import com.lifei.psi.entity.SupplierQuotationItem;
import com.lifei.psi.mapper.PurchaseComparisonMapper;
import com.lifei.psi.mapper.SupplierQuotationMapper;
import com.lifei.psi.mapper.SupplierQuotationItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PurchaseComparisonService {

    @Autowired
    private PurchaseComparisonMapper comparisonMapper;

    @Autowired
    private SupplierQuotationMapper quotationMapper;

    @Autowired
    private SupplierQuotationItemMapper quotationItemMapper;

    // 获取所有采购比价
    public List<PurchaseComparison> getAllComparisons() {
        return comparisonMapper.findAll();
    }

    // 根据ID获取采购比价
    public PurchaseComparison getComparisonById(Long id) {
        return comparisonMapper.findById(id);
    }

    // 根据询价单ID查询比价
    public List<PurchaseComparison> getComparisonsByInquiryId(Long inquiryId) {
        return comparisonMapper.findByInquiryId(inquiryId);
    }

    // 根据比价人查询
    public List<PurchaseComparison> getComparisonsByComparer(String comparer) {
        return comparisonMapper.findByComparer(comparer);
    }

    // 根据状态查询
    public List<PurchaseComparison> getComparisonsByStatus(String status) {
        return comparisonMapper.findByStatus(status);
    }

    // 获取比价数据（包含所有报价信息）
    public Map<String, Object> getComparisonData(Long inquiryId) {
        // 获取该询价单的所有报价
        List<SupplierQuotation> quotations = quotationMapper.findByInquiryId(inquiryId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("quotations", quotations);
        
        // 为每个报价获取明细
        Map<Long, List<SupplierQuotationItem>> quotationItems = new HashMap<>();
        for (SupplierQuotation quotation : quotations) {
            List<SupplierQuotationItem> items = quotationItemMapper.findByQuotationId(quotation.getId());
            quotationItems.put(quotation.getId(), items);
        }
        result.put("quotationItems", quotationItems);
        
        return result;
    }

    // 创建采购比价
    @Transactional
    public PurchaseComparison createComparison(PurchaseComparison comparison) {
        // 生成比价单号
        comparison.setComparisonNo(generateComparisonNo());
        if (isBlank(comparison.getStatus())) {
            comparison.setStatus("PENDING");
        }
        comparison.setComparisonDate(LocalDateTime.now());
        comparison.setCreatedTime(LocalDateTime.now());
        comparison.setUpdatedTime(LocalDateTime.now());
        
        // 插入比价单
        comparisonMapper.insert(comparison);
        
        return comparison;
    }

    // 更新采购比价
    @Transactional
    public PurchaseComparison updateComparison(PurchaseComparison comparison) {
        comparison.setUpdatedTime(LocalDateTime.now());
        
        // 更新比价单
        comparisonMapper.update(comparison);
        
        return comparison;
    }

    // 完成比价并选择供应商
    @Transactional
    public boolean completeComparison(Long id, Long selectedQuotationId, String selectionReason) {
        PurchaseComparison comparison = comparisonMapper.findById(id);
        if (comparison == null) {
            return false;
        }
        
        comparison.setSelectedQuotationId(selectedQuotationId);
        comparison.setSelectionReason(selectionReason);
        comparison.setStatus("COMPLETED");
        comparison.setUpdatedTime(LocalDateTime.now());
        
        // 更新比价状态
        int updated = comparisonMapper.update(comparison);
        
        // 如果比价完成，更新选中的报价状态
        if (updated > 0 && selectedQuotationId != null) {
            quotationMapper.updateStatus(selectedQuotationId, "SELECTED");
            
            // 将其他报价设为拒绝状态
            List<SupplierQuotation> quotations = quotationMapper.findByInquiryId(comparison.getInquiryId());
            for (SupplierQuotation quotation : quotations) {
                if (!quotation.getId().equals(selectedQuotationId)) {
                    quotationMapper.updateStatus(quotation.getId(), "REJECTED");
                }
            }
        }
        
        return updated > 0;
    }

    // 更新比价状态
    public boolean updateComparisonStatus(Long id, String status) {
        return comparisonMapper.updateStatus(id, status) > 0;
    }

    // 取消比价
    public boolean cancelComparison(Long id) {
        return updateComparisonStatus(id, "CANCELLED");
    }

    // 删除采购比价
    @Transactional
    public boolean deleteComparison(Long id) {
        return comparisonMapper.deleteById(id) > 0;
    }

    // 生成比价单号
    private String generateComparisonNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "PC" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
