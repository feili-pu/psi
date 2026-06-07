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
  Rate,
  Avatar
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  ExportOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 报价状态枚举
const QuotationStatus = {
  RECEIVED: 'received',
  EVALUATING: 'evaluating',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired'
};

// 状态标签配置
const statusConfig = {
  [QuotationStatus.RECEIVED]: { color: 'blue', text: '已收到', icon: <ClockCircleOutlined /> },
  [QuotationStatus.EVALUATING]: { color: 'orange', text: '评估中', icon: <ExclamationCircleOutlined /> },
  [QuotationStatus.ACCEPTED]: { color: 'green', text: '已接受', icon: <CheckCircleOutlined /> },
  [QuotationStatus.REJECTED]: { color: 'red', text: '已拒绝', icon: <ExclamationCircleOutlined /> },
  [QuotationStatus.EXPIRED]: { color: 'default', text: '已过期', icon: <ClockCircleOutlined /> }
};

// 模拟供应商报价数据
const mockSupplierQuotations = [
  {
    id: 1,
    quotationNo: 'SQ202401001',
    supplierName: '深圳电子科技有限公司',
    supplierContact: '王经理',
    supplierPhone: '13800138001',
    supplierEmail: 'wang@sztech.com',
    supplierRating: 4.5,
    quotationDate: '2024-01-15',
    validUntil: '2024-02-15',
    totalAmount: 185600.00,
    status: QuotationStatus.ACCEPTED,
    items: [
      { productName: 'CPU处理器', quantity: 50, unitPrice: 2800, amount: 140000, deliveryDays: 7 },
      { productName: '内存条8GB', quantity: 100, unitPrice: 320, amount: 32000, deliveryDays: 5 },
      { productName: '固态硬盘', quantity: 80, unitPrice: 168, amount: 13440, deliveryDays: 3 }
    ],
    paymentTerms: '货到付款',
    deliveryTerms: '送货上门',
    warranty: '1年质保',
    remark: '批量采购可享受额外折扣',
    evaluator: '李采购',
    evaluateDate: '2024-01-17'
  },
  {
    id: 2,
    quotationNo: 'SQ202401002',
    supplierName: '北京办公用品供应商',
    supplierContact: '刘总',
    supplierPhone: '13900139002',
    supplierEmail: 'liu@bjoffice.com',
    supplierRating: 4.2,
    quotationDate: '2024-01-16',
    validUntil: '2024-02-16',
    totalAmount: 45800.00,
    status: QuotationStatus.EVALUATING,
    items: [
      { productName: '办公桌', quantity: 20, unitPrice: 1800, amount: 36000, deliveryDays: 10 },
      { productName: '办公椅', quantity: 25, unitPrice: 280, amount: 7000, deliveryDays: 10 },
      { productName: '文件柜', quantity: 10, unitPrice: 280, amount: 2800, deliveryDays: 15 }
    ],
    paymentTerms: '30天账期',
    deliveryTerms: '免费送货安装',
    warranty: '2年质保',
    remark: '提供免费安装服务',
    evaluator: '张采购',
    evaluateDate: null
  },
  {
    id: 3,
    quotationNo: 'SQ202401003',
    supplierName: '广州工业设备公司',
    supplierContact: '陈主管',
    supplierPhone: '13700137003',
    supplierEmail: 'chen@gzequip.com',
    supplierRating: 4.8,
    quotationDate: '2024-01-17',
    validUntil: '2024-02-17',
    totalAmount: 328000.00,
    status: QuotationStatus.RECEIVED,
    items: [
      { productName: '生产设备A', quantity: 2, unitPrice: 150000, amount: 300000, deliveryDays: 30 },
      { productName: '配套工具', quantity: 1, unitPrice: 28000, amount: 28000, deliveryDays: 15 }
    ],
    paymentTerms: '预付30%，余款货到付清',
    deliveryTerms: '专业运输，现场安装调试',
    warranty: '3年质保，终身维护',
    remark: '设备需要专业安装调试',
    evaluator: null,
    evaluateDate: null
  },
  {
    id: 4,
    quotationNo: 'SQ202401004',
    supplierName: '上海化工材料有限公司',
    supplierContact: '孙经理',
    supplierPhone: '13600136004',
    supplierEmail: 'sun@shchem.com',
    supplierRating: 3.8,
    quotationDate: '2024-01-10',
    validUntil: '2024-01-25',
    totalAmount: 67500.00,
    status: QuotationStatus.EXPIRED,
    items: [
      { productName: '化工原料A', quantity: 500, unitPrice: 120, amount: 60000, deliveryDays: 7 },
      { productName: '包装材料', quantity: 1000, unitPrice: 7.5, amount: 7500, deliveryDays: 5 }
    ],
    paymentTerms: '现金交易',
    deliveryTerms: '客户自提',
    warranty: '无质保',
    remark: '价格已过期，需重新报价',
    evaluator: null,
    evaluateDate: null
  },
  {
    id: 5,
    quotationNo: 'SQ202401005',
    supplierName: '杭州科技设备厂',
    supplierContact: '周总',
    supplierPhone: '13500135005',
    supplierEmail: 'zhou@hztech.com',
    supplierRating: 4.0,
    quotationDate: '2024-01-18',
    validUntil: '2024-02-18',
    totalAmount: 156000.00,
    status: QuotationStatus.REJECTED,
    items: [
      { productName: '测试设备', quantity: 3, unitPrice: 45000, amount: 135000, deliveryDays: 20 },
      { productName: '配件包', quantity: 1, unitPrice: 21000, amount: 21000, deliveryDays: 10 }
    ],
    paymentTerms: '全款预付',
    deliveryTerms: '物流配送',
    warranty: '1年质保',
    remark: '价格偏高，已拒绝',
    evaluator: '王采购',
    evaluateDate: '2024-01-19'
  }
];

