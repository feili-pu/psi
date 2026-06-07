package com.lifei.psi.controller;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.entity.SalesReceivable;
import com.lifei.psi.service.SalesReceivableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales-receivables")
@RequirePermission("sales:statistics:read")
public class SalesReceivableController {

    @Autowired
    private SalesReceivableService receivableService;

    @GetMapping
    public ResponseEntity<List<SalesReceivable>> getAllReceivables() {
        return ResponseEntity.ok(receivableService.getAllReceivables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesReceivable> getReceivableById(@PathVariable Long id) {
        SalesReceivable receivable = receivableService.getReceivableById(id);
        return receivable != null ? ResponseEntity.ok(receivable) : ResponseEntity.notFound().build();
    }

    @GetMapping("/order/{salesOrderId}")
    public ResponseEntity<SalesReceivable> getBySalesOrder(@PathVariable Long salesOrderId) {
        SalesReceivable receivable = receivableService.getReceivableBySalesOrderId(salesOrderId);
        return receivable != null ? ResponseEntity.ok(receivable) : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<SalesReceivable>> search(@RequestParam(required = false) String customerName,
                                                        @RequestParam(required = false) String status) {
        if (customerName != null && !customerName.trim().isEmpty()) {
            return ResponseEntity.ok(receivableService.getReceivablesByCustomer(customerName));
        }
        if (status != null && !status.trim().isEmpty()) {
            return ResponseEntity.ok(receivableService.getReceivablesByStatus(status));
        }
        return ResponseEntity.ok(receivableService.getAllReceivables());
    }

    @PostMapping("/{id}/collection")
    public Map<String, Object> processCollection(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Map<String, Object> result = new HashMap<>();
        try {
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            boolean success = receivableService.processCollection(id, amount);
            result.put("success", success);
            result.put("message", success ? "收款成功" : "收款失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "收款失败: " + e.getMessage());
        }
        return result;
    }
}
