import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { message } from 'antd';
import AuthService from '../services/authService';
import type { UserInfo } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  permissions: string[];
  login: (username: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  checkAuth: () => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 检查认证状态
  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = AuthService.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      // 验证Token是否有效
      const result = await AuthService.validateToken();
      if (result.success && result.user) {
        setIsAuthenticated(true);
        setUser(result.user);
        setPermissions(result.user.permissions || []);
        console.log('Token验证成功，用户权限:', result.user.permissions);
        return true;
      } else {
        // Token无效，清除认证信息
        AuthService.clearAuth();
        setIsAuthenticated(false);
        setUser(null);
        setPermissions([]);
        return false;
      }
    } catch (error) {
      console.error('认证检查失败:', error);
      // 网络错误时不清除认证信息，只是设置为未认证状态
      setIsAuthenticated(false);
      setUser(null);
      setPermissions([]);
      return false;
    }
  };

  // 登录
  const login = async (username: string, password: string, remember?: boolean): Promise<boolean> => {
    try {
      const result = await AuthService.login({
        username,
        password,
        remember
      });

      if (result.success && result.user) {
        setIsAuthenticated(true);
        setUser(result.user);
        setPermissions(result.user.permissions || []);
        console.log('登录成功，用户权限:', result.user.permissions);
        message.success(result.message || '登录成功！');
        return true;
      } else {
        message.error(result.message || '登录失败');
        return false;
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请检查网络连接');
      return false;
    }
  };

  // 登出
  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setPermissions([]);
    message.success('已安全退出');
  };

  // 权限检查函数
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every(permission => permissions.includes(permission));
  };

  // 组件挂载时检查认证状态
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        await checkAuth();
      } catch (error) {
        console.error('初始化认证检查失败:', error);
        // 即使检查失败，也要设置为未认证状态，让页面能够显示
        setIsAuthenticated(false);
        setUser(null);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 定期检查Token有效性（可选）
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(async () => {
        const isValid = await checkAuth();
        if (!isValid) {
          message.warning('登录已过期，请重新登录');
        }
      }, 5 * 60 * 1000); // 每5分钟检查一次

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    permissions,
    login,
    logout,
    loading,
    checkAuth,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 导出Context和Provider
export { AuthContext };
export default AuthProvider;