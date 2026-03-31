package com.lifei.psi.service;

import com.lifei.psi.entity.SupplierQuotation;
import com.lifei.psi.entity.SupplierQuotationItem;
import com.lifei.psi.mapper.SupplierQuotationMapper;
import com.lifei.psi.mapper.SupplierQuotationItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SupplierQuotationService {

    @Autowired
    private SupplierQuotationMapper quotationMapper;

    @Autowired
    private SupplierQuotationItemMapper quotationItemMapper;

    // 获取所有供应商报价
    public List<SupplierQuotation> getAllQuotations() {
        return quotationMapper.findAll();
    }

    // 根据ID获取供应商报价
    public SupplierQuotation getQuotationById(Long id) {
        return quotationMapper.findById(id);
    }

    // 获取报价明细
    public List<SupplierQuotationItem> getQuotationItems(Long quotationId) {
        return quotationItemMapper.findByQuotationId(quotationId);
    }

    // 根据询价单ID查询报价
    public List<SupplierQuotation> getQuotationsByInquiryId(Long inquiryId) {
        return quotationMapper.findByInquiryId(inquiryId);
    }

    // 根据供应商名称搜索
    public List<SupplierQuotation> searchBySupplier(String supplierName) {
        return quotationMapper.findBySupplierName(supplierName);
    }

    // 根据状态查询
    public List<SupplierQuotation> getQuotationsByStatus(String status) {
        return quotationMapper.findByStatus(status);
    }

    // 创建供应商报价
    @Transactional
    public SupplierQuotation createQuotation(SupplierQuotation quotation, List<SupplierQuotationItem> items) {
        // 生成报价单号
        quotation.setQuotationNo(generateQuotationNo());
        quotation.setQuotationDate(LocalDateTime.now());
        quotation.setCreatedTime(LocalDateTime.now());
        quotation.setUpdatedTime(LocalDateTime.now());
        
        // 计算总金额
        BigDecimal totalAmount = calculateTotalAmount(items);
        quotation.setTotalAmount(totalAmount);
        
        // 插入报价单
        quotationMapper.insert(quotation);
        
        // 插入明细
        if (items != null && !items.isEmpty()) {
            for (SupplierQuotationItem item : items) {
                item.setQuotationId(quotation.getId());
                // 重新计算金额
                item.setAmount(item.getQuantity().multiply(item.getUnitPrice()));
                quotationItemMapper.insert(item);
            }
        }
        
        return quotation;
    }

    // 更新供应商报价
    @Transactional
    public SupplierQuotation updateQuotation(SupplierQuotation quotation, List<SupplierQuotationItem> items) {
        quotation.setUpdatedTime(LocalDateTime.now());
        
        // 计算总金额
        if (items != null) {
            BigDecimal totalAmount = calculateTotalAmount(items);
            quotation.setTotalAmount(totalAmount);
        }
        
        // 更新报价单
        quotationMapper.update(quotation);
        
        // 删除原有明细
        quotationItemMapper.deleteByQuotationId(quotation.getId());
        
        // 插入新明细
        if (items != null && !items.isEmpty()) {
            for (SupplierQuotationItem item : items) {
                item.setQuotationId(quotation.getId());
                item.setAmount(item.getQuantity().multiply(item.getUnitPrice()));
                quotationItemMapper.insert(item);
            }
        }
        
        return quotation;
    }

    // 更新报价状态
    public boolean updateQuotationStatus(Long id, String status) {
        return quotationMapper.updateStatus(id, status) > 0;
    }

    // 选中报价
    public boolean selectQuotation(Long id) {
        return updateQuotationStatus(id, "SELECTED");
    }

    // 拒绝报价
    public boolean rejectQuotation(Long id) {
        return updateQuotationStatus(id, "REJECTED");
    }

    // 删除供应商报价
    @Transactional
    public boolean deleteQuotation(Long id) {
        // 先删除明细
        quotationItemMapper.deleteByQuotationId(id);
        // 再删除主表
        return quotationMapper.deleteById(id) > 0;
    }

    // 根据询价明细ID获取所有报价明细（用于比价）
    public List<SupplierQuotationItem> getQuotationItemsByInquiryItemId(Long inquiryItemId) {
        return quotationItemMapper.findByInquiryItemId(inquiryItemId);
    }

    // 生成报价单号
    private String generateQuotationNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "SQ" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }

    // 计算总金额
    private BigDecimal calculateTotalAmount(List<SupplierQuotationItem> items) {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal total = BigDecimal.ZERO;
        for (SupplierQuotationItem item : items) {
            if (item.getAmount() != null) {
                total = total.add(item.getAmount());
            } else if (item.getQuantity() != null && item.getUnitPrice() != null) {
                total = total.add(item.getQuantity().multiply(item.getUnitPrice()));
            }
        }
        return total;
    }
}