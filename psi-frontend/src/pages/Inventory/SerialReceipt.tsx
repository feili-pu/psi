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
  message,
  Divider,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  QrcodeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  PrinterOutlined,
  ScanOutlined,
  BarcodeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 入库类型枚举
const ReceiptType = {
  PURCHASE: 'purchase',
  PRODUCTION: 'production',
  RETURN: 'return',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment'
};

// 入库状态枚举
const ReceiptStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// 序列号状态枚举
const SerialStatus = {
  NORMAL: 'normal',
  DEFECTIVE: 'defective',
  QUARANTINE: 'quarantine'
};

// 状态配置
const receiptStatusConfig = {
  [ReceiptStatus.PENDING]: { color: 'default', text: '待处理', icon: <ClockCircleOutlined /> },
  [ReceiptStatus.IN_PROGRESS]: { color: 'processing', text: '处理中', icon: <ExclamationCircleOutlined /> },
  [ReceiptStatus.COMPLETED]: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
  [ReceiptStatus.CANCELLED]: { color: 'error', text: '已取消', icon: <WarningOutlined /> }
};

const serialStatusConfig = {
  [SerialStatus.NORMAL]: { color: 'green', text: '正常' },
  [SerialStatus.DEFECTIVE]: { color: 'red', text: '不良品' },
  [SerialStatus.QUARANTINE]: { color: 'orange', text: '隔离' }
};

// 模拟序列号入库数据
const mockSerialReceipts = [
  {
    id: 1,
    receiptNo: 'SR202401001',
    receiptDate: '2024-01-15',
    receiptType: ReceiptType.PURCHASE,
    status: ReceiptStatus.COMPLETED,
    productCode: 'PRD001',
    productName: '电子设备A',
    batchNo: 'B202401001',
    supplier: '深圳电子科技',
    purchaseOrderNo: 'PO202401001',
    warehouse: '成品仓库A',
    location: 'A-01-01',
    totalQuantity: 50,
    receivedQuantity: 50,
    qualifiedQuantity: 48,
    defectiveQuantity: 2,
    unitCost: 500.00,
    totalCost: 25000.00,
    operator: '张三',
    inspector: '李四',
    remark: '采购入库，质检合格',
    serialNumbers: [
      { serialNo: 'SN202401001001', status: SerialStatus.NORMAL, location: 'A-01-01-001' },
      { serialNo: 'SN202401001002', status: SerialStatus.NORMAL, location: 'A-01-01-002' },
      { serialNo: 'SN202401001003', status: SerialStatus.DEFECTIVE, location: 'R-01-01-001' }
    ]
  },
  {
    id: 2,
    receiptNo: 'SR202401002',
    receiptDate: '2024-01-16',
    receiptType: ReceiptType.PRODUCTION,
    status: ReceiptStatus.IN_PROGRESS,
    productCode: 'PRD002',
    productName: '控制器B',
    batchNo: 'B202401002',
    supplier: '生产车间',
    purchaseOrderNo: 'WO202401001',
    warehouse: '成品仓库A',
    location: 'A-02-01',
    totalQuantity: 30,
    receivedQuantity: 25,
    qualifiedQuantity: 25,
    defectiveQuantity: 0,
    unitCost: 150.00,
    totalCost: 3750.00,
    operator: '王五',
    inspector: '赵六',
    remark: '生产入库，正在处理中',
    serialNumbers: [
      { serialNo: 'SN202401002001', status: SerialStatus.NORMAL, location: 'A-02-01-001' },
      { serialNo: 'SN202401002002', status: SerialStatus.NORMAL, location: 'A-02-01-002' }
    ]
  },
  {
    id: 3,
    receiptNo: 'SR202401003',
    receiptDate: '2024-01-17',
    receiptType: ReceiptType.RETURN,
    status: ReceiptStatus.COMPLETED,
    productCode: 'PRD003',
    productName: '传感器C',
    batchNo: 'B202401003',
    supplier: '客户退回',
    purchaseOrderNo: 'RMA202401001',
    warehouse: '退货仓库',
    location: 'R-01-01',
    totalQuantity: 5,
    receivedQuantity: 5,
    qualifiedQuantity: 3,
    defectiveQuantity: 2,
    unitCost: 160.00,
    totalCost: 800.00,
    operator: '孙七',
    inspector: '周八',
    remark: '客户退货入库',
    serialNumbers: [
      { serialNo: 'SN202401003001', status: SerialStatus.QUARANTINE, location: 'R-01-01-001' },
      { serialNo: 'SN202401003002', status: SerialStatus.DEFECTIVE, location: 'R-01-01-002' }
    ]
  },
  {
    id: 4,
    receiptNo: 'SR202401004',
    receiptDate: '2024-01-18',
    receiptType: ReceiptType.TRANSFER,
    status: ReceiptStatus.PENDING,
    productCode: 'PRD004',
    productName: '显示屏D',
    batchNo: 'B202401004',
    supplier: '分公司调拨',
    purchaseOrderNo: 'TR202401001',
    warehouse: '成品仓库B',
    location: 'B-01-01',
    totalQuantity: 20,
    receivedQuantity: 0,
    qualifiedQuantity: 0,
    defectiveQuantity: 0,
    unitCost: 800.00,
    totalCost: 16000.00,
    operator: '吴九',
    inspector: '郑十',
    remark: '待处理调拨入库',
    serialNumbers: []
  }
];

