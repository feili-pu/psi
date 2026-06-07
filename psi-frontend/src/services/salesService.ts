// 销售管理相关的 API 服务
import AuthService from './authService';

// 销售订单接口
export interface SalesOrder {
  id?: number;
  orderNo?: string;
  quotationId?: number;
  customerName: string;
  customerContact: string;
  salesperson: string;
  orderDate?: string;
  deliveryDate: string;
  totalAmount?: number;
  includeTax: boolean;
  taxRate?: number;
  paymentTerms?: string;
  deliveryAddress?: string;
  status?: string;
  remarks?: string;
}

// 销售订单明细接口
export interface SalesOrderItem {
  id?: number;
  orderId?: number;
  productName: string;
  productCode?: string;
  specification?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount?: number;
  deliveredQty?: number;
  remainingQty?: number;
  remarks?: string;
}

// 销售订单请求接口
export interface SalesOrderRequest {
  quotationId?: number;
  customerName: string;
  customerContact: string;
  salesperson: string;
  deliveryDate?: string;
  includeTax: boolean;
  taxRate?: number;
  paymentTerms?: string;
  deliveryAddress?: string;
  remarks?: string;
  items: SalesOrderItem[];
}

// 销售报价接口
export interface SalesQuotation {
  id?: number;
  quotationNo?: string;
  customerName: string;
  customerContact: string;
  salesperson: string;
  quotationDate?: string;
  validUntil?: string;
  totalAmount?: number;
  includeTax: boolean;
  taxRate?: number;
  status?: string;
  remarks?: string;
}

// 销售报价明细接口
export interface SalesQuotationItem {
  id?: number;
  quotationId?: number;
  productName: string;
  productCode?: string;
  specification?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount?: number;
  remarks?: string;
}

// 销售报价请求接口
export interface SalesQuotationRequest {
  customerName: string;
  customerContact: string;
  salesperson: string;
  includeTax: boolean;
  taxRate?: number;
  remarks?: string;
  items: SalesQuotationItem[];
}

// 销售订单服务类
export class SalesOrderService {
  private static baseUrl = 'http://localhost:8080/api/orders';

