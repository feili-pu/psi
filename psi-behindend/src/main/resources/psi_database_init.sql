-- ========================================
-- PSI管理系统数据库初始化脚本
-- 版本: 1.0
-- 创建日期: 2024-12-29
-- 说明: 包含所有表结构、索引、初始数据的完整初始化脚本
-- ========================================

-- 设置字符集和时区
SET NAMES utf8mb4;
SET time_zone = '+08:00';

-- ========================================
-- 0. 清理原有数据库（如果存在）
-- ========================================

-- 禁用外键检查
SET FOREIGN_KEY_CHECKS = 0;

-- 删除所有表（按依赖关系逆序删除）
DROP TABLE IF EXISTS serial_number_check_item;
DROP TABLE IF EXISTS serial_number_check;
DROP TABLE IF EXISTS serial_number_transaction;
DROP TABLE IF EXISTS serial_number_inventory;
DROP TABLE IF EXISTS serial_number_receipt_item;
DROP TABLE IF EXISTS serial_number_receipt;
DROP TABLE IF EXISTS inventory_check_item;
DROP TABLE IF EXISTS inventory_check;
DROP TABLE IF EXISTS purchase_payable;
DROP TABLE IF EXISTS sales_receivable;
DROP TABLE IF EXISTS inventory_receipt_item;
DROP TABLE IF EXISTS inventory_receipt;
DROP TABLE IF EXISTS inventory_transaction;
DROP TABLE IF EXISTS product_disassembly;
DROP TABLE IF EXISTS product_assembly;
DROP TABLE IF EXISTS product_receipt_item;
DROP TABLE IF EXISTS product_receipt;
DROP TABLE IF EXISTS material_return_item;
DROP TABLE IF EXISTS material_return;
DROP TABLE IF EXISTS material_requisition_item;
DROP TABLE IF EXISTS material_requisition;
DROP TABLE IF EXISTS bom_item;
DROP TABLE IF EXISTS bom;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS warehouse;
DROP TABLE IF EXISTS purchase_order_item;
DROP TABLE IF EXISTS purchase_order;
DROP TABLE IF EXISTS purchase_comparison;
DROP TABLE IF EXISTS supplier_quotation_item;
DROP TABLE IF EXISTS supplier_quotation;
DROP TABLE IF EXISTS purchase_inquiry_item;
-- 删除 RBAC 相关表
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS sys_role;
DROP TABLE IF EXISTS purchase_inquiry;
DROP TABLE IF EXISTS purchase_request_item;
DROP TABLE IF EXISTS purchase_request;
DROP TABLE IF EXISTS supplier;
DROP TABLE IF EXISTS sales_order_item;
DROP TABLE IF EXISTS sales_order;
DROP TABLE IF EXISTS sales_quotation_item;
DROP TABLE IF EXISTS sales_quotation;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS product_cost;
DROP TABLE IF EXISTS users;

-- 重新启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- 1. 用户权限管理模块
-- ========================================

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    real_name VARCHAR(100) NOT NULL COMMENT '真实姓名',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    department VARCHAR(50) COMMENT '部门',
    position VARCHAR(50) COMMENT '职位',
    status TINYINT DEFAULT 1 COMMENT '状态：1启用，0禁用',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 创建角色表（包含新增字段）
CREATE TABLE IF NOT EXISTS sys_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
    role_code VARCHAR(50) UNIQUE NOT NULL COMMENT '角色编码',
    role_name VARCHAR(100) NOT NULL COMMENT '角色名称',
    description VARCHAR(200) COMMENT '角色描述',
    level VARCHAR(20) DEFAULT 'STAFF' COMMENT '角色层级：SUPER, EXECUTIVE, DIRECTOR, MANAGER, SUPERVISOR, SPECIALIST, STAFF',
    department VARCHAR(50) COMMENT '所属部门',
    status TINYINT DEFAULT 1 COMMENT '状态：1启用，0禁用',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 创建权限表
