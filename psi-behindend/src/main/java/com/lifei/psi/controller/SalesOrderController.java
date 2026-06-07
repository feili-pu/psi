package com.lifei.psi.controller;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.dto.SalesOrderRequest;
import com.lifei.psi.dto.SalesOrderItemRequest;
import com.lifei.psi.entity.SalesOrder;
import com.lifei.psi.entity.SalesOrderItem;
import com.lifei.psi.service.SalesOrderService;
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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "销售订单管理", description = "销售订单的创建、跟踪和管理")
@RequirePermission("sales:order:read")
public class SalesOrderController {

    @Autowired
    private SalesOrderService orderService;

    @GetMapping
    @Operation(summary = "获取所有销售订单", description = "获取系统中所有的销售订单列表")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功", 
                    content = @Content(schema = @Schema(implementation = SalesOrder.class)))
    })
    public List<SalesOrder> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取销售订单", description = "根据订单ID获取详细信息，包含订单明细")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "订单不存在")
    })
    public Map<String, Object> getOrderById(
            @Parameter(description = "订单ID", required = true) @PathVariable Long id) {
        SalesOrder order = orderService.getOrderById(id);
        List<SalesOrderItem> items = orderService.getOrderItems(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("order", order);
        result.put("items", items);
        return result;
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "获取订单明细", description = "根据订单ID获取明细列表")
    public List<SalesOrderItem> getOrderItems(
            @Parameter(description = "订单ID", required = true) @PathVariable Long id) {
        return orderService.getOrderItems(id);
    }

    // 根据客户名称搜索
    @GetMapping("/search")
    public List<SalesOrder> searchOrders(@RequestParam String customerName) {
        return orderService.searchByCustomer(customerName);
    }

    // 根据销售员查询
    @GetMapping("/salesperson/{salesperson}")
    public List<SalesOrder> getOrdersBySalesperson(@PathVariable String salesperson) {
        return orderService.getOrdersBySalesperson(salesperson);
    }

    // 根据状态查询
    @GetMapping("/status/{status}")
    public List<SalesOrder> getOrdersByStatus(@PathVariable String status) {
        return orderService.getOrdersByStatus(status);
    }

    // 创建订单
    @PostMapping
    @RequirePermission("sales:order:create")
    public Map<String, Object> createOrder(@Valid @RequestBody SalesOrderRequest request, BindingResult bindingResult) {
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
            System.out.println("接收到的订单请求数据:");
            System.out.println("客户名称: " + request.getCustomerName());
            System.out.println("销售员: " + request.getSalesperson());
            System.out.println("明细数量: " + (request.getItems() != null ? request.getItems().size() : 0));
            
            SalesOrder order = convertToEntity(request);
            List<SalesOrderItem> items = convertToItemEntities(request.getItems());
            
            SalesOrder created = orderService.createOrder(order, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "订单创建成功");
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

    // 从报价单创建订单
    @PostMapping("/from-quotation/{quotationId}")
    @Operation(summary = "从报价单创建订单", description = "根据报价单ID创建订单")
    public Map<String, Object> createOrderFromQuotation(@PathVariable Long quotationId, 
                                                       @Valid @RequestBody SalesOrderRequest request,
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
            System.out.println("从报价单创建订单，报价单ID: " + quotationId);
            
            SalesOrder orderInfo = convertToEntity(request);
            SalesOrder created = orderService.createOrderFromQuotation(quotationId, orderInfo);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "从报价单创建订单成功");
            result.put("order", created);
            return result;
            
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "创建失败: " + e.getMessage());
            return result;
        }
    }

    // 更新订单
    @PutMapping("/{id}")
    @RequirePermission("sales:order:update")
    public Map<String, Object> updateOrder(@PathVariable Long id, 
                                          @Valid @RequestBody SalesOrderRequest request,
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
            SalesOrder order = convertToEntity(request);
            order.setId(id);
            List<SalesOrderItem> items = convertToItemEntities(request.getItems());
            
            SalesOrder updated = orderService.updateOrder(order, items);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "订单更新成功");
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
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = orderService.shipOrder(id);
            result.put("success", success);
            result.put("message", success ? "订单已发货" : "发货失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "发货失败: " + e.getMessage());
        }
        return result;
    }

    // 交付
    @PostMapping("/{id}/deliver")
     @Operation(summary = "更新订单明细", description = "更新订单明细的交货数量")
    public Map<String, Object> deliverOrder(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = orderService.deliverOrder(id);
            result.put("success", success);
            result.put("message", success ? "订单已交付" : "交付失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "交付失败: " + e.getMessage());
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

    // 更新交货数量
    @PostMapping("/items/{itemId}/deliver")
    public Map<String, Object> updateDeliveredQuantity(@PathVariable Long itemId, 
                                                      @RequestBody Map<String, Object> request) {
        try {
            BigDecimal deliveredQty = new BigDecimal(request.get("deliveredQty").toString());
            boolean success = orderService.updateDeliveredQuantity(itemId, deliveredQty);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", success);
            result.put("message", success ? "交货数量更新成功" : "更新失败");
            return result;
            
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "更新失败: " + e.getMessage());
            return result;
        }
    }

    // 删除订单
    @DeleteMapping("/{id}")
    @RequirePermission("sales:order:delete")
    public Map<String, Object> deleteOrder(@PathVariable Long id) {
        boolean success = orderService.deleteOrder(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "订单删除成功" : "删除失败");
        return result;
    }

    // 转换DTO到实体类
    private SalesOrder convertToEntity(SalesOrderRequest request) {
        SalesOrder order = new SalesOrder();
        order.setQuotationId(request.getQuotationId());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerContact(request.getCustomerContact());
        order.setSalesperson(request.getSalesperson());
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
    private List<SalesOrderItem> convertToItemEntities(List<SalesOrderItemRequest> itemRequests) {
        List<SalesOrderItem> items = new ArrayList<>();
        if (itemRequests != null) {
            for (SalesOrderItemRequest itemRequest : itemRequests) {
                SalesOrderItem item = new SalesOrderItem();
                item.setProductName(itemRequest.getProductName());
                item.setProductCode(itemRequest.getProductCode());
                item.setSpecification(itemRequest.getSpecification());
                item.setUnit(itemRequest.getUnit());
                item.setQuantity(itemRequest.getQuantity());
                item.setUnitPrice(itemRequest.getUnitPrice());
                item.setRemarks(itemRequest.getRemarks());
                
                // 计算金额和设置初始交货数量
                if (itemRequest.getQuantity() != null && itemRequest.getUnitPrice() != null) {
                    item.setAmount(itemRequest.getQuantity().multiply(itemRequest.getUnitPrice()));
                }
                item.setDeliveredQty(BigDecimal.ZERO);
                item.setRemainingQty(itemRequest.getQuantity());
                
                items.add(item);
            }
        }
        return items;
    }
}
