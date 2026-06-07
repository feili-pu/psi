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
  InputNumber,
  message,
  Divider,
  Progress,
  Alert
} from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  ExportOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PurchaseRealApi, RealResourceUtils } from '../../services/realResourceService';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 应付状态枚举
const PayableStatus = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

// 状态标签配置
const statusConfig = {
  [PayableStatus.UNPAID]: { color: 'orange', text: '未付款', icon: <ClockCircleOutlined /> },
  [PayableStatus.PARTIAL]: { color: 'blue', text: '部分付款', icon: <ExclamationCircleOutlined /> },
  [PayableStatus.PAID]: { color: 'green', text: '已付款', icon: <CheckCircleOutlined /> },
  [PayableStatus.OVERDUE]: { color: 'red', text: '逾期', icon: <WarningOutlined /> },
  [PayableStatus.CANCELLED]: { color: 'default', text: '已取消', icon: <ClockCircleOutlined /> },
  UNPAID: { color: 'orange', text: '未付款', icon: <ClockCircleOutlined /> },
  PARTIAL_PAID: { color: 'blue', text: '部分付款', icon: <ExclamationCircleOutlined /> },
  PAID: { color: 'green', text: '已付款', icon: <CheckCircleOutlined /> }
};

const PurchasePayable: React.FC = () => {
  const [payables, setPayables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<any>(null);
  const [form] = Form.useForm();

  const mapPayable = (payable: any) => ({
    ...payable,
    supplierName: payable.supplierName || `供应商#${payable.supplierId || '-'}`,
    purchaseOrderNo: payable.purchaseOrderNo || (payable.purchaseOrderId ? `PO#${payable.purchaseOrderId}` : '-'),
    invoiceNo: payable.invoiceNo || '-',
    invoiceDate: payable.invoiceDate || payable.createdTime,
    totalAmount: payable.totalAmount || 0,
    paidAmount: payable.paidAmount || 0,
    unpaidAmount: payable.unpaidAmount || 0,
    remark: payable.remark || payable.remarks
  });

  const loadPayables = async () => {
    setLoading(true);
    try {
      const data = await PurchaseRealApi.listPayables();
      setPayables(data.map(mapPayable));
    } catch (error) {
      message.error('加载采购应付失败: ' + (error as Error).message);
      setPayables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayables();
  }, []);

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '应付单号',
      dataIndex: 'payableNo',
      key: 'payableNo',
      width: 120,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: '采购订单号',
      dataIndex: 'purchaseOrderNo',
      key: 'purchaseOrderNo',
      width: 120,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '发票号',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      width: 120,
    },
    {
      title: '发票日期',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: 110,
    },
    {
      title: '到期日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 110,
      render: (date: string, record) => {
        const isOverdue = new Date(date) < new Date() && record.status !== PayableStatus.PAID && record.status !== 'PAID';
        return (
          <span style={{ color: isOverdue ? '#f5222d' : '#666' }}>
            {date}
          </span>
        );
      },
    },
    {
      title: '应付金额',
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
      title: '已付金额',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      width: 120,
      render: (amount: number) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '未付金额',
      dataIndex: 'unpaidAmount',
      key: 'unpaidAmount',
      width: 120,
      render: (amount: number) => (
        <span style={{ color: amount > 0 ? '#faad14' : '#52c41a', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '付款进度',
      key: 'progress',
      width: 120,
      render: (_, record) => {
        const progress = record.totalAmount > 0 ? Math.round((record.paidAmount / record.totalAmount) * 100) : 0;
        return (
          <Progress 
            percent={progress} 
            size="small" 
            strokeColor={progress === 100 ? '#52c41a' : progress > 0 ? '#1890ff' : '#faad14'}
          />
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status] || statusConfig.UNPAID;
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
            onClick={() => handleViewDetail(record.payableNo)}
          >
            查看
          </Button>
          {(record.status === PayableStatus.UNPAID || record.status === PayableStatus.PARTIAL || record.status === PayableStatus.OVERDUE || record.status === 'UNPAID' || record.status === 'PARTIAL_PAID') && (
            <Button
              type="text"
              icon={<DollarCircleOutlined />}
              size="small"
              style={{ color: '#52c41a' }}
              onClick={() => handlePayment(record.id)}
            >
              付款
            </Button>
          )}
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
            disabled={record.status === PayableStatus.PAID || record.status === PayableStatus.CANCELLED || record.status === 'PAID'}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (payableNo: string) => {
    const payable = payables.find(p => p.payableNo === payableNo);
    setSelectedPayable(payable);
    setDetailModalVisible(true);
  };

  // 处理付款
  const handlePayment = (id: number) => {
    const payable = payables.find(p => p.id === id);
    setSelectedPayable(payable);
    form.setFieldsValue({
      paymentAmount: payable?.unpaidAmount,
      paymentMethod: '银行转账',
      paymentDate: new Date().toISOString().split('T')[0]
    });
    setPaymentModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (id: number) => {
    const payable = payables.find(p => p.id === id);
    setSelectedPayable(payable);
    if (payable) {
      form.setFieldsValue(payable);
      setPaymentModalVisible(true);
    }
  };

  // 处理导出
  const handleExport = () => {
    RealResourceUtils.exportCsv('采购应付.csv', filteredPayables);
  };

  // 处理付款保存
  const handlePaymentSave = async () => {
    try {
      const values = await form.validateFields();
      const paymentAmount = values.paymentAmount;
      
      if (selectedPayable) {
        await PurchaseRealApi.processPayment(selectedPayable.id, paymentAmount);
        message.success(`付款成功，付款金额：¥${paymentAmount.toLocaleString()}`);
        setPaymentModalVisible(false);
        loadPayables();
      }
    } catch (error) {
      console.error('付款失败:', error);
    }
  };

  // 过滤数据
  const filteredPayables = payables.filter(payable => {
    const matchSearch = !searchText || 
      payable.payableNo.toLowerCase().includes(searchText.toLowerCase()) ||
      payable.purchaseOrderNo.toLowerCase().includes(searchText.toLowerCase()) ||
      payable.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
      payable.invoiceNo.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || payable.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 统计数据
  const statistics = {
    total: payables.length,
    unpaid: payables.filter(p => p.status === PayableStatus.UNPAID || p.status === 'UNPAID').length,
    partial: payables.filter(p => p.status === PayableStatus.PARTIAL || p.status === 'PARTIAL_PAID').length,
    overdue: payables.filter(p => p.status === PayableStatus.OVERDUE).length,
    totalAmount: payables.reduce((sum, payable) => sum + payable.totalAmount, 0),
    paidAmount: payables.reduce((sum, payable) => sum + payable.paidAmount, 0),
    unpaidAmount: payables.reduce((sum, payable) => sum + payable.unpaidAmount, 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="应付总额"
              value={statistics.totalAmount}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已付金额"
              value={statistics.paidAmount}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="未付金额"
              value={statistics.unpaidAmount}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="逾期单数"
              value={statistics.overdue}
              suffix="单"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 逾期提醒 */}
      {statistics.overdue > 0 && (
        <Alert
          message={`您有 ${statistics.overdue} 笔逾期应付款项，请及时处理！`}
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* 主要内容卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>采购应付管理</span>
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
              placeholder="搜索应付单号、采购单号、供应商或发票号"
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
          dataSource={filteredPayables}
          rowKey="id"
          pagination={{
            total: filteredPayables.length,
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
          loading={loading}
        />
      </Card>

      {/* 应付详情弹窗 */}
      <Modal
        title="采购应付详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedPayable && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>应付单号：</strong>{selectedPayable.payableNo}</p>
                <p><strong>采购订单号：</strong>{selectedPayable.purchaseOrderNo}</p>
                <p><strong>供应商：</strong>{selectedPayable.supplierName}</p>
                <p><strong>联系人：</strong>{selectedPayable.supplierContact}</p>
                <p><strong>联系电话：</strong>{selectedPayable.supplierPhone}</p>
                <p><strong>发票号：</strong>{selectedPayable.invoiceNo}</p>
                <p><strong>发票日期：</strong>{selectedPayable.invoiceDate}</p>
              </Col>
              <Col span={12}>
                <p><strong>到期日期：</strong>{selectedPayable.dueDate}</p>
                <p><strong>付款条件：</strong>{selectedPayable.paymentTerms}</p>
                <p><strong>采购部门：</strong>{selectedPayable.department}</p>
                <p><strong>采购员：</strong>{selectedPayable.purchaser}</p>
                <p><strong>会计：</strong>{selectedPayable.accountant}</p>
                <p><strong>付款日期：</strong>{selectedPayable.paymentDate || '未付款'}</p>
                <p><strong>付款方式：</strong>{selectedPayable.paymentMethod || '未付款'}</p>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="应付金额"
                    value={selectedPayable.totalAmount}
                    precision={2}
                    prefix="¥"
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="已付金额"
                    value={selectedPayable.paidAmount}
                    precision={2}
                    prefix="¥"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="未付金额"
                    value={selectedPayable.unpaidAmount}
                    precision={2}
                    prefix="¥"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Progress 
                percent={selectedPayable.totalAmount > 0 ? Math.round((selectedPayable.paidAmount / selectedPayable.totalAmount) * 100) : 0}
                strokeColor={selectedPayable.unpaidAmount === 0 ? '#52c41a' : '#1890ff'}
                style={{ width: '80%' }}
              />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Tag color={(statusConfig[selectedPayable.status] || statusConfig.UNPAID).color} icon={(statusConfig[selectedPayable.status] || statusConfig.UNPAID).icon}>
                {(statusConfig[selectedPayable.status] || statusConfig.UNPAID).text}
              </Tag>
            </div>
            
            {selectedPayable.remark && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedPayable.remark}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 付款弹窗 */}
      <Modal
        title="付款操作"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        onOk={handlePaymentSave}
        width={600}
      >
        {selectedPayable && (
          <div>
            <Alert
              message={`供应商：${selectedPayable.supplierName}`}
              description={`未付金额：¥${selectedPayable.unpaidAmount.toLocaleString()}`}
              type="info"
              style={{ marginBottom: '16px' }}
            />
            
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                label="付款金额"
                name="paymentAmount"
                rules={[
                  { required: true, message: '请输入付款金额' },
                  { 
                    validator: (_, value) => {
                      if (value > selectedPayable.unpaidAmount) {
                        return Promise.reject(new Error('付款金额不能超过未付金额'));
                      }
                      if (value <= 0) {
                        return Promise.reject(new Error('付款金额必须大于0'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入付款金额"
                  min={0}
                  max={selectedPayable.unpaidAmount}
                  precision={2}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
              
              <Form.Item
                label="付款方式"
                name="paymentMethod"
                rules={[{ required: true, message: '请选择付款方式' }]}
              >
                <Select placeholder="请选择付款方式">
                  <Option value="银行转账">银行转账</Option>
                  <Option value="现金支付">现金支付</Option>
                  <Option value="支票支付">支票支付</Option>
                  <Option value="承兑汇票">承兑汇票</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="付款日期"
                name="paymentDate"
                rules={[{ required: true, message: '请选择付款日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                label="付款备注"
                name="paymentRemark"
              >
                <TextArea rows={3} placeholder="请输入付款备注" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchasePayable;
