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
  message,
  Checkbox
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { 
  SalesOrderService, 
  type SalesOrder, 
  type SalesOrderItem, 
  type SalesOrderRequest 
} from '../../services/salesService';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 订单状态常量
const OrderStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PRODUCING: 'PRODUCING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

// 状态配置
const statusConfig: Record<string, { color: string; text: string }> = {
  [OrderStatus.DRAFT]: { color: 'default', text: '草稿' },
  [OrderStatus.PENDING]: { color: 'orange', text: '待确认' },
  [OrderStatus.CONFIRMED]: { color: 'blue', text: '已确认' },
  [OrderStatus.PRODUCING]: { color: 'cyan', text: '生产中' },
  [OrderStatus.SHIPPED]: { color: 'purple', text: '已发货' },
  [OrderStatus.DELIVERED]: { color: 'green', text: '已交付' },
  [OrderStatus.COMPLETED]: { color: 'success', text: '已完成' },
  [OrderStatus.CANCELLED]: { color: 'red', text: '已取消' }
};

const SalesOrders: React.FC = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<SalesOrderItem[]>([]);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [form] = Form.useForm();

  // 加载订单列表
  const loadOrders = async () => {
    setLoading(true);
    try {
      const orderList = await SalesOrderService.getAllOrders();
      console.log('加载的订单列表:', orderList); // 调试日志
      setOrders(orderList);
      message.success(`成功加载 ${orderList.length} 个订单`);
    } catch (error) {
      console.error('加载订单失败:', error);
      message.error('加载订单列表失败: ' + (error as Error).message);
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
      const searchResults = await SalesOrderService.searchByCustomer(searchText);
      setOrders(searchResults);
      message.success(`找到 ${searchResults.length} 个匹配的订单`);
    } catch (error) {
      console.error('搜索订单失败:', error);
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
      const filteredOrders = await SalesOrderService.getOrdersByStatus(status);
      setOrders(filteredOrders);
      message.success(`找到 ${filteredOrders.length} 个${statusConfig[status]?.text || status}订单`);
    } catch (error) {
      console.error('筛选订单失败:', error);
      message.error('筛选失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 处理查看详情
  const handleViewDetail = async (orderNo: string) => {
    const order = orders.find(o => o.orderNo === orderNo);
    if (!order || !order.id) {
      message.error('订单信息不完整');
      return;
    }

    setLoading(true);
    try {
      const { order: orderDetail, items } = await SalesOrderService.getOrderById(order.id);
      setSelectedOrder(orderDetail);
      setSelectedOrderItems(items);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('获取订单详情失败:', error);
      message.error('获取订单详情失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑
  const handleEdit = async (id: number) => {
    const order = orders.find(o => o.id === id);
    if (!order) {
      message.error('订单不存在');
      return;
    }

    try {
      const { order: orderDetail, items } = await SalesOrderService.getOrderById(id);
      setEditingOrder(orderDetail);
      setSelectedOrderItems(items);
      
      // 设置表单值，确保日期格式正确
      form.setFieldsValue({
        customerName: orderDetail.customerName,
        customerContact: orderDetail.customerContact,
        salesperson: orderDetail.salesperson,
        deliveryDate: orderDetail.deliveryDate ? dayjs(orderDetail.deliveryDate) : null,
        includeTax: orderDetail.includeTax,
        taxRate: orderDetail.taxRate,
        paymentTerms: orderDetail.paymentTerms,
        deliveryAddress: orderDetail.deliveryAddress,
        remarks: orderDetail.remarks,
        items: items.map(item => ({
          productName: item.productName,
          productCode: item.productCode,
          specification: item.specification,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          remarks: item.remarks
        }))
      });
      setEditModalVisible(true);
    } catch (error) {
      console.error('获取订单详情失败:', error);
      message.error('获取订单详情失败: ' + (error as Error).message);
    }
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个销售订单吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await SalesOrderService.deleteOrder(id);
          message.success('删除成功');
          loadOrders(); // 重新加载列表
        } catch (error) {
          console.error('删除订单失败:', error);
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
    // 为新建订单添加一个默认的明细项
    form.setFieldsValue({
      items: [{ productName: '', unit: '个', quantity: 1, unitPrice: 0 }]
    });
    setEditModalVisible(true);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出销售订单数据');
  };

  // 处理保存订单
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      console.log('表单值:', values); // 调试日志
      
      // 构建订单请求数据
      const orderRequest: SalesOrderRequest = {
        customerName: values.customerName,
        customerContact: values.customerContact,
        salesperson: values.salesperson,
        includeTax: values.includeTax || false,
        taxRate: values.taxRate,
        paymentTerms: values.paymentTerms,
        deliveryAddress: values.deliveryAddress,
        remarks: values.remarks,
        items: (values.items || []).map((item: any) => ({
          productName: item.productName,
          productCode: item.productCode || '',
          specification: item.specification || '',
          unit: item.unit || '个',
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          remarks: item.remarks || ''
        }))
      };

      // 只有在选择了日期时才添加 deliveryDate 字段
      if (values.deliveryDate) {
        orderRequest.deliveryDate = values.deliveryDate.format('YYYY-MM-DD');
      }

      console.log('发送的订单数据:', orderRequest); // 调试日志

      if (editingOrder) {
        // 编辑订单
        await SalesOrderService.updateOrder(editingOrder.id!, orderRequest);
        message.success('订单更新成功');
      } else {
        // 新建订单
        await SalesOrderService.createOrder(orderRequest);
        message.success('订单创建成功');
      }
      
      setEditModalVisible(false);
      loadOrders(); // 重新加载列表
    } catch (error) {
      console.error('保存订单失败:', error);
      message.error('保存失败: ' + (error as Error).message);
    }
  };

  // 订单状态变更操作
  const handleStatusChange = async (orderId: number, action: string) => {
    try {
      switch (action) {
        case 'confirm':
          await SalesOrderService.confirmOrder(orderId);
          message.success('订单已确认');
          break;
        case 'production':
          await SalesOrderService.startProduction(orderId);
          message.success('已开始生产');
          break;
        case 'ship':
          await SalesOrderService.shipOrder(orderId);
          message.success('订单已发货');
          break;
        case 'deliver':
          await SalesOrderService.deliverOrder(orderId);
          message.success('订单已交付');
          break;
        case 'complete':
          await SalesOrderService.completeOrder(orderId);
          message.success('订单已完成');
          break;
        case 'cancel':
          Modal.confirm({
            title: '确认取消订单',
            content: '确定要取消这个订单吗？',
            onOk: async () => {
              await SalesOrderService.cancelOrder(orderId);
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
  const columns: ColumnsType<SalesOrder> = [
    {
      title: '订单号',
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
      title: '订单日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 110,
    },
    {
      title: '交付日期',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: 110,
    },
    {
      title: '订单金额',
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
      render: (status: string, record: SalesOrder) => {
        const config = statusConfig[status];
        return (
          <Space direction="vertical" size="small">
            <Tag color={config?.color || 'default'}>{config?.text || status}</Tag>
            {/* 状态操作按钮 */}
            <Space size="small">
              {status === OrderStatus.PENDING && (
                <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'confirm')}>
                  确认
                </Button>
              )}
              {status === OrderStatus.CONFIRMED && (
                <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'production')}>
                  生产
                </Button>
              )}
              {status === OrderStatus.PRODUCING && (
                <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'ship')}>
                  发货
                </Button>
              )}
              {status === OrderStatus.SHIPPED && (
                <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'deliver')}>
                  交付
                </Button>
              )}
              {status === OrderStatus.DELIVERED && (
                <Button size="small" type="link" onClick={() => handleStatusChange(record.id!, 'complete')}>
                  完成
                </Button>
              )}
              {(status === OrderStatus.DRAFT || status === OrderStatus.PENDING) && (
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
    confirmed: orders.filter(o => o.status === OrderStatus.CONFIRMED).length,
    shipped: orders.filter(o => o.status === OrderStatus.SHIPPED).length,
    delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
    totalAmount: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={statistics.total}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已确认"
              value={statistics.confirmed}
              suffix="单"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已发货"
              value={statistics.shipped}
              suffix="单"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="订单总额"
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
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>销售订单管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建订单
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
              placeholder="搜索订单号或客户名称"
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
            <RangePicker 
              style={{ width: '100%' }} 
              placeholder={['开始日期', '结束日期']}
              format="YYYY-MM-DD"
            />
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

      {/* 订单详情弹窗 */}
      <Modal
        title="订单详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <p><strong>订单号：</strong>{selectedOrder.orderNo}</p>
                <p><strong>客户名称：</strong>{selectedOrder.customerName}</p>
                <p><strong>联系人：</strong>{selectedOrder.customerContact}</p>
                <p><strong>销售员：</strong>{selectedOrder.salesperson}</p>
              </Col>
              <Col span={12}>
                <p><strong>订单日期：</strong>{selectedOrder.orderDate}</p>
                <p><strong>交付日期：</strong>{selectedOrder.deliveryDate}</p>
                <p><strong>订单状态：</strong>
                  <Tag color={statusConfig[selectedOrder.status!]?.color || 'default'}>
                    {statusConfig[selectedOrder.status!]?.text || selectedOrder.status}
                  </Tag>
                </p>
                <p><strong>订单总额：</strong>
                  <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                    ¥{(selectedOrder.totalAmount || 0).toLocaleString()}
                  </span>
                </p>
                <p><strong>含税：</strong>{selectedOrder.includeTax ? '是' : '否'}</p>
              </Col>
            </Row>
            
            <h4>订单明细</h4>
            <Table
              columns={[
                { title: '产品名称', dataIndex: 'productName', key: 'productName' },
                { title: '规格型号', dataIndex: 'specification', key: 'specification' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (price: number) => `¥${price}` },
                { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${(amount || 0).toLocaleString()}` },
                { title: '已交货', dataIndex: 'deliveredQty', key: 'deliveredQty' },
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

      {/* 编辑订单弹窗 */}
      <Modal
        title={editingOrder ? '编辑销售订单' : '新建销售订单'}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
          setEditingOrder(null);
          setSelectedOrderItems([]);
        }}
        onOk={handleSave}
        width={1000}
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
                label="交付日期"
                name="deliveryDate"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="请选择交付日期"
                  format="YYYY-MM-DD"
                />
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
                <Checkbox>含税</Checkbox>
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

          {/* 订单明细 */}
          <Form.Item
            label="订单明细"
            name="items"
            rules={[{ required: true, message: '请至少添加一个订单明细' }]}
          >
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card key={key} size="small" style={{ marginBottom: 8 }}>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'productName']}
                            label="产品名称"
                            rules={[{ required: true, message: '请输入产品名称' }]}
                          >
                            <Input placeholder="产品名称" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'productCode']}
                            label="产品编码"
                          >
                            <Input placeholder="产品编码" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'specification']}
                            label="规格型号"
                          >
                            <Input placeholder="规格型号" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'unit']}
                            label="单位"
                            rules={[{ required: true, message: '请输入单位' }]}
                            initialValue="个"
                          >
                            <Input placeholder="单位" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'quantity']}
                            label="数量"
                            rules={[
                              { required: true, message: '请输入数量' },
                              { pattern: /^[0-9]+(\.[0-9]+)?$/, message: '请输入有效的数量' }
                            ]}
                          >
                            <Input placeholder="数量" type="number" min="0.01" step="0.01" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'unitPrice']}
                            label="单价"
                            rules={[
                              { required: true, message: '请输入单价' },
                              { pattern: /^[0-9]+(\.[0-9]+)?$/, message: '请输入有效的单价' }
                            ]}
                          >
                            <Input placeholder="单价" type="number" min="0" step="0.01" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'remarks']}
                            label="备注"
                          >
                            <Input placeholder="备注" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Button 
                        type="link" 
                        danger 
                        onClick={() => remove(name)}
                        style={{ float: 'right' }}
                      >
                        删除此项
                      </Button>
                    </Card>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加订单明细
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesOrders;