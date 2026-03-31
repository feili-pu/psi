package com.lifei.psi.controller;

import com.lifei.psi.dto.ProductAssemblyRequest;
import com.lifei.psi.entity.ProductAssembly;
import com.lifei.psi.service.ProductAssemblyService;
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
@RequestMapping("/api/product-assemblies")
@Tag(name = "产品组装管理", description = "产品组装单的增删改查操作")
public class ProductAssemblyController {

    @Autowired
    private ProductAssemblyService assemblyService;

    @GetMapping
    @Operation(summary = "获取所有产品组装单", description = "获取系统中所有的产品组装单列表")
    public ResponseEntity<List<ProductAssembly>> getAllAssemblies() {
        List<ProductAssembly> assemblies = assemblyService.getAllAssemblies();
        return ResponseEntity.ok(assemblies);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取产品组装单", description = "根据组装单ID获取详细信息")
    public ResponseEntity<ProductAssembly> getAssemblyById(
            @Parameter(description = "组装单ID") @PathVariable Long id) {
        ProductAssembly assembly = assemblyService.getAssemblyById(id);
        if (assembly != null) {
            return ResponseEntity.ok(assembly);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    @Operation(summary = "搜索产品组装单", description = "根据BOM ID、操作员、状态等条件搜索")
    public ResponseEntity<List<ProductAssembly>> searchAssemblies(
            @Parameter(description = "BOM ID") @RequestParam(required = false) Long bomId,
            @Parameter(description = "操作员") @RequestParam(required = false) String operator,
            @Parameter(description = "状态") @RequestParam(required = false) String status,
            @Parameter(description = "仓库ID") @RequestParam(required = false) Long warehouseId) {
        
        List<ProductAssembly> assemblies;
        if (bomId != null) {
            assemblies = assemblyService.getAssembliesByBomId(bomId);
        } else if (operator != null) {
            assemblies = assemblyService.getAssembliesByOperator(operator);
        } else if (status != null) {
            assemblies = assemblyService.getAssembliesByStatus(status);
        } else if (warehouseId != null) {
            assemblies = assemblyService.getAssembliesByWarehouse(warehouseId);
        } else {
            assemblies = assemblyService.getAllAssemblies();
        }
        
        return ResponseEntity.ok(assemblies);
    }

    @PostMapping
    @Operation(summary = "创建产品组装单", description = "创建新的产品组装单")
    public ResponseEntity<?> createAssembly(
            @Valid @RequestBody ProductAssemblyRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            ProductAssembly assembly = new ProductAssembly();
            BeanUtils.copyProperties(request, assembly);
            
            ProductAssembly created = assemblyService.createAssembly(assembly);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新产品组装单", description = "更新现有的产品组装单信息")
    public ResponseEntity<?> updateAssembly(
            @Parameter(description = "组装单ID") @PathVariable Long id,
            @Valid @RequestBody ProductAssemblyRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            ProductAssembly assembly = new ProductAssembly();
            BeanUtils.copyProperties(request, assembly);
            assembly.setId(id);
            
            ProductAssembly updated = assemblyService.updateAssembly(assembly);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "审核组装单", description = "审核通过组装单")
    public ResponseEntity<String> approveAssembly(
            @Parameter(description = "组装单ID") @PathVariable Long id) {
        boolean success = assemblyService.approveAssembly(id);
        if (success) {
            return ResponseEntity.ok("审核成功");
        }
        return ResponseEntity.badRequest().body("审核失败");
    }

    @PostMapping("/{id}/process")
    @Operation(summary = "执行组装", description = "执行产品组装操作")
    public ResponseEntity<String> processAssembly(
            @Parameter(description = "组装单ID") @PathVariable Long id) {
        try {
            boolean success = assemblyService.processAssembly(id);
            if (success) {
                return ResponseEntity.ok("组装成功");
            }
            return ResponseEntity.badRequest().body("组装失败");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("组装失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "取消组装单", description = "取消组装单")
    public ResponseEntity<String> cancelAssembly(
            @Parameter(description = "组装单ID") @PathVariable Long id) {
        boolean success = assemblyService.cancelAssembly(id);
        if (success) {
            return ResponseEntity.ok("取消成功");
        }
        return ResponseEntity.badRequest().body("取消失败");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除产品组装单", description = "删除指定的产品组装单")
    public ResponseEntity<String> deleteAssembly(
            @Parameter(description = "组装单ID") @PathVariable Long id) {
        boolean success = assemblyService.deleteAssembly(id);
        if (success) {
            return ResponseEntity.ok("删除成功");
        }
        return ResponseEntity.badRequest().body("删除失败");
    }
}