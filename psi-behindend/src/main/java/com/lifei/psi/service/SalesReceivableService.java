package com.lifei.psi.service;

import com.lifei.psi.entity.SalesOrder;
import com.lifei.psi.entity.SalesReceivable;
import com.lifei.psi.mapper.SalesReceivableMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SalesReceivableService {

    @Autowired
    private SalesReceivableMapper receivableMapper;

    public List<SalesReceivable> getAllReceivables() {
        return receivableMapper.findAll();
    }

    public SalesReceivable getReceivableById(Long id) {
        return receivableMapper.findById(id);
    }

    public SalesReceivable getReceivableBySalesOrderId(Long salesOrderId) {
        return receivableMapper.findBySalesOrderId(salesOrderId);
    }

    public List<SalesReceivable> getReceivablesByCustomer(String customerName) {
        return receivableMapper.findByCustomerName(customerName);
    }

    public List<SalesReceivable> getReceivablesByStatus(String status) {
        return receivableMapper.findByStatus(status);
    }

    @Transactional
    public SalesReceivable createFromOrder(SalesOrder order) {
        SalesReceivable existing = receivableMapper.findBySalesOrderId(order.getId());
        if (existing != null) {
            return existing;
        }

        BigDecimal totalAmount = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
        SalesReceivable receivable = new SalesReceivable();
        receivable.setReceivableNo(generateReceivableNo());
        receivable.setCustomerName(order.getCustomerName());
        receivable.setSalesOrderId(order.getId());
        receivable.setReceivableType("NORMAL");
        receivable.setTotalAmount(totalAmount);
        receivable.setReceivedAmount(BigDecimal.ZERO);
        receivable.setUnreceivedAmount(totalAmount);
        receivable.setDueDate(LocalDate.now().plusDays(30));
        receivable.setStatus(totalAmount.compareTo(BigDecimal.ZERO) == 0 ? "RECEIVED" : "UNRECEIVED");
        receivable.setRemarks("销售订单 " + order.getOrderNo() + " 交付生成应收");
        receivable.setCreatedTime(LocalDateTime.now());
        receivable.setUpdatedTime(LocalDateTime.now());

        receivableMapper.insert(receivable);
        return receivable;
    }

    @Transactional
    public boolean processCollection(Long id, BigDecimal collectionAmount) {
        SalesReceivable receivable = receivableMapper.findById(id);
        if (receivable == null || collectionAmount == null || collectionAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }

        BigDecimal newReceivedAmount = receivable.getReceivedAmount().add(collectionAmount);
        BigDecimal newUnreceivedAmount = receivable.getTotalAmount().subtract(newReceivedAmount);
        if (newUnreceivedAmount.compareTo(BigDecimal.ZERO) < 0) {
            return false;
        }

        String status = newUnreceivedAmount.compareTo(BigDecimal.ZERO) == 0 ? "RECEIVED" : "PARTIAL_RECEIVED";
        return receivableMapper.updateCollection(id, newReceivedAmount, newUnreceivedAmount, status) > 0;
    }

    private String generateReceivableNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "SR" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }
}
