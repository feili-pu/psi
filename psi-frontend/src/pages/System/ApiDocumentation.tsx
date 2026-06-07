import React from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { ApiOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';

const swaggerUrl = 'http://localhost:8080/swagger-ui.html';

const ApiDocumentation: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Card
      title={<><ApiOutlined /> API 文档</>}
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>刷新</Button>
          <Button icon={<ExportOutlined />} onClick={() => window.open('http://localhost:8080/v3/api-docs', '_blank')}>OpenAPI JSON</Button>
        </Space>
      }
    >
      <Typography.Paragraph type="secondary">
        当前页面直接加载后端 Swagger UI，请确保后端服务已在 8080 端口启动。
      </Typography.Paragraph>
      <iframe
        title="Swagger UI"
        src={swaggerUrl}
        style={{ width: '100%', height: 'calc(100vh - 220px)', border: '1px solid #f0f0f0', borderRadius: 6 }}
      />
    </Card>
  </div>
);

export default ApiDocumentation;
