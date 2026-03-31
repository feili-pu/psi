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
  message,
  Spin,
  Empty,
  Progress
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  ExportOutlined,
  PrinterOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { 
  SalesReportService,
  type SalesReportData,
  type CustomerRankingItem,
  type SalesmanRankingItem,
  type ProductRankingItem
} from '../../services/statisticsService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SalesReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ]);
  
  // 报表数据状态
  const [reportData, setReportData] = useState<SalesReportData | null>(null);

  // 加载销售报表数据
  const loadReportData = async () => {
    setLoading(true);
    try {
      console.log('开始加载销售报表数据，日期范围:', dateRange);
      const data = await SalesReportService.getSalesReportData(dateRange[0], dateRange[1]);
      console.log('销售报表数据加载完成:', data);
      setReportData(data);
      
      if (data.totalSales > 0 || data.totalOrders > 0 || data.productRanking.length > 0) {
        message.success('销售报表数据加载成功');
      } else {
        message.warning('暂无销售数据，请检查日期范围或联系管理员');
      }
    } catch (error) {
      console.error('加载销售报表数据失败:', error);
      message.error('加载销售报表数据失败，请稍后重试');
      // 设置空数据以避免页面崩溃
      setReportData({
        totalSales: 0,
        totalOrders: 0,
        totalCustomers: 0,
        avgOrderValue: 0,
        monthGrowth: 0,
        salesTrend: [],
        productRanking: [],
        customerRanking: [],
        salesmanRanking: []
      });
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    console.log('销售报表组件挂载，开始加载数据');
    loadReportData();
  }, []);

  // 监听日期范围变化
  useEffect(() => {
    if (dateRange && dateRange.length === 2) {
      console.log('日期范围变化，重新加载数据:', dateRange);
      loadReportData();
    }
  }, [dateRange[0], dateRange[1]]);

  // 处理日期范围变更
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      const newDateRange: [string, string] = [
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD')
      ];
      console.log('用户选择新的日期范围:', newDateRange);
      setDateRange(newDateRange);
    }
  };

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', color: '#666' }}>
          正在加载销售报表数据...
        </div>
      </div>
    );
  }

  // 如果没有数据，显示加载状态
  if (!reportData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Empty 
          description="暂无销售报表数据"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={loadReportData} icon={<ReloadOutlined />}>
            重新加载
          </Button>
        </Empty>
      </div>
    );
  }

  // 处理导出
  const handleExport = () => {
    message.info('导出销售报表数据');
  };

  // 处理打印
  const handlePrint = () => {
    window.print();
  };

  // 产品排行表格列
  const productColumns: ColumnsType<ProductRankingItem> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => (
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: index < 3 ? ['#ffd700', '#c0c0c0', '#cd7f32'][index] : '#f0f0f0',
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
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '销售金额',
      dataIndex: 'value',
      key: 'value',
      render: (amount: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => `${percentage}%`,
    },
  ];

  // 客户排行表格列
  const customerColumns: ColumnsType<CustomerRankingItem> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => (
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: index < 3 ? ['#ffd700', '#c0c0c0', '#cd7f32'][index] : '#f0f0f0',
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
      ellipsis: true,
    },
    {
      title: '销售金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      render: (count: number) => `${count}单`,
      sorter: (a, b) => a.orderCount - b.orderCount,
    },
    {
      title: '客户等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const colors: Record<string, string> = { 
          'VIP': 'gold', 
          '金牌': '#faad14', 
          '银牌': '#52c41a', 
          '普通': 'default' 
        };
        return <Tag color={colors[level]}>{level}</Tag>;
      },
    },
    {
      title: '最后下单',
      dataIndex: 'lastOrderDate',
      key: 'lastOrderDate',
    },
  ];

  // 销售员业绩表格列
  const salesmanColumns: ColumnsType<SalesmanRankingItem> = [
    {
      title: '销售员',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '销售金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      render: (count: number) => `${count}单`,
      sorter: (a, b) => a.orderCount - b.orderCount,
    },
    {
      title: '客户数',
      dataIndex: 'customerCount',
      key: 'customerCount',
      render: (count: number) => `${count}个`,
    },
  ];

  if (!reportData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Empty 
          description="暂无销售报表数据"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={loadReportData} icon={<ReloadOutlined />}>
            重新加载
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      overflow: 'visible' // 改为可见，允许内容完全展示
    }}>
      {/* 页面标题和操作 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChartOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>销售统计报表</span>
            </div>
          </Col>
          <Col>
            <Space wrap>
              <RangePicker 
                value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                onChange={handleDateRangeChange}
                style={{ minWidth: '240px' }}
              />
              <Select value={reportType} onChange={setReportType} style={{ width: 120 }}>
                <Option value="overview">总览</Option>
                <Option value="product">产品分析</Option>
                <Option value="customer">客户分析</Option>
                <Option value="salesman">销售员分析</Option>
              </Select>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadReportData}
                loading={loading}
              >
                刷新
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>打印</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        {/* 核心指标卡片 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="本期销售额"
                value={reportData.totalSales}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="元"
                valueStyle={{ color: '#f5222d' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                <span style={{ color: reportData.monthGrowth > 0 ? '#52c41a' : '#f5222d' }}>
                  {reportData.monthGrowth > 0 ? '↗' : '↘'} {Math.abs(reportData.monthGrowth).toFixed(1)}%
                </span>
                <span style={{ marginLeft: '8px' }}>较上期</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="订单总数"
                value={reportData.totalOrders}
                prefix={<ShoppingCartOutlined />}
                suffix="单"
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                平均每日 {Math.round(reportData.totalOrders / 30)} 单
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="客户总数"
                value={reportData.totalCustomers}
                prefix={<UserOutlined />}
                suffix="个"
                valueStyle={{ color: '#52c41a' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                活跃客户
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="平均订单金额"
                value={reportData.avgOrderValue}
                precision={0}
                prefix="¥"
                valueStyle={{ color: '#722ed1' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                订单均值
              </div>
            </Card>
          </Col>
        </Row>

        {/* 产品销售排行 */}
        {reportData.productRanking && reportData.productRanking.length > 0 && (
          <Card title="产品销售排行" extra={<BarChartOutlined />} style={{ marginBottom: '24px' }}>
            <Row gutter={16}>
              {reportData.productRanking.map((product, index) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={product.name} style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    padding: '16px', 
                    border: '1px solid #f0f0f0', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: '#fafafa'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: index < 3 ? ['#ffd700', '#c0c0c0', '#cd7f32'][index] : '#f0f0f0',
                      color: index < 3 ? '#fff' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      margin: '0 auto 12px'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {product.name}
                    </div>
                    <div style={{ 
                      fontSize: '16px', 
                      color: '#f5222d',
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}>
                      ¥{product.value.toLocaleString()}
                    </div>
                    <Progress 
                      percent={product.percentage} 
                      strokeColor={product.color}
                      size="small"
                      format={() => `${product.percentage}%`}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {/* 客户销售排行 */}
        {reportData.customerRanking && reportData.customerRanking.length > 0 && (
          <Card title="客户销售排行" extra={<UserOutlined />} style={{ marginBottom: '24px' }}>
            <Table
              columns={customerColumns}
              dataSource={reportData.customerRanking}
              rowKey="id"
              pagination={{ 
                pageSize: 8, 
                showSizeChanger: true, 
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
                size: 'small'
              }}
              size="small"
            />
          </Card>
        )}

        {/* 销售员业绩排行 */}
        {reportData.salesmanRanking && reportData.salesmanRanking.length > 0 && (
          <Card title="销售员业绩排行" extra={<LineChartOutlined />} style={{ marginBottom: '24px' }}>
            <Table
              columns={salesmanColumns}
              dataSource={reportData.salesmanRanking}
              rowKey="id"
              pagination={{ 
                pageSize: 8, 
                showSizeChanger: true, 
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
                size: 'small'
              }}
              size="small"
            />
          </Card>
        )}

        {/* 无数据提示 */}
        {(!reportData.productRanking || reportData.productRanking.length === 0) &&
         (!reportData.customerRanking || reportData.customerRanking.length === 0) &&
         (!reportData.salesmanRanking || reportData.salesmanRanking.length === 0) &&
         reportData.totalSales === 0 && (
          <Card style={{ marginBottom: '24px' }}>
            <Empty 
              description="暂无销售数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default SalesReport;