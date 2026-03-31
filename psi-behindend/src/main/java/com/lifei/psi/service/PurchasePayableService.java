package com.lifei.psi.service;

import com.lifei.psi.entity.PurchasePayable;
import com.lifei.psi.mapper.PurchasePayableMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PurchasePayableService {

    @Autowired
    private PurchasePayableMapper payableMapper;

    // 获取所有采购应付款
    public List<PurchasePayable> getAllPayables() {
        return payableMapper.findAll();
    }

    // 根据ID获取采购应付款
    public PurchasePayable getPayableById(Long id) {
        return payableMapper.findById(id);
    }

    // 根据供应商查询
    public List<PurchasePayable> getPayablesBySupplier(Long supplierId) {
        return payableMapper.findBySupplier(supplierId);
    }

    // 根据状态查询
    public List<PurchasePayable> getPayablesByStatus(String status) {
        return payableMapper.findByStatus(status);
    }

    // 根据应付类型查询
    public List<PurchasePayable> getPayablesByType(String payableType) {
        return payableMapper.findByPayableType(payableType);
    }

    // 根据入库单查询
    public PurchasePayable getPayableByReceiptId(Long receiptId) {
        return payableMapper.findByReceiptId(receiptId);
    }

    // 创建采购应付款
    @Transactional
    public PurchasePayable createPayable(PurchasePayable payable) {
        // 生成应付款单号
        payable.setPayableNo(generatePayableNo());
        payable.setCreatedTime(LocalDateTime.now());
        payable.setUpdatedTime(LocalDateTime.now());
        
        // 插入应付款
        payableMapper.insert(payable);
        
        return payable;
    }

    // 更新采购应付款
    @Transactional
    public PurchasePayable updatePayable(PurchasePayable payable) {
        payable.setUpdatedTime(LocalDateTime.now());
        payableMapper.update(payable);
        return payable;
    }

    // 付款处理
    @Transactional
    public boolean processPayment(Long id, BigDecimal paymentAmount) {
        PurchasePayable payable = payableMapper.findById(id);
        if (payable == null || paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        
        BigDecimal newPaidAmount = payable.getPaidAmount().add(paymentAmount);
        BigDecimal newUnpaidAmount = payable.getTotalAmount().subtract(newPaidAmount);
        
        // 确保不会超付
        if (newUnpaidAmount.compareTo(BigDecimal.ZERO) < 0) {
            return false;
        }
        
        // 确定新状态
        String newStatus;
        if (newUnpaidAmount.compareTo(BigDecimal.ZERO) == 0) {
            newStatus = "PAID";
        } else if (newPaidAmount.compareTo(BigDecimal.ZERO) > 0) {
            newStatus = "PARTIAL_PAID";
        } else {
            newStatus = "UNPAID";
        }
        
        return payableMapper.updatePayment(id, newPaidAmount, newUnpaidAmount, newStatus) > 0;
    }

    // 删除采购应付款
    @Transactional
    public boolean deletePayable(Long id) {
        return payableMapper.deleteById(id) > 0;
    }

    // 生成应付款单号
    private String generatePayableNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "PP" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }
}