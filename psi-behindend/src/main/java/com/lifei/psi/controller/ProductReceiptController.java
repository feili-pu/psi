package com.lifei.psi.controller;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.dto.ProductReceiptRequest;
import com.lifei.psi.entity.ProductReceipt;
import com.lifei.psi.entity.ProductReceiptItem;
import com.lifei.psi.service.ProductReceiptService;
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
@RequestMapping("/api/product-receipts")
@Tag(name = "产品入库管理", description = "产品入库单的增删改查操作")
@RequirePermission("product:receipt:view")
public class ProductReceiptController {

    @Autowired
    private ProductReceiptService receiptService;

    @GetMapping
    @Operation(summary = "获取所有产品入库单", description = "获取系统中所有的产品入库单列表")
    public ResponseEntity<List<ProductReceipt>> getAllReceipts() {
        List<ProductReceipt> receipts = receiptService.getAllReceipts();
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取产品入库单", description = "根据入库单ID获取详细信息")
    public ResponseEntity<ProductReceipt> getReceiptById(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        ProductReceipt receipt = receiptService.getReceiptById(id);
        if (receipt != null) {
            return ResponseEntity.ok(receipt);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "获取入库明细", description = "根据入库单ID获取明细列表")
    public ResponseEntity<List<ProductReceiptItem>> getReceiptItems(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        List<ProductReceiptItem> items = receiptService.getReceiptItems(id);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/search")
    @Operation(summary = "搜索产品入库单", description = "根据入库类型、操作员、状态等条件搜索")
    public ResponseEntity<List<ProductReceipt>> searchReceipts(
            @Parameter(description = "入库类型") @RequestParam(required = false) String receiptType,
            @Parameter(description = "操作员") @RequestParam(required = false) String operator,
            @Parameter(description = "状态") @RequestParam(required = false) String status,
            @Parameter(description = "仓库ID") @RequestParam(required = false) Long warehouseId) {
        
        List<ProductReceipt> receipts;
        if (receiptType != null) {
            receipts = receiptService.getReceiptsByType(receiptType);
        } else if (operator != null) {
            receipts = receiptService.getReceiptsByOperator(operator);
        } else if (status != null) {
            receipts = receiptService.getReceiptsByStatus(status);
        } else if (warehouseId != null) {
            receipts = receiptService.getReceiptsByWarehouse(warehouseId);
        } else {
            receipts = receiptService.getAllReceipts();
        }
        
        return ResponseEntity.ok(receipts);
    }

    @PostMapping
    @Operation(summary = "创建产品入库单", description = "创建新的产品入库单")
    @RequirePermission("product:receipt:create")
    public ResponseEntity<?> createReceipt(
            @Valid @RequestBody ProductReceiptRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            ProductReceipt receipt = new ProductReceipt();
            BeanUtils.copyProperties(request, receipt);
            
            // 转换明细
            List<ProductReceiptItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    ProductReceiptItem item = new ProductReceiptItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            ProductReceipt created = receiptService.createReceipt(receipt, items);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新产品入库单", description = "更新现有的产品入库单信息")
    @RequirePermission("product:receipt:update")
    public ResponseEntity<?> updateReceipt(
            @Parameter(description = "入库单ID") @PathVariable Long id,
            @Valid @RequestBody ProductReceiptRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            ProductReceipt receipt = new ProductReceipt();
            BeanUtils.copyProperties(request, receipt);
            receipt.setId(id);
            
            // 转换明细
            List<ProductReceiptItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    ProductReceiptItem item = new ProductReceiptItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            ProductReceipt updated = receiptService.updateReceipt(receipt, items);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "审核入库单", description = "审核通过入库单")
    public ResponseEntity<String> approveReceipt(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        boolean success = receiptService.approveReceipt(id);
        if (success) {
            return ResponseEntity.ok("审核成功");
        }
        return ResponseEntity.badRequest().body("审核失败");
    }

    @PostMapping("/{id}/process")
    @Operation(summary = "入库处理", description = "执行入库处理操作")
    public ResponseEntity<String> processReceipt(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        try {
            boolean success = receiptService.processReceipt(id);
            if (success) {
                return ResponseEntity.ok("入库处理成功");
            }
            return ResponseEntity.badRequest().body("入库处理失败");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("入库处理失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "取消入库单", description = "取消入库单")
    public ResponseEntity<String> cancelReceipt(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        boolean success = receiptService.cancelReceipt(id);
        if (success) {
            return ResponseEntity.ok("取消成功");
        }
        return ResponseEntity.badRequest().body("取消失败");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除产品入库单", description = "删除指定的产品入库单")
    @RequirePermission("product:receipt:delete")
    public ResponseEntity<String> deleteReceipt(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        boolean success = receiptService.deleteReceipt(id);
        if (success) {
            return ResponseEntity.ok("删除成功");
        }
        return ResponseEntity.badRequest().body("删除失败");
    }
}