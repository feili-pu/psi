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
  Divider,
  Progress
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  DisconnectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SendOutlined,
  WarningOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 拆解状态枚举
const DisassemblyStatus = {
  DRAFT: 'draft',
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// 状态标签配置
const statusConfig = {
  [DisassemblyStatus.DRAFT]: { color: 'default', text: '草稿', icon: <EditOutlined /> },
  [DisassemblyStatus.PLANNED]: { color: 'blue', text: '已计划', icon: <ClockCircleOutlined /> },
  [DisassemblyStatus.IN_PROGRESS]: { color: 'orange', text: '拆解中', icon: <PlayCircleOutlined /> },
  [DisassemblyStatus.PAUSED]: { color: 'red', text: '已暂停', icon: <PauseCircleOutlined /> },
  [DisassemblyStatus.COMPLETED]: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
  [DisassemblyStatus.CANCELLED]: { color: 'red', text: '已取消', icon: <ClockCircleOutlined /> }
};

// 拆解原因枚举
const DisassemblyReason = {
  DEFECTIVE: 'defective',
  MAINTENANCE: 'maintenance',
  UPGRADE: 'upgrade',
  RECYCLE: 'recycle',
  RETURN: 'return'
};

const reasonConfig = {
  [DisassemblyReason.DEFECTIVE]: '质量问题',
  [DisassemblyReason.MAINTENANCE]: '维修需要',
  [DisassemblyReason.UPGRADE]: '升级改造',
  [DisassemblyReason.RECYCLE]: '回收利用',
  [DisassemblyReason.RETURN]: '退货处理'
};

// 模拟产品拆解数据
const mockProductDisassemblies = [
  {
    id: 1,
    disassemblyNo: 'PD202401001',
    productCode: 'PRD001',
    productName: '电子设备A',
    sourceQty: 10,
    completedQty: 10,
    startDate: '2024-01-15',
    endDate: '2024-01-16',
    status: DisassemblyStatus.COMPLETED,
    reason: DisassemblyReason.DEFECTIVE,
    operator: '张三',
    supervisor: '李经理',
    workstation: '拆解工位A',
    sourceLocation: 'A-01-01',
    recoveredMaterials: [
      { materialCode: 'MAT001', materialName: '主板', recoveredQty: 8, condition: '良好', unit: '块', value: 4000 },
      { materialCode: 'MAT002', materialName: '外壳', recoveredQty: 10, condition: '良好', unit: '个', value: 1500 },
      { materialCode: 'MAT003', materialName: '螺丝', recoveredQty: 35, condition: '良好', unit: '个', value: 28 },
      { materialCode: 'MAT004', materialName: '标签', recoveredQty: 0, condition: '损坏', unit: '张', value: 0 }
    ],
    wasteItems: [
      { itemName: '损坏电路板', quantity: 2, unit: '块', disposalMethod: '电子垃圾回收' },
      { itemName: '破损外壳', quantity: 0, unit: '个', disposalMethod: '无' }
    ],
    totalRecoveryValue: 5528.00,
    remark: '质量问题产品拆解，大部分零件可回收利用'
  },
  {
    id: 2,
    disassemblyNo: 'PD202401002',
    productCode: 'PRD002',
    productName: '控制器B',
    sourceQty: 5,
    completedQty: 3,
    startDate: '2024-01-16',
    endDate: '2024-01-18',
    status: DisassemblyStatus.IN_PROGRESS,
    reason: DisassemblyReason.UPGRADE,
    operator: '赵六',
    supervisor: '李经理',
    workstation: '拆解工位B',
    sourceLocation: 'B-01-02',
    recoveredMaterials: [
      { materialCode: 'MAT005', materialName: '控制芯片', recoveredQty: 3, condition: '良好', unit: '个', value: 900 },
      { materialCode: 'MAT006', materialName: '电路板', recoveredQty: 3, condition: '良好', unit: '块', value: 450 },
      { materialCode: 'MAT007', materialName: '连接线', recoveredQty: 9, condition: '良好', unit: '根', value: 180 }
    ],
    wasteItems: [
      { itemName: '旧版芯片', quantity: 0, unit: '个', disposalMethod: '无' }
    ],
    totalRecoveryValue: 1530.00,
    remark: '升级改造，回收可用零件'
  },
  {
    id: 3,
    disassemblyNo: 'PD202401003',
    productCode: 'PRD003',
    productName: '传感器C',
    sourceQty: 20,
    completedQty: 0,
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    status: DisassemblyStatus.PLANNED,
    reason: DisassemblyReason.RETURN,
    operator: '孙八',
    supervisor: '张总',
    workstation: '拆解工位C',
    sourceLocation: 'R-01-01',
    recoveredMaterials: [],
    wasteItems: [],
    totalRecoveryValue: 0,
    remark: '客户退货产品，计划拆解回收'
  },
  {
    id: 4,
    disassemblyNo: 'PD202401004',
    productCode: 'PRD004',
    productName: '显示屏D',
    sourceQty: 3,
    completedQty: 1,
    startDate: '2024-01-17',
    endDate: '2024-01-19',
    status: DisassemblyStatus.PAUSED,
    reason: DisassemblyReason.MAINTENANCE,
    operator: '吴十',
    supervisor: '李经理',
    workstation: '拆解工位D',
    sourceLocation: 'A-02-01',
    recoveredMaterials: [
      { materialCode: 'MAT011', materialName: '液晶屏', recoveredQty: 0, condition: '损坏', unit: '块', value: 0 },
      { materialCode: 'MAT012', materialName: '驱动板', recoveredQty: 1, condition: '良好', unit: '块', value: 200 }
    ],
    wasteItems: [
      { itemName: '破损液晶屏', quantity: 1, unit: '块', disposalMethod: '危废处理' }
    ],
    totalRecoveryValue: 200.00,
    remark: '维修拆解，液晶屏损坏严重'
  }
];

const ProductDisassembly: React.FC = () => {
  const [disassemblies, setDisassemblies] = useState(mockProductDisassemblies);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [reasonFilter, setReasonFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedDisassembly, setSelectedDisassembly] = useState<any>(null);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '拆解单号',
      dataIndex: 'disassemblyNo',
      key: 'disassemblyNo',
      width: 120,
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
      title: '拆解数量',
      key: 'quantity',
      width: 120,
      render: (_, record) => (
        <div>
          <div>源数量: <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{record.sourceQty}</span></div>
          <div>完成: <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{record.completedQty}</span></div>
        </div>
      ),
    },
    {
      title: '拆解原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 100,
      render: (reason: string) => (
        <Tag color={reason === DisassemblyReason.DEFECTIVE ? 'red' : 'blue'}>
          {reasonConfig[reason]}
        </Tag>
      ),
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 110,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 110,
    },
    {
      title: '回收价值',
      dataIndex: 'totalRecoveryValue',
      key: 'totalRecoveryValue',
      width: 120,
      render: (value: number) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          ¥{value.toLocaleString()}
        </span>
      ),
    },
    {
      title: '工作站',
      dataIndex: 'workstation',
      key: 'workstation',
      width: 100,
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
            onClick={() => handleViewDetail(record.disassemblyNo)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === DisassemblyStatus.COMPLETED || record.status === DisassemblyStatus.CANCELLED}
          >
            编辑
          </Button>
          {record.status === DisassemblyStatus.PLANNED && (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              size="small"
              style={{ color: '#52c41a' }}
              onClick={() => handleStart(record.id)}
            >
              开始
            </Button>
          )}
          {record.status === DisassemblyStatus.IN_PROGRESS && (
            <Button
              type="text"
              icon={<PauseCircleOutlined />}
              size="small"
              style={{ color: '#faad14' }}
              onClick={() => handlePause(record.id)}
            >
              暂停
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (disassemblyNo: string) => {
    const disassembly = disassemblies.find(d => d.disassemblyNo === disassemblyNo);
    setSelectedDisassembly(disassembly);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    const disassembly = disassemblies.find(d => d.id === id);
    setSelectedDisassembly(disassembly);
    form.setFieldsValue(disassembly);
    setEditModalVisible(true);
  };

  // 处理开始拆解
  const handleStart = (id: number) => {
    Modal.confirm({
      title: '开始拆解',
      content: '确定要开始这个产品拆解任务吗？',
      onOk() {
        setDisassemblies(disassemblies.map(d => 
          d.id === id ? { ...d, status: DisassemblyStatus.IN_PROGRESS } : d
        ));
        message.success('拆解任务已开始');
      },
    });
  };

  // 处理暂停拆解
  const handlePause = (id: number) => {
    Modal.confirm({
      title: '暂停拆解',
      content: '确定要暂停这个产品拆解任务吗？',
      onOk() {
        setDisassemblies(disassemblies.map(d => 
          d.id === id ? { ...d, status: DisassemblyStatus.PAUSED } : d
        ));
        message.success('拆解任务已暂停');
      },
    });
  };

  // 处理新建拆解单
  const handleCreate = () => {
    setSelectedDisassembly(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出产品拆解数据');
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (selectedDisassembly) {
        // 编辑拆解单
        setDisassemblies(disassemblies.map(d => 
          d.id === selectedDisassembly.id ? { ...d, ...values } : d
        ));
        message.success('拆解单更新成功');
      } else {
        // 新建拆解单
        const newDisassembly = {
          id: Math.max(...disassemblies.map(d => d.id)) + 1,
          disassemblyNo: `PD${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          ...values,
          status: DisassemblyStatus.DRAFT,
          completedQty: 0,
          recoveredMaterials: [],
          wasteItems: [],
          totalRecoveryValue: 0
        };
        setDisassemblies([...disassemblies, newDisassembly]);
        message.success('拆解单创建成功');
      }
      setEditModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredDisassemblies = disassemblies.filter(disassembly => {
    const matchSearch = !searchText || 
      disassembly.disassemblyNo.toLowerCase().includes(searchText.toLowerCase()) ||
      disassembly.productName.toLowerCase().includes(searchText.toLowerCase()) ||
      disassembly.productCode.toLowerCase().includes(searchText.toLowerCase()) ||
      disassembly.operator.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || disassembly.status === statusFilter;
    const matchReason = !reasonFilter || disassembly.reason === reasonFilter;
    return matchSearch && matchStatus && matchReason;
  });

  // 统计数据
  const statistics = {
    total: disassemblies.length,
    planned: disassemblies.filter(d => d.status === DisassemblyStatus.PLANNED).length,
    inProgress: disassemblies.filter(d => d.status === DisassemblyStatus.IN_PROGRESS).length,
    completed: disassemblies.filter(d => d.status === DisassemblyStatus.COMPLETED).length,
    totalSourceQty: disassemblies.reduce((sum, disassembly) => sum + disassembly.sourceQty, 0),
    totalRecoveryValue: disassemblies.reduce((sum, disassembly) => sum + disassembly.totalRecoveryValue, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总拆解单"
              value={statistics.total}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="拆解中"
              value={statistics.inProgress}
              suffix="单"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="拆解数量"
              value={statistics.totalSourceQty}
              suffix="件"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="回收价值"
              value={statistics.totalRecoveryValue}
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
            <DisconnectOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>产品拆解管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建拆解
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
              placeholder="搜索拆解单号、产品名称或操作员"
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
              placeholder="拆解原因"
              value={reasonFilter}
              onChange={setReasonFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {Object.entries(reasonConfig).map(([key, text]) => (
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
          dataSource={filteredDisassemblies}
          rowKey="id"
          pagination={{
            total: filteredDisassemblies.length,
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

      {/* 拆解详情弹窗 */}
      <Modal
        title="产品拆解详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedDisassembly && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>拆解单号：</strong>{selectedDisassembly.disassemblyNo}</p>
                <p><strong>产品编码：</strong>{selectedDisassembly.productCode}</p>
                <p><strong>产品名称：</strong>{selectedDisassembly.productName}</p>
                <p><strong>源数量：</strong>{selectedDisassembly.sourceQty}</p>
                <p><strong>完成数量：</strong>{selectedDisassembly.completedQty}</p>
                <p><strong>源库位：</strong>{selectedDisassembly.sourceLocation}</p>
              </Col>
              <Col span={12}>
                <p><strong>拆解原因：</strong>
                  <Tag color={selectedDisassembly.reason === DisassemblyReason.DEFECTIVE ? 'red' : 'blue'}>
                    {reasonConfig[selectedDisassembly.reason]}
                  </Tag>
                </p>
                <p><strong>开始日期：</strong>{selectedDisassembly.startDate}</p>
                <p><strong>结束日期：</strong>{selectedDisassembly.endDate}</p>
                <p><strong>工作站：</strong>{selectedDisassembly.workstation}</p>
                <p><strong>操作员：</strong>{selectedDisassembly.operator}</p>
                <p><strong>主管：</strong>{selectedDisassembly.supervisor}</p>
              </Col>
            </Row>
            
            <Divider />
            
            <h4>回收物料</h4>
            <Table
              columns={[
                { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
                { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
                { title: '回收数量', dataIndex: 'recoveredQty', key: 'recoveredQty' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { 
                  title: '物料状态', 
                  dataIndex: 'condition', 
                  key: 'condition',
                  render: (condition: string) => (
                    <Tag color={condition === '良好' ? 'green' : 'red'}>{condition}</Tag>
                  )
                },
                { 
                  title: '回收价值', 
                  dataIndex: 'value', 
                  key: 'value',
                  render: (value: number) => `¥${value.toLocaleString()}`
                },
              ]}
              dataSource={selectedDisassembly.recoveredMaterials}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5}>
                    <strong>合计回收价值</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    <strong style={{ color: '#52c41a' }}>
                      ¥{selectedDisassembly.totalRecoveryValue.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
            
            <Divider />
            
            <h4>废料处理</h4>
            <Table
              columns={[
                { title: '废料名称', dataIndex: 'itemName', key: 'itemName' },
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '处理方式', dataIndex: 'disposalMethod', key: 'disposalMethod' },
              ]}
              dataSource={selectedDisassembly.wasteItems}
              pagination={false}
              size="small"
            />
            
            {selectedDisassembly.remark && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedDisassembly.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑拆解弹窗 */}
      <Modal
        title={selectedDisassembly ? '编辑产品拆解单' : '新建产品拆解单'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            status: DisassemblyStatus.DRAFT,
            reason: DisassemblyReason.DEFECTIVE
          }}
        >
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
                label="拆解数量"
                name="sourceQty"
                rules={[{ required: true, message: '请输入拆解数量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入拆解数量"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="拆解原因"
                name="reason"
                rules={[{ required: true, message: '请选择拆解原因' }]}
              >
                <Select placeholder="请选择拆解原因">
                  {Object.entries(reasonConfig).map(([key, text]) => (
                    <Option key={key} value={key}>
                      {text}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="工作站"
                name="workstation"
                rules={[{ required: true, message: '请选择工作站' }]}
              >
                <Select placeholder="请选择工作站">
                  <Option value="拆解工位A">拆解工位A</Option>
                  <Option value="拆解工位B">拆解工位B</Option>
                  <Option value="拆解工位C">拆解工位C</Option>
                  <Option value="拆解工位D">拆解工位D</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="源库位"
                name="sourceLocation"
                rules={[{ required: true, message: '请输入源库位' }]}
              >
                <Input placeholder="请输入源库位" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="开始日期"
                name="startDate"
                rules={[{ required: true, message: '请选择开始日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="结束日期"
                name="endDate"
                rules={[{ required: true, message: '请选择结束日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
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
                label="主管"
                name="supervisor"
                rules={[{ required: true, message: '请输入主管' }]}
              >
                <Input placeholder="请输入主管" />
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

export default ProductDisassembly;