const SupplierQuotations: React.FC = () => {
  const [quotations, setQuotations] = useState<any[]>(mockSupplierQuotations);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '报价单号',
      dataIndex: 'quotationNo',
      key: 'quotationNo',
      width: 120,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: '供应商信息',
      key: 'supplierInfo',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={40} 
            icon={<ShopOutlined />} 
            style={{ marginRight: '12px', backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.supplierName}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <Rate disabled defaultValue={record.supplierRating} style={{ fontSize: '12px' }} />
              <span style={{ marginLeft: '4px' }}>{record.supplierRating}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '13px' }}>
            <PhoneOutlined style={{ marginRight: '4px' }} />
            {record.supplierContact}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.supplierPhone}
          </div>
        </div>
      ),
    },
    {
      title: '报价日期',
      dataIndex: 'quotationDate',
      key: 'quotationDate',
      width: 110,
    },
    {
      title: '有效期至',
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 110,
      render: (date: string, record) => {
        const isExpired = new Date(date) < new Date() && record.status !== QuotationStatus.ACCEPTED;
        return (
          <span style={{ color: isExpired ? '#f5222d' : '#666' }}>
            {date}
          </span>
        );
      },
    },
    {
      title: '报价金额',
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
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record.quotationNo)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === QuotationStatus.ACCEPTED || record.status === QuotationStatus.EXPIRED}
          >
            评估
          </Button>
          {record.status === QuotationStatus.EVALUATING && (
            <>
              <Button
                type="text"
                size="small"
                style={{ color: '#52c41a' }}
                onClick={() => handleAccept(record.id)}
              >
                接受
              </Button>
              <Button
                type="text"
                size="small"
                danger
                onClick={() => handleReject(record.id)}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (quotationNo: string) => {
    const quotation = quotations.find(q => q.quotationNo === quotationNo);
    setSelectedQuotation(quotation);
    setDetailModalVisible(true);
  };

  // 处理编辑评估
  const handleEdit = (id: number) => {
    const quotation = quotations.find(q => q.id === id);
    setSelectedQuotation(quotation);
    form.setFieldsValue(quotation);
    setEditModalVisible(true);
  };

  // 处理接受报价
  const handleAccept = (id: number) => {
    Modal.confirm({
      title: '接受报价',
      content: '确定要接受这个供应商报价吗？',
      onOk() {
        setQuotations(quotations.map(q => 
          q.id === id ? { 
            ...q, 
            status: QuotationStatus.ACCEPTED,
            evaluateDate: new Date().toISOString().split('T')[0]
          } : q
        ));
        message.success('报价已接受');
      },
    });
  };

  // 处理拒绝报价
  const handleReject = (id: number) => {
    Modal.confirm({
      title: '拒绝报价',
      content: '确定要拒绝这个供应商报价吗？',
      onOk() {
        setQuotations(quotations.map(q => 
          q.id === id ? { 
            ...q, 
            status: QuotationStatus.REJECTED,
            evaluateDate: new Date().toISOString().split('T')[0]
          } : q
        ));
        message.success('报价已拒绝');
      },
    });
  };

  // 处理新建报价
  const handleCreate = () => {
    setSelectedQuotation(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出供应商报价数据');
  };

  // 处理保存评估
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (selectedQuotation) {
        // 更新评估
        setQuotations(quotations.map(q => 
          q.id === selectedQuotation.id ? { 
            ...q, 
            ...values,
            status: QuotationStatus.EVALUATING,
            evaluateDate: new Date().toISOString().split('T')[0]
          } : q
        ));
        message.success('评估更新成功');
      } else {
        // 新建报价记录
        const newQuotation = {
          id: Math.max(...quotations.map(q => q.id)) + 1,
          quotationNo: `SQ${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          ...values,
          status: QuotationStatus.RECEIVED,
          quotationDate: new Date().toISOString().split('T')[0],
          evaluateDate: null,
          items: []
        };
        setQuotations([...quotations, newQuotation]);
        message.success('报价记录创建成功');
      }
      setEditModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredQuotations = quotations.filter(quotation => {
    const matchSearch = !searchText || 
      quotation.quotationNo.toLowerCase().includes(searchText.toLowerCase()) ||
      quotation.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
      quotation.supplierContact.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || quotation.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 统计数据
  const statistics = {
    total: quotations.length,
    received: quotations.filter(q => q.status === QuotationStatus.RECEIVED).length,
    evaluating: quotations.filter(q => q.status === QuotationStatus.EVALUATING).length,
    accepted: quotations.filter(q => q.status === QuotationStatus.ACCEPTED).length,
    totalAmount: quotations.reduce((sum, quotation) => sum + quotation.totalAmount, 0),
    acceptedAmount: quotations
      .filter(q => q.status === QuotationStatus.ACCEPTED)
      .reduce((sum, quotation) => sum + quotation.totalAmount, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总报价单"
              value={statistics.total}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="评估中"
              value={statistics.evaluating}
              suffix="单"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已接受"
              value={statistics.accepted}
              suffix="单"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="接受金额"
              value={statistics.acceptedAmount}
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
            <ShopOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>供应商报价管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              录入报价
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
          <Col span={8}>
            <Input
              placeholder="搜索报价单号、供应商名称或联系人"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={6}>
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
          <Col span={10}>
            <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={filteredQuotations}
          rowKey="id"
          pagination={{
            total: filteredQuotations.length,
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

      {/* 报价详情弹窗 */}
      <Modal
        title="供应商报价详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedQuotation && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>报价单号：</strong>{selectedQuotation.quotationNo}</p>
                <p><strong>供应商：</strong>{selectedQuotation.supplierName}</p>
                <p><strong>联系人：</strong>{selectedQuotation.supplierContact}</p>
                <p><strong>联系电话：</strong>{selectedQuotation.supplierPhone}</p>
                <p><strong>邮箱：</strong>{selectedQuotation.supplierEmail}</p>
                <p><strong>供应商评级：</strong>
                  <Rate disabled defaultValue={selectedQuotation.supplierRating} style={{ fontSize: '14px' }} />
                  <span style={{ marginLeft: '8px' }}>{selectedQuotation.supplierRating}</span>
                </p>
              </Col>
              <Col span={12}>
                <p><strong>报价日期：</strong>{selectedQuotation.quotationDate}</p>
                <p><strong>有效期至：</strong>{selectedQuotation.validUntil}</p>
                <p><strong>付款条件：</strong>{selectedQuotation.paymentTerms}</p>
                <p><strong>交货条件：</strong>{selectedQuotation.deliveryTerms}</p>
                <p><strong>质保条件：</strong>{selectedQuotation.warranty}</p>
                <p><strong>报价状态：</strong>
                  <Tag color={statusConfig[selectedQuotation.status].color} icon={statusConfig[selectedQuotation.status].icon}>
                    {statusConfig[selectedQuotation.status].text}
                  </Tag>
                </p>
              </Col>
            </Row>
            
            <h4>报价明细</h4>
            <Table
              columns={[
                { title: '产品名称', dataIndex: 'productName', key: 'productName' },
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (price: number) => `¥${price}` },
                { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
                { title: '交货期', dataIndex: 'deliveryDays', key: 'deliveryDays', render: (days: number) => `${days}天` },
              ]}
              dataSource={selectedQuotation.items}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <strong style={{ color: '#f5222d' }}>
                      ¥{selectedQuotation.totalAmount.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} />
                </Table.Summary.Row>
              )}
            />
            
            {selectedQuotation.remark && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedQuotation.remark}</p>
              </div>
            )}
            
            {selectedQuotation.evaluator && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>评估人：</strong>{selectedQuotation.evaluator}</p>
                <p><strong>评估日期：</strong>{selectedQuotation.evaluateDate}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑报价弹窗 */}
      <Modal
        title={selectedQuotation ? '评估供应商报价' : '录入供应商报价'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            status: QuotationStatus.RECEIVED,
            supplierRating: 4.0
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="供应商名称"
                name="supplierName"
                rules={[{ required: true, message: '请输入供应商名称' }]}
              >
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系人"
                name="supplierContact"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="supplierPhone"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="邮箱"
                name="supplierEmail"
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="供应商评级"
                name="supplierRating"
              >
                <Rate allowHalf />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="有效期至"
                name="validUntil"
                rules={[{ required: true, message: '请选择有效期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="报价金额"
                name="totalAmount"
                rules={[{ required: true, message: '请输入报价金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入报价金额"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="付款条件"
                name="paymentTerms"
              >
                <Input placeholder="请输入付款条件" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="交货条件"
                name="deliveryTerms"
              >
                <Input placeholder="请输入交货条件" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="质保条件"
                name="warranty"
              >
                <Input placeholder="请输入质保条件" />
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

export default SupplierQuotations;
