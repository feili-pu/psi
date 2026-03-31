import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Collapse,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Divider,
  Typography,
  Alert,
  Tabs,
  Table,
  Modal,
  message,
  Tooltip,
  Badge,
  Statistic
} from 'antd';
import {
  ApiOutlined,
  SearchOutlined,
  CopyOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  BugOutlined,
  SettingOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Panel } = Collapse;
const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// HTTP方法配置
const methodConfig = {
  GET: { color: 'green', text: 'GET' },
  POST: { color: 'blue', text: 'POST' },
  PUT: { color: 'orange', text: 'PUT' },
  DELETE: { color: 'red', text: 'DELETE' },
  PATCH: { color: 'purple', text: 'PATCH' }
};

// API状态配置
const statusConfig = {
  stable: { color: 'green', text: '稳定', icon: <CheckCircleOutlined /> },
  beta: { color: 'orange', text: '测试', icon: <ExclamationCircleOutlined /> },
  deprecated: { color: 'red', text: '废弃', icon: <ExclamationCircleOutlined /> }
};

// 模拟API文档数据
const mockApiData = {
  info: {
    title: 'PSI管理系统 API',
    version: '1.0.0',
    description: 'PSI（采购、销售、库存）管理系统的RESTful API接口文档',
    baseUrl: 'https://api.psi-system.com/v1',
    contact: {
      name: 'API支持团队',
      email: 'api-support@psi-system.com',
      url: 'https://docs.psi-system.com'
    }
  },
  modules: [
    {
      name: '用户认证',
      key: 'auth',
      description: '用户登录、注册、权限验证相关接口',
      icon: <SafetyOutlined />,
      apis: [
        {
          id: 1,
          method: 'POST',
          path: '/auth/login',
          summary: '用户登录',
          description: '用户通过用户名和密码进行登录认证',
          status: 'stable',
          tags: ['认证', '登录'],
          parameters: [
            { name: 'username', type: 'string', required: true, description: '用户名' },
            { name: 'password', type: 'string', required: true, description: '密码' }
          ],
          responses: {
            200: { description: '登录成功', example: '{"code": 200, "data": {"token": "xxx", "user": {...}}}' },
            401: { description: '用户名或密码错误', example: '{"code": 401, "message": "Invalid credentials"}' }
          }
        },
        {
          id: 2,
          method: 'POST',
          path: '/auth/logout',
          summary: '用户登出',
          description: '用户退出登录，清除认证信息',
          status: 'stable',
          tags: ['认证', '登出'],
          parameters: [],
          responses: {
            200: { description: '登出成功', example: '{"code": 200, "message": "Logout successful"}' }
          }
        },
        {
          id: 3,
          method: 'GET',
          path: '/auth/profile',
          summary: '获取用户信息',
          description: '获取当前登录用户的详细信息',
          status: 'stable',
          tags: ['认证', '用户信息'],
          parameters: [],
          responses: {
            200: { description: '获取成功', example: '{"code": 200, "data": {"id": 1, "username": "admin", ...}}' },
            401: { description: '未授权', example: '{"code": 401, "message": "Unauthorized"}' }
          }
        }
      ]
    },
    {
      name: '用户管理',
      key: 'users',
      description: '用户增删改查、角色分配等管理接口',
      icon: <SettingOutlined />,
      apis: [
        {
          id: 4,
          method: 'GET',
          path: '/users',
          summary: '获取用户列表',
          description: '分页获取系统用户列表，支持搜索和筛选',
          status: 'stable',
          tags: ['用户', '列表'],
          parameters: [
            { name: 'page', type: 'integer', required: false, description: '页码，默认1' },
            { name: 'size', type: 'integer', required: false, description: '每页数量，默认10' },
            { name: 'keyword', type: 'string', required: false, description: '搜索关键词' }
          ],
          responses: {
            200: { description: '获取成功', example: '{"code": 200, "data": {"list": [...], "total": 100}}' }
          }
        },
        {
          id: 5,
          method: 'POST',
          path: '/users',
          summary: '创建用户',
          description: '创建新的系统用户',
          status: 'stable',
          tags: ['用户', '创建'],
          parameters: [
            { name: 'username', type: 'string', required: true, description: '用户名' },
            { name: 'email', type: 'string', required: true, description: '邮箱' },
            { name: 'password', type: 'string', required: true, description: '密码' },
            { name: 'roleIds', type: 'array', required: false, description: '角色ID数组' }
          ],
          responses: {
            201: { description: '创建成功', example: '{"code": 201, "data": {"id": 123, ...}}' },
            400: { description: '参数错误', example: '{"code": 400, "message": "Invalid parameters"}' }
          }
        },
        {
          id: 6,
          method: 'PUT',
          path: '/users/{id}',
          summary: '更新用户',
          description: '更新指定用户的信息',
          status: 'stable',
          tags: ['用户', '更新'],
          parameters: [
            { name: 'id', type: 'integer', required: true, description: '用户ID' },
            { name: 'username', type: 'string', required: false, description: '用户名' },
            { name: 'email', type: 'string', required: false, description: '邮箱' }
          ],
          responses: {
            200: { description: '更新成功', example: '{"code": 200, "data": {...}}' },
            404: { description: '用户不存在', example: '{"code": 404, "message": "User not found"}' }
          }
        }
      ]
    },
    {
      name: '销售管理',
      key: 'sales',
      description: '销售订单、报价单等销售业务相关接口',
      icon: <ThunderboltOutlined />,
      apis: [
        {
          id: 7,
          method: 'GET',
          path: '/sales/orders',
          summary: '获取销售订单列表',
          description: '分页获取销售订单列表，支持多条件筛选',
          status: 'stable',
          tags: ['销售', '订单'],
          parameters: [
            { name: 'page', type: 'integer', required: false, description: '页码' },
            { name: 'size', type: 'integer', required: false, description: '每页数量' },
            { name: 'status', type: 'string', required: false, description: '订单状态' },
            { name: 'customerId', type: 'integer', required: false, description: '客户ID' }
          ],
          responses: {
            200: { description: '获取成功', example: '{"code": 200, "data": {"list": [...], "total": 50}}' }
          }
        },
        {
          id: 8,
          method: 'POST',
          path: '/sales/orders',
          summary: '创建销售订单',
          description: '创建新的销售订单',
          status: 'beta',
          tags: ['销售', '订单', '创建'],
          parameters: [
            { name: 'customerId', type: 'integer', required: true, description: '客户ID' },
            { name: 'items', type: 'array', required: true, description: '订单项目列表' },
            { name: 'remark', type: 'string', required: false, description: '备注' }
          ],
          responses: {
            201: { description: '创建成功', example: '{"code": 201, "data": {"orderId": "SO202401001"}}' }
          }
        }
      ]
    },
    {
      name: '库存管理',
      key: 'inventory',
      description: '库存查询、入库出库等库存管理接口',
      icon: <DatabaseOutlined />,
      apis: [
        {
          id: 9,
          method: 'GET',
          path: '/inventory/stock',
          summary: '获取库存信息',
          description: '查询产品库存信息，支持按仓库、产品等条件筛选',
          status: 'stable',
          tags: ['库存', '查询'],
          parameters: [
            { name: 'warehouseId', type: 'integer', required: false, description: '仓库ID' },
            { name: 'productCode', type: 'string', required: false, description: '产品编码' }
          ],
          responses: {
            200: { description: '获取成功', example: '{"code": 200, "data": [...]}' }
          }
        }
      ]
    }
  ]
};

