import React, { useEffect, useState } from 'react';
import { Alert, Card, Col, Row, Statistic, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DashboardOutlined,
  DollarOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { SalesReportService, PurchaseReportService } from '../../services/statisticsService';
import { InventoryRealApi } from '../../services/realResourceService';
import { SalesOrderService } from '../../services/salesService';
import { PurchaseOrderService } from '../../services/purchaseService';
import { useAuth } from '../../contexts/AuthContext';

type RecentRow = {
  id: string;
  module: string;
  no: string;
  status: string;
  amount: number;
};

const Dashboard: React.FC = () => {
  const { hasPermission, hasAnyPermission } = useAuth();
  const canViewSales = hasAnyPermission(['sales:statistics:read', 'sales:order:read']);
  const canViewPurchase = hasAnyPermission(['purchase:statistics:read', 'purchase:order:read']);
  const canViewInventory = hasAnyPermission(['inventory:receipt:read', 'inventory:check:view', 'serial:inventory:view']);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    salesAmount: 0,
    salesOrders: 0,
    purchaseAmount: 0,
    purchaseOrders: 0,
    inventoryRecords: 0
  });
  const [recentRows, setRecentRows] = useState<RecentRow[]>([]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const canReadSalesStats = hasPermission('sales:statistics:read');
      const canReadSalesOrders = hasPermission('sales:order:read');
      const canReadPurchaseStats = hasPermission('purchase:statistics:read');
      const canReadPurchaseOrders = hasPermission('purchase:order:read');
      const canReadInventoryReceipts = hasPermission('inventory:receipt:read');
      const canReadInventoryChecks = hasPermission('inventory:check:view');
      const canReadSerialInventory = hasPermission('serial:inventory:view');

      const sales = canReadSalesStats
        ? await SalesReportService.getSalesReportData()
        : canReadSalesOrders
          ? await SalesOrderService.getAllOrders().then((orders) => ({
              totalSales: orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
              totalOrders: orders.length
            }))
          : { totalSales: 0, totalOrders: 0 };

      const purchase = canReadPurchaseStats
        ? await PurchaseReportService.getPurchaseReportData()
        : canReadPurchaseOrders
          ? await PurchaseOrderService.getAllOrders().then((orders) => ({
              totalPurchase: orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
              totalOrders: orders.length
            }))
          : { totalPurchase: 0, totalOrders: 0 };

      const [receiptsResult, checksResult, serialsResult] = await Promise.allSettled([
        canReadInventoryReceipts ? InventoryRealApi.listReceipts() : Promise.resolve([]),
        canReadInventoryChecks ? InventoryRealApi.listChecks() : Promise.resolve([]),
        canReadSerialInventory ? InventoryRealApi.listSerialInventory() : Promise.resolve([])
      ]);

      const receipts = receiptsResult.status === 'fulfilled' ? receiptsResult.value : [];
      const checks = checksResult.status === 'fulfilled' ? checksResult.value : [];
      const serials = serialsResult.status === 'fulfilled' ? serialsResult.value : [];

      if ([receiptsResult, checksResult, serialsResult].some((result) => result.status === 'rejected')) {
        message.warning('部分工作台数据因权限或接口状态未加载');
      }

      setSummary({
        salesAmount: sales.totalSales || 0,
        salesOrders: sales.totalOrders || 0,
        purchaseAmount: purchase.totalPurchase || 0,
        purchaseOrders: purchase.totalOrders || 0,
        inventoryRecords: receipts.length + checks.length + serials.length
      });

      setRecentRows([
        ...receipts.slice(0, 4).map((row: any) => ({
          id: `receipt-${row.id}`,
          module: '库存入库',
          no: row.receiptNo || `IR#${row.id}`,
          status: row.status || '-',
          amount: Number(row.totalAmount || 0)
        })),
        ...checks.slice(0, 4).map((row: any) => ({
          id: `check-${row.id}`,
          module: '库存盘点',
          no: row.checkNo || `IC#${row.id}`,
          status: row.status || '-',
          amount: Number(row.totalValue || 0)
        }))
      ].slice(0, 8));
      if (!canViewSales && !canViewPurchase && !canViewInventory) {
        message.info('当前账号暂无工作台业务数据权限');
      }
    } catch (error) {
      message.error(`加载首页数据失败: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const columns: ColumnsType<RecentRow> = [
    { title: '模块', dataIndex: 'module', width: 120 },
    { title: '单号', dataIndex: 'no', width: 160 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status: string) => <Tag color={status === 'PENDING' ? 'blue' : status === 'CANCELLED' ? 'red' : 'green'}>{status}</Tag>
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 140,
      render: (amount: number) => `¥${amount.toLocaleString()}`
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title={<><DashboardOutlined /> 工作台</>} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {canViewSales && (
            <>
              <Col xs={24} sm={12} lg={6}>
                <Statistic title="销售额" value={summary.salesAmount} prefix={<DollarOutlined />} precision={0} />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic title="销售订单" value={summary.salesOrders} prefix={<ShoppingCartOutlined />} suffix="单" />
              </Col>
            </>
          )}
          {canViewPurchase && (
            <Col xs={24} sm={12} lg={6}>
              <Statistic title="采购额" value={summary.purchaseAmount} prefix={<ShopOutlined />} precision={0} />
            </Col>
          )}
          {canViewInventory && (
            <Col xs={24} sm={12} lg={6}>
              <Statistic title="库存记录" value={summary.inventoryRecords} prefix={<InboxOutlined />} suffix="条" />
            </Col>
          )}
          {!canViewSales && !canViewPurchase && !canViewInventory && (
            <Col span={24}>
              <Alert type="info" showIcon message="当前账号暂无工作台业务数据权限" />
            </Col>
          )}
        </Row>
      </Card>

      <Row gutter={16}>
        {canViewPurchase && (
          <Col xs={24} lg={12}>
            <Card title="采购订单" loading={loading}>
              <Statistic title="订单数" value={summary.purchaseOrders} suffix="单" />
            </Card>
          </Col>
        )}
        {canViewInventory && (
          <Col xs={24} lg={12}>
            <Card title="近期库存单据">
              <Table columns={columns} dataSource={recentRows} rowKey="id" loading={loading} pagination={false} size="small" />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Dashboard;
