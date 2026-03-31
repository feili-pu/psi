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
  message
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  ShopOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { 
  PurchaseOrderService, 
  type PurchaseOrder, 
  type PurchaseOrderItem, 
  type PurchaseOrderRequest 
} from '../../services/purchaseService';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 采购订单状态枚举
const PurchaseOrderStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  ORDERED: 'ORDERED',
  RECEIVED: 'RECEIVED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

// 状态标签配置
const statusConfig: Record<string, { color: string; text: string }> = {
  [PurchaseOrderStatus.DRAFT]: { color: 'default', text: '草稿' },
  [PurchaseOrderStatus.SUBMITTED]: { color: 'blue', text: '已提交' },
  [PurchaseOrderStatus.APPROVED]: { color: 'cyan', text: '已审批' },
  [PurchaseOrderStatus.ORDERED]: { color: 'orange', text: '已下单' },
  [PurchaseOrderStatus.RECEIVED]: { color: 'purple', text: '已收货' },
  [PurchaseOrderStatus.COMPLETED]: { color: 'green', text: '已完成' },
  [PurchaseOrderStatus.CANCELLED]: { color: 'red', text: '已取消' }
};

const PurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [form] = Form.useForm();

  // 加载采购订单列表
  const loadOrders = async () => {
    setLoading(true);
    try {
      const orderList = await PurchaseOrderService.getAllOrders();
      setOrders(orderList);
      message.success(`成功加载 ${orderList.length} 个采购订单`);
    } catch (error) {
      console.error('加载采购订单失败:', error);
      message.error('加载采购订单列表失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadOrders();
  }, []);

  // 搜索订单
  const handleSearch = async () => {
    if (!searchText.trim()) {
      loadOrders();
      return;
    }

    setLoading(true);
    try {
      const searchResults = await PurchaseOrderService.searchBySupplier(searchText);
      setOrders(searchResults);
      message.success(`找到 ${searchResults.length} 个匹配的采购订单`);
    } catch (error) {
      console.error('搜索采购订单失败:', error);
      message.error('搜索失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 按状态筛选
  const handleStatusFilter = async (status: string) => {
    setStatusFilter(status);
    
    if (!status) {
      loadOrders();
      return;
    }

    setLoading(true);
    try {
      const filteredOrders = await PurchaseOrderService.getOrdersByStatus(status);
      setOrders(filteredOrders);
      message.success(`找到 ${filteredOrders.length} 个${statusConfig[status]?.text || status}订单`);
    } catch (error) {
      console.error('筛选采购订单失败:', error);
      message.error('筛选失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 处理查看详情
  const handleViewDetail = async (orderNo: string) => {
    const order = orders.find(o => o.orderNo === orderNo);
    if (!order || !order.id) {
      message.error('采购订单信息不完整');
      return;
    }

    setLoading(true);
    try {
      const { order: orderDetail, items } = await PurchaseOrderService.getOrderById(order.id);
      setSelectedOrder(orderDetail);
      setSelectedOrderItems(items);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('获取采购订单详情失败:', error);
      message.error('获取采购订单详情失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑
  const handleEdit = async (id: number) => {
    const order = orders.find(o => o.id === id);
    if (!order) {
      message.error('采购订单不存在');
      return;
    }

    try {
      const { order: orderDetail, items } = await PurchaseOrderService.getOrderById(id);
      setEditingOrder(orderDetail);
      setSelectedOrderItems(items);
      
      // 设置表单值
      form.setFieldsValue({
        ...orderDetail,
        expectedDate: orderDetail.expectedDate,
        items: items
      });
      setEditModalVisible(true);
    } catch (error) {
      console.error('获取采购订单详情失败:', error);
      message.error('获取采购订单详情失败: ' + (error as Error).message);
    }
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个采购订单吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await PurchaseOrderService.deleteOrder(id);
          message.success('删除成功');
          loadOrders(); // 重新加载列表
        } catch (error) {
          console.error('删除采购订单失败:', error);
          message.error('删除失败: ' + (error as Error).message);
        }
      },
    });
  };

  // 处理新建订单
  const handleCreate = () => {
    setEditingOrder(null);
    setSelectedOrderItems([]);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出采购订单数据');
  };

  // 处理保存订单
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // 构建订单请求数据
      const orderRequest: PurchaseOrderRequest = {
        supplierName: values.supplierName,
        supplierContact: values.supplierContact,
        purchaser: values.purchaser,
        expectedDate: values.expectedDate,
        includeTax: values.includeTax || false,
        taxRate: values.taxRate,
        paymentTerms: values.paymentTerms,
        deliveryAddress: values.deliveryAddress,
        remarks: values.remarks,
        items: values.items || []
      };

      if (editingOrder) {
        // 编辑订单
        await PurchaseOrderService.updateOrder(editingOrder.id!, orderRequest);
        message.success('采购订单更新成功');
      } else {
        // 新建订单
        await PurchaseOrderService.createOrder(orderRequest);
        message.success('采购订单创建成功');
      }
      
      setEditModalVisible(false);
      loadOrders(); // 重新加载列表
    } catch (error) {
      console.error('保存采购订单失败:', error);
      message.error('保存失败: ' + (error as Error).message);
    }
  };

  // 订单状态变更操作
  const handleStatusChange = async (orderId: number, action: string) => {
    try {
      switch (action) {
        case 'submit':
          await PurchaseOrderService.submitOrder(orderId);
          message.success('订单已提交');
          break;
        case 'approve':
          await PurchaseOrderService.approveOrder(orderId);
          message.success('订单已审批');
          break;
        case 'place':
          await PurchaseOrderService.placeOrder(orderId);
          message.success('订单已下单');
          break;
        case 'receive':
          await PurchaseOrderService.receiveOrder(orderId);
          message.success('订单已收货');
          break;
        case 'complete':
          await PurchaseOrderService.completeOrder(orderId);
          message.success('订单已完成');
          break;
        case 'cancel':
          Modal.confirm({
            title: '确认取消订单',
            content: '确定要取消这个采购订单吗？',
            onOk: async () => {
              await PurchaseOrderService.cancelOrder(orderId);
              message.success('订单已取消');
              loadOrders();
            }
          });
          return;
        default:
          message.error('未知操作');
          return;
      }
      loadOrders(); // 重新加载列表
    } catch (error) {
      console.error('状态变更失败:', error);
      message.error('操作失败: ' + (error as Error).message);
    }
  };

  // 表格列定义
  const columns: ColumnsType<PurchaseOrder> = [
    {
      title: '采购单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 120,
      render: (text: string) => (
        <Button type="link" onClick={() => handleViewDetail(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
    },
    {
      title: '联系人',
      dataIndex: 'supplierContact',
      key: 'supplierContact',
      width: 100,
    },
    {
      title: '采购员',
      dataIndex: 'purchaser',
      key: 'purchaser',
      width: 100,
    },
    {
      title: '订单日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 110,
    },
    {
      title: '期望到货',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
      width: 110,
    },
    {
      title: '采购金额',
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
      render: (status: string, record: PurchaseOrder) => {
        const config = statusConfig[status];
        return (
          <Space direction="vertical" size="small">
            <Tag color={config?.color || 'default'}>{config?.text || status}</Tag>
            {/* 状态操作按钮 */}
            <Space size="small">
              {status === PurchaseOrderStatus.DRAFT && (
                <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'submit')}>
                  提交
                </Button>
              )}
              {status === PurchaseOrderStatus.SUBMITTED && (
                <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'approve')}>
                  审批
                </Button>
              )}
              {status === PurchaseOrderStatus.APPROVED && (
                <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'place')}>
                  下单
                </Button>
              )}
              {status === PurchaseOrderStatus.ORDERED && (
                <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'receive')}>
                  收货
                </Button>
              )}
              {status === PurchaseOrderStatus.RECEIVED && (
                <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'complete')}>
                  完成
                </Button>
              )}
              {(status === PurchaseOrderStatus.DRAFT || status === PurchaseOrderStatus.SUBMITTED) && (
                <Button size="small" type="link" danger onClick={() => handleStatusChange(record.id!, 'cancel')}>
                  取消
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
            onClick={() => handleViewDetail(record.orderNo!)}
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
    total: orders.length,
    submitted: orders.filter(o => o.status === PurchaseOrderStatus.SUBMITTED).length,
    approved: orders.filter(o => o.status === PurchaseOrderStatus.APPROVED).length,
    ordered: orders.filter(o => o.status === PurchaseOrderStatus.ORDERED).length,
    totalAmount: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总采购单"
              value={statistics.total}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已提交"
              value={statistics.submitted}
              suffix="单"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已审批"
              value={statistics.approved}
              suffix="单"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="采购总额"
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
            <ShopOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>采购订单管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建采购单
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadOrders}
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
              placeholder="搜索采购单号或供应商名称"
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
          dataSource={orders}
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

      {/* 采购订单详情弹窗 */}
      <Modal
        title="采购订单详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>采购单号：</strong>{selectedOrder.orderNo}</p>
                <p><strong>供应商名称：</strong>{selectedOrder.supplierName}</p>
                <p><strong>联系人：</strong>{selectedOrder.supplierContact}</p>
                <p><strong>采购员：</strong>{selectedOrder.purchaser}</p>
              </Col>
              <Col span={12}>
                <p><strong>订单日期：</strong>{selectedOrder.orderDate}</p>
                <p><strong>期望到货：</strong>{selectedOrder.expectedDate}</p>
                <p><strong>订单状态：</strong>
                  <Tag color={statusConfig[selectedOrder.status!]?.color || 'default'}>
                    {statusConfig[selectedOrder.status!]?.text || selectedOrder.status}
                  </Tag>
                </p>
                <p><strong>采购总额：</strong>
                  <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                    ¥{(selectedOrder.totalAmount || 0).toLocaleString()}
                  </span>
                </p>
                <p><strong>含税：</strong>{selectedOrder.includeTax ? '是' : '否'}</p>
              </Col>
            </Row>
            
            <h4>采购明细</h4>
            <Table
              columns={[
                { title: '产品名称', dataIndex: 'productName', key: 'productName' },
                { title: '规格型号', dataIndex: 'specification', key: 'specification' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (price: number) => `¥${price}` },
                { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${(amount || 0).toLocaleString()}` },
                { title: '已收货', dataIndex: 'receivedQty', key: 'receivedQty' },
                { title: '剩余', dataIndex: 'remainingQty', key: 'remainingQty' },
              ]}
              dataSource={selectedOrderItems}
              pagination={false}
              size="small"
              rowKey="id"
            />
            
            {selectedOrder.remarks && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>备注：</strong>{selectedOrder.remarks}</p>
              </div>
            )}
            
            {selectedOrder.deliveryAddress && (
              <div style={{ marginTop: '8px' }}>
                <p><strong>交货地址：</strong>{selectedOrder.deliveryAddress}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑采购订单弹窗 */}
      <Modal
        title={editingOrder ? '编辑采购订单' : '新建采购订单'}
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
                label="采购员"
                name="purchaser"
                rules={[{ required: true, message: '请输入采购员' }]}
              >
                <Input placeholder="请输入采购员" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="期望到货日期"
                name="expectedDate"
                rules={[{ required: true, message: '请选择期望到货日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="付款条件"
                name="paymentTerms"
              >
                <Input placeholder="请输入付款条件" />
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

          <Form.Item
            label="交货地址"
            name="deliveryAddress"
          >
            <Input.TextArea placeholder="请输入交货地址" rows={2} />
          </Form.Item>

          <Form.Item
            label="备注"
            name="remarks"
          >
            <Input.TextArea placeholder="请输入备注" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PurchaseOrders;