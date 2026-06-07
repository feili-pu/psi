# PSI 进销存管理系统

这是一个前后端分离的 PSI（采购、销售、库存）管理系统。后端基于 Spring Boot + MyBatis + MySQL，前端基于 React + TypeScript + Vite + Ant Design。

## 功能模块

- 登录、注册、验证码发送、密码重置、Token 校验
- 销售报价、销售订单、销售统计报表
- 采购申请、采购询价、供应商报价、采购比价、采购订单、采购应付、采购统计报表
- 库存入库、库存盘点、物料领用、物料退库、产品入库、产品组装、产品拆解
- 序列号库存、序列号入库
- 用户、角色、权限管理
- Swagger/OpenAPI 在线接口文档

## 技术栈

后端：

- Java 8+
- Spring Boot 2.7.18
- MyBatis
- MySQL 8
- JWT
- Spring Security Crypto
- springdoc-openapi

前端：

- React 19
- TypeScript 5
- Vite 7
- Ant Design 6
- dayjs

## 目录结构

```text
psi
├── psi-behindend      # Spring Boot 后端
├── psi-frontend       # React 前端
└── README.md
```

## 环境要求

- JDK 8 或更高版本
- Maven 3.6+
- Node.js 20+
- MySQL 8+

## 数据库配置

后端默认连接本机 MySQL：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/psi
spring.datasource.username=root
spring.datasource.password=123456
```

配置文件位于：

```text
psi-behindend/src/main/resources/application.properties
```

系统启动时会自动执行：

```text
psi-behindend/src/main/resources/psi_database_init.sql
```

默认管理员账号：

```text
用户名：admin
密码：123456
```

## 启动后端

```bash
cd psi-behindend
mvn spring-boot:run
```

后端默认地址：

```text
http://localhost:8080
```

接口文档：

```text
http://localhost:8080/swagger-ui.html
```

## 启动前端

```bash
cd psi-frontend
npm install
npm run dev
```

前端默认地址：

```text
http://localhost:5173
```

## 构建验证

前端构建：

```bash
cd psi-frontend
npm run build
```

后端编译：

```bash
cd psi-behindend
mvn -DskipTests compile
```

## 接口说明

前端服务默认请求：

```text
http://localhost:8080
```

主要真实接口已经接入：

- `/api/auth/*`
- `/api/quotations`
- `/api/orders`
- `/api/purchase/requests`
- `/api/purchase/inquiries`
- `/api/purchase/quotations`
- `/api/purchase/comparisons`
- `/api/purchase/orders`
- `/api/purchase-payables`
- `/api/inventory-receipts`
- `/api/inventory-checks`
- `/api/material-requisitions`
- `/api/material-returns`
- `/api/product-receipts`
- `/api/product-assemblies`
- `/api/product-disassemblies`
- `/api/serial-number-inventory`
- `/api/serial-number-receipts`
- `/api/statistics`
- `/api/purchase/statistics`

## 本次修复重点

- 修复销售报价/订单、采购订单等新建后状态为空的问题，后端创建时会自动写入默认状态。
- 修复采购订单确认、生产、发货、收货、完成、取消等流程接口映射。
- 采购申请、询价、供应商报价、采购比价、采购应付改为调用后端真实接口。
- 库存相关页面统一接入后端真实接口，不再使用页面内模拟数据。
- 注册、验证码发送、重置密码改为调用后端接口。
- API 文档页改为加载后端 Swagger UI。
- 修复销售统计、采购统计权限码和数据库权限码不一致导致的访问问题。
- 前端主布局支持内容区滚动，避免左侧菜单和右侧内容过长时无法下拉。

## 常见问题

如果登录提示“网络错误，请检查服务器连接”，请确认：

- 后端服务已启动并监听 `8080` 端口。
- MySQL 已启动，账号密码与 `application.properties` 一致。
- 前端请求地址仍为 `http://localhost:8080`。

如果接口返回 401 或 403，请重新登录，并检查当前用户角色是否拥有对应权限。
