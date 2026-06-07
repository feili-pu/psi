import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Space } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  InboxOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../pages/Dashboard/Dashboard';
import SalesOrders from '../pages/Sales/SalesOrders';
import SalesQuotations from '../pages/Sales/SalesQuotations';
import SalesStatistics from '../pages/Sales/SalesStatistics';
import PurchaseOrders from '../pages/Purchase/PurchaseOrders';
import PurchaseRequests from '../pages/Purchase/PurchaseRequests';
import PurchaseInquiry from '../pages/Purchase/PurchaseInquiry';
import PurchaseComparison from '../pages/Purchase/PurchaseComparison';
import SupplierQuotations from '../pages/Purchase/SupplierQuotations';
import PurchasePayable from '../pages/Purchase/PurchasePayable';
import PurchaseStatistics from '../pages/Purchase/PurchaseStatistics';
import InventoryCheck from '../pages/Inventory/InventoryCheck';
import InventoryReceipt from '../pages/Inventory/InventoryReceipt';
import MaterialRequisition from '../pages/Inventory/MaterialRequisition';
import MaterialReturn from '../pages/Inventory/MaterialReturn';
import ProductReceipt from '../pages/Inventory/ProductReceipt';
import ProductAssembly from '../pages/Inventory/ProductAssembly';
import ProductDisassembly from '../pages/Inventory/ProductDisassembly';
import SerialInventory from '../pages/Inventory/SerialInventory';
import SerialReceipt from '../pages/Inventory/SerialReceipt';
import SalesReport from '../pages/Statistics/SalesReport';
import PurchaseReport from '../pages/Statistics/PurchaseReport';
import InventoryReport from '../pages/Statistics/InventoryReport';
import FinancialReport from '../pages/Statistics/FinancialReport';
import UserManagement from '../pages/System/UserManagement';
import RoleManagement from '../pages/System/RoleManagement';
import ApiDocumentation from '../pages/System/ApiDocumentation';

const { Header, Footer, Sider, Content } = Layout;

// 菜单权限映射表
const menuPermissions: Record<string, string[]> = {
  'dashboard': [], // 工作台无需权限
  'sales': ['sales:order:read', 'sales:quotation:read', 'sales:statistics:read'], // 销售管理（有任一权限即可）
  'sales-orders': ['sales:order:read'],
  'sales-quotations': ['sales:quotation:read'],
  'sales-statistics': ['sales:statistics:read'],
  'purchase': ['purchase:order:read', 'purchase:request:read', 'purchase:quotation:read'], // 采购管理（有任一权限即可）
  'purchase-requests': ['purchase:request:read'],
  'purchase-inquiry': ['purchase:inquiry:read'],
  'purchase-comparison': ['purchase:comparison:read'],
  'supplier-quotations': ['purchase:quotation:read'],
  'purchase-orders': ['purchase:order:read'],
  'purchase-payable': ['purchase:payable:read'],
  'purchase-statistics': ['purchase:statistics:read'],
  'inventory': ['inventory:receipt:read', 'inventory:check:view', 'material:requisition:view'], // 库存管理（有任一权限即可）
  'inventory-receipt': ['inventory:receipt:read'],
  'inventory-check': ['inventory:check:view'],
  'material-requisition': ['material:requisition:view'],
  'material-return': ['material:return:view'],
  'product-receipt': ['product:receipt:view'],
  'product-assembly': ['product:assembly:view'],
  'product-disassembly': ['product:disassembly:view'],
  'serial-inventory': ['serial:inventory:view'],
  'serial-receipt': ['serial:receipt:view'],
  'statistics': ['sales:statistics:read', 'purchase:statistics:read'], // 统计报表（有任一权限即可）
  'sales-report': ['sales:statistics:read'],
  'purchase-report': ['purchase:statistics:read'],
  'inventory-report': ['inventory:statistics:read'],
  'financial-report': ['financial:statistics:read'],
  'system': ['user:read', 'role:read'], // 系统管理（有任一权限即可）
  'users': ['user:read'],
  'roles': ['role:read'],
  'api-docs': [] // API文档无需权限
};

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '工作台',
  },
  {
    key: 'sales',
    icon: <ShoppingCartOutlined />,
    label: '销售管理',
    children: [
      { key: 'sales-orders', label: '销售订单' },
      { key: 'sales-quotations', label: '销售报价' },
      { key: 'sales-statistics', label: '销售统计' }
    ]
  },
  {
    key: 'purchase',
    icon: <ShopOutlined />,
    label: '采购管理',
    children: [
      { key: 'purchase-requests', label: '采购申请' },
      { key: 'purchase-inquiry', label: '采购询价' },
      { key: 'purchase-comparison', label: '采购比价' },
      { key: 'supplier-quotations', label: '供应商报价' },
      { key: 'purchase-orders', label: '采购订单' },
      { key: 'purchase-payable', label: '采购应付' },
      { key: 'purchase-statistics', label: '采购统计' }
    ]
  },
  {
    key: 'inventory',
    icon: <InboxOutlined />,
    label: '库存管理',
    children: [
      { key: 'inventory-receipt', label: '库存入库' },
      { key: 'inventory-check', label: '库存盘点' },
      { key: 'material-requisition', label: '物料领用' },
      { key: 'material-return', label: '物料退库' },
      { key: 'product-receipt', label: '产品入库' },
      { key: 'product-assembly', label: '产品组装' },
      { key: 'product-disassembly', label: '产品拆解' },
      { key: 'serial-inventory', label: '序列号库存' },
      { key: 'serial-receipt', label: '序列号入库' }
    ]
  },
  {
    key: 'statistics',
    icon: <BarChartOutlined />,
    label: '统计报表',
    children: [
      { key: 'sales-report', label: '销售报表' },
      { key: 'purchase-report', label: '采购报表' },
      { key: 'inventory-report', label: '库存报表' },
      { key: 'financial-report', label: '财务报表' }
    ]
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: 'users', label: '用户管理' },
      { key: 'roles', label: '角色管理' },
      { key: 'api-docs', label: 'API文档' }
    ]
  }
];

// 根据权限过滤菜单的函数
const filterMenuByPermissions = (
  menuItems: any[], 
  hasAnyPermission: (permissions: string[]) => boolean
): any[] => {
  return menuItems.filter(item => {
    // 获取当前菜单项所需权限
    const requiredPermissions = menuPermissions[item.key] || [];
    
    // 如果无需权限或用户有相应权限，则显示
    const hasAccess = requiredPermissions.length === 0 || 
                     hasAnyPermission(requiredPermissions);
    
    if (!hasAccess) return false;
    
    // 如果有子菜单，递归过滤
    if (item.children) {
      const filteredChildren = filterMenuByPermissions(item.children, hasAnyPermission);
      // 如果所有子菜单都没权限，隐藏父菜单
      if (filteredChildren.length === 0) return false;
      // 更新子菜单
      return { ...item, children: filteredChildren };
    }
    
    return true;
  }).map(item => {
    // 如果有子菜单，确保返回更新后的item
    if (item.children) {
      const filteredChildren = filterMenuByPermissions(item.children, hasAnyPermission);
      return { ...item, children: filteredChildren };
    }
    return item;
  });
};

const MainLayout: React.FC = () => {
  const { user, logout, hasAnyPermission } = useAuth();
  const [selectedKey, setSelectedKey] = useState('dashboard');

  // 根据权限过滤菜单
  const filteredMenuItems = React.useMemo(() => {
    console.log('当前用户权限: 权限函数可用');
    console.log('用户信息:', user);
    console.log('用户权限列表:', user?.permissions || '无权限数据');
    
    const filtered = filterMenuByPermissions(menuItems, hasAnyPermission);
    console.log('过滤后的菜单项:', filtered);
    return filtered;
  }, [hasAnyPermission, user]);

  const renderContent = () => {
    switch (selectedKey) {
      case 'sales-orders': return <SalesOrders />;
      case 'sales-quotations': return <SalesQuotations />;
      case 'sales-statistics': return <SalesStatistics />;
      case 'purchase-orders': return <PurchaseOrders />;
      case 'purchase-requests': return <PurchaseRequests />;
      case 'purchase-inquiry': return <PurchaseInquiry />;
      case 'purchase-comparison': return <PurchaseComparison />;
      case 'supplier-quotations': return <SupplierQuotations />;
      case 'purchase-payable': return <PurchasePayable />;
      case 'purchase-statistics': return <PurchaseStatistics />;
      case 'inventory-check': return <InventoryCheck />;
      case 'inventory-receipt': return <InventoryReceipt />;
      case 'material-requisition': return <MaterialRequisition />;
      case 'material-return': return <MaterialReturn />;
      case 'product-receipt': return <ProductReceipt />;
      case 'product-assembly': return <ProductAssembly />;
      case 'product-disassembly': return <ProductDisassembly />;
      case 'serial-inventory': return <SerialInventory />;
      case 'serial-receipt': return <SerialReceipt />;
      case 'sales-report': return <SalesReport />;
      case 'purchase-report': return <PurchaseReport />;
      case 'inventory-report': return <InventoryReport />;
      case 'financial-report': return <FinancialReport />;
      case 'users': return <UserManagement />;
      case 'roles': return <RoleManagement />;
      case 'api-docs': return <ApiDocumentation />;
      case 'dashboard': return <Dashboard />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <span className="app-brand-icon"><AppstoreOutlined /></span>
            <div>
              <strong>PSI管理系统</strong>
              <span>采购 / 销售 / 库存</span>
            </div>
          </div>
          
          <Space size={16}>
            <button className="header-icon-button" type="button" aria-label="通知">
              <BellOutlined />
            </button>
            <Dropdown 
              menu={{ 
                items: [
                  { key: 'profile', icon: <UserOutlined />, label: '个人资料' },
                  { key: 'settings', icon: <SettingOutlined />, label: '个人设置' },
                  { type: 'divider' },
                  { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: logout, style: { color: '#f5222d' } }
                ]
              }} 
              placement="bottomRight"
            >
              <div className="user-trigger">
                <Avatar size={28} icon={<UserOutlined />} />
                <span>{user?.realName || user?.username || '用户'}</span>
              </div>
            </Dropdown>
          </Space>
        </div>
      </Header>
      
      <Layout className="app-main">
        <Sider width="264px" className="app-sider">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={[]}
            items={filteredMenuItems}
            className="professional-menu"
            onClick={({ key }) => setSelectedKey(key)}
          />
        </Sider>
        
        <Content className="app-content">
          <div className="content-surface">
            {renderContent()}
          </div>
        </Content>
      </Layout>
      
      <Footer className="app-footer">
        PSI管理系统 ©{new Date().getFullYear()} Created by XiongZe
      </Footer>
    </Layout>
  );
};

export default MainLayout;
