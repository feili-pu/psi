import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Card,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  message,
  Tree,
  Divider,
  Select,
  Spin
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SafetyOutlined,
  TeamOutlined,
  CrownOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import AuthService from '../../services/authService';

// 角色接口定义
interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  description: string;
  status: number; // 1启用 0禁用
  level: string; // 角色层级
  department: string; // 所属部门
  userCount: number; // 用户数量
  createdTime?: string;
  updatedTime?: string;
  permissions?: Permission[];
}

interface Permission {
  id: number;
  permissionCode: string;
  permissionName: string;
  resourceType?: string;
  resourceUrl?: string;
}

// API服务类
class RoleService {
  private static baseUrl = 'http://localhost:8080/api/roles';

  // 获取所有角色
  static async getAllRoles(): Promise<Role[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: AuthService.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('获取角色列表失败:', error);
      throw error;
    }
  }

  // 根据ID获取角色
  static async getRoleById(id: number): Promise<Role> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: AuthService.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('获取角色详情失败:', error);
      throw error;
    }
  }

  // 搜索角色
  static async searchRoles(name: string): Promise<Role[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?name=${encodeURIComponent(name)}`, {
        headers: AuthService.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('搜索角色失败:', error);
      throw error;
    }
  }

  // 创建角色
  static async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(role),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('创建角色失败:', error);
      throw error;
    }
  }

  // 更新角色
  static async updateRole(id: number, role: Partial<Role>): Promise<Role> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(role),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('更新角色失败:', error);
      throw error;
    }
  }

  // 删除角色
  static async deleteRole(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('删除角色失败:', error);
      throw error;
    }
  }

  // 获取角色权限
  static async getRolePermissions(id: number): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/permissions`, {
        headers: AuthService.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('获取角色权限失败:', error);
      throw error;
    }
  }
}
const permissionTreeData: DataNode[] = [
  {
    title: '工作台',
    key: 'dashboard',
    children: [
      { title: '查看工作台', key: 'dashboard:view' },
      { title: '个人设置', key: 'dashboard:profile' },
    ],
  },
  {
    title: '销售管理',
    key: 'sales',
    children: [
      {
        title: '销售订单',
        key: 'sales:orders',
        children: [
          { title: '查看订单', key: 'sales:orders:view' },
          { title: '创建订单', key: 'sales:orders:create' },
          { title: '编辑订单', key: 'sales:orders:edit' },
          { title: '删除订单', key: 'sales:orders:delete' },
          { title: '审核订单', key: 'sales:orders:review' },
          { title: '审批订单', key: 'sales:orders:approve' },
          { title: '订单跟踪', key: 'sales:orders:track' },
          { title: '财务信息', key: 'sales:orders:financial:view' },
        ]
      },
      {
        title: '销售报价',
        key: 'sales:quotations',
        children: [
          { title: '查看报价', key: 'sales:quotations:view' },
          { title: '创建报价', key: 'sales:quotations:create' },
          { title: '编辑报价', key: 'sales:quotations:edit' },
          { title: '删除报价', key: 'sales:quotations:delete' },
          { title: '发送报价', key: 'sales:quotations:send' },
          { title: '审批报价', key: 'sales:quotations:approve' },
        ]
      },
      {
        title: '客户管理',
        key: 'sales:customers',
        children: [
          { title: '查看客户', key: 'sales:customers:view' },
          { title: '创建客户', key: 'sales:customers:create' },
          { title: '编辑客户', key: 'sales:customers:edit' },
          { title: '客户管理', key: 'sales:customers:manage' },
        ]
      },
      {
        title: '团队管理',
        key: 'sales:team',
        children: [
          { title: '团队管理', key: 'sales:team:manage' },
          { title: '业绩考核', key: 'sales:team:performance' },
        ]
      },
      { title: '销售统计', key: 'sales:statistics:view' },
    ],
  },
  {
    title: '采购管理',
    key: 'purchase',
    children: [
      {
        title: '采购申请',
        key: 'purchase:requests',
        children: [
          { title: '查看申请', key: 'purchase:requests:view' },
          { title: '创建申请', key: 'purchase:requests:create' },
          { title: '编辑申请', key: 'purchase:requests:edit' },
          { title: '审核申请', key: 'purchase:requests:review' },
          { title: '审批申请', key: 'purchase:requests:approve' },
        ]
      },
      {
        title: '采购订单',
        key: 'purchase:orders',
        children: [
          { title: '查看订单', key: 'purchase:orders:view' },
          { title: '创建订单', key: 'purchase:orders:create' },
          { title: '编辑订单', key: 'purchase:orders:edit' },
          { title: '删除订单', key: 'purchase:orders:delete' },
          { title: '审核订单', key: 'purchase:orders:review' },
          { title: '审批订单', key: 'purchase:orders:approve' },
          { title: '财务信息', key: 'purchase:orders:financial:view' },
        ]
      },
      {
        title: '供应商管理',
        key: 'purchase:suppliers',
        children: [
          { title: '查看供应商', key: 'purchase:suppliers:view' },
          { title: '编辑供应商', key: 'purchase:suppliers:edit' },
          { title: '供应商管理', key: 'purchase:suppliers:manage' },
        ]
      },
      {
        title: '询价比价',
        key: 'purchase:inquiry',
        children: [
          { title: '创建询价', key: 'purchase:inquiry:create' },
          { title: '价格比较', key: 'purchase:comparison:create' },
        ]
      },
      {
        title: '合同管理',
        key: 'purchase:contracts',
        children: [
          { title: '合同管理', key: 'purchase:contracts:manage' },
        ]
      },
      { title: '采购统计', key: 'purchase:statistics:view' },
    ],
  },
  {
    title: '库存管理',
    key: 'inventory',
    children: [
      { title: '库存查看', key: 'inventory:view' },
      { title: '库存盘点', key: 'inventory:check' },
      { title: '入库管理', key: 'inventory:receipt' },
      { title: '出库管理', key: 'inventory:issue' },
      { title: '库存调拨', key: 'inventory:transfer' },
      { title: '库存调整', key: 'inventory:adjust' },
      { title: '库位管理', key: 'inventory:location:manage' },
      { title: '质检入库', key: 'inventory:receipt:qc' },
      { title: '质检出库', key: 'inventory:issue:qc' },
      { title: '库存统计', key: 'inventory:statistics:view' },
      { title: '人员管理', key: 'inventory:staff:manage' },
    ],
  },
  {
    title: '财务管理',
    key: 'finance',
    children: [
      {
        title: '账务管理',
        key: 'finance:accounts',
        children: [
          { title: '查看账务', key: 'finance:accounts:view' },
          { title: '账务管理', key: 'finance:accounts:manage' },
        ]
      },
      { title: '凭证录入', key: 'finance:vouchers:create' },
      { title: '财务报表', key: 'finance:reports:view' },
      { title: '财务分析', key: 'finance:analysis:view' },
    ],
  },
  {
    title: '质量管理',
    key: 'quality',
    children: [
      { title: '质检报告', key: 'quality:reports:create' },
      { title: '质量标准', key: 'quality:standards:view' },
    ],
  },
  {
    title: '客户服务',
    key: 'service',
    children: [
      { title: '工单管理', key: 'service:tickets:manage' },
      { title: '客户反馈', key: 'service:feedback:handle' },
    ],
  },
  {
    title: '统计报表',
    key: 'statistics',
    children: [
      { title: '销售报表', key: 'statistics:sales' },
      { title: '采购报表', key: 'statistics:purchase' },
      { title: '库存报表', key: 'statistics:inventory' },
      { title: '财务报表', key: 'statistics:financial' },
      { title: '成本分析', key: 'statistics:cost' },
      { title: '利润分析', key: 'statistics:profit' },
      { title: '客户分析', key: 'statistics:customer' },
      { title: '供应商分析', key: 'statistics:supplier' },
      { title: '仓库分析', key: 'statistics:warehouse' },
    ],
  },
  {
    title: '数据分析',
    key: 'analytics',
    children: [
      { title: '高级分析', key: 'analytics:advanced' },
      { title: '自定义报表', key: 'reports:custom:create' },
      { title: '数据导出', key: 'data:export' },
      { title: '数据分析', key: 'data:analysis' },
    ],
  },
  {
    title: '系统管理',
    key: 'system',
    children: [
      { title: '用户管理', key: 'system:users:manage' },
      { title: '角色管理', key: 'system:roles:manage' },
      { title: '权限管理', key: 'system:permissions:manage' },
      { title: '系统设置', key: 'system:settings:manage' },
    ],
  },
];

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  // 组件挂载时加载数据
  useEffect(() => {
    loadRoles();
  }, []);

  // 加载角色列表
  const loadRoles = async () => {
    setLoading(true);
    try {
      const roleList = await RoleService.getAllRoles();
      setRoles(roleList);
      message.success(`成功加载 ${roleList.length} 个角色`);
    } catch (error) {
      message.error('加载角色列表失败，请检查后端服务是否启动');
      console.error('加载角色失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索角色
  const handleSearch = async () => {
    if (!searchText.trim()) {
      loadRoles();
      return;
    }

    setLoading(true);
    try {
      const searchResults = await RoleService.searchRoles(searchText);
      setRoles(searchResults);
      message.success(`找到 ${searchResults.length} 个匹配的角色`);
    } catch (error) {
      message.error('搜索角色失败');
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: '角色信息',
      key: 'roleInfo',
      width: 220,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 
              record.level === 'SUPER' ? '#f5222d' :
              record.level === 'EXECUTIVE' ? '#722ed1' :
              record.level === 'DIRECTOR' ? '#1890ff' :
              record.level === 'MANAGER' ? '#13c2c2' :
              record.level === 'SUPERVISOR' ? '#52c41a' :
              record.level === 'SPECIALIST' ? '#fa8c16' : '#faad14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            {record.level === 'SUPER' ? <CrownOutlined style={{ color: '#fff', fontSize: '18px' }} /> :
             record.level === 'EXECUTIVE' || record.level === 'DIRECTOR' ? <TeamOutlined style={{ color: '#fff', fontSize: '18px' }} /> :
             <UserOutlined style={{ color: '#fff', fontSize: '18px' }} />}
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.roleName}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.roleCode}</div>
            <div style={{ fontSize: '11px', color: '#999' }}>{record.department}</div>
          </div>
        </div>
      ),
    },
    {
      title: '角色层级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => {
        const levelConfig: Record<string, { color: string; text: string }> = {
          'SUPER': { color: 'red', text: '超级' },
          'EXECUTIVE': { color: 'purple', text: '高管' },
          'DIRECTOR': { color: 'blue', text: '总监' },
          'MANAGER': { color: 'cyan', text: '经理' },
          'SUPERVISOR': { color: 'green', text: '主管' },
          'SPECIALIST': { color: 'orange', text: '专员' },
          'STAFF': { color: 'default', text: '员工' }
        };
        const config = levelConfig[level] || levelConfig['STAFF'];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
      render: (count: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {count}人
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'default'}>
          {status === 1 ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 150,
      render: (time: string) => time ? new Date(time).toLocaleDateString() : '-',
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
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
            disabled={record.level === 'SUPER'}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (role: Role) => {
    setSelectedRole(role);
    setDetailModalVisible(true);
  };

  // 处理编辑角色
  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    // 如果角色有权限信息，设置选中的权限
    if (role.permissions) {
      const permissionCodes = role.permissions.map(p => p.permissionCode);
      setCheckedKeys(permissionCodes);
    } else {
      setCheckedKeys([]);
    }
    form.setFieldsValue({
      ...role,
      status: role.status === 1 ? 'active' : 'inactive'
    });
    setEditModalVisible(true);
  };

  // 处理删除角色
  const handleDelete = async (id: number) => {
    try {
      await RoleService.deleteRole(id);
      message.success('删除角色成功');
      loadRoles(); // 重新加载列表
    } catch (error) {
      message.error('删除角色失败');
      console.error('删除失败:', error);
    }
  };

  // 处理新建角色
  const handleCreate = () => {
    setSelectedRole(null);
    setCheckedKeys([]);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 处理保存角色
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const roleData = {
        ...values,
        status: values.status === 'active' ? 1 : 0,
        permissions: checkedKeys // 这里需要根据后端API调整
      };

      if (selectedRole) {
        // 编辑角色
        await RoleService.updateRole(selectedRole.id, roleData);
        message.success('角色更新成功');
      } else {
        // 新建角色
        await RoleService.createRole(roleData);
        message.success('角色创建成功');
      }
      
      setEditModalVisible(false);
      loadRoles(); // 重新加载列表
    } catch (error: any) {
      if (error.errorFields) {
        message.error('请检查表单输入');
      } else {
        message.error(selectedRole ? '更新角色失败' : '创建角色失败');
        console.error('保存失败:', error);
      }
    }
  };

  // 处理权限树选择
  const onCheck = (checkedKeysValue: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    if (Array.isArray(checkedKeysValue)) {
      setCheckedKeys(checkedKeysValue);
    } else {
      setCheckedKeys(checkedKeysValue.checked);
    }
  };

  // 过滤数据
  const filteredRoles = roles.filter(role => {
    const matchSearch = !searchText || 
      role.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
      role.roleCode.toLowerCase().includes(searchText.toLowerCase()) ||
      role.description.toLowerCase().includes(searchText.toLowerCase());
    return matchSearch;
  });

  // 统计数据
  const statistics = {
    total: roles.length,
    active: roles.filter(r => r.status === 1).length,
    inactive: roles.filter(r => r.status === 0).length,
    totalUsers: roles.reduce((sum, role) => sum + (role.userCount || 0), 0)
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总角色数"
              value={statistics.total}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
              prefix={<SafetyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="启用角色"
              value={statistics.active}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="停用角色"
              value={statistics.inactive}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="关联用户"
              value={statistics.totalUsers}
              suffix="人"
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SafetyOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>角色管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建角色
            </Button>
            <Button
              icon={<SearchOutlined />}
              onClick={loadRoles}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        }
      >
        {/* 搜索 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Input.Search
              placeholder="搜索角色名称、编码或描述"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              allowClear
            />
          </Col>
        </Row>

        {/* 数据表格 */}
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredRoles}
            rowKey="id"
            pagination={{
              total: filteredRoles.length,
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
          />
        </Spin>
      </Card>

      {/* 角色详情弹窗 */}
      <Modal
        title="角色详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRole && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={24} style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  backgroundColor: selectedRole.roleCode === 'admin' ? '#f5222d' : 
                                 selectedRole.roleCode.includes('manager') ? '#1890ff' : '#52c41a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  {selectedRole.roleCode === 'admin' ? <CrownOutlined style={{ color: '#fff', fontSize: '32px' }} /> :
                   selectedRole.roleCode.includes('manager') ? <TeamOutlined style={{ color: '#fff', fontSize: '32px' }} /> :
                   <UserOutlined style={{ color: '#fff', fontSize: '32px' }} />}
                </div>
                <h3>{selectedRole.roleName}</h3>
                <Tag color={selectedRole.status === 1 ? 'green' : 'default'}>
                  {selectedRole.status === 1 ? '启用' : '停用'}
                </Tag>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>角色编码：</strong>{selectedRole.roleCode}</p>
                <p><strong>用户数量：</strong>{selectedRole.userCount}人</p>
              </Col>
              <Col span={12}>
                <p><strong>创建时间：</strong>{selectedRole.createdTime ? new Date(selectedRole.createdTime).toLocaleString() : '未知'}</p>
                <p><strong>权限数量：</strong>{selectedRole.permissions ? selectedRole.permissions.length : 0}个</p>
              </Col>
            </Row>
            
            <Divider />
            
            <div>
              <p><strong>角色描述：</strong></p>
              <p style={{ color: '#666', marginLeft: '16px' }}>{selectedRole.description}</p>
            </div>
            
            <Divider />
            
            <div>
              <p><strong>权限列表：</strong></p>
              <Tree
                checkable
                checkedKeys={selectedRole.permissions ? selectedRole.permissions.map(p => p.permissionCode) : []}
                treeData={permissionTreeData}
                disabled
                style={{ marginLeft: '16px' }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 编辑角色弹窗 */}
      <Modal
        title={selectedRole ? '编辑角色' : '新建角色'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active', level: 'STAFF' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="角色名称"
                name="roleName"
                rules={[{ required: true, message: '请输入角色名称' }]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="角色编码"
                name="roleCode"
                rules={[{ required: true, message: '请输入角色编码' }]}
              >
                <Input placeholder="请输入角色编码" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="角色层级"
                name="level"
                rules={[{ required: true, message: '请选择角色层级' }]}
              >
                <Select placeholder="请选择角色层级">
                  <Select.Option value="SUPER">超级管理员</Select.Option>
                  <Select.Option value="EXECUTIVE">高管层</Select.Option>
                  <Select.Option value="DIRECTOR">总监层</Select.Option>
                  <Select.Option value="MANAGER">经理层</Select.Option>
                  <Select.Option value="SUPERVISOR">主管层</Select.Option>
                  <Select.Option value="SPECIALIST">专员层</Select.Option>
                  <Select.Option value="STAFF">员工层</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="所属部门"
                name="department"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <Select placeholder="请选择所属部门">
                  <Select.Option value="管理层">管理层</Select.Option>
                  <Select.Option value="信息技术部">信息技术部</Select.Option>
                  <Select.Option value="销售部">销售部</Select.Option>
                  <Select.Option value="采购部">采购部</Select.Option>
                  <Select.Option value="仓储部">仓储部</Select.Option>
                  <Select.Option value="财务部">财务部</Select.Option>
                  <Select.Option value="质检部">质检部</Select.Option>
                  <Select.Option value="客服部">客服部</Select.Option>
                  <Select.Option value="运营部">运营部</Select.Option>
                  <Select.Option value="人事部">人事部</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="角色描述"
            name="description"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
          
          <Form.Item
            label="状态"
            name="status"
          >
            <Select>
              <Select.Option value="active">启用</Select.Option>
              <Select.Option value="inactive">停用</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="权限配置">
            <Tree
              checkable
              checkedKeys={checkedKeys}
              onCheck={onCheck}
              treeData={permissionTreeData}
              style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '8px', maxHeight: '300px', overflow: 'auto' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement;