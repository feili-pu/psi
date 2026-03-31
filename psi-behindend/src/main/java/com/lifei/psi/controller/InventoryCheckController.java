package com.lifei.psi.controller;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.dto.InventoryCheckRequest;
import com.lifei.psi.entity.InventoryCheck;
import com.lifei.psi.entity.InventoryCheckItem;
import com.lifei.psi.service.InventoryCheckService;
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
@RequestMapping("/api/inventory-checks")
@Tag(name = "库存盘点管理", description = "库存盘点单的增删改查操作，支持全盘、部分盘点、循环盘点")
@RequirePermission("inventory:check:view")
public class InventoryCheckController {

    @Autowired
    private InventoryCheckService checkService;

    @GetMapping
    @Operation(summary = "获取所有盘点单", description = "获取系统中所有的盘点单列表")
    public ResponseEntity<List<InventoryCheck>> getAllChecks() {
        List<InventoryCheck> checks = checkService.getAllChecks();
        return ResponseEntity.ok(checks);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取盘点单", description = "根据盘点单ID获取详细信息")
    public ResponseEntity<InventoryCheck> getCheckById(
            @Parameter(description = "盘点单ID") @PathVariable Long id) {
        InventoryCheck check = checkService.getCheckById(id);
        if (check != null) {
            return ResponseEntity.ok(check);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "获取盘点明细", description = "根据盘点单ID获取明细列表")
    public ResponseEntity<List<InventoryCheckItem>> getCheckItems(
            @Parameter(description = "盘点单ID") @PathVariable Long id) {
        List<InventoryCheckItem> items = checkService.getCheckItems(id);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/search")
    @Operation(summary = "搜索盘点单", description = "根据仓库、盘点类型、盘点人、状态等条件搜索")
    public ResponseEntity<List<InventoryCheck>> searchChecks(
            @Parameter(description = "仓库ID") @RequestParam(required = false) Long warehouseId,
            @Parameter(description = "盘点类型") @RequestParam(required = false) String checkType,
            @Parameter(description = "盘点人") @RequestParam(required = false) String checker,
            @Parameter(description = "状态") @RequestParam(required = false) String status) {
        
        List<InventoryCheck> checks;
        if (warehouseId != null) {
            checks = checkService.getChecksByWarehouse(warehouseId);
        } else if (checkType != null) {
            checks = checkService.getChecksByType(checkType);
        } else if (checker != null) {
            checks = checkService.getChecksByChecker(checker);
        } else if (status != null) {
            checks = checkService.getChecksByStatus(status);
        } else {
            checks = checkService.getAllChecks();
        }
        
        return ResponseEntity.ok(checks);
    }

    @PostMapping
    @Operation(summary = "创建盘点单", description = "创建新的盘点单")
    @RequirePermission("inventory:check:create")
    public ResponseEntity<?> createCheck(
            @Valid @RequestBody InventoryCheckRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            InventoryCheck check = new InventoryCheck();
            BeanUtils.copyProperties(request, check);
            
            // 转换明细
            List<InventoryCheckItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    InventoryCheckItem item = new InventoryCheckItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            InventoryCheck created = checkService.createCheck(check, items);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建失败: " + e.getMessage());
        }
    }

    @PostMapping("/auto-generate")
    @Operation(summary = "自动生成盘点单", description = "基于当前库存自动生成盘点单")
    @RequirePermission("inventory:check:create")
    public ResponseEntity<?> createCheckWithCurrentInventory(
            @Valid @RequestBody InventoryCheckRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            InventoryCheck check = new InventoryCheck();
            BeanUtils.copyProperties(request, check);
            
            InventoryCheck created = checkService.createCheckWithCurrentInventory(check);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新盘点单", description = "更新现有的盘点单信息")
    @RequirePermission("inventory:check:update")
    public ResponseEntity<?> updateCheck(
            @Parameter(description = "盘点单ID") @PathVariable Long id,
            @Valid @RequestBody InventoryCheckRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            InventoryCheck check = new InventoryCheck();
            BeanUtils.copyProperties(request, check);
            check.setId(id);
            
            // 转换明细
            List<InventoryCheckItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    InventoryCheckItem item = new InventoryCheckItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            InventoryCheck updated = checkService.updateCheck(check, items);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "完成盘点", description = "完成盘点操作")
    public ResponseEntity<String> completeCheck(
            @Parameter(description = "盘点单ID") @PathVariable Long id) {
        boolean success = checkService.completeCheck(id);
        if (success) {
            return ResponseEntity.ok("盘点完成");
        }
        return ResponseEntity.badRequest().body("盘点完成失败");
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "审核盘点单", description = "审核通过盘点单")
    public ResponseEntity<String> approveCheck(
            @Parameter(description = "盘点单ID") @PathVariable Long id) {
        boolean success = checkService.approveCheck(id);
        if (success) {
            return ResponseEntity.ok("审核成功");
        }
        return ResponseEntity.badRequest().body("审核失败");
    }

    @PostMapping("/{id}/process")
    @Operation(summary = "处理盘点差异", description = "处理盘点差异，自动生成盘盈盘亏入库单并更新库存")
    public ResponseEntity<String> processCheck(
            @Parameter(description = "盘点单ID") @PathVariable Long id) {
        try {
            boolean success = checkService.processCheck(id);
            if (success) {
                return ResponseEntity.ok("盘点差异处理成功");
            }
            return ResponseEntity.badRequest().body("盘点差异处理失败");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("盘点差异处理失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除盘点单", description = "删除指定的盘点单")
    @RequirePermission("inventory:check:delete")
    public ResponseEntity<String> deleteCheck(
            @Parameter(description = "盘点单ID") @PathVariable Long id) {
        boolean success = checkService.deleteCheck(id);
        if (success) {
            return ResponseEntity.ok("删除成功");
        }
        return ResponseEntity.badRequest().body("删除失败");
    }
}