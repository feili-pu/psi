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
  ShoppingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SendOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 领用状态枚举
const RequisitionStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  ISSUED: 'issued',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
};

// 状态标签配置
const statusConfig = {
  [RequisitionStatus.DRAFT]: { color: 'default', text: '草稿', icon: <EditOutlined /> },
  [RequisitionStatus.SUBMITTED]: { color: 'blue', text: '已提交', icon: <SendOutlined /> },
  [RequisitionStatus.APPROVED]: { color: 'green', text: '已批准', icon: <CheckCircleOutlined /> },
  [RequisitionStatus.ISSUED]: { color: 'orange', text: '已发料', icon: <ShoppingOutlined /> },
  [RequisitionStatus.COMPLETED]: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
  [RequisitionStatus.REJECTED]: { color: 'red', text: '已拒绝', icon: <ExclamationCircleOutlined /> }
};

// 模拟物料领用数据
const mockMaterialRequisitions = [
  {
    id: 1,
    requisitionNo: 'MR202401001',
    department: '生产部',
    requester: '张三',
    requestDate: '2024-01-15',
    requiredDate: '2024-01-18',
    status: RequisitionStatus.COMPLETED,
    totalAmount: 15680.00,
    approver: '李经理',
    issuer: '仓管员王五',
    items: [
      { materialCode: 'RAW001', materialName: '钢材Q235', unit: 'kg', requestQty: 500, issuedQty: 500, unitPrice: 15.5, amount: 7750 },
      { materialCode: 'RAW002', materialName: '螺丝M6', unit: '个', requestQty: 1000, issuedQty: 1000, unitPrice: 0.8, amount: 800 },
      { materialCode: 'RAW003', materialName: '塑料颗粒', unit: 'kg', requestQty: 200, issuedQty: 200, unitPrice: 35.65, amount: 7130 }
    ],
    purpose: '生产订单PO202401001所需原料',
    remark: '紧急生产需求，已按时发料'
  },
  {
    id: 2,
    requisitionNo: 'MR202401002',
    department: '研发部',
    requester: '赵六',
    requestDate: '2024-01-16',
    requiredDate: '2024-01-20',
    status: RequisitionStatus.APPROVED,
    totalAmount: 8950.00,
    approver: '张总',
    issuer: null,
    items: [
      { materialCode: 'ELE001', materialName: '电子元件A', unit: '个', requestQty: 100, issuedQty: 0, unitPrice: 45.5, amount: 4550 },
      { materialCode: 'ELE002', materialName: '传感器B', unit: '个', requestQty: 50, issuedQty: 0, unitPrice: 88, amount: 4400 }
    ],
    purpose: '新产品研发测试',
    remark: '等待仓库发料'
  },
  {
    id: 3,
    requisitionNo: 'MR202401003',
    department: '维修部',
    requester: '钱七',
    requestDate: '2024-01-17',
    requiredDate: '2024-01-19',
    status: RequisitionStatus.ISSUED,
    totalAmount: 3280.00,
    approver: '李经理',
    issuer: '仓管员王五',
    items: [
      { materialCode: 'SPR001', materialName: '备件轴承', unit: '个', requestQty: 10, issuedQty: 10, unitPrice: 180, amount: 1800 },
      { materialCode: 'SPR002', materialName: '密封圈', unit: '个', requestQty: 20, issuedQty: 20, unitPrice: 74, amount: 1480 }
    ],
    purpose: '设备维修更换备件',
    remark: '已发料，等待维修完成确认'
  },
  {
    id: 4,
    requisitionNo: 'MR202401004',
    department: '质检部',
    requester: '孙八',
    requestDate: '2024-01-18',
    requiredDate: '2024-01-22',
    status: RequisitionStatus.SUBMITTED,
    totalAmount: 1850.00,
    approver: null,
    issuer: null,
    items: [
      { materialCode: 'TST001', materialName: '测试样品', unit: 'kg', requestQty: 50, issuedQty: 0, unitPrice: 37, amount: 1850 }
    ],
    purpose: '产品质量检测',
    remark: '等待部门经理审批'
  },
  {
    id: 5,
    requisitionNo: 'MR202401005',
    department: '生产部',
    requester: '周九',
    requestDate: '2024-01-19',
    requiredDate: '2024-01-25',
    status: RequisitionStatus.REJECTED,
    totalAmount: 12500.00,
    approver: '李经理',
    issuer: null,
    items: [
      { materialCode: 'RAW004', materialName: '铝合金板', unit: 'kg', requestQty: 300, issuedQty: 0, unitPrice: 41.67, amount: 12500 }
    ],
    purpose: '试制新产品',
    remark: '预算不足，申请被拒绝'
  }
];

