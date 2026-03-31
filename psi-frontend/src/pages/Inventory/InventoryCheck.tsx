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
  Progress
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 盘点状态枚举
const CheckStatus = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  APPROVED: 'approved',
  CANCELLED: 'cancelled'
};

// 状态标签配置
const statusConfig = {
  [CheckStatus.DRAFT]: { color: 'default', text: '草稿', icon: <EditOutlined /> },
  [CheckStatus.IN_PROGRESS]: { color: 'blue', text: '盘点中', icon: <ClockCircleOutlined /> },
  [CheckStatus.COMPLETED]: { color: 'orange', text: '已完成', icon: <CheckCircleOutlined /> },
  [CheckStatus.APPROVED]: { color: 'green', text: '已审批', icon: <CheckCircleOutlined /> },
  [CheckStatus.CANCELLED]: { color: 'red', text: '已取消', icon: <ExclamationCircleOutlined /> }
};

// 盘点类型配置
const checkTypeConfig: Record<string, { color: string; text: string }> = {
  full: { color: 'purple', text: '全盘' },
  partial: { color: 'blue', text: '抽盘' },
  cycle: { color: 'green', text: '循环盘点' },
  spot: { color: 'orange', text: '临时盘点' }
};

// 模拟库存盘点数据
const mockInventoryChecks = [
  {
    id: 1,
    checkNo: 'IC202401001',
    checkName: '2024年1月全库盘点',
    checkType: 'full',
    warehouseName: '主仓库',
    checkDate: '2024-01-15',
    planStartDate: '2024-01-20',
    planEndDate: '2024-01-25',
    actualStartDate: '2024-01-20',
    actualEndDate: '2024-01-24',
    status: CheckStatus.APPROVED,
    progress: 100,
    totalItems: 1250,
    checkedItems: 1250,
    normalItems: 1180,
    surplusItems: 45,
    shortageItems: 25,
    totalValue: 2850000.00,
    differenceValue: 15600.00,
    checker: '张三',
    approver: '李经理',
    remark: '年度例行盘点，整体库存状况良好'
  },
  {
    id: 2,
    checkNo: 'IC202401002',
    checkName: '电子产品区抽盘',
    checkType: 'partial',
    warehouseName: '主仓库A区',
    checkDate: '2024-01-16',
    planStartDate: '2024-01-18',
    planEndDate: '2024-01-19',
    actualStartDate: '2024-01-18',
    actualEndDate: null,
    status: CheckStatus.IN_PROGRESS,
    progress: 65,
    totalItems: 320,
    checkedItems: 208,
    normalItems: 195,
    surplusItems: 8,
    shortageItems: 5,
    totalValue: 680000.00,
    differenceValue: -8500.00,
    checker: '王五',
    approver: null,
    remark: '重点检查高价值电子产品'
  },
  {
    id: 3,
    checkNo: 'IC202401003',
    checkName: '原材料循环盘点',
    checkType: 'cycle',
    warehouseName: '原料仓库',
    checkDate: '2024-01-17',
    planStartDate: '2024-01-22',
    planEndDate: '2024-01-23',
    actualStartDate: null,
    actualEndDate: null,
    status: CheckStatus.DRAFT,
    progress: 0,
    totalItems: 580,
    checkedItems: 0,
    normalItems: 0,
    surplusItems: 0,
    shortageItems: 0,
    totalValue: 450000.00,
    differenceValue: 0,
    checker: '赵六',
    approver: null,
    remark: '按月度计划进行循环盘点'
  },
  {
    id: 4,
    checkNo: 'IC202401004',
    checkName: '成品库临时盘点',
    checkType: 'spot',
    warehouseName: '成品仓库',
    checkDate: '2024-01-18',
    planStartDate: '2024-01-19',
    planEndDate: '2024-01-19',
    actualStartDate: '2024-01-19',
    actualEndDate: '2024-01-19',
    status: CheckStatus.COMPLETED,
    progress: 100,
    totalItems: 180,
    checkedItems: 180,
    normalItems: 165,
    surplusItems: 12,
    shortageItems: 3,
    totalValue: 320000.00,
    differenceValue: 12800.00,
    checker: '钱七',
    approver: null,
    remark: '客户投诉引发的临时盘点'
  }
];