const SerialReceipt: React.FC = () => {
  const [receipts, setReceipts] = useState(mockSerialReceipts);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<any>(null);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '入库单号',
      dataIndex: 'receiptNo',
      key: 'receiptNo',
      width: 130,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: '入库日期',
      dataIndex: 'receiptDate',
      key: 'receiptDate',
      width: 110,
    },
    {
      title: '入库类型',
      dataIndex: 'receiptType',
      key: 'receiptType',
      width: 100,
      render: (type: string) => {
        const typeMap = {
          [ReceiptType.PURCHASE]: { color: 'blue', text: '采购入库' },
          [ReceiptType.PRODUCTION]: { color: 'green', text: '生产入库' },
          [ReceiptType.RETURN]: { color: 'orange', text: '退货入库' },
          [ReceiptType.TRANSFER]: { color: 'purple', text: '调拨入库' },
          [ReceiptType.ADJUSTMENT]: { color: 'cyan', text: '调整入库' }
        };
        const config = typeMap[type];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = receiptStatusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '产品信息',
      key: 'product',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.productName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.productCode}</div>
        </div>
      ),
    },
    {
      title: '批次号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      width: 120,
    },
    {
      title: '供应商/来源',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 120,
    },
    {
      title: '仓库',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 120,
    },
    {
      title: '数量统计',
      key: 'quantity',
      width: 120,
      render: (_, record) => (
        <div>
          <div>总数: {record.totalQuantity}</div>
          <div style={{ fontSize: '12px', color: '#52c41a' }}>
            合格: {record.qualifiedQuantity}
          </div>
          <div style={{ fontSize: '12px', color: '#f5222d' }}>
            不良: {record.defectiveQuantity}
          </div>
        </div>
      ),
    },
    {
      title: '总成本',
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 120,
      render: (cost: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{cost.toLocaleString()}
        </span>
      ),
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
            onClick={() => handleEdit(record)}
            disabled={record.status === ReceiptStatus.COMPLETED}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={<BarcodeOutlined />}
            size="small"
            onClick={() => handleManageSerials(record)}
          >
            序列号
          </Button>
          <Button
            type="text"
            icon={<PrinterOutlined />}
            size="small"
            onClick={() => handlePrint(record.receiptNo)}
          >
            打印
          </Button>
        </Space>
      ),
    },
  ];

  // 处理新增
  const handleAdd = () => {
    setEditingReceipt(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (receipt: any) => {
    setEditingReceipt(receipt);
    form.setFieldsValue({
      ...receipt,
      receiptDate: receipt.receiptDate,
    });
    setModalVisible(true);
  };

  // 处理查看详情
  const handleViewDetail = (receiptNo: string) => {
    const receipt = receipts.find(r => r.receiptNo === receiptNo);
    setSelectedReceipt(receipt);
    setDetailModalVisible(true);
  };

  // 处理序列号管理
  const handleManageSerials = (receipt: any) => {
    setSelectedReceipt(receipt);
    setSerialModalVisible(true);
  };

  // 处理打印
  const handlePrint = (receiptNo: string) => {
    message.info(`正在打印入库单 ${receiptNo}...`);
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingReceipt) {
        // 编辑
        setReceipts(receipts.map(r => 
          r.id === editingReceipt.id ? { ...r, ...values } : r
        ));
        message.success('修改成功');
      } else {
        // 新增
        const newReceipt = {
          id: Date.now(),
          receiptNo: `SR${Date.now()}`,
          ...values,
          receivedQuantity: 0,
          qualifiedQuantity: 0,
          defectiveQuantity: 0,
          totalCost: values.totalQuantity * values.unitCost,
          serialNumbers: []
        };
        setReceipts([newReceipt, ...receipts]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出序列号入库数据');
  };

  // 处理批量导入
  const handleImport = () => {
    message.info('批量导入序列号');
  };

  // 过滤数据
  const filteredReceipts = receipts.filter(receipt => {
    const matchSearch = !searchText || 
      receipt.receiptNo.toLowerCase().includes(searchText.toLowerCase()) ||
      receipt.productName.toLowerCase().includes(searchText.toLowerCase()) ||
      receipt.productCode.toLowerCase().includes(searchText.toLowerCase()) ||
      receipt.supplier.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || receipt.status === statusFilter;
    const matchType = !typeFilter || receipt.receiptType === typeFilter;
    const matchWarehouse = !warehouseFilter || receipt.warehouse === warehouseFilter;
    return matchSearch && matchStatus && matchType && matchWarehouse;
  });

  // 统计数据
  const statistics = {
    total: receipts.length,
    pending: receipts.filter(r => r.status === ReceiptStatus.PENDING).length,
    inProgress: receipts.filter(r => r.status === ReceiptStatus.IN_PROGRESS).length,
    completed: receipts.filter(r => r.status === ReceiptStatus.COMPLETED).length,
    totalValue: receipts
      .filter(r => r.status === ReceiptStatus.COMPLETED)
      .reduce((sum, receipt) => sum + receipt.totalCost, 0)
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
              style={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理"
              value={statistics.pending}
              suffix="单"
              style={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={statistics.completed}
              suffix="单"
              style={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="入库价值"
              value={statistics.totalValue}
              precision={0}
              prefix="¥"
              style={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarcodeOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>序列号入库管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增入库
            </Button>
            <Button
              icon={<ImportOutlined />}
              onClick={handleImport}
            >
              批量导入
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
              placeholder="搜索入库单号、产品名称或供应商"
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
              {Object.entries(receiptStatusConfig).map(([key, config]) => (
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
              <Option value={ReceiptType.PURCHASE}>采购入库</Option>
              <Option value={ReceiptType.PRODUCTION}>生产入库</Option>
              <Option value={ReceiptType.RETURN}>退货入库</Option>
              <Option value={ReceiptType.TRANSFER}>调拨入库</Option>
              <Option value={ReceiptType.ADJUSTMENT}>调整入库</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="选择仓库"
              value={warehouseFilter}
              onChange={setWarehouseFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="成品仓库A">成品仓库A</Option>
              <Option value="成品仓库B">成品仓库B</Option>
              <Option value="退货仓库">退货仓库</Option>
            </Select>
          </Col>
          <Col span={6}>
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
          scroll={{ x: 1800 }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingReceipt ? '编辑入库单' : '新增入库单'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            receiptDate: new Date().toISOString().split('T')[0],
            status: ReceiptStatus.PENDING,
            receiptType: ReceiptType.PURCHASE
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="入库日期"
                name="receiptDate"
                rules={[{ required: true, message: '请选择入库日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="入库类型"
                name="receiptType"
                rules={[{ required: true, message: '请选择入库类型' }]}
              >
                <Select>
                  <Option value={ReceiptType.PURCHASE}>采购入库</Option>
                  <Option value={ReceiptType.PRODUCTION}>生产入库</Option>
                  <Option value={ReceiptType.RETURN}>退货入库</Option>
                  <Option value={ReceiptType.TRANSFER}>调拨入库</Option>
                  <Option value={ReceiptType.ADJUSTMENT}>调整入库</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="产品编码"
                name="productCode"
                rules={[{ required: true, message: '请输入产品编码' }]}
              >
                <Input placeholder="请输入产品编码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="产品名称"
                name="productName"
                rules={[{ required: true, message: '请输入产品名称' }]}
              >
                <Input placeholder="请输入产品名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="批次号"
                name="batchNo"
                rules={[{ required: true, message: '请输入批次号' }]}
              >
                <Input placeholder="请输入批次号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="供应商/来源"
                name="supplier"
                rules={[{ required: true, message: '请输入供应商' }]}
              >
                <Input placeholder="请输入供应商" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="仓库"
                name="warehouse"
                rules={[{ required: true, message: '请选择仓库' }]}
              >
                <Select placeholder="请选择仓库">
                  <Option value="成品仓库A">成品仓库A</Option>
                  <Option value="成品仓库B">成品仓库B</Option>
                  <Option value="退货仓库">退货仓库</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="库位"
                name="location"
                rules={[{ required: true, message: '请输入库位' }]}
              >
                <Input placeholder="请输入库位" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="计划数量"
                name="totalQuantity"
                rules={[{ required: true, message: '请输入计划数量' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="请输入计划数量"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="单位成本"
                name="unitCost"
                rules={[{ required: true, message: '请输入单位成本' }]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                  placeholder="请输入单位成本"
                  addonBefore="¥"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value={ReceiptStatus.PENDING}>待处理</Option>
                  <Option value={ReceiptStatus.IN_PROGRESS}>处理中</Option>
                  <Option value={ReceiptStatus.COMPLETED}>已完成</Option>
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
                label="质检员"
                name="inspector"
              >
                <Input placeholder="请输入质检员" />
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

      {/* 详情弹窗 */}
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
                <p><strong>入库日期：</strong>{selectedReceipt.receiptDate}</p>
                <p><strong>入库类型：</strong>
                  <Tag color="blue">
                    {selectedReceipt.receiptType === ReceiptType.PURCHASE ? '采购入库' :
                     selectedReceipt.receiptType === ReceiptType.PRODUCTION ? '生产入库' :
                     selectedReceipt.receiptType === ReceiptType.RETURN ? '退货入库' :
                     selectedReceipt.receiptType === ReceiptType.TRANSFER ? '调拨入库' : '调整入库'}
                  </Tag>
                </p>
                <p><strong>状态：</strong>
                  <Tag color={receiptStatusConfig[selectedReceipt.status].color} icon={receiptStatusConfig[selectedReceipt.status].icon}>
                    {receiptStatusConfig[selectedReceipt.status].text}
                  </Tag>
                </p>
                <p><strong>产品编码：</strong>{selectedReceipt.productCode}</p>
                <p><strong>产品名称：</strong>{selectedReceipt.productName}</p>
                <p><strong>批次号：</strong>{selectedReceipt.batchNo}</p>
              </Col>
              <Col span={12}>
                <p><strong>供应商/来源：</strong>{selectedReceipt.supplier}</p>
                <p><strong>采购单号：</strong>{selectedReceipt.purchaseOrderNo}</p>
                <p><strong>仓库：</strong>{selectedReceipt.warehouse}</p>
                <p><strong>库位：</strong>{selectedReceipt.location}</p>
                <p><strong>操作员：</strong>{selectedReceipt.operator}</p>
                <p><strong>质检员：</strong>{selectedReceipt.inspector}</p>
                <p><strong>备注：</strong>{selectedReceipt.remark}</p>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={6}>
                <Statistic title="计划数量" value={selectedReceipt.totalQuantity} suffix="件" />
              </Col>
              <Col span={6}>
                <Statistic title="已收数量" value={selectedReceipt.receivedQuantity} suffix="件" />
              </Col>
              <Col span={6}>
                <Statistic title="合格数量" value={selectedReceipt.qualifiedQuantity} suffix="件" />
              </Col>
              <Col span={6}>
                <Statistic title="不良数量" value={selectedReceipt.defectiveQuantity} suffix="件" />
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="单位成本"
                  value={selectedReceipt.unitCost}
                  precision={2}
                  prefix="¥"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="总成本"
                  value={selectedReceipt.totalCost}
                  precision={2}
                  prefix="¥"
                />
              </Col>
            </Row>

            {selectedReceipt.serialNumbers && selectedReceipt.serialNumbers.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <Divider />
                <h4>序列号列表</h4>
                <Table
                  size="small"
                  dataSource={selectedReceipt.serialNumbers}
                  pagination={false}
                  columns={[
                    {
                      title: '序列号',
                      dataIndex: 'serialNo',
                      key: 'serialNo',
                    },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status: string) => {
                        const config = serialStatusConfig[status];
                        return <Tag color={config.color}>{config.text}</Tag>;
                      },
                    },
                    {
                      title: '库位',
                      dataIndex: 'location',
                      key: 'location',
                    },
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 序列号管理弹窗 */}
      <Modal
        title="序列号管理"
        open={serialModalVisible}
        onCancel={() => setSerialModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedReceipt && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <p><strong>入库单号：</strong>{selectedReceipt.receiptNo}</p>
              <p><strong>产品：</strong>{selectedReceipt.productName} ({selectedReceipt.productCode})</p>
              <p><strong>批次：</strong>{selectedReceipt.batchNo}</p>
            </div>
            
            <Divider />
            
            <div style={{ marginBottom: '16px' }}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  添加序列号
                </Button>
                <Button icon={<ScanOutlined />}>
                  扫码录入
                </Button>
                <Button icon={<ImportOutlined />}>
                  批量导入
                </Button>
                <Button icon={<QrcodeOutlined />}>
                  生成二维码
                </Button>
              </Space>
            </div>
            
            <Table
              size="small"
              dataSource={selectedReceipt.serialNumbers}
              pagination={false}
              columns={[
                {
                  title: '序列号',
                  dataIndex: 'serialNo',
                  key: 'serialNo',
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => {
                    const config = serialStatusConfig[status];
                    return <Tag color={config.color}>{config.text}</Tag>;
                  },
                },
                {
                  title: '库位',
                  dataIndex: 'location',
                  key: 'location',
                },
                {
                  title: '操作',
                  key: 'action',
                  render: () => (
                    <Space size="small">
                      <Button type="text" size="small" icon={<EditOutlined />}>
                        编辑
                      </Button>
                      <Button type="text" size="small" icon={<QrcodeOutlined />}>
                        二维码
                      </Button>
                      <Button type="text" size="small" icon={<DeleteOutlined />} danger>
                        删除
                      </Button>
                    </Space>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SerialReceipt;