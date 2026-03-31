package com.lifei.psi.service;

import com.lifei.psi.dto.*;
import com.lifei.psi.mapper.PurchaseStatisticsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PurchaseStatisticsService {

    @Autowired
    private PurchaseStatisticsMapper statisticsMapper;

    // 获取采购订单执行情况报表
    public List<PurchaseExecutionReport> getPurchaseExecutionReport(LocalDate startDate, LocalDate endDate) {
        String start = startDate != null ? startDate.toString() : LocalDate.now().minusMonths(1).toString();
        String end = endDate != null ? endDate.toString() : LocalDate.now().toString();
        return statisticsMapper.getPurchaseExecutionReport(start, end);
    }

    // 根据供应商获取执行情况报表
    public List<PurchaseExecutionReport> getPurchaseExecutionBySupplier(String supplierName, 
                                                                       LocalDate startDate, 
                                                                       LocalDate endDate) {
        String start = startDate != null ? startDate.toString() : LocalDate.now().minusMonths(1).toString();
        String end = endDate != null ? endDate.toString() : LocalDate.now().toString();
        return statisticsMapper.getPurchaseExecutionBySupplier(supplierName, start, end);
    }

    // 获取采购订单汇总报表
    public List<PurchaseSummaryReport> getPurchaseSummaryReport(LocalDate startDate, LocalDate endDate) {
        String start = startDate != null ? startDate.toString() : LocalDate.now().minusMonths(12).toString();
        String end = endDate != null ? endDate.toString() : LocalDate.now().toString();
        return statisticsMapper.getPurchaseSummaryReport(start, end);
    }

    // 获取采购订单汇总-部门报表
    public List<PurchaseDepartmentReport> getPurchaseDepartmentReport(LocalDate startDate, LocalDate endDate) {
        String start = startDate != null ? startDate.toString() : LocalDate.now().minusMonths(1).toString();
        String end = endDate != null ? endDate.toString() : LocalDate.now().toString();
        return statisticsMapper.getPurchaseDepartmentReport(start, end);
    }

    // 获取采购订单汇总-采购员报表
    public List<PurchasePurchaserReport> getPurchasePurchaserReport(LocalDate startDate, LocalDate endDate) {
        String start = startDate != null ? startDate.toString() : LocalDate.now().minusMonths(1).toString();
        String end = endDate != null ? endDate.toString() : LocalDate.now().toString();
        return statisticsMapper.getPurchasePurchaserReport(start, end);
    }

    // 获取采购订单汇总-供应商报表
    public List<PurchaseSupplierReport> getPurchaseSupplierReport(LocalDate startDate, LocalDate endDate) {
        String start = startDate != null ? startDate.toString() : LocalDate.now().minusMonths(1).toString();
        String end = endDate != null ? endDate.toString() : LocalDate.now().toString();
        return statisticsMapper.getPurchaseSupplierReport(start, end);
    }

    // 获取采购订单汇总-物料报表
    public List<PurchaseProductReport> getPurchaseProductReport(LocalDate startDate, LocalDate endDate) {
        String start = startDate != null ? startDate.toString() : LocalDate.now().minusMonths(1).toString();
        String end = endDate != null ? endDate.toString() : LocalDate.now().toString();
        return statisticsMapper.getPurchaseProductReport(start, end);
    }

    // 根据产品名称获取物料报表
    public List<PurchaseProductReport> getPurchaseProductByName(String productName, 
                                                              LocalDate startDate, 
                                                              LocalDate endDate) {
        String start = startDate != null ? startDate.toString() : LocalDate.now().minusMonths(1).toString();
        String end = endDate != null ? endDate.toString() : LocalDate.now().toString();
        return statisticsMapper.getPurchaseProductByName(productName, start, end);
    }

    // 获取当月采购执行情况
    public List<PurchaseExecutionReport> getCurrentMonthExecution() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        return getPurchaseExecutionReport(startOfMonth, now);
    }

    // 获取当年采购汇总
    public List<PurchaseSummaryReport> getCurrentYearSummary() {
        LocalDate now = LocalDate.now();
        LocalDate startOfYear = now.withDayOfYear(1);
        return getPurchaseSummaryReport(startOfYear, now);
    }

    // 获取当月部门采购情况
    public List<PurchaseDepartmentReport> getCurrentMonthDepartment() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        return getPurchaseDepartmentReport(startOfMonth, now);
    }

    // 获取当月采购员业绩
    public List<PurchasePurchaserReport> getCurrentMonthPurchaser() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        return getPurchasePurchaserReport(startOfMonth, now);
    }

    // 获取当月供应商合作情况
    public List<PurchaseSupplierReport> getCurrentMonthSupplier() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        return getPurchaseSupplierReport(startOfMonth, now);
    }

    // 获取当月物料采购情况
    public List<PurchaseProductReport> getCurrentMonthProduct() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        return getPurchaseProductReport(startOfMonth, now);
    }
}