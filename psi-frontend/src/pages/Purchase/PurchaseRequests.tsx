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
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SendOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 申请状态枚举
const RequestStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

// 状态标签配置
const statusConfig = {
  [RequestStatus.DRAFT]: { color: 'default', text: '草稿', icon: <EditOutlined /> },
  [RequestStatus.SUBMITTED]: { color: 'blue', text: '已提交', icon: <SendOutlined /> },
  [RequestStatus.APPROVED]: { color: 'green', text: '已批准', icon: <CheckCircleOutlined /> },
  [RequestStatus.REJECTED]: { color: 'red', text: '已拒绝', icon: <ExclamationCircleOutlined /> },
  [RequestStatus.CANCELLED]: { color: 'orange', text: '已取消', icon: <ClockCircleOutlined /> }
};

// 紧急程度配置
const urgencyConfig: Record<string, { color: string; text: string }> = {
  low: { color: 'green', text: '普通' },
  medium: { color: 'orange', text: '紧急' },
  high: { color: 'red', text: '特急' }
};

// 模拟采购申请数据
const mockPurchaseRequests = [
  {
    id: 1,
    requestNo: 'PR202401001',
    requestTitle: '办公设备采购申请',
    department: '行政部',
    requester: '张三',
    requestDate: '2024-01-15',
    expectedDate: '2024-01-25',
    totalAmount: 125680.00,
    status: RequestStatus.APPROVED,
    urgency: 'medium',
    approver: '李经理',
    approveDate: '2024-01-16',
    items: [
      { productName: '笔记本电脑', quantity: 10, estimatedPrice: 8500, amount: 85000, purpose: '员工办公使用' },
      { productName: '打印机', quantity: 2, estimatedPrice: 15000, amount: 30000, purpose: '部门打印需求' },
      { productName: '办公椅', quantity: 15, estimatedPrice: 780, amount: 11700, purpose: '新员工座椅' }
    ],
    reason: '部门扩编，需要增加办公设备',
    remark: '请优先考虑性价比高的产品'
  },
  {
    id: 2,
    requestNo: 'PR202401002',
    requestTitle: '生产原料采购申请',
    department: '生产部',
    requester: '王五',
    requestDate: '2024-01-16',
    expectedDate: '2024-01-28',
    totalAmount: 89500.00,
    status: RequestStatus.SUBMITTED,
    urgency: 'high',
    approver: null,
    approveDate: null,
    items: [
      { productName: '钢材', quantity: 500, estimatedPrice: 150, amount: 75000, purpose: '产品生产' },
      { productName: '螺丝', quantity: 1000, estimatedPrice: 12, amount: 12000, purpose: '产品组装' },
      { productName: '包装材料', quantity: 200, estimatedPrice: 12.5, amount: 2500, purpose: '产品包装' }
    ],
    reason: '库存不足，急需补充生产原料',
    remark: '生产急需，请加急处理'
  },
  {
    id: 3,
    requestNo: 'PR202401003',
    requestTitle: '实验室设备采购申请',
    department: '研发部',
    requester: '赵六',
    requestDate: '2024-01-17',
    expectedDate: '2024-02-05',
    totalAmount: 256800.00,
    status: RequestStatus.DRAFT,
    urgency: 'low',
    approver: null,
    approveDate: null,
    items: [
      { productName: '测试仪器', quantity: 2, estimatedPrice: 120000, amount: 240000, purpose: '产品测试' },
      { productName: '实验台', quantity: 4, estimatedPrice: 4200, amount: 16800, purpose: '实验操作' }
    ],
    reason: '新项目启动，需要专业测试设备',
    remark: '设备需要符合行业标准'
  },
  {
    id: 4,
    requestNo: 'PR202401004',
    requestTitle: '营销物料采购申请',
    department: '市场部',
    requester: '钱七',
    requestDate: '2024-01-18',
    expectedDate: '2024-01-30',
    totalAmount: 45200.00,
    status: RequestStatus.REJECTED,
    urgency: 'medium',
    approver: '张总',
    approveDate: '2024-01-19',
    items: [
      { productName: '宣传册', quantity: 5000, estimatedPrice: 5, amount: 25000, purpose: '产品宣传' },
      { productName: '展示架', quantity: 20, estimatedPrice: 850, amount: 17000, purpose: '展会使用' },
      { productName: '礼品', quantity: 1000, estimatedPrice: 3.2, amount: 3200, purpose: '客户赠送' }
    ],
    reason: '即将参加行业展会，需要营销物料',
    remark: '预算超标，建议重新评估'
  }
];

const PurchaseRequests: React.FC = () => {
  const [requests, setRequests] = useState(mockPurchaseRequests);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '申请单号',
      dataIndex: 'requestNo',
      key: 'requestNo',
      width: 120,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: '申请标题',
      dataIndex: 'requestTitle',
      key: 'requestTitle',
      width: 180,
      ellipsis: true,
    },
    {
      title: '申请部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: '申请人',
      dataIndex: 'requester',
      key: 'requester',
      width: 80,
    },
    {
      title: '申请日期',
      dataIndex: 'requestDate',
      key: 'requestDate',
      width: 110,
    },
    {
      title: '期望日期',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
      width: 110,
    },
    {
      title: '申请金额',
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
      title: '紧急程度',
      dataIndex: 'urgency',
      key: 'urgency',
      width: 90,
      render: (urgency: string) => {
        const config = urgencyConfig[urgency];
        return <Tag color={config.color}>{config.text}</Tag>;
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
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record.requestNo)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === RequestStatus.APPROVED || record.status === RequestStatus.REJECTED}
          >
            编辑
          </Button>
          {record.status === RequestStatus.DRAFT && (
            <Button
              type="text"
              icon={<SendOutlined />}
              size="small"
              onClick={() => handleSubmit(record.id)}
            >
              提交
            </Button>
          )}
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
            disabled={record.status === RequestStatus.APPROVED}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (requestNo: string) => {
    const request = requests.find(r => r.requestNo === requestNo);
    setSelectedRequest(request);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    const request = requests.find(r => r.id === id);
    setSelectedRequest(request);
    form.setFieldsValue(request);
    setEditModalVisible(true);
  };

  // 处理提交申请
  const handleSubmit = (id: number) => {
    Modal.confirm({
      title: '提交申请',
      content: '确定要提交这个采购申请吗？提交后将无法修改。',
      onOk() {
        setRequests(requests.map(r => 
          r.id === id ? { ...r, status: RequestStatus.SUBMITTED } : r
        ));
        message.success('申请已提交，等待审批');
      },
    });
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个采购申请吗？',
      onOk() {
        setRequests(requests.filter(r => r.id !== id));
        message.success('删除成功');
      },
    });
  };

  // 处理新建申请
  const handleCreate = () => {
    setSelectedRequest(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出采购申请数据');
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (selectedRequest) {
        // 编辑申请
        setRequests(requests.map(r => 
          r.id === selectedRequest.id ? { ...r, ...values } : r
        ));
        message.success('申请更新成功');
      } else {
        // 新建申请
        const newRequest = {
          id: Math.max(...requests.map(r => r.id)) + 1,
          requestNo: `PR${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          ...values,
          status: RequestStatus.DRAFT,
          requestDate: new Date().toISOString().split('T')[0],
          approver: null,
          approveDate: null,
          items: []
        };
        setRequests([...requests, newRequest]);
        message.success('申请创建成功');
      }
      setEditModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredRequests = requests.filter(request => {
    const matchSearch = !searchText || 
      request.requestNo.toLowerCase().includes(searchText.toLowerCase()) ||
      request.requestTitle.toLowerCase().includes(searchText.toLowerCase()) ||
      request.department.toLowerCase().includes(searchText.toLowerCase()) ||
      request.requester.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || request.status === statusFilter;
    const matchUrgency = !urgencyFilter || request.urgency === urgencyFilter;
    return matchSearch && matchStatus && matchUrgency;
  });

  // 统计数据
  const statistics = {
    total: requests.length,
    draft: requests.filter(r => r.status === RequestStatus.DRAFT).length,
    submitted: requests.filter(r => r.status === RequestStatus.SUBMITTED).length,
    approved: requests.filter(r => r.status === RequestStatus.APPROVED).length,
    totalAmount: requests.reduce((sum, request) => sum + request.totalAmount, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总申请单"
              value={statistics.total}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待提交"
              value={statistics.draft}
              suffix="单"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已批准"
              value={statistics.approved}
              suffix="单"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="申请总额"
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
            <FileTextOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>采购申请管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建申请
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
              placeholder="搜索申请单号、标题、部门或申请人"
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
              placeholder="紧急程度"
              value={urgencyFilter}
              onChange={setUrgencyFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {Object.entries(urgencyConfig).map(([key, config]) => (
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
          dataSource={filteredRequests}
          rowKey="id"
          pagination={{
            total: filteredRequests.length,
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

      {/* 申请详情弹窗 */}
      <Modal
        title="采购申请详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
      >
        {selectedRequest && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>申请单号：</strong>{selectedRequest.requestNo}</p>
                <p><strong>申请标题：</strong>{selectedRequest.requestTitle}</p>
                <p><strong>申请部门：</strong>{selectedRequest.department}</p>
                <p><strong>申请人：</strong>{selectedRequest.requester}</p>
                <p><strong>申请日期：</strong>{selectedRequest.requestDate}</p>
              </Col>
              <Col span={12}>
                <p><strong>期望日期：</strong>{selectedRequest.expectedDate}</p>
                <p><strong>紧急程度：</strong>
                  <Tag color={urgencyConfig[selectedRequest.urgency].color}>
                    {urgencyConfig[selectedRequest.urgency].text}
                  </Tag>
                </p>
                <p><strong>申请状态：</strong>
                  <Tag color={statusConfig[selectedRequest.status].color} icon={statusConfig[selectedRequest.status].icon}>
                    {statusConfig[selectedRequest.status].text}
                  </Tag>
                </p>
                <p><strong>审批人：</strong>{selectedRequest.approver || '未审批'}</p>
                <p><strong>审批日期：</strong>{selectedRequest.approveDate || '未审批'}</p>
              </Col>
            </Row>
            
            <Divider />
            
            <div style={{ marginBottom: '16px' }}>
              <p><strong>申请原因：</strong></p>
              <p style={{ color: '#666', marginLeft: '16px' }}>{selectedRequest.reason}</p>
            </div>
            
            <h4>申请明细</h4>
            <Table
              columns={[
                { title: '产品名称', dataIndex: 'productName', key: 'productName' },
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                { title: '预估单价', dataIndex: 'estimatedPrice', key: 'estimatedPrice', render: (price: number) => `¥${price}` },
                { title: '预估金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
                { title: '用途', dataIndex: 'purpose', key: 'purpose' },
              ]}
              dataSource={selectedRequest.items}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <strong style={{ color: '#f5222d' }}>
                      ¥{selectedRequest.totalAmount.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} />
                </Table.Summary.Row>
              )}
            />
            
            {selectedRequest.remark && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedRequest.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑申请弹窗 */}
      <Modal
        title={selectedRequest ? '编辑采购申请' : '新建采购申请'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            status: RequestStatus.DRAFT,
            urgency: 'medium'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="申请标题"
                name="requestTitle"
                rules={[{ required: true, message: '请输入申请标题' }]}
              >
                <Input placeholder="请输入申请标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="申请部门"
                name="department"
                rules={[{ required: true, message: '请输入申请部门' }]}
              >
                <Input placeholder="请输入申请部门" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="申请人"
                name="requester"
                rules={[{ required: true, message: '请输入申请人' }]}
              >
                <Input placeholder="请输入申请人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="期望日期"
                name="expectedDate"
                rules={[{ required: true, message: '请选择期望日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="紧急程度"
                name="urgency"
                rules={[{ required: true, message: '请选择紧急程度' }]}
              >
                <Select placeholder="请选择紧急程度">
                  {Object.entries(urgencyConfig).map(([key, config]) => (
                    <Option key={key} value={key}>
                      {config.text}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="申请金额"
                name="totalAmount"
                rules={[{ required: true, message: '请输入申请金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入申请金额"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="申请原因"
            name="reason"
            rules={[{ required: true, message: '请输入申请原因' }]}
          >
            <TextArea rows={3} placeholder="请详细说明采购原因" />
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

export default PurchaseRequests;