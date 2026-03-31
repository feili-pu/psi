package com.lifei.psi.controller;

import com.lifei.psi.dto.SerialNumberBatchScanRequest;
import com.lifei.psi.dto.SerialNumberReceiptRequest;
import com.lifei.psi.entity.SerialNumberReceipt;
import com.lifei.psi.entity.SerialNumberReceiptItem;
import com.lifei.psi.service.SerialNumberReceiptService;
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
@RequestMapping("/api/serial-number-receipts")
@Tag(name = "扫序列码入库管理", description = "序列号入库单的增删改查操作，包括采购入库SN、采购退货出库SN、盘盈入库SN、其他入库SN")
public class SerialNumberReceiptController {

    @Autowired
    private SerialNumberReceiptService receiptService;

    @GetMapping
    @Operation(summary = "获取所有序列号入库单", description = "获取系统中所有的序列号入库单列表")
    public ResponseEntity<List<SerialNumberReceipt>> getAllReceipts() {
        List<SerialNumberReceipt> receipts = receiptService.getAllReceipts();
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取序列号入库单", description = "根据入库单ID获取详细信息")
    public ResponseEntity<SerialNumberReceipt> getReceiptById(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        SerialNumberReceipt receipt = receiptService.getReceiptById(id);
        if (receipt != null) {
            return ResponseEntity.ok(receipt);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "获取入库明细", description = "根据入库单ID获取序列号明细列表")
    public ResponseEntity<List<SerialNumberReceiptItem>> getReceiptItems(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        List<SerialNumberReceiptItem> items = receiptService.getReceiptItems(id);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/search")
    @Operation(summary = "搜索序列号入库单", description = "根据入库类型、操作员、状态等条件搜索")
    public ResponseEntity<List<SerialNumberReceipt>> searchReceipts(
            @Parameter(description = "入库类型") @RequestParam(required = false) String receiptType,
            @Parameter(description = "操作员") @RequestParam(required = false) String operator,
            @Parameter(description = "状态") @RequestParam(required = false) String status,
            @Parameter(description = "仓库ID") @RequestParam(required = false) Long warehouseId,
            @Parameter(description = "供应商ID") @RequestParam(required = false) Long supplierId) {
        
        List<SerialNumberReceipt> receipts;
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
    @Operation(summary = "创建序列号入库单", description = "创建新的序列号入库单")
    public ResponseEntity<?> createReceipt(
            @Valid @RequestBody SerialNumberReceiptRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            SerialNumberReceipt receipt = new SerialNumberReceipt();
            BeanUtils.copyProperties(request, receipt);
            
            // 转换明细
            List<SerialNumberReceiptItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    SerialNumberReceiptItem item = new SerialNumberReceiptItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            SerialNumberReceipt created = receiptService.createReceipt(receipt, items);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("创建失败: " + e.getMessage());
        }
    }

    @PostMapping("/batch-scan")
    @Operation(summary = "批量扫码入库", description = "批量扫描序列号进行入库操作")
    public ResponseEntity<?> batchScanReceipt(
            @Valid @RequestBody SerialNumberBatchScanRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            SerialNumberReceipt receipt = new SerialNumberReceipt();
            BeanUtils.copyProperties(request, receipt);
            
            SerialNumberReceipt created = receiptService.batchScanReceipt(
                receipt, 
                request.getSerialNumbers(), 
                request.getProductId(), 
                request.getUnitPrice()
            );
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("批量扫码入库失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新序列号入库单", description = "更新现有的序列号入库单信息")
    public ResponseEntity<?> updateReceipt(
            @Parameter(description = "入库单ID") @PathVariable Long id,
            @Valid @RequestBody SerialNumberReceiptRequest request, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            SerialNumberReceipt receipt = new SerialNumberReceipt();
            BeanUtils.copyProperties(request, receipt);
            receipt.setId(id);
            
            // 转换明细
            List<SerialNumberReceiptItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    SerialNumberReceiptItem item = new SerialNumberReceiptItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    return item;
                }).collect(java.util.stream.Collectors.toList());
            
            SerialNumberReceipt updated = receiptService.updateReceipt(receipt, items);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "审核入库单", description = "审核通过序列号入库单")
    public ResponseEntity<String> approveReceipt(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        boolean success = receiptService.approveReceipt(id);
        if (success) {
            return ResponseEntity.ok("审核成功");
        }
        return ResponseEntity.badRequest().body("审核失败");
    }

    @PostMapping("/{id}/process")
    @Operation(summary = "入库处理", description = "执行序列号入库处理操作，自动更新序列号库存并生成应付款")
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
            SerialNumberReceipt receipt = receiptService.getReceiptById(id);
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
    @Operation(summary = "取消入库单", description = "取消序列号入库单")
    public ResponseEntity<String> cancelReceipt(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        boolean success = receiptService.cancelReceipt(id);
        if (success) {
            return ResponseEntity.ok("取消成功");
        }
        return ResponseEntity.badRequest().body("取消失败");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除序列号入库单", description = "删除指定的序列号入库单")
    public ResponseEntity<String> deleteReceipt(
            @Parameter(description = "入库单ID") @PathVariable Long id) {
        boolean success = receiptService.deleteReceipt(id);
        if (success) {
            return ResponseEntity.ok("删除成功");
        }
        return ResponseEntity.badRequest().body("删除失败");
    }
}