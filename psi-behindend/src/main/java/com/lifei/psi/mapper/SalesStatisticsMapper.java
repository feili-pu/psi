package com.lifei.psi.mapper;

import com.lifei.psi.dto.SalesExecutionReport;
import com.lifei.psi.dto.SalesProfitReport;
import com.lifei.psi.dto.SalesSummaryReport;
import org.apache.ibatis.annotations.*;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface SalesStatisticsMapper {

    // 销售订单执行情况
    @Select("SELECT " +
            "so.order_no, so.customer_name, so.salesperson, " +
            "DATE(so.order_date) as order_date, so.delivery_date, " +
            "so.total_amount, so.status, " +
            "COALESCE(SUM(soi.quantity), 0) as total_qty, " +
            "COALESCE(SUM(soi.delivered_qty), 0) as delivered_qty, " +
            "COALESCE(SUM(soi.remaining_qty), 0) as remaining_qty, " +
            "CASE WHEN SUM(soi.quantity) > 0 THEN ROUND(SUM(soi.delivered_qty) / SUM(soi.quantity) * 100, 2) ELSE 0 END as execution_rate, " +
            "CASE WHEN so.delivery_date < CURDATE() AND so.status NOT IN ('DELIVERED', 'COMPLETED') " +
            "     THEN DATEDIFF(CURDATE(), so.delivery_date) ELSE 0 END as delay_days " +
            "FROM sales_order so " +
            "LEFT JOIN sales_order_item soi ON so.id = soi.order_id " +
            "WHERE DATE(so.order_date) BETWEEN #{startDate} AND #{endDate} " +
            "GROUP BY so.id, so.order_no, so.customer_name, so.salesperson, so.order_date, so.delivery_date, so.total_amount, so.status " +
            "ORDER BY so.order_date DESC")
    List<SalesExecutionReport> getSalesExecutionReport(@Param("startDate") LocalDate startDate, 
                                                      @Param("endDate") LocalDate endDate);

    // 销售订单毛利润明细
    @Select("SELECT " +
            "so.order_no, so.customer_name, so.salesperson, " +
            "DATE(so.order_date) as order_date, " +
            "soi.product_name, soi.product_code, soi.quantity, " +
            "soi.unit_price, soi.amount as sales_amount, " +
            "COALESCE(pc.unit_cost, 0) as unit_cost, " +
            "COALESCE(pc.unit_cost * soi.quantity, 0) as total_cost, " +
            "soi.amount - COALESCE(pc.unit_cost * soi.quantity, 0) as gross_profit, " +
            "CASE WHEN soi.amount > 0 THEN ROUND((soi.amount - COALESCE(pc.unit_cost * soi.quantity, 0)) / soi.amount * 100, 2) ELSE 0 END as profit_rate " +
            "FROM sales_order so " +
            "INNER JOIN sales_order_item soi ON so.id = soi.order_id " +
            "LEFT JOIN product_cost pc ON soi.product_code = pc.product_code " +
            "WHERE DATE(so.order_date) BETWEEN #{startDate} AND #{endDate} " +
            "ORDER BY so.order_date DESC, so.order_no, soi.id")
    List<SalesProfitReport> getSalesProfitDetailReport(@Param("startDate") LocalDate startDate, 
                                                      @Param("endDate") LocalDate endDate);

    // 销售订单毛利润汇总
    @Select("SELECT " +
            "'TOTAL' as group_key, '总计' as group_name, " +
            "COUNT(DISTINCT so.id) as order_count, " +
            "COALESCE(SUM(so.total_amount), 0) as total_amount, " +
            "COALESCE(SUM(soi.quantity), 0) as total_quantity, " +
            "COALESCE(SUM(pc.unit_cost * soi.quantity), 0) as total_cost, " +
            "COALESCE(SUM(so.total_amount) - SUM(pc.unit_cost * soi.quantity), 0) as gross_profit, " +
            "CASE WHEN SUM(so.total_amount) > 0 THEN ROUND((SUM(so.total_amount) - SUM(pc.unit_cost * soi.quantity)) / SUM(so.total_amount) * 100, 2) ELSE 0 END as profit_rate, " +
            "CASE WHEN COUNT(DISTINCT so.id) > 0 THEN ROUND(SUM(so.total_amount) / COUNT(DISTINCT so.id), 2) ELSE 0 END as avg_order_amount " +
            "FROM sales_order so " +
            "INNER JOIN sales_order_item soi ON so.id = soi.order_id " +
            "LEFT JOIN product_cost pc ON soi.product_code = pc.product_code " +
            "WHERE DATE(so.order_date) BETWEEN #{startDate} AND #{endDate}")
    SalesSummaryReport getSalesProfitSummary(@Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);

    // 按业务员汇总
    @Select("SELECT " +
            "so.salesperson as group_key, so.salesperson as group_name, " +
            "COUNT(DISTINCT so.id) as order_count, " +
            "COALESCE(SUM(so.total_amount), 0) as total_amount, " +
            "COALESCE(SUM(soi.quantity), 0) as total_quantity, " +
            "COALESCE(SUM(pc.unit_cost * soi.quantity), 0) as total_cost, " +
            "COALESCE(SUM(so.total_amount) - SUM(pc.unit_cost * soi.quantity), 0) as gross_profit, " +
            "CASE WHEN SUM(so.total_amount) > 0 THEN ROUND((SUM(so.total_amount) - SUM(pc.unit_cost * soi.quantity)) / SUM(so.total_amount) * 100, 2) ELSE 0 END as profit_rate, " +
            "CASE WHEN COUNT(DISTINCT so.id) > 0 THEN ROUND(SUM(so.total_amount) / COUNT(DISTINCT so.id), 2) ELSE 0 END as avg_order_amount " +
            "FROM sales_order so " +
            "INNER JOIN sales_order_item soi ON so.id = soi.order_id " +
            "LEFT JOIN product_cost pc ON soi.product_code = pc.product_code " +
            "WHERE DATE(so.order_date) BETWEEN #{startDate} AND #{endDate} " +
            "GROUP BY so.salesperson " +
            "ORDER BY total_amount DESC")
    List<SalesSummaryReport> getSalesSummaryBySalesperson(@Param("startDate") LocalDate startDate, 
                                                         @Param("endDate") LocalDate endDate);

    // 按客户汇总
    @Select("SELECT " +
            "so.customer_name as group_key, so.customer_name as group_name, " +
            "COUNT(DISTINCT so.id) as order_count, " +
            "COALESCE(SUM(so.total_amount), 0) as total_amount, " +
            "COALESCE(SUM(soi.quantity), 0) as total_quantity, " +
            "COALESCE(SUM(pc.unit_cost * soi.quantity), 0) as total_cost, " +
            "COALESCE(SUM(so.total_amount) - SUM(pc.unit_cost * soi.quantity), 0) as gross_profit, " +
            "CASE WHEN SUM(so.total_amount) > 0 THEN ROUND((SUM(so.total_amount) - SUM(pc.unit_cost * soi.quantity)) / SUM(so.total_amount) * 100, 2) ELSE 0 END as profit_rate, " +
            "CASE WHEN COUNT(DISTINCT so.id) > 0 THEN ROUND(SUM(so.total_amount) / COUNT(DISTINCT so.id), 2) ELSE 0 END as avg_order_amount " +
            "FROM sales_order so " +
            "INNER JOIN sales_order_item soi ON so.id = soi.order_id " +
            "LEFT JOIN product_cost pc ON soi.product_code = pc.product_code " +
            "WHERE DATE(so.order_date) BETWEEN #{startDate} AND #{endDate} " +
            "GROUP BY so.customer_name " +
            "ORDER BY total_amount DESC")
    List<SalesSummaryReport> getSalesSummaryByCustomer(@Param("startDate") LocalDate startDate, 
                                                      @Param("endDate") LocalDate endDate);

    // 按物料汇总
    @Select("SELECT " +
            "soi.product_code as group_key, " +
            "CONCAT(soi.product_name, '(', COALESCE(soi.product_code, ''), ')') as group_name, " +
            "COUNT(DISTINCT so.id) as order_count, " +
            "COALESCE(SUM(soi.amount), 0) as total_amount, " +
            "COALESCE(SUM(soi.quantity), 0) as total_quantity, " +
            "COALESCE(SUM(pc.unit_cost * soi.quantity), 0) as total_cost, " +
            "COALESCE(SUM(soi.amount) - SUM(pc.unit_cost * soi.quantity), 0) as gross_profit, " +
            "CASE WHEN SUM(soi.amount) > 0 THEN ROUND((SUM(soi.amount) - SUM(pc.unit_cost * soi.quantity)) / SUM(soi.amount) * 100, 2) ELSE 0 END as profit_rate, " +
            "CASE WHEN COUNT(DISTINCT so.id) > 0 THEN ROUND(SUM(soi.amount) / COUNT(DISTINCT so.id), 2) ELSE 0 END as avg_order_amount " +
            "FROM sales_order so " +
            "INNER JOIN sales_order_item soi ON so.id = soi.order_id " +
            "LEFT JOIN product_cost pc ON soi.product_code = pc.product_code " +
            "WHERE DATE(so.order_date) BETWEEN #{startDate} AND #{endDate} " +
            "GROUP BY soi.product_code, soi.product_name " +
            "ORDER BY total_amount DESC")
    List<SalesSummaryReport> getSalesSummaryByProduct(@Param("startDate") LocalDate startDate, 
                                                     @Param("endDate") LocalDate endDate);
}