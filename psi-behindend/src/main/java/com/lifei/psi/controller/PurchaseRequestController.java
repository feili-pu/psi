package com.lifei.psi.controller;

import com.lifei.psi.dto.PurchaseRequestRequest;
import com.lifei.psi.dto.PurchaseRequestItemRequest;
import com.lifei.psi.entity.PurchaseRequest;
import com.lifei.psi.entity.PurchaseRequestItem;
import com.lifei.psi.service.PurchaseRequestService;
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
@RequestMapping("/api/purchase/requests")
@Tag(name = "采购申请管理", description = "采购申请相关的API接口")
public class PurchaseRequestController {

    @Autowired
    private PurchaseRequestService requestService;

    // 获取所有采购申请
    @GetMapping
    @Operation(summary = "获取所有采购申请", description = "获取系统中所有的采购申请列表")
    @ApiResponse(responseCode = "200", description = "成功获取采购申请列表")
    public List<PurchaseRequest> getAllRequests() {
        return requestService.getAllRequests();
    }

    // 根据ID获取采购申请
    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取采购申请", description = "根据采购申请ID获取详细信息，包括申请明细")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "成功获取采购申请信息"),
        @ApiResponse(responseCode = "404", description = "采购申请不存在")
    })
    public Map<String, Object> getRequestById(
            @Parameter(description = "采购申请ID", required = true, example = "1")
            @PathVariable Long id) {
        PurchaseRequest request = requestService.getRequestById(id);
        List<PurchaseRequestItem> items = requestService.getRequestItems(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("request", request);
        result.put("items", items);
        return result;
    }

    // 获取申请明细
    @GetMapping("/{id}/items")
    @Operation(summary = "获取采购申请明细", description = "根据采购申请ID获取其所有明细项")
    public List<PurchaseRequestItem> getRequestItems(
            @Parameter(description = "采购申请ID", required = true, example = "1")
            @PathVariable Long id) {
        return requestService.getRequestItems(id);
    }

    // 根据部门搜索
    @GetMapping("/search")
    @Operation(summary = "根据部门搜索采购申请", description = "根据申请部门名称模糊搜索采购申请")
    public List<PurchaseRequest> searchRequests(
            @Parameter(description = "部门名称", required = true, example = "技术部")
            @RequestParam String department) {
        return requestService.searchByDepartment(department);
    }

    // 根据申请人查询
    @GetMapping("/applicant/{applicant}")
    @Operation(summary = "根据申请人查询", description = "根据申请人姓名查询其提交的所有采购申请")
    public List<PurchaseRequest> getRequestsByApplicant(
            @Parameter(description = "申请人姓名", required = true, example = "张三")
            @PathVariable String applicant) {
        return requestService.getRequestsByApplicant(applicant);
    }

    // 根据状态查询
    @GetMapping("/status/{status}")
    @Operation(summary = "根据状态查询采购申请", description = "根据申请状态查询采购申请列表")
    public List<PurchaseRequest> getRequestsByStatus(
            @Parameter(description = "申请状态", required = true, example = "PENDING", 
                      schema = @Schema(allowableValues = {"PENDING", "APPROVED", "REJECTED", "CANCELLED"}))
            @PathVariable String status) {
        return requestService.getRequestsByStatus(status);
    }

    // 创建采购申请
    @PostMapping
    @Operation(summary = "创建采购申请", description = "创建新的采购申请，包括申请信息和明细项")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "成功创建采购申请"),
        @ApiResponse(responseCode = "400", description = "请求参数验证失败", 
                    content = @Content(schema = @Schema(example = "{\"success\": false, \"message\": \"数据验证失败\", \"errors\": [\"申请部门不能为空\"]}"))),
        @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    public Map<String, Object> createRequest(
            @Parameter(description = "采购申请信息", required = true)
            @Valid @RequestBody PurchaseRequestRequest request, 
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
            System.out.println("接收到的采购申请数据:");
            System.out.println("申请部门: " + request.getDepartment());
            System.out.println("申请人: " + request.getApplicant());
            System.out.println("明细数量: " + (request.getItems() != null ? request.getItems().size() : 0));
            
            PurchaseRequest purchaseRequest = convertToEntity(request);
            List<PurchaseRequestItem> items = convertToItemEntities(request.getItems());
            
            PurchaseRequest created = requestService.createRequest(purchaseRequest, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "采购申请创建成功");
            result.put("request", created);
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

    // 更新采购申请
    @PutMapping("/{id}")
    public Map<String, Object> updateRequest(@PathVariable Long id, 
                                           @Valid @RequestBody PurchaseRequestRequest request,
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
            PurchaseRequest purchaseRequest = convertToEntity(request);
            purchaseRequest.setId(id);
            List<PurchaseRequestItem> items = convertToItemEntities(request.getItems());
            
            PurchaseRequest updated = requestService.updateRequest(purchaseRequest, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "采购申请更新成功");
            result.put("request", updated);
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "更新失败: " + e.getMessage());
            return result;
        }
    }

    // 审批通过
    @PostMapping("/{id}/approve")
    public Map<String, Object> approveRequest(@PathVariable Long id) {
        boolean success = requestService.approveRequest(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "申请已审批通过" : "审批失败");
        return result;
    }

    // 审批拒绝
    @PostMapping("/{id}/reject")
    public Map<String, Object> rejectRequest(@PathVariable Long id) {
        boolean success = requestService.rejectRequest(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "申请已拒绝" : "操作失败");
        return result;
    }

    // 取消申请
    @PostMapping("/{id}/cancel")
    public Map<String, Object> cancelRequest(@PathVariable Long id) {
        boolean success = requestService.cancelRequest(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "申请已取消" : "取消失败");
        return result;
    }

    // 删除采购申请
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteRequest(@PathVariable Long id) {
        boolean success = requestService.deleteRequest(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "采购申请删除成功" : "删除失败");
        return result;
    }

    // 转换DTO到实体类
    private PurchaseRequest convertToEntity(PurchaseRequestRequest request) {
        PurchaseRequest purchaseRequest = new PurchaseRequest();
        purchaseRequest.setDepartment(request.getDepartment());
        purchaseRequest.setApplicant(request.getApplicant());
        purchaseRequest.setRemarks(request.getRemarks());
        
        // 处理需求日期
        if (request.getRequiredDate() != null && !request.getRequiredDate().isEmpty()) {
            try {
                purchaseRequest.setRequiredDate(LocalDate.parse(request.getRequiredDate()));
            } catch (Exception e) {
                // 如果解析失败，设置默认值（7天后）
                purchaseRequest.setRequiredDate(LocalDate.now().plusDays(7));
            }
        } else {
            // 默认7天后需求
            purchaseRequest.setRequiredDate(LocalDate.now().plusDays(7));
        }
        
        return purchaseRequest;
    }

    // 转换明细DTO到实体类
    private List<PurchaseRequestItem> convertToItemEntities(List<PurchaseRequestItemRequest> itemRequests) {
        List<PurchaseRequestItem> items = new ArrayList<>();
        if (itemRequests != null) {
            for (PurchaseRequestItemRequest itemRequest : itemRequests) {
                PurchaseRequestItem item = new PurchaseRequestItem();
                item.setProductName(itemRequest.getProductName());
                item.setProductCode(itemRequest.getProductCode());
                item.setSpecification(itemRequest.getSpecification());
                item.setUnit(itemRequest.getUnit());
                item.setQuantity(itemRequest.getQuantity());
                item.setEstimatedPrice(itemRequest.getEstimatedPrice());
                item.setPurpose(itemRequest.getPurpose());
                item.setRemarks(itemRequest.getRemarks());
                
                // 计算金额
                if (itemRequest.getQuantity() != null && itemRequest.getEstimatedPrice() != null) {
                    item.setAmount(itemRequest.getQuantity().multiply(itemRequest.getEstimatedPrice()));
                }
                
                items.add(item);
            }
        }
        return items;
    }
}