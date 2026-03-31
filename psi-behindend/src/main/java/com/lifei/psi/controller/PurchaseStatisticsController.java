package com.lifei.psi.controller;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.dto.*;
import com.lifei.psi.service.PurchaseStatisticsService;
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
@RequestMapping("/api/purchase/statistics")
@Tag(name = "采购统计管理", description = "采购相关的统计报表和分析")
@RequirePermission("statistics:purchase")
public class PurchaseStatisticsController {

    @Autowired
    private PurchaseStatisticsService statisticsService;

    @GetMapping("/execution")
    @Operation(summary = "采购订单执行情况报表", description = "获取指定时间范围内的采购订单执行情况统计")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "查询成功", 
                    content = @Content(schema = @Schema(implementation = PurchaseExecutionReport.class)))
    })
    public Map<String, Object> getPurchaseExecutionReport(
            @Parameter(description = "开始日期，格式：yyyy-MM-dd") @RequestParam(required = false) String startDate,
            @Parameter(description = "结束日期，格式：yyyy-MM-dd") @RequestParam(required = false) String endDate) {
        
        try {
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
            
            List<PurchaseExecutionReport> reports = statisticsService.getPurchaseExecutionReport(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            result.put("startDate", start != null ? start.toString() : LocalDate.now().minusMonths(1).toString());
            result.put("endDate", end != null ? end.toString() : LocalDate.now().toString());
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    @GetMapping("/execution/supplier/{supplierName}")
    @Operation(summary = "根据供应商查询执行情况", description = "获取指定供应商的采购订单执行情况")
    public Map<String, Object> getPurchaseExecutionBySupplier(
            @PathVariable String supplierName,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
            
            List<PurchaseExecutionReport> reports = statisticsService.getPurchaseExecutionBySupplier(supplierName, start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            result.put("supplierName", supplierName);
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 当月执行情况
    @GetMapping("/execution/current-month")
    public Map<String, Object> getCurrentMonthExecution() {
        try {
            List<PurchaseExecutionReport> reports = statisticsService.getCurrentMonthExecution();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            result.put("period", "当月");
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 采购订单汇总报表
    @GetMapping("/summary")
    public Map<String, Object> getPurchaseSummaryReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
            
            List<PurchaseSummaryReport> reports = statisticsService.getPurchaseSummaryReport(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 当年汇总
    @GetMapping("/summary/current-year")
    public Map<String, Object> getCurrentYearSummary() {
        try {
            List<PurchaseSummaryReport> reports = statisticsService.getCurrentYearSummary();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            result.put("period", "当年");
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 采购订单汇总-部门报表
    @GetMapping("/summary/department")
    public Map<String, Object> getPurchaseDepartmentReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
            
            List<PurchaseDepartmentReport> reports = statisticsService.getPurchaseDepartmentReport(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 当月部门采购情况
    @GetMapping("/summary/department/current-month")
    public Map<String, Object> getCurrentMonthDepartment() {
        try {
            List<PurchaseDepartmentReport> reports = statisticsService.getCurrentMonthDepartment();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            result.put("period", "当月");
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 采购订单汇总-采购员报表
    @GetMapping("/summary/purchaser")
    public Map<String, Object> getPurchasePurchaserReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
            
            List<PurchasePurchaserReport> reports = statisticsService.getPurchasePurchaserReport(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 当月采购员业绩
    @GetMapping("/summary/purchaser/current-month")
    public Map<String, Object> getCurrentMonthPurchaser() {
        try {
            List<PurchasePurchaserReport> reports = statisticsService.getCurrentMonthPurchaser();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            result.put("period", "当月");
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 采购订单汇总-供应商报表
    @GetMapping("/summary/supplier")
    public Map<String, Object> getPurchaseSupplierReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
            
            List<PurchaseSupplierReport> reports = statisticsService.getPurchaseSupplierReport(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 当月供应商合作情况
    @GetMapping("/summary/supplier/current-month")
    public Map<String, Object> getCurrentMonthSupplier() {
        try {
            List<PurchaseSupplierReport> reports = statisticsService.getCurrentMonthSupplier();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            result.put("period", "当月");
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 采购订单汇总-物料报表
    @GetMapping("/summary/product")
    public Map<String, Object> getPurchaseProductReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
            
            List<PurchaseProductReport> reports = statisticsService.getPurchaseProductReport(start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 根据产品名称查询物料报表
    @GetMapping("/summary/product/search")
    public Map<String, Object> getPurchaseProductByName(
            @RequestParam String productName,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
            
            List<PurchaseProductReport> reports = statisticsService.getPurchaseProductByName(productName, start, end);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            result.put("productName", productName);
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }

    // 当月物料采购情况
    @GetMapping("/summary/product/current-month")
    public Map<String, Object> getCurrentMonthProduct() {
        try {
            List<PurchaseProductReport> reports = statisticsService.getCurrentMonthProduct();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", reports);
            result.put("count", reports.size());
            result.put("period", "当月");
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "查询失败: " + e.getMessage());
            return result;
        }
    }
}