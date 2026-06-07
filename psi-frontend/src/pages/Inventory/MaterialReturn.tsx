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
  RollbackOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SendOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 退库状态枚举
const ReturnStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  RETURNED: 'returned',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
};

// 状态标签配置
const statusConfig = {
  [ReturnStatus.DRAFT]: { color: 'default', text: '草稿', icon: <EditOutlined /> },
  [ReturnStatus.SUBMITTED]: { color: 'blue', text: '已提交', icon: <SendOutlined /> },
  [ReturnStatus.APPROVED]: { color: 'green', text: '已批准', icon: <CheckCircleOutlined /> },
  [ReturnStatus.RETURNED]: { color: 'orange', text: '已退库', icon: <RollbackOutlined /> },
  [ReturnStatus.COMPLETED]: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
  [ReturnStatus.REJECTED]: { color: 'red', text: '已拒绝', icon: <ExclamationCircleOutlined /> }
};

// 退库原因枚举
const ReturnReason = {
  EXCESS: 'excess',
  DEFECTIVE: 'defective',
  WRONG_SPEC: 'wrong_spec',
  PROJECT_CANCEL: 'project_cancel',
  OTHER: 'other'
};

const returnReasonConfig = {
  [ReturnReason.EXCESS]: '剩余物料',
  [ReturnReason.DEFECTIVE]: '质量问题',
  [ReturnReason.WRONG_SPEC]: '规格错误',
  [ReturnReason.PROJECT_CANCEL]: '项目取消',
  [ReturnReason.OTHER]: '其他原因'
};

// 模拟物料退库数据
const mockMaterialReturns = [
  {
    id: 1,
    returnNo: 'MRT202401001',
    department: '生产部',
    returner: '张三',
    returnDate: '2024-01-15',
    status: ReturnStatus.COMPLETED,
    totalAmount: 5680.00,
    approver: '李经理',
    receiver: '仓管员王五',
    reason: ReturnReason.EXCESS,
    items: [
      { materialCode: 'RAW001', materialName: '钢材Q235', unit: 'kg', returnQty: 100, unitPrice: 15.5, amount: 1550, condition: '良好' },
      { materialCode: 'RAW002', materialName: '螺丝M6', unit: '个', returnQty: 500, unitPrice: 0.8, amount: 400, condition: '良好' },
      { materialCode: 'RAW003', materialName: '塑料颗粒', unit: 'kg', returnQty: 100, unitPrice: 37.3, amount: 3730, condition: '良好' }
    ],
    originalRequisition: 'MR202401001',
    remark: '生产完成后剩余物料退库'
  },
  {
    id: 2,
    returnNo: 'MRT202401002',
    department: '研发部',
    returner: '赵六',
    returnDate: '2024-01-16',
    status: ReturnStatus.APPROVED,
    totalAmount: 2250.00,
    approver: '张总',
    receiver: null,
    reason: ReturnReason.DEFECTIVE,
    items: [
      { materialCode: 'ELE001', materialName: '电子元件A', unit: '个', returnQty: 10, unitPrice: 45.5, amount: 455, condition: '不良' },
      { materialCode: 'ELE002', materialName: '传感器B', unit: '个', returnQty: 20, unitPrice: 89.75, amount: 1795, condition: '不良' }
    ],
    originalRequisition: 'MR202401002',
    remark: '质量检测发现问题，需要退库处理'
  },
  {
    id: 3,
    returnNo: 'MRT202401003',
    department: '维修部',
    returner: '钱七',
    returnDate: '2024-01-17',
    status: ReturnStatus.RETURNED,
    totalAmount: 1480.00,
    approver: '李经理',
    receiver: '仓管员王五',
    reason: ReturnReason.WRONG_SPEC,
    items: [
      { materialCode: 'SPR002', materialName: '密封圈', unit: '个', returnQty: 20, unitPrice: 74, amount: 1480, condition: '良好' }
    ],
    originalRequisition: 'MR202401003',
    remark: '规格不符，已退库等待重新申请'
  },
  {
    id: 4,
    returnNo: 'MRT202401004',
    department: '质检部',
    returner: '孙八',
    returnDate: '2024-01-18',
    status: ReturnStatus.SUBMITTED,
    totalAmount: 925.00,
    approver: null,
    receiver: null,
    reason: ReturnReason.PROJECT_CANCEL,
    items: [
      { materialCode: 'TST001', materialName: '测试样品', unit: 'kg', returnQty: 25, unitPrice: 37, amount: 925, condition: '良好' }
    ],
    originalRequisition: 'MR202401004',
    remark: '项目暂停，测试样品退库'
  },
  {
    id: 5,
    returnNo: 'MRT202401005',
    department: '生产部',
    returner: '周九',
    returnDate: '2024-01-19',
    status: ReturnStatus.DRAFT,
    totalAmount: 8350.00,
    approver: null,
    receiver: null,
    reason: ReturnReason.OTHER,
    items: [
      { materialCode: 'RAW004', materialName: '铝合金板', unit: 'kg', returnQty: 200, unitPrice: 41.75, amount: 8350, condition: '良好' }
    ],
    originalRequisition: null,
    remark: '订单变更，多余物料退库'
  }
];

