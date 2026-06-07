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
  message,
  Divider,
  QRCode
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ExportOutlined,
  QrcodeOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  PrinterOutlined,
  ScanOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 序列号状态枚举
const SerialStatus = {
  IN_STOCK: 'in_stock',
  RESERVED: 'reserved',
  SHIPPED: 'shipped',
  SOLD: 'sold',
  RETURNED: 'returned',
  DEFECTIVE: 'defective',
  SCRAPPED: 'scrapped'
};

// 状态标签配置
const statusConfig = {
  [SerialStatus.IN_STOCK]: { color: 'green', text: '在库', icon: <InboxOutlined /> },
  [SerialStatus.RESERVED]: { color: 'blue', text: '预留', icon: <ClockCircleOutlined /> },
  [SerialStatus.SHIPPED]: { color: 'orange', text: '已发货', icon: <ExclamationCircleOutlined /> },
  [SerialStatus.SOLD]: { color: 'purple', text: '已销售', icon: <CheckCircleOutlined /> },
  [SerialStatus.RETURNED]: { color: 'cyan', text: '已退回', icon: <ExclamationCircleOutlined /> },
  [SerialStatus.DEFECTIVE]: { color: 'red', text: '不良品', icon: <WarningOutlined /> },
  [SerialStatus.SCRAPPED]: { color: 'default', text: '已报废', icon: <ExclamationCircleOutlined /> }
};

// 模拟序列号库存数据
const mockSerialInventory = [
  {
    id: 1,
    serialNumber: 'SN202401001001',
    productCode: 'PRD001',
    productName: '电子设备A',
    batchNo: 'B202401001',
    manufactureDate: '2024-01-15',
    warrantyPeriod: 365,
    warrantyExpiry: '2025-01-15',
    status: SerialStatus.IN_STOCK,
    location: 'A-01-01-001',
    warehouse: '成品仓库A',
    supplier: '深圳电子科技',
    customer: null,
    orderNo: null,
    receiptDate: '2024-01-15',
    shipDate: null,
    lastMoveDate: '2024-01-15',
    unitCost: 500.00,
    salePrice: 750.00,
    qualityGrade: 'A',
    remark: '正常库存'
  },
  {
    id: 2,
    serialNumber: 'SN202401001002',
    productCode: 'PRD001',
    productName: '电子设备A',
    batchNo: 'B202401001',
    manufactureDate: '2024-01-15',
    warrantyPeriod: 365,
    warrantyExpiry: '2025-01-15',
    status: SerialStatus.RESERVED,
    location: 'A-01-01-002',
    warehouse: '成品仓库A',
    supplier: '深圳电子科技',
    customer: '客户A',
    orderNo: 'SO202401001',
    receiptDate: '2024-01-15',
    shipDate: null,
    lastMoveDate: '2024-01-16',
    unitCost: 500.00,
    salePrice: 750.00,
    qualityGrade: 'A',
    remark: '已预留给客户A'
  },
  {
    id: 3,
    serialNumber: 'SN202401002001',
    productCode: 'PRD002',
    productName: '控制器B',
    batchNo: 'B202401002',
    manufactureDate: '2024-01-16',
    warrantyPeriod: 730,
    warrantyExpiry: '2026-01-16',
    status: SerialStatus.SHIPPED,
    location: null,
    warehouse: null,
    supplier: '北京办公用品',
    customer: '客户B',
    orderNo: 'SO202401002',
    receiptDate: '2024-01-16',
    shipDate: '2024-01-17',
    lastMoveDate: '2024-01-17',
    unitCost: 150.00,
    salePrice: 225.00,
    qualityGrade: 'A',
    remark: '已发货给客户B'
  },
  {
    id: 4,
    serialNumber: 'SN202401003001',
    productCode: 'PRD003',
    productName: '传感器C',
    batchNo: 'B202401003',
    manufactureDate: '2024-01-17',
    warrantyPeriod: 365,
    warrantyExpiry: '2025-01-17',
    status: SerialStatus.DEFECTIVE,
    location: 'R-01-01-001',
    warehouse: '退货仓库',
    supplier: '广州工业设备',
    customer: '客户C',
    orderNo: 'SO202401003',
    receiptDate: '2024-01-17',
    shipDate: '2024-01-18',
    lastMoveDate: '2024-01-19',
    unitCost: 160.00,
    salePrice: 240.00,
    qualityGrade: 'C',
    remark: '客户退回，质量问题'
  },
  {
    id: 5,
    serialNumber: 'SN202401004001',
    productCode: 'PRD004',
    productName: '显示屏D',
    batchNo: 'B202401004',
    manufactureDate: '2024-01-18',
    warrantyPeriod: 1095,
    warrantyExpiry: '2027-01-18',
    status: SerialStatus.SOLD,
    location: null,
    warehouse: null,
    supplier: '杭州科技设备',
    customer: '客户D',
    orderNo: 'SO202401004',
    receiptDate: '2024-01-18',
    shipDate: '2024-01-19',
    lastMoveDate: '2024-01-19',
    unitCost: 800.00,
    salePrice: 1200.00,
    qualityGrade: 'A',
    remark: '已完成销售'
  },
  {
    id: 6,
    serialNumber: 'SN202401001003',
    productCode: 'PRD001',
    productName: '电子设备A',
    batchNo: 'B202401001',
    manufactureDate: '2024-01-15',
    warrantyPeriod: 365,
    warrantyExpiry: '2025-01-15',
    status: SerialStatus.RETURNED,
    location: 'R-01-02-001',
    warehouse: '退货仓库',
    supplier: '深圳电子科技',
    customer: '客户E',
    orderNo: 'SO202401005',
    receiptDate: '2024-01-15',
    shipDate: '2024-01-16',
    lastMoveDate: '2024-01-20',
    unitCost: 500.00,
    salePrice: 750.00,
    qualityGrade: 'B',
    remark: '客户退货，功能正常'
  }
];