const MaterialRequisition: React.FC = () => {
  const [requisitions, setRequisitions] = useState<any[]>(mockMaterialRequisitions);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<any>(null);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '领用单号',
      dataIndex: 'requisitionNo',
      key: 'requisitionNo',
      width: 120,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
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
      title: '需求日期',
      dataIndex: 'requiredDate',
      key: 'requiredDate',
      width: 110,
    },
    {
      title: '领用金额',
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
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 80,
      render: (approver: string) => approver || '-',
    },
    {
      title: '发料人',
      dataIndex: 'issuer',
      key: 'issuer',
      width: 80,
      render: (issuer: string) => issuer || '-',
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
            onClick={() => handleViewDetail(record.requisitionNo)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === RequisitionStatus.COMPLETED || record.status === RequisitionStatus.REJECTED}
          >
            编辑
          </Button>
          {record.status === RequisitionStatus.DRAFT && (
            <Button
              type="text"
              icon={<SendOutlined />}
              size="small"
              onClick={() => handleSubmit(record.id)}
            >
              提交
            </Button>
          )}
          {record.status === RequisitionStatus.APPROVED && (
            <Button
              type="text"
              icon={<ShoppingOutlined />}
              size="small"
              style={{ color: '#52c41a' }}
              onClick={() => handleIssue(record.id)}
            >
              发料
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (requisitionNo: string) => {
    const requisition = requisitions.find(r => r.requisitionNo === requisitionNo);
    setSelectedRequisition(requisition);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    const requisition = requisitions.find(r => r.id === id);
    setSelectedRequisition(requisition);
    form.setFieldsValue(requisition);
    setEditModalVisible(true);
  };

  // 处理提交申请
  const handleSubmit = (id: number) => {
    Modal.confirm({
      title: '提交申请',
      content: '确定要提交这个物料领用申请吗？',
      onOk() {
        setRequisitions(requisitions.map(r => 
          r.id === id ? { ...r, status: RequisitionStatus.SUBMITTED } : r
        ));
        message.success('申请已提交，等待审批');
      },
    });
  };

  // 处理发料
  const handleIssue = (id: number) => {
    Modal.confirm({
      title: '确认发料',
      content: '确定要为这个申请发料吗？',
      onOk() {
        setRequisitions(requisitions.map(r => 
          r.id === id ? { 
            ...r, 
            status: RequisitionStatus.ISSUED,
            issuer: '仓管员王五'
          } : r
        ));
        message.success('发料成功');
      },
    });
  };

  // 处理新建申请
  const handleCreate = () => {
    setSelectedRequisition(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出物料领用数据');
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (selectedRequisition) {
        // 编辑申请
        setRequisitions(requisitions.map(r => 
          r.id === selectedRequisition.id ? { ...r, ...values } : r
        ));
        message.success('申请更新成功');
      } else {
        // 新建申请
        const newRequisition = {
          id: Math.max(...requisitions.map(r => r.id)) + 1,
          requisitionNo: `MR${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          ...values,
          status: RequisitionStatus.DRAFT,
          requestDate: new Date().toISOString().split('T')[0],
          approver: null,
          issuer: null,
          items: []
        };
        setRequisitions([...requisitions, newRequisition]);
        message.success('申请创建成功');
      }
      setEditModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredRequisitions = requisitions.filter(requisition => {
    const matchSearch = !searchText || 
      requisition.requisitionNo.toLowerCase().includes(searchText.toLowerCase()) ||
      requisition.department.toLowerCase().includes(searchText.toLowerCase()) ||
      requisition.requester.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || requisition.status === statusFilter;
    const matchDepartment = !departmentFilter || requisition.department === departmentFilter;
    return matchSearch && matchStatus && matchDepartment;
  });

  // 统计数据
  const statistics = {
    total: requisitions.length,
    draft: requisitions.filter(r => r.status === RequisitionStatus.DRAFT).length,
    submitted: requisitions.filter(r => r.status === RequisitionStatus.SUBMITTED).length,
    approved: requisitions.filter(r => r.status === RequisitionStatus.APPROVED).length,
    totalAmount: requisitions.reduce((sum, requisition) => sum + requisition.totalAmount, 0)
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
              title="待审批"
              value={statistics.submitted}
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
              title="领用总额"
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
            <ShoppingOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>物料领用管理</span>
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
              placeholder="搜索领用单号、部门或申请人"
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
              placeholder="选择部门"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="生产部">生产部</Option>
              <Option value="研发部">研发部</Option>
              <Option value="维修部">维修部</Option>
              <Option value="质检部">质检部</Option>
            </Select>
          </Col>
          <Col span={10}>
            <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={filteredRequisitions}
          rowKey="id"
          pagination={{
            total: filteredRequisitions.length,
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

      {/* 领用详情弹窗 */}
      <Modal
        title="物料领用详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
      >
        {selectedRequisition && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>领用单号：</strong>{selectedRequisition.requisitionNo}</p>
                <p><strong>申请部门：</strong>{selectedRequisition.department}</p>
                <p><strong>申请人：</strong>{selectedRequisition.requester}</p>
                <p><strong>申请日期：</strong>{selectedRequisition.requestDate}</p>
                <p><strong>需求日期：</strong>{selectedRequisition.requiredDate}</p>
              </Col>
              <Col span={12}>
                <p><strong>申请状态：</strong>
                  <Tag color={statusConfig[selectedRequisition.status].color} icon={statusConfig[selectedRequisition.status].icon}>
                    {statusConfig[selectedRequisition.status].text}
                  </Tag>
                </p>
                <p><strong>审批人：</strong>{selectedRequisition.approver || '未审批'}</p>
                <p><strong>发料人：</strong>{selectedRequisition.issuer || '未发料'}</p>
                <p><strong>用途：</strong>{selectedRequisition.purpose}</p>
              </Col>
            </Row>
            
            <Divider />
            
            <h4>领用明细</h4>
            <Table
              columns={[
                { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
                { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '申请数量', dataIndex: 'requestQty', key: 'requestQty' },
                { title: '发料数量', dataIndex: 'issuedQty', key: 'issuedQty' },
                { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (price: number) => `¥${price}` },
                { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
              ]}
              dataSource={selectedRequisition.items}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={6}>
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>
                    <strong style={{ color: '#f5222d' }}>
                      ¥{selectedRequisition.totalAmount.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
            
            {selectedRequisition.remark && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedRequisition.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑申请弹窗 */}
      <Modal
        title={selectedRequisition ? '编辑物料领用申请' : '新建物料领用申请'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            status: RequisitionStatus.DRAFT
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="申请部门"
                name="department"
                rules={[{ required: true, message: '请输入申请部门' }]}
              >
                <Select placeholder="请选择申请部门">
                  <Option value="生产部">生产部</Option>
                  <Option value="研发部">研发部</Option>
                  <Option value="维修部">维修部</Option>
                  <Option value="质检部">质检部</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="申请人"
                name="requester"
                rules={[{ required: true, message: '请输入申请人' }]}
              >
                <Input placeholder="请输入申请人" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="需求日期"
                name="requiredDate"
                rules={[{ required: true, message: '请选择需求日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="领用金额"
                name="totalAmount"
                rules={[{ required: true, message: '请输入领用金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入领用金额"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="用途"
            name="purpose"
            rules={[{ required: true, message: '请输入用途' }]}
          >
            <TextArea rows={2} placeholder="请输入物料用途" />
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

export default MaterialRequisition;
