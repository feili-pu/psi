package com.lifei.psi.service;

import com.lifei.psi.entity.SalesQuotation;
import com.lifei.psi.entity.SalesQuotationItem;
import com.lifei.psi.mapper.SalesQuotationMapper;
import com.lifei.psi.mapper.SalesQuotationItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SalesQuotationService {

    @Autowired
    private SalesQuotationMapper quotationMapper;

    @Autowired
    private SalesQuotationItemMapper itemMapper;

    // 获取所有报价单
    public List<SalesQuotation> getAllQuotations() {
        return quotationMapper.findAll();
    }

    // 根据ID获取报价单（包含明细）
    public SalesQuotation getQuotationById(Long id) {
        return quotationMapper.findById(id);
    }

    // 获取报价单明细
    public List<SalesQuotationItem> getQuotationItems(Long quotationId) {
        return itemMapper.findByQuotationId(quotationId);
    }

    // 根据客户名称搜索
    public List<SalesQuotation> searchByCustomer(String customerName) {
        return quotationMapper.findByCustomerName(customerName);
    }

    // 根据销售员查询
    public List<SalesQuotation> getQuotationsBySalesperson(String salesperson) {
        return quotationMapper.findBySalesperson(salesperson);
    }

    // 根据状态查询
    public List<SalesQuotation> getQuotationsByStatus(String status) {
        return quotationMapper.findByStatus(status);
    }

    // 创建报价单
    @Transactional
    public SalesQuotation createQuotation(SalesQuotation quotation, List<SalesQuotationItem> items) {
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
            for (SalesQuotationItem item : items) {
                item.setQuotationId(quotation.getId());
                // 重新计算金额
                item.setAmount(item.getQuantity().multiply(item.getUnitPrice()));
                itemMapper.insert(item);
            }
        }
        
        return quotation;
    }

    // 更新报价单
    @Transactional
    public SalesQuotation updateQuotation(SalesQuotation quotation, List<SalesQuotationItem> items) {
        quotation.setUpdatedTime(LocalDateTime.now());
        
        // 计算总金额
        if (items != null) {
            BigDecimal totalAmount = calculateTotalAmount(items);
            quotation.setTotalAmount(totalAmount);
        }
        
        // 更新报价单
        quotationMapper.update(quotation);
        
        // 删除原有明细
        itemMapper.deleteByQuotationId(quotation.getId());
        
        // 插入新明细
        if (items != null && !items.isEmpty()) {
            for (SalesQuotationItem item : items) {
                item.setQuotationId(quotation.getId());
                item.setAmount(item.getQuantity().multiply(item.getUnitPrice()));
                itemMapper.insert(item);
            }
        }
        
        return quotation;
    }

    // 更新报价单状态
    public boolean updateQuotationStatus(Long id, String status) {
        return quotationMapper.updateStatus(id, status) > 0;
    }

    // 发送报价单（更新状态为已发送）
    public boolean sendQuotation(Long id) {
        return updateQuotationStatus(id, "SENT");
    }

    // 接受报价单
    public boolean acceptQuotation(Long id) {
        return updateQuotationStatus(id, "ACCEPTED");
    }

    // 拒绝报价单
    public boolean rejectQuotation(Long id) {
        return updateQuotationStatus(id, "REJECTED");
    }

    // 删除报价单
    @Transactional
    public boolean deleteQuotation(Long id) {
        // 先删除明细
        itemMapper.deleteByQuotationId(id);
        // 再删除主表
        return quotationMapper.deleteById(id) > 0;
    }

    // 生成报价单号
    private String generateQuotationNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "QT" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }

    // 计算总金额 - 修复版本
    private BigDecimal calculateTotalAmount(List<SalesQuotationItem> items) {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal total = BigDecimal.ZERO;
        for (SalesQuotationItem item : items) {
            if (item.getAmount() != null) {
                total = total.add(item.getAmount());
            }
        }
        return total;
    }
}