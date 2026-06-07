package com.lifei.psi.controller;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.dto.PurchaseOrderRequest;
import com.lifei.psi.dto.PurchaseOrderItemRequest;
import com.lifei.psi.entity.PurchaseOrder;
import com.lifei.psi.entity.PurchaseOrderItem;
import com.lifei.psi.service.PurchaseOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase/orders")
@Tag(name = "采购订单管理", description = "采购订单的创建、跟踪和管理")
@RequirePermission("purchase:order:read")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService orderService;

    @GetMapping
    @Operation(summary = "获取所有采购订单", description = "获取系统中所有的采购订单列表")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功", 
                    content = @Content(schema = @Schema(implementation = PurchaseOrder.class)))
    })
    public List<PurchaseOrder> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取采购订单", description = "根据订单ID获取详细信息，包含订单明细")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "订单不存在")
    })
    public Map<String, Object> getOrderById(
            @Parameter(description = "订单ID", required = true) @PathVariable Long id) {
        PurchaseOrder order = orderService.getOrderById(id);
        List<PurchaseOrderItem> items = orderService.getOrderItems(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("order", order);
        result.put("items", items);
        return result;
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "获取订单明细", description = "根据订单ID获取明细列表")
    public List<PurchaseOrderItem> getOrderItems(
            @Parameter(description = "订单ID", required = true) @PathVariable Long id) {
        return orderService.getOrderItems(id);
    }

    // 根据供应商名称搜索
    @GetMapping("/search")
    public List<PurchaseOrder> searchOrders(@RequestParam String supplierName) {
        return orderService.searchBySupplier(supplierName);
    }

    // 根据采购员查询
    @GetMapping("/purchaser/{purchaser}")
    public List<PurchaseOrder> getOrdersByPurchaser(@PathVariable String purchaser) {
        return orderService.getOrdersByPurchaser(purchaser);
    }

    // 根据状态查询
    @GetMapping("/status/{status}")
    public List<PurchaseOrder> getOrdersByStatus(@PathVariable String status) {
        return orderService.getOrdersByStatus(status);
    }

    // 创建采购订单
    @PostMapping
    @RequirePermission("purchase:order:create")
    public Map<String, Object> createOrder(@Valid @RequestBody PurchaseOrderRequest request, 
                                         BindingResult bindingResult) {
        // 检查验证结果
        if (bindingResult.hasErrors()) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "数据验证失败");
            
            List<String> errors = new ArrayList<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.add(error.getField() + ": " + error.getDefaultMessage())
            );
            result.put("errors", errors);
            return result;
        }
        
        try {
            System.out.println("接收到的采购订单数据:");
            System.out.println("供应商名称: " + request.getSupplierName());
            System.out.println("采购员: " + request.getPurchaser());
            System.out.println("明细数量: " + (request.getItems() != null ? request.getItems().size() : 0));
            
            PurchaseOrder order = convertToEntity(request);
            List<PurchaseOrderItem> items = convertToItemEntities(request.getItems());
            
            PurchaseOrder created = orderService.createOrder(order, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "采购订单创建成功");
            result.put("order", created);
            return result;
            
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "创建失败: " + e.getMessage());
            result.put("error", e.getClass().getSimpleName());
            return result;
        }
    }

    // 更新采购订单
    @PutMapping("/{id}")
    @RequirePermission("purchase:order:update")
    public Map<String, Object> updateOrder(@PathVariable Long id, 
                                         @Valid @RequestBody PurchaseOrderRequest request,
                                         BindingResult bindingResult) {
        // 检查验证结果
        if (bindingResult.hasErrors()) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "数据验证失败");
            
            List<String> errors = new ArrayList<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.add(error.getField() + ": " + error.getDefaultMessage())
            );
            result.put("errors", errors);
            return result;
        }
        
        try {
            PurchaseOrder order = convertToEntity(request);
            order.setId(id);
            List<PurchaseOrderItem> items = convertToItemEntities(request.getItems());
            
            PurchaseOrder updated = orderService.updateOrder(order, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "采购订单更新成功");
            result.put("order", updated);
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "更新失败: " + e.getMessage());
            return result;
        }
    }

    // 确认订单
    @PostMapping("/{id}/confirm")
    public Map<String, Object> confirmOrder(@PathVariable Long id) {
        boolean success = orderService.confirmOrder(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "订单已确认" : "确认失败");
        return result;
    }

    // 开始生产
    @PostMapping("/{id}/start-production")
    public Map<String, Object> startProduction(@PathVariable Long id) {
        boolean success = orderService.startProduction(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "已开始生产" : "操作失败");
        return result;
    }

    // 发货
    @PostMapping("/{id}/ship")
    public Map<String, Object> shipOrder(@PathVariable Long id) {
        boolean success = orderService.shipOrder(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "订单已发货" : "发货失败");
        return result;
    }

    // 收货
    @PostMapping("/{id}/receive")
    public Map<String, Object> receiveOrder(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = orderService.receiveOrder(id);
            result.put("success", success);
            result.put("message", success ? "订单已收货" : "收货失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "收货失败: " + e.getMessage());
        }
        return result;
    }

    // 完成订单
    @PostMapping("/{id}/complete")
    public Map<String, Object> completeOrder(@PathVariable Long id) {
        boolean success = orderService.completeOrder(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "订单已完成" : "完成失败");
        return result;
    }

    // 取消订单
    @PostMapping("/{id}/cancel")
    public Map<String, Object> cancelOrder(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = orderService.cancelOrder(id);
            result.put("success", success);
            result.put("message", success ? "订单已取消" : "取消失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "取消失败: " + e.getMessage());
        }
        return result;
    }

    // 更新收货数量
    @PostMapping("/items/{itemId}/receive")
    public Map<String, Object> updateReceivedQuantity(@PathVariable Long itemId, 
                                                     @RequestBody Map<String, Object> request) {
        try {
            BigDecimal receivedQty = new BigDecimal(request.get("receivedQty").toString());
            boolean success = orderService.updateReceivedQuantity(itemId, receivedQty);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", success);
            result.put("message", success ? "收货数量更新成功" : "更新失败");
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "更新失败: " + e.getMessage());
            return result;
        }
    }

    // 删除采购订单
    @DeleteMapping("/{id}")
    @RequirePermission("purchase:order:delete")
    public Map<String, Object> deleteOrder(@PathVariable Long id) {
        boolean success = orderService.deleteOrder(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "采购订单删除成功" : "删除失败");
        return result;
    }

    // 转换DTO到实体类
    private PurchaseOrder convertToEntity(PurchaseOrderRequest request) {
        PurchaseOrder order = new PurchaseOrder();
        order.setQuotationId(request.getQuotationId());
        order.setSupplierName(request.getSupplierName());
        order.setSupplierContact(request.getSupplierContact());
        order.setPurchaser(request.getPurchaser());
        order.setIncludeTax(request.getIncludeTax() != null ? request.getIncludeTax() : false);
        order.setPaymentTerms(request.getPaymentTerms());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setRemarks(request.getRemarks());
        
        // 处理交货日期
        if (request.getDeliveryDate() != null && !request.getDeliveryDate().isEmpty()) {
            try {
                order.setDeliveryDate(LocalDate.parse(request.getDeliveryDate()));
            } catch (Exception e) {
                // 如果解析失败，设置默认值（30天后）
                order.setDeliveryDate(LocalDate.now().plusDays(30));
            }
        } else {
            // 默认30天后交货
            order.setDeliveryDate(LocalDate.now().plusDays(30));
        }
        
        return order;
    }

    // 转换明细DTO到实体类
    private List<PurchaseOrderItem> convertToItemEntities(List<PurchaseOrderItemRequest> itemRequests) {
        List<PurchaseOrderItem> items = new ArrayList<>();
        if (itemRequests != null) {
            for (PurchaseOrderItemRequest itemRequest : itemRequests) {
                PurchaseOrderItem item = new PurchaseOrderItem();
                item.setProductName(itemRequest.getProductName());
                item.setProductCode(itemRequest.getProductCode());
                item.setSpecification(itemRequest.getSpecification());
                item.setUnit(itemRequest.getUnit());
                item.setQuantity(itemRequest.getQuantity());
                item.setUnitPrice(itemRequest.getUnitPrice());
                item.setDeliveryPeriod(itemRequest.getDeliveryPeriod());
                item.setRemarks(itemRequest.getRemarks());
                
                // 计算金额和设置初始收货数量
                if (itemRequest.getQuantity() != null && itemRequest.getUnitPrice() != null) {
                    item.setAmount(itemRequest.getQuantity().multiply(itemRequest.getUnitPrice()));
                }
                item.setReceivedQty(BigDecimal.ZERO);
                item.setRemainingQty(itemRequest.getQuantity());
                
                items.add(item);
            }
        }
        return items;
    }
}
