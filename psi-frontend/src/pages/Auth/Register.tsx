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
  Select,
  Checkbox,
  Alert,
  message,
  Result,
  Space
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  SafetyOutlined,
  IdcardOutlined,
  BankOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;
const { Option } = Select;

// 注册步骤
const RegisterSteps = {
  BASIC_INFO: 0,
  VERIFY: 1,
  COMPANY_INFO: 2,
  COMPLETE: 3
};

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(RegisterSteps.BASIC_INFO);
  const [loading, setLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState<any>({});
  
  const [basicForm] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [companyForm] = Form.useForm();

  // 发送验证码
  const sendCaptcha = async () => {
    const phone = basicForm.getFieldValue('phone');
    const email = basicForm.getFieldValue('email');
    
    if (!phone && !email) {
      message.warning('请先填写手机号或邮箱');
      return;
    }
    
    setCaptchaLoading(true);
    try {
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('验证码已发送');
      
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

  // 步骤1：基本信息
  const handleBasicInfo = async (values: any) => {
    setLoading(true);
    try {
      // 模拟验证用户信息
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData({ ...formData, ...values });
      setCurrentStep(RegisterSteps.VERIFY);
      message.success('基本信息填写完成');
    } catch (error) {
      message.error('信息验证失败');
    } finally {
      setLoading(false);
    }
  };

  // 步骤2：验证
  const handleVerify = async (values: any) => {
    setLoading(true);
    try {
      // 模拟验证码验证
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData({ ...formData, ...values });
      setCurrentStep(RegisterSteps.COMPANY_INFO);
      message.success('验证通过');
    } catch (error) {
      message.error('验证码错误');
    } finally {
      setLoading(false);
    }
  };

  // 步骤3：企业信息
  const handleCompanyInfo = async (values: any) => {
    setLoading(true);
    try {
      // 模拟注册
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalData = { ...formData, ...values };
      console.log('注册数据:', finalData);
      
      setCurrentStep(RegisterSteps.COMPLETE);
      message.success('注册成功！');
    } catch (error) {
      message.error('注册失败，请重试');
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
    // 这里应该跳转到登录页面
    message.info('返回登录页面');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case RegisterSteps.BASIC_INFO:
        return (
          <Form
            form={basicForm}
            name="basicInfo"
            onFinish={handleBasicInfo}
            layout="vertical"
            size="large"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="用户名"
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3位' },
                    { max: 20, message: '用户名最多20位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
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
                  <Input prefix={<IdcardOutlined />} placeholder="请输入真实姓名" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="手机号"
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                  ]}
                >
                  <Input prefix={<MobileOutlined />} placeholder="请输入手机号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入正确的邮箱地址' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="密码"
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
              />
            </Form.Item>

            <Form.Item
              label="确认密码"
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
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ height: '48px', fontSize: '16px' }}
              >
                下一步
              </Button>
            </Form.Item>
          </Form>
        );

      case RegisterSteps.VERIFY:
        return (
          <Form
            form={verifyForm}
            name="verify"
            onFinish={handleVerify}
            layout="vertical"
            size="large"
          >
            <Alert
              message="验证身份"
              description={`我们已向您的手机 ${formData.phone} 和邮箱 ${formData.email} 发送了验证码`}
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="手机验证码"
                  name="phoneCaptcha"
                  rules={[
                    { required: true, message: '请输入手机验证码' },
                    { len: 6, message: '验证码为6位数字' }
                  ]}
                >
                  <Input
                    prefix={<SafetyOutlined />}
                    placeholder="请输入手机验证码"
                    maxLength={6}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="邮箱验证码"
                  name="emailCaptcha"
                  rules={[
                    { required: true, message: '请输入邮箱验证码' },
                    { len: 6, message: '验证码为6位数字' }
                  ]}
                >
                  <Input
                    prefix={<SafetyOutlined />}
                    placeholder="请输入邮箱验证码"
                    maxLength={6}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                onClick={sendCaptcha}
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
                  下一步
                </Button>
              </Space>
            </Form.Item>
          </Form>
        );

      case RegisterSteps.COMPANY_INFO:
        return (
          <Form
            form={companyForm}
            name="companyInfo"
            onFinish={handleCompanyInfo}
            layout="vertical"
            size="large"
          >
            <Alert
              message="企业信息"
              description="请填写您的企业信息，这将帮助我们为您提供更好的服务"
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <Form.Item
              label="企业名称"
              name="companyName"
              rules={[
                { required: true, message: '请输入企业名称' },
                { min: 2, message: '企业名称至少2位' }
              ]}
            >
              <Input prefix={<BankOutlined />} placeholder="请输入企业名称" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="企业规模"
                  name="companySize"
                  rules={[{ required: true, message: '请选择企业规模' }]}
                >
                  <Select placeholder="请选择企业规模">
                    <Option value="1-10">1-10人</Option>
                    <Option value="11-50">11-50人</Option>
                    <Option value="51-200">51-200人</Option>
                    <Option value="201-500">201-500人</Option>
                    <Option value="500+">500人以上</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="所属行业"
                  name="industry"
                  rules={[{ required: true, message: '请选择所属行业' }]}
                >
                  <Select placeholder="请选择所属行业">
                    <Option value="manufacturing">制造业</Option>
                    <Option value="retail">零售业</Option>
                    <Option value="wholesale">批发业</Option>
                    <Option value="logistics">物流业</Option>
                    <Option value="technology">科技业</Option>
                    <Option value="other">其他</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="企业地址"
              name="companyAddress"
              rules={[{ required: true, message: '请输入企业地址' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="请输入详细的企业地址"
              />
            </Form.Item>

            <Form.Item
              label="职位"
              name="position"
              rules={[{ required: true, message: '请输入您的职位' }]}
            >
              <Input placeholder="请输入您在企业中的职位" />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意相关协议')) }
              ]}
            >
              <Checkbox>
                我已阅读并同意 <Link>《用户协议》</Link>、<Link>《隐私政策》</Link> 和 <Link>《企业服务协议》</Link>
              </Checkbox>
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
                  完成注册
                </Button>
              </Space>
            </Form.Item>
          </Form>
        );

      case RegisterSteps.COMPLETE:
        return (
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="注册成功！"
            subTitle="您的账户已创建成功，现在可以开始使用PSI管理系统了"
            extra={[
              <Button type="primary" key="login" onClick={handleBackToLogin}>
                立即登录
              </Button>,
              <Button key="guide">
                查看使用指南
              </Button>
            ]}
          >
            <div style={{ background: '#fafafa', padding: '24px', borderRadius: '8px' }}>
              <Title level={4}>账户信息</Title>
              <p><strong>用户名：</strong>{formData.username}</p>
              <p><strong>邮箱：</strong>{formData.email}</p>
              <p><strong>手机：</strong>{formData.phone}</p>
              <p><strong>企业：</strong>{formData.companyName}</p>
            </div>
          </Result>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '600px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: 'none'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        {/* 返回按钮 */}
        {currentStep !== RegisterSteps.COMPLETE && (
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
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>📊</div>
          <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
            注册PSI管理系统
          </Title>
          <Text type="secondary">
            创建您的企业管理账户
          </Text>
        </div>

        {/* 步骤指示器 */}
        {currentStep !== RegisterSteps.COMPLETE && (
          <Steps 
            current={currentStep} 
            style={{ marginBottom: '32px' }}
            items={[
              { title: '基本信息', description: '填写个人信息' },
              { title: '身份验证', description: '验证手机和邮箱' },
              { title: '企业信息', description: '完善企业资料' }
            ]}
          />
        )}

        {/* 步骤内容 */}
        {renderStepContent()}

        {/* 底部信息 */}
        {currentStep !== RegisterSteps.COMPLETE && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              已有账户？ <Link onClick={handleBackToLogin}>立即登录</Link>
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              © 2024 PSI管理系统. All rights reserved.
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Register;