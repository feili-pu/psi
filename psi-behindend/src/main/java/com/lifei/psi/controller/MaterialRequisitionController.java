package com.lifei.psi.controller;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.dto.MaterialRequisitionRequest;
import com.lifei.psi.entity.MaterialRequisition;
import com.lifei.psi.entity.MaterialRequisitionItem;
import com.lifei.psi.service.MaterialRequisitionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/material-requisitions")
@Tag(name = "生产领料管理", description = "生产领料单的增删改查操作")
@RequirePermission("material:requisition:view")
public class MaterialRequisitionController {

    @Autowired
    private MaterialRequisitionService requisitionService;

    @GetMapping
    @Operation(summary = "获取所有生产领料单", description = "获取系统中所有的生产领料单列表")
    public ResponseEntity<List<MaterialRequisition>> getAllRequisitions() {
        List<MaterialRequisition> requisitions = requisitionService.getAllRequisitions();
        return ResponseEntity.ok(requisitions);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取生产领料单", description = "根据领料单ID获取详细信息")
    public ResponseEntity<MaterialRequisition> getRequisitionById(
            @Parameter(description = "领料单ID") @PathVariable Long id) {
        MaterialRequisition requisition = requisitionService.getRequisitionById(id);
        if (requisition != null) {
            return ResponseEntity.ok(requisition);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "获取领料明细", description = "根据领料单ID获取明细列表")
    public ResponseEntity<List<MaterialRequisitionItem>> getRequisitionItems(
            @Parameter(description = "领料单ID") @PathVariable Long id) {
        List<MaterialRequisitionItem> items = requisitionService.getRequisitionItems(id);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/search")
    @Operation(summary = "搜索生产领料单", description = "根据部门、申请人、状态等条件搜索")
    public ResponseEntity<List<MaterialRequisition>> searchRequisitions(
            @Parameter(description = "部门") @RequestParam(required = false) String department,
            @Parameter(description = "申请人") @RequestParam(required = false) String applicant,
            @Parameter(description = "状态") @RequestParam(required = false) String status,
            @Parameter(description = "BOM ID") @RequestParam(required = false) Long bomId) {
        
        List<MaterialRequisition> requisitions;
        if (department != null) {
            requisitions = requisitionService.searchByDepartment(department);
        } else if (applicant != null) {
            requisitions = requisitionService.getRequisitionsByApplicant(applicant);
        } else if (status != null) {
            requisitions = requisitionService.getRequisitionsByStatus(status);
        } else if (bomId != null) {
            requisitions = requisitionService.getRequisitionsByBomId(bomId);
        } else {
            requisitions = requisitionService.getAllRequisitions();
        }
        
        return ResponseEntity.ok(requisitions);
    }

    @PostMapping
    @Operation(summary = "创建生产领料单", description = "创建新的生产领料单")
    @RequirePermission("material:requisition:create")
    public ResponseEntity<?> createRequisition(
            @Valid @RequestBody MaterialRequisitionRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            MaterialRequisition requisition = new MaterialRequisition();
            BeanUtils.copyProperties(request, requisition);
            
            // 转换明细
            List<MaterialRequisitionItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    MaterialRequisitionItem item = new MaterialRequisitionItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            MaterialRequisition created = requisitionService.createRequisition(requisition, items);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建失败: " + e.getMessage());
        }
    }

    @PostMapping("/from-bom")
    @Operation(summary = "根据BOM创建领料单", description = "根据BOM自动生成领料单")
    @RequirePermission("material:requisition:create")
    public ResponseEntity<?> createRequisitionFromBOM(
            @Parameter(description = "BOM ID") @RequestParam Long bomId,
            @Valid @RequestBody MaterialRequisitionRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            MaterialRequisition requisition = new MaterialRequisition();
            BeanUtils.copyProperties(request, requisition);
            
            MaterialRequisition created = requisitionService.createRequisitionFromBOM(bomId, requisition);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新生产领料单", description = "更新现有的生产领料单信息")
    @RequirePermission("material:requisition:update")
    public ResponseEntity<?> updateRequisition(
            @Parameter(description = "领料单ID") @PathVariable Long id,
            @Valid @RequestBody MaterialRequisitionRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            MaterialRequisition requisition = new MaterialRequisition();
            BeanUtils.copyProperties(request, requisition);
            requisition.setId(id);
            
            // 转换明细
            List<MaterialRequisitionItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    MaterialRequisitionItem item = new MaterialRequisitionItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            MaterialRequisition updated = requisitionService.updateRequisition(requisition, items);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "审核领料单", description = "审核通过领料单")
    public ResponseEntity<String> approveRequisition(
            @Parameter(description = "领料单ID") @PathVariable Long id) {
        boolean success = requisitionService.approveRequisition(id);
        if (success) {
            return ResponseEntity.ok("审核成功");
        }
        return ResponseEntity.badRequest().body("审核失败");
    }

    @PostMapping("/{id}/issue")
    @Operation(summary = "发料", description = "执行发料操作")
    public ResponseEntity<String> issueRequisition(
            @Parameter(description = "领料单ID") @PathVariable Long id) {
        try {
            boolean success = requisitionService.issueRequisition(id);
            if (success) {
                return ResponseEntity.ok("发料成功");
            }
            return ResponseEntity.badRequest().body("发料失败");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("发料失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "取消领料单", description = "取消领料单")
    public ResponseEntity<String> cancelRequisition(
            @Parameter(description = "领料单ID") @PathVariable Long id) {
        boolean success = requisitionService.cancelRequisition(id);
        if (success) {
            return ResponseEntity.ok("取消成功");
        }
        return ResponseEntity.badRequest().body("取消失败");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除生产领料单", description = "删除指定的生产领料单")
    @RequirePermission("material:requisition:delete")
    public ResponseEntity<String> deleteRequisition(
            @Parameter(description = "领料单ID") @PathVariable Long id) {
        boolean success = requisitionService.deleteRequisition(id);
        if (success) {
            return ResponseEntity.ok("删除成功");
        }
        return ResponseEntity.badRequest().body("删除失败");
    }
}