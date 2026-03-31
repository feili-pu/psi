package com.lifei.psi.controller;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.dto.SalesExecutionReport;
import com.lifei.psi.dto.SalesProfitReport;
import com.lifei.psi.dto.SalesSummaryReport;
import com.lifei.psi.service.SalesStatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@Tag(name = "销售统计管理", description = "销售相关的统计报表和分析")
@RequirePermission("statistics:sales")
public class SalesStatisticsController {

    @Autowired
    private SalesStatisticsService statisticsService;

    @GetMapping("/execution")
    @Operation(summary = "销售订单执行情况报表", description = "获取指定时间范围内的销售订单执行情况统计")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "查询成功", 
                    content = @Content(schema = @Schema(implementation = SalesExecutionReport.class)))
    })
    public Map<String, Object> getSalesExecutionReport(
            @Parameter(description = "开始日期，格式：yyyy-MM-dd") @RequestParam(required = false) String startDate,
            @Parameter(description = "结束日期，格式：yyyy-MM-dd") @RequestParam(required = false) String endDate) {
        try {
            LocalDate start = parseDate(startDate);
            LocalDate end = parseDate(endDate);
            
            List<SalesExecutionReport> reports = statisticsService.getSalesExecutionReport(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "销售订单执行情况查询成功");
            result.put("data", reports);
            result.put("startDate", start);
            result.put("endDate", end);
            result.put("totalCount", reports.size());
            
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 销售订单毛利润明细报表
     */
    @GetMapping("/profit/detail")
    public Map<String, Object> getSalesProfitDetailReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            LocalDate start = parseDate(startDate);
            LocalDate end = parseDate(endDate);
            
            List<SalesProfitReport> reports = statisticsService.getSalesProfitDetailReport(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "销售毛利润明细查询成功");
            result.put("data", reports);
            result.put("startDate", start);
            result.put("endDate", end);
            result.put("totalCount", reports.size());
            
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 销售订单毛利润汇总
     */
    @GetMapping("/profit/summary")
    public Map<String, Object> getSalesProfitSummary(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            LocalDate start = parseDate(startDate);
            LocalDate end = parseDate(endDate);
            
            SalesSummaryReport summary = statisticsService.getSalesProfitSummary(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "销售毛利润汇总查询成功");
            result.put("data", summary);
            result.put("startDate", start);
            result.put("endDate", end);
            
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 销售订单汇总
     */
    @GetMapping("/summary")
    public Map<String, Object> getSalesOrderSummary(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            LocalDate start = parseDate(startDate);
            LocalDate end = parseDate(endDate);
            
            SalesSummaryReport summary = statisticsService.getSalesOrderSummary(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "销售订单汇总查询成功");
            result.put("data", summary);
            result.put("startDate", start);
            result.put("endDate", end);
            
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 销售订单汇总-部门
     */
    @GetMapping("/summary/department")
    public Map<String, Object> getSalesSummaryByDepartment(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            LocalDate start = parseDate(startDate);
            LocalDate end = parseDate(endDate);
            
            List<SalesSummaryReport> reports = statisticsService.getSalesSummaryByDepartment(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "按部门销售汇总查询成功");
            result.put("data", reports);
            result.put("startDate", start);
            result.put("endDate", end);
            result.put("totalCount", reports.size());
            
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 销售订单汇总-业务员
     */
    @GetMapping("/summary/salesperson")
    public Map<String, Object> getSalesSummaryBySalesperson(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            LocalDate start = parseDate(startDate);
            LocalDate end = parseDate(endDate);
            
            List<SalesSummaryReport> reports = statisticsService.getSalesSummaryBySalesperson(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "按业务员销售汇总查询成功");
            result.put("data", reports);
            result.put("startDate", start);
            result.put("endDate", end);
            result.put("totalCount", reports.size());
            
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 销售订单汇总-客户
     */
    @GetMapping("/summary/customer")
    public Map<String, Object> getSalesSummaryByCustomer(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            LocalDate start = parseDate(startDate);
            LocalDate end = parseDate(endDate);
            
            List<SalesSummaryReport> reports = statisticsService.getSalesSummaryByCustomer(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "按客户销售汇总查询成功");
            result.put("data", reports);
            result.put("startDate", start);
            result.put("endDate", end);
            result.put("totalCount", reports.size());
            
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 销售订单汇总-物料
     */
    @GetMapping("/summary/product")
    public Map<String, Object> getSalesSummaryByProduct(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            LocalDate start = parseDate(startDate);
            LocalDate end = parseDate(endDate);
            
            List<SalesSummaryReport> reports = statisticsService.getSalesSummaryByProduct(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "按物料销售汇总查询成功");
            result.put("data", reports);
            result.put("startDate", start);
            result.put("endDate", end);
            result.put("totalCount", reports.size());
            
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 综合统计信息（包含多个维度的汇总数据）
     */
    @GetMapping("/comprehensive")
    public Map<String, Object> getComprehensiveStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            LocalDate start = parseDate(startDate);
            LocalDate end = parseDate(endDate);
            
            Map<String, Object> statistics = statisticsService.getComprehensiveStatistics(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "综合统计信息查询成功");
            result.put("data", statistics);
            result.put("startDate", start);
            result.put("endDate", end);
            
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 销售仪表板数据（快速概览）
     */
    @GetMapping("/dashboard")
    public Map<String, Object> getSalesDashboard() {
        try {
            // 本月数据
            LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
            LocalDate today = LocalDate.now();
            
            // 上月数据（用于对比）
            LocalDate lastMonthStart = monthStart.minusMonths(1);
            LocalDate lastMonthEnd = monthStart.minusDays(1);
            
            // 本月统计
            SalesSummaryReport thisMonth = statisticsService.getSalesProfitSummary(monthStart, today);
            Map<String, Object> thisMonthStats = statisticsService.getComprehensiveStatistics(monthStart, today);
            
            // 上月统计
            SalesSummaryReport lastMonth = statisticsService.getSalesProfitSummary(lastMonthStart, lastMonthEnd);
            
            // 计算环比增长
            double salesGrowth = 0;
            double profitGrowth = 0;
            if (lastMonth.getTotalAmount() != null && lastMonth.getTotalAmount().doubleValue() > 0) {
                salesGrowth = (thisMonth.getTotalAmount().doubleValue() - lastMonth.getTotalAmount().doubleValue()) 
                            / lastMonth.getTotalAmount().doubleValue() * 100;
            }
            if (lastMonth.getGrossProfit() != null && lastMonth.getGrossProfit().doubleValue() > 0) {
                profitGrowth = (thisMonth.getGrossProfit().doubleValue() - lastMonth.getGrossProfit().doubleValue()) 
                             / lastMonth.getGrossProfit().doubleValue() * 100;
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "销售仪表板数据查询成功");
            
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("thisMonth", thisMonth);
            dashboard.put("lastMonth", lastMonth);
            dashboard.put("salesGrowth", Math.round(salesGrowth * 100.0) / 100.0);
            dashboard.put("profitGrowth", Math.round(profitGrowth * 100.0) / 100.0);
            dashboard.put("executionStats", thisMonthStats);
            
            result.put("data", dashboard);
            result.put("period", "本月(" + monthStart + " 至 " + today + ")");
            
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 解析日期字符串
     */
    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        } catch (Exception e) {
            throw new RuntimeException("日期格式错误，请使用 yyyy-MM-dd 格式，如：2025-01-01");
        }
    }
}