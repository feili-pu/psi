package com.lifei.psi.controller;

import com.lifei.psi.dto.SupplierQuotationRequest;
import com.lifei.psi.dto.SupplierQuotationItemRequest;
import com.lifei.psi.entity.SupplierQuotation;
import com.lifei.psi.entity.SupplierQuotationItem;
import com.lifei.psi.service.SupplierQuotationService;
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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase/quotations")
@Tag(name = "供应商报价管理", description = "供应商报价的提交、管理和选择")
public class SupplierQuotationController {

    @Autowired
    private SupplierQuotationService quotationService;

    @GetMapping
    @Operation(summary = "获取所有供应商报价", description = "获取系统中所有的供应商报价单列表")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功", 
                    content = @Content(schema = @Schema(implementation = SupplierQuotation.class)))
    })
    public List<SupplierQuotation> getAllQuotations() {
        return quotationService.getAllQuotations();
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取供应商报价", description = "根据报价单ID获取详细信息，包含报价明细")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "报价单不存在")
    })
    public Map<String, Object> getQuotationById(
            @Parameter(description = "报价单ID", required = true) @PathVariable Long id) {
        SupplierQuotation quotation = quotationService.getQuotationById(id);
        List<SupplierQuotationItem> items = quotationService.getQuotationItems(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("quotation", quotation);
        result.put("items", items);
        return result;
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "获取报价明细", description = "根据报价单ID获取明细列表")
    public List<SupplierQuotationItem> getQuotationItems(
            @Parameter(description = "报价单ID", required = true) @PathVariable Long id) {
        return quotationService.getQuotationItems(id);
    }

    @GetMapping("/inquiry/{inquiryId}")
    @Operation(summary = "根据询价单ID查询报价", description = "获取指定询价单的所有供应商报价")
    public List<SupplierQuotation> getQuotationsByInquiryId(
            @Parameter(description = "询价单ID", required = true) @PathVariable Long inquiryId) {
        return quotationService.getQuotationsByInquiryId(inquiryId);
    }

    @GetMapping("/search")
    @Operation(summary = "根据供应商名称搜索", description = "根据供应商名称进行模糊搜索")
    public List<SupplierQuotation> searchQuotations(
            @Parameter(description = "供应商名称", required = true) @RequestParam String supplierName) {
        return quotationService.searchBySupplier(supplierName);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "根据状态查询", description = "获取指定状态的报价单列表")
    public List<SupplierQuotation> getQuotationsByStatus(
            @Parameter(description = "报价状态：SUBMITTED(已提交), SELECTED(已选中), REJECTED(已拒绝)", 
                      required = true) @PathVariable String status) {
        return quotationService.getQuotationsByStatus(status);
    }

    @GetMapping("/items/inquiry-item/{inquiryItemId}")
    @Operation(summary = "获取询价明细的所有报价", description = "根据询价明细ID获取所有供应商的报价明细，用于比价")
    public List<SupplierQuotationItem> getQuotationItemsByInquiryItemId(
            @Parameter(description = "询价明细ID", required = true) @PathVariable Long inquiryItemId) {
        return quotationService.getQuotationItemsByInquiryItemId(inquiryItemId);
    }

    @PostMapping
    @Operation(summary = "创建供应商报价", description = "创建新的供应商报价单")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "创建成功"),
            @ApiResponse(responseCode = "400", description = "数据验证失败")
    })
    public Map<String, Object> createQuotation(
            @Parameter(description = "报价单信息", required = true)
            @Valid @RequestBody SupplierQuotationRequest request, 
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
            System.out.println("接收到的供应商报价数据:");
            System.out.println("供应商名称: " + request.getSupplierName());
            System.out.println("询价单ID: " + request.getInquiryId());
            System.out.println("明细数量: " + (request.getItems() != null ? request.getItems().size() : 0));
            
            SupplierQuotation quotation = convertToEntity(request);
            List<SupplierQuotationItem> items = convertToItemEntities(request.getItems());
            
            SupplierQuotation created = quotationService.createQuotation(quotation, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "供应商报价创建成功");
            result.put("quotation", created);
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

    @PutMapping("/{id}")
    @Operation(summary = "更新供应商报价", description = "更新现有的供应商报价单信息")
    public Map<String, Object> updateQuotation(
            @Parameter(description = "报价单ID", required = true) @PathVariable Long id, 
            @Parameter(description = "报价单信息", required = true)
            @Valid @RequestBody SupplierQuotationRequest request,
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
            SupplierQuotation quotation = convertToEntity(request);
            quotation.setId(id);
            List<SupplierQuotationItem> items = convertToItemEntities(request.getItems());
            
            SupplierQuotation updated = quotationService.updateQuotation(quotation, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "供应商报价更新成功");
            result.put("quotation", updated);
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "更新失败: " + e.getMessage());
            return result;
        }
    }

    @PostMapping("/{id}/select")
    @Operation(summary = "选中报价", description = "将报价单状态设置为已选中，用于后续采购订单创建")
    public Map<String, Object> selectQuotation(
            @Parameter(description = "报价单ID", required = true) @PathVariable Long id) {
        boolean success = quotationService.selectQuotation(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "报价已选中" : "选中失败");
        return result;
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "拒绝报价", description = "将报价单状态设置为已拒绝")
    public Map<String, Object> rejectQuotation(
            @Parameter(description = "报价单ID", required = true) @PathVariable Long id) {
        boolean success = quotationService.rejectQuotation(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "报价已拒绝" : "拒绝失败");
        return result;
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除供应商报价", description = "删除指定的供应商报价单")
    public Map<String, Object> deleteQuotation(
            @Parameter(description = "报价单ID", required = true) @PathVariable Long id) {
        boolean success = quotationService.deleteQuotation(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "供应商报价删除成功" : "删除失败");
        return result;
    }

    // 转换DTO到实体类
    private SupplierQuotation convertToEntity(SupplierQuotationRequest request) {
        SupplierQuotation quotation = new SupplierQuotation();
        quotation.setInquiryId(request.getInquiryId());
        quotation.setSupplierName(request.getSupplierName());
        quotation.setSupplierContact(request.getSupplierContact());
        quotation.setIncludeTax(request.getIncludeTax() != null ? request.getIncludeTax() : false);
        quotation.setPaymentTerms(request.getPaymentTerms());
        quotation.setDeliveryTerms(request.getDeliveryTerms());
        quotation.setRemarks(request.getRemarks());
        
        // 处理报价有效期
        if (request.getValidUntil() != null && !request.getValidUntil().isEmpty()) {
            try {
                quotation.setValidUntil(LocalDate.parse(request.getValidUntil()));
            } catch (Exception e) {
                // 如果解析失败，设置默认值（30天后）
                quotation.setValidUntil(LocalDate.now().plusDays(30));
            }
        } else {
            // 默认30天后有效期
            quotation.setValidUntil(LocalDate.now().plusDays(30));
        }
        
        return quotation;
    }

    // 转换明细DTO到实体类
    private List<SupplierQuotationItem> convertToItemEntities(List<SupplierQuotationItemRequest> itemRequests) {
        List<SupplierQuotationItem> items = new ArrayList<>();
        if (itemRequests != null) {
            for (SupplierQuotationItemRequest itemRequest : itemRequests) {
                SupplierQuotationItem item = new SupplierQuotationItem();
                item.setInquiryItemId(itemRequest.getInquiryItemId());
                item.setProductName(itemRequest.getProductName());
                item.setProductCode(itemRequest.getProductCode());
                item.setSpecification(itemRequest.getSpecification());
                item.setUnit(itemRequest.getUnit());
                item.setQuantity(itemRequest.getQuantity());
                item.setUnitPrice(itemRequest.getUnitPrice());
                item.setDeliveryPeriod(itemRequest.getDeliveryPeriod());
                item.setBrand(itemRequest.getBrand());
                item.setOrigin(itemRequest.getOrigin());
                item.setRemarks(itemRequest.getRemarks());
                
                // 计算金额
                if (itemRequest.getQuantity() != null && itemRequest.getUnitPrice() != null) {
                    item.setAmount(itemRequest.getQuantity().multiply(itemRequest.getUnitPrice()));
                }
                
                items.add(item);
            }
        }
        return items;
    }
}