const MaterialReturn: React.FC = () => {
  const [returns, setReturns] = useState<any[]>(mockMaterialReturns);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [reasonFilter, setReasonFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '退库单号',
      dataIndex: 'returnNo',
      key: 'returnNo',
      width: 120,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: '退库部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: '退库人',
      dataIndex: 'returner',
      key: 'returner',
      width: 80,
    },
    {
      title: '退库日期',
      dataIndex: 'returnDate',
      key: 'returnDate',
      width: 110,
    },
    {
      title: '退库金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '退库原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 100,
      render: (reason: string) => (
        <Tag color={reason === ReturnReason.DEFECTIVE ? 'red' : 'blue'}>
          {returnReasonConfig[reason]}
        </Tag>
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
      title: '接收人',
      dataIndex: 'receiver',
      key: 'receiver',
      width: 80,
      render: (receiver: string) => receiver || '-',
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
            onClick={() => handleViewDetail(record.returnNo)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === ReturnStatus.COMPLETED || record.status === ReturnStatus.REJECTED}
          >
            编辑
          </Button>
          {record.status === ReturnStatus.DRAFT && (
            <Button
              type="text"
              icon={<SendOutlined />}
              size="small"
              onClick={() => handleSubmit(record.id)}
            >
              提交
            </Button>
          )}
          {record.status === ReturnStatus.APPROVED && (
            <Button
              type="text"
              icon={<RollbackOutlined />}
              size="small"
              style={{ color: '#52c41a' }}
              onClick={() => handleReturn(record.id)}
            >
              退库
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (returnNo: string) => {
    const returnRecord = returns.find(r => r.returnNo === returnNo);
    setSelectedReturn(returnRecord);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    const returnRecord = returns.find(r => r.id === id);
    setSelectedReturn(returnRecord);
    form.setFieldsValue(returnRecord);
    setEditModalVisible(true);
  };

  // 处理提交申请
  const handleSubmit = (id: number) => {
    Modal.confirm({
      title: '提交申请',
      content: '确定要提交这个物料退库申请吗？',
      onOk() {
        setReturns(returns.map(r => 
          r.id === id ? { ...r, status: ReturnStatus.SUBMITTED } : r
        ));
        message.success('申请已提交，等待审批');
      },
    });
  };

  // 处理退库
  const handleReturn = (id: number) => {
    Modal.confirm({
      title: '确认退库',
      content: '确定要接收这批退库物料吗？',
      onOk() {
        setReturns(returns.map(r => 
          r.id === id ? { 
            ...r, 
            status: ReturnStatus.RETURNED,
            receiver: '仓管员王五'
          } : r
        ));
        message.success('退库成功');
      },
    });
  };

  // 处理新建申请
  const handleCreate = () => {
    setSelectedReturn(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出物料退库数据');
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (selectedReturn) {
        // 编辑申请
        setReturns(returns.map(r => 
          r.id === selectedReturn.id ? { ...r, ...values } : r
        ));
        message.success('申请更新成功');
      } else {
        // 新建申请
        const newReturn = {
          id: Math.max(...returns.map(r => r.id)) + 1,
          returnNo: `MRT${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          ...values,
          status: ReturnStatus.DRAFT,
          returnDate: new Date().toISOString().split('T')[0],
          approver: null,
          receiver: null,
          items: []
        };
        setReturns([...returns, newReturn]);
        message.success('申请创建成功');
      }
      setEditModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredReturns = returns.filter(returnRecord => {
    const matchSearch = !searchText || 
      returnRecord.returnNo.toLowerCase().includes(searchText.toLowerCase()) ||
      returnRecord.department.toLowerCase().includes(searchText.toLowerCase()) ||
      returnRecord.returner.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || returnRecord.status === statusFilter;
    const matchReason = !reasonFilter || returnRecord.reason === reasonFilter;
    return matchSearch && matchStatus && matchReason;
  });

  // 统计数据
  const statistics = {
    total: returns.length,
    draft: returns.filter(r => r.status === ReturnStatus.DRAFT).length,
    submitted: returns.filter(r => r.status === ReturnStatus.SUBMITTED).length,
    completed: returns.filter(r => r.status === ReturnStatus.COMPLETED).length,
    totalAmount: returns.reduce((sum, returnRecord) => sum + returnRecord.totalAmount, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总退库单"
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
              title="退库总额"
              value={statistics.totalAmount}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RollbackOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>物料退库管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建退库
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
              placeholder="搜索退库单号、部门或退库人"
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
              placeholder="退库原因"
              value={reasonFilter}
              onChange={setReasonFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {Object.entries(returnReasonConfig).map(([key, text]) => (
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
          dataSource={filteredReturns}
          rowKey="id"
          pagination={{
            total: filteredReturns.length,
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

      {/* 退库详情弹窗 */}
      <Modal
        title="物料退库详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
      >
        {selectedReturn && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>退库单号：</strong>{selectedReturn.returnNo}</p>
                <p><strong>退库部门：</strong>{selectedReturn.department}</p>
                <p><strong>退库人：</strong>{selectedReturn.returner}</p>
                <p><strong>退库日期：</strong>{selectedReturn.returnDate}</p>
                <p><strong>原领用单：</strong>{selectedReturn.originalRequisition || '无'}</p>
              </Col>
              <Col span={12}>
                <p><strong>退库状态：</strong>
                  <Tag color={statusConfig[selectedReturn.status].color} icon={statusConfig[selectedReturn.status].icon}>
                    {statusConfig[selectedReturn.status].text}
                  </Tag>
                </p>
                <p><strong>退库原因：</strong>
                  <Tag color={selectedReturn.reason === ReturnReason.DEFECTIVE ? 'red' : 'blue'}>
                    {returnReasonConfig[selectedReturn.reason]}
                  </Tag>
                </p>
                <p><strong>审批人：</strong>{selectedReturn.approver || '未审批'}</p>
                <p><strong>接收人：</strong>{selectedReturn.receiver || '未接收'}</p>
              </Col>
            </Row>
            
            <Divider />
            
            <h4>退库明细</h4>
            <Table
              columns={[
                { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
                { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '退库数量', dataIndex: 'returnQty', key: 'returnQty' },
                { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (price: number) => `¥${price}` },
                { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
                { title: '物料状态', dataIndex: 'condition', key: 'condition', render: (condition: string) => (
                  <Tag color={condition === '良好' ? 'green' : 'red'}>{condition}</Tag>
                )},
              ]}
              dataSource={selectedReturn.items}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5}>
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    <strong style={{ color: '#52c41a' }}>
                      ¥{selectedReturn.totalAmount.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6} />
                </Table.Summary.Row>
              )}
            />
            
            {selectedReturn.remark && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedReturn.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑退库弹窗 */}
      <Modal
        title={selectedReturn ? '编辑物料退库申请' : '新建物料退库申请'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            status: ReturnStatus.DRAFT,
            reason: ReturnReason.EXCESS
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="退库部门"
                name="department"
                rules={[{ required: true, message: '请输入退库部门' }]}
              >
                <Select placeholder="请选择退库部门">
                  <Option value="生产部">生产部</Option>
                  <Option value="研发部">研发部</Option>
                  <Option value="维修部">维修部</Option>
                  <Option value="质检部">质检部</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="退库人"
                name="returner"
                rules={[{ required: true, message: '请输入退库人' }]}
              >
                <Input placeholder="请输入退库人" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="退库原因"
                name="reason"
                rules={[{ required: true, message: '请选择退库原因' }]}
              >
                <Select placeholder="请选择退库原因">
                  {Object.entries(returnReasonConfig).map(([key, text]) => (
                    <Option key={key} value={key}>
                      {text}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="退库金额"
                name="totalAmount"
                rules={[{ required: true, message: '请输入退库金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入退库金额"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="原领用单号"
            name="originalRequisition"
          >
            <Input placeholder="请输入原领用单号（如有）" />
          </Form.Item>
          
          <Form.Item
            label="备注"
            name="remark"
          >
            <TextArea rows={3} placeholder="请输入退库说明和备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaterialReturn;
