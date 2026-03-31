package com.lifei.psi.controller;

import com.lifei.psi.dto.PurchaseComparisonRequest;
import com.lifei.psi.entity.PurchaseComparison;
import com.lifei.psi.service.PurchaseComparisonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase/comparisons")
@Tag(name = "采购比价管理", description = "多供应商报价比较和选择")
public class PurchaseComparisonController {

    @Autowired
    private PurchaseComparisonService comparisonService;

    @GetMapping
    @Operation(summary = "获取所有采购比价", description = "获取系统中所有的采购比价单列表")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功", 
                    content = @Content(schema = @Schema(implementation = PurchaseComparison.class)))
    })
    public List<PurchaseComparison> getAllComparisons() {
        return comparisonService.getAllComparisons();
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取采购比价", description = "根据比价单ID获取详细信息")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "比价单不存在")
    })
    public PurchaseComparison getComparisonById(
            @Parameter(description = "比价单ID", required = true) @PathVariable Long id) {
        return comparisonService.getComparisonById(id);
    }

    @GetMapping("/inquiry/{inquiryId}")
    @Operation(summary = "根据询价单ID查询比价", description = "获取指定询价单的所有比价记录")
    public List<PurchaseComparison> getComparisonsByInquiryId(
            @Parameter(description = "询价单ID", required = true) @PathVariable Long inquiryId) {
        return comparisonService.getComparisonsByInquiryId(inquiryId);
    }

    @GetMapping("/comparer/{comparer}")
    @Operation(summary = "根据比价人查询", description = "获取指定比价人的所有比价记录")
    public List<PurchaseComparison> getComparisonsByComparer(
            @Parameter(description = "比价人姓名", required = true) @PathVariable String comparer) {
        return comparisonService.getComparisonsByComparer(comparer);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "根据状态查询", description = "获取指定状态的比价单列表")
    public List<PurchaseComparison> getComparisonsByStatus(
            @Parameter(description = "比价状态：PENDING(待比价), COMPLETED(已完成), CANCELLED(已取消)", 
                      required = true) @PathVariable String status) {
        return comparisonService.getComparisonsByStatus(status);
    }

    // 获取比价数据（包含所有报价信息）
    @GetMapping("/data/inquiry/{inquiryId}")
    public Map<String, Object> getComparisonData(@PathVariable Long inquiryId) {
        try {
            Map<String, Object> data = comparisonService.getComparisonData(inquiryId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", data);
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "获取比价数据失败: " + e.getMessage());
            return result;
        }
    }

    // 创建采购比价
    @PostMapping
    public Map<String, Object> createComparison(@Valid @RequestBody PurchaseComparisonRequest request, 
                                              BindingResult bindingResult) {
        // 检查验证结果
        if (bindingResult.hasErrors()) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "数据验证失败");
            
            List<String> errors = new ArrayList<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.add(error.getField() + ": " + error.getDefaultMessage())
            );
            result.put("errors", errors);
            return result;
        }
        
        try {
            System.out.println("接收到的采购比价数据:");
            System.out.println("比价标题: " + request.getTitle());
            System.out.println("比价人: " + request.getComparer());
            System.out.println("询价单ID: " + request.getInquiryId());
            
            PurchaseComparison comparison = convertToEntity(request);
            PurchaseComparison created = comparisonService.createComparison(comparison);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "采购比价创建成功");
            result.put("comparison", created);
            return result;
            
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "创建失败: " + e.getMessage());
            result.put("error", e.getClass().getSimpleName());
            return result;
        }
    }

    // 更新采购比价
    @PutMapping("/{id}")
    public Map<String, Object> updateComparison(@PathVariable Long id, 
                                              @Valid @RequestBody PurchaseComparisonRequest request,
                                              BindingResult bindingResult) {
        // 检查验证结果
        if (bindingResult.hasErrors()) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "数据验证失败");
            
            List<String> errors = new ArrayList<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.add(error.getField() + ": " + error.getDefaultMessage())
            );
            result.put("errors", errors);
            return result;
        }
        
        try {
            PurchaseComparison comparison = convertToEntity(request);
            comparison.setId(id);
            
            PurchaseComparison updated = comparisonService.updateComparison(comparison);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "采购比价更新成功");
            result.put("comparison", updated);
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "更新失败: " + e.getMessage());
            return result;
        }
    }

    // 完成比价并选择供应商
    @PostMapping("/{id}/complete")
    public Map<String, Object> completeComparison(@PathVariable Long id, 
                                                 @RequestBody Map<String, Object> request) {
        try {
            Long selectedQuotationId = request.get("selectedQuotationId") != null ? 
                Long.valueOf(request.get("selectedQuotationId").toString()) : null;
            String selectionReason = request.get("selectionReason") != null ? 
                request.get("selectionReason").toString() : null;
            
            boolean success = comparisonService.completeComparison(id, selectedQuotationId, selectionReason);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", success);
            result.put("message", success ? "比价已完成，供应商已选择" : "完成失败");
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "完成失败: " + e.getMessage());
            return result;
        }
    }

    // 取消比价
    @PostMapping("/{id}/cancel")
    public Map<String, Object> cancelComparison(@PathVariable Long id) {
        boolean success = comparisonService.cancelComparison(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "比价已取消" : "取消失败");
        return result;
    }

    // 删除采购比价
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteComparison(@PathVariable Long id) {
        boolean success = comparisonService.deleteComparison(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "采购比价删除成功" : "删除失败");
        return result;
    }

    // 转换DTO到实体类
    private PurchaseComparison convertToEntity(PurchaseComparisonRequest request) {
        PurchaseComparison comparison = new PurchaseComparison();
        comparison.setInquiryId(request.getInquiryId());
        comparison.setTitle(request.getTitle());
        comparison.setComparer(request.getComparer());
        comparison.setSelectedQuotationId(request.getSelectedQuotationId());
        comparison.setSelectionReason(request.getSelectionReason());
        comparison.setRemarks(request.getRemarks());
        
        return comparison;
    }
}