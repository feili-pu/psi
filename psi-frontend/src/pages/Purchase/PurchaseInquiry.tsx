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
  Divider
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  FileTextOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 询价状态枚举
const InquiryStatus = {
  DRAFT: 'draft',
  SENT: 'sent',
  REPLIED: 'replied',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// 状态标签配置
const statusConfig = {
  [InquiryStatus.DRAFT]: { color: 'default', text: '草稿', icon: <EditOutlined /> },
  [InquiryStatus.SENT]: { color: 'blue', text: '已发送', icon: <SendOutlined /> },
  [InquiryStatus.REPLIED]: { color: 'orange', text: '已回复', icon: <ExclamationCircleOutlined /> },
  [InquiryStatus.COMPLETED]: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
  [InquiryStatus.CANCELLED]: { color: 'red', text: '已取消', icon: <ClockCircleOutlined /> }
};

// 模拟采购询价数据
const mockPurchaseInquiries = [
  {
    id: 1,
    inquiryNo: 'PI202401001',
    inquiryTitle: '办公设备采购询价',
    department: '行政部',
    inquirer: '张三',
    inquiryDate: '2024-01-15',
    deadline: '2024-01-25',
    status: InquiryStatus.COMPLETED,
    supplierCount: 5,
    replyCount: 4,
    items: [
      { productName: '笔记本电脑', quantity: 10, specifications: 'i5处理器，8GB内存，256GB SSD' },
      { productName: '打印机', quantity: 2, specifications: '激光打印机，A4幅面，双面打印' },
      { productName: '办公椅', quantity: 15, specifications: '人体工学设计，可调节高度' }
    ],
    suppliers: [
      { name: '深圳电子科技', contact: '王经理', phone: '13800138001', replied: true, replyDate: '2024-01-17' },
      { name: '北京办公用品', contact: '刘总', phone: '13900139002', replied: true, replyDate: '2024-01-18' },
      { name: '广州设备公司', contact: '陈主管', phone: '13700137003', replied: true, replyDate: '2024-01-19' },
      { name: '上海科技设备', contact: '李经理', phone: '13600136004', replied: false, replyDate: null },
      { name: '杭州办公家具', contact: '周总', phone: '13500135005', replied: true, replyDate: '2024-01-20' }
    ],
    remark: '请提供详细的技术参数和报价'
  },
  {
    id: 2,
    inquiryNo: 'PI202401002',
    inquiryTitle: '生产原料采购询价',
    department: '生产部',
    inquirer: '王五',
    inquiryDate: '2024-01-16',
    deadline: '2024-01-28',
    status: InquiryStatus.REPLIED,
    supplierCount: 3,
    replyCount: 2,
    items: [
      { productName: '钢材', quantity: 500, specifications: 'Q235钢材，厚度5mm' },
      { productName: '螺丝', quantity: 1000, specifications: 'M6*20不锈钢螺丝' },
      { productName: '包装材料', quantity: 200, specifications: '纸箱，规格40*30*20cm' }
    ],
    suppliers: [
      { name: '钢铁集团', contact: '赵经理', phone: '13800138011', replied: true, replyDate: '2024-01-18' },
      { name: '五金制品厂', contact: '钱总', phone: '13900139012', replied: true, replyDate: '2024-01-19' },
      { name: '包装材料公司', contact: '孙主管', phone: '13700137013', replied: false, replyDate: null }
    ],
    remark: '急需，请尽快回复报价'
  },
  {
    id: 3,
    inquiryNo: 'PI202401003',
    inquiryTitle: '实验室设备询价',
    department: '研发部',
    inquirer: '赵六',
    inquiryDate: '2024-01-17',
    deadline: '2024-02-05',
    status: InquiryStatus.SENT,
    supplierCount: 4,
    replyCount: 0,
    items: [
      { productName: '测试仪器', quantity: 2, specifications: '精度0.01%，测量范围0-1000V' },
      { productName: '实验台', quantity: 4, specifications: '不锈钢台面，带抽屉和储物柜' }
    ],
    suppliers: [
      { name: '科学仪器公司', contact: '吴经理', phone: '13800138021', replied: false, replyDate: null },
      { name: '实验设备厂', contact: '郑总', phone: '13900139022', replied: false, replyDate: null },
      { name: '精密仪器公司', contact: '王主管', phone: '13700137023', replied: false, replyDate: null },
      { name: '实验室家具厂', contact: '李经理', phone: '13600136024', replied: false, replyDate: null }
    ],
    remark: '设备需要符合行业标准，请提供相关认证'
  },
  {
    id: 4,
    inquiryNo: 'PI202401004',
    inquiryTitle: '营销物料询价',
    department: '市场部',
    inquirer: '钱七',
    inquiryDate: '2024-01-18',
    deadline: '2024-01-30',
    status: InquiryStatus.DRAFT,
    supplierCount: 0,
    replyCount: 0,
    items: [
      { productName: '宣传册', quantity: 5000, specifications: '铜版纸，彩色印刷，16页' },
      { productName: '展示架', quantity: 20, specifications: '铝合金材质，可折叠' },
      { productName: '礼品', quantity: 1000, specifications: '定制LOGO，包装精美' }
    ],
    suppliers: [],
    remark: '即将参加展会，需要高质量的营销物料'
  }
];

const PurchaseInquiry: React.FC = () => {
  const [inquiries, setInquiries] = useState(mockPurchaseInquiries);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '询价单号',
      dataIndex: 'inquiryNo',
      key: 'inquiryNo',
      width: 120,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: '询价标题',
      dataIndex: 'inquiryTitle',
      key: 'inquiryTitle',
      width: 180,
      ellipsis: true,
    },
    {
      title: '询价部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: '询价人',
      dataIndex: 'inquirer',
      key: 'inquirer',
      width: 80,
    },
    {
      title: '询价日期',
      dataIndex: 'inquiryDate',
      key: 'inquiryDate',
      width: 110,
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 110,
      render: (date: string) => {
        const isOverdue = new Date(date) < new Date();
        return (
          <span style={{ color: isOverdue ? '#f5222d' : '#666' }}>
            {date}
          </span>
        );
      },
    },
    {
      title: '供应商',
      key: 'suppliers',
      width: 100,
      render: (_, record) => (
        <span>
          {record.supplierCount}家
          {record.replyCount > 0 && (
            <span style={{ color: '#52c41a', marginLeft: '4px' }}>
              ({record.replyCount}已回复)
            </span>
          )}
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
            onClick={() => handleViewDetail(record.inquiryNo)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === InquiryStatus.COMPLETED}
          >
            编辑
          </Button>
          {record.status === InquiryStatus.DRAFT && (
            <Button
              type="text"
              icon={<SendOutlined />}
              size="small"
              onClick={() => handleSend(record.id)}
            >
              发送
            </Button>
          )}
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
            disabled={record.status === InquiryStatus.COMPLETED}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (inquiryNo: string) => {
    const inquiry = inquiries.find(i => i.inquiryNo === inquiryNo);
    setSelectedInquiry(inquiry);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    const inquiry = inquiries.find(i => i.id === id);
    setSelectedInquiry(inquiry);
    form.setFieldsValue(inquiry);
    setEditModalVisible(true);
  };

  // 处理发送询价
  const handleSend = (id: number) => {
    Modal.confirm({
      title: '发送询价',
      content: '确定要发送这个采购询价吗？发送后将通知所有供应商。',
      onOk() {
        setInquiries(inquiries.map(i => 
          i.id === id ? { ...i, status: InquiryStatus.SENT } : i
        ));
        message.success('询价已发送给供应商');
      },
    });
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个采购询价吗？',
      onOk() {
        setInquiries(inquiries.filter(i => i.id !== id));
        message.success('删除成功');
      },
    });
  };

  // 处理新建询价
  const handleCreate = () => {
    setSelectedInquiry(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出采购询价数据');
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (selectedInquiry) {
        // 编辑询价
        setInquiries(inquiries.map(i => 
          i.id === selectedInquiry.id ? { ...i, ...values } : i
        ));
        message.success('询价更新成功');
      } else {
        // 新建询价
        const newInquiry = {
          id: Math.max(...inquiries.map(i => i.id)) + 1,
          inquiryNo: `PI${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          ...values,
          status: InquiryStatus.DRAFT,
          inquiryDate: new Date().toISOString().split('T')[0],
          supplierCount: 0,
          replyCount: 0,
          items: [],
          suppliers: []
        };
        setInquiries([...inquiries, newInquiry]);
        message.success('询价创建成功');
      }
      setEditModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchSearch = !searchText || 
      inquiry.inquiryNo.toLowerCase().includes(searchText.toLowerCase()) ||
      inquiry.inquiryTitle.toLowerCase().includes(searchText.toLowerCase()) ||
      inquiry.department.toLowerCase().includes(searchText.toLowerCase()) ||
      inquiry.inquirer.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || inquiry.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 统计数据
  const statistics = {
    total: inquiries.length,
    draft: inquiries.filter(i => i.status === InquiryStatus.DRAFT).length,
    sent: inquiries.filter(i => i.status === InquiryStatus.SENT).length,
    completed: inquiries.filter(i => i.status === InquiryStatus.COMPLETED).length,
    totalSuppliers: inquiries.reduce((sum, inquiry) => sum + inquiry.supplierCount, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总询价单"
              value={statistics.total}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="草稿"
              value={statistics.draft}
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
              title="询价供应商"
              value={statistics.totalSuppliers}
              suffix="家"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>采购询价管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建询价
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
              placeholder="搜索询价单号、标题、部门或询价人"
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
          dataSource={filteredInquiries}
          rowKey="id"
          pagination={{
            total: filteredInquiries.length,
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
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* 询价详情弹窗 */}
      <Modal
        title="采购询价详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedInquiry && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>询价单号：</strong>{selectedInquiry.inquiryNo}</p>
                <p><strong>询价标题：</strong>{selectedInquiry.inquiryTitle}</p>
                <p><strong>询价部门：</strong>{selectedInquiry.department}</p>
                <p><strong>询价人：</strong>{selectedInquiry.inquirer}</p>
                <p><strong>询价日期：</strong>{selectedInquiry.inquiryDate}</p>
              </Col>
              <Col span={12}>
                <p><strong>截止日期：</strong>{selectedInquiry.deadline}</p>
                <p><strong>询价状态：</strong>
                  <Tag color={statusConfig[selectedInquiry.status].color} icon={statusConfig[selectedInquiry.status].icon}>
                    {statusConfig[selectedInquiry.status].text}
                  </Tag>
                </p>
                <p><strong>供应商数量：</strong>{selectedInquiry.supplierCount}家</p>
                <p><strong>回复数量：</strong>{selectedInquiry.replyCount}家</p>
              </Col>
            </Row>
            
            <Divider />
            
            <h4>询价明细</h4>
            <Table
              columns={[
                { title: '产品名称', dataIndex: 'productName', key: 'productName' },
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                { title: '规格要求', dataIndex: 'specifications', key: 'specifications' },
              ]}
              dataSource={selectedInquiry.items}
              pagination={false}
              size="small"
            />
            
            <Divider />
            
            <h4>供应商回复情况</h4>
            <Table
              columns={[
                { title: '供应商名称', dataIndex: 'name', key: 'name' },
                { title: '联系人', dataIndex: 'contact', key: 'contact' },
                { title: '联系电话', dataIndex: 'phone', key: 'phone' },
                { 
                  title: '回复状态', 
                  dataIndex: 'replied', 
                  key: 'replied',
                  render: (replied: boolean) => (
                    <Tag color={replied ? 'green' : 'orange'}>
                      {replied ? '已回复' : '未回复'}
                    </Tag>
                  )
                },
                { title: '回复日期', dataIndex: 'replyDate', key: 'replyDate' },
              ]}
              dataSource={selectedInquiry.suppliers}
              pagination={false}
              size="small"
            />
            
            {selectedInquiry.remark && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedInquiry.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑询价弹窗 */}
      <Modal
        title={selectedInquiry ? '编辑采购询价' : '新建采购询价'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            status: InquiryStatus.DRAFT
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="询价标题"
                name="inquiryTitle"
                rules={[{ required: true, message: '请输入询价标题' }]}
              >
                <Input placeholder="请输入询价标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="询价部门"
                name="department"
                rules={[{ required: true, message: '请输入询价部门' }]}
              >
                <Input placeholder="请输入询价部门" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="询价人"
                name="inquirer"
                rules={[{ required: true, message: '请输入询价人' }]}
              >
                <Input placeholder="请输入询价人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="截止日期"
                name="deadline"
                rules={[{ required: true, message: '请选择截止日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="备注"
            name="remark"
          >
            <TextArea rows={3} placeholder="请输入询价要求和备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PurchaseInquiry;