import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import './App.css';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0f766e',
          colorInfo: '#2563eb',
          colorSuccess: '#16a34a',
          colorWarning: '#d97706',
          colorError: '#dc2626',
          colorText: '#111827',
          colorTextSecondary: '#64748b',
          colorBgLayout: '#f4f7f6',
          borderRadius: 6,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        },
        components: {
          Button: {
            borderRadius: 6,
            controlHeight: 36,
            primaryShadow: 'none'
          },
          Card: {
            borderRadiusLG: 8,
            boxShadowTertiary: '0 8px 24px rgba(15, 23, 42, 0.06)'
          },
          Input: {
            borderRadius: 6,
            controlHeight: 38
          },
          Select: {
            borderRadius: 6,
            controlHeight: 38
          },
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#334155',
            rowHoverBg: '#f1f5f9'
          }
        }
      }}
    >
      <AuthProvider>
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
