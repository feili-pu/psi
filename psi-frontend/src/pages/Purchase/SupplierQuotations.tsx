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
import { PurchaseRealApi, RealResourceUtils } from '../../services/realResourceService';

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
  [QuotationStatus.EXPIRED]: { color: 'default', text: '已过期', icon: <ClockCircleOutlined /> },
  SUBMITTED: { color: 'blue', text: '已提交', icon: <ClockCircleOutlined /> },
  SELECTED: { color: 'green', text: '已选中', icon: <CheckCircleOutlined /> },
  REJECTED: { color: 'red', text: '已拒绝', icon: <ExclamationCircleOutlined /> }
};

const SupplierQuotations: React.FC = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [form] = Form.useForm();

  const mapQuotation = (quotation: any) => ({
    ...quotation,
    supplierPhone: quotation.supplierPhone || quotation.supplierContact,
    supplierEmail: quotation.supplierEmail || '-',
    supplierRating: quotation.supplierRating || 3,
    evaluator: quotation.evaluator || '-',
    items: quotation.items || []
  });

  const loadQuotations = async () => {
    setLoading(true);
    try {
      const data = await PurchaseRealApi.listSupplierQuotations();
      setQuotations(data.map(mapQuotation));
    } catch (error) {
      message.error('加载供应商报价失败: ' + (error as Error).message);
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotations();
  }, []);

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
  const handleViewDetail = async (quotationNo: string) => {
    const quotation = quotations.find(q => q.quotationNo === quotationNo);
    if (!quotation?.id) return;
    try {
      const detail = await PurchaseRealApi.getSupplierQuotation(quotation.id);
      setSelectedQuotation(mapQuotation({ ...detail.quotation, items: detail.items }));
      setDetailModalVisible(true);
    } catch (error) {
      message.error('获取供应商报价详情失败: ' + (error as Error).message);
    }
  };

  // 处理编辑评估
  const handleEdit = async (id: number) => {
    const quotation = quotations.find(q => q.id === id);
    setSelectedQuotation(quotation);
    try {
      const detail = await PurchaseRealApi.getSupplierQuotation(id);
      const normalized = mapQuotation({ ...detail.quotation, items: detail.items });
      setSelectedQuotation(normalized);
      form.setFieldsValue(normalized);
      setEditModalVisible(true);
    } catch (error) {
      message.error('获取供应商报价详情失败: ' + (error as Error).message);
    }
  };

  // 处理接受报价
  const handleAccept = (id: number) => {
    Modal.confirm({
      title: '接受报价',
      content: '确定要接受这个供应商报价吗？',
      async onOk() {
        await PurchaseRealApi.selectSupplierQuotation(id);
        message.success('报价已接受');
        loadQuotations();
      },
    });
  };

  // 处理拒绝报价
  const handleReject = (id: number) => {
    Modal.confirm({
      title: '拒绝报价',
      content: '确定要拒绝这个供应商报价吗？',
      async onOk() {
        await PurchaseRealApi.rejectSupplierQuotation(id);
        message.success('报价已拒绝');
        loadQuotations();
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
    RealResourceUtils.exportCsv('供应商报价.csv', filteredQuotations);
  };

  // 处理保存评估
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (selectedQuotation) {
        await PurchaseRealApi.saveSupplierQuotation(values, selectedQuotation.id);
        message.success('评估更新成功');
      } else {
        await PurchaseRealApi.saveSupplierQuotation(values);
        message.success('报价记录创建成功');
      }
      setEditModalVisible(false);
      loadQuotations();
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
          loading={loading}
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
