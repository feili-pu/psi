// 统计报表相关的 API 服务
import AuthService from './authService';

// 销售报表数据接口
export interface SalesReportData {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  monthGrowth: number;
  salesTrend: SalesTrendItem[];
  productRanking: ProductRankingItem[];
  customerRanking: CustomerRankingItem[];
  salesmanRanking: SalesmanRankingItem[];
}

export interface SalesTrendItem {
  month: string;
  sales: number;
  orders: number;
  customers: number;
}

export interface ProductRankingItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface CustomerRankingItem {
  id: number;
  customerName: string;
  totalAmount: number;
  orderCount: number;
  lastOrderDate: string;
  growth: number;
  level: string;
}

export interface SalesmanRankingItem {
  id: number;
  name: string;
  totalAmount: number;
  orderCount: number;
  customerCount: number;
  completionRate: number;
  target: number;
}

// 采购报表数据接口
export interface PurchaseReportData {
  totalPurchase: number;
  totalOrders: number;
  totalSuppliers: number;
  avgOrderValue: number;
  monthGrowth: number;
  purchaseTrend: PurchaseTrendItem[];
  supplierRanking: SupplierRankingItem[];
  categoryRanking: CategoryRankingItem[];
  purchaserRanking: PurchaserRankingItem[];
}

export interface PurchaseTrendItem {
  month: string;
  purchase: number;
  orders: number;
  suppliers: number;
}

export interface SupplierRankingItem {
  id: number;
  supplierName: string;
  totalAmount: number;
  orderCount: number;
  lastOrderDate: string;
  growth: number;
  level: string;
}

export interface CategoryRankingItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PurchaserRankingItem {
  id: number;
  name: string;
  totalAmount: number;
  orderCount: number;
  supplierCount: number;
  completionRate: number;
  target: number;
}

// 库存报表数据接口
export interface InventoryReportData {
  totalValue: number;
  totalItems: number;
  lowStockItems: number;
  turnoverRate: number;
  inventoryTrend: InventoryTrendItem[];
  categoryDistribution: CategoryDistributionItem[];
  lowStockList: LowStockItem[];
  turnoverAnalysis: TurnoverAnalysisItem[];
}

export interface InventoryTrendItem {
  month: string;
  value: number;
  quantity: number;
  turnover: number;
}

export interface CategoryDistributionItem {
  name: string;
  value: number;
  quantity: number;
  percentage: number;
  color: string;
}

export interface LowStockItem {
  id: number;
  productName: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: string;
  lastInDate: string;
}

export interface TurnoverAnalysisItem {
  id: number;
  productName: string;
  turnoverRate: number;
  avgStock: number;
  salesVolume: number;
  category: string;
}

// 财务报表数据接口
export interface FinancialReportData {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  grossProfitRate: number;
  monthGrowth: number;
  revenueTrend: RevenueTrendItem[];
  profitAnalysis: ProfitAnalysisItem[];
  costBreakdown: CostBreakdownItem[];
  cashFlow: CashFlowItem[];
}

export interface RevenueTrendItem {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
  profitRate: number;
}

export interface ProfitAnalysisItem {
  category: string;
  revenue: number;
  cost: number;
  profit: number;
  profitRate: number;
}

export interface CostBreakdownItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface CashFlowItem {
  month: string;
  inflow: number;
  outflow: number;
  netFlow: number;
}

// 销售报表服务类
export class SalesReportService {
  private static baseUrl = 'http://localhost:8080/api/statistics';

  // 获取销售报表数据
  static async getSalesReportData(startDate?: string, endDate?: string): Promise<SalesReportData> {
    try {
      // 并行获取多个统计数据
      const [dashboardResponse, productResponse, customerResponse, salesmanResponse, summaryResponse] = await Promise.all([
        fetch(`${this.baseUrl}/dashboard`, { headers: AuthService.getAuthHeaders() }),
        fetch(`${this.baseUrl}/summary/product${startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`, { headers: AuthService.getAuthHeaders() }),
        fetch(`${this.baseUrl}/summary/customer${startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`, { headers: AuthService.getAuthHeaders() }),
        fetch(`${this.baseUrl}/summary/salesperson${startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`, { headers: AuthService.getAuthHeaders() }),
        fetch(`${this.baseUrl}/summary${startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`, { headers: AuthService.getAuthHeaders() })
      ]);

      const [dashboard, products, customers, salesmen, summary] = await Promise.all([
        dashboardResponse.json(),
        productResponse.json(),
        customerResponse.json(),
        salesmanResponse.json(),
        summaryResponse.json()
      ]);

      console.log('销售统计API响应详情:');
      console.log('- Dashboard:', dashboard);
      console.log('- Products:', products);
      console.log('- Customers:', customers);
      console.log('- Salesmen:', salesmen);
      console.log('- Summary:', summary);

      // 构建销售报表数据
      const reportData: SalesReportData = {
        totalSales: this.getTotalSales(dashboard, summary),
        totalOrders: this.getTotalOrders(dashboard, summary),
        totalCustomers: this.getTotalCustomers(dashboard, customers),
        avgOrderValue: this.calculateAvgOrderValue(dashboard, summary),
        monthGrowth: this.getMonthGrowth(dashboard, summary),
        salesTrend: this.generateTrendFromData(summary), // 使用汇总数据生成趋势
        productRanking: this.convertToProductRanking(products.success ? products.data : []),
        customerRanking: this.convertToCustomerRanking(customers.success ? customers.data : []),
        salesmanRanking: this.convertToSalesmanRanking(salesmen.success ? salesmen.data : [])
      };

      console.log('构建的销售报表数据:', reportData);
      console.log('- 产品排行数据量:', reportData.productRanking.length);
      console.log('- 客户排行数据量:', reportData.customerRanking.length);
      console.log('- 销售员排行数据量:', reportData.salesmanRanking.length);
      
      return reportData;
    } catch (error) {
      console.error('获取销售报表数据失败:', error);
      // 返回默认数据而不是抛出错误，确保页面能正常显示
      return {
        totalSales: 0,
        totalOrders: 0,
        totalCustomers: 0,
        avgOrderValue: 0,
        monthGrowth: 0,
        salesTrend: [],
        productRanking: [],
        customerRanking: [],
        salesmanRanking: []
      };
    }
  }

  // 获取总销售额
  private static getTotalSales(dashboard: any, summary: any): number {
    if (dashboard.success && dashboard.data?.thisMonth?.totalAmount) {
      return dashboard.data.thisMonth.totalAmount;
    }
    if (summary.success && summary.data?.totalAmount) {
      return summary.data.totalAmount;
    }
    return 0;
  }

  // 获取总订单数
  private static getTotalOrders(dashboard: any, summary: any): number {
    if (dashboard.success && dashboard.data?.thisMonth?.orderCount) {
      return dashboard.data.thisMonth.orderCount;
    }
    if (summary.success && summary.data?.orderCount) {
      return summary.data.orderCount;
    }
    return 0;
  }

  // 获取总客户数
  private static getTotalCustomers(dashboard: any, customers: any): number {
    if (dashboard.success && dashboard.data?.executionStats?.customerCount) {
      return dashboard.data.executionStats.customerCount;
    }
    if (customers.success && Array.isArray(customers.data)) {
      return customers.data.length;
    }
    return 0;
  }

  // 计算平均订单金额
  private static calculateAvgOrderValue(dashboard: any, summary: any): number {
    const totalSales = this.getTotalSales(dashboard, summary);
    const totalOrders = this.getTotalOrders(dashboard, summary);
    return totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  }

  // 获取月度增长率
  private static getMonthGrowth(dashboard: any, summary: any): number {
    if (dashboard.success && dashboard.data?.salesGrowth !== undefined) {
      return dashboard.data.salesGrowth;
    }
    if (summary.success && summary.data?.growthRate !== undefined) {
      return summary.data.growthRate;
    }
    return 0;
  }

  // 从数据生成趋势（只使用后端真实数据）
  private static generateTrendFromData(summary: any): SalesTrendItem[] {
    // 只使用后端提供的真实历史数据
    if (summary.success && summary.data?.monthlyData && Array.isArray(summary.data.monthlyData)) {
      return summary.data.monthlyData.map((item: any) => ({
        month: item.month || '',
        sales: item.totalAmount || 0,
        orders: item.orderCount || 0,
        customers: item.customerCount || 0
      }));
    }
    
    // 如果没有历史数据，返回空数组
    return [];
  }

  // 转换产品排行数据（只使用真实产品名称）
  private static convertToProductRanking(data: any[]): ProductRankingItem[] {
    console.log('转换产品排行数据，原始数据:', data);
    
    if (!data || data.length === 0) {
      console.log('产品数据为空，返回空数组');
      return [];
    }
    
    // 过滤掉没有产品名称的数据，注意后端返回的字段名是 groupName
    const validData = data.filter(item => item.groupName && item.groupName.trim() !== '');
    console.log('过滤后的有效产品数据:', validData);
    
    if (validData.length === 0) {
      console.log('没有有效的产品数据，返回空数组');
      return [];
    }
    
    const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];
    const maxAmount = Math.max(...validData.map(d => d.totalAmount || 0));
    
    const result = validData.slice(0, 5).map((item, index) => ({
      name: item.groupName, // 后端返回的是 groupName 字段
      value: item.totalAmount || 0,
      percentage: maxAmount > 0 ? Math.round((item.totalAmount || 0) / maxAmount * 100) : 0,
      color: colors[index] || '#666'
    }));
    
    console.log('转换后的产品排行数据:', result);
    return result;
  }

  // 转换客户排行数据（只使用真实客户名称）
  private static convertToCustomerRanking(data: any[]): CustomerRankingItem[] {
    console.log('转换客户排行数据，原始数据:', data);
    
    if (!data || data.length === 0) {
      console.log('客户数据为空，返回空数组');
      return [];
    }
    
    // 过滤掉没有客户名称的数据，注意后端返回的字段名是 groupName
    const validData = data.filter(item => item.groupName && item.groupName.trim() !== '');
    console.log('过滤后的有效客户数据:', validData);
    
    if (validData.length === 0) {
      console.log('没有有效的客户数据，返回空数组');
      return [];
    }
    
    const result = validData.slice(0, 10).map((item, index) => ({
      id: index + 1,
      customerName: item.groupName, // 后端返回的是 groupName 字段
      totalAmount: item.totalAmount || 0,
      orderCount: item.orderCount || 0,
      lastOrderDate: item.lastOrderDate || new Date().toISOString().split('T')[0],
      growth: item.growth || 0, // 使用后端提供的增长率，如果没有则为0
      level: this.getCustomerLevel(item.totalAmount || 0, index)
    }));
    
    console.log('转换后的客户排行数据:', result);
    return result;
  }

  // 根据销售金额和排名确定客户等级
  private static getCustomerLevel(totalAmount: number, index: number): string {
    if (totalAmount > 1000000 || index < 2) return 'VIP';
    if (totalAmount > 500000 || index < 5) return '金牌';
    if (totalAmount > 200000 || index < 8) return '银牌';
    return '普通';
  }

  // 转换销售员排行数据（只使用真实销售员名称）
  private static convertToSalesmanRanking(data: any[]): SalesmanRankingItem[] {
    console.log('转换销售员排行数据，原始数据:', data);
    
    if (!data || data.length === 0) {
      console.log('销售员数据为空，返回空数组');
      return [];
    }
    
    // 过滤掉没有销售员名称的数据，注意后端返回的字段名是 groupName
    const validData = data.filter(item => item.groupName && item.groupName.trim() !== '');
    console.log('过滤后的有效销售员数据:', validData);
    
    if (validData.length === 0) {
      console.log('没有有效的销售员数据，返回空数组');
      return [];
    }
    
    const result = validData.slice(0, 10).map((item, index) => ({
      id: index + 1,
      name: item.groupName, // 后端返回的是 groupName 字段
      totalAmount: item.totalAmount || 0,
      orderCount: item.orderCount || 0,
      customerCount: item.customerCount || 0,
      completionRate: item.completionRate || 0, // 使用后端数据，如果没有则为0
      target: item.target || 0 // 使用后端数据，如果没有则为0
    }));
    
    console.log('转换后的销售员排行数据:', result);
    return result;
  }

  // 获取销售趋势数据（使用综合统计接口）
  static async getSalesTrend(startDate?: string, endDate?: string): Promise<SalesTrendItem[]> {
    const reportData = await this.getSalesReportData(startDate, endDate);
    return reportData.salesTrend;
  }

  // 获取产品销售排行（使用产品汇总接口）
  static async getProductRanking(startDate?: string, endDate?: string): Promise<ProductRankingItem[]> {
    const reportData = await this.getSalesReportData(startDate, endDate);
    return reportData.productRanking;
  }

  // 获取客户销售排行（使用客户汇总接口）
  static async getCustomerRanking(startDate?: string, endDate?: string): Promise<CustomerRankingItem[]> {
    const reportData = await this.getSalesReportData(startDate, endDate);
    return reportData.customerRanking;
  }

  // 获取销售员业绩排行（使用销售员汇总接口）
  static async getSalesmanRanking(startDate?: string, endDate?: string): Promise<SalesmanRankingItem[]> {
    const reportData = await this.getSalesReportData(startDate, endDate);
    return reportData.salesmanRanking;
  }
}

// 采购报表服务类
export class PurchaseReportService {
  private static baseUrl = 'http://localhost:8080/api/purchase/statistics';

  // 获取采购报表数据
  static async getPurchaseReportData(startDate?: string, endDate?: string): Promise<PurchaseReportData> {
    try {
      // 并行获取多个统计数据
      const [summaryResponse, supplierResponse, purchaserResponse, productResponse] = await Promise.all([
        fetch(`${this.baseUrl}/summary${startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`, { headers: AuthService.getAuthHeaders() }),
        fetch(`${this.baseUrl}/summary/supplier${startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`, { headers: AuthService.getAuthHeaders() }),
        fetch(`${this.baseUrl}/summary/purchaser${startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`, { headers: AuthService.getAuthHeaders() }),
        fetch(`${this.baseUrl}/summary/product${startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`, { headers: AuthService.getAuthHeaders() })
      ]);

      const [summary, suppliers, purchasers, products] = await Promise.all([
        summaryResponse.json(),
        supplierResponse.json(),
        purchaserResponse.json(),
        productResponse.json()
      ]);

      console.log('采购统计API响应详情:');
      console.log('- Summary:', summary);
      console.log('- Suppliers:', suppliers);
      console.log('- Purchasers:', purchasers);
      console.log('- Products:', products);

      // 计算总体统计
      const summaryData = summary.success ? summary.data : [];
      const totalPurchase = summaryData.reduce((sum: number, item: any) => sum + (item.totalAmount || 0), 0);
      const totalOrders = summaryData.reduce((sum: number, item: any) => sum + (item.orderCount || 0), 0);
      const supplierData = suppliers.success ? suppliers.data : [];
      const totalSuppliers = supplierData.length;

      // 构建采购报表数据
      const reportData: PurchaseReportData = {
        totalPurchase,
        totalOrders,
        totalSuppliers,
        avgOrderValue: totalOrders > 0 ? Math.round(totalPurchase / totalOrders) : 0,
        monthGrowth: this.calculateGrowthRate(summaryData), // 从数据计算增长率
        purchaseTrend: this.generateTrendFromData(summaryData),
        supplierRanking: this.convertToSupplierRanking(supplierData),
        categoryRanking: this.convertToCategoryRanking(products.success ? products.data : []),
        purchaserRanking: this.convertToPurchaserRanking(purchasers.success ? purchasers.data : [])
      };

      console.log('构建的采购报表数据:', reportData);
      console.log('- 供应商排行数据量:', reportData.supplierRanking.length);
      console.log('- 品类排行数据量:', reportData.categoryRanking.length);
      console.log('- 采购员排行数据量:', reportData.purchaserRanking.length);

      return reportData;
    } catch (error) {
      console.error('获取采购报表数据失败:', error);
      // 返回默认数据而不是抛出错误，确保页面能正常显示
      return {
        totalPurchase: 0,
        totalOrders: 0,
        totalSuppliers: 0,
        avgOrderValue: 0,
        monthGrowth: 0,
        purchaseTrend: [],
        supplierRanking: [],
        categoryRanking: [],
        purchaserRanking: []
      };
    }
  }

  // 计算增长率
  private static calculateGrowthRate(summaryData: any[]): number {
    if (!summaryData || summaryData.length < 2) {
      return 0;
    }
    
    // 如果数据包含月份信息，计算月度增长率
    const sortedData = summaryData.sort((a, b) => (a.period || '').localeCompare(b.period || ''));
    if (sortedData.length >= 2) {
      const current = sortedData[sortedData.length - 1]?.totalAmount || 0;
      const previous = sortedData[sortedData.length - 2]?.totalAmount || 1;
      return Math.round(((current - previous) / previous) * 1000) / 10; // 保留一位小数
    }
    
    return 0;
  }

  // 从汇总数据生成趋势数据
  private static generateTrendFromData(summaryData: any[]): PurchaseTrendItem[] {
    if (summaryData && summaryData.length > 0) {
      // 使用后端提供的真实历史数据
      return summaryData.map((item: any) => ({
        month: item.period || '',
        purchase: item.totalAmount || 0,
        orders: item.orderCount || 0,
        suppliers: item.supplierCount || 0
      }));
    }
    
    // 如果没有历史数据，返回空数组
    return [];
  }

  // 转换供应商排行数据（使用真实供应商名称）
  private static convertToSupplierRanking(data: any[]): SupplierRankingItem[] {
    console.log('转换供应商排行数据，原始数据:', data);
    
    if (!data || data.length === 0) {
      console.log('供应商数据为空，返回空数组');
      return [];
    }
    
    // 过滤掉没有供应商名称的数据
    const validData = data.filter(item => item.supplierName && item.supplierName.trim() !== '');
    console.log('过滤后的有效供应商数据:', validData);
    
    if (validData.length === 0) {
      console.log('没有有效的供应商数据，返回空数组');
      return [];
    }
    
    const result = validData.slice(0, 10).map((item, index) => ({
      id: index + 1,
      supplierName: item.supplierName,
      totalAmount: item.totalAmount || 0,
      orderCount: item.orderCount || 0,
      lastOrderDate: item.lastOrderDate || new Date().toISOString().split('T')[0],
      growth: this.calculateSupplierGrowth(item), // 计算供应商增长率
      level: this.getSupplierLevel(item.totalAmount || 0, index)
    }));
    
    console.log('转换后的供应商排行数据:', result);
    return result;
  }

  // 计算供应商增长率（基于完成率等指标）
  private static calculateSupplierGrowth(item: any): number {
    // 基于完成率和按时交货率计算一个综合增长指标
    const completionRate = item.completionRate || 0;
    const onTimeRate = item.onTimeRate || 0;
    return Math.round((completionRate + onTimeRate) / 2 - 80); // 以80%为基准
  }

  // 根据采购金额和排名确定供应商等级
  private static getSupplierLevel(totalAmount: number, index: number): string {
    if (totalAmount > 1000000 || index < 1) return '战略';
    if (totalAmount > 500000 || index < 3) return '核心';
    if (totalAmount > 200000 || index < 5) return '重要';
    return '普通';
  }

  // 转换品类排行数据
  private static convertToCategoryRanking(data: any[]): CategoryRankingItem[] {
    console.log('转换品类排行数据，原始数据:', data);
    
    if (!data || data.length === 0) {
      console.log('产品数据为空，返回空数组');
      return [];
    }

    const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];
    const categoryMap = new Map();
    
    // 按产品名称分组统计
    data.forEach((item: any) => {
      const category = this.getCategoryFromProduct(item.productName || '');
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category) + (item.totalAmount || 0));
      } else {
        categoryMap.set(category, item.totalAmount || 0);
      }
    });

    const categories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const total = categories.reduce((sum, [_, value]) => sum + value, 0);

    const result = categories.map(([name, value], index) => ({
      name,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      color: colors[index] || '#666'
    }));
    
    console.log('转换后的品类排行数据:', result);
    return result;
  }

  // 从产品名称推断品类
  private static getCategoryFromProduct(productName: string): string {
    if (productName.includes('电脑') || productName.includes('CPU') || productName.includes('内存') || productName.includes('显示器')) {
      return '电子设备';
    } else if (productName.includes('办公') || productName.includes('桌') || productName.includes('椅') || productName.includes('文具')) {
      return '办公用品';
    } else if (productName.includes('设备') || productName.includes('机械') || productName.includes('工具')) {
      return '工业设备';
    } else if (productName.includes('化工') || productName.includes('材料') || productName.includes('原料')) {
      return '化工材料';
    } else {
      return '其他';
    }
  }

  // 转换采购员排行数据（使用真实采购员名称）
  private static convertToPurchaserRanking(data: any[]): PurchaserRankingItem[] {
    console.log('转换采购员排行数据，原始数据:', data);
    
    if (!data || data.length === 0) {
      console.log('采购员数据为空，返回空数组');
      return [];
    }
    
    // 过滤掉没有采购员名称的数据
    const validData = data.filter(item => item.purchaser && item.purchaser.trim() !== '');
    console.log('过滤后的有效采购员数据:', validData);
    
    if (validData.length === 0) {
      console.log('没有有效的采购员数据，返回空数组');
      return [];
    }
    
    const result = validData.slice(0, 10).map((item, index) => ({
      id: index + 1,
      name: item.purchaser,
      totalAmount: item.totalAmount || 0,
      orderCount: item.orderCount || 0,
      supplierCount: item.supplierCount || 0,
      completionRate: item.completionRate || 0, // 使用后端数据
      target: this.calculateTarget(item.totalAmount || 0) // 基于实际金额计算目标
    }));
    
    console.log('转换后的采购员排行数据:', result);
    return result;
  }

  // 基于实际采购金额计算目标金额
  private static calculateTarget(actualAmount: number): number {
    // 假设目标比实际高20%
    return Math.round(actualAmount * 1.2);
  }

  // 其他方法
  static async getPurchaseTrend(startDate?: string, endDate?: string): Promise<PurchaseTrendItem[]> {
    const reportData = await this.getPurchaseReportData(startDate, endDate);
    return reportData.purchaseTrend;
  }

  static async getSupplierRanking(startDate?: string, endDate?: string): Promise<SupplierRankingItem[]> {
    const reportData = await this.getPurchaseReportData(startDate, endDate);
    return reportData.supplierRanking;
  }

  static async getPurchaserRanking(startDate?: string, endDate?: string): Promise<PurchaserRankingItem[]> {
    const reportData = await this.getPurchaseReportData(startDate, endDate);
    return reportData.purchaserRanking;
  }
}

// 库存报表服务类
export class InventoryReportService {
  // 获取库存报表数据（使用优化的模拟数据，因为后端接口尚未实现）
  static async getInventoryReportData(_startDate?: string, _endDate?: string): Promise<InventoryReportData> {
    try {
      // 模拟从其他接口获取基础数据来生成更真实的库存统计
      const reportData: InventoryReportData = {
        totalValue: 4250000,
        totalItems: 1286,
        lowStockItems: 23,
        turnoverRate: 4.2,
        inventoryTrend: this.generateRealisticInventoryTrend(),
        categoryDistribution: this.generateRealisticCategoryDistribution(),
        lowStockList: this.generateRealisticLowStockList(),
        turnoverAnalysis: this.generateRealisticTurnoverAnalysis()
      };

      return reportData;
    } catch (error) {
      console.error('获取库存报表数据失败:', error);
      throw new Error('获取库存报表数据失败: ' + (error as Error).message);
    }
  }

  // 生成更真实的库存趋势数据
  private static generateRealisticInventoryTrend(): InventoryTrendItem[] {
    const months = [];
    const now = new Date();
    let baseValue = 4250000;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      // 模拟季节性变化和业务增长
      const seasonalFactor = 1 + 0.1 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
      const growthFactor = 1 + (6 - i) * 0.02; // 逐月小幅增长
      const randomFactor = 0.95 + Math.random() * 0.1; // ±5%随机变化
      
      const value = Math.floor(baseValue * seasonalFactor * growthFactor * randomFactor);
      const quantity = Math.floor(value / 3300); // 假设平均单价3300元
      
      months.push({
        month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        value,
        quantity,
        turnover: 3.5 + Math.random() * 1.4 // 3.5-4.9的周转率
      });
    }
    return months;
  }

  // 生成更真实的品类分布数据
  private static generateRealisticCategoryDistribution(): CategoryDistributionItem[] {
    const categories = [
      { name: '电子产品', color: '#1890ff', baseValue: 1500000, baseQty: 450 },
      { name: '办公用品', color: '#52c41a', baseValue: 850000, baseQty: 320 },
      { name: '工业设备', color: '#faad14', baseValue: 1200000, baseQty: 180 },
      { name: '化工材料', color: '#f5222d', baseValue: 450000, baseQty: 220 },
      { name: '其他', color: '#722ed1', baseValue: 250000, baseQty: 116 }
    ];
    
    const total = categories.reduce((sum, cat) => sum + cat.baseValue, 0);
    
    return categories.map((cat) => ({
      name: cat.name,
      value: cat.baseValue + Math.floor((Math.random() - 0.5) * cat.baseValue * 0.2), // ±10%变化
      quantity: cat.baseQty + Math.floor((Math.random() - 0.5) * cat.baseQty * 0.2),
      percentage: Math.round((cat.baseValue / total) * 100),
      color: cat.color
    }));
  }

  // 生成更真实的低库存商品数据
  private static generateRealisticLowStockList(): LowStockItem[] {
    const products = [
      { name: 'Intel CPU i7-12700K', minStock: 20, maxStock: 100 },
      { name: 'DDR4 内存条 16GB', minStock: 50, maxStock: 200 },
      { name: '三星 SSD 1TB', minStock: 30, maxStock: 150 },
      { name: 'Dell 显示器 27寸', minStock: 15, maxStock: 80 },
      { name: '罗技键鼠套装', minStock: 25, maxStock: 120 },
      { name: 'HP 激光打印机', minStock: 10, maxStock: 50 },
      { name: 'A4 复印纸 500张', minStock: 100, maxStock: 500 },
      { name: 'HP 墨盒 黑色', minStock: 20, maxStock: 100 }
    ];
    
    return products.slice(0, 5).map((product, index) => {
      const currentStock = Math.floor(Math.random() * product.minStock * 0.8); // 低于最低库存
      let status = '库存不足';
      if (currentStock < product.minStock * 0.3) {
        status = '严重不足';
      } else if (currentStock < product.minStock * 0.6) {
        status = '库存不足';
      } else {
        status = '即将不足';
      }
      
      return {
        id: index + 1,
        productName: product.name,
        currentStock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        status,
        lastInDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
    });
  }

  // 生成更真实的周转分析数据
  private static generateRealisticTurnoverAnalysis(): TurnoverAnalysisItem[] {
    const products = [
      { name: '联想笔记本电脑', category: '电子产品', baseStock: 150, baseSales: 800 },
      { name: 'HP台式电脑', category: '电子产品', baseStock: 120, baseSales: 600 },
      { name: 'LG显示器', category: '电子产品', baseStock: 200, baseSales: 1200 },
      { name: 'Canon打印机', category: '办公设备', baseStock: 80, baseSales: 320 },
      { name: '实木办公桌', category: '办公家具', baseStock: 50, baseSales: 150 },
      { name: '人体工学椅', category: '办公家具', baseStock: 60, baseSales: 200 },
      { name: '钢制文件柜', category: '办公家具', baseStock: 40, baseSales: 120 },
      { name: 'Epson投影仪', category: '办公设备', baseStock: 25, baseSales: 80 }
    ];
    
    return products.map((product, index) => {
      const avgStock = product.baseStock + Math.floor((Math.random() - 0.5) * product.baseStock * 0.3);
      const salesVolume = product.baseSales + Math.floor((Math.random() - 0.5) * product.baseSales * 0.3);
      const turnoverRate = salesVolume / avgStock;
      
      return {
        id: index + 1,
        productName: product.name,
        turnoverRate: Math.round(turnoverRate * 100) / 100,
        avgStock,
        salesVolume,
        category: product.category
      };
    });
  }

  // 其他方法
  static async getInventoryTrend(startDate?: string, endDate?: string): Promise<InventoryTrendItem[]> {
    const reportData = await this.getInventoryReportData(startDate, endDate);
    return reportData.inventoryTrend;
  }

  static async getLowStockItems(): Promise<LowStockItem[]> {
    const reportData = await this.getInventoryReportData();
    return reportData.lowStockList;
  }

  static async getTurnoverAnalysis(startDate?: string, endDate?: string): Promise<TurnoverAnalysisItem[]> {
    const reportData = await this.getInventoryReportData(startDate, endDate);
    return reportData.turnoverAnalysis;
  }
}

// 财务报表服务类
export class FinancialReportService {
  // 获取财务报表数据（使用优化的模拟数据，因为后端接口尚未实现）
  static async getFinancialReportData(_startDate?: string, _endDate?: string): Promise<FinancialReportData> {
    try {
      // 可以尝试从销售和采购统计中获取基础数据来计算财务指标
      const reportData: FinancialReportData = {
        totalRevenue: 5680000,
        totalCost: 4250000,
        grossProfit: 1430000,
        grossProfitRate: 25.18,
        monthGrowth: 8.5,
        revenueTrend: this.generateRealisticRevenueTrend(),
        profitAnalysis: this.generateRealisticProfitAnalysis(),
        costBreakdown: this.generateRealisticCostBreakdown(),
        cashFlow: this.generateRealisticCashFlow()
      };

      return reportData;
    } catch (error) {
      console.error('获取财务报表数据失败:', error);
      throw new Error('获取财务报表数据失败: ' + (error as Error).message);
    }
  }

  // 生成更真实的收入趋势数据
  private static generateRealisticRevenueTrend(): RevenueTrendItem[] {
    const months = [];
    const now = new Date();
    let baseRevenue = 800000; // 基础月收入
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      // 模拟业务增长趋势
      const growthFactor = 1 + (6 - i) * 0.03; // 逐月3%增长
      // 模拟季节性因素
      const seasonalFactor = 1 + 0.15 * Math.sin((date.getMonth() / 12) * 2 * Math.PI + Math.PI/2);
      // 随机波动
      const randomFactor = 0.9 + Math.random() * 0.2; // ±10%波动
      
      const revenue = Math.floor(baseRevenue * growthFactor * seasonalFactor * randomFactor);
      const costRatio = 0.72 + Math.random() * 0.08; // 成本率72%-80%
      const cost = Math.floor(revenue * costRatio);
      const profit = revenue - cost;
      const profitRate = (profit / revenue) * 100;
      
      months.push({
        month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        revenue,
        cost,
        profit,
        profitRate: Math.round(profitRate * 100) / 100
      });
    }
    return months;
  }

  // 生成更真实的利润分析数据
  private static generateRealisticProfitAnalysis(): ProfitAnalysisItem[] {
    const businessLines = [
      { name: '销售业务', revenueBase: 3200000, costRatio: 0.68 },
      { name: '采购代理', revenueBase: 1800000, costRatio: 0.85 },
      { name: '库存服务', revenueBase: 480000, costRatio: 0.45 },
      { name: '咨询服务', revenueBase: 200000, costRatio: 0.25 }
    ];
    
    return businessLines.map((business) => {
      const revenue = business.revenueBase + Math.floor((Math.random() - 0.5) * business.revenueBase * 0.2);
      const cost = Math.floor(revenue * (business.costRatio + (Math.random() - 0.5) * 0.1));
      const profit = revenue - cost;
      const profitRate = (profit / revenue) * 100;
      
      return {
        category: business.name,
        revenue,
        cost,
        profit,
        profitRate: Math.round(profitRate * 100) / 100
      };
    });
  }

  // 生成更真实的成本构成数据
  private static generateRealisticCostBreakdown(): CostBreakdownItem[] {
    const costItems = [
      { name: '采购成本', color: '#1890ff', baseValue: 2800000 },
      { name: '人工成本', color: '#52c41a', baseValue: 680000 },
      { name: '运营成本', color: '#faad14', baseValue: 420000 },
      { name: '管理费用', color: '#f5222d', baseValue: 250000 },
      { name: '其他费用', color: '#722ed1', baseValue: 100000 }
    ];
    
    const total = costItems.reduce((sum, item) => sum + item.baseValue, 0);
    
    return costItems.map((item) => {
      const value = item.baseValue + Math.floor((Math.random() - 0.5) * item.baseValue * 0.15);
      return {
        name: item.name,
        value,
        percentage: Math.round((item.baseValue / total) * 100),
        color: item.color
      };
    });
  }

  // 生成更真实的现金流数据
  private static generateRealisticCashFlow(): CashFlowItem[] {
    const months = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      // 现金流入（销售收入 + 其他收入）
      const baseInflow = 750000 + (6 - i) * 25000; // 逐月增长
      const seasonalInflowFactor = 1 + 0.2 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
      const inflow = Math.floor(baseInflow * seasonalInflowFactor * (0.95 + Math.random() * 0.1));
      
      // 现金流出（采购支出 + 运营支出）
      const baseOutflow = 580000 + (6 - i) * 18000; // 逐月增长但增幅小于流入
      const seasonalOutflowFactor = 1 + 0.1 * Math.sin((date.getMonth() / 12) * 2 * Math.PI + Math.PI/4);
      const outflow = Math.floor(baseOutflow * seasonalOutflowFactor * (0.95 + Math.random() * 0.1));
      
      months.push({
        month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        inflow,
        outflow,
        netFlow: inflow - outflow
      });
    }
    return months;
  }

  // 其他方法
  static async getRevenueTrend(startDate?: string, endDate?: string): Promise<RevenueTrendItem[]> {
    const reportData = await this.getFinancialReportData(startDate, endDate);
    return reportData.revenueTrend;
  }

  static async getProfitAnalysis(startDate?: string, endDate?: string): Promise<ProfitAnalysisItem[]> {
    const reportData = await this.getFinancialReportData(startDate, endDate);
    return reportData.profitAnalysis;
  }

  static async getCashFlow(startDate?: string, endDate?: string): Promise<CashFlowItem[]> {
    const reportData = await this.getFinancialReportData(startDate, endDate);
    return reportData.cashFlow;
  }
}