package com.lifei.psi.controller;

import com.lifei.psi.dto.ProductDisassemblyRequest;
import com.lifei.psi.entity.ProductDisassembly;
import com.lifei.psi.service.ProductDisassemblyService;
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
@RequestMapping("/api/product-disassemblies")
@Tag(name = "产品拆卸管理", description = "产品拆卸单的增删改查操作")
public class ProductDisassemblyController {

    @Autowired
    private ProductDisassemblyService disassemblyService;

    @GetMapping
    @Operation(summary = "获取所有产品拆卸单", description = "获取系统中所有的产品拆卸单列表")
    public ResponseEntity<List<ProductDisassembly>> getAllDisassemblies() {
        List<ProductDisassembly> disassemblies = disassemblyService.getAllDisassemblies();
        return ResponseEntity.ok(disassemblies);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取产品拆卸单", description = "根据拆卸单ID获取详细信息")
    public ResponseEntity<ProductDisassembly> getDisassemblyById(
            @Parameter(description = "拆卸单ID") @PathVariable Long id) {
        ProductDisassembly disassembly = disassemblyService.getDisassemblyById(id);
        if (disassembly != null) {
            return ResponseEntity.ok(disassembly);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    @Operation(summary = "搜索产品拆卸单", description = "根据BOM ID、操作员、状态等条件搜索")
    public ResponseEntity<List<ProductDisassembly>> searchDisassemblies(
            @Parameter(description = "BOM ID") @RequestParam(required = false) Long bomId,
            @Parameter(description = "操作员") @RequestParam(required = false) String operator,
            @Parameter(description = "状态") @RequestParam(required = false) String status,
            @Parameter(description = "仓库ID") @RequestParam(required = false) Long warehouseId) {
        
        List<ProductDisassembly> disassemblies;
        if (bomId != null) {
            disassemblies = disassemblyService.getDisassembliesByBomId(bomId);
        } else if (operator != null) {
            disassemblies = disassemblyService.getDisassembliesByOperator(operator);
        } else if (status != null) {
            disassemblies = disassemblyService.getDisassembliesByStatus(status);
        } else if (warehouseId != null) {
            disassemblies = disassemblyService.getDisassembliesByWarehouse(warehouseId);
        } else {
            disassemblies = disassemblyService.getAllDisassemblies();
        }
        
        return ResponseEntity.ok(disassemblies);
    }

    @PostMapping
    @Operation(summary = "创建产品拆卸单", description = "创建新的产品拆卸单")
    public ResponseEntity<?> createDisassembly(
            @Valid @RequestBody ProductDisassemblyRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            ProductDisassembly disassembly = new ProductDisassembly();
            BeanUtils.copyProperties(request, disassembly);
            
            ProductDisassembly created = disassemblyService.createDisassembly(disassembly);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新产品拆卸单", description = "更新现有的产品拆卸单信息")
    public ResponseEntity<?> updateDisassembly(
            @Parameter(description = "拆卸单ID") @PathVariable Long id,
            @Valid @RequestBody ProductDisassemblyRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            ProductDisassembly disassembly = new ProductDisassembly();
            BeanUtils.copyProperties(request, disassembly);
            disassembly.setId(id);
            
            ProductDisassembly updated = disassemblyService.updateDisassembly(disassembly);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "审核拆卸单", description = "审核通过拆卸单")
    public ResponseEntity<String> approveDisassembly(
            @Parameter(description = "拆卸单ID") @PathVariable Long id) {
        boolean success = disassemblyService.approveDisassembly(id);
        if (success) {
            return ResponseEntity.ok("审核成功");
        }
        return ResponseEntity.badRequest().body("审核失败");
    }

    @PostMapping("/{id}/process")
    @Operation(summary = "执行拆卸", description = "执行产品拆卸操作")
    public ResponseEntity<String> processDisassembly(
            @Parameter(description = "拆卸单ID") @PathVariable Long id) {
        try {
            boolean success = disassemblyService.processDisassembly(id);
            if (success) {
                return ResponseEntity.ok("拆卸成功");
            }
            return ResponseEntity.badRequest().body("拆卸失败");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("拆卸失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "取消拆卸单", description = "取消拆卸单")
    public ResponseEntity<String> cancelDisassembly(
            @Parameter(description = "拆卸单ID") @PathVariable Long id) {
        boolean success = disassemblyService.cancelDisassembly(id);
        if (success) {
            return ResponseEntity.ok("取消成功");
        }
        return ResponseEntity.badRequest().body("取消失败");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除产品拆卸单", description = "删除指定的产品拆卸单")
    public ResponseEntity<String> deleteDisassembly(
            @Parameter(description = "拆卸单ID") @PathVariable Long id) {
        boolean success = disassemblyService.deleteDisassembly(id);
        if (success) {
            return ResponseEntity.ok("删除成功");
        }
        return ResponseEntity.badRequest().body("删除失败");
    }
}