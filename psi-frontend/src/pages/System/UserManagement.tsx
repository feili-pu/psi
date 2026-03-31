import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  message,
  Avatar,
  Tooltip,
  Popconfirm,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  SettingOutlined,
  TeamOutlined,
  ReloadOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AuthService from '../../services/authService';

const { Option } = Select;

// 用户接口定义
interface User {
  id: number;
  username: string;
  password?: string;
  realName: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  status: number; // 1启用 0禁用
  createdTime?: string;
  updatedTime?: string;
  roles?: Role[];
}

interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  description?: string;
}

// API服务类
class UserService {
  private static baseUrl = 'http://localhost:8080/api/users';

  // 获取所有用户
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: AuthService.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    }
  }

  // 根据ID获取用户
  static async getUserById(id: number): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: AuthService.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('获取用户详情失败:', error);
      throw error;
    }
  }

  // 搜索用户
  static async searchUsers(name: string): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?name=${encodeURIComponent(name)}`, {
        headers: AuthService.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('搜索用户失败:', error);
      throw error;
    }
  }

  // 创建用户
  static async createUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  }

  // 更新用户
  static async updateUser(id: number, user: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  }

  // 删除用户
  static async deleteUser(id: number): Promise<boolean> {
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
      console.error('删除用户失败:', error);
      throw error;
    }
  }
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 组件挂载时加载数据
  useEffect(() => {
    loadUsers();
  }, []);

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true);
    try {
      const userList = await UserService.getAllUsers();
      setUsers(userList);
      message.success(`成功加载 ${userList.length} 个用户`);
    } catch (error) {
      message.error('加载用户列表失败，请检查后端服务是否启动');
      console.error('加载用户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索用户
  const handleSearch = async () => {
    if (!searchText.trim()) {
      loadUsers();
      return;
    }

    setLoading(true);
    try {
      const searchResults = await UserService.searchUsers(searchText);
      setUsers(searchResults);
      message.success(`找到 ${searchResults.length} 个匹配的用户`);
    } catch (error) {
      message.error('搜索用户失败');
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理新增用户
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑用户
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      ...user,
      // 不显示密码
      password: undefined
    });
    setModalVisible(true);
  };

  // 处理删除用户
  const handleDelete = async (id: number) => {
    try {
      await UserService.deleteUser(id);
      message.success('删除用户成功');
      loadUsers(); // 重新加载列表
    } catch (error) {
      message.error('删除用户失败');
      console.error('删除失败:', error);
    }
  };

  // 处理保存用户
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // 编辑用户
        await UserService.updateUser(editingUser.id, values);
        message.success('更新用户成功');
      } else {
        // 新增用户
        await UserService.createUser({
          ...values,
          status: 1 // 默认启用
        });
        message.success('创建用户成功');
      }
      
      setModalVisible(false);
      loadUsers(); // 重新加载列表
    } catch (error: any) {
      if (error.errorFields) {
        message.error('请检查表单输入');
      } else {
        message.error(editingUser ? '更新用户失败' : '创建用户失败');
        console.error('保存失败:', error);
      }
    }
  };

  // 切换用户状态
  const toggleUserStatus = async (user: User) => {
    try {
      const newStatus = user.status === 1 ? 0 : 1;
      await UserService.updateUser(user.id, { status: newStatus });
      message.success(`用户已${newStatus === 1 ? '启用' : '禁用'}`);
      loadUsers(); // 重新加载列表
    } catch (error) {
      message.error('更新用户状态失败');
      console.error('状态更新失败:', error);
    }
  };

  // 表格列定义
  const columns: ColumnsType<User> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: () => (
        <Avatar size="large" icon={<UserOutlined />} />
      ),
    },
    {
      title: '用户信息',
      key: 'userInfo',
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.realName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>@{record.username}</div>
        </div>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '13px' }}>{record.email}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>{record.phone || '未设置'}</div>
        </div>
      ),
    },
    {
      title: '角色',
      key: 'roles',
      width: 120,
      render: (_, record) => (
        <div>
          {record.roles && record.roles.length > 0 ? (
            record.roles.map(role => (
              <Tag key={role.id} color="blue" style={{ marginBottom: '2px' }}>
                {role.roleName}
              </Tag>
            ))
          ) : (
            <Tag color="default">未分配</Tag>
          )}
        </div>
      ),
    },
    {
      title: '部门职位',
      key: 'department',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.department || '-'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.position || '-'}</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number, record: User) => (
        <div>
          <Tag color={status === 1 ? 'green' : 'red'} icon={status === 1 ? <UnlockOutlined /> : <LockOutlined />}>
            {status === 1 ? '正常' : '禁用'}
          </Tag>
          <div style={{ marginTop: '4px' }}>
            <Button
              size="small"
              type="text"
              onClick={() => toggleUserStatus(record)}
            >
              {status === 1 ? '禁用' : '启用'}
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 120,
      render: (time: string) => time ? new Date(time).toLocaleDateString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                Modal.info({
                  title: '用户详情',
                  content: (
                    <div>
                      <p><strong>ID:</strong> {record.id}</p>
                      <p><strong>用户名:</strong> {record.username}</p>
                      <p><strong>真实姓名:</strong> {record.realName}</p>
                      <p><strong>邮箱:</strong> {record.email}</p>
                      <p><strong>手机:</strong> {record.phone || '未设置'}</p>
                      <p><strong>部门:</strong> {record.department || '未设置'}</p>
                      <p><strong>职位:</strong> {record.position || '未设置'}</p>
                      <p><strong>角色:</strong> {
                        record.roles && record.roles.length > 0 
                          ? record.roles.map(role => role.roleName).join(', ')
                          : '未分配角色'
                      }</p>
                      <p><strong>状态:</strong> {record.status === 1 ? '正常' : '禁用'}</p>
                      <p><strong>创建时间:</strong> {record.createdTime || '未知'}</p>
                    </div>
                  ),
                  width: 500,
                });
              }}
            >
              查看
            </Button>
          </Tooltip>
          <Tooltip title="编辑用户">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </Tooltip>
          <Tooltip title="删除用户">
            <Popconfirm
              title="确定要删除这个用户吗？"
              description="删除后无法恢复，请谨慎操作。"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              >
                删除
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 过滤数据
  const filteredUsers = users.filter(user => {
    const matchStatus = !statusFilter || 
      (statusFilter === 'active' && user.status === 1) ||
      (statusFilter === 'inactive' && user.status === 0);
    const matchDepartment = !departmentFilter || user.department === departmentFilter;
    return matchStatus && matchDepartment;
  });

  // 统计数据
  const statistics = {
    total: users.length,
    active: users.filter(u => u.status === 1).length,
    inactive: users.filter(u => u.status === 0).length,
    departments: [...new Set(users.map(u => u.department).filter(Boolean))].length
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={statistics.total}
              suffix="人"
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常用户"
              value={statistics.active}
              suffix="人"
              valueStyle={{ color: '#52c41a' }}
              prefix={<SafetyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="禁用用户"
              value={statistics.inactive}
              suffix="人"
              valueStyle={{ color: '#f5222d' }}
              prefix={<LockOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="部门数量"
              value={statistics.departments}
              suffix="个"
              valueStyle={{ color: '#722ed1' }}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TeamOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>用户管理</span>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增用户
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadUsers}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        }
      >
        {/* 搜索和筛选 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Input.Search
              placeholder="搜索用户名或真实姓名"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="用户状态"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="active">正常</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="部门筛选"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {[...new Set(users.map(u => u.department).filter(Boolean))].map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* 数据表格 */}
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            pagination={{
              total: filteredUsers.length,
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
            scroll={{ x: 1200 }}
          />
        </Spin>
      </Card>

      {/* 新增/编辑用户弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 1
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="用户名"
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="真实姓名"
                name="realName"
                rules={[
                  { required: true, message: '请输入真实姓名' },
                  { min: 2, message: '姓名至少2位' }
                ]}
              >
                <Input placeholder="请输入真实姓名" />
              </Form.Item>
            </Col>
          </Row>

          {!editingUser && (
            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6位' }
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="手机号"
                name="phone"
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="部门"
                name="department"
              >
                <Select placeholder="请选择部门" allowClear>
                  <Option value="IT部">IT部</Option>
                  <Option value="销售部">销售部</Option>
                  <Option value="采购部">采购部</Option>
                  <Option value="仓储部">仓储部</Option>
                  <Option value="财务部">财务部</Option>
                  <Option value="人事部">人事部</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="职位"
                name="position"
              >
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value={1}>正常</Option>
                  <Option value={0}>禁用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="角色"
                name="roles"
              >
                <Select 
                  mode="multiple" 
                  placeholder="请选择角色" 
                  allowClear
                  optionLabelProp="label"
                >
                  <Option value="admin" label="系统管理员">
                    <Tag color="red">系统管理员</Tag>
                  </Option>
                  <Option value="sales_manager" label="销售经理">
                    <Tag color="blue">销售经理</Tag>
                  </Option>
                  <Option value="sales_staff" label="销售员">
                    <Tag color="green">销售员</Tag>
                  </Option>
                  <Option value="purchase_manager" label="采购经理">
                    <Tag color="purple">采购经理</Tag>
                  </Option>
                  <Option value="purchase_staff" label="采购员">
                    <Tag color="cyan">采购员</Tag>
                  </Option>
                  <Option value="warehouse_manager" label="仓库经理">
                    <Tag color="orange">仓库经理</Tag>
                  </Option>
                  <Option value="warehouse_staff" label="仓库员">
                    <Tag color="geekblue">仓库员</Tag>
                  </Option>
                  <Option value="finance_staff" label="财务员">
                    <Tag color="magenta">财务员</Tag>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;