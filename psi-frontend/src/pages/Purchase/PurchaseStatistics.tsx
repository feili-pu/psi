import React, { useState } from 'react';
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
  List,
  Avatar
} from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ShopOutlined,
  RiseOutlined,
  BarChartOutlined,
  ExportOutlined,
  CalendarOutlined,
  UserOutlined,
  StarOutlined,
  FallOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟采购统计数据
const mockPurchaseStatistics = {
  overview: {
    totalOrders: 156,
    totalAmount: 2580000.00,
    totalSuppliers: 45,
    avgOrderAmount: 16538.46,
    monthlyGrowth: 12.5,
    costSavings: 156000.00
  },
  monthlyTrend: [
    { month: '2023-07', orders: 12, amount: 180000, suppliers: 8 },
    { month: '2023-08', orders: 15, amount: 220000, suppliers: 10 },
    { month: '2023-09', orders: 18, amount: 280000, suppliers: 12 },
    { month: '2023-10', orders: 22, amount: 350000, suppliers: 15 },
    { month: '2023-11', orders: 25, amount: 420000, suppliers: 18 },
    { month: '2023-12', orders: 28, amount: 480000, suppliers: 20 },
    { month: '2024-01', orders: 36, amount: 650000, suppliers: 25 }
  ],
  categoryAnalysis: [
    { category: '办公设备', orders: 45, amount: 850000, percentage: 32.9, growth: 15.2 },
    { category: '生产原料', orders: 38, amount: 720000, percentage: 27.9, growth: 8.7 },
    { category: '实验设备', orders: 25, amount: 580000, percentage: 22.5, growth: -5.3 },
    { category: '营销物料', orders: 32, amount: 280000, percentage: 10.9, growth: 22.1 },
    { category: '其他', orders: 16, amount: 150000, percentage: 5.8, growth: 3.4 }
  ],
  supplierRanking: [
    { 
      rank: 1, 
      name: '深圳电子科技有限公司', 
      orders: 28, 
      amount: 680000, 
      rating: 4.8, 
      onTimeRate: 95,
      qualityScore: 92
    },
    { 
      rank: 2, 
      name: '北京办公用品供应商', 
      orders: 22, 
      amount: 520000, 
      rating: 4.5, 
      onTimeRate: 88,
      qualityScore: 89
    },
    { 
      rank: 3, 
      name: '广州工业设备公司', 
      orders: 18, 
      amount: 480000, 
      rating: 4.6, 
      onTimeRate: 92,
      qualityScore: 91
    },
    { 
      rank: 4, 
      name: '上海化工材料有限公司', 
      orders: 15, 
      amount: 350000, 
      rating: 4.2, 
      onTimeRate: 85,
      qualityScore: 86
    },
    { 
      rank: 5, 
      name: '杭州科技设备厂', 
      orders: 12, 
      amount: 280000, 
      rating: 4.0, 
      onTimeRate: 80,
      qualityScore: 83
    }
  ],
  departmentAnalysis: [
    { department: '生产部', orders: 58, amount: 1200000, percentage: 46.5, avgAmount: 20689 },
    { department: '行政部', orders: 42, amount: 680000, percentage: 26.4, avgAmount: 16190 },
    { department: '研发部', orders: 35, amount: 520000, percentage: 20.2, avgAmount: 14857 },
    { department: '市场部', orders: 21, amount: 180000, percentage: 6.9, avgAmount: 8571 }
  ],
  purchaserPerformance: [
    { name: '张三', orders: 45, amount: 850000, efficiency: 95, satisfaction: 4.6 },
    { name: '王五', orders: 38, amount: 720000, efficiency: 92, satisfaction: 4.4 },
    { name: '赵六', orders: 35, amount: 580000, efficiency: 88, satisfaction: 4.2 },
    { name: '钱七', orders: 21, amount: 280000, efficiency: 85, satisfaction: 4.0 },
    { name: '李八', orders: 17, amount: 150000, efficiency: 82, satisfaction: 3.8 }
  ],
  recentActivities: [
    { type: 'order', title: '新增采购订单 PO202401015', time: '2小时前', amount: 85000 },
    { type: 'payment', title: '完成付款 PP202401008', time: '4小时前', amount: 156000 },
    { type: 'supplier', title: '新增供应商：苏州精密制造', time: '6小时前', amount: 0 },
    { type: 'inquiry', title: '发送询价单 PI202401012', time: '8小时前', amount: 0 },
    { type: 'comparison', title: '完成比价 PC202401005', time: '1天前', amount: 280000 }
  ]
};