CREATE TABLE permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '权限ID',
    permission_code VARCHAR(100) NOT NULL UNIQUE COMMENT '权限编码',
    permission_name VARCHAR(100) NOT NULL COMMENT '权限名称',
    resource_type VARCHAR(20) NOT NULL DEFAULT 'API' COMMENT '资源类型：API接口, MENU菜单, BUTTON按钮',
    resource_url VARCHAR(200) COMMENT '资源路径',
    http_method VARCHAR(10) COMMENT 'HTTP方法：GET, POST, PUT, DELETE',
    description VARCHAR(500) COMMENT '权限描述',
    parent_id BIGINT COMMENT '父权限ID',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态：1启用，0禁用',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_permission_code (permission_code),
    INDEX idx_resource_type (resource_type),
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 创建角色权限关联表
CREATE TABLE IF NOT EXISTS role_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '关联ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    permission_id BIGINT NOT NULL COMMENT '权限ID',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_role_permission (role_id, permission_id),
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id),
    FOREIGN KEY (role_id) REFERENCES sys_role(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

-- 创建用户角色关联表
CREATE TABLE IF NOT EXISTS user_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '关联ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES sys_role(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- ========================================
-- 2. 销售管理模块
-- ========================================

-- 销售报价单主表
CREATE TABLE IF NOT EXISTS sales_quotation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    quotation_no VARCHAR(50) NOT NULL UNIQUE COMMENT '报价单号',
    customer_name VARCHAR(200) NOT NULL COMMENT '客户名称',
    customer_contact VARCHAR(200) COMMENT '客户联系方式',
    salesperson VARCHAR(100) NOT NULL COMMENT '销售员',
    quotation_date DATETIME NOT NULL COMMENT '报价日期',
    valid_until DATETIME NOT NULL COMMENT '有效期至',
    total_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '总金额',
    include_tax BOOLEAN DEFAULT FALSE COMMENT '是否含税',
    tax_rate DECIMAL(5,4) DEFAULT 0.0000 COMMENT '税率',
    status VARCHAR(20) DEFAULT 'DRAFT' COMMENT '状态：DRAFT草稿,SENT已发送,ACCEPTED已接受,REJECTED已拒绝,EXPIRED已过期',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_customer_name (customer_name),
    INDEX idx_salesperson (salesperson),
    INDEX idx_status (status),
    INDEX idx_quotation_date (quotation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售报价单主表';

-- 销售报价单明细表
CREATE TABLE IF NOT EXISTS sales_quotation_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    quotation_id BIGINT NOT NULL COMMENT '报价单ID',
    product_name VARCHAR(200) NOT NULL COMMENT '产品名称',
    product_code VARCHAR(100) COMMENT '产品编码',
    specification VARCHAR(500) COMMENT '规格型号',
    unit VARCHAR(20) COMMENT '单位',
    quantity DECIMAL(15,4) NOT NULL COMMENT '数量',
    unit_price DECIMAL(15,4) NOT NULL COMMENT '单价',
    amount DECIMAL(15,2) NOT NULL COMMENT '金额',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (quotation_id) REFERENCES sales_quotation(id) ON DELETE CASCADE,
    INDEX idx_quotation_id (quotation_id),
    INDEX idx_product_name (product_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售报价单明细表';

-- 销售订单主表
CREATE TABLE IF NOT EXISTS sales_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
    quotation_id BIGINT COMMENT '关联的报价单ID',
    customer_name VARCHAR(200) NOT NULL COMMENT '客户名称',
    customer_contact VARCHAR(200) COMMENT '客户联系方式',
    salesperson VARCHAR(100) NOT NULL COMMENT '销售员',
    order_date DATETIME NOT NULL COMMENT '订单日期',
    delivery_date DATE COMMENT '要求交货日期',
    total_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '订单总金额',
    include_tax BOOLEAN DEFAULT FALSE COMMENT '是否含税',
    tax_rate DECIMAL(5,4) DEFAULT 0.0000 COMMENT '税率',
    payment_terms VARCHAR(200) COMMENT '付款条件',
    delivery_address TEXT COMMENT '交货地址',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING待确认,CONFIRMED已确认,PRODUCING生产中,SHIPPED已发货,DELIVERED已交付,COMPLETED已完成,CANCELLED已取消',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_customer_name (customer_name),
    INDEX idx_salesperson (salesperson),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date),
    INDEX idx_quotation_id (quotation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售订单主表';
-- 销售订单明细表
CREATE TABLE IF NOT EXISTS sales_order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    product_name VARCHAR(200) NOT NULL COMMENT '产品名称',
    product_code VARCHAR(100) COMMENT '产品编码',
    specification VARCHAR(500) COMMENT '规格型号',
    unit VARCHAR(20) COMMENT '单位',
    quantity DECIMAL(15,4) NOT NULL COMMENT '订单数量',
    unit_price DECIMAL(15,4) NOT NULL COMMENT '单价',
    amount DECIMAL(15,2) NOT NULL COMMENT '金额',
    delivered_qty DECIMAL(15,4) DEFAULT 0.0000 COMMENT '已交货数量',
    remaining_qty DECIMAL(15,4) NOT NULL COMMENT '剩余数量',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (order_id) REFERENCES sales_order(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_name (product_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售订单明细表';

-- 销售应收款表
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
    INDEX idx_status (status),
    FOREIGN KEY (sales_order_id) REFERENCES sales_order(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售应收款表';

-- ========================================
-- 3. 采购管理模块
-- ========================================

-- 采购申请表
CREATE TABLE IF NOT EXISTS purchase_request (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_no VARCHAR(50) NOT NULL UNIQUE COMMENT '申请单号',
    department VARCHAR(100) NOT NULL COMMENT '申请部门',
    applicant VARCHAR(50) NOT NULL COMMENT '申请人',
    request_date DATETIME NOT NULL COMMENT '申请日期',
    required_date DATE COMMENT '需求日期',
    total_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '申请总金额',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(待审批), APPROVED(已审批), REJECTED(已拒绝), CANCELLED(已取消)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 采购申请明细表
CREATE TABLE IF NOT EXISTS purchase_request_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL COMMENT '申请单ID',
    product_name VARCHAR(100) NOT NULL COMMENT '产品名称',
    product_code VARCHAR(50) COMMENT '产品编码',
    specification VARCHAR(200) COMMENT '规格型号',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    quantity DECIMAL(10,2) NOT NULL COMMENT '申请数量',
    estimated_price DECIMAL(10,2) COMMENT '预估单价',
    amount DECIMAL(15,2) COMMENT '预估金额',
    purpose VARCHAR(200) COMMENT '用途说明',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (request_id) REFERENCES purchase_request(id) ON DELETE CASCADE
);

-- 采购询价表
CREATE TABLE IF NOT EXISTS purchase_inquiry (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inquiry_no VARCHAR(50) NOT NULL UNIQUE COMMENT '询价单号',
    request_id BIGINT COMMENT '关联申请单ID',
    title VARCHAR(200) NOT NULL COMMENT '询价标题',
    inquirer VARCHAR(50) NOT NULL COMMENT '询价人',
    inquiry_date DATETIME NOT NULL COMMENT '询价日期',
    deadline_date DATE COMMENT '报价截止日期',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE(询价中), COMPLETED(已完成), CANCELLED(已取消)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES purchase_request(id)
);
-- 采购询价明细表
CREATE TABLE IF NOT EXISTS purchase_inquiry_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inquiry_id BIGINT NOT NULL COMMENT '询价单ID',
    product_name VARCHAR(100) NOT NULL COMMENT '产品名称',
    product_code VARCHAR(50) COMMENT '产品编码',
    specification VARCHAR(200) COMMENT '规格型号',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    quantity DECIMAL(10,2) NOT NULL COMMENT '询价数量',
    technical_requirements TEXT COMMENT '技术要求',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (inquiry_id) REFERENCES purchase_inquiry(id) ON DELETE CASCADE
);

-- 供应商表
CREATE TABLE IF NOT EXISTS supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_code VARCHAR(50) NOT NULL UNIQUE COMMENT '供应商编码',
    supplier_name VARCHAR(100) NOT NULL COMMENT '供应商名称',
    contact_person VARCHAR(50) COMMENT '联系人',
    phone VARCHAR(20) COMMENT '电话',
    email VARCHAR(100) COMMENT '邮箱',
    address VARCHAR(200) COMMENT '地址',
    payment_terms VARCHAR(100) COMMENT '付款条件',
    credit_limit DECIMAL(15,2) DEFAULT 0.00 COMMENT '信用额度',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE(启用), INACTIVE(停用)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 供应商报价表
CREATE TABLE IF NOT EXISTS supplier_quotation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quotation_no VARCHAR(50) NOT NULL UNIQUE COMMENT '报价单号',
    inquiry_id BIGINT NOT NULL COMMENT '询价单ID',
    supplier_name VARCHAR(100) NOT NULL COMMENT '供应商名称',
    supplier_contact VARCHAR(100) COMMENT '供应商联系方式',
    quotation_date DATETIME NOT NULL COMMENT '报价日期',
    valid_until DATE COMMENT '报价有效期',
    total_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '报价总金额',
    include_tax BOOLEAN DEFAULT FALSE COMMENT '是否含税',
    tax_rate DECIMAL(5,2) COMMENT '税率',
    payment_terms VARCHAR(200) COMMENT '付款条件',
    delivery_terms VARCHAR(200) COMMENT '交货条件',
    status VARCHAR(20) DEFAULT 'SUBMITTED' COMMENT '状态：SUBMITTED(已提交), SELECTED(已选中), REJECTED(已拒绝)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inquiry_id) REFERENCES purchase_inquiry(id)
);

-- 供应商报价明细表
CREATE TABLE IF NOT EXISTS supplier_quotation_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quotation_id BIGINT NOT NULL COMMENT '报价单ID',
    inquiry_item_id BIGINT NOT NULL COMMENT '询价明细ID',
    product_name VARCHAR(100) NOT NULL COMMENT '产品名称',
    product_code VARCHAR(50) COMMENT '产品编码',
    specification VARCHAR(200) COMMENT '规格型号',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    quantity DECIMAL(10,2) NOT NULL COMMENT '报价数量',
    unit_price DECIMAL(10,2) NOT NULL COMMENT '单价',
    amount DECIMAL(15,2) NOT NULL COMMENT '金额',
    delivery_period VARCHAR(50) COMMENT '交货期',
    brand VARCHAR(50) COMMENT '品牌',
    origin VARCHAR(50) COMMENT '产地',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (quotation_id) REFERENCES supplier_quotation(id) ON DELETE CASCADE,
    FOREIGN KEY (inquiry_item_id) REFERENCES purchase_inquiry_item(id)
);
-- 采购比价表
CREATE TABLE IF NOT EXISTS purchase_comparison (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    comparison_no VARCHAR(50) NOT NULL UNIQUE COMMENT '比价单号',
    inquiry_id BIGINT NOT NULL COMMENT '询价单ID',
    title VARCHAR(200) NOT NULL COMMENT '比价标题',
    comparer VARCHAR(50) NOT NULL COMMENT '比价人',
    comparison_date DATETIME NOT NULL COMMENT '比价日期',
    selected_quotation_id BIGINT COMMENT '选中的报价单ID',
    selection_reason TEXT COMMENT '选择理由',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(待比价), COMPLETED(已完成), CANCELLED(已取消)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inquiry_id) REFERENCES purchase_inquiry(id),
    FOREIGN KEY (selected_quotation_id) REFERENCES supplier_quotation(id)
);

-- 采购订单表
CREATE TABLE IF NOT EXISTS purchase_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '采购订单号',
    quotation_id BIGINT COMMENT '关联报价单ID',
    supplier_name VARCHAR(100) NOT NULL COMMENT '供应商名称',
    supplier_contact VARCHAR(100) COMMENT '供应商联系方式',
    purchaser VARCHAR(50) NOT NULL COMMENT '采购员',
    order_date DATETIME NOT NULL COMMENT '订单日期',
    delivery_date DATE COMMENT '要求交货日期',
    total_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '订单总金额',
    include_tax BOOLEAN DEFAULT FALSE COMMENT '是否含税',
    tax_rate DECIMAL(5,2) COMMENT '税率',
    payment_terms VARCHAR(200) COMMENT '付款条件',
    delivery_address VARCHAR(500) COMMENT '交货地址',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(待确认), CONFIRMED(已确认), PRODUCING(生产中), SHIPPED(已发货), RECEIVED(已收货), COMPLETED(已完成), CANCELLED(已取消)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quotation_id) REFERENCES supplier_quotation(id)
);

-- 采购订单明细表
CREATE TABLE IF NOT EXISTS purchase_order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL COMMENT '采购订单ID',
    product_name VARCHAR(100) NOT NULL COMMENT '产品名称',
    product_code VARCHAR(50) COMMENT '产品编码',
    specification VARCHAR(200) COMMENT '规格型号',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    quantity DECIMAL(10,2) NOT NULL COMMENT '订购数量',
    unit_price DECIMAL(10,2) NOT NULL COMMENT '单价',
    amount DECIMAL(15,2) NOT NULL COMMENT '金额',
    received_qty DECIMAL(10,2) DEFAULT 0.00 COMMENT '已收货数量',
    remaining_qty DECIMAL(10,2) NOT NULL COMMENT '剩余数量',
    delivery_period VARCHAR(50) COMMENT '交货期',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (order_id) REFERENCES purchase_order(id) ON DELETE CASCADE
);
-- ========================================
-- 4. 库存管理模块
-- ========================================

