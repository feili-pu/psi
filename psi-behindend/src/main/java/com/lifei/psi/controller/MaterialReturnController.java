package com.lifei.psi.controller;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.dto.MaterialReturnRequest;
import com.lifei.psi.entity.MaterialReturn;
import com.lifei.psi.entity.MaterialReturnItem;
import com.lifei.psi.service.MaterialReturnService;
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
@RequestMapping("/api/material-returns")
@Tag(name = "生产退料管理", description = "生产退料单的增删改查操作")
@RequirePermission("material:return:view")
public class MaterialReturnController {

    @Autowired
    private MaterialReturnService returnService;

    @GetMapping
    @Operation(summary = "获取所有生产退料单", description = "获取系统中所有的生产退料单列表")
    public ResponseEntity<List<MaterialReturn>> getAllReturns() {
        List<MaterialReturn> returns = returnService.getAllReturns();
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取生产退料单", description = "根据退料单ID获取详细信息")
    public ResponseEntity<MaterialReturn> getReturnById(
            @Parameter(description = "退料单ID") @PathVariable Long id) {
        MaterialReturn materialReturn = returnService.getReturnById(id);
        if (materialReturn != null) {
            return ResponseEntity.ok(materialReturn);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "获取退料明细", description = "根据退料单ID获取明细列表")
    public ResponseEntity<List<MaterialReturnItem>> getReturnItems(
            @Parameter(description = "退料单ID") @PathVariable Long id) {
        List<MaterialReturnItem> items = returnService.getReturnItems(id);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/search")
    @Operation(summary = "搜索生产退料单", description = "根据部门、退料人、状态等条件搜索")
    public ResponseEntity<List<MaterialReturn>> searchReturns(
            @Parameter(description = "部门") @RequestParam(required = false) String department,
            @Parameter(description = "退料人") @RequestParam(required = false) String returner,
            @Parameter(description = "状态") @RequestParam(required = false) String status,
            @Parameter(description = "领料单ID") @RequestParam(required = false) Long requisitionId) {
        
        List<MaterialReturn> returns;
        if (department != null) {
            returns = returnService.searchByDepartment(department);
        } else if (returner != null) {
            returns = returnService.getReturnsByReturner(returner);
        } else if (status != null) {
            returns = returnService.getReturnsByStatus(status);
        } else if (requisitionId != null) {
            returns = returnService.getReturnsByRequisitionId(requisitionId);
        } else {
            returns = returnService.getAllReturns();
        }
        
        return ResponseEntity.ok(returns);
    }

    @PostMapping
    @Operation(summary = "创建生产退料单", description = "创建新的生产退料单")
    @RequirePermission("material:return:create")
    public ResponseEntity<?> createReturn(
            @Valid @RequestBody MaterialReturnRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            MaterialReturn materialReturn = new MaterialReturn();
            BeanUtils.copyProperties(request, materialReturn);
            
            // 转换明细
            List<MaterialReturnItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    MaterialReturnItem item = new MaterialReturnItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            MaterialReturn created = returnService.createReturn(materialReturn, items);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新生产退料单", description = "更新现有的生产退料单信息")
    @RequirePermission("material:return:update")
    public ResponseEntity<?> updateReturn(
            @Parameter(description = "退料单ID") @PathVariable Long id,
            @Valid @RequestBody MaterialReturnRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            MaterialReturn materialReturn = new MaterialReturn();
            BeanUtils.copyProperties(request, materialReturn);
            materialReturn.setId(id);
            
            // 转换明细
            List<MaterialReturnItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    MaterialReturnItem item = new MaterialReturnItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            MaterialReturn updated = returnService.updateReturn(materialReturn, items);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "审核退料单", description = "审核通过退料单")
    public ResponseEntity<String> approveReturn(
            @Parameter(description = "退料单ID") @PathVariable Long id) {
        boolean success = returnService.approveReturn(id);
        if (success) {
            return ResponseEntity.ok("审核成功");
        }
        return ResponseEntity.badRequest().body("审核失败");
    }

    @PostMapping("/{id}/process")
    @Operation(summary = "退料入库", description = "执行退料入库操作")
    public ResponseEntity<String> processReturn(
            @Parameter(description = "退料单ID") @PathVariable Long id) {
        try {
            boolean success = returnService.processReturn(id);
            if (success) {
                return ResponseEntity.ok("退料入库成功");
            }
            return ResponseEntity.badRequest().body("退料入库失败");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("退料入库失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "取消退料单", description = "取消退料单")
    public ResponseEntity<String> cancelReturn(
            @Parameter(description = "退料单ID") @PathVariable Long id) {
        boolean success = returnService.cancelReturn(id);
        if (success) {
            return ResponseEntity.ok("取消成功");
        }
        return ResponseEntity.badRequest().body("取消失败");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除生产退料单", description = "删除指定的生产退料单")
    @RequirePermission("material:return:delete")
    public ResponseEntity<String> deleteReturn(
            @Parameter(description = "退料单ID") @PathVariable Long id) {
        boolean success = returnService.deleteReturn(id);
        if (success) {
            return ResponseEntity.ok("删除成功");
        }
        return ResponseEntity.badRequest().body("删除失败");
    }
}