// 错误码说明
const errorCodes = [
  { code: 200, message: 'OK', description: '请求成功' },
  { code: 201, message: 'Created', description: '资源创建成功' },
  { code: 400, message: 'Bad Request', description: '请求参数错误' },
  { code: 401, message: 'Unauthorized', description: '未授权，需要登录' },
  { code: 403, message: 'Forbidden', description: '禁止访问，权限不足' },
  { code: 404, message: 'Not Found', description: '资源不存在' },
  { code: 500, message: 'Internal Server Error', description: '服务器内部错误' }
];

const ApiDocumentation: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [selectedApi, setSelectedApi] = useState<any>(null);
  const [testParams, setTestParams] = useState('');
  const [testResult, setTestResult] = useState('');

  // 处理API测试
  const handleTestApi = (api: any) => {
    setSelectedApi(api);
    setTestParams(JSON.stringify({
      // 根据API参数生成示例
      ...api.parameters.reduce((acc: any, param: any) => {
        if (param.required) {
          acc[param.name] = param.type === 'string' ? 'example' : param.type === 'integer' ? 1 : [];
        }
        return acc;
      }, {})
    }, null, 2));
    setTestModalVisible(true);
  };

  // 执行API测试
  const executeTest = () => {
    // 模拟API调用
    setTimeout(() => {
      const mockResponse = {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Response-Time': '45ms'
        },
        data: selectedApi?.responses[200]?.example || '{"code": 200, "message": "Success"}'
      };
      setTestResult(JSON.stringify(mockResponse, null, 2));
      message.success('API测试完成');
    }, 1000);
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  // 过滤API
  const filteredApis = mockApiData.modules.flatMap(module => 
    module.apis.filter(api => {
      const matchSearch = !searchText || 
        api.path.toLowerCase().includes(searchText.toLowerCase()) ||
        api.summary.toLowerCase().includes(searchText.toLowerCase()) ||
        api.description.toLowerCase().includes(searchText.toLowerCase());
      const matchModule = !selectedModule || module.key === selectedModule;
      const matchMethod = !selectedMethod || api.method === selectedMethod;
      return matchSearch && matchModule && matchMethod;
    }).map(api => ({ ...api, module: module.name, moduleKey: module.key }))
  );

  // 错误码表格列
  const errorCodeColumns: ColumnsType<any> = [
    {
      title: '状态码',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code: number) => (
        <Tag color={code < 300 ? 'green' : code < 400 ? 'blue' : code < 500 ? 'orange' : 'red'}>
          {code}
        </Tag>
      )
    },
    {
      title: '状态信息',
      dataIndex: 'message',
      key: 'message',
      width: 150
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* API概览卡片 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={18}>
            <Title level={2} style={{ margin: 0 }}>
              <ApiOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              {mockApiData.info.title}
            </Title>
            <Paragraph style={{ marginTop: '8px', marginBottom: '16px' }}>
              {mockApiData.info.description}
            </Paragraph>
            <Space size="large">
              <div>
                <Text strong>版本：</Text>
                <Tag color="blue">{mockApiData.info.version}</Tag>
              </div>
              <div>
                <Text strong>基础URL：</Text>
                <Text code copyable>{mockApiData.info.baseUrl}</Text>
              </div>
              <div>
                <Text strong>联系方式：</Text>
                <Text>{mockApiData.info.contact.email}</Text>
              </div>
            </Space>
          </Col>
          <Col span={6}>
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="API总数"
                    value={mockApiData.modules.reduce((sum, module) => sum + module.apis.length, 0)}
                    suffix="个"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="模块数"
                    value={mockApiData.modules.length}
                    suffix="个"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* 主要内容 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>API接口文档</span>
          </div>
        }
      >
        <Tabs defaultActiveKey="apis" type="card">
          {/* API接口列表 */}
          <TabPane tab="接口列表" key="apis">
            {/* 搜索和筛选 */}
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={8}>
                <Input
                  placeholder="搜索API路径、名称或描述"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="选择模块"
                  value={selectedModule}
                  onChange={setSelectedModule}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {mockApiData.modules.map(module => (
                    <Option key={module.key} value={module.key}>
                      {module.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  placeholder="请求方法"
                  value={selectedMethod}
                  onChange={setSelectedMethod}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {Object.entries(methodConfig).map(([key, config]) => (
                    <Option key={key} value={key}>
                      {config.text}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={8}>
                <Alert
                  message={`找到 ${filteredApis.length} 个API接口`}
                  type="info"
                  showIcon
                />
              </Col>
            </Row>

            {/* API列表 */}
            <Collapse>
              {mockApiData.modules.map(module => {
                const moduleApis = module.apis.filter(api => {
                  const matchSearch = !searchText || 
                    api.path.toLowerCase().includes(searchText.toLowerCase()) ||
                    api.summary.toLowerCase().includes(searchText.toLowerCase()) ||
                    api.description.toLowerCase().includes(searchText.toLowerCase());
                  const matchModule = !selectedModule || module.key === selectedModule;
                  const matchMethod = !selectedMethod || api.method === selectedMethod;
                  return matchSearch && matchModule && matchMethod;
                });

                if (moduleApis.length === 0) return null;

                return (
                  <Panel
                    header={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {module.icon}
                        <span style={{ fontWeight: 'bold' }}>{module.name}</span>
                        <Badge count={moduleApis.length} style={{ backgroundColor: '#1890ff' }} />
                        <span style={{ color: '#666', fontSize: '12px' }}>
                          {module.description}
                        </span>
                      </div>
                    }
                    key={module.key}
                  >
                    {moduleApis.map(api => (
                      <Card
                        key={api.id}
                        size="small"
                        style={{ marginBottom: '8px' }}
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Tag color={(methodConfig as any)[api.method]?.color}>
                              {api.method}
                            </Tag>
                            <Text code>{api.path}</Text>
                            <Text strong>{api.summary}</Text>
                            <Tag color={(statusConfig as any)[api.status]?.color} icon={(statusConfig as any)[api.status]?.icon}>
                              {(statusConfig as any)[api.status]?.text}
                            </Tag>
                          </div>
                        }
                        extra={
                          <Space>
                            <Tooltip title="复制API路径">
                              <Button
                                type="text"
                                icon={<CopyOutlined />}
                                size="small"
                                onClick={() => copyToClipboard(`${mockApiData.info.baseUrl}${api.path}`)}
                              />
                            </Tooltip>
                            <Tooltip title="测试API">
                              <Button
                                type="text"
                                icon={<PlayCircleOutlined />}
                                size="small"
                                onClick={() => handleTestApi(api)}
                              />
                            </Tooltip>
                          </Space>
                        }
                      >
                        <Paragraph style={{ margin: 0, marginBottom: '8px' }}>
                          {api.description}
                        </Paragraph>
                        
                        <Space wrap>
                          {api.tags.map((tag: string) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </Space>

                        <Divider style={{ margin: '12px 0' }} />

                        <Row gutter={16}>
                          <Col span={12}>
                            <Text strong>请求参数：</Text>
                            {api.parameters.length > 0 ? (
                              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                                {api.parameters.map((param, index) => (
                                  <li key={index}>
                                    <Text code>{param.name}</Text>
                                    <Text type="secondary"> ({param.type})</Text>
                                    {param.required && <Text type="danger"> *</Text>}
                                    <Text> - {param.description}</Text>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <Text type="secondary">无参数</Text>
                            )}
                          </Col>
                          <Col span={12}>
                            <Text strong>响应示例：</Text>
                            <div style={{ marginTop: '4px' }}>
                              {Object.entries(api.responses).map(([code, response]: [string, any]) => (
                                <div key={code} style={{ marginBottom: '4px' }}>
                                  <Tag color={parseInt(code) < 300 ? 'green' : 'red'}>
                                    {code}
                                  </Tag>
                                  <Text style={{ fontSize: '12px' }}>{response.description}</Text>
                                </div>
                              ))}
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </Panel>
                );
              })}
            </Collapse>
          </TabPane>

          {/* 错误码说明 */}
          <TabPane tab="错误码" key="errors">
            <Alert
              message="HTTP状态码说明"
              description="以下是API接口可能返回的HTTP状态码及其含义"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <Table
              columns={errorCodeColumns}
              dataSource={errorCodes}
              rowKey="code"
              pagination={false}
              size="small"
            />
          </TabPane>

          {/* 认证说明 */}
          <TabPane tab="认证方式" key="auth">
            <Card title="JWT Token认证" style={{ marginBottom: '16px' }}>
              <Paragraph>
                系统使用JWT（JSON Web Token）进行用户认证。客户端需要在请求头中携带有效的Token。
              </Paragraph>
              
              <Title level={4}>获取Token</Title>
              <Paragraph>
                通过 <Text code>POST /auth/login</Text> 接口登录获取Token。
              </Paragraph>
              
              <Title level={4}>使用Token</Title>
              <Paragraph>
                在HTTP请求头中添加：
              </Paragraph>
              <Text code copyable>Authorization: Bearer {'{your-jwt-token}'}</Text>
              
              <Title level={4}>Token刷新</Title>
              <Paragraph>
                Token有效期为24小时，过期前可通过 <Text code>POST /auth/refresh</Text> 接口刷新。
              </Paragraph>
            </Card>

            <Card title="权限控制">
              <Paragraph>
                不同的API接口需要不同的权限，请确保当前用户具有相应的权限。
              </Paragraph>
              <ul>
                <li>公开接口：无需认证</li>
                <li>用户接口：需要登录</li>
                <li>管理接口：需要管理员权限</li>
                <li>系统接口：需要超级管理员权限</li>
              </ul>
            </Card>
          </TabPane>

          {/* 更新日志 */}
          <TabPane tab="更新日志" key="changelog">
            <Card title="版本 1.0.0" extra="2024-01-20">
              <ul>
                <li>✅ 完成用户认证模块API</li>
                <li>✅ 完成用户管理模块API</li>
                <li>✅ 完成销售管理基础API</li>
                <li>✅ 完成库存查询API</li>
                <li>📝 添加API文档和测试功能</li>
              </ul>
            </Card>

            <Card title="版本 0.9.0" extra="2024-01-15" style={{ marginTop: '16px' }}>
              <ul>
                <li>🚀 项目初始化</li>
                <li>📝 API接口设计</li>
                <li>🔧 开发环境搭建</li>
              </ul>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* API测试弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BugOutlined />
            <span>API测试</span>
            {selectedApi && (
              <>
                <Tag color={(methodConfig as any)[selectedApi.method]?.color}>
                  {selectedApi.method}
                </Tag>
                <Text code>{selectedApi.path}</Text>
              </>
            )}
          </div>
        }
        open={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setTestModalVisible(false)}>
            关闭
          </Button>,
          <Button key="test" type="primary" icon={<PlayCircleOutlined />} onClick={executeTest}>
            执行测试
          </Button>
        ]}
      >
        {selectedApi && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Title level={5}>请求参数</Title>
                <TextArea
                  rows={8}
                  value={testParams}
                  onChange={(e) => setTestParams(e.target.value)}
                  placeholder="请输入JSON格式的请求参数"
                />
              </Col>
              <Col span={12}>
                <Title level={5}>响应结果</Title>
                <TextArea
                  rows={8}
                  value={testResult}
                  readOnly
                  placeholder="执行测试后显示响应结果"
                />
              </Col>
            </Row>
            
            <Divider />
            
            <Title level={5}>接口信息</Title>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>请求地址：</strong>{mockApiData.info.baseUrl}{selectedApi.path}</p>
                <p><strong>请求方法：</strong>
                  <Tag color={(methodConfig as any)[selectedApi.method]?.color}>
                    {selectedApi.method}
                  </Tag>
                </p>
                <p><strong>接口描述：</strong>{selectedApi.description}</p>
              </Col>
              <Col span={12}>
                <p><strong>接口状态：</strong>
                  <Tag color={(statusConfig as any)[selectedApi.status]?.color}>
                    {(statusConfig as any)[selectedApi.status]?.text}
                  </Tag>
                </p>
                <p><strong>标签：</strong>
                  <Space>
                    {selectedApi.tags.map((tag: string) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </p>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApiDocumentation;