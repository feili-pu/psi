import React, { useState, useEffect } from 'react';
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
  message
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  FileTextOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { 
  SalesQuotationService, 
  SalesOrderService,
  type SalesQuotation, 
  type SalesQuotationItem, 
  type SalesQuotationRequest 
} from '../../services/salesService';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 报价状态枚举
const QuotationStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

// 状态标签配置
const statusConfig: Record<string, { color: string; text: string }> = {
  [QuotationStatus.DRAFT]: { color: 'default', text: '草稿' },
  [QuotationStatus.SENT]: { color: 'blue', text: '已发送' },
  [QuotationStatus.ACCEPTED]: { color: 'green', text: '已接受' },
  [QuotationStatus.REJECTED]: { color: 'red', text: '已拒绝' },
  [QuotationStatus.EXPIRED]: { color: 'orange', text: '已过期' }
};

const SalesQuotations: React.FC = () => {
  const [quotations, setQuotations] = useState<SalesQuotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<SalesQuotation | null>(null);
  const [selectedQuotationItems, setSelectedQuotationItems] = useState<SalesQuotationItem[]>([]);
  const [editingQuotation, setEditingQuotation] = useState<SalesQuotation | null>(null);
  const [form] = Form.useForm();

  // 加载报价单列表
  const loadQuotations = async () => {
    setLoading(true);
    try {
      const quotationList = await SalesQuotationService.getAllQuotations();
      setQuotations(quotationList);
      message.success(`成功加载 ${quotationList.length} 个报价单`);
    } catch (error) {
      console.error('加载报价单失败:', error);
      message.error('加载报价单列表失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadQuotations();
  }, []);

  // 搜索报价单
  const handleSearch = async () => {
    if (!searchText.trim()) {
      loadQuotations();
      return;
    }

    setLoading(true);
    try {
      const searchResults = await SalesQuotationService.searchByCustomer(searchText);
      setQuotations(searchResults);
      message.success(`找到 ${searchResults.length} 个匹配的报价单`);
    } catch (error) {
      console.error('搜索报价单失败:', error);
      message.error('搜索失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 按状态筛选
  const handleStatusFilter = async (status: string) => {
    setStatusFilter(status);
    
    if (!status) {
      loadQuotations();
      return;
    }

    setLoading(true);
    try {
      const filteredQuotations = await SalesQuotationService.getQuotationsByStatus(status);
      setQuotations(filteredQuotations);
      message.success(`找到 ${filteredQuotations.length} 个${statusConfig[status]?.text || status}报价单`);
    } catch (error) {
      console.error('筛选报价单失败:', error);
      message.error('筛选失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 处理查看详情
  const handleViewDetail = async (quotationNo: string) => {
    const quotation = quotations.find(q => q.quotationNo === quotationNo);
    if (!quotation || !quotation.id) {
      message.error('报价单信息不完整');
      return;
    }

    setLoading(true);
    try {
      const { quotation: quotationDetail, items } = await SalesQuotationService.getQuotationById(quotation.id);
      setSelectedQuotation(quotationDetail);
      setSelectedQuotationItems(items);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('获取报价单详情失败:', error);
      message.error('获取报价单详情失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑
  const handleEdit = async (id: number) => {
    const quotation = quotations.find(q => q.id === id);
    if (!quotation) {
      message.error('报价单不存在');
      return;
    }

    try {
      const { quotation: quotationDetail, items } = await SalesQuotationService.getQuotationById(id);
      setEditingQuotation(quotationDetail);
      setSelectedQuotationItems(items);
      
      // 设置表单值
      form.setFieldsValue({
        ...quotationDetail,
        items: items
      });
      setEditModalVisible(true);
    } catch (error) {
      console.error('获取报价单详情失败:', error);
      message.error('获取报价单详情失败: ' + (error as Error).message);
    }
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个销售报价单吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await SalesQuotationService.deleteQuotation(id);
          message.success('删除成功');
          loadQuotations(); // 重新加载列表
        } catch (error) {
          console.error('删除报价单失败:', error);
          message.error('删除失败: ' + (error as Error).message);
        }
      },
    });
  };

  // 处理新建报价单
  const handleCreate = () => {
    setEditingQuotation(null);
    setSelectedQuotationItems([]);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出销售报价单数据');
  };

  // 处理保存报价单
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // 构建报价单请求数据
      const quotationRequest: SalesQuotationRequest = {
        customerName: values.customerName,
        customerContact: values.customerContact,
        salesperson: values.salesperson,
        includeTax: values.includeTax || false,
        taxRate: values.taxRate,
        remarks: values.remarks,
        items: values.items || []
      };

      if (editingQuotation) {
        // 编辑报价单
        await SalesQuotationService.updateQuotation(editingQuotation.id!, quotationRequest);
        message.success('报价单更新成功');
      } else {
        // 新建报价单
        await SalesQuotationService.createQuotation(quotationRequest);
        message.success('报价单创建成功');
      }
      
      setEditModalVisible(false);
      loadQuotations(); // 重新加载列表
    } catch (error) {
      console.error('保存报价单失败:', error);
      message.error('保存失败: ' + (error as Error).message);
    }
  };

  // 报价单状态变更操作
  const handleStatusChange = async (quotationId: number, action: string) => {
    try {
      switch (action) {
        case 'send':
          await SalesQuotationService.sendQuotation(quotationId);
          message.success('报价单已发送');
          break;
        case 'accept':
          await SalesQuotationService.acceptQuotation(quotationId);
          message.success('报价单已接受');
          break;
        case 'reject':
          Modal.confirm({
            title: '确认拒绝报价单',
            content: '确定要拒绝这个报价单吗？',
            onOk: async () => {
              await SalesQuotationService.rejectQuotation(quotationId);
              message.success('报价单已拒绝');
              loadQuotations();
            }
          });
          return;
        default:
          message.error('未知操作');
          return;
      }
      loadQuotations(); // 重新加载列表
    } catch (error) {
      console.error('状态变更失败:', error);
      message.error('操作失败: ' + (error as Error).message);
    }
  };

  // 从报价单创建订单
  const handleCreateOrder = async (quotationId: number) => {
    Modal.confirm({
      title: '创建销售订单',
      content: '确定要从这个报价单创建销售订单吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 获取报价单详情
          const { quotation, items } = await SalesQuotationService.getQuotationById(quotationId);
          
          // 构建订单数据
          const orderRequest = {
            quotationId: quotationId,
            customerName: quotation.customerName,
            customerContact: quotation.customerContact,
            salesperson: quotation.salesperson,
            deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30天后
            includeTax: quotation.includeTax,
            taxRate: quotation.taxRate,
            remarks: quotation.remarks,
            items: items.map(item => ({
              productName: item.productName,
              productCode: item.productCode,
              specification: item.specification,
              unit: item.unit,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              remarks: item.remarks
            }))
          };

          await SalesOrderService.createOrderFromQuotation(quotationId, orderRequest);
          message.success('销售订单创建成功');
          loadQuotations(); // 重新加载列表
        } catch (error) {
          console.error('创建订单失败:', error);
          message.error('创建订单失败: ' + (error as Error).message);
        }
      }
    });
  };

  // 表格列定义
  const columns: ColumnsType<SalesQuotation> = [
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
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: '联系人',
      dataIndex: 'customerContact',
      key: 'customerContact',
      width: 100,
    },
    {
      title: '销售员',
      dataIndex: 'salesperson',
      key: 'salesperson',
      width: 100,
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
    },
    {
      title: '报价金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{(amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string, record: SalesQuotation) => {
        const config = statusConfig[status];
        return (
          <Space direction="vertical" size="small">
            <Tag color={config?.color || 'default'}>{config?.text || status}</Tag>
            {/* 状态操作按钮 */}
            <Space size="small">
              {status === QuotationStatus.DRAFT && (
                <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'send')}>
                  发送
                </Button>
              )}
              {status === QuotationStatus.SENT && (
                <>
                  <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'accept')}>
                    接受
                  </Button>
                  <Button size="small" type="link" danger onClick={() => handleStatusChange(record.id!, 'reject')}>
                    拒绝
                  </Button>
                </>
              )}
              {status === QuotationStatus.ACCEPTED && (
                <Button size="small" type="link" onClick={() => handleCreateOrder(record.id!)}>
                  转订单
                </Button>
              )}
            </Space>
          </Space>
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
            onClick={() => handleViewDetail(record.quotationNo!)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id!)}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id!)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 统计数据
  const statistics = {
    total: quotations.length,
    draft: quotations.filter(q => q.status === QuotationStatus.DRAFT).length,
    sent: quotations.filter(q => q.status === QuotationStatus.SENT).length,
    accepted: quotations.filter(q => q.status === QuotationStatus.ACCEPTED).length,
    totalAmount: quotations.reduce((sum, quotation) => sum + (quotation.totalAmount || 0), 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总报价单数"
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
              title="已发送"
              value={statistics.sent}
              suffix="单"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="报价总额"
              value={statistics.totalAmount}
              precision={2}
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
            <FileTextOutlined />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>销售报价管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建报价单
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadQuotations}
              loading={loading}
            >
              刷新
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
              placeholder="搜索报价单号或客户名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
            >
              搜索
            </Button>
          </Col>
          <Col span={4}>
            <Select
              placeholder="选择状态"
              value={statusFilter}
              onChange={handleStatusFilter}
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
          <Col span={6}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={quotations}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 报价单详情弹窗 */}
      <Modal
        title="报价单详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedQuotation && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>报价单号：</strong>{selectedQuotation.quotationNo}</p>
                <p><strong>客户名称：</strong>{selectedQuotation.customerName}</p>
                <p><strong>联系人：</strong>{selectedQuotation.customerContact}</p>
                <p><strong>销售员：</strong>{selectedQuotation.salesperson}</p>
              </Col>
              <Col span={12}>
                <p><strong>报价日期：</strong>{selectedQuotation.quotationDate}</p>
                <p><strong>有效期至：</strong>{selectedQuotation.validUntil}</p>
                <p><strong>报价状态：</strong>
                  <Tag color={statusConfig[selectedQuotation.status!]?.color || 'default'}>
                    {statusConfig[selectedQuotation.status!]?.text || selectedQuotation.status}
                  </Tag>
                </p>
                <p><strong>报价总额：</strong>
                  <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                    ¥{(selectedQuotation.totalAmount || 0).toLocaleString()}
                  </span>
                </p>
                <p><strong>含税：</strong>{selectedQuotation.includeTax ? '是' : '否'}</p>
              </Col>
            </Row>
            
            <h4>报价明细</h4>
            <Table
              columns={[
                { title: '产品名称', dataIndex: 'productName', key: 'productName' },
                { title: '规格型号', dataIndex: 'specification', key: 'specification' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (price: number) => `¥${price}` },
                { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${(amount || 0).toLocaleString()}` },
              ]}
              dataSource={selectedQuotationItems}
              pagination={false}
              size="small"
              rowKey="id"
            />
            
            {selectedQuotation.remarks && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedQuotation.remarks}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑报价单弹窗 */}
      <Modal
        title={editingQuotation ? '编辑销售报价单' : '新建销售报价单'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="客户名称"
                name="customerName"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系人"
                name="customerContact"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="销售员"
                name="salesperson"
                rules={[{ required: true, message: '请输入销售员' }]}
              >
                <Input placeholder="请输入销售员" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="含税"
                name="includeTax"
                valuePropName="checked"
              >
                <input type="checkbox" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="税率(%)"
                name="taxRate"
              >
                <InputNumber
                  placeholder="请输入税率"
                  min={0}
                  max={100}
                  step={0.01}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="备注"
            name="remarks"
          >
            <TextArea placeholder="请输入备注" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesQuotations;