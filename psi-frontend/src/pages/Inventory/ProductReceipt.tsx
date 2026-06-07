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
  message,
  Divider
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  ExportOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 入库状态枚举
const ReceiptStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  INSPECTING: 'inspecting',
  RECEIVED: 'received',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
};

// 状态标签配置
const statusConfig = {
  [ReceiptStatus.DRAFT]: { color: 'default', text: '草稿', icon: <EditOutlined /> },
  [ReceiptStatus.SUBMITTED]: { color: 'blue', text: '已提交', icon: <SendOutlined /> },
  [ReceiptStatus.INSPECTING]: { color: 'orange', text: '质检中', icon: <ExclamationCircleOutlined /> },
  [ReceiptStatus.RECEIVED]: { color: 'green', text: '已入库', icon: <InboxOutlined /> },
  [ReceiptStatus.COMPLETED]: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
  [ReceiptStatus.REJECTED]: { color: 'red', text: '已拒收', icon: <ExclamationCircleOutlined /> }
};

// 入库类型枚举
const ReceiptType = {
  PRODUCTION: 'production',
  PURCHASE: 'purchase',
  RETURN: 'return',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment'
};

const receiptTypeConfig = {
  [ReceiptType.PRODUCTION]: '生产入库',
  [ReceiptType.PURCHASE]: '采购入库',
  [ReceiptType.RETURN]: '退货入库',
  [ReceiptType.TRANSFER]: '调拨入库',
  [ReceiptType.ADJUSTMENT]: '调整入库'
};

// 模拟产品入库数据
const mockProductReceipts = [
  {
    id: 1,
    receiptNo: 'PR202401001',
    receiptType: ReceiptType.PRODUCTION,
    productionOrder: 'PO202401001',
    receiptDate: '2024-01-15',
    status: ReceiptStatus.COMPLETED,
    totalQuantity: 500,
    totalAmount: 125000.00,
    warehouse: '成品仓库A',
    operator: '张三',
    inspector: '质检员李四',
    items: [
      { 
        productCode: 'PRD001', 
        productName: '电子设备A', 
        unit: '台', 
        plannedQty: 100, 
        actualQty: 98, 
        qualifiedQty: 95,
        defectiveQty: 3,
        unitPrice: 500, 
        amount: 47500,
        batchNo: 'B202401001',
        location: 'A-01-01'
      },
      { 
        productCode: 'PRD002', 
        productName: '控制器B', 
        unit: '个', 
        plannedQty: 200, 
        actualQty: 200, 
        qualifiedQty: 198,
        defectiveQty: 2,
        unitPrice: 150, 
        amount: 29700,
        batchNo: 'B202401002',
        location: 'A-01-02'
      },
      { 
        productCode: 'PRD003', 
        productName: '传感器C', 
        unit: '个', 
        plannedQty: 300, 
        actualQty: 302, 
        qualifiedQty: 300,
        defectiveQty: 2,
        unitPrice: 160, 
        amount: 48000,
        batchNo: 'B202401003',
        location: 'A-01-03'
      }
    ],
    qualityReport: '质检合格率98.5%，符合入库标准',
    remark: '生产计划按时完成，产品质量良好'
  },
  {
    id: 2,
    receiptNo: 'PR202401002',
    receiptType: ReceiptType.PURCHASE,
    productionOrder: null,
    receiptDate: '2024-01-16',
    status: ReceiptStatus.INSPECTING,
    totalQuantity: 150,
    totalAmount: 75000.00,
    warehouse: '成品仓库B',
    operator: '王五',
    inspector: '质检员赵六',
    items: [
      { 
        productCode: 'PRD004', 
        productName: '显示屏D', 
        unit: '台', 
        plannedQty: 50, 
        actualQty: 50, 
        qualifiedQty: 0,
        defectiveQty: 0,
        unitPrice: 800, 
        amount: 40000,
        batchNo: 'B202401004',
        location: 'B-01-01'
      },
      { 
        productCode: 'PRD005', 
        productName: '电源模块E', 
        unit: '个', 
        plannedQty: 100, 
        actualQty: 100, 
        qualifiedQty: 0,
        defectiveQty: 0,
        unitPrice: 350, 
        amount: 35000,
        batchNo: 'B202401005',
        location: 'B-01-02'
      }
    ],
    qualityReport: '正在进行质量检测',
    remark: '采购到货，等待质检完成'
  },
  {
    id: 3,
    receiptNo: 'PR202401003',
    receiptType: ReceiptType.RETURN,
    productionOrder: null,
    receiptDate: '2024-01-17',
    status: ReceiptStatus.RECEIVED,
    totalQuantity: 25,
    totalAmount: 12500.00,
    warehouse: '退货仓库',
    operator: '钱七',
    inspector: '质检员孙八',
    items: [
      { 
        productCode: 'PRD001', 
        productName: '电子设备A', 
        unit: '台', 
        plannedQty: 25, 
        actualQty: 25, 
        qualifiedQty: 20,
        defectiveQty: 5,
        unitPrice: 500, 
        amount: 10000,
        batchNo: 'B202312015',
        location: 'R-01-01'
      }
    ],
    qualityReport: '退货产品检测，80%可重新销售',
    remark: '客户退货，部分产品需要维修'
  },
  {
    id: 4,
    receiptNo: 'PR202401004',
    receiptType: ReceiptType.TRANSFER,
    productionOrder: null,
    receiptDate: '2024-01-18',
    status: ReceiptStatus.SUBMITTED,
    totalQuantity: 80,
    totalAmount: 32000.00,
    warehouse: '成品仓库C',
    operator: '周九',
    inspector: null,
    items: [
      { 
        productCode: 'PRD002', 
        productName: '控制器B', 
        unit: '个', 
        plannedQty: 80, 
        actualQty: 80, 
        qualifiedQty: 0,
        defectiveQty: 0,
        unitPrice: 400, 
        amount: 32000,
        batchNo: 'B202401006',
        location: 'C-01-01'
      }
    ],
    qualityReport: '等待质检',
    remark: '从分公司调拨入库'
  },
  {
    id: 5,
    receiptNo: 'PR202401005',
    receiptType: ReceiptType.ADJUSTMENT,
    productionOrder: null,
    receiptDate: '2024-01-19',
    status: ReceiptStatus.DRAFT,
    totalQuantity: 10,
    totalAmount: 8000.00,
    warehouse: '成品仓库A',
    operator: '吴十',
    inspector: null,
    items: [
      { 
        productCode: 'PRD003', 
        productName: '传感器C', 
        unit: '个', 
        plannedQty: 10, 
        actualQty: 10, 
        qualifiedQty: 0,
        defectiveQty: 0,
        unitPrice: 800, 
        amount: 8000,
        batchNo: 'B202401007',
        location: 'A-02-01'
      }
    ],
    qualityReport: '盘点发现库存差异，调整入库',
    remark: '库存盘点调整'
  }
];