const InventoryCheck: React.FC = () => {
  const [checks, setChecks] = useState(mockInventoryChecks);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<any>(null);

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '盘点单号',
      dataIndex: 'checkNo',
      key: 'checkNo',
      width: 120,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: '盘点名称',
      dataIndex: 'checkName',
      key: 'checkName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '盘点类型',
      dataIndex: 'checkType',
      key: 'checkType',
      width: 100,
      render: (type: string) => {
        const config = checkTypeConfig[type];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '仓库',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 120,
    },
    {
      title: '盘点人',
      dataIndex: 'checker',
      key: 'checker',
      width: 80,
    },
    {
      title: '计划日期',
      key: 'planDate',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>开始: {record.planStartDate}</div>
          <div style={{ fontSize: '12px' }}>结束: {record.planEndDate}</div>
        </div>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 100,
      render: (progress: number, record) => (
        <div>
          <Progress 
            percent={progress} 
            size="small" 
            status={progress === 100 ? 'success' : 'active'}
          />
          <div style={{ fontSize: '12px', marginTop: '2px' }}>
            {record.checkedItems}/{record.totalItems}
          </div>
        </div>
      ),
    },
    {
      title: '盘点金额',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 120,
      render: (amount: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '差异金额',
      dataIndex: 'differenceValue',
      key: 'differenceValue',
      width: 120,
      render: (amount: number) => (
        <span style={{ 
          color: amount > 0 ? '#52c41a' : amount < 0 ? '#f5222d' : '#666',
          fontWeight: 'bold' 
        }}>
          {amount > 0 ? '+' : ''}¥{amount.toLocaleString()}
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
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record.checkNo)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === CheckStatus.APPROVED}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
            disabled={record.status === CheckStatus.APPROVED}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (checkNo: string) => {
    const check = checks.find(c => c.checkNo === checkNo);
    setSelectedCheck(check);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    message.info(`编辑盘点单 ID: ${id}`);
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个盘点单吗？',
      onOk() {
        setChecks(checks.filter(check => check.id !== id));
        message.success('删除成功');
      },
    });
  };

  // 处理新建盘点
  const handleCreate = () => {
    message.info('新建库存盘点');
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出盘点数据');
  };

  // 过滤数据
  const filteredChecks = checks.filter(check => {
    const matchSearch = !searchText || 
      check.checkNo.toLowerCase().includes(searchText.toLowerCase()) ||
      check.checkName.toLowerCase().includes(searchText.toLowerCase()) ||
      check.warehouseName.toLowerCase().includes(searchText.toLowerCase()) ||
      check.checker.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || check.status === statusFilter;
    const matchType = !typeFilter || check.checkType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  // 统计数据
  const statistics = {
    total: checks.length,
    inProgress: checks.filter(c => c.status === CheckStatus.IN_PROGRESS).length,
    completed: checks.filter(c => c.status === CheckStatus.COMPLETED).length,
    approved: checks.filter(c => c.status === CheckStatus.APPROVED).length,
    totalValue: checks.reduce((sum, check) => sum + check.totalValue, 0),
    totalDifference: checks.reduce((sum, check) => sum + check.differenceValue, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="总盘点单"
              value={statistics.total}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="盘点中"
              value={statistics.inProgress}
              suffix="单"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已完成"
              value={statistics.completed}
              suffix="单"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已审批"
              value={statistics.approved}
              suffix="单"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="盘点总值"
              value={statistics.totalValue}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="总差异"
              value={statistics.totalDifference}
              precision={2}
              prefix={statistics.totalDifference >= 0 ? '+¥' : '-¥'}
              valueStyle={{ 
                color: statistics.totalDifference > 0 ? '#52c41a' : 
                       statistics.totalDifference < 0 ? '#f5222d' : '#666'
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InboxOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>库存盘点管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建盘点
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
              placeholder="搜索盘点单号、名称、仓库或盘点人"
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
              placeholder="盘点类型"
              value={typeFilter}
              onChange={setTypeFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {Object.entries(checkTypeConfig).map(([key, config]) => (
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
          dataSource={filteredChecks}
          rowKey="id"
          pagination={{
            total: filteredChecks.length,
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

      {/* 盘点详情弹窗 */}
      <Modal
        title="库存盘点详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedCheck && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>盘点单号：</strong>{selectedCheck.checkNo}</p>
                <p><strong>盘点名称：</strong>{selectedCheck.checkName}</p>
                <p><strong>盘点类型：</strong>
                  <Tag color={checkTypeConfig[selectedCheck.checkType].color}>
                    {checkTypeConfig[selectedCheck.checkType].text}
                  </Tag>
                </p>
                <p><strong>仓库名称：</strong>{selectedCheck.warehouseName}</p>
                <p><strong>盘点人：</strong>{selectedCheck.checker}</p>
                <p><strong>审批人：</strong>{selectedCheck.approver || '未审批'}</p>
              </Col>
              <Col span={12}>
                <p><strong>创建日期：</strong>{selectedCheck.checkDate}</p>
                <p><strong>计划开始：</strong>{selectedCheck.planStartDate}</p>
                <p><strong>计划结束：</strong>{selectedCheck.planEndDate}</p>
                <p><strong>实际开始：</strong>{selectedCheck.actualStartDate || '未开始'}</p>
                <p><strong>实际结束：</strong>{selectedCheck.actualEndDate || '未结束'}</p>
                <p><strong>盘点状态：</strong>
                  <Tag color={statusConfig[selectedCheck.status].color} icon={statusConfig[selectedCheck.status].icon}>
                    {statusConfig[selectedCheck.status].text}
                  </Tag>
                </p>
              </Col>
            </Row>

            {/* 盘点进度 */}
            <div style={{ marginBottom: '16px' }}>
              <h4>盘点进度</h4>
              <Progress 
                percent={selectedCheck.progress} 
                status={selectedCheck.progress === 100 ? 'success' : 'active'}
                format={() => `${selectedCheck.checkedItems}/${selectedCheck.totalItems} (${selectedCheck.progress}%)`}
              />
            </div>

            {/* 盘点统计 */}
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="正常商品"
                    value={selectedCheck.normalItems}
                    suffix="项"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="盈余商品"
                    value={selectedCheck.surplusItems}
                    suffix="项"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="亏损商品"
                    value={selectedCheck.shortageItems}
                    suffix="项"
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* 金额统计 */}
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>盘点总值：</strong>
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    ¥{selectedCheck.totalValue.toLocaleString()}
                  </span>
                </p>
              </Col>
              <Col span={12}>
                <p><strong>差异金额：</strong>
                  <span style={{ 
                    color: selectedCheck.differenceValue > 0 ? '#52c41a' : 
                           selectedCheck.differenceValue < 0 ? '#f5222d' : '#666',
                    fontWeight: 'bold' 
                  }}>
                    {selectedCheck.differenceValue > 0 ? '+' : ''}¥{selectedCheck.differenceValue.toLocaleString()}
                  </span>
                </p>
              </Col>
            </Row>
            
            {selectedCheck.remark && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedCheck.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InventoryCheck;