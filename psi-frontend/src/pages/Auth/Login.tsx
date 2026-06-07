import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  Space,
  Checkbox,
  Alert,
  message,
  Row,
  Col,
  Tabs
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyOutlined,
  MobileOutlined,
  MailOutlined,
  LoginOutlined,
  UserAddOutlined,
  BarChartOutlined,
  ShopOutlined,
  InboxOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import AuthService from '../../services/authService';

const { Title, Text, Link } = Typography;
const { TabPane } = Tabs;

// 登录方式枚举
const LoginType = {
  USERNAME: 'username',
  PHONE: 'phone',
  EMAIL: 'email'
};

const Login: React.FC = () => {
  const { login } = useAuth();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginType, setLoginType] = useState(LoginType.USERNAME);
  const [activeTab, setActiveTab] = useState('login');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // 处理登录
  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      console.log('开始登录流程:', { username: values.username, loginType });
      
      // 使用认证上下文的登录方法
      const success = await login(values.username, values.password, values.remember);
      
      if (success) {
        console.log('登录成功，将自动跳转到主界面');
      }
      
    } catch (error) {
      console.error('登录过程中发生错误:', error);
      message.error('登录失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  // 处理注册
  const handleRegister = async (values: any) => {
    setRegisterLoading(true);
    try {
      console.log('开始注册流程:', { username: values.username, email: values.email });
      
      // 调用注册API
      const result = await AuthService.register({
        username: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.confirmPassword,
        captcha: values.captcha,
        agreement: values.agreement
      });
      
      if (result.success) {
        message.success(result.message || '注册成功！请登录');
        setActiveTab('login');
        registerForm.resetFields();
      } else {
        message.error(result.message || '注册失败，请重试');
      }
      
    } catch (error) {
      console.error('注册过程中发生错误:', error);
      message.error('注册失败，请检查网络连接或联系管理员');
    } finally {
      setRegisterLoading(false);
    }
  };

  // 发送验证码
  const sendCaptcha = async () => {
    const phone = registerForm.getFieldValue('phone');
    if (!phone) {
      message.warning('请先输入手机号');
      return;
    }
    
    setCaptchaLoading(true);
    try {
      const result = await AuthService.sendCaptcha(phone);
      if (result.success) {
        message.success(result.message || '验证码已发送');
      } else {
        message.error(result.message || '验证码发送失败');
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      message.error('验证码发送失败，请稍后重试');
    } finally {
      setCaptchaLoading(false);
    }
  };

  // 忘记密码
  const handleForgotPassword = async () => {
    const username = loginForm.getFieldValue('username');
    if (!username) {
      message.warning('请先输入用户名');
      return;
    }
    
    try {
      const result = await AuthService.resetPassword(username);
      if (result.success) {
        message.success(result.message || '密码重置邮件已发送');
      } else {
        message.error(result.message || '密码重置失败');
      }
    } catch (error) {
      console.error('密码重置失败:', error);
      message.info('请联系系统管理员重置密码');
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <section className="auth-brand-panel">
          <div className="auth-brand-mark">
            <BarChartOutlined />
          </div>
          <div>
            <Text className="auth-eyebrow">PSI BUSINESS SUITE</Text>
            <Title level={1} className="auth-title">
              PSI管理系统
            </Title>
            <Text className="auth-subtitle">
              采购、销售、库存协同工作台
            </Text>
          </div>

          <div className="auth-metrics">
            <div className="auth-metric">
              <ShopOutlined />
              <span>采购</span>
              <strong>询价 / 比价 / 订单</strong>
            </div>
            <div className="auth-metric">
              <BarChartOutlined />
              <span>销售</span>
              <strong>报价 / 订单 / 统计</strong>
            </div>
            <div className="auth-metric">
              <InboxOutlined />
              <span>库存</span>
              <strong>入库 / 盘点 / 序列号</strong>
            </div>
          </div>

          <div className="auth-status-card">
            <CheckCircleOutlined />
            <div>
              <strong>系统运行正常</strong>
              <span>本地服务已连接</span>
            </div>
          </div>
        </section>

        <Card className="auth-card" bodyStyle={{ padding: 0 }}>
          <div className="auth-card-header">
            <Title level={2}>登录系统</Title>
            <Text>使用管理员账号进入业务工作台</Text>
          </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          className="auth-tabs"
        >
          {/* 登录标签页 */}
          <TabPane
            tab={
              <span>
                <LoginOutlined />
                登录
              </span>
            }
            key="login"
          >
            <Form
              form={loginForm}
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              size="large"
            >
              {/* 登录方式切换 */}
              <div className="login-mode-group">
                <Space size={8} wrap>
                  <Button
                    type={loginType === LoginType.USERNAME ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setLoginType(LoginType.USERNAME)}
                  >
                    用户名
                  </Button>
                  <Button
                    type={loginType === LoginType.PHONE ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setLoginType(LoginType.PHONE)}
                  >
                    手机号
                  </Button>
                  <Button
                    type={loginType === LoginType.EMAIL ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setLoginType(LoginType.EMAIL)}
                  >
                    邮箱
                  </Button>
                </Space>
              </div>

              {/* 用户名/手机号/邮箱输入 */}
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: `请输入${
                    loginType === LoginType.USERNAME ? '用户名' :
                    loginType === LoginType.PHONE ? '手机号' : '邮箱'
                  }` },
                  ...(loginType === LoginType.PHONE ? [
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                  ] : []),
                  ...(loginType === LoginType.EMAIL ? [
                    { type: 'email' as const, message: '请输入正确的邮箱地址' }
                  ] : [])
                ]}
              >
                <Input
                  prefix={
                    loginType === LoginType.USERNAME ? <UserOutlined /> :
                    loginType === LoginType.PHONE ? <MobileOutlined /> : <MailOutlined />
                  }
                  placeholder={
                    loginType === LoginType.USERNAME ? '请输入用户名' :
                    loginType === LoginType.PHONE ? '请输入手机号' : '请输入邮箱'
                  }
                />
              </Form.Item>

              {/* 密码输入 */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6位' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              {/* 记住我和忘记密码 */}
              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <Link onClick={handleForgotPassword}>
                    忘记密码？
                  </Link>
                </div>
              </Form.Item>

              {/* 登录按钮 */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="auth-submit"
                >
                  {loading ? '登录中...' : '立即登录'}
                </Button>
              </Form.Item>
            </Form>

            {/* 安全提示 */}
            <Alert
              message="安全提示"
              description="为了您的账户安全，请不要在公共场所保存登录信息"
              type="info"
              showIcon
              className="auth-alert"
            />
          </TabPane>

          {/* 注册标签页 */}
          <TabPane
            tab={
              <span>
                <UserAddOutlined />
                注册
              </span>
            }
            key="register"
          >
            <Form
              form={registerForm}
              name="register"
              onFinish={handleRegister}
              layout="vertical"
              size="large"
            >
              {/* 用户名 */}
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3位' },
                  { max: 20, message: '用户名最多20位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                />
              </Form.Item>

              {/* 邮箱 */}
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email' as const, message: '请输入正确的邮箱地址' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱"
                />
              </Form.Item>

              {/* 手机号 */}
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                ]}
              >
                <Input
                  prefix={<MobileOutlined />}
                  placeholder="请输入手机号"
                />
              </Form.Item>

              {/* 验证码 */}
              <Form.Item
                name="captcha"
                rules={[
                  { required: true, message: '请输入验证码' },
                  { len: 6, message: '验证码为6位数字' }
                ]}
              >
                <Row gutter={8}>
                  <Col span={16}>
                    <Input
                      prefix={<SafetyOutlined />}
                      placeholder="请输入验证码"
                      maxLength={6}
                    />
                  </Col>
                  <Col span={8}>
                    <Button
                      onClick={sendCaptcha}
                      loading={captchaLoading}
                      block
                    >
                      {captchaLoading ? '发送中' : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </Form.Item>

              {/* 密码 */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 8, message: '密码至少8位' },
                  { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '密码必须包含大小写字母和数字' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码（至少8位，包含大小写字母和数字）"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              {/* 确认密码 */}
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请再次输入密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              {/* 用户协议 */}
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议')) }
                ]}
              >
                <Checkbox>
                  我已阅读并同意 <Link>《用户协议》</Link> 和 <Link>《隐私政策》</Link>
                </Checkbox>
              </Form.Item>

              {/* 注册按钮 */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={registerLoading}
                  block
                  className="auth-submit"
                >
                  {registerLoading ? '注册中...' : '立即注册'}
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <Divider className="auth-divider">
          <Text type="secondary">其他登录方式</Text>
        </Divider>

        {/* 第三方登录 */}
        <Row gutter={16}>
          <Col span={8}>
            <Button
              block
              className="auth-alt-button auth-alt-blue"
              onClick={() => message.info('微信登录功能开发中')}
            >
              微信
            </Button>
          </Col>
          <Col span={8}>
            <Button
              block
              className="auth-alt-button auth-alt-green"
              onClick={() => message.info('钉钉登录功能开发中')}
            >
              钉钉
            </Button>
          </Col>
          <Col span={8}>
            <Button
              block
              className="auth-alt-button auth-alt-indigo"
              onClick={() => message.info('企业微信登录功能开发中')}
            >
              企微
            </Button>
          </Col>
        </Row>

        {/* 底部信息 */}
        <div className="auth-footer-note">
          <Text type="secondary">
            © 2024 PSI管理系统. All rights reserved.
          </Text>
          <br />
          <Text type="secondary">
            技术支持：系统开发团队 | 服务热线：400-123-4567
          </Text>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default Login;
