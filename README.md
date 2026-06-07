# PSI 进销存管理系统

PSI 是一个前后端分离的进销存管理系统，覆盖销售、采购、库存、权限和基础统计报表。项目适合作为中小企业进销存业务系统的基础版本，也可继续扩展审批流、退换货、财务凭证和正式数据库迁移体系。

Created by lifei.

## 功能模块

- 认证与权限：登录、注册、Token 校验、用户管理、角色管理、权限控制。
- 销售管理：销售报价、销售订单、销售发货、销售交付、销售应收、销售统计。
- 采购管理：采购申请、采购询价、供应商报价、采购比价、采购订单、采购收货、采购应付、采购统计。
- 库存管理：采购入库、库存盘点、生产领料、生产退料、成品入库、产品组装、产品拆解、序列号库存。
- 报表中心：销售报表、采购报表、库存报表、财务报表。
- 接口文档：Swagger/OpenAPI 在线文档。

## 业务流向

销售主链路：

```text
销售报价 -> 销售订单 -> 发货扣库存 -> 交付生成应收 -> 收款
```

采购主链路：

```text
采购申请 -> 采购询价 -> 供应商报价 -> 采购比价 -> 采购订单 -> 收货入库 -> 生成应付 -> 付款
```

库存主链路：

```text
入库/出库/盘点/领退料/组装拆解 -> 库存余额 -> 库存流水 -> 报表统计
```

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

## 数据库

后端默认连接本机 MySQL：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/psi
spring.datasource.username=root
spring.datasource.password=123456
```

配置文件：

```text
psi-behindend/src/main/resources/application.properties
```

为避免重启覆盖业务数据，后端启动时不会自动建库或重置数据。

首次安装空库时，手动执行完整初始化脚本：

```text
psi-behindend/src/main/resources/psi_database_init.sql
```

已有数据库升级时，先执行增量结构补丁，再按需执行幂等数据修复脚本：

```text
psi-behindend/src/main/resources/sql/schema_patch.sql
psi-behindend/src/main/resources/sql/data_normalization.sql
```

默认管理员账号：

```text
用户名：admin
密码：123456
```

## 启动项目

启动后端：

```bash
cd psi-behindend
mvn spring-boot:run
```

后端地址：

```text
http://localhost:8080
```

接口文档：

```text
http://localhost:8080/swagger-ui.html
```

启动前端：

```bash
cd psi-frontend
npm install
npm run dev
```

前端地址：

```text
http://localhost:5173
```

## 构建验证

后端编译：

```bash
cd psi-behindend
mvn -DskipTests compile
```

前端构建：

```bash
cd psi-frontend
npm run build
```

## 主要接口

- `/api/auth/*`
- `/api/quotations`
- `/api/orders`
- `/api/sales-receivables`
- `/api/statistics`
- `/api/purchase/requests`
- `/api/purchase/inquiries`
- `/api/purchase/quotations`
- `/api/purchase/comparisons`
- `/api/purchase/orders`
- `/api/purchase-payables`
- `/api/purchase/statistics`
- `/api/inventory-receipts`
- `/api/inventory-checks`
- `/api/material-requisitions`
- `/api/material-returns`
- `/api/product-receipts`
- `/api/product-assemblies`
- `/api/product-disassemblies`
- `/api/serial-number-inventory`
- `/api/serial-number-receipts`
- `/api/users`
- `/api/roles`
- `/api/permissions`

## 权限说明

权限码按 `模块:资源:动作` 命名。常用动作包括：

- `read`：查看数据
- `create`：创建数据
- `update`：修改数据
- `delete`：删除数据
- `view`：部分库存/生产模块沿用的查看权限

前端菜单和工作台会按当前用户权限动态展示，不会向普通销售、采购或仓管账号请求无权限模块的数据。

## 常见问题

登录提示“网络错误，请检查服务器连接”时，请确认：

- 后端服务已启动并监听 `8080` 端口。
- MySQL 已启动，账号密码与 `application.properties` 一致。
- 首次使用前已执行 `psi_database_init.sql`。
- 既有库升级已执行 `schema_patch.sql` 和必要的数据修复脚本。
- 前端请求地址仍为 `http://localhost:8080`。

接口返回 `401` 或 `403` 时，请重新登录，并检查当前用户角色是否拥有对应权限。
