import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
  Button,
  Table,
  Space,
  Tag,
  Progress,
  message,
  Spin
} from 'antd';
import {
  ExportOutlined,
  PrinterOutlined,
  RiseOutlined,
  FallOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { SalesStatisticsService } from '../../services/salesService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SalesStatistics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ]);
  
  // 统计数据状态
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [executionReport, setExecutionReport] = useState<any[]>([]);
  const [profitReport, setProfitReport] = useState<any[]>([]);
  const [profitSummary, setProfitSummary] = useState<any>(null);
  const [departmentSummary, setDepartmentSummary] = useState<any[]>([]);
  const [salespersonSummary, setSalespersonSummary] = useState<any[]>([]);
  const [customerSummary, setCustomerSummary] = useState<any[]>([]);
  const [productSummary, setProductSummary] = useState<any[]>([]);

  // 加载仪表板数据
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await SalesStatisticsService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('加载仪表板数据失败:', error);
      message.error('加载仪表板数据失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 加载执行情况报表
  const loadExecutionReport = async () => {
    setLoading(true);
    try {
      const data = await SalesStatisticsService.getExecutionReport(dateRange[0], dateRange[1]);
      setExecutionReport(data);
    } catch (error) {
      console.error('加载执行情况报表失败:', error);
      message.error('加载执行情况报表失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 加载毛利润报表
  const loadProfitReport = async () => {
    setLoading(true);
    try {
      const [detailData, summaryData] = await Promise.all([
        SalesStatisticsService.getProfitDetailReport(dateRange[0], dateRange[1]),
        SalesStatisticsService.getProfitSummary(dateRange[0], dateRange[1])
      ]);
      setProfitReport(detailData);
      setProfitSummary(summaryData);
    } catch (error) {
      console.error('加载毛利润报表失败:', error);
      message.error('加载毛利润报表失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 加载汇总报表
  const loadSummaryReports = async () => {
    setLoading(true);
    try {
      const [deptData, salesData, custData, prodData] = await Promise.all([
        SalesStatisticsService.getSummaryByDepartment(dateRange[0], dateRange[1]),
        SalesStatisticsService.getSummaryBySalesperson(dateRange[0], dateRange[1]),
        SalesStatisticsService.getSummaryByCustomer(dateRange[0], dateRange[1]),
        SalesStatisticsService.getSummaryByProduct(dateRange[0], dateRange[1])
      ]);
      setDepartmentSummary(deptData);
      setSalespersonSummary(salesData);
      setCustomerSummary(custData);
      setProductSummary(prodData);
    } catch (error) {
      console.error('加载汇总报表失败:', error);
      message.error('加载汇总报表失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadDashboardData();
  }, []);

  // 根据视图类型加载对应数据
  useEffect(() => {
    switch (viewType) {
      case 'execution':
        loadExecutionReport();
        break;
      case 'profit':
        loadProfitReport();
        break;
      case 'summary':
        loadSummaryReports();
        break;
      default:
        break;
    }
  }, [viewType, dateRange]);

  // 处理日期范围变更
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange([
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD')
      ]);
    }
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出销售统计数据');
  };

  // 处理打印
  const handlePrint = () => {
    window.print();
  };

  // 刷新当前视图数据
  const handleRefresh = () => {
    switch (viewType) {
      case 'overview':
        loadDashboardData();
        break;
      case 'execution':
        loadExecutionReport();
        break;
      case 'profit':
        loadProfitReport();
        break;
      case 'summary':
        loadSummaryReports();
        break;
    }
  };

  // 产品统计表格列
  const productColumns: ColumnsType<any> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => (
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: index < 3 ? '#faad14' : '#f0f0f0',
          color: index < 3 ? '#fff' : '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {index + 1}
        </div>
      ),
    },
    {
      title: '产品/规格',
      dataIndex: 'groupName',
      key: 'groupName',
      render: (text: string, record) => text || record.productName || '-',
    },
    {
      title: '销售金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{(amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: '订单数量',
      dataIndex: 'orderCount',
      key: 'orderCount',
      render: (count: number) => `${count || 0}单`,
    },
    {
      title: '销售数量',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      render: (qty: number) => `${qty || 0}件`,
    }
  ];

  // 客户统计表格列
  const customerColumns: ColumnsType<any> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => (
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: index < 3 ? '#52c41a' : '#f0f0f0',
          color: index < 3 ? '#fff' : '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {index + 1}
        </div>
      ),
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '销售金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{(amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: '订单数量',
      dataIndex: 'orderCount',
      key: 'orderCount',
      render: (count: number) => `${count || 0}单`,
    }
  ];

  // 业务员统计表格列
  const salespersonColumns: ColumnsType<any> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => (
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: index < 3 ? '#1890ff' : '#f0f0f0',
          color: index < 3 ? '#fff' : '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {index + 1}
        </div>
      ),
    },
    {
      title: '业务员',
      dataIndex: 'salesperson',
      key: 'salesperson',
    },
    {
      title: '销售金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{(amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: '订单数量',
      dataIndex: 'orderCount',
      key: 'orderCount',
      render: (count: number) => `${count || 0}单`,
    },
    {
      title: '客户数量',
      dataIndex: 'customerCount',
      key: 'customerCount',
      render: (count: number) => `${count || 0}个`,
    }
  ];

  // 执行情况表格列
  const executionColumns: ColumnsType<any> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${(amount || 0).toLocaleString()}`,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
          'PENDING': { color: 'orange', text: '待确认' },
          'CONFIRMED': { color: 'blue', text: '已确认' },
          'PRODUCING': { color: 'cyan', text: '生产中' },
          'SHIPPED': { color: 'purple', text: '已发货' },
          'DELIVERED': { color: 'green', text: '已交付' },
          'COMPLETED': { color: 'success', text: '已完成' },
          'CANCELLED': { color: 'red', text: '已取消' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '执行进度',
      dataIndex: 'executionRate',
      key: 'executionRate',
      render: (rate: number) => (
        <Progress 
          percent={Math.round((rate || 0) * 100)} 
          size="small" 
          status={rate >= 1 ? 'success' : 'active'}
        />
      ),
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 工具栏 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Select
                value={viewType}
                onChange={setViewType}
                style={{ width: 150 }}
              >
                <Option value="overview">概览</Option>
                <Option value="execution">执行情况</Option>
                <Option value="profit">毛利润分析</Option>
                <Option value="summary">汇总报表</Option>
              </Select>
              
              {viewType !== 'overview' && (
                <RangePicker
                  value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                  onChange={handleDateRangeChange}
                />
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={handleExport}
              >
                导出
              </Button>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                打印
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        {/* 概览视图 */}
        {viewType === 'overview' && dashboardData && (
          <>
            {/* 核心指标 */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="本月销售额"
                    value={dashboardData.thisMonth?.totalAmount || 0}
                    precision={2}
                    prefix="¥"
                    valueStyle={{ color: '#3f8600' }}
                    suffix={
                      <Space>
                        {dashboardData.salesGrowth > 0 ? (
                          <RiseOutlined style={{ color: '#3f8600' }} />
                        ) : (
                          <FallOutlined style={{ color: '#cf1322' }} />
                        )}
                        <span style={{ fontSize: '14px' }}>
                          {Math.abs(dashboardData.salesGrowth || 0).toFixed(1)}%
                        </span>
                      </Space>
                    }
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="本月毛利润"
                    value={dashboardData.thisMonth?.grossProfit || 0}
                    precision={2}
                    prefix="¥"
                    valueStyle={{ color: '#1890ff' }}
                    suffix={
                      <Space>
                        {dashboardData.profitGrowth > 0 ? (
                          <RiseOutlined style={{ color: '#3f8600' }} />
                        ) : (
                          <FallOutlined style={{ color: '#cf1322' }} />
                        )}
                        <span style={{ fontSize: '14px' }}>
                          {Math.abs(dashboardData.profitGrowth || 0).toFixed(1)}%
                        </span>
                      </Space>
                    }
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="本月订单数"
                    value={dashboardData.thisMonth?.orderCount || 0}
                    suffix="单"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="毛利率"
                    value={dashboardData.thisMonth?.grossProfitRate || 0}
                    precision={2}
                    suffix="%"
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* 对比数据 */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <Card title="本月 vs 上月对比" size="small">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="本月销售额"
                        value={dashboardData.thisMonth?.totalAmount || 0}
                        precision={2}
                        prefix="¥"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="上月销售额"
                        value={dashboardData.lastMonth?.totalAmount || 0}
                        precision={2}
                        prefix="¥"
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="增长趋势" size="small">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="销售额增长"
                        value={dashboardData.salesGrowth || 0}
                        precision={1}
                        suffix="%"
                        valueStyle={{ 
                          color: (dashboardData.salesGrowth || 0) > 0 ? '#3f8600' : '#cf1322' 
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="毛利润增长"
                        value={dashboardData.profitGrowth || 0}
                        precision={1}
                        suffix="%"
                        valueStyle={{ 
                          color: (dashboardData.profitGrowth || 0) > 0 ? '#3f8600' : '#cf1322' 
                        }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* 执行情况视图 */}
        {viewType === 'execution' && (
          <Card title="销售订单执行情况" extra={`统计期间：${dateRange[0]} 至 ${dateRange[1]}`}>
            <Table
              columns={executionColumns}
              dataSource={executionReport}
              rowKey="orderNo"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
            />
          </Card>
        )}

        {/* 毛利润分析视图 */}
        {viewType === 'profit' && (
          <>
            {profitSummary && (
              <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="总销售额"
                      value={profitSummary.totalAmount || 0}
                      precision={2}
                      prefix="¥"
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="总成本"
                      value={profitSummary.totalCost || 0}
                      precision={2}
                      prefix="¥"
                      valueStyle={{ color: '#fa541c' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="毛利润"
                      value={profitSummary.grossProfit || 0}
                      precision={2}
                      prefix="¥"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="毛利率"
                      value={profitSummary.grossProfitRate || 0}
                      precision={2}
                      suffix="%"
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
              </Row>
            )}
            
            <Card title="毛利润明细" extra={`统计期间：${dateRange[0]} 至 ${dateRange[1]}`}>
              <Table
                columns={[
                  { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
                  { title: '客户名称', dataIndex: 'customerName', key: 'customerName' },
                  { title: '销售金额', dataIndex: 'totalAmount', key: 'totalAmount', render: (amount: number) => `¥${(amount || 0).toLocaleString()}` },
                  { title: '成本', dataIndex: 'totalCost', key: 'totalCost', render: (cost: number) => `¥${(cost || 0).toLocaleString()}` },
                  { title: '毛利润', dataIndex: 'grossProfit', key: 'grossProfit', render: (profit: number) => `¥${(profit || 0).toLocaleString()}` },
                  { title: '毛利率', dataIndex: 'grossProfitRate', key: 'grossProfitRate', render: (rate: number) => `${(rate || 0).toFixed(2)}%` }
                ]}
                dataSource={profitReport}
                rowKey="orderNo"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                }}
              />
            </Card>
          </>
        )}

        {/* 汇总报表视图 */}
        {viewType === 'summary' && (
          <Row gutter={16}>
            <Col span={12}>
              <Card title="产品销售排行" style={{ marginBottom: '16px' }}>
                <Table
                  columns={productColumns}
                  dataSource={productSummary}
                  rowKey={(record) => record.groupKey || record.groupName || record.productName}
                  pagination={false}
                  size="small"
                />
              </Card>
              
              <Card title="客户销售排行">
                <Table
                  columns={customerColumns}
                  dataSource={customerSummary}
                  rowKey="customerName"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            
            <Col span={12}>
              <Card title="业务员销售排行" style={{ marginBottom: '16px' }}>
                <Table
                  columns={salespersonColumns}
                  dataSource={salespersonSummary}
                  rowKey="salesperson"
                  pagination={false}
                  size="small"
                />
              </Card>
              
              <Card title="部门销售汇总">
                <Table
                  columns={[
                    { title: '部门', dataIndex: 'department', key: 'department' },
                    { title: '销售金额', dataIndex: 'totalAmount', key: 'totalAmount', render: (amount: number) => `¥${(amount || 0).toLocaleString()}` },
                    { title: '订单数量', dataIndex: 'orderCount', key: 'orderCount', render: (count: number) => `${count || 0}单` }
                  ]}
                  dataSource={departmentSummary}
                  rowKey="department"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default SalesStatistics;
