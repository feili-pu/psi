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
  Spin
} from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  ExportOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ReloadOutlined,
  AccountBookOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { 
  FinancialReportService,
  type FinancialReportData,
  type ProfitAnalysisItem,
  type CashFlowItem 
} from '../../services/statisticsService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FinancialReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ]);
  
  // 报表数据状态
  const [reportData, setReportData] = useState<FinancialReportData | null>(null);

  // 加载财务报表数据
  const loadReportData = async () => {
    setLoading(true);
    try {
      const data = await FinancialReportService.getFinancialReportData(dateRange[0], dateRange[1]);
      setReportData(data);
      message.success('财务报表数据加载成功');
    } catch (error) {
      console.error('加载财务报表数据失败:', error);
      message.error('加载财务报表数据失败: ' + (error as Error).message);
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
    message.info('导出财务报表数据');
  };

  // 处理打印
  const handlePrint = () => {
    window.print();
  };

  // 利润分析表格列
  const profitColumns: ColumnsType<ProfitAnalysisItem> = [
    {
      title: '业务类别',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '营业收入',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          ¥{revenue.toLocaleString()}
        </span>
      ),
    },
    {
      title: '营业成本',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => (
        <span style={{ color: '#f5222d' }}>
          ¥{cost.toLocaleString()}
        </span>
      ),
    },
    {
      title: '毛利润',
      dataIndex: 'profit',
      key: 'profit',
      render: (profit: number) => (
        <span style={{ color: profit > 0 ? '#52c41a' : '#f5222d', fontWeight: 'bold' }}>
          ¥{profit.toLocaleString()}
        </span>
      ),
    },
    {
      title: '毛利率',
      dataIndex: 'profitRate',
      key: 'profitRate',
      render: (rate: number) => (
        <span style={{ color: rate > 20 ? '#52c41a' : rate > 10 ? '#faad14' : '#f5222d' }}>
          {rate.toFixed(2)}%
        </span>
      ),
    },
    {
      title: '利润贡献',
      key: 'contribution',
      render: (_, record) => {
        const total = reportData?.grossProfit || 1;
        const percentage = (record.profit / total) * 100;
        return (
          <div>
            <Progress 
              percent={Math.abs(percentage)} 
              size="small"
              strokeColor={percentage > 0 ? '#52c41a' : '#f5222d'}
              showInfo={false}
            />
            <div style={{ fontSize: '12px', marginTop: '2px' }}>
              {percentage.toFixed(1)}%
            </div>
          </div>
        );
      },
    },
  ];

  // 现金流表格列
  const cashFlowColumns: ColumnsType<CashFlowItem> = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '现金流入',
      dataIndex: 'inflow',
      key: 'inflow',
      render: (inflow: number) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          ¥{inflow.toLocaleString()}
        </span>
      ),
    },
    {
      title: '现金流出',
      dataIndex: 'outflow',
      key: 'outflow',
      render: (outflow: number) => (
        <span style={{ color: '#f5222d' }}>
          ¥{outflow.toLocaleString()}
        </span>
      ),
    },
    {
      title: '净现金流',
      dataIndex: 'netFlow',
      key: 'netFlow',
      render: (netFlow: number) => (
        <span style={{ color: netFlow > 0 ? '#52c41a' : '#f5222d', fontWeight: 'bold' }}>
          {netFlow > 0 ? <RiseOutlined /> : <FallOutlined />}
          ¥{Math.abs(netFlow).toLocaleString()}
        </span>
      ),
    },
    {
      title: '流动性',
      key: 'liquidity',
      render: (_, record) => {
        const ratio = record.inflow / (record.outflow || 1);
        let status = 'exception';
        let text = '较差';
        if (ratio >= 1.2) {
          status = 'success';
          text = '良好';
        } else if (ratio >= 1.0) {
          status = 'active';
          text = '一般';
        }
        return <Tag color={status === 'success' ? 'green' : status === 'active' ? 'orange' : 'red'}>{text}</Tag>;
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
              <AccountBookOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>财务统计报表</span>
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
                <Option value="profit">利润分析</Option>
                <Option value="cost">成本分析</Option>
                <Option value="cashflow">现金流</Option>
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
        {/* 核心财务指标 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="营业收入"
                value={reportData.totalRevenue}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="元"
                valueStyle={{ color: '#52c41a' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                <span style={{ color: reportData.monthGrowth > 0 ? '#52c41a' : '#f5222d' }}>
                  {reportData.monthGrowth > 0 ? '↗' : '↘'} {Math.abs(reportData.monthGrowth).toFixed(1)}%
                </span>
                <span style={{ marginLeft: '8px' }}>较上期</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="营业成本"
                value={reportData.totalCost}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="元"
                valueStyle={{ color: '#f5222d' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                成本控制良好
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="毛利润"
                value={reportData.grossProfit}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="元"
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                盈利能力稳定
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="毛利率"
                value={reportData.grossProfitRate}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#722ed1' }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                高于行业平均
              </div>
            </Card>
          </Col>
        </Row>

        {/* 收入趋势和成本构成 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={16}>
            <Card title="收入利润趋势" extra={<LineChartOutlined />}>
              <div style={{ padding: '20px 0' }}>
                {reportData.revenueTrend.map((item, index) => (
                  <div key={item.month} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < reportData.revenueTrend.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <div style={{ flex: 1 }}>
                      <strong>{item.month}</strong>
                    </div>
                    <div style={{ flex: 2 }}>
                      <Progress 
                        percent={Math.round((item.revenue / Math.max(...reportData.revenueTrend.map(t => t.revenue))) * 100)} 
                        strokeColor="#52c41a"
                        showInfo={false}
                      />
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                        ¥{item.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <Tag color={item.profitRate > 20 ? 'green' : item.profitRate > 10 ? 'orange' : 'red'}>
                        {item.profitRate.toFixed(1)}%
                      </Tag>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="成本构成分析" extra={<PieChartOutlined />}>
              <div style={{ padding: '20px 0' }}>
                {reportData.costBreakdown.map((cost) => (
                  <div key={cost.name} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: cost.color,
                          borderRadius: '50%',
                          marginRight: '8px'
                        }}></div>
                        {cost.name}
                      </span>
                      <span style={{ fontWeight: 'bold' }}>{cost.percentage}%</span>
                    </div>
                    <Progress 
                      percent={cost.percentage} 
                      strokeColor={cost.color}
                      showInfo={false}
                      size="small"
                    />
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      ¥{cost.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 利润分析和现金流 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={12}>
            <Card title="利润分析" extra={<BarChartOutlined />}>
              <Table
                columns={profitColumns}
                dataSource={reportData.profitAnalysis}
                rowKey="category"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="现金流分析" extra={<LineChartOutlined />}>
              <Table
                columns={cashFlowColumns}
                dataSource={reportData.cashFlow}
                rowKey="month"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>

        {/* 成本构成排行 */}
        <Card title="成本构成排行" extra={<BarChartOutlined />}>
          <div style={{ marginBottom: '16px' }}>
            {reportData.costBreakdown.map((cost, index) => (
              <div key={cost.name} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>{index + 1}. {cost.name}</span>
                  <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                    ¥{cost.value.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  percent={cost.percentage} 
                  strokeColor={cost.color}
                  showInfo={false}
                  size="small"
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  占总成本 {cost.percentage}%
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default FinancialReport;