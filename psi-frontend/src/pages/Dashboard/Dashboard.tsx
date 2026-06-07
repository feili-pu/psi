import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Tag,
  Button,
  Space,
  Calendar,
  Badge,
  Timeline,
  Table
} from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  InboxOutlined,
  UserOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  BellOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

// 模拟数据
const todayStats = {
  sales: {
    amount: 125680,
    orders: 23,
    growth: 15.6
  },
  purchase: {
    amount: 89500,
    orders: 8,
    growth: -3.2
  },
  inventory: {
    totalValue: 2850000,
    lowStock: 12,
    growth: 2.1
  },
  users: {
    online: 15,
    total: 45,
    newToday: 2
  }
};

// 待办事项数据
const todoList = [
  {
    id: 1,
    title: '审批采购订单 PO202401005',
    type: 'purchase',
    priority: 'high',
    deadline: '2024-01-19 18:00',
    status: 'pending'
  },
  {
    id: 2,
    title: '库存盘点 - 电子产品区',
    type: 'inventory',
    priority: 'medium',
    deadline: '2024-01-20 12:00',
    status: 'pending'
  },
  {
    id: 3,
    title: '客户回访 - 北京科技有限公司',
    type: 'sales',
    priority: 'medium',
    deadline: '2024-01-20 15:30',
    status: 'pending'
  },
  {
    id: 4,
    title: '月度销售报表生成',
    type: 'report',
    priority: 'low',
    deadline: '2024-01-22 17:00',
    status: 'pending'
  }
];

// 最近订单数据
const recentOrders = [
  {
    id: 1,
    orderNo: 'SO202401008',
    type: 'sales',
    customerName: '上海贸易公司',
    amount: 45600,
    status: 'confirmed',
    time: '2024-01-19 14:30'
  },
  {
    id: 2,
    orderNo: 'PO202401006',
    type: 'purchase',
    supplierName: '深圳电子科技',
    amount: 28900,
    status: 'approved',
    time: '2024-01-19 13:15'
  },
  {
    id: 3,
    orderNo: 'SO202401007',
    type: 'sales',
    customerName: '广州制造企业',
    amount: 67800,
    status: 'shipped',
    time: '2024-01-19 11:45'
  },
  {
    id: 4,
    orderNo: 'PO202401005',
    type: 'purchase',
    supplierName: '北京办公用品',
    amount: 15600,
    status: 'pending',
    time: '2024-01-19 10:20'
  }
];

// 系统通知数据
const notifications = [
  {
    id: 1,
    title: '系统维护通知',
    content: '系统将于今晚22:00-24:00进行维护升级',
    type: 'warning',
    time: '2024-01-19 09:00'
  },
  {
    id: 2,
    title: '库存预警',
    content: '笔记本电脑库存不足，当前库存仅剩15台',
    type: 'error',
    time: '2024-01-19 08:30'
  },
  {
    id: 3,
    title: '新用户注册',
    content: '新员工"李小华"已完成系统注册',
    type: 'info',
    time: '2024-01-19 08:00'
  }
];

// 销售排行数据
const salesRanking = [
  { name: '张三', amount: 156000, orders: 28, rank: 1 },
  { name: '李四', amount: 142000, orders: 25, rank: 2 },
  { name: '王五', amount: 128000, orders: 22, rank: 3 },
  { name: '赵六', amount: 98000, orders: 18, rank: 4 },
  { name: '钱七', amount: 85000, orders: 15, rank: 5 }
];