const SerialInventory: React.FC = () => {
  const [serials] = useState(mockSerialInventory);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedSerial, setSelectedSerial] = useState<any>(null);

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '序列号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: 150,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
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
      title: '生产日期',
      dataIndex: 'manufactureDate',
      key: 'manufactureDate',
      width: 110,
    },
    {
      title: '保修期至',
      dataIndex: 'warrantyExpiry',
      key: 'warrantyExpiry',
      width: 110,
      render: (date: string) => {
        const isExpired = new Date(date) < new Date();
        return (
          <span style={{ color: isExpired ? '#f5222d' : '#666' }}>
            {date}
          </span>
        );
      },
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
      title: '库位',
      dataIndex: 'location',
      key: 'location',
      width: 120,
      render: (location: string) => location || '-',
    },
    {
      title: '仓库',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 120,
      render: (warehouse: string) => warehouse || '-',
    },
    {
      title: '质量等级',
      dataIndex: 'qualityGrade',
      key: 'qualityGrade',
      width: 80,
      render: (grade: string) => (
        <Tag color={grade === 'A' ? 'green' : grade === 'B' ? 'blue' : 'orange'}>
          {grade}级
        </Tag>
      ),
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      width: 100,
      render: (customer: string) => customer || '-',
    },
    {
      title: '成本',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 100,
      render: (cost: number) => (
        <span style={{ color: '#f5222d' }}>
          ¥{cost.toLocaleString()}
        </span>
      ),
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
            onClick={() => handleViewDetail(record.serialNumber)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<QrcodeOutlined />}
            size="small"
            onClick={() => handleShowQR(record.serialNumber)}
          >
            二维码
          </Button>
          <Button
            type="text"
            icon={<PrinterOutlined />}
            size="small"
            onClick={() => handlePrintLabel(record.serialNumber)}
          >
            标签
          </Button>
          <Button
            type="text"
            icon={<ScanOutlined />}
            size="small"
            onClick={() => handleTrack(record.serialNumber)}
          >
            追踪
          </Button>
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (serialNumber: string) => {
    const serial = serials.find(s => s.serialNumber === serialNumber);
    setSelectedSerial(serial);
    setDetailModalVisible(true);
  };

  // 处理显示二维码
  const handleShowQR = (serialNumber: string) => {
    const serial = serials.find(s => s.serialNumber === serialNumber);
    setSelectedSerial(serial);
    setQrModalVisible(true);
  };

  // 处理打印标签
  const handlePrintLabel = (serialNumber: string) => {
    message.info(`正在打印序列号 ${serialNumber} 的标签...`);
  };

  // 处理追踪
  const handleTrack = (serialNumber: string) => {
    message.info(`查看序列号 ${serialNumber} 的流转记录...`);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出序列号库存数据');
  };

  // 过滤数据
  const filteredSerials = serials.filter(serial => {
    const matchSearch = !searchText || 
      serial.serialNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      serial.productName.toLowerCase().includes(searchText.toLowerCase()) ||
      serial.productCode.toLowerCase().includes(searchText.toLowerCase()) ||
      (serial.customer && serial.customer.toLowerCase().includes(searchText.toLowerCase()));
    const matchStatus = !statusFilter || serial.status === statusFilter;
    const matchProduct = !productFilter || serial.productCode === productFilter;
    const matchWarehouse = !warehouseFilter || serial.warehouse === warehouseFilter;
    return matchSearch && matchStatus && matchProduct && matchWarehouse;
  });

  // 统计数据
  const statistics = {
    total: serials.length,
    inStock: serials.filter(s => s.status === SerialStatus.IN_STOCK).length,
    reserved: serials.filter(s => s.status === SerialStatus.RESERVED).length,
    shipped: serials.filter(s => s.status === SerialStatus.SHIPPED).length,
    defective: serials.filter(s => s.status === SerialStatus.DEFECTIVE).length,
    totalValue: serials
      .filter(s => s.status === SerialStatus.IN_STOCK || s.status === SerialStatus.RESERVED)
      .reduce((sum, serial) => sum + serial.unitCost, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总序列号"
              value={statistics.total}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在库数量"
              value={statistics.inStock}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="不良品"
              value={statistics.defective}
              suffix="个"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存价值"
              value={statistics.totalValue}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrcodeOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>序列号库存管理</span>
          </div>
        }
        extra={
          <Space>
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
              placeholder="搜索序列号、产品名称或客户"
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
              placeholder="选择产品"
              value={productFilter}
              onChange={setProductFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="PRD001">电子设备A</Option>
              <Option value="PRD002">控制器B</Option>
              <Option value="PRD003">传感器C</Option>
              <Option value="PRD004">显示屏D</Option>
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
          dataSource={filteredSerials}
          rowKey="id"
          pagination={{
            total: filteredSerials.length,
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
          scroll={{ x: 1600 }}
        />
      </Card>

      {/* 序列号详情弹窗 */}
      <Modal
        title="序列号详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedSerial && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>序列号：</strong>{selectedSerial.serialNumber}</p>
                <p><strong>产品编码：</strong>{selectedSerial.productCode}</p>
                <p><strong>产品名称：</strong>{selectedSerial.productName}</p>
                <p><strong>批次号：</strong>{selectedSerial.batchNo}</p>
                <p><strong>生产日期：</strong>{selectedSerial.manufactureDate}</p>
                <p><strong>保修期：</strong>{selectedSerial.warrantyPeriod}天</p>
                <p><strong>保修到期：</strong>{selectedSerial.warrantyExpiry}</p>
              </Col>
              <Col span={12}>
                <p><strong>当前状态：</strong>
                  <Tag color={statusConfig[selectedSerial.status].color} icon={statusConfig[selectedSerial.status].icon}>
                    {statusConfig[selectedSerial.status].text}
                  </Tag>
                </p>
                <p><strong>质量等级：</strong>
                  <Tag color={selectedSerial.qualityGrade === 'A' ? 'green' : selectedSerial.qualityGrade === 'B' ? 'blue' : 'orange'}>
                    {selectedSerial.qualityGrade}级
                  </Tag>
                </p>
                <p><strong>库位：</strong>{selectedSerial.location || '无'}</p>
                <p><strong>仓库：</strong>{selectedSerial.warehouse || '无'}</p>
                <p><strong>供应商：</strong>{selectedSerial.supplier}</p>
                <p><strong>客户：</strong>{selectedSerial.customer || '无'}</p>
                <p><strong>订单号：</strong>{selectedSerial.orderNo || '无'}</p>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>入库日期：</strong>{selectedSerial.receiptDate}</p>
                <p><strong>发货日期：</strong>{selectedSerial.shipDate || '未发货'}</p>
                <p><strong>最后移动：</strong>{selectedSerial.lastMoveDate}</p>
              </Col>
              <Col span={12}>
                <p><strong>单位成本：</strong>
                  <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                    ¥{selectedSerial.unitCost.toLocaleString()}
                  </span>
                </p>
                <p><strong>销售价格：</strong>
                  <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                    ¥{selectedSerial.salePrice.toLocaleString()}
                  </span>
                </p>
              </Col>
            </Row>
            
            {selectedSerial.remark && (
              <div>
                <p><strong>备注：</strong>{selectedSerial.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 二维码弹窗 */}
      <Modal
        title="序列号二维码"
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => message.info('打印二维码')}>
            打印
          </Button>,
          <Button key="close" onClick={() => setQrModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={400}
      >
        {selectedSerial && (
          <div style={{ textAlign: 'center' }}>
            <QRCode
              value={selectedSerial.serialNumber}
              size={200}
              style={{ marginBottom: '16px' }}
            />
            <div>
              <p><strong>序列号：</strong>{selectedSerial.serialNumber}</p>
              <p><strong>产品：</strong>{selectedSerial.productName}</p>
              <p><strong>批次：</strong>{selectedSerial.batchNo}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SerialInventory;
