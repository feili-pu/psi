import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { RealResourceUtils } from '../../services/realResourceService';

type FieldConfig = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'textarea';
  required?: boolean;
  options?: { label: string; value: string | number }[];
};

type StatusAction = {
  label: string;
  statuses?: string[];
  action: (id: number) => Promise<any>;
};

type InventoryResourcePageProps = {
  title: string;
  rowNoKey: string;
  rowNoPrefix: string;
  list: () => Promise<any[]>;
  get?: (id: number) => Promise<any>;
  save?: (values: any, id?: number) => Promise<any>;
  remove?: (id: number) => Promise<any>;
  actions?: StatusAction[];
  fields?: FieldConfig[];
};

const statusText: Record<string, { color: string; text: string }> = {
  PENDING: { color: 'blue', text: '待处理' },
  APPROVED: { color: 'cyan', text: '已审批' },
  PROCESSED: { color: 'green', text: '已处理' },
  COMPLETED: { color: 'green', text: '已完成' },
  CANCELLED: { color: 'red', text: '已取消' },
  IN_STOCK: { color: 'green', text: '在库' },
  OUT_STOCK: { color: 'default', text: '出库' },
  SCRAPPED: { color: 'red', text: '报废' },
  draft: { color: 'default', text: '草稿' },
  pending: { color: 'blue', text: '待处理' },
  completed: { color: 'green', text: '已完成' },
  cancelled: { color: 'red', text: '已取消' }
};

const firstText = (...values: any[]) => {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value);
    }
  }
  return '-';
};

const normalizeRows = (rows: any[], rowNoKey: string, rowNoPrefix: string) =>
  rows.map((row) => ({
    ...row,
    [rowNoKey]: row[rowNoKey] || row.receiptNo || row.checkNo || row.requisitionNo || row.returnNo || row.assemblyNo || row.disassemblyNo || row.serialNumber || `${rowNoPrefix}#${row.id}`,
    displayWarehouse: row.warehouseName || (row.warehouseId ? `仓库#${row.warehouseId}` : '-'),
    displayOperator: firstText(row.operator, row.checker, row.applicant, row.returner, row.createdBy),
    displayDate: firstText(row.receiptDate, row.checkDate, row.createdTime?.slice(0, 10), row.updatedTime?.slice(0, 10)),
    displayQuantity: Number(row.totalQuantity ?? row.quantity ?? row.productionQuantity ?? row.assemblyQuantity ?? row.disassemblyQuantity ?? row.itemCount ?? 0),
    displayAmount: Number(row.totalAmount ?? row.totalValue ?? row.differenceValue ?? 0),
    remark: row.remark || row.remarks
  }));

const InventoryResourcePage: React.FC<InventoryResourcePageProps> = ({
  title,
  rowNoKey,
  rowNoPrefix,
  list,
  get,
  save,
  remove,
  actions = [],
  fields = []
}) => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [form] = Form.useForm();

  const loadRows = async () => {
    setLoading(true);
    try {
      const data = await list();
      setRows(normalizeRows(data || [], rowNoKey, rowNoPrefix));
    } catch (error) {
      message.error(`加载${title}失败: ${(error as Error).message}`);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  const filteredRows = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter((row) =>
      [row[rowNoKey], row.displayWarehouse, row.displayOperator, row.status, row.remark]
        .some((value) => String(value || '').toLowerCase().includes(keyword))
    );
  }, [rows, rowNoKey, searchText]);

  const openDetail = async (row: any) => {
    try {
      const detail = get ? await get(row.id) : row;
      setSelectedRow({ ...row, ...detail });
      setDetailVisible(true);
    } catch (error) {
      message.error(`读取详情失败: ${(error as Error).message}`);
    }
  };

  const openEdit = (row?: any) => {
    setSelectedRow(row || null);
    form.resetFields();
    if (row) form.setFieldsValue(row);
    setEditVisible(true);
  };

  const submitForm = async () => {
    if (!save) return;
    try {
      const values = await form.validateFields();
      await save(values, selectedRow?.id);
      message.success(selectedRow ? '保存成功' : '创建成功');
      setEditVisible(false);
      loadRows();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  const runAction = async (action: StatusAction, row: any) => {
    try {
      await action.action(row.id);
      message.success(`${action.label}成功`);
      loadRows();
    } catch (error) {
      message.error(`${action.label}失败: ${(error as Error).message}`);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: '单号/序列号',
      dataIndex: rowNoKey,
      width: 160,
      render: (text, row) => <Button type="link" onClick={() => openDetail(row)}>{text}</Button>
    },
    { title: '仓库', dataIndex: 'displayWarehouse', width: 120 },
    { title: '经办人', dataIndex: 'displayOperator', width: 100 },
    { title: '日期', dataIndex: 'displayDate', width: 120 },
    {
      title: '数量',
      dataIndex: 'displayQuantity',
      width: 100,
      render: (value: number) => <span style={{ color: '#1677ff', fontWeight: 600 }}>{value || 0}</span>
    },
    {
      title: '金额',
      dataIndex: 'displayAmount',
      width: 120,
      render: (value: number) => `¥${(value || 0).toLocaleString()}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (status: string) => {
        const config = statusText[status] || { color: 'default', text: status || '-' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 260,
      render: (_, row) => (
        <Space size="small" wrap>
          {save && (
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEdit(row)}>
              编辑
            </Button>
          )}
          {actions
            .filter((action) => !action.statuses?.length || action.statuses.includes(row.status))
            .map((action) => (
              <Button key={action.label} type="text" icon={<CheckCircleOutlined />} size="small" onClick={() => runAction(action, row)}>
                {action.label}
              </Button>
            ))}
          {remove && (
            <Popconfirm title={`确定删除这条${title}记录吗？`} onConfirm={async () => {
              await remove(row.id);
              message.success('删除成功');
              loadRows();
            }}>
              <Button type="text" danger icon={<DeleteOutlined />} size="small">
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="记录数" value={rows.length} suffix="条" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="待处理" value={rows.filter((row) => row.status === 'PENDING').length} suffix="条" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="已完成" value={rows.filter((row) => ['PROCESSED', 'COMPLETED', 'APPROVED'].includes(row.status)).length} suffix="条" />
          </Card>
        </Col>
      </Row>

      <Card
        title={title}
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadRows}>刷新</Button>
            {save && <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit()}>新建</Button>}
            <Button icon={<ExportOutlined />} onClick={() => RealResourceUtils.exportCsv(`${title}.csv`, filteredRows)}>导出</Button>
          </Space>
        }
      >
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="搜索单号、仓库、经办人、状态或备注"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          style={{ width: 360, marginBottom: 16 }}
        />
        <Table
          columns={columns}
          dataSource={filteredRows}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <Modal title={`${title}详情`} open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={760}>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 520, overflow: 'auto' }}>
          {JSON.stringify(selectedRow, null, 2)}
        </pre>
      </Modal>

      <Modal title={selectedRow ? `编辑${title}` : `新建${title}`} open={editVisible} onCancel={() => setEditVisible(false)} onOk={submitForm} width={720}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            {fields.map((field) => (
              <Col span={field.type === 'textarea' ? 24 : 12} key={field.name}>
                <Form.Item label={field.label} name={field.name} rules={field.required ? [{ required: true, message: `请输入${field.label}` }] : undefined}>
                  {field.type === 'number' ? (
                    <InputNumber style={{ width: '100%' }} min={0} />
                  ) : field.type === 'select' ? (
                    <Select options={field.options} />
                  ) : field.type === 'textarea' ? (
                    <Input.TextArea rows={3} />
                  ) : (
                    <Input />
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryResourcePage;
