package com.lifei.psi.controller;

import com.lifei.psi.entity.SerialNumberInventory;
import com.lifei.psi.entity.SerialNumberTransaction;
import com.lifei.psi.service.SerialNumberInventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/serial-number-inventory")
@Tag(name = "序列号库存管理", description = "序列号库存查询和管理操作")
public class SerialNumberInventoryController {

    @Autowired
    private SerialNumberInventoryService inventoryService;

    @GetMapping("/serial/{serialNumber}")
    @Operation(summary = "根据序列号查询库存", description = "根据序列号获取库存信息")
    public ResponseEntity<SerialNumberInventory> getInventoryBySerialNumber(
            @Parameter(description = "序列号") @PathVariable String serialNumber) {
        SerialNumberInventory inventory = inventoryService.getInventoryBySerialNumber(serialNumber);
        if (inventory != null) {
            return ResponseEntity.ok(inventory);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/warehouse/{warehouseId}/product/{productId}")
    @Operation(summary = "根据仓库和产品查询库存", description = "根据仓库ID和产品ID获取序列号库存列表")
    public ResponseEntity<List<SerialNumberInventory>> getInventoryByWarehouseAndProduct(
            @Parameter(description = "仓库ID") @PathVariable Long warehouseId,
            @Parameter(description = "产品ID") @PathVariable Long productId) {
        List<SerialNumberInventory> inventories = inventoryService.getInventoryByWarehouseAndProduct(warehouseId, productId);
        return ResponseEntity.ok(inventories);
    }

    @GetMapping("/warehouse/{warehouseId}")
    @Operation(summary = "根据仓库查询库存", description = "根据仓库ID获取所有序列号库存")
    public ResponseEntity<List<SerialNumberInventory>> getInventoryByWarehouse(
            @Parameter(description = "仓库ID") @PathVariable Long warehouseId) {
        List<SerialNumberInventory> inventories = inventoryService.getInventoryByWarehouse(warehouseId);
        return ResponseEntity.ok(inventories);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "根据状态查询库存", description = "根据状态获取序列号库存列表")
    public ResponseEntity<List<SerialNumberInventory>> getInventoryByStatus(
            @Parameter(description = "状态") @PathVariable String status) {
        List<SerialNumberInventory> inventories = inventoryService.getInventoryByStatus(status);
        return ResponseEntity.ok(inventories);
    }

    @GetMapping("/batch/{batchNo}")
    @Operation(summary = "根据批次号查询库存", description = "根据批次号获取序列号库存列表")
    public ResponseEntity<List<SerialNumberInventory>> getInventoryByBatchNo(
            @Parameter(description = "批次号") @PathVariable String batchNo) {
        List<SerialNumberInventory> inventories = inventoryService.getInventoryByBatchNo(batchNo);
        return ResponseEntity.ok(inventories);
    }

    @GetMapping("/count/warehouse/{warehouseId}/product/{productId}")
    @Operation(summary = "统计在库数量", description = "统计指定仓库和产品的在库序列号数量")
    public ResponseEntity<Integer> countInStockByWarehouseAndProduct(
            @Parameter(description = "仓库ID") @PathVariable Long warehouseId,
            @Parameter(description = "产品ID") @PathVariable Long productId) {
        int count = inventoryService.countInStockByWarehouseAndProduct(warehouseId, productId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/check/exists/{serialNumber}")
    @Operation(summary = "检查序列号是否存在", description = "检查指定序列号是否已存在于库存中")
    public ResponseEntity<Boolean> checkSerialNumberExists(
            @Parameter(description = "序列号") @PathVariable String serialNumber) {
        boolean exists = inventoryService.checkSerialNumberExists(serialNumber);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check/available/{serialNumber}")
    @Operation(summary = "检查序列号是否可用", description = "检查指定序列号是否处于可用状态（在库）")
    public ResponseEntity<Boolean> checkSerialNumberAvailable(
            @Parameter(description = "序列号") @PathVariable String serialNumber) {
        boolean available = inventoryService.checkSerialNumberAvailable(serialNumber);
        return ResponseEntity.ok(available);
    }

    @PostMapping("/update-status/{serialNumber}")
    @Operation(summary = "更新序列号状态", description = "更新指定序列号的状态")
    public ResponseEntity<String> updateSerialNumberStatus(
            @Parameter(description = "序列号") @PathVariable String serialNumber,
            @Parameter(description = "新状态") @RequestParam String newStatus,
            @Parameter(description = "业务类型") @RequestParam String businessType,
            @Parameter(description = "关联单据号") @RequestParam(required = false) String referenceNo,
            @Parameter(description = "操作员") @RequestParam String operator) {
        try {
            boolean success = inventoryService.updateSerialNumberStatus(serialNumber, newStatus, businessType, referenceNo, operator);
            if (success) {
                return ResponseEntity.ok("状态更新成功");
            }
            return ResponseEntity.badRequest().body("状态更新失败");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("状态更新失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/serial/{serialNumber}")
    @Operation(summary = "删除序列号库存", description = "删除指定序列号的库存记录")
    public ResponseEntity<String> deleteSerialNumber(
            @Parameter(description = "序列号") @PathVariable String serialNumber,
            @Parameter(description = "操作员") @RequestParam String operator) {
        boolean success = inventoryService.deleteSerialNumber(serialNumber, operator);
        if (success) {
            return ResponseEntity.ok("删除成功");
        }
        return ResponseEntity.badRequest().body("删除失败");
    }

    @GetMapping("/transactions/serial/{serialNumber}")
    @Operation(summary = "获取序列号流水记录", description = "获取指定序列号的所有流水记录")
    public ResponseEntity<List<SerialNumberTransaction>> getTransactionsBySerialNumber(
            @Parameter(description = "序列号") @PathVariable String serialNumber) {
        List<SerialNumberTransaction> transactions = inventoryService.getTransactionsBySerialNumber(serialNumber);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/business-type/{businessType}")
    @Operation(summary = "根据业务类型获取流水记录", description = "根据业务类型获取流水记录列表")
    public ResponseEntity<List<SerialNumberTransaction>> getTransactionsByBusinessType(
            @Parameter(description = "业务类型") @PathVariable String businessType) {
        List<SerialNumberTransaction> transactions = inventoryService.getTransactionsByBusinessType(businessType);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/date-range")
    @Operation(summary = "根据日期范围获取流水记录", description = "根据日期范围获取流水记录列表")
    public ResponseEntity<List<SerialNumberTransaction>> getTransactionsByDateRange(
            @Parameter(description = "开始日期") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "结束日期") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<SerialNumberTransaction> transactions = inventoryService.getTransactionsByDateRange(startDate, endDate);
        return ResponseEntity.ok(transactions);
    }
}