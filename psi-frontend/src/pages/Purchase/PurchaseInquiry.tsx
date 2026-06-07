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
import { PurchaseRealApi, RealResourceUtils } from '../../services/realResourceService';

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
  [InquiryStatus.CANCELLED]: { color: 'red', text: '已取消', icon: <ClockCircleOutlined /> },
  ACTIVE: { color: 'blue', text: '询价中', icon: <SendOutlined /> },
  COMPLETED: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
  CANCELLED: { color: 'red', text: '已取消', icon: <ClockCircleOutlined /> }
};

const PurchaseInquiry: React.FC = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [form] = Form.useForm();

  const mapInquiry = (inquiry: any) => ({
    ...inquiry,
    inquiryTitle: inquiry.inquiryTitle || inquiry.title,
    deadline: inquiry.deadline || inquiry.deadlineDate,
    supplierCount: inquiry.supplierCount || 0,
    replyCount: inquiry.replyCount || 0,
    items: inquiry.items || [],
    suppliers: inquiry.suppliers || [],
    remark: inquiry.remark || inquiry.remarks
  });

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await PurchaseRealApi.listInquiries();
      setInquiries(data.map(mapInquiry));
    } catch (error) {
      message.error('加载采购询价失败: ' + (error as Error).message);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

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
  const handleViewDetail = async (inquiryNo: string) => {
    const inquiry = inquiries.find(i => i.inquiryNo === inquiryNo);
    if (!inquiry?.id) return;
    try {
      const detail = await PurchaseRealApi.getInquiry(inquiry.id);
      setSelectedInquiry(mapInquiry({ ...detail.inquiry, items: detail.items }));
      setDetailModalVisible(true);
    } catch (error) {
      message.error('获取采购询价详情失败: ' + (error as Error).message);
    }
  };

  // 处理编辑
  const handleEdit = async (id: number) => {
    const inquiry = inquiries.find(i => i.id === id);
    setSelectedInquiry(inquiry);
    try {
      const detail = await PurchaseRealApi.getInquiry(id);
      const normalized = mapInquiry({ ...detail.inquiry, items: detail.items });
      setSelectedInquiry(normalized);
      form.setFieldsValue(normalized);
      setEditModalVisible(true);
    } catch (error) {
      message.error('获取采购询价详情失败: ' + (error as Error).message);
    }
  };

  // 处理发送询价
  const handleSend = (id: number) => {
    Modal.confirm({
      title: '发送询价',
      content: '确定要发送这个采购询价吗？发送后将通知所有供应商。',
      async onOk() {
        await PurchaseRealApi.completeInquiry(id);
        message.success('询价已完成');
        loadInquiries();
      },
    });
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个采购询价吗？',
      async onOk() {
        await PurchaseRealApi.deleteInquiry(id);
        message.success('删除成功');
        loadInquiries();
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
    RealResourceUtils.exportCsv('采购询价.csv', filteredInquiries);
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (selectedInquiry) {
        await PurchaseRealApi.saveInquiry(values, selectedInquiry.id);
        message.success('询价更新成功');
      } else {
        await PurchaseRealApi.saveInquiry(values);
        message.success('询价创建成功');
      }
      setEditModalVisible(false);
      loadInquiries();
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
          loading={loading}
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
