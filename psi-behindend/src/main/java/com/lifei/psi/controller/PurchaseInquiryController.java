package com.lifei.psi.controller;

import com.lifei.psi.dto.PurchaseInquiryRequest;
import com.lifei.psi.dto.PurchaseInquiryItemRequest;
import com.lifei.psi.entity.PurchaseInquiry;
import com.lifei.psi.entity.PurchaseInquiryItem;
import com.lifei.psi.service.PurchaseInquiryService;
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
@RequestMapping("/api/purchase/inquiries")
@Tag(name = "采购询价管理", description = "采购询价单的创建、管理和查询")
public class PurchaseInquiryController {

    @Autowired
    private PurchaseInquiryService inquiryService;

    @GetMapping
    @Operation(summary = "获取所有采购询价", description = "获取系统中所有的采购询价单列表")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功", 
                    content = @Content(schema = @Schema(implementation = PurchaseInquiry.class)))
    })
    public List<PurchaseInquiry> getAllInquiries() {
        return inquiryService.getAllInquiries();
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取采购询价", description = "根据询价单ID获取详细信息，包含询价明细")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "询价单不存在")
    })
    public Map<String, Object> getInquiryById(
            @Parameter(description = "询价单ID", required = true) @PathVariable Long id) {
        PurchaseInquiry inquiry = inquiryService.getInquiryById(id);
        List<PurchaseInquiryItem> items = inquiryService.getInquiryItems(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("inquiry", inquiry);
        result.put("items", items);
        return result;
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "获取询价明细", description = "根据询价单ID获取明细列表")
    public List<PurchaseInquiryItem> getInquiryItems(
            @Parameter(description = "询价单ID", required = true) @PathVariable Long id) {
        return inquiryService.getInquiryItems(id);
    }

    @GetMapping("/search")
    @Operation(summary = "根据标题搜索询价单", description = "根据询价标题进行模糊搜索")
    public List<PurchaseInquiry> searchInquiries(
            @Parameter(description = "搜索关键词", required = true) @RequestParam String title) {
        return inquiryService.searchByTitle(title);
    }

    @GetMapping("/inquirer/{inquirer}")
    @Operation(summary = "根据询价人查询", description = "获取指定询价人的所有询价单")
    public List<PurchaseInquiry> getInquiriesByInquirer(
            @Parameter(description = "询价人姓名", required = true) @PathVariable String inquirer) {
        return inquiryService.getInquiriesByInquirer(inquirer);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "根据状态查询", description = "获取指定状态的询价单列表")
    public List<PurchaseInquiry> getInquiriesByStatus(
            @Parameter(description = "询价状态：ACTIVE(询价中), COMPLETED(已完成), CANCELLED(已取消)", 
                      required = true) @PathVariable String status) {
        return inquiryService.getInquiriesByStatus(status);
    }

    @GetMapping("/request/{requestId}")
    @Operation(summary = "根据申请单ID查询", description = "获取关联指定采购申请单的询价单")
    public List<PurchaseInquiry> getInquiriesByRequestId(
            @Parameter(description = "采购申请单ID", required = true) @PathVariable Long requestId) {
        return inquiryService.getInquiriesByRequestId(requestId);
    }

    @PostMapping
    @Operation(summary = "创建采购询价", description = "创建新的采购询价单")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "创建成功"),
            @ApiResponse(responseCode = "400", description = "数据验证失败")
    })
    public Map<String, Object> createInquiry(
            @Parameter(description = "询价单信息", required = true) 
            @Valid @RequestBody PurchaseInquiryRequest request, 
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
            System.out.println("接收到的采购询价数据:");
            System.out.println("询价标题: " + request.getTitle());
            System.out.println("询价人: " + request.getInquirer());
            System.out.println("明细数量: " + (request.getItems() != null ? request.getItems().size() : 0));
            
            PurchaseInquiry inquiry = convertToEntity(request);
            List<PurchaseInquiryItem> items = convertToItemEntities(request.getItems());
            
            PurchaseInquiry created = inquiryService.createInquiry(inquiry, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "采购询价创建成功");
            result.put("inquiry", created);
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

    @PostMapping("/from-request/{requestId}")
    @Operation(summary = "从采购申请创建询价", description = "基于现有采购申请单创建询价单")
    public Map<String, Object> createInquiryFromRequest(
            @Parameter(description = "采购申请单ID", required = true) @PathVariable Long requestId, 
            @Parameter(description = "询价单信息", required = true)
            @Valid @RequestBody PurchaseInquiryRequest request,
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
            System.out.println("从采购申请创建询价，申请单ID: " + requestId);
            
            PurchaseInquiry inquiry = convertToEntity(request);
            List<PurchaseInquiryItem> items = convertToItemEntities(request.getItems());
            
            PurchaseInquiry created = inquiryService.createInquiryFromRequest(requestId, inquiry, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "从采购申请创建询价成功");
            result.put("inquiry", created);
            return result;
            
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "创建失败: " + e.getMessage());
            return result;
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新采购询价", description = "更新现有的采购询价单信息")
    public Map<String, Object> updateInquiry(
            @Parameter(description = "询价单ID", required = true) @PathVariable Long id, 
            @Parameter(description = "询价单信息", required = true)
            @Valid @RequestBody PurchaseInquiryRequest request,
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
            PurchaseInquiry inquiry = convertToEntity(request);
            inquiry.setId(id);
            List<PurchaseInquiryItem> items = convertToItemEntities(request.getItems());
            
            PurchaseInquiry updated = inquiryService.updateInquiry(inquiry, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "采购询价更新成功");
            result.put("inquiry", updated);
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "更新失败: " + e.getMessage());
            return result;
        }
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "完成询价", description = "将询价单状态设置为已完成")
    public Map<String, Object> completeInquiry(
            @Parameter(description = "询价单ID", required = true) @PathVariable Long id) {
        boolean success = inquiryService.completeInquiry(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "询价已完成" : "完成失败");
        return result;
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "取消询价", description = "将询价单状态设置为已取消")
    public Map<String, Object> cancelInquiry(
            @Parameter(description = "询价单ID", required = true) @PathVariable Long id) {
        boolean success = inquiryService.cancelInquiry(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "询价已取消" : "取消失败");
        return result;
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除采购询价", description = "删除指定的采购询价单")
    public Map<String, Object> deleteInquiry(
            @Parameter(description = "询价单ID", required = true) @PathVariable Long id) {
        boolean success = inquiryService.deleteInquiry(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "采购询价删除成功" : "删除失败");
        return result;
    }

    // 转换DTO到实体类
    private PurchaseInquiry convertToEntity(PurchaseInquiryRequest request) {
        PurchaseInquiry inquiry = new PurchaseInquiry();
        inquiry.setRequestId(request.getRequestId());
        inquiry.setTitle(request.getTitle());
        inquiry.setInquirer(request.getInquirer());
        inquiry.setRemarks(request.getRemarks());
        
        // 处理报价截止日期
        if (request.getDeadlineDate() != null && !request.getDeadlineDate().isEmpty()) {
            try {
                inquiry.setDeadlineDate(LocalDate.parse(request.getDeadlineDate()));
            } catch (Exception e) {
                // 如果解析失败，设置默认值（7天后）
                inquiry.setDeadlineDate(LocalDate.now().plusDays(7));
            }
        } else {
            // 默认7天后截止
            inquiry.setDeadlineDate(LocalDate.now().plusDays(7));
        }
        
        return inquiry;
    }

    // 转换明细DTO到实体类
    private List<PurchaseInquiryItem> convertToItemEntities(List<PurchaseInquiryItemRequest> itemRequests) {
        List<PurchaseInquiryItem> items = new ArrayList<>();
        if (itemRequests != null) {
            for (PurchaseInquiryItemRequest itemRequest : itemRequests) {
                PurchaseInquiryItem item = new PurchaseInquiryItem();
                item.setProductName(itemRequest.getProductName());
                item.setProductCode(itemRequest.getProductCode());
                item.setSpecification(itemRequest.getSpecification());
                item.setUnit(itemRequest.getUnit());
                item.setQuantity(itemRequest.getQuantity());
                item.setTechnicalRequirements(itemRequest.getTechnicalRequirements());
                item.setRemarks(itemRequest.getRemarks());
                
                items.add(item);
            }
        }
        return items;
    }
}