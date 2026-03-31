package com.lifei.psi.service;

import com.lifei.psi.dto.SalesExecutionReport;
import com.lifei.psi.dto.SalesProfitReport;
import com.lifei.psi.dto.SalesSummaryReport;
import com.lifei.psi.mapper.SalesStatisticsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SalesStatisticsService {

    @Autowired
    private SalesStatisticsMapper statisticsMapper;

    /**
     * 获取销售订单执行情况报表
     */
    public List<SalesExecutionReport> getSalesExecutionReport(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfMonth(1); // 本月第一天
        }
        if (endDate == null) {
            endDate = LocalDate.now(); // 今天
        }
        return statisticsMapper.getSalesExecutionReport(startDate, endDate);
    }

    /**
     * 获取销售订单毛利润明细报表
     */
    public List<SalesProfitReport> getSalesProfitDetailReport(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfMonth(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        return statisticsMapper.getSalesProfitDetailReport(startDate, endDate);
    }

    /**
     * 获取销售订单毛利润汇总
     */
    public SalesSummaryReport getSalesProfitSummary(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfMonth(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        return statisticsMapper.getSalesProfitSummary(startDate, endDate);
    }

    /**
     * 获取销售订单汇总（总体）
     */
    public SalesSummaryReport getSalesOrderSummary(LocalDate startDate, LocalDate endDate) {
        return getSalesProfitSummary(startDate, endDate);
    }

    /**
     * 按部门汇总销售订单
     * 注：由于当前数据结构中销售员没有直接关联部门，这里先按销售员分组
     * 实际项目中应该通过员工表关联部门表
     */
    public List<SalesSummaryReport> getSalesSummaryByDepartment(LocalDate startDate, LocalDate endDate) {
        // 暂时返回按销售员的统计，实际应该关联部门表
        return getSalesSummaryBySalesperson(startDate, endDate);
    }

    /**
     * 按业务员汇总销售订单
     */
    public List<SalesSummaryReport> getSalesSummaryBySalesperson(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfMonth(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        return statisticsMapper.getSalesSummaryBySalesperson(startDate, endDate);
    }

    /**
     * 按客户汇总销售订单
     */
    public List<SalesSummaryReport> getSalesSummaryByCustomer(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfMonth(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        return statisticsMapper.getSalesSummaryByCustomer(startDate, endDate);
    }

    /**
     * 按物料汇总销售订单
     */
    public List<SalesSummaryReport> getSalesSummaryByProduct(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfMonth(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        return statisticsMapper.getSalesSummaryByProduct(startDate, endDate);
    }

    /**
     * 获取指定时间段的综合统计信息
     */
    public java.util.Map<String, Object> getComprehensiveStatistics(LocalDate startDate, LocalDate endDate) {
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        
        // 基础统计
        SalesSummaryReport summary = getSalesProfitSummary(startDate, endDate);
        result.put("summary", summary);
        
        // 执行情况统计
        List<SalesExecutionReport> executionReports = getSalesExecutionReport(startDate, endDate);
        result.put("executionReports", executionReports);
        
        // 计算执行率统计
        long totalOrders = executionReports.size();
        long completedOrders = executionReports.stream()
                .mapToLong(r -> "COMPLETED".equals(r.getStatus()) ? 1 : 0)
                .sum();
        long delayedOrders = executionReports.stream()
                .mapToLong(r -> r.getDelayDays() != null && r.getDelayDays() > 0 ? 1 : 0)
                .sum();
        
        result.put("totalOrders", totalOrders);
        result.put("completedOrders", completedOrders);
        result.put("delayedOrders", delayedOrders);
        result.put("completionRate", totalOrders > 0 ? (double) completedOrders / totalOrders * 100 : 0);
        result.put("onTimeRate", totalOrders > 0 ? (double) (totalOrders - delayedOrders) / totalOrders * 100 : 0);
        
        return result;
    }
}