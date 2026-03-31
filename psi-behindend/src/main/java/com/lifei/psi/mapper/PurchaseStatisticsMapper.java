package com.lifei.psi.mapper;

import com.lifei.psi.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PurchaseStatisticsMapper {

    // 采购订单执行情况报表
    @Select("SELECT " +
            "po.id as orderId, po.order_no as orderNo, po.supplier_name as supplierName, " +
            "po.purchaser, po.order_date as orderDate, po.delivery_date as deliveryDate, " +
            "po.total_amount as totalAmount, po.status, " +
            "poi.product_name as productName, poi.product_code as productCode, poi.unit, " +
            "poi.quantity, poi.unit_price as unitPrice, poi.amount, " +
            "poi.received_qty as receivedQty, poi.remaining_qty as remainingQty, " +
            "CASE WHEN poi.quantity > 0 THEN ROUND(poi.received_qty / poi.quantity * 100, 2) ELSE 0 END as executionRate " +
            "FROM purchase_order po " +
            "LEFT JOIN purchase_order_item poi ON po.id = poi.order_id " +
            "WHERE po.order_date >= #{startDate} AND po.order_date <= #{endDate} " +
            "ORDER BY po.order_date DESC, po.id, poi.id")
    List<PurchaseExecutionReport> getPurchaseExecutionReport(@Param("startDate") String startDate, 
                                                            @Param("endDate") String endDate);

    // 根据供应商查询执行情况
    @Select("SELECT " +
            "po.id as orderId, po.order_no as orderNo, po.supplier_name as supplierName, " +
            "po.purchaser, po.order_date as orderDate, po.delivery_date as deliveryDate, " +
            "po.total_amount as totalAmount, po.status, " +
            "poi.product_name as productName, poi.product_code as productCode, poi.unit, " +
            "poi.quantity, poi.unit_price as unitPrice, poi.amount, " +
            "poi.received_qty as receivedQty, poi.remaining_qty as remainingQty, " +
            "CASE WHEN poi.quantity > 0 THEN ROUND(poi.received_qty / poi.quantity * 100, 2) ELSE 0 END as executionRate " +
            "FROM purchase_order po " +
            "LEFT JOIN purchase_order_item poi ON po.id = poi.order_id " +
            "WHERE po.supplier_name LIKE CONCAT('%', #{supplierName}, '%') " +
            "AND po.order_date >= #{startDate} AND po.order_date <= #{endDate} " +
            "ORDER BY po.order_date DESC, po.id, poi.id")
    List<PurchaseExecutionReport> getPurchaseExecutionBySupplier(@Param("supplierName") String supplierName,
                                                               @Param("startDate") String startDate, 
                                                               @Param("endDate") String endDate);

    // 采购订单汇总报表
    @Select("SELECT " +
            "DATE_FORMAT(order_date, '%Y-%m') as period, " +
            "COUNT(*) as orderCount, " +
            "COALESCE(SUM(total_amount), 0) as totalAmount, " +
            "COALESCE(AVG(total_amount), 0) as avgAmount, " +
            "SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pendingCount, " +
            "SUM(CASE WHEN status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmedCount, " +
            "SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completedCount, " +
            "SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelledCount, " +
            "CASE WHEN COUNT(*) > 0 THEN ROUND(SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) ELSE 0 END as completionRate " +
            "FROM purchase_order " +
            "WHERE order_date >= #{startDate} AND order_date <= #{endDate} " +
            "GROUP BY DATE_FORMAT(order_date, '%Y-%m') " +
            "ORDER BY period DESC")
    List<PurchaseSummaryReport> getPurchaseSummaryReport(@Param("startDate") String startDate, 
                                                        @Param("endDate") String endDate);

    // 采购订单汇总-部门报表
    @Select("SELECT " +
            "pr.department, " +
            "COUNT(DISTINCT po.id) as orderCount, " +
            "COALESCE(SUM(po.total_amount), 0) as totalAmount, " +
            "COALESCE(AVG(po.total_amount), 0) as avgAmount, " +
            "COUNT(poi.id) as itemCount, " +
            "COALESCE(SUM(poi.quantity), 0) as totalQuantity, " +
            "CASE WHEN COUNT(DISTINCT po.id) > 0 THEN " +
            "ROUND(SUM(CASE WHEN po.status = 'COMPLETED' THEN 1 ELSE 0 END) / COUNT(DISTINCT po.id) * 100, 2) " +
            "ELSE 0 END as completionRate " +
            "FROM purchase_request pr " +
            "LEFT JOIN purchase_inquiry pi ON pr.id = pi.request_id " +
            "LEFT JOIN supplier_quotation sq ON pi.id = sq.inquiry_id " +
            "LEFT JOIN purchase_order po ON sq.id = po.quotation_id " +
            "LEFT JOIN purchase_order_item poi ON po.id = poi.order_id " +
            "WHERE po.order_date >= #{startDate} AND po.order_date <= #{endDate} " +
            "GROUP BY pr.department " +
            "ORDER BY totalAmount DESC")
    List<PurchaseDepartmentReport> getPurchaseDepartmentReport(@Param("startDate") String startDate, 
                                                              @Param("endDate") String endDate);

    // 采购订单汇总-采购员报表
    @Select("SELECT " +
            "po.purchaser, " +
            "COUNT(*) as orderCount, " +
            "COALESCE(SUM(po.total_amount), 0) as totalAmount, " +
            "COALESCE(AVG(po.total_amount), 0) as avgAmount, " +
            "COUNT(DISTINCT po.supplier_name) as supplierCount, " +
            "CASE WHEN COUNT(*) > 0 THEN ROUND(SUM(CASE WHEN po.status = 'COMPLETED' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) ELSE 0 END as completionRate, " +
            "CASE WHEN COUNT(*) > 0 THEN ROUND(SUM(CASE WHEN po.status = 'COMPLETED' AND po.delivery_date >= CURDATE() THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) ELSE 0 END as onTimeRate " +
            "FROM purchase_order po " +
            "WHERE po.order_date >= #{startDate} AND po.order_date <= #{endDate} " +
            "GROUP BY po.purchaser " +
            "ORDER BY totalAmount DESC")
    List<PurchasePurchaserReport> getPurchasePurchaserReport(@Param("startDate") String startDate, 
                                                            @Param("endDate") String endDate);

    // 采购订单汇总-供应商报表
    @Select("SELECT " +
            "po.supplier_name as supplierName, " +
            "po.supplier_contact as supplierContact, " +
            "COUNT(*) as orderCount, " +
            "COALESCE(SUM(po.total_amount), 0) as totalAmount, " +
            "COALESCE(AVG(po.total_amount), 0) as avgAmount, " +
            "COUNT(DISTINCT poi.product_name) as productCount, " +
            "CASE WHEN COUNT(*) > 0 THEN ROUND(SUM(CASE WHEN po.status = 'COMPLETED' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) ELSE 0 END as completionRate, " +
            "CASE WHEN COUNT(*) > 0 THEN ROUND(SUM(CASE WHEN po.status = 'COMPLETED' AND po.delivery_date >= CURDATE() THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) ELSE 0 END as onTimeRate, " +
            "DATE_FORMAT(MAX(po.order_date), '%Y-%m-%d') as lastOrderDate " +
            "FROM purchase_order po " +
            "LEFT JOIN purchase_order_item poi ON po.id = poi.order_id " +
            "WHERE po.order_date >= #{startDate} AND po.order_date <= #{endDate} " +
            "GROUP BY po.supplier_name, po.supplier_contact " +
            "ORDER BY totalAmount DESC")
    List<PurchaseSupplierReport> getPurchaseSupplierReport(@Param("startDate") String startDate, 
                                                          @Param("endDate") String endDate);

    // 采购订单汇总-物料报表
    @Select("SELECT " +
            "poi.product_name as productName, " +
            "poi.product_code as productCode, " +
            "poi.specification, " +
            "poi.unit, " +
            "COALESCE(SUM(poi.quantity), 0) as totalQuantity, " +
            "COALESCE(SUM(poi.amount), 0) as totalAmount, " +
            "COALESCE(AVG(poi.unit_price), 0) as avgPrice, " +
            "COALESCE(MIN(poi.unit_price), 0) as minPrice, " +
            "COALESCE(MAX(poi.unit_price), 0) as maxPrice, " +
            "COUNT(DISTINCT po.id) as orderCount, " +
            "COUNT(DISTINCT po.supplier_name) as supplierCount, " +
            "(SELECT supplier_name FROM purchase_order po2 " +
            " JOIN purchase_order_item poi2 ON po2.id = poi2.order_id " +
            " WHERE poi2.product_name = poi.product_name " +
            " GROUP BY po2.supplier_name " +
            " ORDER BY SUM(poi2.amount) DESC LIMIT 1) as mainSupplier, " +
            "COALESCE(SUM(poi.received_qty), 0) as receivedQty, " +
            "COALESCE(SUM(poi.remaining_qty), 0) as remainingQty " +
            "FROM purchase_order_item poi " +
            "JOIN purchase_order po ON poi.order_id = po.id " +
            "WHERE po.order_date >= #{startDate} AND po.order_date <= #{endDate} " +
            "GROUP BY poi.product_name, poi.product_code, poi.specification, poi.unit " +
            "ORDER BY totalAmount DESC")
    List<PurchaseProductReport> getPurchaseProductReport(@Param("startDate") String startDate, 
                                                        @Param("endDate") String endDate);

    // 根据产品名称查询物料报表
    @Select("SELECT " +
            "poi.product_name as productName, " +
            "poi.product_code as productCode, " +
            "poi.specification, " +
            "poi.unit, " +
            "COALESCE(SUM(poi.quantity), 0) as totalQuantity, " +
            "COALESCE(SUM(poi.amount), 0) as totalAmount, " +
            "COALESCE(AVG(poi.unit_price), 0) as avgPrice, " +
            "COALESCE(MIN(poi.unit_price), 0) as minPrice, " +
            "COALESCE(MAX(poi.unit_price), 0) as maxPrice, " +
            "COUNT(DISTINCT po.id) as orderCount, " +
            "COUNT(DISTINCT po.supplier_name) as supplierCount, " +
            "(SELECT supplier_name FROM purchase_order po2 " +
            " JOIN purchase_order_item poi2 ON po2.id = poi2.order_id " +
            " WHERE poi2.product_name = poi.product_name " +
            " GROUP BY po2.supplier_name " +
            " ORDER BY SUM(poi2.amount) DESC LIMIT 1) as mainSupplier, " +
            "COALESCE(SUM(poi.received_qty), 0) as receivedQty, " +
            "COALESCE(SUM(poi.remaining_qty), 0) as remainingQty " +
            "FROM purchase_order_item poi " +
            "JOIN purchase_order po ON poi.order_id = po.id " +
            "WHERE poi.product_name LIKE CONCAT('%', #{productName}, '%') " +
            "AND po.order_date >= #{startDate} AND po.order_date <= #{endDate} " +
            "GROUP BY poi.product_name, poi.product_code, poi.specification, poi.unit " +
            "ORDER BY totalAmount DESC")
    List<PurchaseProductReport> getPurchaseProductByName(@Param("productName") String productName,
                                                        @Param("startDate") String startDate, 
                                                        @Param("endDate") String endDate);
}