const PurchaseStatistics: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('month');
  const [department, setDepartment] = useState<string>('');

  // 供应商排名表格列
  const supplierColumns: ColumnsType<any> = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank: number) => (
        <div style={{ textAlign: 'center' }}>
          {rank <= 3 ? (
            <Avatar 
              size="small" 
              style={{ 
                backgroundColor: rank === 1 ? '#faad14' : rank === 2 ? '#d9d9d9' : '#cd7f32',
                color: '#fff'
              }}
            >
              {rank}
            </Avatar>
          ) : (
            <span style={{ fontWeight: 'bold' }}>{rank}</span>
          )}
        </div>
      ),
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '订单数',
      dataIndex: 'orders',
      key: 'orders',
      width: 80,
      render: (orders: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{orders}</span>
      ),
    },
    {
      title: '采购金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 80,
      render: (rating: number) => (
        <span style={{ color: '#faad14' }}>
          <StarOutlined /> {rating}
        </span>
      ),
    },
    {
      title: '准时率',
      dataIndex: 'onTimeRate',
      key: 'onTimeRate',
      width: 100,
      render: (rate: number) => (
        <Progress 
          percent={rate} 
          size="small" 
          strokeColor={rate >= 90 ? '#52c41a' : rate >= 80 ? '#faad14' : '#f5222d'}
        />
      ),
    },
  ];

  // 部门分析表格列
  const departmentColumns: ColumnsType<any> = [
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '订单数',
      dataIndex: 'orders',
      key: 'orders',
      render: (orders: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{orders}</span>
      ),
    },
    {
      title: '采购金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <Progress 
          percent={percentage} 
          size="small" 
          format={percent => `${percent}%`}
        />
      ),
    },
    {
      title: '平均金额',
      dataIndex: 'avgAmount',
      key: 'avgAmount',
      render: (amount: number) => (
        <span>¥{amount.toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 筛选条件 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Space>
              <span>时间范围：</span>
              <Select
                value={dateRange}
                onChange={setDateRange}
                style={{ width: 120 }}
              >
                <Option value="week">本周</Option>
                <Option value="month">本月</Option>
                <Option value="quarter">本季度</Option>
                <Option value="year">本年</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Space>
              <span>部门：</span>
              <Select
                value={department}
                onChange={setDepartment}
                placeholder="选择部门"
                allowClear
                style={{ width: 120 }}
              >
                <Option value="生产部">生产部</Option>
                <Option value="行政部">行政部</Option>
                <Option value="研发部">研发部</Option>
                <Option value="市场部">市场部</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <RangePicker />
          </Col>
          <Col>
            <Button type="primary" icon={<BarChartOutlined />}>
              生成报表
            </Button>
          </Col>
          <Col>
            <Button icon={<ExportOutlined />}>
              导出数据
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="采购订单总数"
              value={mockPurchaseStatistics.overview.totalOrders}
              suffix="单"
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Tag color="green" icon={<RiseOutlined />}>
                月增长 {mockPurchaseStatistics.overview.monthlyGrowth}%
              </Tag>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="采购总金额"
              value={mockPurchaseStatistics.overview.totalAmount}
              precision={0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f5222d' }}
              formatter={value => `¥${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
            />
            <div style={{ marginTop: '8px' }}>
              <Tag color="blue">
                平均订单 ¥{mockPurchaseStatistics.overview.avgOrderAmount.toLocaleString()}
              </Tag>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="合作供应商"
              value={mockPurchaseStatistics.overview.totalSuppliers}
              suffix="家"
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Tag color="orange">
                活跃供应商 {Math.round(mockPurchaseStatistics.overview.totalSuppliers * 0.7)}家
              </Tag>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成本节约"
              value={mockPurchaseStatistics.overview.costSavings}
              precision={0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#722ed1' }}
              formatter={value => `¥${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
            />
            <div style={{ marginTop: '8px' }}>
              <Tag color="purple">
                节约率 6.4%
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 趋势分析和分类分析 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined style={{ color: '#1890ff' }} />
                <span>月度采购趋势</span>
              </div>
            }
          >
            <div style={{ height: '300px', display: 'flex', alignItems: 'end', justifyContent: 'space-around', padding: '20px 0' }}>
              {mockPurchaseStatistics.monthlyTrend.map((item, index) => (
                <div key={index} style={{ textAlign: 'center', flex: 1 }}>
                  <div 
                    style={{ 
                      height: `${(item.amount / 650000) * 200}px`,
                      backgroundColor: '#1890ff',
                      margin: '0 4px',
                      borderRadius: '4px 4px 0 0',
                      minHeight: '20px'
                    }}
                  />
                  <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>
                    {item.month.split('-')[1]}月
                  </div>
                  <div style={{ fontSize: '12px', color: '#1890ff', fontWeight: 'bold' }}>
                    {item.orders}单
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChartOutlined style={{ color: '#1890ff' }} />
                <span>采购分类分析</span>
              </div>
            }
          >
            <div style={{ height: '300px', padding: '20px 0' }}>
              {mockPurchaseStatistics.categoryAnalysis.map((item, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>{item.category}</span>
                    <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                      ¥{item.amount.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Progress 
                      percent={item.percentage} 
                      size="small" 
                      style={{ flex: 1 }}
                      strokeColor="#1890ff"
                    />
                    <Tag color={item.growth > 0 ? 'green' : 'red'}>
                      {item.growth > 0 ? <RiseOutlined /> : <FallOutlined />}
                      {Math.abs(item.growth)}%
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 供应商排名和部门分析 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={14}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShopOutlined style={{ color: '#1890ff' }} />
                <span>供应商排名</span>
              </div>
            }
          >
            <Table
              columns={supplierColumns}
              dataSource={mockPurchaseStatistics.supplierRanking}
              pagination={false}
              size="small"
              rowKey="rank"
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserOutlined style={{ color: '#1890ff' }} />
                <span>部门采购分析</span>
              </div>
            }
          >
            <Table
              columns={departmentColumns}
              dataSource={mockPurchaseStatistics.departmentAnalysis}
              pagination={false}
              size="small"
              rowKey="department"
            />
          </Card>
        </Col>
      </Row>

      {/* 采购员绩效和最近活动 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserOutlined style={{ color: '#1890ff' }} />
                <span>采购员绩效</span>
              </div>
            }
          >
            <List
              dataSource={mockPurchaseStatistics.purchaserPerformance}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: index < 3 ? '#1890ff' : '#d9d9d9',
                          color: '#fff'
                        }}
                      >
                        {item.name}
                      </Avatar>
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.name}</span>
                        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                          ¥{item.amount.toLocaleString()}
                        </span>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: '4px' }}>
                          <span style={{ marginRight: '16px' }}>订单: {item.orders}单</span>
                          <span>满意度: {item.satisfaction}分</span>
                        </div>
                        <Progress 
                          percent={item.efficiency} 
                          size="small" 
                          strokeColor="#52c41a"
                          format={percent => `效率 ${percent}%`}
                        />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined style={{ color: '#1890ff' }} />
                <span>最近活动</span>
              </div>
            }
          >
            <List
              dataSource={mockPurchaseStatistics.recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={
                          item.type === 'order' ? <ShoppingCartOutlined /> :
                          item.type === 'payment' ? <DollarOutlined /> :
                          item.type === 'supplier' ? <ShopOutlined /> :
                          <BarChartOutlined />
                        }
                        style={{ 
                          backgroundColor: 
                            item.type === 'order' ? '#1890ff' :
                            item.type === 'payment' ? '#52c41a' :
                            item.type === 'supplier' ? '#faad14' :
                            '#722ed1'
                        }}
                      />
                    }
                    title={item.title}
                    description={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>{item.time}</span>
                        {item.amount > 0 && (
                          <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                            ¥{item.amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PurchaseStatistics;