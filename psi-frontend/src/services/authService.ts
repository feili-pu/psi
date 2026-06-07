// 认证服务 - 处理用户登录、注册、权限验证等

export interface LoginRequest {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserInfo;
}

export interface UserInfo {
  id: number;
  username: string;
  realName: string;
  department?: string;
  position?: string;
  permissions?: string[];
}

export interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  captcha: string;
  agreement: boolean;
}

export class AuthService {
  private static baseUrl = 'http://localhost:8080/api/auth';
  private static tokenKey = 'psi_auth_token';
  private static userKey = 'psi_user_info';

  // 用户登录
  static async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('发送登录请求:', { username: loginData.username, password: '[PROTECTED]' });
      
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password
        })
      });

      const result: LoginResponse = await response.json();
      console.log('登录响应:', { ...result, token: result.token ? '[TOKEN]' : undefined });

      if (result.success && result.token) {
        // 保存token和用户信息
        this.setToken(result.token);
        if (result.user) {
          this.setUserInfo(result.user);
        }
        
        // 如果选择记住我，设置更长的过期时间
        if (loginData.remember) {
          // 可以在这里设置更长的token过期时间或使用localStorage
          console.log('用户选择记住登录状态');
        }
      }

      return result;
    } catch (error) {
      console.error('登录请求失败:', error);
      return {
        success: false,
        message: '网络错误，请检查服务器连接'
      };
    }
  }

  // 用户注册（目前为模拟实现）
  static async register(registerData: RegisterRequest): Promise<{ success: boolean; message: string }> {
    try {
      // 模拟注册API调用
      console.log('注册请求:', { ...registerData, password: '[PROTECTED]', confirmPassword: '[PROTECTED]' });
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟注册成功
      return {
        success: true,
        message: '注册成功，请使用用户名和密码登录'
      };
    } catch (error) {
      console.error('注册请求失败:', error);
      return {
        success: false,
        message: '注册失败，请稍后重试'
      };
    }
  }

  // 验证Token
  static async validateToken(): Promise<{ success: boolean; user?: UserInfo; message?: string }> {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, message: '未找到登录凭证' };
      }

      // 添加超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

      const response = await fetch(`${this.baseUrl}/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();
      
      if (result.success && result.user) {
        // 更新用户信息
        this.setUserInfo(result.user);
        return { success: true, user: result.user };
      } else {
        // Token无效，清除本地存储
        this.clearAuth();
        return { success: false, message: result.message || 'Token验证失败' };
      }
    } catch (error) {
      console.error('Token验证失败:', error);
      // 如果是网络错误，不清除本地认证信息
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Token验证超时，可能后端服务未启动');
      }
      return { success: false, message: '验证失败，请重新登录' };
    }
  }

  // 获取用户权限
  static async getUserPermissions(): Promise<string[]> {
    try {
      const token = this.getToken();
      if (!token) {
        return [];
      }

      const response = await fetch(`${this.baseUrl}/test-permission`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (result.success && result.permissions) {
        return result.permissions;
      }
      
      return [];
    } catch (error) {
      console.error('获取用户权限失败:', error);
      return [];
    }
  }

  // 用户登出
  static logout(): void {
    this.clearAuth();
    console.log('用户已登出');
  }

  // Token管理
  static setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  static removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // 用户信息管理
  static setUserInfo(user: UserInfo): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  static getUserInfo(): UserInfo | null {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('解析用户信息失败:', error);
        return null;
      }
    }
    return null;
  }

  static removeUserInfo(): void {
    localStorage.removeItem(this.userKey);
  }

  // 清除所有认证信息
  static clearAuth(): void {
    this.removeToken();
    this.removeUserInfo();
  }

  // 检查是否已登录
  static isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 获取请求头（用于API调用）
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  }

  // 发送验证码（模拟实现）
  static async sendCaptcha(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('发送验证码到:', phone);
      
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: '验证码已发送，请注意查收'
      };
    } catch (error) {
      console.error('发送验证码失败:', error);
      return {
        success: false,
        message: '验证码发送失败，请稍后重试'
      };
    }
  }

  // 重置密码（模拟实现）
  static async resetPassword(username: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('重置密码请求:', username);
      
      // 模拟重置密码
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        message: '密码重置邮件已发送，请查收邮箱'
      };
    } catch (error) {
      console.error('重置密码失败:', error);
      return {
        success: false,
        message: '密码重置失败，请联系管理员'
      };
    }
  }
}

// 导出默认实例
export default AuthService;
