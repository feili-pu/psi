import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Select,
  DatePicker,
  Space,
  Button,
  Progress,
  Tag,
  message,
  Spin,
  Empty,
  Tooltip,
  Badge
} from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ShopOutlined,
  RiseOutlined,
  BarChartOutlined,
  ExportOutlined,
  UserOutlined,
  FallOutlined,
  ReloadOutlined,
  TrophyOutlined,
  LineChartOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { 
  PurchaseReportService,
  type PurchaseReportData,
  type SupplierRankingItem,
  type PurchaserRankingItem,
  type CategoryRankingItem 
} from '../../services/statisticsService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PurchaseReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ]);
  
  // 报表数据状态
  const [reportData, setReportData] = useState<PurchaseReportData | null>(null);

  // 加载采购报表数据
  const loadReportData = async () => {
    setLoading(true);
    try {
      console.log('开始加载采购报表数据，日期范围:', dateRange);
      const data = await PurchaseReportService.getPurchaseReportData(dateRange[0], dateRange[1]);
      console.log('采购报表数据加载完成:', data);
      setReportData(data);
      
      if (data.totalPurchase > 0 || data.totalOrders > 0 || data.supplierRanking.length > 0) {
        message.success('采购报表数据加载成功');
      } else {
        message.warning('暂无采购数据，请检查日期范围或联系管理员');
      }
    } catch (error) {
      console.error('加载采购报表数据失败:', error);
      message.error('加载采购报表数据失败，请稍后重试');
      // 设置空数据以避免页面崩溃
      setReportData({
        totalPurchase: 0,
        totalOrders: 0,
        totalSuppliers: 0,
        avgOrderValue: 0,
        monthGrowth: 0,
        purchaseTrend: [],
        supplierRanking: [],
        categoryRanking: [],
        purchaserRanking: []
      });
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadReportData();
  }, [dateRange]);

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
    message.info('导出采购报表数据');
  };

  // 处理打印
  const handlePrint = () => {
    window.print();
  };

  // 供应商排行表格列
  const supplierColumns: ColumnsType<SupplierRankingItem> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      fixed: 'left',
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
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
      ellipsis: true,
      render: (name: string, record, index) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {index < 3 && <TrophyOutlined style={{ color: ['#ffd700', '#c0c0c0', '#cd7f32'][index], marginRight: '4px' }} />}
          <Tooltip title={name}>
            <span>{name}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '采购金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
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
      width: 80,
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: '#1890ff' }} />
      ),
      sorter: (a, b) => a.orderCount - b.orderCount,
    },
    {
      title: '供应商等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => {
        const colors: Record<string, string> = { 
          '战略': 'gold', 
          '核心': '#faad14', 
          '重要': '#52c41a', 
          '普通': 'default' 
        };
        return <Tag color={colors[level]}>{level}</Tag>;
      },
    },
    {
      title: '增长率',
      dataIndex: 'growth',
      key: 'growth',
      width: 100,
      render: (growth: number) => (
        <span style={{ color: growth > 0 ? '#52c41a' : '#f5222d' }}>
          {growth > 0 ? <RiseOutlined /> : <FallOutlined />}
          {Math.abs(growth).toFixed(1)}%
        </span>
      ),
      sorter: (a, b) => a.growth - b.growth,
    },
    {
      title: '最后采购',
      dataIndex: 'lastOrderDate',
      key: 'lastOrderDate',
      width: 100,
    },
  ];

  // 采购员业绩表格列
  const purchaserColumns: ColumnsType<PurchaserRankingItem> = [
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
      title: '采购员',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      ellipsis: true,
      render: (name: string, record, index) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {index < 3 && <TrophyOutlined style={{ color: ['#ffd700', '#c0c0c0', '#cd7f32'][index], marginRight: '4px' }} />}
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: '采购金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
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
      width: 80,
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: '#1890ff' }} />
      ),
      sorter: (a, b) => a.orderCount - b.orderCount,
    },
    {
      title: '供应商数',
      dataIndex: 'supplierCount',
      key: 'supplierCount',
      width: 80,
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: '目标完成率',
      key: 'completion',
      width: 150,
      render: (_, record) => (
        <div>
          <Progress 
            percent={Math.round(record.completionRate)} 
            size="small"
            status={record.completionRate >= 90 ? 'success' : record.completionRate >= 70 ? 'active' : 'exception'}
          />
          <div style={{ fontSize: '11px', marginTop: '2px' }}>
            ¥{record.totalAmount.toLocaleString()} / ¥{Math.round(record.target).toLocaleString()}
          </div>
        </div>
      ),
    },
  ];

  if (!reportData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
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
              <ShoppingCartOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>采购统计报表</span>
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
                <Option value="supplier">供应商分析</Option>
                <Option value="category">品类分析</Option>
                <Option value="purchaser">采购员分析</Option>
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
                title="本期采购额"
                value={reportData.totalPurchase}
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
                title="采购订单数"
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
                title="供应商数量"
                value={reportData.totalSuppliers}
                prefix={<ShopOutlined />}
                suffix="个"
                valueStyle={{ color: '#52c41a' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                活跃供应商
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
                成本控制良好
              </div>
            </Card>
          </Col>
        </Row>

        {/* 采购趋势和品类分析 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} lg={16}>
            <Card title="采购趋势分析" extra={<LineChartOutlined />}>
              <div style={{ padding: '20px 0' }}>
                {reportData.purchaseTrend && reportData.purchaseTrend.length > 0 ? (
                  reportData.purchaseTrend.map((item, index) => (
                    <div key={item.month} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: index < reportData.purchaseTrend.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <div style={{ flex: 1, minWidth: '80px' }}>
                        <strong>{item.month}</strong>
                      </div>
                      <div style={{ flex: 2, margin: '0 16px' }}>
                        <Progress 
                          percent={Math.round((item.purchase / Math.max(...reportData.purchaseTrend.map(t => t.purchase))) * 100)} 
                          strokeColor="#1890ff"
                          showInfo={false}
                        />
                      </div>
                      <div style={{ flex: 1, textAlign: 'right', minWidth: '100px' }}>
                        <span style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '12px' }}>
                          ¥{item.purchase.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ flex: 1, textAlign: 'right', minWidth: '60px' }}>
                        <Tag color="blue" size="small">{item.orders}单</Tag>
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty 
                    description="暂无采购趋势数据"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="品类采购占比" extra={<BarChartOutlined />}>
              <div style={{ padding: '20px 0' }}>
                {reportData.categoryRanking && reportData.categoryRanking.length > 0 ? (
                  reportData.categoryRanking.map((category) => (
                    <div key={category.name} style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: category.color,
                            borderRadius: '50%',
                            marginRight: '8px',
                            flexShrink: 0
                          }}></div>
                          <span style={{ wordBreak: 'break-all' }}>{category.name}</span>
                        </span>
                        <span style={{ fontWeight: 'bold', fontSize: '13px', marginLeft: '8px' }}>{category.percentage}%</span>
                      </div>
                      <Progress 
                        percent={category.percentage} 
                        strokeColor={category.color}
                        showInfo={false}
                        size="small"
                      />
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                        ¥{category.value.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty 
                    description="暂无品类采购数据"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 供应商排行 */}
        {reportData.supplierRanking && reportData.supplierRanking.length > 0 && (
          <Card title="供应商采购排行" extra={<ShopOutlined />} style={{ marginBottom: '24px' }}>
            <Table
              columns={supplierColumns}
              dataSource={reportData.supplierRanking}
              rowKey="id"
              pagination={{ 
                pageSize: 8, 
                showSizeChanger: true, 
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
                size: 'small'
              }}
              size="small"
              scroll={{ x: 800 }}
            />
          </Card>
        )}

        {/* 采购员业绩排行 */}
        {reportData.purchaserRanking && reportData.purchaserRanking.length > 0 && (
          <Card title="采购员业绩排行" extra={<UserOutlined />} style={{ marginBottom: '24px' }}>
            <Table
              columns={purchaserColumns}
              dataSource={reportData.purchaserRanking}
              rowKey="id"
              pagination={{ 
                pageSize: 8, 
                showSizeChanger: true, 
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
                size: 'small'
              }}
              size="small"
              scroll={{ x: 700 }}
            />
          </Card>
        )}

        {/* 品类采购详细排行 */}
        {reportData.categoryRanking && reportData.categoryRanking.length > 0 && (
          <Card title="品类采购详细排行" extra={<BarChartOutlined />} style={{ marginBottom: '24px' }}>
            <Row gutter={16}>
              {reportData.categoryRanking.map((category, index) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={category.name} style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    padding: '16px', 
                    border: '1px solid #f0f0f0', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: '#fafafa'
                  }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold', 
                      color: category.color,
                      marginBottom: '8px'
                    }}>
                      #{index + 1}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      minHeight: '20px'
                    }}>
                      {category.name}
                    </div>
                    <div style={{ 
                      fontSize: '16px', 
                      color: '#f5222d',
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}>
                      ¥{category.value.toLocaleString()}
                    </div>
                    <Progress 
                      percent={category.percentage} 
                      strokeColor={category.color}
                      size="small"
                      format={() => `${category.percentage}%`}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {/* 无数据提示 */}
        {(!reportData.supplierRanking || reportData.supplierRanking.length === 0) &&
         (!reportData.purchaserRanking || reportData.purchaserRanking.length === 0) &&
         (!reportData.categoryRanking || reportData.categoryRanking.length === 0) &&
         reportData.totalPurchase === 0 && (
          <Card style={{ marginBottom: '24px' }}>
            <Empty 
              description="暂无采购数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default PurchaseReport;