  // 获取所有销售订单
  static async getAllOrders(): Promise<SalesOrder[]> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`获取订单列表失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据ID获取订单详情
  static async getOrderById(id: number): Promise<{ order: SalesOrder; items: SalesOrderItem[] }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`获取订单详情失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 创建销售订单
  static async createOrder(orderData: SalesOrderRequest): Promise<SalesOrder> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      // 如果有详细的验证错误信息，显示它们
      if (result.errors && Array.isArray(result.errors)) {
        throw new Error('数据验证失败:\n' + result.errors.join('\n'));
      }
      throw new Error(result.message || '创建订单失败');
    }
    
    return result.order;
  }

  // 从报价单创建订单
  static async createOrderFromQuotation(quotationId: number, orderData: SalesOrderRequest): Promise<SalesOrder> {
    const response = await fetch(`${this.baseUrl}/from-quotation/${quotationId}`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '从报价单创建订单失败');
    }
    
    return result.order;
  }

  // 更新销售订单
  static async updateOrder(id: number, orderData: SalesOrderRequest): Promise<SalesOrder> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      // 如果有详细的验证错误信息，显示它们
      if (result.errors && Array.isArray(result.errors)) {
        throw new Error('数据验证失败:\n' + result.errors.join('\n'));
      }
      throw new Error(result.message || '更新订单失败');
    }
    
    return result.order;
  }

  // 删除销售订单
  static async deleteOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '删除订单失败');
    }
  }

  // 确认订单
  static async confirmOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/confirm`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '确认订单失败');
    }
  }

  // 开始生产
  static async startProduction(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/start-production`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '开始生产失败');
    }
  }

  // 发货
  static async shipOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/ship`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '发货失败');
    }
  }

  // 交付
  static async deliverOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/deliver`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '交付失败');
    }
  }

  // 完成订单
  static async completeOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/complete`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '完成订单失败');
    }
  }

  // 取消订单
  static async cancelOrder(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/cancel`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '取消订单失败');
    }
  }

  // 根据客户名称搜索
  static async searchByCustomer(customerName: string): Promise<SalesOrder[]> {
    const response = await fetch(`${this.baseUrl}/search?customerName=${encodeURIComponent(customerName)}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`搜索订单失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据状态查询
  static async getOrdersByStatus(status: string): Promise<SalesOrder[]> {
    const response = await fetch(`${this.baseUrl}/status/${status}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`按状态查询订单失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据销售员查询
  static async getOrdersBySalesperson(salesperson: string): Promise<SalesOrder[]> {
    const response = await fetch(`${this.baseUrl}/salesperson/${encodeURIComponent(salesperson)}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`按销售员查询订单失败: ${response.statusText}`);
    }
    
    return await response.json();
  }
}
// 销售报价服务类
export class SalesQuotationService {
  private static baseUrl = 'http://localhost:8080/api/quotations';

  // 获取所有销售报价单
  static async getAllQuotations(): Promise<SalesQuotation[]> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`获取报价单列表失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据ID获取报价单详情
  static async getQuotationById(id: number): Promise<{ quotation: SalesQuotation; items: SalesQuotationItem[] }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`获取报价单详情失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 创建销售报价单
  static async createQuotation(quotationData: SalesQuotationRequest): Promise<SalesQuotation> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(quotationData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '创建报价单失败');
    }
    
    return result.quotation;
  }

  // 更新销售报价单
  static async updateQuotation(id: number, quotationData: SalesQuotationRequest): Promise<SalesQuotation> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(quotationData),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '更新报价单失败');
    }
    
    return result.quotation;
  }

  // 删除销售报价单
  static async deleteQuotation(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '删除报价单失败');
    }
  }

  // 发送报价单
  static async sendQuotation(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/send`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '发送报价单失败');
    }
  }

  // 接受报价单
  static async acceptQuotation(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/accept`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '接受报价单失败');
    }
  }

  // 拒绝报价单
  static async rejectQuotation(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/reject`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '拒绝报价单失败');
    }
  }

  // 根据客户名称搜索
  static async searchByCustomer(customerName: string): Promise<SalesQuotation[]> {
    const response = await fetch(`${this.baseUrl}/search?customerName=${encodeURIComponent(customerName)}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`搜索报价单失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据状态查询
  static async getQuotationsByStatus(status: string): Promise<SalesQuotation[]> {
    const response = await fetch(`${this.baseUrl}/status/${status}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`按状态查询报价单失败: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // 根据销售员查询
  static async getQuotationsBySalesperson(salesperson: string): Promise<SalesQuotation[]> {
    const response = await fetch(`${this.baseUrl}/salesperson/${encodeURIComponent(salesperson)}`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`按销售员查询报价单失败: ${response.statusText}`);
    }
    
    return await response.json();
  }
}

// 销售统计服务类
export class SalesStatisticsService {
  private static baseUrl = 'http://localhost:8080/api/statistics';

  // 获取销售仪表板数据
  static async getDashboardData(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/dashboard`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取仪表板数据失败');
    }
    
    return result.data;
  }

  // 获取销售订单执行情况报表
  static async getExecutionReport(startDate?: string, endDate?: string): Promise<any[]> {
    let url = `${this.baseUrl}/execution`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取执行情况报表失败');
    }
    
    return result.data;
  }

  // 获取销售毛利润明细报表
  static async getProfitDetailReport(startDate?: string, endDate?: string): Promise<any[]> {
    let url = `${this.baseUrl}/profit/detail`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取毛利润明细报表失败');
    }
    
    return result.data;
  }

  // 获取销售毛利润汇总
  static async getProfitSummary(startDate?: string, endDate?: string): Promise<any> {
    let url = `${this.baseUrl}/profit/summary`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取毛利润汇总失败');
    }
    
    return result.data;
  }

  // 获取综合统计信息
  static async getComprehensiveStatistics(startDate?: string, endDate?: string): Promise<any> {
    let url = `${this.baseUrl}/comprehensive`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取综合统计信息失败');
    }
    
    return result.data;
  }

  // 按部门获取销售汇总
  static async getSummaryByDepartment(startDate?: string, endDate?: string): Promise<any[]> {
    let url = `${this.baseUrl}/summary/department`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取部门销售汇总失败');
    }
    
    return result.data;
  }

  // 按业务员获取销售汇总
  static async getSummaryBySalesperson(startDate?: string, endDate?: string): Promise<any[]> {
    let url = `${this.baseUrl}/summary/salesperson`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取业务员销售汇总失败');
    }
    
    return result.data;
  }

  // 按客户获取销售汇总
  static async getSummaryByCustomer(startDate?: string, endDate?: string): Promise<any[]> {
    let url = `${this.baseUrl}/summary/customer`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取客户销售汇总失败');
    }
    
    return result.data;
  }

  // 按产品获取销售汇总
  static async getSummaryByProduct(startDate?: string, endDate?: string): Promise<any[]> {
    let url = `${this.baseUrl}/summary/product`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取产品销售汇总失败');
    }
    
    return result.data;
  }
}
