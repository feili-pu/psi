import React, { useState } from 'react';
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
  message
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 入库状态枚举
const ReceiptStatus = {
  DRAFT: 'draft',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// 状态标签配置
const statusConfig = {
  [ReceiptStatus.DRAFT]: { color: 'default', text: '草稿', icon: <EditOutlined /> },
  [ReceiptStatus.PENDING]: { color: 'blue', text: '待入库', icon: <ClockCircleOutlined /> },
  [ReceiptStatus.COMPLETED]: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
  [ReceiptStatus.CANCELLED]: { color: 'red', text: '已取消', icon: <ExclamationCircleOutlined /> }
};

// 入库类型配置
const receiptTypeConfig: Record<string, { color: string; text: string }> = {
  purchase: { color: 'blue', text: '采购入库' },
  return: { color: 'green', text: '退货入库' },
  transfer: { color: 'orange', text: '调拨入库' },
  production: { color: 'purple', text: '生产入库' },
  other: { color: 'default', text: '其他入库' }
};

// 模拟库存入库数据
const mockInventoryReceipts = [
  {
    id: 1,
    receiptNo: 'IR202401001',
    receiptType: 'purchase',
    warehouseName: '主仓库',
    supplierName: '深圳电子科技有限公司',
    receiptDate: '2024-01-15',
    planDate: '2024-01-16',
    actualDate: '2024-01-16',
    status: ReceiptStatus.COMPLETED,
    totalQuantity: 150,
    totalAmount: 185600.00,
    items: [
      { productName: 'CPU处理器', quantity: 50, unitPrice: 2800, amount: 140000, location: 'A-01-01' },
      { productName: '内存条8GB', quantity: 100, unitPrice: 320, amount: 32000, location: 'A-01-02' }
    ],
    operator: '张三',
    checker: '李经理',
    remark: '采购订单PO202401001对应入库'
  },
  {
    id: 2,
    receiptNo: 'IR202401002',
    receiptType: 'return',
    warehouseName: '主仓库B区',
    supplierName: '客户退货',
    receiptDate: '2024-01-16',
    planDate: '2024-01-17',
    actualDate: null,
    status: ReceiptStatus.PENDING,
    totalQuantity: 25,
    totalAmount: 45800.00,
    items: [
      { productName: '笔记本电脑', quantity: 20, unitPrice: 2000, amount: 40000, location: 'B-02-01' },
      { productName: '鼠标', quantity: 5, unitPrice: 160, amount: 800, location: 'B-02-02' }
    ],
    operator: '王五',
    checker: null,
    remark: '客户退货，需要质检'
  },
  {
    id: 3,
    receiptNo: 'IR202401003',
    receiptType: 'production',
    warehouseName: '成品仓库',
    supplierName: '生产车间',
    receiptDate: '2024-01-17',
    planDate: '2024-01-18',
    actualDate: '2024-01-18',
    status: ReceiptStatus.COMPLETED,
    totalQuantity: 80,
    totalAmount: 328000.00,
    items: [
      { productName: '组装电脑', quantity: 50, unitPrice: 6000, amount: 300000, location: 'C-01-01' },
      { productName: '测试设备', quantity: 30, unitPrice: 933, amount: 28000, location: 'C-01-02' }
    ],
    operator: '赵六',
    checker: '王经理',
    remark: '生产完成品入库'
  },
  {
    id: 4,
    receiptNo: 'IR202401004',
    receiptType: 'transfer',
    warehouseName: '分仓库',
    supplierName: '主仓库调拨',
    receiptDate: '2024-01-18',
    planDate: '2024-01-19',
    actualDate: null,
    status: ReceiptStatus.DRAFT,
    totalQuantity: 60,
    totalAmount: 67500.00,
    items: [
      { productName: '办公用品', quantity: 40, unitPrice: 1500, amount: 60000, location: 'D-01-01' },
      { productName: '耗材', quantity: 20, unitPrice: 375, amount: 7500, location: 'D-01-02' }
    ],
    operator: '钱七',
    checker: null,
    remark: '仓库间调拨'
  }
];

const InventoryReceipt: React.FC = () => {
  const [receipts, setReceipts] = useState(mockInventoryReceipts);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '入库单号',
      dataIndex: 'receiptNo',
      key: 'receiptNo',
      width: 120,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: '入库类型',
      dataIndex: 'receiptType',
      key: 'receiptType',
      width: 100,
      render: (type: string) => {
        const config = receiptTypeConfig[type];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '仓库',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 120,
    },
    {
      title: '供应商/来源',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 80,
    },
    {
      title: '入库日期',
      dataIndex: 'receiptDate',
      key: 'receiptDate',
      width: 110,
    },
    {
      title: '计划日期',
      dataIndex: 'planDate',
      key: 'planDate',
      width: 110,
    },
    {
      title: '入库数量',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      width: 100,
      render: (quantity: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {quantity}
        </span>
      ),
    },
    {
      title: '入库金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
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
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status];
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
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record.receiptNo)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === ReceiptStatus.COMPLETED}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
            disabled={record.status === ReceiptStatus.COMPLETED}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (receiptNo: string) => {
    const receipt = receipts.find(r => r.receiptNo === receiptNo);
    setSelectedReceipt(receipt);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    const receipt = receipts.find(r => r.id === id);
    setSelectedReceipt(receipt);
    form.setFieldsValue(receipt);
    setEditModalVisible(true);
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个入库单吗？',
      onOk() {
        setReceipts(receipts.filter(receipt => receipt.id !== id));
        message.success('删除成功');
      },
    });
  };

  // 处理新建入库单
  const handleCreate = () => {
    setSelectedReceipt(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出入库单数据');
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (selectedReceipt) {
        // 编辑入库单
        setReceipts(receipts.map(r => 
          r.id === selectedReceipt.id ? { ...r, ...values } : r
        ));
        message.success('入库单更新成功');
      } else {
        // 新建入库单
        const newReceipt = {
          id: Math.max(...receipts.map(r => r.id)) + 1,
          receiptNo: `IR${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          ...values,
          status: ReceiptStatus.DRAFT,
          receiptDate: new Date().toISOString().split('T')[0],
          actualDate: null,
          items: []
        };
        setReceipts([...receipts, newReceipt]);
        message.success('入库单创建成功');
      }
      setEditModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredReceipts = receipts.filter(receipt => {
    const matchSearch = !searchText || 
      receipt.receiptNo.toLowerCase().includes(searchText.toLowerCase()) ||
      receipt.warehouseName.toLowerCase().includes(searchText.toLowerCase()) ||
      receipt.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
      receipt.operator.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || receipt.status === statusFilter;
    const matchType = !typeFilter || receipt.receiptType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  // 统计数据
  const statistics = {
    total: receipts.length,
    pending: receipts.filter(r => r.status === ReceiptStatus.PENDING).length,
    completed: receipts.filter(r => r.status === ReceiptStatus.COMPLETED).length,
    draft: receipts.filter(r => r.status === ReceiptStatus.DRAFT).length,
    totalAmount: receipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0),
    totalQuantity: receipts.reduce((sum, receipt) => sum + receipt.totalQuantity, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总入库单"
              value={statistics.total}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待入库"
              value={statistics.pending}
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
              title="入库总额"
              value={statistics.totalAmount}
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
            <InboxOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>库存入库管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建入库单
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
              placeholder="搜索入库单号、仓库、供应商或操作员"
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
          <Col span={4}>
            <Select
              placeholder="入库类型"
              value={typeFilter}
              onChange={setTypeFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {Object.entries(receiptTypeConfig).map(([key, config]) => (
                <Option key={key} value={key}>
                  {config.text}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={10}>
            <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={filteredReceipts}
          rowKey="id"
          pagination={{
            total: filteredReceipts.length,
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
        />
      </Card>

      {/* 入库详情弹窗 */}
      <Modal
        title="入库单详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
      >
        {selectedReceipt && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>入库单号：</strong>{selectedReceipt.receiptNo}</p>
                <p><strong>入库类型：</strong>
                  <Tag color={receiptTypeConfig[selectedReceipt.receiptType].color}>
                    {receiptTypeConfig[selectedReceipt.receiptType].text}
                  </Tag>
                </p>
                <p><strong>仓库名称：</strong>{selectedReceipt.warehouseName}</p>
                <p><strong>供应商/来源：</strong>{selectedReceipt.supplierName}</p>
                <p><strong>操作员：</strong>{selectedReceipt.operator}</p>
              </Col>
              <Col span={12}>
                <p><strong>入库日期：</strong>{selectedReceipt.receiptDate}</p>
                <p><strong>计划日期：</strong>{selectedReceipt.planDate}</p>
                <p><strong>实际日期：</strong>{selectedReceipt.actualDate || '未完成'}</p>
                <p><strong>审核人：</strong>{selectedReceipt.checker || '未审核'}</p>
                <p><strong>入库状态：</strong>
                  <Tag color={statusConfig[selectedReceipt.status].color} icon={statusConfig[selectedReceipt.status].icon}>
                    {statusConfig[selectedReceipt.status].text}
                  </Tag>
                </p>
              </Col>
            </Row>
            
            <h4>入库明细</h4>
            <Table
              columns={[
                { title: '产品名称', dataIndex: 'productName', key: 'productName' },
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (price: number) => `¥${price}` },
                { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
                { title: '存放位置', dataIndex: 'location', key: 'location' },
              ]}
              dataSource={selectedReceipt.items}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <strong>{selectedReceipt.totalQuantity}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <strong style={{ color: '#f5222d' }}>
                      ¥{selectedReceipt.totalAmount.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} />
                </Table.Summary.Row>
              )}
            />
            
            {selectedReceipt.remark && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedReceipt.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑入库单弹窗 */}
      <Modal
        title={selectedReceipt ? '编辑入库单' : '新建入库单'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            status: ReceiptStatus.DRAFT,
            receiptType: 'purchase'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="入库类型"
                name="receiptType"
                rules={[{ required: true, message: '请选择入库类型' }]}
              >
                <Select placeholder="请选择入库类型">
                  {Object.entries(receiptTypeConfig).map(([key, config]) => (
                    <Option key={key} value={key}>
                      {config.text}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="仓库名称"
                name="warehouseName"
                rules={[{ required: true, message: '请输入仓库名称' }]}
              >
                <Input placeholder="请输入仓库名称" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="供应商/来源"
                name="supplierName"
                rules={[{ required: true, message: '请输入供应商/来源' }]}
              >
                <Input placeholder="请输入供应商/来源" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="操作员"
                name="operator"
                rules={[{ required: true, message: '请输入操作员' }]}
              >
                <Input placeholder="请输入操作员" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="计划日期"
                name="planDate"
                rules={[{ required: true, message: '请选择计划日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="入库状态"
                name="status"
              >
                <Select>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <Option key={key} value={key}>
                      {config.text}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="入库数量"
                name="totalQuantity"
                rules={[{ required: true, message: '请输入入库数量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入入库数量"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="入库金额"
                name="totalAmount"
                rules={[{ required: true, message: '请输入入库金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入入库金额"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="备注"
            name="remark"
          >
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryReceipt;