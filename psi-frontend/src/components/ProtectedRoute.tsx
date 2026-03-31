import React from 'react';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Auth/Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // 显示加载状态
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', color: '#666' }}>
          正在验证登录状态...
        </div>
      </div>
    );
  }

  // 未认证时显示登录页面
  if (!isAuthenticated) {
    return <Login />;
  }

  // 已认证时显示受保护的内容
  return <>{children}</>;
};

export default ProtectedRoute;