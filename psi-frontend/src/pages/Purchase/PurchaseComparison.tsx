import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  DatePicker,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  InputNumber,
  message,
  Divider,
  Progress
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PurchaseRealApi, RealResourceUtils } from '../../services/realResourceService';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 比价状态枚举
const ComparisonStatus = {
  DRAFT: 'draft',
  COMPARING: 'comparing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// 状态标签配置
const statusConfig = {
  [ComparisonStatus.DRAFT]: { color: 'default', text: '草稿', icon: <EditOutlined /> },
  [ComparisonStatus.COMPARING]: { color: 'blue', text: '比价中', icon: <SwapOutlined /> },
  [ComparisonStatus.COMPLETED]: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
  [ComparisonStatus.CANCELLED]: { color: 'red', text: '已取消', icon: <ClockCircleOutlined /> },
  PENDING: { color: 'blue', text: '待比价', icon: <SwapOutlined /> },
  COMPLETED: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
  CANCELLED: { color: 'red', text: '已取消', icon: <ClockCircleOutlined /> }
};

const PurchaseComparison: React.FC = () => {
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<any>(null);
  const [form] = Form.useForm();

  const mapComparison = (comparison: any) => ({
    ...comparison,
    comparisonNo: comparison.comparisonNo || `PC#${comparison.id}`,
    comparisonTitle: comparison.comparisonTitle || comparison.title,
    department: comparison.department || '-',
    comparisonDate: comparison.comparisonDate || comparison.createdTime?.slice(0, 10) || '-',
    selectedSupplier: comparison.selectedSupplier || (comparison.selectedQuotationId ? `报价#${comparison.selectedQuotationId}` : null),
    supplierCount: comparison.supplierCount || 0,
    totalSavings: comparison.totalSavings || 0,
    remark: comparison.remark || comparison.remarks,
    items: comparison.items || [],
    criteria: comparison.criteria || []
  });

  const loadComparisons = async () => {
    setLoading(true);
    try {
      const data = await PurchaseRealApi.listComparisons();
      setComparisons(data.map(mapComparison));
    } catch (error) {
      message.error('加载采购比价失败: ' + (error as Error).message);
      setComparisons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparisons();
  }, []);

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '比价单号',
      dataIndex: 'comparisonNo',
      key: 'comparisonNo',
      width: 120,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: '比价标题',
      dataIndex: 'comparisonTitle',
      key: 'comparisonTitle',
      width: 180,
      ellipsis: true,
    },
    {
      title: '比价部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: '比价人',
      dataIndex: 'comparer',
      key: 'comparer',
      width: 80,
    },
    {
      title: '比价日期',
      dataIndex: 'comparisonDate',
      key: 'comparisonDate',
      width: 110,
    },
    {
      title: '供应商数',
      dataIndex: 'supplierCount',
      key: 'supplierCount',
      width: 90,
      render: (count: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {count}家
        </span>
      ),
    },
    {
      title: '中选供应商',
      dataIndex: 'selectedSupplier',
      key: 'selectedSupplier',
      width: 150,
      ellipsis: true,
      render: (supplier: string) => supplier ? (
        <span style={{ color: '#52c41a' }}>
          <TrophyOutlined style={{ marginRight: '4px' }} />
          {supplier}
        </span>
      ) : '-',
    },
    {
      title: '节约金额',
      dataIndex: 'totalSavings',
      key: 'totalSavings',
      width: 120,
      render: (amount: number) => amount > 0 ? (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ) : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status] || statusConfig.PENDING;
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record.comparisonNo)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === ComparisonStatus.COMPLETED || record.status === 'COMPLETED'}
          >
            编辑
          </Button>
          {(record.status === ComparisonStatus.COMPARING || record.status === 'PENDING') && (
            <Button
              type="text"
              icon={<CheckCircleOutlined />}
              size="small"
              style={{ color: '#52c41a' }}
              onClick={() => handleComplete(record.id)}
            >
              完成
            </Button>
          )}
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
            disabled={record.status === ComparisonStatus.COMPLETED || record.status === 'COMPLETED'}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (comparisonNo: string) => {
    const comparison = comparisons.find(c => c.comparisonNo === comparisonNo);
    setSelectedComparison(comparison);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    const comparison = comparisons.find(c => c.id === id);
    setSelectedComparison(comparison);
    form.setFieldsValue(comparison);
    setEditModalVisible(true);
  };

  // 处理完成比价
  const handleComplete = (id: number) => {
    Modal.confirm({
      title: '完成比价',
      content: '确定要完成这个采购比价吗？完成后将无法修改。',
      async onOk() {
        await PurchaseRealApi.completeComparison(id);
        message.success('比价已完成');
        loadComparisons();
      },
    });
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个采购比价吗？',
      async onOk() {
        await PurchaseRealApi.deleteComparison(id);
        message.success('删除成功');
        loadComparisons();
      },
    });
  };

  // 处理新建比价
  const handleCreate = () => {
    setSelectedComparison(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    RealResourceUtils.exportCsv('采购比价.csv', filteredComparisons);
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await PurchaseRealApi.saveComparison(values, selectedComparison?.id);
      message.success(selectedComparison ? '比价更新成功' : '比价创建成功');
      setEditModalVisible(false);
      loadComparisons();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredComparisons = comparisons.filter(comparison => {
    const matchSearch = !searchText || 
      comparison.comparisonNo.toLowerCase().includes(searchText.toLowerCase()) ||
      String(comparison.comparisonTitle || '').toLowerCase().includes(searchText.toLowerCase()) ||
      String(comparison.department || '').toLowerCase().includes(searchText.toLowerCase()) ||
      String(comparison.comparer || '').toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || comparison.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 统计数据
  const statistics = {
    total: comparisons.length,
    draft: comparisons.filter(c => c.status === ComparisonStatus.DRAFT).length,
    comparing: comparisons.filter(c => c.status === ComparisonStatus.COMPARING || c.status === 'PENDING').length,
    completed: comparisons.filter(c => c.status === ComparisonStatus.COMPLETED || c.status === 'COMPLETED').length,
    totalSavings: comparisons.reduce((sum, comparison) => sum + comparison.totalSavings, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总比价单"
              value={statistics.total}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="比价中"
              value={statistics.comparing}
              suffix="单"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={statistics.completed}
              suffix="单"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="节约金额"
              value={statistics.totalSavings}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SwapOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>采购比价管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建比价
            </Button>
            <Button
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出数据
            </Button>
          </Space>
        }
      >
        {/* 搜索和筛选 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={6}>
            <Input
              placeholder="搜索比价单号、标题、部门或比价人"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="选择状态"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {Object.entries(statusConfig).map(([key, config]) => (
                <Option key={key} value={key}>
                  {config.text}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={14}>
            <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={filteredComparisons}
          rowKey="id"
          pagination={{
            total: filteredComparisons.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          scroll={{ x: 1400 }}
          loading={loading}
        />
      </Card>

      {/* 比价详情弹窗 */}
      <Modal
        title="采购比价详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1200}
      >
        {selectedComparison && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>比价单号：</strong>{selectedComparison.comparisonNo}</p>
                <p><strong>比价标题：</strong>{selectedComparison.comparisonTitle}</p>
                <p><strong>比价部门：</strong>{selectedComparison.department}</p>
                <p><strong>比价人：</strong>{selectedComparison.comparer}</p>
                <p><strong>比价日期：</strong>{selectedComparison.comparisonDate}</p>
              </Col>
              <Col span={12}>
                <p><strong>比价状态：</strong>
                  <Tag color={(statusConfig[selectedComparison.status] || statusConfig.PENDING).color} icon={(statusConfig[selectedComparison.status] || statusConfig.PENDING).icon}>
                    {(statusConfig[selectedComparison.status] || statusConfig.PENDING).text}
                  </Tag>
                </p>
                <p><strong>供应商数量：</strong>{selectedComparison.supplierCount}家</p>
                <p><strong>中选供应商：</strong>{selectedComparison.selectedSupplier || '未选择'}</p>
                <p><strong>节约金额：</strong>
                  {selectedComparison.totalSavings > 0 ? (
                    <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                      ¥{selectedComparison.totalSavings.toLocaleString()}
                    </span>
                  ) : '0'}
                </p>
              </Col>
            </Row>
            
            <Divider />
            
            <h4>评价标准</h4>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              {(selectedComparison.criteria || []).map((criterion: any, index: number) => (
                <Col span={6} key={index}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                        {criterion.weight}%
                      </div>
                      <div style={{ fontSize: '14px', marginTop: '4px' }}>
                        {criterion.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {criterion.description}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            
            <Divider />
            
            <h4>比价明细</h4>
            {(selectedComparison.items || []).map((item: any, itemIndex: number) => (
              <div key={itemIndex} style={{ marginBottom: '24px' }}>
                <h5>{item.productName} (数量: {item.quantity})</h5>
                <Table
                  columns={[
                    { title: '供应商', dataIndex: 'name', key: 'name' },
                    { 
                      title: '单价', 
                      dataIndex: 'price', 
                      key: 'price',
                      render: (price: number) => `¥${price.toLocaleString()}`
                    },
                    { 
                      title: '总价', 
                      dataIndex: 'total', 
                      key: 'total',
                      render: (total: number) => `¥${total.toLocaleString()}`
                    },
                    { 
                      title: '综合评分', 
                      dataIndex: 'score', 
                      key: 'score',
                      render: (score: number) => (
                        <div>
                          <Progress 
                            percent={score} 
                            size="small" 
                            strokeColor={score >= 90 ? '#52c41a' : score >= 80 ? '#faad14' : '#f5222d'}
                          />
                          <span style={{ marginLeft: '8px' }}>{score}分</span>
                        </div>
                      )
                    },
                    { 
                      title: '状态', 
                      dataIndex: 'selected', 
                      key: 'selected',
                      render: (selected: boolean) => selected ? (
                        <Tag color="green" icon={<TrophyOutlined />}>中选</Tag>
                      ) : (
                        <Tag color="default">未选</Tag>
                      )
                    },
                  ]}
                  dataSource={item.suppliers || []}
                  pagination={false}
                  size="small"
                />
              </div>
            ))}
            
            {selectedComparison.remark && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedComparison.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑比价弹窗 */}
      <Modal
        title={selectedComparison ? '编辑采购比价' : '新建采购比价'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            status: 'PENDING'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="询价单ID"
                name="inquiryId"
                rules={[{ required: true, message: '请输入询价单ID' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入关联询价单ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="比价标题"
                name="comparisonTitle"
                rules={[{ required: true, message: '请输入比价标题' }]}
              >
                <Input placeholder="请输入比价标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="比价部门"
                name="department"
                rules={[{ required: true, message: '请输入比价部门' }]}
              >
                <Input placeholder="请输入比价部门" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="比价人"
                name="comparer"
                rules={[{ required: true, message: '请输入比价人' }]}
              >
                <Input placeholder="请输入比价人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="供应商数量"
                name="supplierCount"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="参与比价的供应商数量"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="备注"
            name="remark"
          >
            <TextArea rows={3} placeholder="请输入比价说明和备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PurchaseComparison;
