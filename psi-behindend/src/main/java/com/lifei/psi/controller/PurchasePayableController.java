package com.lifei.psi.controller;

import com.lifei.psi.entity.PurchasePayable;
import com.lifei.psi.service.PurchasePayableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/purchase-payables")
@Tag(name = "采购应付款管理", description = "采购应付款的查询和付款操作")
public class PurchasePayableController {

    @Autowired
    private PurchasePayableService payableService;

    @GetMapping
    @Operation(summary = "获取所有采购应付款", description = "获取系统中所有的采购应付款列表")
    public ResponseEntity<List<PurchasePayable>> getAllPayables() {
        List<PurchasePayable> payables = payableService.getAllPayables();
        return ResponseEntity.ok(payables);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取采购应付款", description = "根据应付款ID获取详细信息")
    public ResponseEntity<PurchasePayable> getPayableById(
            @Parameter(description = "应付款ID") @PathVariable Long id) {
        PurchasePayable payable = payableService.getPayableById(id);
        if (payable != null) {
            return ResponseEntity.ok(payable);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    @Operation(summary = "搜索采购应付款", description = "根据供应商、状态、应付类型等条件搜索")
    public ResponseEntity<List<PurchasePayable>> searchPayables(
            @Parameter(description = "供应商ID") @RequestParam(required = false) Long supplierId,
            @Parameter(description = "状态") @RequestParam(required = false) String status,
            @Parameter(description = "应付类型") @RequestParam(required = false) String payableType) {
        
        List<PurchasePayable> payables;
        if (supplierId != null) {
            payables = payableService.getPayablesBySupplier(supplierId);
        } else if (status != null) {
            payables = payableService.getPayablesByStatus(status);
        } else if (payableType != null) {
            payables = payableService.getPayablesByType(payableType);
        } else {
            payables = payableService.getAllPayables();
        }
        
        return ResponseEntity.ok(payables);
    }

    @GetMapping("/by-receipt/{receiptId}")
    @Operation(summary = "根据入库单查询应付款", description = "根据入库单ID查询对应的应付款")
    public ResponseEntity<PurchasePayable> getPayableByReceiptId(
            @Parameter(description = "入库单ID") @PathVariable Long receiptId) {
        PurchasePayable payable = payableService.getPayableByReceiptId(receiptId);
        if (payable != null) {
            return ResponseEntity.ok(payable);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/payment")
    @Operation(summary = "付款处理", description = "处理采购应付款的付款操作")
    public ResponseEntity<String> processPayment(
            @Parameter(description = "应付款ID") @PathVariable Long id,
            @Parameter(description = "付款金额") @RequestParam BigDecimal paymentAmount) {
        try {
            boolean success = payableService.processPayment(id, paymentAmount);
            if (success) {
                return ResponseEntity.ok("付款处理成功");
            }
            return ResponseEntity.badRequest().body("付款处理失败");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("付款处理失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新采购应付款", description = "更新现有的采购应付款信息")
    public ResponseEntity<?> updatePayable(
            @Parameter(description = "应付款ID") @PathVariable Long id,
            @RequestBody PurchasePayable payable) {
        try {
            payable.setId(id);
            PurchasePayable updated = payableService.updatePayable(payable);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除采购应付款", description = "删除指定的采购应付款")
    public ResponseEntity<String> deletePayable(
            @Parameter(description = "应付款ID") @PathVariable Long id) {
        boolean success = payableService.deletePayable(id);
        if (success) {
            return ResponseEntity.ok("删除成功");
        }
        return ResponseEntity.badRequest().body("删除失败");
    }
}