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
  BuildOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 组装状态枚举
const AssemblyStatus = {
  DRAFT: 'draft',
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// 状态标签配置
const statusConfig = {
  [AssemblyStatus.DRAFT]: { color: 'default', text: '草稿', icon: <EditOutlined /> },
  [AssemblyStatus.PLANNED]: { color: 'blue', text: '已计划', icon: <ClockCircleOutlined /> },
  [AssemblyStatus.IN_PROGRESS]: { color: 'orange', text: '组装中', icon: <PlayCircleOutlined /> },
  [AssemblyStatus.PAUSED]: { color: 'red', text: '已暂停', icon: <PauseCircleOutlined /> },
  [AssemblyStatus.COMPLETED]: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
  [AssemblyStatus.CANCELLED]: { color: 'red', text: '已取消', icon: <ClockCircleOutlined /> }
};

// 模拟产品组装数据
const mockProductAssemblies = [
  {
    id: 1,
    assemblyNo: 'PA202401001',
    productCode: 'PRD001',
    productName: '电子设备A',
    plannedQty: 100,
    completedQty: 95,
    defectiveQty: 2,
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    status: AssemblyStatus.COMPLETED,
    operator: '张三',
    supervisor: '李经理',
    workstation: '组装线A',
    materials: [
      { materialCode: 'MAT001', materialName: '主板', requiredQty: 100, consumedQty: 97, unit: '块' },
      { materialCode: 'MAT002', materialName: '外壳', requiredQty: 100, consumedQty: 97, unit: '个' },
      { materialCode: 'MAT003', materialName: '螺丝', requiredQty: 400, consumedQty: 388, unit: '个' },
      { materialCode: 'MAT004', materialName: '标签', requiredQty: 100, consumedQty: 97, unit: '张' }
    ],
    qualityCheck: {
      inspector: '质检员王五',
      passRate: 97.9,
      issues: '2件外观缺陷，已返工处理'
    },
    remark: '按计划完成组装，质量良好'
  },
  {
    id: 2,
    assemblyNo: 'PA202401002',
    productCode: 'PRD002',
    productName: '控制器B',
    plannedQty: 200,
    completedQty: 120,
    defectiveQty: 1,
    startDate: '2024-01-16',
    endDate: '2024-01-20',
    status: AssemblyStatus.IN_PROGRESS,
    operator: '赵六',
    supervisor: '李经理',
    workstation: '组装线B',
    materials: [
      { materialCode: 'MAT005', materialName: '控制芯片', requiredQty: 200, consumedQty: 121, unit: '个' },
      { materialCode: 'MAT006', materialName: '电路板', requiredQty: 200, consumedQty: 121, unit: '块' },
      { materialCode: 'MAT007', materialName: '连接线', requiredQty: 600, consumedQty: 363, unit: '根' }
    ],
    qualityCheck: {
      inspector: '质检员钱七',
      passRate: 99.2,
      issues: '1件功能测试不通过'
    },
    remark: '组装进行中，预计按时完成'
  },
  {
    id: 3,
    assemblyNo: 'PA202401003',
    productCode: 'PRD003',
    productName: '传感器C',
    plannedQty: 300,
    completedQty: 0,
    defectiveQty: 0,
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    status: AssemblyStatus.PLANNED,
    operator: '孙八',
    supervisor: '张总',
    workstation: '组装线C',
    materials: [
      { materialCode: 'MAT008', materialName: '传感器芯片', requiredQty: 300, consumedQty: 0, unit: '个' },
      { materialCode: 'MAT009', materialName: '保护壳', requiredQty: 300, consumedQty: 0, unit: '个' },
      { materialCode: 'MAT010', materialName: '校准工具', requiredQty: 300, consumedQty: 0, unit: '套' }
    ],
    qualityCheck: {
      inspector: '质检员周九',
      passRate: 0,
      issues: '等待开始组装'
    },
    remark: '等待物料到位后开始组装'
  },
  {
    id: 4,
    assemblyNo: 'PA202401004',
    productCode: 'PRD004',
    productName: '显示屏D',
    plannedQty: 50,
    completedQty: 25,
    defectiveQty: 0,
    startDate: '2024-01-17',
    endDate: '2024-01-22',
    status: AssemblyStatus.PAUSED,
    operator: '吴十',
    supervisor: '李经理',
    workstation: '组装线D',
    materials: [
      { materialCode: 'MAT011', materialName: '液晶屏', requiredQty: 50, consumedQty: 25, unit: '块' },
      { materialCode: 'MAT012', materialName: '驱动板', requiredQty: 50, consumedQty: 25, unit: '块' },
      { materialCode: 'MAT013', materialName: '背光模组', requiredQty: 50, consumedQty: 25, unit: '个' }
    ],
    qualityCheck: {
      inspector: '质检员郑十一',
      passRate: 100,
      issues: '暂无问题'
    },
    remark: '设备故障，暂停组装等待维修'
  }
];

const ProductAssembly: React.FC = () => {
  const [assemblies, setAssemblies] = useState(mockProductAssemblies);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAssembly, setSelectedAssembly] = useState<any>(null);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '组装单号',
      dataIndex: 'assemblyNo',
      key: 'assemblyNo',
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
      title: '计划数量',
      dataIndex: 'plannedQty',
      key: 'plannedQty',
      width: 100,
      render: (qty: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{qty}</span>
      ),
    },
    {
      title: '完成数量',
      dataIndex: 'completedQty',
      key: 'completedQty',
      width: 100,
      render: (qty: number, record) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          {qty}
          {record.plannedQty > 0 && (
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
              ({((qty / record.plannedQty) * 100).toFixed(1)}%)
            </span>
          )}
        </span>
      ),
    },
    {
      title: '不良数量',
      dataIndex: 'defectiveQty',
      key: 'defectiveQty',
      width: 100,
      render: (qty: number) => (
        <span style={{ color: qty > 0 ? '#f5222d' : '#52c41a', fontWeight: 'bold' }}>
          {qty}
        </span>
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
            onClick={() => handleViewDetail(record.assemblyNo)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === AssemblyStatus.COMPLETED || record.status === AssemblyStatus.CANCELLED}
          >
            编辑
          </Button>
          {record.status === AssemblyStatus.PLANNED && (
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
          {record.status === AssemblyStatus.IN_PROGRESS && (
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
          {record.status === AssemblyStatus.PAUSED && (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              size="small"
              style={{ color: '#52c41a' }}
              onClick={() => handleResume(record.id)}
            >
              继续
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (assemblyNo: string) => {
    const assembly = assemblies.find(a => a.assemblyNo === assemblyNo);
    setSelectedAssembly(assembly);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    const assembly = assemblies.find(a => a.id === id);
    setSelectedAssembly(assembly);
    form.setFieldsValue(assembly);
    setEditModalVisible(true);
  };

  // 处理开始组装
  const handleStart = (id: number) => {
    Modal.confirm({
      title: '开始组装',
      content: '确定要开始这个产品组装任务吗？',
      onOk() {
        setAssemblies(assemblies.map(a => 
          a.id === id ? { ...a, status: AssemblyStatus.IN_PROGRESS } : a
        ));
        message.success('组装任务已开始');
      },
    });
  };

  // 处理暂停组装
  const handlePause = (id: number) => {
    Modal.confirm({
      title: '暂停组装',
      content: '确定要暂停这个产品组装任务吗？',
      onOk() {
        setAssemblies(assemblies.map(a => 
          a.id === id ? { ...a, status: AssemblyStatus.PAUSED } : a
        ));
        message.success('组装任务已暂停');
      },
    });
  };

  // 处理继续组装
  const handleResume = (id: number) => {
    Modal.confirm({
      title: '继续组装',
      content: '确定要继续这个产品组装任务吗？',
      onOk() {
        setAssemblies(assemblies.map(a => 
          a.id === id ? { ...a, status: AssemblyStatus.IN_PROGRESS } : a
        ));
        message.success('组装任务已继续');
      },
    });
  };

  // 处理新建组装单
  const handleCreate = () => {
    setSelectedAssembly(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出产品组装数据');
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (selectedAssembly) {
        // 编辑组装单
        setAssemblies(assemblies.map(a => 
          a.id === selectedAssembly.id ? { ...a, ...values } : a
        ));
        message.success('组装单更新成功');
      } else {
        // 新建组装单
        const newAssembly = {
          id: Math.max(...assemblies.map(a => a.id)) + 1,
          assemblyNo: `PA${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          ...values,
          status: AssemblyStatus.DRAFT,
          completedQty: 0,
          defectiveQty: 0,
          materials: [],
          qualityCheck: {
            inspector: '',
            passRate: 0,
            issues: ''
          }
        };
        setAssemblies([...assemblies, newAssembly]);
        message.success('组装单创建成功');
      }
      setEditModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredAssemblies = assemblies.filter(assembly => {
    const matchSearch = !searchText || 
      assembly.assemblyNo.toLowerCase().includes(searchText.toLowerCase()) ||
      assembly.productName.toLowerCase().includes(searchText.toLowerCase()) ||
      assembly.productCode.toLowerCase().includes(searchText.toLowerCase()) ||
      assembly.operator.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || assembly.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 统计数据
  const statistics = {
    total: assemblies.length,
    planned: assemblies.filter(a => a.status === AssemblyStatus.PLANNED).length,
    inProgress: assemblies.filter(a => a.status === AssemblyStatus.IN_PROGRESS).length,
    completed: assemblies.filter(a => a.status === AssemblyStatus.COMPLETED).length,
    totalPlanned: assemblies.reduce((sum, assembly) => sum + assembly.plannedQty, 0),
    totalCompleted: assemblies.reduce((sum, assembly) => sum + assembly.completedQty, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总组装单"
              value={statistics.total}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="组装中"
              value={statistics.inProgress}
              suffix="单"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="计划数量"
              value={statistics.totalPlanned}
              suffix="件"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="完成数量"
              value={statistics.totalCompleted}
              suffix="件"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BuildOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>产品组装管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建组装
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
              placeholder="搜索组装单号、产品名称或操作员"
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
          <Col span={12}>
            <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={filteredAssemblies}
          rowKey="id"
          pagination={{
            total: filteredAssemblies.length,
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

      {/* 组装详情弹窗 */}
      <Modal
        title="产品组装详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedAssembly && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>组装单号：</strong>{selectedAssembly.assemblyNo}</p>
                <p><strong>产品编码：</strong>{selectedAssembly.productCode}</p>
                <p><strong>产品名称：</strong>{selectedAssembly.productName}</p>
                <p><strong>计划数量：</strong>{selectedAssembly.plannedQty}</p>
                <p><strong>完成数量：</strong>{selectedAssembly.completedQty}</p>
                <p><strong>不良数量：</strong>{selectedAssembly.defectiveQty}</p>
              </Col>
              <Col span={12}>
                <p><strong>开始日期：</strong>{selectedAssembly.startDate}</p>
                <p><strong>结束日期：</strong>{selectedAssembly.endDate}</p>
                <p><strong>工作站：</strong>{selectedAssembly.workstation}</p>
                <p><strong>操作员：</strong>{selectedAssembly.operator}</p>
                <p><strong>主管：</strong>{selectedAssembly.supervisor}</p>
                <p><strong>组装状态：</strong>
                  <Tag color={statusConfig[selectedAssembly.status].color} icon={statusConfig[selectedAssembly.status].icon}>
                    {statusConfig[selectedAssembly.status].text}
                  </Tag>
                </p>
              </Col>
            </Row>
            
            <Divider />
            
            <h4>物料消耗</h4>
            <Table
              columns={[
                { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
                { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
                { title: '需求数量', dataIndex: 'requiredQty', key: 'requiredQty' },
                { title: '消耗数量', dataIndex: 'consumedQty', key: 'consumedQty' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { 
                  title: '消耗率', 
                  key: 'consumptionRate',
                  render: (_, record: any) => {
                    const rate = record.requiredQty > 0 ? (record.consumedQty / record.requiredQty) * 100 : 0;
                    return (
                      <span style={{ color: rate > 100 ? '#f5222d' : rate === 100 ? '#52c41a' : '#faad14' }}>
                        {rate.toFixed(1)}%
                      </span>
                    );
                  }
                },
              ]}
              dataSource={selectedAssembly.materials}
              pagination={false}
              size="small"
            />
            
            <Divider />
            
            <h4>质量检查</h4>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>质检员：</strong>{selectedAssembly.qualityCheck.inspector}</p>
                <p><strong>合格率：</strong>
                  <span style={{ 
                    color: selectedAssembly.qualityCheck.passRate >= 95 ? '#52c41a' : 
                           selectedAssembly.qualityCheck.passRate >= 90 ? '#faad14' : '#f5222d',
                    fontWeight: 'bold'
                  }}>
                    {selectedAssembly.qualityCheck.passRate}%
                  </span>
                </p>
              </Col>
              <Col span={12}>
                <p><strong>质量问题：</strong></p>
                <p style={{ color: '#666', marginLeft: '16px' }}>{selectedAssembly.qualityCheck.issues}</p>
              </Col>
            </Row>
            
            {selectedAssembly.remark && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedAssembly.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑组装弹窗 */}
      <Modal
        title={selectedAssembly ? '编辑产品组装单' : '新建产品组装单'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            status: AssemblyStatus.DRAFT
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
                label="计划数量"
                name="plannedQty"
                rules={[{ required: true, message: '请输入计划数量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入计划数量"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="工作站"
                name="workstation"
                rules={[{ required: true, message: '请选择工作站' }]}
              >
                <Select placeholder="请选择工作站">
                  <Option value="组装线A">组装线A</Option>
                  <Option value="组装线B">组装线B</Option>
                  <Option value="组装线C">组装线C</Option>
                  <Option value="组装线D">组装线D</Option>
                </Select>
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

export default ProductAssembly;