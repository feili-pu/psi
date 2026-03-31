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
  Alert,
  message,
  Spin
} from 'antd';
import {
  InboxOutlined,
  DollarOutlined,
  WarningOutlined,
  SyncOutlined,
  BarChartOutlined,
  ExportOutlined,
  AlertOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { 
  InventoryReportService,
  type InventoryReportData,
  type LowStockItem,
  type TurnoverAnalysisItem 
} from '../../services/statisticsService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const InventoryReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ]);
  
  // 报表数据状态
  const [reportData, setReportData] = useState<InventoryReportData | null>(null);

  // 加载库存报表数据
  const loadReportData = async () => {
    setLoading(true);
    try {
      const data = await InventoryReportService.getInventoryReportData(dateRange[0], dateRange[1]);
      setReportData(data);
      message.success('库存报表数据加载成功');
    } catch (error) {
      console.error('加载库存报表数据失败:', error);
      message.error('加载库存报表数据失败: ' + (error as Error).message);
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
    message.info('导出库存报表数据');
  };

  // 处理打印
  const handlePrint = () => {
    window.print();
  };

  // 低库存商品表格列
  const lowStockColumns: ColumnsType<LowStockItem> = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (stock: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          {stock}
        </span>
      ),
    },
    {
      title: '最低库存',
      dataIndex: 'minStock',
      key: 'minStock',
    },
    {
      title: '最高库存',
      dataIndex: 'maxStock',
      key: 'maxStock',
    },
    {
      title: '库存状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          '严重不足': 'red',
          '库存不足': 'orange',
          '即将不足': 'yellow'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: '最后入库',
      dataIndex: 'lastInDate',
      key: 'lastInDate',
    },
  ];

  // 库存周转分析表格列
  const turnoverColumns: ColumnsType<TurnoverAnalysisItem> = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '周转率',
      dataIndex: 'turnoverRate',
      key: 'turnoverRate',
      render: (rate: number) => (
        <span style={{ 
          color: rate >= 6 ? '#52c41a' : rate >= 3 ? '#faad14' : '#f5222d',
          fontWeight: 'bold' 
        }}>
          {rate.toFixed(2)}
        </span>
      ),
    },
    {
      title: '平均库存',
      dataIndex: 'avgStock',
      key: 'avgStock',
      render: (stock: number) => stock.toLocaleString(),
    },
    {
      title: '销售数量',
      dataIndex: 'salesVolume',
      key: 'salesVolume',
      render: (volume: number) => volume.toLocaleString(),
    },
    {
      title: '产品类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: '周转评级',
      key: 'rating',
      render: (_, record) => {
        const rate = record.turnoverRate;
        if (rate >= 6) return <Tag color="green">优秀</Tag>;
        if (rate >= 3) return <Tag color="orange">良好</Tag>;
        return <Tag color="red">较差</Tag>;
      },
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
    <div style={{ padding: '24px' }}>
      {/* 页面标题和操作 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <InboxOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>库存统计报表</span>
            </div>
          </Col>
          <Col>
            <Space>
              <RangePicker 
                value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                onChange={handleDateRangeChange}
              />
              <Select value={reportType} onChange={setReportType} style={{ width: 120 }}>
                <Option value="overview">总览</Option>
                <Option value="category">品类分析</Option>
                <Option value="turnover">周转分析</Option>
                <Option value="warning">预警分析</Option>
              </Select>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadReportData}
                loading={loading}
              >
                刷新
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
              <Button onClick={handlePrint}>打印</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        {/* 库存预警 */}
        {reportData.lowStockItems > 0 && (
          <Alert
            message={`库存预警：发现 ${reportData.lowStockItems} 个商品库存不足，请及时补货！`}
            type="warning"
            icon={<AlertOutlined />}
            showIcon
            closable
            style={{ marginBottom: '24px' }}
          />
        )}

        {/* 核心指标卡片 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="库存总价值"
                value={reportData.totalValue}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="元"
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                资产占用合理
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="库存商品数"
                value={reportData.totalItems}
                prefix={<InboxOutlined />}
                suffix="种"
                valueStyle={{ color: '#52c41a' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                SKU管理良好
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="低库存商品"
                value={reportData.lowStockItems}
                prefix={<WarningOutlined />}
                suffix="种"
                valueStyle={{ color: '#f5222d' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                需要及时补货
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="平均周转率"
                value={reportData.turnoverRate}
                precision={2}
                prefix={<SyncOutlined />}
                suffix="次/年"
                valueStyle={{ color: '#722ed1' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                周转效率良好
              </div>
            </Card>
          </Col>
        </Row>

        {/* 库存趋势和品类分布 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={16}>
            <Card title="库存价值趋势" extra={<BarChartOutlined />}>
              <div style={{ padding: '20px 0' }}>
                {reportData.inventoryTrend.map((item, index) => (
                  <div key={item.month} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < reportData.inventoryTrend.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <div style={{ flex: 1 }}>
                      <strong>{item.month}</strong>
                    </div>
                    <div style={{ flex: 2 }}>
                      <Progress 
                        percent={Math.round((item.value / Math.max(...reportData.inventoryTrend.map(t => t.value))) * 100)} 
                        strokeColor="#1890ff"
                        showInfo={false}
                      />
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                        ¥{item.value.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <Tag color="green">{item.turnover.toFixed(1)}次</Tag>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="品类库存分布">
              <div style={{ padding: '20px 0' }}>
                {reportData.categoryDistribution.map((category) => (
                  <div key={category.name} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: category.color,
                          borderRadius: '50%',
                          marginRight: '8px'
                        }}></div>
                        {category.name}
                      </span>
                      <span style={{ fontWeight: 'bold' }}>{category.percentage}%</span>
                    </div>
                    <Progress 
                      percent={category.percentage} 
                      strokeColor={category.color}
                      showInfo={false}
                      size="small"
                    />
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      ¥{category.value.toLocaleString()} ({category.quantity}件)
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 低库存预警和周转分析 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={12}>
            <Card 
              title="低库存商品预警" 
              extra={<WarningOutlined style={{ color: '#f5222d' }} />}
            >
              <Table
                columns={lowStockColumns}
                dataSource={reportData.lowStockList}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="small"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="库存周转分析" extra={<SyncOutlined />}>
              <Table
                columns={turnoverColumns}
                dataSource={reportData.turnoverAnalysis}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="small"
              />
            </Card>
          </Col>
        </Row>

        {/* 品类库存排行 */}
        <Card title="品类库存价值排行" extra={<BarChartOutlined />}>
          <div style={{ marginBottom: '16px' }}>
            {reportData.categoryDistribution.map((category, index) => (
              <div key={category.name} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>{index + 1}. {category.name}</span>
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    ¥{category.value.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  percent={category.percentage} 
                  strokeColor={category.color}
                  showInfo={false}
                  size="small"
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  库存数量：{category.quantity.toLocaleString()} 件
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default InventoryReport;