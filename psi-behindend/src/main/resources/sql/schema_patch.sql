-- PSI incremental schema patch.
-- Run this on an existing database after pulling newer backend code.

CREATE TABLE IF NOT EXISTS sales_receivable (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receivable_no VARCHAR(50) NOT NULL UNIQUE COMMENT '应收款单号',
    customer_name VARCHAR(200) NOT NULL COMMENT '客户名称',
    sales_order_id BIGINT COMMENT '关联销售订单ID',
    receivable_type VARCHAR(20) DEFAULT 'NORMAL' COMMENT '应收类型：NORMAL(正常), RED_LETTER(红字)',
    total_amount DECIMAL(15,2) NOT NULL COMMENT '应收总金额',
    received_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '已收金额',
    unreceived_amount DECIMAL(15,2) NOT NULL COMMENT '未收金额',
    due_date DATE COMMENT '到期日期',
    status VARCHAR(20) DEFAULT 'UNRECEIVED' COMMENT '状态：UNRECEIVED(未收), PARTIAL_RECEIVED(部分已收), RECEIVED(已收)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_sales_receivable_order (sales_order_id),
    INDEX idx_customer_name (customer_name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售应收款表';
