package com.lifei.psi.controller;

import com.lifei.psi.dto.SalesQuotationRequest;
import com.lifei.psi.dto.SalesQuotationItemRequest;
import com.lifei.psi.entity.SalesQuotation;
import com.lifei.psi.entity.SalesQuotationItem;
import com.lifei.psi.service.SalesQuotationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quotations")
@Tag(name = "销售报价管理", description = "销售报价单的创建、管理和查询")
public class SalesQuotationController {

    @Autowired
    private SalesQuotationService quotationService;

    @GetMapping
    @Operation(summary = "获取所有销售报价单", description = "获取系统中所有的销售报价单列表")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功", 
                    content = @Content(schema = @Schema(implementation = SalesQuotation.class)))
    })
    public List<SalesQuotation> getAllQuotations() {
        return quotationService.getAllQuotations();
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取销售报价单", description = "根据报价单ID获取详细信息，包含报价明细")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "报价单不存在")
    })
    public Map<String, Object> getQuotationById(
            @Parameter(description = "报价单ID", required = true) @PathVariable Long id) {
        SalesQuotation quotation = quotationService.getQuotationById(id);
        List<SalesQuotationItem> items = quotationService.getQuotationItems(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("quotation", quotation);
        result.put("items", items);
        return result;
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "获取报价单明细", description = "根据报价单ID获取明细列表")
    public List<SalesQuotationItem> getQuotationItems(
            @Parameter(description = "报价单ID", required = true) @PathVariable Long id) {
        return quotationService.getQuotationItems(id);
    }

    @GetMapping("/search")
    @Operation(summary = "根据客户名称搜索", description = "根据客户名称进行模糊搜索")
    public List<SalesQuotation> searchQuotations(
            @Parameter(description = "客户名称", required = true) @RequestParam String customerName) {
        return quotationService.searchByCustomer(customerName);
    }

    // 根据销售员查询
    @GetMapping("/salesperson/{salesperson}")
    public List<SalesQuotation> getQuotationsBySalesperson(@PathVariable String salesperson) {
        return quotationService.getQuotationsBySalesperson(salesperson);
    }

    // 根据状态查询
    @GetMapping("/status/{status}")
    public List<SalesQuotation> getQuotationsByStatus(@PathVariable String status) {
        return quotationService.getQuotationsByStatus(status);
    }

    // 创建报价单 - 使用DTO
    @PostMapping
    public Map<String, Object> createQuotation(@RequestBody SalesQuotationRequest request) {
        try {
            System.out.println("接收到的请求数据:");
            System.out.println("客户名称: " + request.getCustomerName());
            System.out.println("销售员: " + request.getSalesperson());
            System.out.println("明细数量: " + (request.getItems() != null ? request.getItems().size() : 0));
            
            SalesQuotation quotation = convertToEntity(request);
            List<SalesQuotationItem> items = convertToItemEntities(request.getItems());
            
            SalesQuotation created = quotationService.createQuotation(quotation, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "报价单创建成功");
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

    // 更新报价单
    @PutMapping("/{id}")
    public Map<String, Object> updateQuotation(@PathVariable Long id, @RequestBody SalesQuotationRequest request) {
        try {
            SalesQuotation quotation = convertToEntity(request);
            quotation.setId(id);
            List<SalesQuotationItem> items = convertToItemEntities(request.getItems());
            
            SalesQuotation updated = quotationService.updateQuotation(quotation, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "报价单更新成功");
            result.put("quotation", updated);
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "更新失败: " + e.getMessage());
            return result;
        }
    }

    // 发送报价单
    @PostMapping("/{id}/send")
    public Map<String, Object> sendQuotation(@PathVariable Long id) {
        boolean success = quotationService.sendQuotation(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "报价单已发送" : "发送失败");
        return result;
    }

    // 接受报价单
    @PostMapping("/{id}/accept")
    public Map<String, Object> acceptQuotation(@PathVariable Long id) {
        boolean success = quotationService.acceptQuotation(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "报价单已接受" : "操作失败");
        return result;
    }

    // 拒绝报价单
    @PostMapping("/{id}/reject")
    public Map<String, Object> rejectQuotation(@PathVariable Long id) {
        boolean success = quotationService.rejectQuotation(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "报价单已拒绝" : "操作失败");
        return result;
    }

    // 删除报价单
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteQuotation(@PathVariable Long id) {
        boolean success = quotationService.deleteQuotation(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "报价单删除成功" : "删除失败");
        return result;
    }

    // 转换DTO到实体类
    private SalesQuotation convertToEntity(SalesQuotationRequest request) {
        SalesQuotation quotation = new SalesQuotation();
        quotation.setCustomerName(request.getCustomerName());
        quotation.setCustomerContact(request.getCustomerContact());
        quotation.setSalesperson(request.getSalesperson());
        quotation.setIncludeTax(request.getIncludeTax() != null ? request.getIncludeTax() : false);
        quotation.setRemarks(request.getRemarks());
        
        // 设置有效期（默认7天后）
        quotation.setValidUntil(LocalDateTime.now().plusDays(7));
        
        return quotation;
    }

    // 转换明细DTO到实体类
    private List<SalesQuotationItem> convertToItemEntities(List<SalesQuotationItemRequest> itemRequests) {
        List<SalesQuotationItem> items = new ArrayList<>();
        if (itemRequests != null) {
            for (SalesQuotationItemRequest itemRequest : itemRequests) {
                SalesQuotationItem item = new SalesQuotationItem();
                item.setProductName(itemRequest.getProductName());
                item.setProductCode(itemRequest.getProductCode());
                item.setSpecification(itemRequest.getSpecification());
                item.setUnit(itemRequest.getUnit());
                item.setQuantity(itemRequest.getQuantity());
                item.setUnitPrice(itemRequest.getUnitPrice());
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