-- 仓库表
CREATE TABLE IF NOT EXISTS warehouse (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL UNIQUE COMMENT '仓库编码',
    warehouse_name VARCHAR(100) NOT NULL COMMENT '仓库名称',
    warehouse_type VARCHAR(20) DEFAULT 'NORMAL' COMMENT '仓库类型：NORMAL(普通), RAW_MATERIAL(原料), FINISHED_GOODS(成品), WIP(在制品)',
    location VARCHAR(200) COMMENT '仓库位置',
    manager VARCHAR(50) COMMENT '仓库管理员',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE(启用), INACTIVE(停用)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 产品/物料主数据表
CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(50) NOT NULL UNIQUE COMMENT '产品编码',
    product_name VARCHAR(100) NOT NULL COMMENT '产品名称',
    product_type VARCHAR(20) DEFAULT 'MATERIAL' COMMENT '产品类型：MATERIAL(原料), SEMI_FINISHED(半成品), FINISHED(成品)',
    specification VARCHAR(200) COMMENT '规格型号',
    unit VARCHAR(20) NOT NULL COMMENT '基本单位',
    category VARCHAR(50) COMMENT '产品分类',
    brand VARCHAR(50) COMMENT '品牌',
    model VARCHAR(50) COMMENT '型号',
    standard_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT '标准成本',
    selling_price DECIMAL(10,2) DEFAULT 0.00 COMMENT '销售价格',
    safety_stock DECIMAL(10,2) DEFAULT 0.00 COMMENT '安全库存',
    min_stock DECIMAL(10,2) DEFAULT 0.00 COMMENT '最小库存',
    max_stock DECIMAL(10,2) DEFAULT 0.00 COMMENT '最大库存',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE(启用), INACTIVE(停用)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- BOM物料清单表
CREATE TABLE IF NOT EXISTS bom (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bom_code VARCHAR(50) NOT NULL UNIQUE COMMENT 'BOM编码',
    product_id BIGINT NOT NULL COMMENT '成品ID',
    bom_version VARCHAR(20) DEFAULT '1.0' COMMENT 'BOM版本',
    bom_name VARCHAR(100) NOT NULL COMMENT 'BOM名称',
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00 COMMENT '成品数量',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE(启用), INACTIVE(停用)',
    effective_date DATE COMMENT '生效日期',
    expiry_date DATE COMMENT '失效日期',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- BOM明细表
CREATE TABLE IF NOT EXISTS bom_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bom_id BIGINT NOT NULL COMMENT 'BOM ID',
    material_id BIGINT NOT NULL COMMENT '物料ID',
    quantity DECIMAL(10,2) NOT NULL COMMENT '用量',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    loss_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT '损耗率(%)',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (bom_id) REFERENCES bom(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES product(id)
);
-- 库存表
CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    warehouse_id BIGINT NOT NULL COMMENT '仓库ID',
    product_id BIGINT NOT NULL COMMENT '产品ID',
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '库存数量',
    available_quantity DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '可用数量',
    reserved_quantity DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '预留数量',
    unit_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT '单位成本',
    total_cost DECIMAL(15,2) DEFAULT 0.00 COMMENT '总成本',
    last_in_date DATETIME COMMENT '最后入库日期',
    last_out_date DATETIME COMMENT '最后出库日期',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    UNIQUE KEY uk_warehouse_product (warehouse_id, product_id)
);

-- 生产领料单表
CREATE TABLE IF NOT EXISTS material_requisition (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requisition_no VARCHAR(50) NOT NULL UNIQUE COMMENT '领料单号',
    bom_id BIGINT COMMENT '关联BOM ID',
    production_order_no VARCHAR(50) COMMENT '生产订单号',
    department VARCHAR(100) NOT NULL COMMENT '领料部门',
    applicant VARCHAR(50) NOT NULL COMMENT '申请人',
    requisition_date DATETIME NOT NULL COMMENT '领料日期',
    production_quantity DECIMAL(10,2) COMMENT '生产数量',
    warehouse_id BIGINT NOT NULL COMMENT '出库仓库ID',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(待审核), APPROVED(已审核), ISSUED(已发料), CANCELLED(已取消)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bom_id) REFERENCES bom(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
);

-- 生产领料明细表
CREATE TABLE IF NOT EXISTS material_requisition_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requisition_id BIGINT NOT NULL COMMENT '领料单ID',
    product_id BIGINT NOT NULL COMMENT '物料ID',
    required_quantity DECIMAL(10,2) NOT NULL COMMENT '需求数量',
    issued_quantity DECIMAL(10,2) DEFAULT 0.00 COMMENT '已发数量',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    unit_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT '单位成本',
    total_cost DECIMAL(15,2) DEFAULT 0.00 COMMENT '总成本',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (requisition_id) REFERENCES material_requisition(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- 生产退料单表
CREATE TABLE IF NOT EXISTS material_return (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    return_no VARCHAR(50) NOT NULL UNIQUE COMMENT '退料单号',
    requisition_id BIGINT COMMENT '关联领料单ID',
    production_order_no VARCHAR(50) COMMENT '生产订单号',
    department VARCHAR(100) NOT NULL COMMENT '退料部门',
    returner VARCHAR(50) NOT NULL COMMENT '退料人',
    return_date DATETIME NOT NULL COMMENT '退料日期',
    warehouse_id BIGINT NOT NULL COMMENT '入库仓库ID',
    return_reason VARCHAR(200) COMMENT '退料原因',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(待审核), APPROVED(已审核), RETURNED(已退料), CANCELLED(已取消)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requisition_id) REFERENCES material_requisition(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
);
-- 生产退料明细表
CREATE TABLE IF NOT EXISTS material_return_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    return_id BIGINT NOT NULL COMMENT '退料单ID',
    product_id BIGINT NOT NULL COMMENT '物料ID',
    return_quantity DECIMAL(10,2) NOT NULL COMMENT '退料数量',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    unit_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT '单位成本',
    total_cost DECIMAL(15,2) DEFAULT 0.00 COMMENT '总成本',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (return_id) REFERENCES material_return(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- 产品入库单表
CREATE TABLE IF NOT EXISTS product_receipt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_no VARCHAR(50) NOT NULL UNIQUE COMMENT '入库单号',
    production_order_no VARCHAR(50) COMMENT '生产订单号',
    receipt_type VARCHAR(20) DEFAULT 'PRODUCTION' COMMENT '入库类型：PRODUCTION(生产入库), PURCHASE(采购入库), OTHER(其他入库)',
    warehouse_id BIGINT NOT NULL COMMENT '入库仓库ID',
    receipt_date DATETIME NOT NULL COMMENT '入库日期',
    operator VARCHAR(50) NOT NULL COMMENT '操作员',
    total_quantity DECIMAL(10,2) DEFAULT 0.00 COMMENT '总数量',
    total_cost DECIMAL(15,2) DEFAULT 0.00 COMMENT '总成本',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(待审核), APPROVED(已审核), RECEIVED(已入库), CANCELLED(已取消)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
);

-- 产品入库明细表
CREATE TABLE IF NOT EXISTS product_receipt_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_id BIGINT NOT NULL COMMENT '入库单ID',
    product_id BIGINT NOT NULL COMMENT '产品ID',
    quantity DECIMAL(10,2) NOT NULL COMMENT '入库数量',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    unit_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT '单位成本',
    total_cost DECIMAL(15,2) DEFAULT 0.00 COMMENT '总成本',
    batch_no VARCHAR(50) COMMENT '批次号',
    production_date DATE COMMENT '生产日期',
    expiry_date DATE COMMENT '有效期',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (receipt_id) REFERENCES product_receipt(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- 产品组装单表
CREATE TABLE IF NOT EXISTS product_assembly (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assembly_no VARCHAR(50) NOT NULL UNIQUE COMMENT '组装单号',
    bom_id BIGINT NOT NULL COMMENT 'BOM ID',
    assembly_quantity DECIMAL(10,2) NOT NULL COMMENT '组装数量',
    warehouse_id BIGINT NOT NULL COMMENT '仓库ID',
    assembly_date DATETIME NOT NULL COMMENT '组装日期',
    operator VARCHAR(50) NOT NULL COMMENT '操作员',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(待审核), APPROVED(已审核), ASSEMBLED(已组装), CANCELLED(已取消)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bom_id) REFERENCES bom(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
);
-- 产品拆卸单表
CREATE TABLE IF NOT EXISTS product_disassembly (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    disassembly_no VARCHAR(50) NOT NULL UNIQUE COMMENT '拆卸单号',
    bom_id BIGINT NOT NULL COMMENT 'BOM ID',
    disassembly_quantity DECIMAL(10,2) NOT NULL COMMENT '拆卸数量',
    warehouse_id BIGINT NOT NULL COMMENT '仓库ID',
    disassembly_date DATETIME NOT NULL COMMENT '拆卸日期',
    operator VARCHAR(50) NOT NULL COMMENT '操作员',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(待审核), APPROVED(已审核), DISASSEMBLED(已拆卸), CANCELLED(已取消)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bom_id) REFERENCES bom(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
);

-- 库存流水表
CREATE TABLE IF NOT EXISTS inventory_transaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_no VARCHAR(50) NOT NULL COMMENT '流水号',
    warehouse_id BIGINT NOT NULL COMMENT '仓库ID',
    product_id BIGINT NOT NULL COMMENT '产品ID',
    transaction_type VARCHAR(20) NOT NULL COMMENT '交易类型：IN(入库), OUT(出库)',
    business_type VARCHAR(30) NOT NULL COMMENT '业务类型：REQUISITION(领料), RETURN(退料), RECEIPT(入库), ASSEMBLY(组装), DISASSEMBLY(拆卸)',
    reference_id BIGINT COMMENT '关联单据ID',
    reference_no VARCHAR(50) COMMENT '关联单据号',
    quantity DECIMAL(10,2) NOT NULL COMMENT '数量',
    unit_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT '单位成本',
    total_cost DECIMAL(15,2) DEFAULT 0.00 COMMENT '总成本',
    balance_quantity DECIMAL(10,2) NOT NULL COMMENT '结余数量',
    transaction_date DATETIME NOT NULL COMMENT '交易日期',
    operator VARCHAR(50) NOT NULL COMMENT '操作员',
    remarks VARCHAR(500) COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- 库存入库单表（通用入库单）
CREATE TABLE IF NOT EXISTS inventory_receipt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_no VARCHAR(50) NOT NULL UNIQUE COMMENT '入库单号',
    receipt_type VARCHAR(30) NOT NULL COMMENT '入库类型：PURCHASE(采购入库), PURCHASE_RETURN(采购退货出库), INVENTORY_GAIN(盘盈入库), WEIGHT_GAIN(涨吨入库), OTHER(其他入库)',
    warehouse_id BIGINT NOT NULL COMMENT '仓库ID',
    supplier_id BIGINT COMMENT '供应商ID（采购相关）',
    purchase_order_id BIGINT COMMENT '关联采购订单ID',
    receipt_date DATETIME NOT NULL COMMENT '入库日期',
    operator VARCHAR(50) NOT NULL COMMENT '操作员',
    total_quantity DECIMAL(10,2) DEFAULT 0.00 COMMENT '总数量',
    total_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '总金额',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(待审核), APPROVED(已审核), RECEIVED(已入库), CANCELLED(已取消)',
    auto_generate_payable BOOLEAN DEFAULT FALSE COMMENT '是否自动生成应付款',
    payable_generated BOOLEAN DEFAULT FALSE COMMENT '应付款是否已生成',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
);
-- 库存入库明细表
CREATE TABLE IF NOT EXISTS inventory_receipt_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_id BIGINT NOT NULL COMMENT '入库单ID',
    product_id BIGINT NOT NULL COMMENT '产品ID',
    quantity DECIMAL(10,2) NOT NULL COMMENT '入库数量',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    unit_price DECIMAL(10,2) DEFAULT 0.00 COMMENT '单价',
    total_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '总金额',
    batch_no VARCHAR(50) COMMENT '批次号',
    production_date DATE COMMENT '生产日期',
    expiry_date DATE COMMENT '有效期',
    quality_status VARCHAR(20) DEFAULT 'QUALIFIED' COMMENT '质量状态：QUALIFIED(合格), UNQUALIFIED(不合格), PENDING(待检)',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (receipt_id) REFERENCES inventory_receipt(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- 采购应付款表
CREATE TABLE IF NOT EXISTS purchase_payable (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payable_no VARCHAR(50) NOT NULL UNIQUE COMMENT '应付款单号',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    purchase_order_id BIGINT COMMENT '关联采购订单ID',
    receipt_id BIGINT COMMENT '关联入库单ID',
    payable_type VARCHAR(20) DEFAULT 'NORMAL' COMMENT '应付类型：NORMAL(正常), RED_LETTER(红字)',
    total_amount DECIMAL(15,2) NOT NULL COMMENT '应付总金额',
    paid_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '已付金额',
    unpaid_amount DECIMAL(15,2) NOT NULL COMMENT '未付金额',
    due_date DATE COMMENT '到期日期',
    status VARCHAR(20) DEFAULT 'UNPAID' COMMENT '状态：UNPAID(未付), PARTIAL_PAID(部分已付), PAID(已付)',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 盘点单表
CREATE TABLE IF NOT EXISTS inventory_check (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    check_no VARCHAR(50) NOT NULL UNIQUE COMMENT '盘点单号',
    warehouse_id BIGINT NOT NULL COMMENT '仓库ID',
    check_date DATETIME NOT NULL COMMENT '盘点日期',
    check_type VARCHAR(20) DEFAULT 'FULL' COMMENT '盘点类型：FULL(全盘), PARTIAL(部分盘点), CYCLE(循环盘点)',
    checker VARCHAR(50) NOT NULL COMMENT '盘点人',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(盘点中), COMPLETED(已完成), APPROVED(已审核), PROCESSED(已处理)',
    total_gain_quantity DECIMAL(10,2) DEFAULT 0.00 COMMENT '总盘盈数量',
    total_loss_quantity DECIMAL(10,2) DEFAULT 0.00 COMMENT '总盘亏数量',
    total_gain_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '总盘盈金额',
    total_loss_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '总盘亏金额',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
);

-- 盘点明细表
CREATE TABLE IF NOT EXISTS inventory_check_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    check_id BIGINT NOT NULL COMMENT '盘点单ID',
    product_id BIGINT NOT NULL COMMENT '产品ID',
    book_quantity DECIMAL(10,2) NOT NULL COMMENT '账面数量',
    actual_quantity DECIMAL(10,2) NOT NULL COMMENT '实盘数量',
    difference_quantity DECIMAL(10,2) NOT NULL COMMENT '差异数量',
    unit_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT '单位成本',
    difference_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '差异金额',
    difference_type VARCHAR(10) COMMENT '差异类型：GAIN(盘盈), LOSS(盘亏), NORMAL(正常)',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (check_id) REFERENCES inventory_check(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
);
-- 序列号入库单表
CREATE TABLE IF NOT EXISTS serial_number_receipt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_no VARCHAR(50) NOT NULL UNIQUE COMMENT '入库单号',
    receipt_type VARCHAR(30) NOT NULL COMMENT '入库类型：PURCHASE_SN(采购入库SN), PURCHASE_RETURN_SN(采购退货出库SN), INVENTORY_GAIN_SN(盘盈入库SN), OTHER_SN(其他入库SN)',
    warehouse_id BIGINT NOT NULL COMMENT '仓库ID',
    supplier_id BIGINT COMMENT '供应商ID（采购相关）',
    purchase_order_id BIGINT COMMENT '关联采购订单ID',
    receipt_date DATETIME NOT NULL COMMENT '入库日期',
    operator VARCHAR(50) NOT NULL COMMENT '操作员',
    total_quantity INT DEFAULT 0 COMMENT '总数量（序列号个数）',
    total_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '总金额',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(待审核), APPROVED(已审核), RECEIVED(已入库), CANCELLED(已取消)',
    auto_generate_payable BOOLEAN DEFAULT FALSE COMMENT '是否自动生成应付款',
    payable_generated BOOLEAN DEFAULT FALSE COMMENT '应付款是否已生成',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
);

-- 序列号入库明细表
CREATE TABLE IF NOT EXISTS serial_number_receipt_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_id BIGINT NOT NULL COMMENT '入库单ID',
    product_id BIGINT NOT NULL COMMENT '产品ID',
    serial_number VARCHAR(100) NOT NULL COMMENT '序列号',
    unit_price DECIMAL(10,2) DEFAULT 0.00 COMMENT '单价',
    batch_no VARCHAR(50) COMMENT '批次号',
    production_date DATE COMMENT '生产日期',
    expiry_date DATE COMMENT '有效期',
    quality_status VARCHAR(20) DEFAULT 'QUALIFIED' COMMENT '质量状态：QUALIFIED(合格), UNQUALIFIED(不合格), PENDING(待检)',
    location VARCHAR(100) COMMENT '存放位置',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (receipt_id) REFERENCES serial_number_receipt(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id),
    UNIQUE KEY uk_serial_number (serial_number)
);

-- 序列号库存表
CREATE TABLE IF NOT EXISTS serial_number_inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    warehouse_id BIGINT NOT NULL COMMENT '仓库ID',
    product_id BIGINT NOT NULL COMMENT '产品ID',
    serial_number VARCHAR(100) NOT NULL COMMENT '序列号',
    status VARCHAR(20) DEFAULT 'IN_STOCK' COMMENT '状态：IN_STOCK(在库), OUT_STOCK(出库), RESERVED(预留), DAMAGED(损坏)',
    unit_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT '单位成本',
    batch_no VARCHAR(50) COMMENT '批次号',
    production_date DATE COMMENT '生产日期',
    expiry_date DATE COMMENT '有效期',
    location VARCHAR(100) COMMENT '存放位置',
    in_date DATETIME COMMENT '入库日期',
    out_date DATETIME COMMENT '出库日期',
    last_transaction_id BIGINT COMMENT '最后交易ID',
    remarks VARCHAR(500) COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    UNIQUE KEY uk_sn_inventory (serial_number)
);
-- 序列号流水表
CREATE TABLE IF NOT EXISTS serial_number_transaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_no VARCHAR(50) NOT NULL COMMENT '流水号',
    warehouse_id BIGINT NOT NULL COMMENT '仓库ID',
    product_id BIGINT NOT NULL COMMENT '产品ID',
    serial_number VARCHAR(100) NOT NULL COMMENT '序列号',
    transaction_type VARCHAR(20) NOT NULL COMMENT '交易类型：IN(入库), OUT(出库)',
    business_type VARCHAR(30) NOT NULL COMMENT '业务类型：PURCHASE_SN(采购入库), PURCHASE_RETURN_SN(采购退货), INVENTORY_GAIN_SN(盘盈), OTHER_SN(其他)',
    reference_id BIGINT COMMENT '关联单据ID',
    reference_no VARCHAR(50) COMMENT '关联单据号',
    unit_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT '单位成本',
    from_status VARCHAR(20) COMMENT '原状态',
    to_status VARCHAR(20) COMMENT '新状态',
    transaction_date DATETIME NOT NULL COMMENT '交易日期',
    operator VARCHAR(50) NOT NULL COMMENT '操作员',
    remarks VARCHAR(500) COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- 序列号盘点单表
CREATE TABLE IF NOT EXISTS serial_number_check (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    check_no VARCHAR(50) NOT NULL UNIQUE COMMENT '盘点单号',
    warehouse_id BIGINT NOT NULL COMMENT '仓库ID',
    product_id BIGINT COMMENT '产品ID（可选，为空表示全产品盘点）',
    check_date DATETIME NOT NULL COMMENT '盘点日期',
    check_type VARCHAR(20) DEFAULT 'FULL' COMMENT '盘点类型：FULL(全盘), PRODUCT(按产品), BATCH(按批次)',
    checker VARCHAR(50) NOT NULL COMMENT '盘点人',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态：PENDING(盘点中), COMPLETED(已完成), APPROVED(已审核), PROCESSED(已处理)',
    total_book_quantity INT DEFAULT 0 COMMENT '账面总数量',
    total_actual_quantity INT DEFAULT 0 COMMENT '实盘总数量',
    total_gain_quantity INT DEFAULT 0 COMMENT '盘盈数量',
    total_loss_quantity INT DEFAULT 0 COMMENT '盘亏数量',
    total_gain_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '盘盈金额',
    total_loss_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '盘亏金额',
    remarks TEXT COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- 序列号盘点明细表
CREATE TABLE IF NOT EXISTS serial_number_check_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    check_id BIGINT NOT NULL COMMENT '盘点单ID',
    product_id BIGINT NOT NULL COMMENT '产品ID',
    serial_number VARCHAR(100) NOT NULL COMMENT '序列号',
    book_status VARCHAR(20) COMMENT '账面状态',
    actual_status VARCHAR(20) COMMENT '实盘状态',
    difference_type VARCHAR(10) COMMENT '差异类型：GAIN(盘盈), LOSS(盘亏), NORMAL(正常), STATUS_CHANGE(状态变更)',
    unit_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT '单位成本',
    difference_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT '差异金额',
    location VARCHAR(100) COMMENT '实际位置',
    remarks VARCHAR(500) COMMENT '备注',
    FOREIGN KEY (check_id) REFERENCES serial_number_check(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
);
-- ========================================
-- 5. 统计报表模块
-- ========================================

-- 产品成本表（用于毛利润计算）
CREATE TABLE IF NOT EXISTS product_cost (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    product_code VARCHAR(100) NOT NULL UNIQUE COMMENT '产品编码',
    product_name VARCHAR(200) NOT NULL COMMENT '产品名称',
    unit_cost DECIMAL(15,4) NOT NULL COMMENT '成本单价',
    cost_date DATE NOT NULL COMMENT '成本日期',
    remarks VARCHAR(500) COMMENT '备注',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_product_code (product_code),
    INDEX idx_cost_date (cost_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品成本表';

-- 部门表（用于部门统计）
CREATE TABLE IF NOT EXISTS department (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    dept_code VARCHAR(50) NOT NULL UNIQUE COMMENT '部门编码',
    dept_name VARCHAR(100) NOT NULL COMMENT '部门名称',
    manager VARCHAR(100) COMMENT '部门经理',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE活跃,INACTIVE停用',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_dept_code (dept_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 员工表（关联销售员和部门）
CREATE TABLE IF NOT EXISTS employee (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    emp_code VARCHAR(50) NOT NULL UNIQUE COMMENT '员工编号',
    emp_name VARCHAR(100) NOT NULL COMMENT '员工姓名',
    dept_id BIGINT COMMENT '部门ID',
    position VARCHAR(100) COMMENT '职位',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE在职,INACTIVE离职',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (dept_id) REFERENCES department(id),
    INDEX idx_emp_code (emp_code),
    INDEX idx_dept_id (dept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工表';

-- ========================================
-- 6. 创建索引
-- ========================================

-- 采购模块索引
CREATE INDEX idx_purchase_request_status ON purchase_request(status);
CREATE INDEX idx_purchase_inquiry_no ON purchase_inquiry(inquiry_no);
CREATE INDEX idx_supplier_quotation_no ON supplier_quotation(quotation_no);
CREATE INDEX idx_purchase_order_no ON purchase_order(order_no);
CREATE INDEX idx_purchase_order_status ON purchase_order(status);

-- 库存模块索引
CREATE INDEX idx_inventory_warehouse_product ON inventory(warehouse_id, product_id);
CREATE INDEX idx_material_requisition_no ON material_requisition(requisition_no);
CREATE INDEX idx_material_return_no ON material_return(return_no);
CREATE INDEX idx_product_receipt_no ON product_receipt(receipt_no);
CREATE INDEX idx_product_assembly_no ON product_assembly(assembly_no);
CREATE INDEX idx_product_disassembly_no ON product_disassembly(disassembly_no);
CREATE INDEX idx_inventory_transaction_date ON inventory_transaction(transaction_date);
CREATE INDEX idx_inventory_transaction_type ON inventory_transaction(transaction_type, business_type);
CREATE INDEX idx_inventory_receipt_no ON inventory_receipt(receipt_no);
CREATE INDEX idx_inventory_check_no ON inventory_check(check_no);
CREATE INDEX idx_purchase_payable_no ON purchase_payable(payable_no);

-- 序列号模块索引
CREATE INDEX idx_serial_number_receipt_no ON serial_number_receipt(receipt_no);
CREATE INDEX idx_serial_number_check_no ON serial_number_check(check_no);
CREATE INDEX idx_sn_transaction_no ON serial_number_transaction(transaction_no);
CREATE INDEX idx_sn_product_id ON serial_number_receipt_item(product_id);
CREATE INDEX idx_sn_batch_no ON serial_number_receipt_item(batch_no);
CREATE INDEX idx_sn_warehouse_product ON serial_number_inventory(warehouse_id, product_id);
CREATE INDEX idx_sn_status ON serial_number_inventory(status);
CREATE INDEX idx_sn_batch_no_inv ON serial_number_inventory(batch_no);
CREATE INDEX idx_sn_trans_serial ON serial_number_transaction(serial_number);
CREATE INDEX idx_sn_trans_type ON serial_number_transaction(transaction_type, business_type);
CREATE INDEX idx_sn_trans_date ON serial_number_transaction(transaction_date);
CREATE INDEX idx_sn_check_serial ON serial_number_check_item(serial_number);

-- 其他索引
CREATE INDEX idx_receipt_type ON inventory_receipt(receipt_type);
CREATE INDEX idx_receipt_date ON inventory_receipt(receipt_date);
CREATE INDEX idx_supplier_id ON inventory_receipt(supplier_id);
CREATE INDEX idx_purchase_order_id ON inventory_receipt(purchase_order_id);
CREATE INDEX idx_sn_receipt_type ON serial_number_receipt(receipt_type);
CREATE INDEX idx_sn_receipt_date ON serial_number_receipt(receipt_date);
CREATE INDEX idx_sn_supplier_id ON serial_number_receipt(supplier_id);
CREATE INDEX idx_sn_purchase_order_id ON serial_number_receipt(purchase_order_id);
CREATE INDEX idx_payable_type ON purchase_payable(payable_type);
CREATE INDEX idx_payable_status ON purchase_payable(status);
CREATE INDEX idx_due_date ON purchase_payable(due_date);
-- ========================================
-- 7. 初始化数据
-- ========================================

-- 插入默认角色（包含新的角色层级和部门）
INSERT IGNORE INTO sys_role (role_code, role_name, description, level, department) VALUES
('ADMIN', '系统管理员', '拥有系统所有权限', 'SUPER', '信息技术部'),
('SALES_MANAGER', '销售经理', '销售部门管理权限', 'MANAGER', '销售部'),
('SALES_STAFF', '销售员', '销售基础操作权限', 'STAFF', '销售部'),
('PURCHASE_MANAGER', '采购经理', '采购部门管理权限', 'MANAGER', '采购部'),
('PURCHASE_STAFF', '采购员', '采购基础操作权限', 'STAFF', '采购部'),
('WAREHOUSE_MANAGER', '仓库主管', '仓库管理权限', 'SUPERVISOR', '仓储部'),
('WAREHOUSE_STAFF', '仓管员', '仓库基础操作权限', 'STAFF', '仓储部'),
('FINANCE_MANAGER', '财务经理', '财务管理权限', 'MANAGER', '财务部'),
('FINANCE_STAFF', '财务员', '财务基础操作权限', 'STAFF', '财务部');

-- 创建默认用户
INSERT IGNORE INTO users (username, password, real_name, email, department, position) VALUES
('admin', '$2a$10$Z2Rs2AfWn0raWVGuKOL0xOR4EemKuw31jfXY8MW92sAU3PtobSO0W', '系统管理员', 'admin@company.com', 'IT部', '系统管理员'),
('sales_manager', '$2a$10$Z2Rs2AfWn0raWVGuKOL0xOR4EemKuw31jfXY8MW92sAU3PtobSO0W', '张经理', 'zhang@company.com', '销售部', '销售经理'),
('sales_staff', '$2a$10$Z2Rs2AfWn0raWVGuKOL0xOR4EemKuw31jfXY8MW92sAU3PtobSO0W', '李销售', 'li@company.com', '销售部', '销售员'),
('purchase_manager', '$2a$10$Z2Rs2AfWn0raWVGuKOL0xOR4EemKuw31jfXY8MW92sAU3PtobSO0W', '王采购经理', 'wang@company.com', '采购部', '采购经理'),
('warehouse_manager', '$2a$10$Z2Rs2AfWn0raWVGuKOL0xOR4EemKuw31jfXY8MW92sAU3PtobSO0W', '赵仓管', 'zhao@company.com', '仓储部', '仓库主管');

-- 插入测试销售报价数据
INSERT IGNORE INTO sales_quotation (quotation_no, customer_name, customer_contact, salesperson, quotation_date, valid_until, total_amount, include_tax, tax_rate, status, remarks) VALUES 
('QT202412260001', '阿里巴巴集团', '张经理 13800138000', '李销售', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 15000.00, TRUE, 0.13, 'DRAFT', '首次合作，价格优惠'),
('QT202412260002', '腾讯科技', '王总监 13900139000', '王销售', NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), 28000.00, FALSE, 0.13, 'SENT', '老客户，标准价格');

INSERT IGNORE INTO sales_quotation_item (quotation_id, product_name, product_code, specification, unit, quantity, unit_price, amount, remarks) VALUES 
(1, '笔记本电脑', 'NB001', 'ThinkPad X1 Carbon', '台', 10.0000, 8000.0000, 80000.00, '商务办公用'),
(1, '无线鼠标', 'MS001', '罗技MX Master 3', '个', 10.0000, 500.0000, 5000.00, '配套使用'),
(2, '服务器', 'SV001', 'Dell PowerEdge R740', '台', 2.0000, 25000.0000, 50000.00, '数据中心用'),
(2, '交换机', 'SW001', 'Cisco Catalyst 9300', '台', 4.0000, 8000.0000, 32000.00, '网络设备');

-- 插入测试销售订单数据
INSERT IGNORE INTO sales_order (order_no, quotation_id, customer_name, customer_contact, salesperson, order_date, delivery_date, total_amount, include_tax, tax_rate, payment_terms, delivery_address, status, remarks) VALUES 
('SO202412290001', 7, '阿里巴巴集团', '张经理 13800138000', '李销售', NOW(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 112500.00, TRUE, 0.13, '货到付款', '杭州市西湖区文三路969号', 'CONFIRMED', '从报价单转换的订单'),
('SO202412290002', NULL, '字节跳动', '李总监 13700137000', '王销售', NOW(), DATE_ADD(CURDATE(), INTERVAL 45 DAY), 200000.00, FALSE, 0.13, '预付30%，余款月结', '北京市海淀区知春路63号', 'PRODUCING', '直接创建的订单');

INSERT IGNORE INTO sales_order_item (order_id, product_name, product_code, specification, unit, quantity, unit_price, amount, delivered_qty, remaining_qty, remarks) VALUES 
(1, '笔记本电脑', 'NB001', 'ThinkPad X1 Carbon', '台', 15.0000, 7500.0000, 112500.00, 0.0000, 15.0000, '批量采购优惠价'),
(2, '工作站', 'WS001', 'Dell Precision 7000', '台', 10.0000, 15000.0000, 150000.00, 3.0000, 7.0000, '开发用工作站'),
(2, '显示器', 'MN001', 'Dell UltraSharp 27寸', '台', 20.0000, 2500.0000, 50000.00, 5.0000, 15.0000, '双屏配置');

-- 插入测试采购订单数据
INSERT IGNORE INTO purchase_order (order_no, supplier_name, supplier_contact, purchaser, order_date, delivery_date, total_amount, include_tax, tax_rate, payment_terms, delivery_address, status, remarks) VALUES 
('PO202412290001', '联想集团', '张经理 010-12345678', '王采购经理', NOW(), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 180000.00, TRUE, 0.13, '月结30天', '北京市朝阳区办公楼', 'CONFIRMED', '批量采购笔记本电脑'),
('PO202412290002', '戴尔科技', '李经理 021-87654321', '王采购经理', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 320000.00, TRUE, 0.13, '月结45天', '北京市朝阳区办公楼', 'PRODUCING', '服务器设备采购'),
('PO202412290003', '思科网络', '王经理 0755-11111111', '李采购', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 25 DAY), 150000.00, FALSE, 0.13, '月结60天', '北京市朝阳区办公楼', 'SHIPPED', '网络设备采购'),
('PO202412290004', '罗技科技', '赵经理 0571-22222222', '李采购', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 45000.00, TRUE, 0.13, '现金', '北京市朝阳区办公楼', 'COMPLETED', '外设设备采购'),
('PO202412290005', '联想集团', '张经理 010-12345678', '王采购经理', DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 240000.00, TRUE, 0.13, '月结30天', '北京市朝阳区办公楼', 'COMPLETED', '工作站采购'),
('PO202412290006', '戴尔科技', '李经理 021-87654321', '张采购', DATE_SUB(NOW(), INTERVAL 25 DAY), CURDATE(), 120000.00, TRUE, 0.13, '月结45天', '北京市朝阳区办公楼', 'RECEIVED', '显示器采购');

INSERT IGNORE INTO purchase_order_item (order_id, product_name, product_code, specification, unit, quantity, unit_price, amount, received_qty, remaining_qty, delivery_period, remarks) VALUES 
-- PO202412290001 的明细
(1, '笔记本电脑', 'NB001', 'ThinkPad X1 Carbon', '台', 20.0000, 9000.0000, 180000.00, 0.0000, 20.0000, '15天', '商务笔记本批量采购'),
-- PO202412290002 的明细
(2, '服务器', 'SV001', 'Dell PowerEdge R740', '台', 8.0000, 40000.0000, 320000.00, 0.0000, 8.0000, '20天', '数据中心服务器'),
-- PO202412290003 的明细
(3, '交换机', 'SW001', 'Cisco Catalyst 9300', '台', 15.0000, 10000.0000, 150000.00, 12.0000, 3.0000, '25天', '企业级交换机'),
-- PO202412290004 的明细
(4, '无线鼠标', 'MS001', '罗技MX Master 3', '个', 90.0000, 500.0000, 45000.00, 90.0000, 0.0000, '10天', '办公外设'),
-- PO202412290005 的明细
(5, '工作站', 'WS001', 'Dell Precision 7000', '台', 12.0000, 20000.0000, 240000.00, 12.0000, 0.0000, '5天', '开发工作站'),
-- PO202412290006 的明细
(6, '显示器', 'MN001', 'Dell UltraSharp 27寸', '台', 40.0000, 3000.0000, 120000.00, 35.0000, 5.0000, '当天', '专业显示器');
-- 插入更多历史采购订单数据（用于趋势分析）
INSERT IGNORE INTO purchase_order (order_no, supplier_name, supplier_contact, purchaser, order_date, delivery_date, total_amount, include_tax, tax_rate, payment_terms, delivery_address, status, remarks) VALUES 
-- 上个月的数据
('PO202411150001', '联想集团', '张经理 010-12345678', '王采购经理', DATE_SUB(NOW(), INTERVAL 45 DAY), DATE_SUB(CURDATE(), INTERVAL 30 DAY), 160000.00, TRUE, 0.13, '月结30天', '北京市朝阳区办公楼', 'COMPLETED', '上月笔记本采购'),
('PO202411200002', '戴尔科技', '李经理 021-87654321', '张采购', DATE_SUB(NOW(), INTERVAL 40 DAY), DATE_SUB(CURDATE(), INTERVAL 25 DAY), 280000.00, TRUE, 0.13, '月结45天', '北京市朝阳区办公楼', 'COMPLETED', '上月服务器采购'),
('PO202411250003', '思科网络', '王经理 0755-11111111', '李采购', DATE_SUB(NOW(), INTERVAL 35 DAY), DATE_SUB(CURDATE(), INTERVAL 20 DAY), 120000.00, FALSE, 0.13, '月结60天', '北京市朝阳区办公楼', 'COMPLETED', '上月网络设备'),
-- 两个月前的数据
('PO202410100001', '联想集团', '张经理 010-12345678', '王采购经理', DATE_SUB(NOW(), INTERVAL 75 DAY), DATE_SUB(CURDATE(), INTERVAL 60 DAY), 200000.00, TRUE, 0.13, '月结30天', '北京市朝阳区办公楼', 'COMPLETED', '两月前采购'),
('PO202410150002', '戴尔科技', '李经理 021-87654321', '张采购', DATE_SUB(NOW(), INTERVAL 70 DAY), DATE_SUB(CURDATE(), INTERVAL 55 DAY), 350000.00, TRUE, 0.13, '月结45天', '北京市朝阳区办公楼', 'COMPLETED', '两月前大批量采购'),
('PO202410200003', '罗技科技', '赵经理 0571-22222222', '李采购', DATE_SUB(NOW(), INTERVAL 65 DAY), DATE_SUB(CURDATE(), INTERVAL 50 DAY), 80000.00, TRUE, 0.13, '现金', '北京市朝阳区办公楼', 'COMPLETED', '两月前外设采购');

-- 对应的采购订单明细
INSERT IGNORE INTO purchase_order_item (order_id, product_name, product_code, specification, unit, quantity, unit_price, amount, received_qty, remaining_qty, delivery_period, remarks) VALUES 
-- 上个月订单明细
(7, '笔记本电脑', 'NB001', 'ThinkPad X1 Carbon', '台', 16.0000, 10000.0000, 160000.00, 16.0000, 0.0000, '15天', '上月笔记本'),
(8, '服务器', 'SV001', 'Dell PowerEdge R740', '台', 7.0000, 40000.0000, 280000.00, 7.0000, 0.0000, '20天', '上月服务器'),
(9, '交换机', 'SW001', 'Cisco Catalyst 9300', '台', 12.0000, 10000.0000, 120000.00, 12.0000, 0.0000, '25天', '上月交换机'),
-- 两个月前订单明细
(10, '笔记本电脑', 'NB001', 'ThinkPad X1 Carbon', '台', 20.0000, 10000.0000, 200000.00, 20.0000, 0.0000, '15天', '两月前笔记本'),
(11, '服务器', 'SV002', 'HP ProLiant DL380', '台', 10.0000, 35000.0000, 350000.00, 10.0000, 0.0000, '20天', '两月前HP服务器'),
(12, '无线鼠标', 'MS001', '罗技MX Master 3', '个', 160.0000, 500.0000, 80000.00, 160.0000, 0.0000, '10天', '两月前外设大批量');
INSERT IGNORE INTO product_cost (product_code, product_name, unit_cost, cost_date, remarks) VALUES 
('NB001', '笔记本电脑', 6000.0000, CURDATE(), 'ThinkPad X1 Carbon成本价'),
('SV001', '服务器', 20000.0000, CURDATE(), 'Dell PowerEdge R740成本价'),
('SV002', '服务器', 18000.0000, CURDATE(), 'HP ProLiant DL380成本价'),
('SW001', '交换机', 6000.0000, CURDATE(), 'Cisco Catalyst 9300成本价'),
('WS001', '工作站', 12000.0000, CURDATE(), 'Dell Precision 7000成本价'),
('MN001', '显示器', 1800.0000, CURDATE(), 'Dell UltraSharp 27寸成本价'),
('MS001', '无线鼠标', 300.0000, CURDATE(), '罗技MX Master 3成本价'),
('ST001', '存储设备', 35000.0000, CURDATE(), 'Dell EMC Unity 300成本价');

-- 插入部门测试数据
INSERT IGNORE INTO department (dept_code, dept_name, manager) VALUES 
('SALES01', '华东销售部', '张经理'),
('SALES02', '华南销售部', '李经理'),
('SALES03', '华北销售部', '王经理'),
('TECH01', '技术支持部', '赵经理'),
('PURCHASE01', '采购部', '王采购经理'),
('WAREHOUSE01', '仓储部', '赵仓管'),
('FINANCE01', '财务部', '钱财务'),
('HR01', '人力资源部', '孙人事'),
('PRODUCTION01', '生产部', '李生产'),
('QUALITY01', '质量部', '周质量');

-- 插入员工测试数据
INSERT IGNORE INTO employee (emp_code, emp_name, dept_id, position) VALUES 
('EMP001', '李销售', 1, '销售经理'),
('EMP002', '王销售', 2, '销售代表'),
('EMP003', '张销售', 3, '销售经理'),
('EMP004', '测试销售', 1, '销售代表'),
('EMP005', '王采购经理', 5, '采购经理'),
('EMP006', '赵仓管', 6, '仓库主管'),
('EMP007', '钱财务', 7, '财务经理'),
('EMP008', '孙人事', 8, '人事经理'),
('EMP009', '李生产', 9, '生产经理'),
('EMP010', '周质量', 10, '质量主管');

-- 插入仓库测试数据
INSERT IGNORE INTO warehouse (warehouse_code, warehouse_name, warehouse_type, location, manager, status, remarks) VALUES
('WH001', '主仓库', 'NORMAL', '北京市朝阳区', '赵仓管', 'ACTIVE', '主要存储仓库'),
('WH002', '原料仓库', 'RAW_MATERIAL', '北京市朝阳区', '李仓管', 'ACTIVE', '原材料专用仓库'),
('WH003', '成品仓库', 'FINISHED_GOODS', '北京市朝阳区', '王仓管', 'ACTIVE', '成品存储仓库'),
('WH004', '在制品仓库', 'WIP', '北京市朝阳区', '张仓管', 'ACTIVE', '在制品临时存储');

-- 插入产品测试数据
INSERT IGNORE INTO product (product_code, product_name, product_type, specification, unit, category, brand, model, standard_cost, selling_price, safety_stock, min_stock, max_stock, status, remarks) VALUES
('NB001', '笔记本电脑', 'FINISHED', 'ThinkPad X1 Carbon', '台', '电脑设备', 'Lenovo', 'X1 Carbon', 6000.00, 8000.00, 10.00, 5.00, 100.00, 'ACTIVE', '商务笔记本'),
('SV001', '服务器', 'FINISHED', 'Dell PowerEdge R740', '台', '服务器设备', 'Dell', 'R740', 20000.00, 25000.00, 2.00, 1.00, 20.00, 'ACTIVE', '机架式服务器'),
('SW001', '交换机', 'FINISHED', 'Cisco Catalyst 9300', '台', '网络设备', 'Cisco', '9300', 6000.00, 8000.00, 5.00, 2.00, 50.00, 'ACTIVE', '企业级交换机'),
('WS001', '工作站', 'FINISHED', 'Dell Precision 7000', '台', '电脑设备', 'Dell', 'Precision 7000', 12000.00, 15000.00, 3.00, 1.00, 30.00, 'ACTIVE', '专业工作站'),
('MN001', '显示器', 'FINISHED', 'Dell UltraSharp 27寸', '台', '显示设备', 'Dell', 'UltraSharp', 1800.00, 2500.00, 20.00, 10.00, 200.00, 'ACTIVE', '专业显示器'),
('MS001', '无线鼠标', 'FINISHED', '罗技MX Master 3', '个', '外设', 'Logitech', 'MX Master 3', 300.00, 500.00, 50.00, 20.00, 500.00, 'ACTIVE', '无线办公鼠标');

-- 插入供应商测试数据
INSERT IGNORE INTO supplier (supplier_code, supplier_name, contact_person, phone, email, address, payment_terms, credit_limit, status, remarks) VALUES
('SUP001', '联想集团', '张经理', '010-12345678', 'zhang@lenovo.com', '北京市海淀区', '月结30天', 1000000.00, 'ACTIVE', '笔记本电脑供应商'),
('SUP002', '戴尔科技', '李经理', '021-87654321', 'li@dell.com', '上海市浦东新区', '月结45天', 2000000.00, 'ACTIVE', '服务器设备供应商'),
('SUP003', '思科网络', '王经理', '0755-11111111', 'wang@cisco.com', '深圳市南山区', '月结60天', 1500000.00, 'ACTIVE', '网络设备供应商'),
('SUP004', '罗技科技', '赵经理', '0571-22222222', 'zhao@logitech.com', '杭州市西湖区', '现金', 500000.00, 'ACTIVE', '外设设备供应商');

-- 插入基础权限数据
INSERT IGNORE INTO permissions (permission_code, permission_name, resource_type, resource_url, http_method, description) VALUES
-- 系统管理权限
('user:read', '查看用户', 'API', '/api/users', 'GET', '查看用户列表和详情'),
('user:create', '创建用户', 'API', '/api/users', 'POST', '创建新用户'),
('user:update', '修改用户', 'API', '/api/users/*', 'PUT', '修改用户信息'),
('user:delete', '删除用户', 'API', '/api/users/*', 'DELETE', '删除用户'),
('user:assign_role', '分配用户角色', 'API', '/api/users/*/roles', 'POST', '为用户分配角色'),
('user:remove_role', '移除用户角色', 'API', '/api/users/*/roles', 'DELETE', '移除用户角色'),

('role:read', '查看角色', 'API', '/api/roles', 'GET', '查看角色列表和详情'),
('role:create', '创建角色', 'API', '/api/roles', 'POST', '创建新角色'),
('role:update', '修改角色', 'API', '/api/roles/*', 'PUT', '修改角色信息'),
('role:delete', '删除角色', 'API', '/api/roles/*', 'DELETE', '删除角色'),
('role:assign_permission', '分配角色权限', 'API', '/api/roles/*/permissions', 'POST', '为角色分配权限'),
('role:remove_permission', '移除角色权限', 'API', '/api/roles/*/permissions', 'DELETE', '移除角色权限'),

('permission:manage', '权限管理', 'API', '/api/permissions', 'ALL', '权限管理模块访问'),
('permission:read', '查看权限', 'API', '/api/permissions', 'GET', '查看权限列表'),
('permission:create', '创建权限', 'API', '/api/permissions', 'POST', '创建新权限'),
('permission:update', '修改权限', 'API', '/api/permissions/*', 'PUT', '修改权限信息'),
('permission:delete', '删除权限', 'API', '/api/permissions/*', 'DELETE', '删除权限'),

-- 销售管理权限
('sales:quotation:read', '查看销售报价', 'API', '/api/quotations', 'GET', '查看销售报价单'),
('sales:quotation:create', '创建销售报价', 'API', '/api/quotations', 'POST', '创建销售报价单'),
('sales:quotation:update', '修改销售报价', 'API', '/api/quotations/*', 'PUT', '修改销售报价单'),
('sales:quotation:delete', '删除销售报价', 'API', '/api/quotations/*', 'DELETE', '删除销售报价单'),
('sales:quotation:send', '发送报价单', 'API', '/api/quotations/*/send', 'POST', '发送报价单给客户'),
('sales:quotation:accept', '接受报价单', 'API', '/api/quotations/*/accept', 'POST', '接受客户报价'),

('sales:order:read', '查看销售订单', 'API', '/api/orders', 'GET', '查看销售订单'),
('sales:order:create', '创建销售订单', 'API', '/api/orders', 'POST', '创建销售订单'),
('sales:order:update', '修改销售订单', 'API', '/api/orders/*', 'PUT', '修改销售订单'),
('sales:order:delete', '删除销售订单', 'API', '/api/orders/*', 'DELETE', '删除销售订单'),

('sales:statistics:read', '查看销售统计', 'API', '/api/statistics', 'GET', '查看销售统计报表'),

-- 采购管理权限
('purchase:request:read', '查看采购申请', 'API', '/api/purchase/requests', 'GET', '查看采购申请单'),
('purchase:request:create', '创建采购申请', 'API', '/api/purchase/requests', 'POST', '创建采购申请单'),
('purchase:request:update', '修改采购申请', 'API', '/api/purchase/requests/*', 'PUT', '修改采购申请单'),
('purchase:request:delete', '删除采购申请', 'API', '/api/purchase/requests/*', 'DELETE', '删除采购申请单'),

('purchase:inquiry:read', '查看采购询价', 'API', '/api/purchase/inquiries', 'GET', '查看采购询价单'),
('purchase:inquiry:create', '创建采购询价', 'API', '/api/purchase/inquiries', 'POST', '创建采购询价单'),
('purchase:inquiry:update', '修改采购询价', 'API', '/api/purchase/inquiries/*', 'PUT', '修改采购询价单'),
('purchase:inquiry:delete', '删除采购询价', 'API', '/api/purchase/inquiries/*', 'DELETE', '删除采购询价单'),

('purchase:quotation:read', '查看供应商报价', 'API', '/api/purchase/quotations', 'GET', '查看供应商报价单'),
('purchase:quotation:create', '创建供应商报价', 'API', '/api/purchase/quotations', 'POST', '创建供应商报价单'),
('purchase:quotation:update', '修改供应商报价', 'API', '/api/purchase/quotations/*', 'PUT', '修改供应商报价单'),
('purchase:quotation:delete', '删除供应商报价', 'API', '/api/purchase/quotations/*', 'DELETE', '删除供应商报价单'),

('purchase:comparison:read', '查看采购比价', 'API', '/api/purchase/comparisons', 'GET', '查看采购比价单'),
('purchase:comparison:create', '创建采购比价', 'API', '/api/purchase/comparisons', 'POST', '创建采购比价单'),

('purchase:order:read', '查看采购订单', 'API', '/api/purchase/orders', 'GET', '查看采购订单'),
('purchase:order:create', '创建采购订单', 'API', '/api/purchase/orders', 'POST', '创建采购订单'),
('purchase:order:update', '修改采购订单', 'API', '/api/purchase/orders/*', 'PUT', '修改采购订单'),
('purchase:order:delete', '删除采购订单', 'API', '/api/purchase/orders/*', 'DELETE', '删除采购订单'),

('purchase:payable:read', '查看采购应付', 'API', '/api/purchase-payables', 'GET', '查看采购应付款'),
('purchase:payable:update', '修改采购应付', 'API', '/api/purchase-payables/*', 'PUT', '修改采购应付款'),

('purchase:statistics:read', '查看采购统计', 'API', '/api/purchase/statistics', 'GET', '查看采购统计报表'),

-- 库存管理权限
('inventory:receipt:read', '查看库存入库', 'API', '/api/inventory-receipts', 'GET', '查看库存入库单'),
('inventory:receipt:create', '创建库存入库', 'API', '/api/inventory-receipts', 'POST', '创建库存入库单'),
('inventory:receipt:update', '修改库存入库', 'API', '/api/inventory-receipts/*', 'PUT', '修改库存入库单'),
('inventory:receipt:delete', '删除库存入库', 'API', '/api/inventory-receipts/*', 'DELETE', '删除库存入库单'),

('inventory:check:view', '查看库存盘点', 'API', '/api/inventory-checks', 'GET', '查看库存盘点单'),
('inventory:check:create', '创建库存盘点', 'API', '/api/inventory-checks', 'POST', '创建库存盘点单'),
('inventory:check:update', '修改库存盘点', 'API', '/api/inventory-checks/*', 'PUT', '修改库存盘点单'),
('inventory:check:delete', '删除库存盘点', 'API', '/api/inventory-checks/*', 'DELETE', '删除库存盘点单'),

('material:requisition:view', '查看物料领用', 'API', '/api/material-requisitions', 'GET', '查看物料领用单'),
('material:requisition:create', '创建物料领用', 'API', '/api/material-requisitions', 'POST', '创建物料领用单'),
('material:requisition:update', '修改物料领用', 'API', '/api/material-requisitions/*', 'PUT', '修改物料领用单'),
('material:requisition:delete', '删除物料领用', 'API', '/api/material-requisitions/*', 'DELETE', '删除物料领用单'),

('material:return:view', '查看物料退库', 'API', '/api/material-returns', 'GET', '查看物料退库单'),
('material:return:create', '创建物料退库', 'API', '/api/material-returns', 'POST', '创建物料退库单'),
('material:return:update', '修改物料退库', 'API', '/api/material-returns/*', 'PUT', '修改物料退库单'),
('material:return:delete', '删除物料退库', 'API', '/api/material-returns/*', 'DELETE', '删除物料退库单'),

('product:receipt:view', '查看产品入库', 'API', '/api/product-receipts', 'GET', '查看产品入库单'),
('product:receipt:create', '创建产品入库', 'API', '/api/product-receipts', 'POST', '创建产品入库单'),
('product:receipt:update', '修改产品入库', 'API', '/api/product-receipts/*', 'PUT', '修改产品入库单'),
('product:receipt:delete', '删除产品入库', 'API', '/api/product-receipts/*', 'DELETE', '删除产品入库单'),

('product:assembly:view', '查看产品组装', 'API', '/api/product-assemblies', 'GET', '查看产品组装单'),
('product:assembly:create', '创建产品组装', 'API', '/api/product-assemblies', 'POST', '创建产品组装单'),
('product:assembly:update', '修改产品组装', 'API', '/api/product-assemblies/*', 'PUT', '修改产品组装单'),
('product:assembly:delete', '删除产品组装', 'API', '/api/product-assemblies/*', 'DELETE', '删除产品组装单'),

('product:disassembly:view', '查看产品拆卸', 'API', '/api/product-disassemblies', 'GET', '查看产品拆卸单'),
('product:disassembly:create', '创建产品拆卸', 'API', '/api/product-disassemblies', 'POST', '创建产品拆卸单'),
('product:disassembly:update', '修改产品拆卸', 'API', '/api/product-disassemblies/*', 'PUT', '修改产品拆卸单'),
('product:disassembly:delete', '删除产品拆卸', 'API', '/api/product-disassemblies/*', 'DELETE', '删除产品拆卸单'),

('serial:inventory:view', '查看序列号库存', 'API', '/api/serial-number-inventory', 'GET', '查看序列号库存'),
('serial:receipt:view', '查看序列号入库', 'API', '/api/serial-number-receipts', 'GET', '查看序列号入库单'),
('serial:receipt:create', '创建序列号入库', 'API', '/api/serial-number-receipts', 'POST', '创建序列号入库单'),
('serial:receipt:update', '修改序列号入库', 'API', '/api/serial-number-receipts/*', 'PUT', '修改序列号入库单'),
('serial:receipt:delete', '删除序列号入库', 'API', '/api/serial-number-receipts/*', 'DELETE', '删除序列号入库单');

-- 为管理员角色分配所有权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM sys_role r, permissions p 
WHERE r.role_code = 'ADMIN';

-- 为销售经理角色分配权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM sys_role r, permissions p 
WHERE r.role_code = 'SALES_MANAGER' 
AND p.permission_code IN (
    'sales:quotation:read', 'sales:quotation:create', 'sales:quotation:update', 'sales:quotation:delete',
    'sales:quotation:send', 'sales:quotation:accept',
    'sales:order:read', 'sales:order:create', 'sales:order:update', 'sales:order:delete',
    'sales:statistics:read'
);

-- 为销售员角色分配权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM sys_role r, permissions p 
WHERE r.role_code = 'SALES_STAFF' 
AND p.permission_code IN (
    'sales:quotation:read', 'sales:quotation:create', 'sales:quotation:update',
    'sales:order:read', 'sales:order:create', 'sales:order:update'
);

-- 为采购经理角色分配权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM sys_role r, permissions p 
WHERE r.role_code = 'PURCHASE_MANAGER' 
AND p.permission_code LIKE 'purchase:%';

-- 为采购员角色分配权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM sys_role r, permissions p 
WHERE r.role_code = 'PURCHASE_STAFF' 
AND p.permission_code IN (
    'purchase:request:read', 'purchase:request:create', 'purchase:request:update',
    'purchase:inquiry:read', 'purchase:inquiry:create',
    'purchase:quotation:read', 'purchase:order:read'
);

-- 为仓库主管角色分配权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM sys_role r, permissions p 
WHERE r.role_code = 'WAREHOUSE_MANAGER' 
AND (p.permission_code LIKE 'inventory:%' 
     OR p.permission_code LIKE 'material:%' 
     OR p.permission_code LIKE 'product:%' 
     OR p.permission_code LIKE 'serial:%');

-- 为仓管员角色分配权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM sys_role r, permissions p 
WHERE r.role_code = 'WAREHOUSE_STAFF' 
AND p.permission_code IN (
    'inventory:receipt:read', 'inventory:receipt:create', 'inventory:receipt:update',
    'inventory:check:view', 'inventory:check:create',
    'material:requisition:view', 'material:return:view',
    'product:receipt:view', 'serial:inventory:view', 'serial:receipt:view'
);

-- 为财务经理角色分配权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM sys_role r, permissions p 
WHERE r.role_code = 'FINANCE_MANAGER' 
AND (p.permission_code LIKE 'purchase:payable:%' 
     OR p.permission_code LIKE 'sales:statistics:%'
     OR p.permission_code LIKE 'purchase:statistics:%');

-- 为财务员角色分配权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM sys_role r, permissions p 
WHERE r.role_code = 'FINANCE_STAFF' 
AND p.permission_code IN (
    'purchase:payable:read', 'purchase:payable:update',
    'sales:statistics:read', 'purchase:statistics:read'
);


-- 为用户分配角色
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, sys_role r 
WHERE u.username = 'admin' AND r.role_code = 'ADMIN';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, sys_role r 
WHERE u.username = 'sales_manager' AND r.role_code = 'SALES_MANAGER';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, sys_role r 
WHERE u.username = 'sales_staff' AND r.role_code = 'SALES_STAFF';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, sys_role r 
WHERE u.username = 'purchase_manager' AND r.role_code = 'PURCHASE_MANAGER';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, sys_role r 
WHERE u.username = 'warehouse_manager' AND r.role_code = 'WAREHOUSE_MANAGER';

-- ========================================
-- 8. 完成初始化
-- ========================================

-- 设置完成标记
SET @init_complete = 1;

-- 输出初始化完成信息
SELECT 'PSI管理系统数据库初始化完成！' as message,
       '包含用户权限、销售、采购、库存、统计等所有模块' as description,
       NOW() as init_time;