const ProductReceipt: React.FC = () => {
  const [receipts, setReceipts] = useState(mockProductReceipts);
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
      render: (type: string) => (
        <Tag color="blue">{receiptTypeConfig[type]}</Tag>
      ),
    },
    {
      title: '生产订单',
      dataIndex: 'productionOrder',
      key: 'productionOrder',
      width: 120,
      render: (order: string) => order || '-',
    },
    {
      title: '入库日期',
      dataIndex: 'receiptDate',
      key: 'receiptDate',
      width: 110,
    },
    {
      title: '入库数量',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      width: 100,
      render: (quantity: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {quantity.toLocaleString()}
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
      title: '仓库',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 120,
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
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
      width: 80,
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
            onClick={() => handleViewDetail(record.receiptNo)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === ReceiptStatus.COMPLETED || record.status === ReceiptStatus.REJECTED}
          >
            编辑
          </Button>
          {record.status === ReceiptStatus.DRAFT && (
            <Button
              type="text"
              icon={<SendOutlined />}
              size="small"
              onClick={() => handleSubmit(record.id)}
            >
              提交
            </Button>
          )}
          {record.status === ReceiptStatus.INSPECTING && (
            <Button
              type="text"
              icon={<InboxOutlined />}
              size="small"
              style={{ color: '#52c41a' }}
              onClick={() => handleReceive(record.id)}
            >
              入库
            </Button>
          )}
          <Button
            type="text"
            icon={<QrcodeOutlined />}
            size="small"
            onClick={handlePrintLabel}
          >
            标签
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

  // 处理提交
  const handleSubmit = (id: number) => {
    Modal.confirm({
      title: '提交入库单',
      content: '确定要提交这个产品入库单吗？',
      onOk() {
        setReceipts(receipts.map(r => 
          r.id === id ? { ...r, status: ReceiptStatus.SUBMITTED } : r
        ));
        message.success('入库单已提交，等待质检');
      },
    });
  };

  // 处理入库
  const handleReceive = (id: number) => {
    Modal.confirm({
      title: '确认入库',
      content: '确定要完成这批产品的入库操作吗？',
      onOk() {
        setReceipts(receipts.map(r => 
          r.id === id ? { 
            ...r, 
            status: ReceiptStatus.RECEIVED
          } : r
        ));
        message.success('产品入库成功');
      },
    });
  };

  // 处理打印标签
  const handlePrintLabel = () => {
    message.info('正在生成产品标签...');
  };

  // 处理新建入库单
  const handleCreate = () => {
    setSelectedReceipt(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出产品入库数据');
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
          receiptNo: `PR${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          ...values,
          status: ReceiptStatus.DRAFT,
          receiptDate: new Date().toISOString().split('T')[0],
          inspector: null,
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
      receipt.warehouse.toLowerCase().includes(searchText.toLowerCase()) ||
      receipt.operator.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || receipt.status === statusFilter;
    const matchType = !typeFilter || receipt.receiptType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  // 统计数据
  const statistics = {
    total: receipts.length,
    draft: receipts.filter(r => r.status === ReceiptStatus.DRAFT).length,
    inspecting: receipts.filter(r => r.status === ReceiptStatus.INSPECTING).length,
    completed: receipts.filter(r => r.status === ReceiptStatus.COMPLETED).length,
    totalQuantity: receipts.reduce((sum, receipt) => sum + receipt.totalQuantity, 0),
    totalAmount: receipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0)
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
              title="质检中"
              value={statistics.inspecting}
              suffix="单"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="入库数量"
              value={statistics.totalQuantity}
              suffix="件"
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
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>产品入库管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建入库
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
              placeholder="搜索入库单号、仓库或操作员"
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
              {Object.entries(receiptTypeConfig).map(([key, text]) => (
                <Option key={key} value={key}>
                  {text}
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
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 入库详情弹窗 */}
      <Modal
        title="产品入库详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedReceipt && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>入库单号：</strong>{selectedReceipt.receiptNo}</p>
                <p><strong>入库类型：</strong>
                  <Tag color="blue">{receiptTypeConfig[selectedReceipt.receiptType]}</Tag>
                </p>
                <p><strong>生产订单：</strong>{selectedReceipt.productionOrder || '无'}</p>
                <p><strong>入库日期：</strong>{selectedReceipt.receiptDate}</p>
                <p><strong>仓库：</strong>{selectedReceipt.warehouse}</p>
              </Col>
              <Col span={12}>
                <p><strong>入库状态：</strong>
                  <Tag color={statusConfig[selectedReceipt.status].color} icon={statusConfig[selectedReceipt.status].icon}>
                    {statusConfig[selectedReceipt.status].text}
                  </Tag>
                </p>
                <p><strong>操作员：</strong>{selectedReceipt.operator}</p>
                <p><strong>质检员：</strong>{selectedReceipt.inspector || '未分配'}</p>
                <p><strong>入库数量：</strong>{selectedReceipt.totalQuantity.toLocaleString()}</p>
                <p><strong>入库金额：</strong>¥{selectedReceipt.totalAmount.toLocaleString()}</p>
              </Col>
            </Row>
            
            <Divider />
            
            <h4>入库明细</h4>
            <Table
              columns={[
                { title: '产品编码', dataIndex: 'productCode', key: 'productCode' },
                { title: '产品名称', dataIndex: 'productName', key: 'productName' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '计划数量', dataIndex: 'plannedQty', key: 'plannedQty' },
                { title: '实际数量', dataIndex: 'actualQty', key: 'actualQty' },
                { 
                  title: '合格数量', 
                  dataIndex: 'qualifiedQty', 
                  key: 'qualifiedQty',
                  render: (qty: number, record: any) => (
                    <span style={{ color: qty === record.actualQty ? '#52c41a' : '#faad14' }}>
                      {qty}
                    </span>
                  )
                },
                { 
                  title: '不良数量', 
                  dataIndex: 'defectiveQty', 
                  key: 'defectiveQty',
                  render: (qty: number) => (
                    <span style={{ color: qty > 0 ? '#f5222d' : '#52c41a' }}>
                      {qty}
                    </span>
                  )
                },
                { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (price: number) => `¥${price}` },
                { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
                { title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
                { title: '库位', dataIndex: 'location', key: 'location' },
              ]}
              dataSource={selectedReceipt.items}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={8}>
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={8}>
                    <strong style={{ color: '#f5222d' }}>
                      ¥{selectedReceipt.totalAmount.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={9} colSpan={2} />
                </Table.Summary.Row>
              )}
            />
            
            <Divider />
            
            <div style={{ marginBottom: '16px' }}>
              <h4>质检报告</h4>
              <p style={{ color: '#666', marginLeft: '16px' }}>{selectedReceipt.qualityReport}</p>
            </div>
            
            {selectedReceipt.remark && (
              <div>
                <p><strong>备注：</strong>{selectedReceipt.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑入库弹窗 */}
      <Modal
        title={selectedReceipt ? '编辑产品入库单' : '新建产品入库单'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            status: ReceiptStatus.DRAFT,
            receiptType: ReceiptType.PRODUCTION
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
                  {Object.entries(receiptTypeConfig).map(([key, text]) => (
                    <Option key={key} value={key}>
                      {text}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="仓库"
                name="warehouse"
                rules={[{ required: true, message: '请选择仓库' }]}
              >
                <Select placeholder="请选择仓库">
                  <Option value="成品仓库A">成品仓库A</Option>
                  <Option value="成品仓库B">成品仓库B</Option>
                  <Option value="成品仓库C">成品仓库C</Option>
                  <Option value="退货仓库">退货仓库</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="操作员"
                name="operator"
                rules={[{ required: true, message: '请输入操作员' }]}
              >
                <Input placeholder="请输入操作员" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="生产订单"
                name="productionOrder"
              >
                <Input placeholder="请输入生产订单号（如有）" />
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
            label="质检报告"
            name="qualityReport"
          >
            <TextArea rows={2} placeholder="请输入质检报告" />
          </Form.Item>
          
          <Form.Item
            label="备注"
            name="remark"
          >
            <TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductReceipt;
