-- PSI demo data normalization.
-- This script is intentionally idempotent: it can run after every application start.

-- 1. Remove duplicated seed detail rows caused by repeated startup initialization.
DELETE i1 FROM sales_quotation_item i1
JOIN sales_quotation_item i2
  ON i1.quotation_id = i2.quotation_id
 AND COALESCE(i1.product_code, i1.product_name) = COALESCE(i2.product_code, i2.product_name)
 AND i1.id > i2.id;

DELETE i1 FROM sales_order_item i1
JOIN sales_order_item i2
  ON i1.order_id = i2.order_id
 AND COALESCE(i1.product_code, i1.product_name) = COALESCE(i2.product_code, i2.product_name)
 AND i1.id > i2.id;

DELETE i1 FROM purchase_order_item i1
JOIN purchase_order_item i2
  ON i1.order_id = i2.order_id
 AND COALESCE(i1.product_code, i1.product_name) = COALESCE(i2.product_code, i2.product_name)
 AND i1.id > i2.id;

-- 2. Backfill blank statuses to the enum values used by the backend.
UPDATE sales_quotation SET status = 'DRAFT' WHERE status IS NULL OR status = '';
UPDATE sales_order SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE purchase_request SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE purchase_inquiry SET status = 'ACTIVE' WHERE status IS NULL OR status = '';
UPDATE supplier_quotation SET status = 'SUBMITTED' WHERE status IS NULL OR status = '';
UPDATE purchase_comparison SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE purchase_order SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE inventory_receipt SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE inventory_check SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE material_requisition SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE material_return SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE product_receipt SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE product_assembly SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE product_disassembly SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE serial_number_receipt SET status = 'PENDING' WHERE status IS NULL OR status = '';
UPDATE purchase_payable SET status = 'UNPAID' WHERE status IS NULL OR status = '';
UPDATE sales_receivable SET status = 'UNRECEIVED' WHERE status IS NULL OR status = '';

-- 3. Recalculate document totals from their detail rows.
UPDATE sales_quotation q
JOIN (
  SELECT quotation_id, SUM(amount) AS total_amount
  FROM sales_quotation_item
  GROUP BY quotation_id
) item_sum ON item_sum.quotation_id = q.id
SET q.total_amount = item_sum.total_amount;

UPDATE sales_order o
JOIN (
  SELECT order_id, SUM(amount) AS total_amount
  FROM sales_order_item
  GROUP BY order_id
) item_sum ON item_sum.order_id = o.id
SET o.total_amount = item_sum.total_amount;

UPDATE purchase_order o
JOIN (
  SELECT order_id, SUM(amount) AS total_amount
  FROM purchase_order_item
  GROUP BY order_id
) item_sum ON item_sum.order_id = o.id
SET o.total_amount = item_sum.total_amount;

-- 4. Fix demo sales order quotation reference by natural document number.
UPDATE sales_order so
JOIN sales_quotation sq ON sq.quotation_no = 'QT202412260001'
SET so.quotation_id = sq.id
WHERE so.order_no = 'SO202412290001';

-- 5. Seed a coherent purchase request -> inquiry -> supplier quotation -> comparison chain.
INSERT INTO purchase_request (request_no, department, applicant, request_date, required_date, total_amount, status, remarks)
SELECT 'PR202412280001', '采购部', '王采购经理', NOW(), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 180000.00, 'APPROVED', '与采购订单 PO202412290001 对应的采购申请'
WHERE NOT EXISTS (SELECT 1 FROM purchase_request WHERE request_no = 'PR202412280001');

INSERT INTO purchase_request_item (request_id, product_name, product_code, specification, unit, quantity, estimated_price, amount, purpose, remarks)
SELECT pr.id, '笔记本电脑', 'NB001', 'ThinkPad X1 Carbon', '台', 20.00, 9000.00, 180000.00, '办公设备补充', '采购申请明细'
FROM purchase_request pr
WHERE pr.request_no = 'PR202412280001'
  AND NOT EXISTS (
    SELECT 1 FROM purchase_request_item i WHERE i.request_id = pr.id AND i.product_code = 'NB001'
  );

INSERT INTO purchase_inquiry (inquiry_no, request_id, title, inquirer, inquiry_date, deadline_date, status, remarks)
SELECT 'PI202412280001', pr.id, '笔记本电脑采购询价', '王采购经理', NOW(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'COMPLETED', '由采购申请生成'
FROM purchase_request pr
WHERE pr.request_no = 'PR202412280001'
  AND NOT EXISTS (SELECT 1 FROM purchase_inquiry WHERE inquiry_no = 'PI202412280001');

INSERT INTO purchase_inquiry_item (inquiry_id, product_name, product_code, specification, unit, quantity, technical_requirements, remarks)
SELECT pi.id, '笔记本电脑', 'NB001', 'ThinkPad X1 Carbon', '台', 20.00, '商务办公配置', '采购询价明细'
FROM purchase_inquiry pi
WHERE pi.inquiry_no = 'PI202412280001'
  AND NOT EXISTS (
    SELECT 1 FROM purchase_inquiry_item i WHERE i.inquiry_id = pi.id AND i.product_code = 'NB001'
  );

INSERT INTO supplier_quotation (quotation_no, inquiry_id, supplier_name, supplier_contact, quotation_date, valid_until, total_amount, include_tax, tax_rate, payment_terms, delivery_terms, status, remarks)
SELECT 'SQ202412280001', pi.id, '联想集团', '张经理 010-12345678', NOW(), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 180000.00, TRUE, 0.13, '月结30天', '15天交付', 'SELECTED', '与采购订单 PO202412290001 对应的供应商报价'
FROM purchase_inquiry pi
WHERE pi.inquiry_no = 'PI202412280001'
  AND NOT EXISTS (SELECT 1 FROM supplier_quotation WHERE quotation_no = 'SQ202412280001');

INSERT INTO supplier_quotation_item (quotation_id, inquiry_item_id, product_name, product_code, specification, unit, quantity, unit_price, amount, delivery_period, brand, origin, remarks)
SELECT sq.id, pii.id, '笔记本电脑', 'NB001', 'ThinkPad X1 Carbon', '台', 20.00, 9000.00, 180000.00, '15天', 'Lenovo', '中国', '供应商报价明细'
FROM supplier_quotation sq
JOIN purchase_inquiry_item pii ON pii.product_code = 'NB001'
JOIN purchase_inquiry pi ON pi.id = pii.inquiry_id AND pi.inquiry_no = 'PI202412280001'
WHERE sq.quotation_no = 'SQ202412280001'
  AND NOT EXISTS (
    SELECT 1 FROM supplier_quotation_item i WHERE i.quotation_id = sq.id AND i.product_code = 'NB001'
  );

INSERT INTO purchase_comparison (comparison_no, inquiry_id, title, comparer, comparison_date, selected_quotation_id, selection_reason, status, remarks)
SELECT 'PC202412280001', pi.id, '笔记本电脑采购比价', '王采购经理', NOW(), sq.id, '价格、交期和服务综合最优', 'COMPLETED', '由询价单生成的比价记录'
FROM purchase_inquiry pi
JOIN supplier_quotation sq ON sq.quotation_no = 'SQ202412280001'
WHERE pi.inquiry_no = 'PI202412280001'
  AND NOT EXISTS (SELECT 1 FROM purchase_comparison WHERE comparison_no = 'PC202412280001');

UPDATE purchase_order po
JOIN supplier_quotation sq ON sq.quotation_no = 'SQ202412280001'
SET po.quotation_id = sq.id
WHERE po.order_no = 'PO202412290001';

-- 6. Seed inventory balances from received purchase quantities minus delivered sales quantities.
INSERT INTO inventory (warehouse_id, product_id, quantity, available_quantity, reserved_quantity, unit_cost, total_cost, last_in_date)
SELECT
  wh.id,
  p.id,
  GREATEST(COALESCE(pur.received_qty, 0) - COALESCE(sale.delivered_qty, 0), 0) AS quantity,
  GREATEST(COALESCE(pur.received_qty, 0) - COALESCE(sale.delivered_qty, 0), 0) AS available_quantity,
  0,
  p.standard_cost,
  GREATEST(COALESCE(pur.received_qty, 0) - COALESCE(sale.delivered_qty, 0), 0) * p.standard_cost,
  NOW()
FROM product p
JOIN warehouse wh ON wh.warehouse_code = 'WH001'
LEFT JOIN (
  SELECT product_code, SUM(received_qty) AS received_qty
  FROM purchase_order_item
  GROUP BY product_code
) pur ON pur.product_code = p.product_code
LEFT JOIN (
  SELECT product_code, SUM(delivered_qty) AS delivered_qty
  FROM sales_order_item
  GROUP BY product_code
) sale ON sale.product_code = p.product_code
WHERE GREATEST(COALESCE(pur.received_qty, 0) - COALESCE(sale.delivered_qty, 0), 0) > 0
ON DUPLICATE KEY UPDATE
  quantity = VALUES(quantity),
  available_quantity = VALUES(available_quantity),
  reserved_quantity = VALUES(reserved_quantity),
  unit_cost = VALUES(unit_cost),
  total_cost = VALUES(total_cost),
  last_in_date = VALUES(last_in_date),
  updated_time = CURRENT_TIMESTAMP;

-- 7. Seed inventory receipt and payable documents for existing purchase orders.
INSERT INTO inventory_receipt (receipt_no, receipt_type, warehouse_id, supplier_id, purchase_order_id, receipt_date, operator, total_quantity, total_amount, status, auto_generate_payable, payable_generated, remarks)
SELECT 'IR202412290004', 'PURCHASE', wh.id, s.id, po.id, NOW(), '赵仓管', 90.00, 45000.00, 'RECEIVED', TRUE, TRUE, '采购订单 PO202412290004 入库'
FROM warehouse wh
JOIN supplier s ON s.supplier_code = 'SUP004'
JOIN purchase_order po ON po.order_no = 'PO202412290004'
WHERE wh.warehouse_code = 'WH001'
  AND NOT EXISTS (SELECT 1 FROM inventory_receipt WHERE receipt_no = 'IR202412290004');

INSERT INTO inventory_receipt_item (receipt_id, product_id, quantity, unit, unit_price, total_amount, batch_no, quality_status, remarks)
SELECT r.id, p.id, 90.00, '个', 500.00, 45000.00, 'BATCH-MS-202412', 'QUALIFIED', '无线鼠标采购入库'
FROM inventory_receipt r
JOIN product p ON p.product_code = 'MS001'
WHERE r.receipt_no = 'IR202412290004'
  AND NOT EXISTS (SELECT 1 FROM inventory_receipt_item i WHERE i.receipt_id = r.id AND i.product_id = p.id);

INSERT INTO purchase_payable (payable_no, supplier_id, purchase_order_id, receipt_id, payable_type, total_amount, paid_amount, unpaid_amount, due_date, status, remarks)
SELECT 'PP202412290004', s.id, po.id, r.id, 'NORMAL', 45000.00, 45000.00, 0.00, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'PAID', '采购订单 PO202412290004 已付款'
FROM supplier s
JOIN purchase_order po ON po.order_no = 'PO202412290004'
JOIN inventory_receipt r ON r.receipt_no = 'IR202412290004'
WHERE s.supplier_code = 'SUP004'
  AND NOT EXISTS (SELECT 1 FROM purchase_payable WHERE payable_no = 'PP202412290004');

INSERT INTO purchase_payable (payable_no, supplier_id, purchase_order_id, receipt_id, payable_type, total_amount, paid_amount, unpaid_amount, due_date, status, remarks)
SELECT 'PP202412290006', s.id, po.id, NULL, 'NORMAL', 120000.00, 0.00, 120000.00, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'UNPAID', '采购订单 PO202412290006 待付款'
FROM supplier s
JOIN purchase_order po ON po.order_no = 'PO202412290006'
WHERE s.supplier_code = 'SUP002'
  AND NOT EXISTS (SELECT 1 FROM purchase_payable WHERE payable_no = 'PP202412290006');

-- 8. Backfill business documents and stock movements from existing order statuses.
INSERT INTO sales_receivable (receivable_no, customer_name, sales_order_id, receivable_type, total_amount, received_amount, unreceived_amount, due_date, status, remarks)
SELECT CONCAT('SR-', so.order_no), so.customer_name, so.id, 'NORMAL',
       COALESCE(so.total_amount, 0), 0.00, COALESCE(so.total_amount, 0),
       DATE_ADD(CURDATE(), INTERVAL 30 DAY),
       CASE WHEN COALESCE(so.total_amount, 0) = 0 THEN 'RECEIVED' ELSE 'UNRECEIVED' END,
       CONCAT('销售订单 ', so.order_no, ' 历史交付补应收')
FROM sales_order so
WHERE so.status IN ('SHIPPED', 'DELIVERED', 'COMPLETED')
  AND NOT EXISTS (SELECT 1 FROM sales_receivable sr WHERE sr.sales_order_id = so.id);

INSERT INTO inventory_receipt (receipt_no, receipt_type, warehouse_id, supplier_id, purchase_order_id, receipt_date, operator, total_quantity, total_amount, status, auto_generate_payable, payable_generated, remarks)
SELECT CONCAT('AUTO-', po.order_no), 'PURCHASE', wh.id, s.id, po.id, COALESCE(po.order_date, NOW()),
       COALESCE(NULLIF(po.purchaser, ''), '系统'),
       SUM(COALESCE(NULLIF(poi.received_qty, 0), poi.quantity)),
       SUM(COALESCE(NULLIF(poi.received_qty, 0), poi.quantity) * COALESCE(poi.unit_price, 0)),
       'RECEIVED', TRUE, TRUE, CONCAT('采购订单 ', po.order_no, ' 历史收货补入库单')
FROM purchase_order po
JOIN purchase_order_item poi ON poi.order_id = po.id
JOIN warehouse wh ON wh.warehouse_code = 'WH001'
JOIN supplier s ON s.supplier_name = po.supplier_name
WHERE po.status IN ('RECEIVED', 'COMPLETED')
  AND NOT EXISTS (SELECT 1 FROM inventory_receipt r WHERE r.purchase_order_id = po.id)
GROUP BY po.id, wh.id, s.id;

INSERT INTO inventory_receipt_item (receipt_id, product_id, quantity, unit, unit_price, total_amount, batch_no, quality_status, remarks)
SELECT r.id, p.id, COALESCE(NULLIF(poi.received_qty, 0), poi.quantity), poi.unit,
       COALESCE(poi.unit_price, 0),
       COALESCE(NULLIF(poi.received_qty, 0), poi.quantity) * COALESCE(poi.unit_price, 0),
       CONCAT('AUTO-', po.order_no), 'QUALIFIED', '历史采购收货补明细'
FROM inventory_receipt r
JOIN purchase_order po ON po.id = r.purchase_order_id
JOIN purchase_order_item poi ON poi.order_id = po.id
JOIN product p ON p.product_code = poi.product_code
WHERE r.receipt_no = CONCAT('AUTO-', po.order_no)
  AND NOT EXISTS (
    SELECT 1 FROM inventory_receipt_item i WHERE i.receipt_id = r.id AND i.product_id = p.id
  );

INSERT INTO purchase_payable (payable_no, supplier_id, purchase_order_id, receipt_id, payable_type, total_amount, paid_amount, unpaid_amount, due_date, status, remarks)
SELECT CONCAT('PP-', po.order_no), r.supplier_id, po.id, r.id, 'NORMAL',
       COALESCE(r.total_amount, po.total_amount, 0), 0.00, COALESCE(r.total_amount, po.total_amount, 0),
       DATE_ADD(CURDATE(), INTERVAL 30 DAY),
       CASE WHEN COALESCE(r.total_amount, po.total_amount, 0) = 0 THEN 'PAID' ELSE 'UNPAID' END,
       CONCAT('采购订单 ', po.order_no, ' 历史收货补应付')
FROM purchase_order po
JOIN inventory_receipt r ON r.purchase_order_id = po.id
WHERE po.status IN ('RECEIVED', 'COMPLETED')
  AND NOT EXISTS (SELECT 1 FROM purchase_payable pp WHERE pp.purchase_order_id = po.id);

INSERT INTO inventory_transaction (transaction_no, warehouse_id, product_id, transaction_type, business_type, reference_no, quantity, unit_cost, total_cost, balance_quantity, transaction_date, operator, remarks)
SELECT CONCAT('ITP', LPAD(r.id, 8, '0'), LPAD(i.id, 6, '0')),
       r.warehouse_id, i.product_id, 'IN', 'PURCHASE', r.receipt_no,
       i.quantity, COALESCE(i.unit_price, 0), i.quantity * COALESCE(i.unit_price, 0),
       COALESCE(inv.quantity, i.quantity), COALESCE(r.receipt_date, NOW()), r.operator, '历史采购入库补流水'
FROM inventory_receipt r
JOIN inventory_receipt_item i ON i.receipt_id = r.id
LEFT JOIN inventory inv ON inv.warehouse_id = r.warehouse_id AND inv.product_id = i.product_id
WHERE r.receipt_type = 'PURCHASE'
  AND r.status = 'RECEIVED'
  AND NOT EXISTS (
    SELECT 1 FROM inventory_transaction t
    WHERE t.reference_no = r.receipt_no AND t.product_id = i.product_id AND t.transaction_type = 'IN'
  );

INSERT INTO inventory_transaction (transaction_no, warehouse_id, product_id, transaction_type, business_type, reference_no, quantity, unit_cost, total_cost, balance_quantity, transaction_date, operator, remarks)
SELECT CONCAT('ITS', LPAD(so.id, 8, '0'), LPAD(soi.id, 6, '0')),
       wh.id, p.id, 'OUT', 'SALES_SHIPMENT', so.order_no,
       soi.delivered_qty, COALESCE(inv.unit_cost, p.standard_cost, 0),
       soi.delivered_qty * COALESCE(inv.unit_cost, p.standard_cost, 0),
       COALESCE(inv.quantity, 0), COALESCE(so.order_date, NOW()), COALESCE(NULLIF(so.salesperson, ''), '系统'), '历史销售发货补流水'
FROM sales_order so
JOIN sales_order_item soi ON soi.order_id = so.id
JOIN product p ON p.product_code = soi.product_code
JOIN warehouse wh ON wh.warehouse_code = 'WH001'
LEFT JOIN inventory inv ON inv.warehouse_id = wh.id AND inv.product_id = p.id
WHERE so.status IN ('SHIPPED', 'DELIVERED', 'COMPLETED')
  AND soi.delivered_qty > 0
  AND NOT EXISTS (
    SELECT 1 FROM inventory_transaction t
    WHERE t.reference_no = so.order_no AND t.product_id = p.id AND t.transaction_type = 'OUT'
  );

-- 9. Seed inventory check data using the current stock balance.
INSERT INTO inventory_check (check_no, warehouse_id, check_date, check_type, checker, status, total_gain_quantity, total_loss_quantity, total_gain_amount, total_loss_amount, remarks)
SELECT 'IC202412300001', wh.id, NOW(), 'FULL', '赵仓管', 'PROCESSED', 0.00, 0.00, 0.00, 0.00, '主仓库期初库存盘点'
FROM warehouse wh
WHERE wh.warehouse_code = 'WH001'
  AND NOT EXISTS (SELECT 1 FROM inventory_check WHERE check_no = 'IC202412300001');

INSERT INTO inventory_check_item (check_id, product_id, book_quantity, actual_quantity, difference_quantity, unit_cost, difference_amount, difference_type, remarks)
SELECT c.id, inv.product_id, inv.quantity, inv.quantity, 0.00, inv.unit_cost, 0.00, 'NORMAL', '账实一致'
FROM inventory_check c
JOIN inventory inv ON inv.warehouse_id = c.warehouse_id
WHERE c.check_no = 'IC202412300001'
  AND NOT EXISTS (
    SELECT 1 FROM inventory_check_item i WHERE i.check_id = c.id AND i.product_id = inv.product_id
  );

-- 10. Seed material, product and serial-number workflows so every inventory page has coherent data.
INSERT INTO bom (bom_code, product_id, bom_version, bom_name, quantity, status, effective_date, remarks)
SELECT 'BOM-WS001-001', p.id, '1.0', '工作站标准BOM', 1.00, 'ACTIVE', CURDATE(), '用于组装/拆解演示'
FROM product p
WHERE p.product_code = 'WS001'
  AND NOT EXISTS (SELECT 1 FROM bom WHERE bom_code = 'BOM-WS001-001');

INSERT INTO bom_item (bom_id, material_id, quantity, unit, loss_rate, remarks)
SELECT b.id, p.id, 1.00, '台', 0.00, '主机组件'
FROM bom b
JOIN product p ON p.product_code = 'NB001'
WHERE b.bom_code = 'BOM-WS001-001'
  AND NOT EXISTS (SELECT 1 FROM bom_item WHERE bom_id = b.id AND material_id = p.id);

INSERT INTO material_requisition (requisition_no, bom_id, production_order_no, department, applicant, requisition_date, production_quantity, warehouse_id, status, remarks)
SELECT 'MR202412300001', b.id, 'MO202412300001', '生产部', '李生产', NOW(), 5.00, wh.id, 'ISSUED', '生产领料演示单'
FROM bom b
JOIN warehouse wh ON wh.warehouse_code = 'WH001'
WHERE b.bom_code = 'BOM-WS001-001'
  AND NOT EXISTS (SELECT 1 FROM material_requisition WHERE requisition_no = 'MR202412300001');

INSERT INTO material_requisition_item (requisition_id, product_id, required_quantity, issued_quantity, unit, unit_cost, total_cost, remarks)
SELECT mr.id, p.id, 5.00, 5.00, '台', p.standard_cost, 5.00 * p.standard_cost, '笔记本领用'
FROM material_requisition mr
JOIN product p ON p.product_code = 'NB001'
WHERE mr.requisition_no = 'MR202412300001'
  AND NOT EXISTS (SELECT 1 FROM material_requisition_item WHERE requisition_id = mr.id AND product_id = p.id);

INSERT INTO material_return (return_no, requisition_id, production_order_no, department, returner, return_date, warehouse_id, return_reason, status, remarks)
SELECT 'MRT202412300001', mr.id, mr.production_order_no, '生产部', '李生产', NOW(), mr.warehouse_id, '生产余料退回', 'RETURNED', '生产退料演示单'
FROM material_requisition mr
WHERE mr.requisition_no = 'MR202412300001'
  AND NOT EXISTS (SELECT 1 FROM material_return WHERE return_no = 'MRT202412300001');

INSERT INTO material_return_item (return_id, product_id, return_quantity, unit, unit_cost, total_cost, remarks)
SELECT rt.id, p.id, 1.00, '台', p.standard_cost, p.standard_cost, '余料退回'
FROM material_return rt
JOIN product p ON p.product_code = 'NB001'
WHERE rt.return_no = 'MRT202412300001'
  AND NOT EXISTS (SELECT 1 FROM material_return_item WHERE return_id = rt.id AND product_id = p.id);

INSERT INTO product_receipt (receipt_no, production_order_no, receipt_type, warehouse_id, receipt_date, operator, total_quantity, total_cost, status, remarks)
SELECT 'PRD202412300001', 'MO202412300001', 'PRODUCTION', wh.id, NOW(), '赵仓管', 2.00, 24000.00, 'RECEIVED', '产品入库演示单'
FROM warehouse wh
WHERE wh.warehouse_code = 'WH003'
  AND NOT EXISTS (SELECT 1 FROM product_receipt WHERE receipt_no = 'PRD202412300001');

INSERT INTO product_receipt_item (receipt_id, product_id, quantity, unit, unit_cost, total_cost, batch_no, production_date, remarks)
SELECT pr.id, p.id, 2.00, '台', p.standard_cost, 2.00 * p.standard_cost, 'BATCH-WS-202412', CURDATE(), '工作站成品入库'
FROM product_receipt pr
JOIN product p ON p.product_code = 'WS001'
WHERE pr.receipt_no = 'PRD202412300001'
  AND NOT EXISTS (SELECT 1 FROM product_receipt_item WHERE receipt_id = pr.id AND product_id = p.id);

INSERT INTO product_assembly (assembly_no, bom_id, assembly_quantity, warehouse_id, assembly_date, operator, status, remarks)
SELECT 'PA202412300001', b.id, 2.00, wh.id, NOW(), '李生产', 'ASSEMBLED', '工作站组装演示单'
FROM bom b
JOIN warehouse wh ON wh.warehouse_code = 'WH003'
WHERE b.bom_code = 'BOM-WS001-001'
  AND NOT EXISTS (SELECT 1 FROM product_assembly WHERE assembly_no = 'PA202412300001');

INSERT INTO product_disassembly (disassembly_no, bom_id, disassembly_quantity, warehouse_id, disassembly_date, operator, status, remarks)
SELECT 'PD202412300001', b.id, 1.00, wh.id, NOW(), '李生产', 'DISASSEMBLED', '工作站拆解演示单'
FROM bom b
JOIN warehouse wh ON wh.warehouse_code = 'WH003'
WHERE b.bom_code = 'BOM-WS001-001'
  AND NOT EXISTS (SELECT 1 FROM product_disassembly WHERE disassembly_no = 'PD202412300001');

INSERT INTO serial_number_receipt (receipt_no, receipt_type, warehouse_id, supplier_id, purchase_order_id, receipt_date, operator, total_quantity, total_amount, status, auto_generate_payable, payable_generated, remarks)
SELECT 'SNR202412300001', 'PURCHASE_SN', wh.id, s.id, po.id, NOW(), '赵仓管', 2, 12000.00, 'RECEIVED', FALSE, FALSE, '序列号入库演示单'
FROM warehouse wh
JOIN supplier s ON s.supplier_code = 'SUP001'
JOIN purchase_order po ON po.order_no = 'PO202412290001'
WHERE wh.warehouse_code = 'WH001'
  AND NOT EXISTS (SELECT 1 FROM serial_number_receipt WHERE receipt_no = 'SNR202412300001');

INSERT INTO serial_number_receipt_item (receipt_id, product_id, serial_number, unit_price, batch_no, quality_status, location, remarks)
SELECT r.id, p.id, 'SN-NB001-202412-0001', 6000.00, 'SNBATCH-202412', 'QUALIFIED', 'A-01-01', '序列号入库'
FROM serial_number_receipt r
JOIN product p ON p.product_code = 'NB001'
WHERE r.receipt_no = 'SNR202412300001'
  AND NOT EXISTS (SELECT 1 FROM serial_number_receipt_item WHERE serial_number = 'SN-NB001-202412-0001');

INSERT INTO serial_number_receipt_item (receipt_id, product_id, serial_number, unit_price, batch_no, quality_status, location, remarks)
SELECT r.id, p.id, 'SN-NB001-202412-0002', 6000.00, 'SNBATCH-202412', 'QUALIFIED', 'A-01-02', '序列号入库'
FROM serial_number_receipt r
JOIN product p ON p.product_code = 'NB001'
WHERE r.receipt_no = 'SNR202412300001'
  AND NOT EXISTS (SELECT 1 FROM serial_number_receipt_item WHERE serial_number = 'SN-NB001-202412-0002');

INSERT INTO serial_number_inventory (warehouse_id, product_id, serial_number, status, unit_cost, batch_no, location, in_date, remarks)
SELECT wh.id, p.id, 'SN-NB001-202412-0001', 'IN_STOCK', 6000.00, 'SNBATCH-202412', 'A-01-01', NOW(), '序列号在库'
FROM warehouse wh
JOIN product p ON p.product_code = 'NB001'
WHERE wh.warehouse_code = 'WH001'
  AND NOT EXISTS (SELECT 1 FROM serial_number_inventory WHERE serial_number = 'SN-NB001-202412-0001');

INSERT INTO serial_number_inventory (warehouse_id, product_id, serial_number, status, unit_cost, batch_no, location, in_date, remarks)
SELECT wh.id, p.id, 'SN-NB001-202412-0002', 'IN_STOCK', 6000.00, 'SNBATCH-202412', 'A-01-02', NOW(), '序列号在库'
FROM warehouse wh
JOIN product p ON p.product_code = 'NB001'
WHERE wh.warehouse_code = 'WH001'
  AND NOT EXISTS (SELECT 1 FROM serial_number_inventory WHERE serial_number = 'SN-NB001-202412-0002');