// 快捷操作数据
const quickActions = [
  { title: '新建销售订单', icon: <ShoppingCartOutlined />, color: '#52c41a', key: 'sales-orders' },
  { title: '新建采购订单', icon: <ShopOutlined />, color: '#1890ff', key: 'purchase-orders' },
  { title: '库存盘点', icon: <InboxOutlined />, color: '#faad14', key: 'inventory-check' },
  { title: '用户管理', icon: <UserOutlined />, color: '#722ed1', key: 'users' }
];

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>(undefined);

  // 优先级配置
  const priorityConfig: Record<string, { color: string; text: string }> = {
    high: { color: 'red', text: '高' },
    medium: { color: 'orange', text: '中' },
    low: { color: 'green', text: '低' }
  };

  // 订单状态配置
  const orderStatusConfig: Record<string, { color: string; text: string }> = {
    pending: { color: 'orange', text: '待处理' },
    confirmed: { color: 'blue', text: '已确认' },
    approved: { color: 'cyan', text: '已审批' },
    shipped: { color: 'green', text: '已发货' }
  };

  // 通知类型配置
  const notificationTypeConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    info: { color: 'blue', icon: <BellOutlined /> },
    warning: { color: 'orange', icon: <ExclamationCircleOutlined /> },
    error: { color: 'red', icon: <ExclamationCircleOutlined /> },
    success: { color: 'green', icon: <CheckCircleOutlined /> }
  };

  // 最近订单表格列
  const orderColumns: ColumnsType<any> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string) => (
        <Button type="link" size="small">
          {text}
        </Button>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'sales' ? 'green' : 'blue'}>
          {type === 'sales' ? '销售' : '采购'}
        </Tag>
      ),
    },
    {
      title: '客户/供应商',
      key: 'partner',
      render: (_, record) => record.customerName || record.supplierName,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = orderStatusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    }
  ];

  const handleQuickAction = (key: string) => {
    // 这里可以触发路由跳转或其他操作
    console.log('快捷操作:', key);
  };

  return (
    <div className="dashboard-page">
      {/* 欢迎信息 */}
      <Card className="dashboard-welcome">
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <div>
                <h2 style={{ margin: 0, color: '#1f2937' }}>早上好，管理员！</h2>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  今天是 {new Date().toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}，祝您工作愉快！
                </p>
              </div>
            </div>
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<DashboardOutlined />}>
                查看详细报表
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 核心数据统计 */}
      <Row gutter={[16, 16]} className="dashboard-metrics">
        <Col span={6}>
          <Card className="metric-card metric-card-sales">
            <Statistic
              title="今日销售额"
              value={todayStats.sales.amount}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#f5222d' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <span style={{ color: todayStats.sales.growth > 0 ? '#52c41a' : '#f5222d' }}>
                {todayStats.sales.growth > 0 ? <RiseOutlined /> : <FallOutlined />}
                {Math.abs(todayStats.sales.growth)}%
              </span>
              <span style={{ marginLeft: '8px', color: '#666' }}>较昨日</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="metric-card metric-card-purchase">
            <Statistic
              title="今日采购额"
              value={todayStats.purchase.amount}
              precision={0}
              prefix={<ShopOutlined />}
              suffix="元"
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <span style={{ color: todayStats.purchase.growth > 0 ? '#52c41a' : '#f5222d' }}>
                {todayStats.purchase.growth > 0 ? <RiseOutlined /> : <FallOutlined />}
                {Math.abs(todayStats.purchase.growth)}%
              </span>
              <span style={{ marginLeft: '8px', color: '#666' }}>较昨日</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="metric-card metric-card-inventory">
            <Statistic
              title="库存总值"
              value={todayStats.inventory.totalValue}
              precision={0}
              prefix={<InboxOutlined />}
              suffix="元"
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <span style={{ color: '#f5222d' }}>
                {todayStats.inventory.lowStock}个商品库存不足
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="metric-card metric-card-users">
            <Statistic
              title="在线用户"
              value={todayStats.users.online}
              suffix={`/ ${todayStats.users.total}`}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <span style={{ color: '#52c41a' }}>
                今日新增 {todayStats.users.newToday} 人
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Card title="快捷操作" className="dashboard-section">
        <Row gutter={[16, 16]}>
          {quickActions.map((action) => (
            <Col span={6} key={action.key}>
              <button
                type="button"
                className="quick-action-tile"
                onClick={() => handleQuickAction(action.key)}
              >
                <span className="quick-action-icon" style={{ color: action.color }}>
                  {action.icon}
                </span>
                <strong>{action.title}</strong>
              </button>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]} className="dashboard-section">
        {/* 待办事项 */}
        <Col span={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClockCircleOutlined />
                <span>待办事项</span>
                <Badge count={todoList.length} style={{ backgroundColor: '#f5222d' }} />
              </div>
            }
            extra={<Button type="link" size="small">查看全部</Button>}
          >
            <List
              dataSource={todoList}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" size="small" icon={<EyeOutlined />}>
                      查看
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{item.title}</span>
                        <Tag color={priorityConfig[item.priority].color}>
                          {priorityConfig[item.priority].text}
                        </Tag>
                      </div>
                    }
                    description={
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        <CalendarOutlined style={{ marginRight: '4px' }} />
                        {item.deadline}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 最近订单 */}
        <Col span={16}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCartOutlined />
                <span>最近订单</span>
              </div>
            }
            extra={<Button type="link" size="small">查看全部</Button>}
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 底部信息区域 */}
      <Row gutter={[16, 16]}>
        {/* 系统通知 */}
        <Col span={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellOutlined />
                <span>系统通知</span>
              </div>
            }
            extra={<Button type="link" size="small">查看全部</Button>}
          >
            <Timeline>
              {notifications.map((notification) => (
                <Timeline.Item
                  key={notification.id}
                  dot={
                    <div style={{ color: notificationTypeConfig[notification.type].color }}>
                      {notificationTypeConfig[notification.type].icon}
                    </div>
                  }
                >
                  <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>
                    {notification.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                    {notification.content}
                  </div>
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    {notification.time}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>

        {/* 销售排行 */}
        <Col span={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrophyOutlined />
                <span>销售排行</span>
              </div>
            }
            extra={<Button type="link" size="small">查看全部</Button>}
          >
            <List
              dataSource={salesRanking}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
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
                        {item.rank}
                      </div>
                    }
                    title={item.name}
                    description={
                      <div>
                        <div style={{ color: '#f5222d', fontWeight: 'bold' }}>
                          ¥{item.amount.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {item.orders}单
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 日历 */}
        <Col span={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined />
                <span>日历</span>
              </div>
            }
          >
            <Calendar
              fullscreen={false}
              value={selectedDate}
              onSelect={setSelectedDate}
              dateCellRender={(date) => {
                // 这里可以添加日程标记
                const day = date.date();
                if (day === 19) {
                  return <Badge status="error" />;
                }
                if (day === 20) {
                  return <Badge status="warning" />;
                }
                if (day === 22) {
                  return <Badge status="success" />;
                }
                return null;
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
