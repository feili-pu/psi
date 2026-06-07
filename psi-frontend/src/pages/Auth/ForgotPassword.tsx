import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Steps,
  Row,
  Col,
  Alert,
  message,
  Result,
  Space
} from 'antd';
import {
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import AuthService from '../../services/authService';

const { Title, Text, Link } = Typography;

// 重置密码步骤
const ResetSteps = {
  VERIFY_IDENTITY: 0,
  VERIFY_CODE: 1,
  RESET_PASSWORD: 2,
  COMPLETE: 3
};

const ForgotPassword: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(ResetSteps.VERIFY_IDENTITY);
  const [loading, setLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resetMethod, setResetMethod] = useState<'phone' | 'email'>('phone');
  const [userInfo, setUserInfo] = useState<any>({});
  
  const [identityForm] = Form.useForm();
  const [codeForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 验证身份
  const handleVerifyIdentity = async (values: any) => {
    setLoading(true);
    try {
      const nextUserInfo = {
        username: values.username,
        phone: values.phone,
        email: values.email,
        ...values
      };
      
      setUserInfo(nextUserInfo);
      setCurrentStep(ResetSteps.VERIFY_CODE);
      message.success('身份验证成功');
      
      await sendCaptcha(nextUserInfo);
      
    } catch (error) {
      message.error('用户不存在或信息不匹配');
    } finally {
      setLoading(false);
    }
  };

  // 发送验证码
  const sendCaptcha = async (sourceUserInfo = userInfo) => {
    setCaptchaLoading(true);
    try {
      const target = resetMethod === 'phone' ? sourceUserInfo.phone : sourceUserInfo.email;
      const result = await AuthService.sendCaptcha(target);
      if (!result.success) {
        message.error(result.message);
        return;
      }
      message.success(result.message || `验证码已发送至 ${target}`);
      
      // 开始倒计时
      let count = 60;
      setCountdown(count);
      const timer = setInterval(() => {
        count--;
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
        }
      }, 1000);
      
    } catch (error) {
      message.error('验证码发送失败');
    } finally {
      setCaptchaLoading(false);
    }
  };

  // 验证验证码
  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      setCurrentStep(ResetSteps.RESET_PASSWORD);
      message.success('验证码验证成功');
    } catch (error) {
      message.error('验证码错误或已过期');
    } finally {
      setLoading(false);
    }
  };

  // 重置密码
  const handleResetPassword = async (values: any) => {
    setLoading(true);
    try {
      const result = await AuthService.resetPassword(userInfo.username, values.password);
      if (!result.success) {
        message.error(result.message);
        return;
      }
      
      setCurrentStep(ResetSteps.COMPLETE);
      message.success(result.message || '密码重置成功');
    } catch (error) {
      message.error('密码重置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 返回上一步
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // 返回登录
  const handleBackToLogin = () => {
    message.info('返回登录页面');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case ResetSteps.VERIFY_IDENTITY:
        return (
          <Form
            form={identityForm}
            name="verifyIdentity"
            onFinish={handleVerifyIdentity}
            layout="vertical"
            size="large"
          >
            <Alert
              message="身份验证"
              description="请输入您的用户名和注册时使用的手机号或邮箱来验证身份"
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <Form.Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3位' }
              ]}
            >
              <Input
                placeholder="请输入您的用户名"
                size="large"
              />
            </Form.Item>

            <Form.Item label="验证方式">
              <Row gutter={16}>
                <Col span={12}>
                  <Button
                    type={resetMethod === 'phone' ? 'primary' : 'default'}
                    block
                    onClick={() => setResetMethod('phone')}
                  >
                    手机号验证
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type={resetMethod === 'email' ? 'primary' : 'default'}
                    block
                    onClick={() => setResetMethod('email')}
                  >
                    邮箱验证
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            {resetMethod === 'phone' ? (
              <Form.Item
                label="手机号"
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                ]}
              >
                <Input
                  prefix={<MobileOutlined />}
                  placeholder="请输入注册时使用的手机号"
                />
              </Form.Item>
            ) : (
              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱地址' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入注册时使用的邮箱"
                />
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ height: '48px', fontSize: '16px' }}
              >
                验证身份
              </Button>
            </Form.Item>
          </Form>
        );

      case ResetSteps.VERIFY_CODE:
        return (
          <Form
            form={codeForm}
            name="verifyCode"
            onFinish={handleVerifyCode}
            layout="vertical"
            size="large"
          >
            <Alert
              message="验证码验证"
              description={`我们已向您的${resetMethod === 'phone' ? '手机' : '邮箱'} ${resetMethod === 'phone' ? userInfo.phone : userInfo.email} 发送了验证码`}
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <div style={{ 
              background: '#f9f9f9', 
              padding: '16px', 
              borderRadius: '8px', 
              marginBottom: '24px' 
            }}>
              <Text strong>账户信息</Text>
              <br />
              <Text>用户名：{userInfo.username}</Text>
              <br />
              <Text>
                {resetMethod === 'phone' ? '手机号：' : '邮箱：'}
                {resetMethod === 'phone' ? userInfo.phone : userInfo.email}
              </Text>
            </div>

            <Form.Item
              label="验证码"
              name="captcha"
              rules={[
                { required: true, message: '请输入验证码' },
                { len: 6, message: '验证码为6位数字' }
              ]}
            >
              <Input
                prefix={<SafetyOutlined />}
                placeholder="请输入6位验证码"
                maxLength={6}
                style={{ fontSize: '18px', textAlign: 'center' }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                onClick={() => sendCaptcha()}
                loading={captchaLoading}
                disabled={countdown > 0}
                block
                style={{ marginBottom: '16px' }}
              >
                {countdown > 0 ? `${countdown}秒后重新发送` : '重新发送验证码'}
              </Button>
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%' }}>
                <Button onClick={handlePrevStep} style={{ width: '120px' }}>
                  上一步
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ flex: 1, height: '48px', fontSize: '16px' }}
                >
                  验证
                </Button>
              </Space>
            </Form.Item>
          </Form>
        );

      case ResetSteps.RESET_PASSWORD:
        return (
          <Form
            form={passwordForm}
            name="resetPassword"
            onFinish={handleResetPassword}
            layout="vertical"
            size="large"
          >
            <Alert
              message="设置新密码"
              description="请为您的账户设置一个新的安全密码"
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <Form.Item
              label="新密码"
              name="password"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 8, message: '密码至少8位' },
                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '密码必须包含大小写字母和数字' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入新密码（至少8位，包含大小写字母和数字）"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              label="确认新密码"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认新密码' },
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
                placeholder="请再次输入新密码"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Alert
              message="密码安全提示"
              description={
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>密码长度至少8位</li>
                  <li>必须包含大写字母、小写字母和数字</li>
                  <li>建议包含特殊字符以提高安全性</li>
                  <li>不要使用常见的密码组合</li>
                </ul>
              }
              type="warning"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <Form.Item>
              <Space style={{ width: '100%' }}>
                <Button onClick={handlePrevStep} style={{ width: '120px' }}>
                  上一步
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ flex: 1, height: '48px', fontSize: '16px' }}
                >
                  重置密码
                </Button>
              </Space>
            </Form.Item>
          </Form>
        );

      case ResetSteps.COMPLETE:
        return (
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="密码重置成功！"
            subTitle="您的密码已成功重置，现在可以使用新密码登录系统了"
            extra={[
              <Button type="primary" key="login" onClick={handleBackToLogin}>
                立即登录
              </Button>
            ]}
          >
            <div style={{ background: '#f6ffed', padding: '16px', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
              <Text strong style={{ color: '#52c41a' }}>安全提醒</Text>
              <br />
              <Text>• 请妥善保管您的新密码</Text>
              <br />
              <Text>• 建议定期更换密码以确保账户安全</Text>
              <br />
              <Text>• 如有异常登录，请及时联系管理员</Text>
            </div>
          </Result>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-shell auth-flow-shell">
      <Card
        className="auth-flow-card"
        style={{
          width: '100%',
          maxWidth: '500px',
          border: 'none'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        {/* 返回按钮 */}
        {currentStep !== ResetSteps.COMPLETE && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToLogin}
            style={{ marginBottom: '16px' }}
          >
            返回登录
          </Button>
        )}

        {/* 系统标题 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '10px' }}>
            <img className="register-brand-logo" src="/lifei-psi.svg" alt="lifei PSI" />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
            重置密码
          </Title>
          <Text type="secondary">
            找回您的 lifei PSI 账户
          </Text>
        </div>

        {/* 步骤指示器 */}
        {currentStep !== ResetSteps.COMPLETE && (
          <Steps 
            current={currentStep} 
            style={{ marginBottom: '32px' }} 
            size="small"
            items={[
              { title: '验证身份' },
              { title: '验证码' },
              { title: '重置密码' }
            ]}
          />
        )}

        {/* 步骤内容 */}
        {renderStepContent()}

        {/* 底部信息 */}
        {currentStep !== ResetSteps.COMPLETE && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              记起密码了？ <Link onClick={handleBackToLogin}>立即登录</Link>
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              需要帮助？联系客服：400-123-4567
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
