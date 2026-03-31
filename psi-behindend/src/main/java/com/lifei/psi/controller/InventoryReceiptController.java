package com.lifei.psi.controller;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.dto.InventoryReceiptRequest;
import com.lifei.psi.entity.InventoryReceipt;
import com.lifei.psi.entity.InventoryReceiptItem;
import com.lifei.psi.service.InventoryReceiptService;
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
@RequestMapping("/api/inventory-receipts")
@Tag(name = "库存入库管理", description = "库存入库单的增删改查操作，包括采购入库、采购退货出库、盘盈入库、涨吨入库、其他入库")
@RequirePermission("inventory:receipt:read")
public class InventoryReceiptController {

    @Autowired
    private InventoryReceiptService receiptService;

    @GetMapping
    @Operation(summary = "获取所有库存入库单", description = "获取系统中所有的库存入库单列表")
    public ResponseEntity<List<InventoryReceipt>> getAllReceipts() {
        List<InventoryReceipt> receipts = receiptService.getAllReceipts();
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取库存入库单", description = "根据入库单ID获取详细信息")
    public ResponseEntity<InventoryReceipt> getReceiptById(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        InventoryReceipt receipt = receiptService.getReceiptById(id);
        if (receipt != null) {
            return ResponseEntity.ok(receipt);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "获取入库明细", description = "根据入库单ID获取明细列表")
    public ResponseEntity<List<InventoryReceiptItem>> getReceiptItems(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        List<InventoryReceiptItem> items = receiptService.getReceiptItems(id);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/search")
    @Operation(summary = "搜索库存入库单", description = "根据入库类型、操作员、状态等条件搜索")
    public ResponseEntity<List<InventoryReceipt>> searchReceipts(
            @Parameter(description = "入库类型") @RequestParam(required = false) String receiptType,
            @Parameter(description = "操作员") @RequestParam(required = false) String operator,
            @Parameter(description = "状态") @RequestParam(required = false) String status,
            @Parameter(description = "仓库ID") @RequestParam(required = false) Long warehouseId,
            @Parameter(description = "供应商ID") @RequestParam(required = false) Long supplierId) {
        
        List<InventoryReceipt> receipts;
        if (receiptType != null) {
            receipts = receiptService.getReceiptsByType(receiptType);
        } else if (operator != null) {
            receipts = receiptService.getReceiptsByOperator(operator);
        } else if (status != null) {
            receipts = receiptService.getReceiptsByStatus(status);
        } else if (warehouseId != null) {
            receipts = receiptService.getReceiptsByWarehouse(warehouseId);
        } else if (supplierId != null) {
            receipts = receiptService.getReceiptsBySupplier(supplierId);
        } else {
            receipts = receiptService.getAllReceipts();
        }
        
        return ResponseEntity.ok(receipts);
    }

    @PostMapping
    @Operation(summary = "创建库存入库单", description = "创建新的库存入库单")
    @RequirePermission("inventory:receipt:create")
    public ResponseEntity<?> createReceipt(
            @Valid @RequestBody InventoryReceiptRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            InventoryReceipt receipt = new InventoryReceipt();
            BeanUtils.copyProperties(request, receipt);
            
            // 转换明细
            List<InventoryReceiptItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    InventoryReceiptItem item = new InventoryReceiptItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            InventoryReceipt created = receiptService.createReceipt(receipt, items);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新库存入库单", description = "更新现有的库存入库单信息")
    @RequirePermission("inventory:receipt:update")
    public ResponseEntity<?> updateReceipt(
            @Parameter(description = "入库单ID") @PathVariable Long id,
            @Valid @RequestBody InventoryReceiptRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            InventoryReceipt receipt = new InventoryReceipt();
            BeanUtils.copyProperties(request, receipt);
            receipt.setId(id);
            
            // 转换明细
            List<InventoryReceiptItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    InventoryReceiptItem item = new InventoryReceiptItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            InventoryReceipt updated = receiptService.updateReceipt(receipt, items);
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
    @Operation(summary = "入库处理", description = "执行入库处理操作，自动更新库存并生成应付款")
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

    @PostMapping("/{id}/generate-payable")
    @Operation(summary = "生成应付款", description = "手动生成采购应付款")
    public ResponseEntity<String> generatePayable(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        try {
            InventoryReceipt receipt = receiptService.getReceiptById(id);
            if (receipt == null) {
                return ResponseEntity.badRequest().body("入库单不存在");
            }
            
            receiptService.generatePayable(receipt);
            return ResponseEntity.ok("应付款生成成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("应付款生成失败: " + e.getMessage());
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
    @Operation(summary = "删除库存入库单", description = "删除指定的库存入库单")
    @RequirePermission("inventory:receipt:delete")
    public ResponseEntity<String> deleteReceipt(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        boolean success = receiptService.deleteReceipt(id);
        if (success) {
            return ResponseEntity.ok("删除成功");
        }
        return ResponseEntity.badRequest().body("删除失败");
    }
}