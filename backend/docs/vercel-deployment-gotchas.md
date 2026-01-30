# Vercel 部署踩坑总结

> 本文档记录了求职追踪助手后端项目在 Vercel 部署过程中遇到的问题及解决方案，供后续参考。

**更新时间**: 2026-01-30
**项目**: job-ai-backend (Node.js + Express + Prisma + PostgreSQL)
**部署平台**: Vercel
**数据库**: Supabase PostgreSQL

---

## 目录

1. [ES 模块导入错误](#坑一es-模块导入错误)
2. [数据库连接失败](#坑二数据库连接失败)
3. [最佳实践建议](#最佳实践建议)
4. [参考资源](#参考资源)

---

## 坑一：ES 模块导入错误

### 问题描述

部署后访问 API，返回 500 错误：

```
Error: Cannot find module '/var/task/backend/dist/app'
Import hint: Do you know that ES modules can only import .js, .mjs, or .wasm files?
```

### 根本原因

1. **`package.json` 中设置了 `"type": "module"`**，表示项目使用 ES 模块
2. **TypeScript 编译输出的 `.js` 文件**，但代码中使用了 `import` 语句
3. **Node.js 运行时在查找模块时**，按照 ES 模块规则解析，导致找不到正确的入口文件

### 错误配置

```json
// package.json
{
  "type": "module",  // ❌ 与 CommonJS 冲突
  "main": "dist/app.js"
}
```

```javascript
// vercel.json
{
  "builds": [
    {
      "src": "dist/app.js",  // ❌ 错误的入口路径
      "use": "@vercel/node"
    }
  ]
}
```

### 解决方案

#### 方案 1：移除 `"type": "module"`（推荐）

```json
// package.json
{
  "main": "dist/app.js"  // ✅ 使用 CommonJS
}
```

```javascript
// vercel.json
{
  "builds": [
    {
      "src": "dist/app.js",  // ✅ 正确的入口路径
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/app.js"  // ✅ 路由到正确的入口
    }
  ]
}
```

#### 方案 2：使用 `.mjs` 扩展名

如果想继续使用 ES 模块，需要：

1. **移除 `"type": "module"`**
2. **将入口文件改为 `.mjs` 扩展名**
3. **更新 `vercel.json` 配置**

```json
// package.json
{
  "main": "dist/app.mjs"
}
```

```javascript
// vercel.json
{
  "builds": [
    {
      "src": "dist/app.mjs",
      "use": "@vercel/node"
    }
  ]
}
```

### 最终采用方案

**移除 `"type": "module"`**，使用 CommonJS 规范：

```diff
// package.json
{
- "type": "module",
  "main": "dist/app.js"
}
```

### 验证方法

```bash
# 本地构建验证
npm run build

# 检查入口文件是否存在
ls -la dist/app.js

# 本地测试（使用 Vercel CLI）
vercel dev
```

---

## 坑二：数据库连接失败

### 问题描述

部署成功，但调用 API 返回错误：

```
Invalid `prisma.user.findUnique()` invocation:

Can't reach database server at `db.wwrljcwcadsckdghmexm.supabase.co:5432`

Please make sure your database server is running at `db.wwrljcwcadsckdghmexm.supabase.co:5432`.
```

### 根本原因

1. **使用了 Supabase 直连模式**（Direct connection，端口 5432）
2. **Vercel Serverless 环境特点**：
   - 每个函数执行时间短（最多 10 秒）
   - 并发请求可能很多
   - 频繁创建和销毁连接
3. **直连模式的问题**：
   - 每个请求创建新的数据库连接
   - 很快耗尽 Supabase 的连接数限制（免费版 60 个）
   - 导致 "Can't reach database server" 错误

### 错误配置

```bash
# ❌ 直连模式（端口 5432）
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

### 解决方案

#### 使用 Supabase 连接池模式（Transaction mode）

**步骤 1：获取连接池连接字符串**

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目 → **Settings** → **Database**
3. 找到 **Connection Pooling** 部分
4. 选择 **Transaction mode**
5. 复制 **URI** 格式的连接字符串

**正确格式**：

```bash
# ✅ 连接池模式（端口 6543）
DATABASE_URL="postgresql://postgres.ref:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

**关键特征**：
- 主机名包含 `pooler.supabase.com`
- 端口是 `6543`（不是 5432）
- 项目引用（ref）在 `postgres.` 后面

**步骤 2：更新 Vercel 环境变量**

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. 找到 `DATABASE_URL`，点击 **Edit**
3. 粘贴新的连接字符串
4. 选择所有环境
5. 点击 **Save**

**步骤 3：重新部署**

```bash
# 方法 1：Vercel Dashboard
# Deployments → 选择最新部署 → Redeploy

# 方法 2：Git 推送触发
git add .
git commit -m "fix: 使用 Supabase 连接池模式"
git push origin main

# 方法 3：Vercel CLI
vercel --prod
```

### 连接模式对比

| 特性 | 直连模式 (5432) | 连接池模式 (6543) |
|------|----------------|------------------|
| **连接复用** | ❌ 每次请求新建连接 | ✅ 连接复用 |
| **适用场景** | 长生命周期应用 | Serverless 函数 |
| **连接数限制** | 容易耗尽 | 有效控制 |
| **性能** | 稳定连接时更快 | 短请求更快 |
| **推荐平台** | VPS / 传统服务器 | Vercel / AWS Lambda |

### Prisma Schema 配置

确保 `prisma/schema.prisma` 配置正确：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // ✅ 使用环境变量，无需硬编码
}
```

### 验证方法

```bash
# 测试数据库连接
curl https://your-app.vercel.app/api/health

# 查看 Vercel 函数日志
# Vercel Dashboard → Deployments → Function Logs
```

---

## 最佳实践建议

### 1. 项目配置

#### package.json

```json
{
  "name": "job-ai-backend",
  "version": "1.0.0",
  "main": "dist/app.js",
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "vercel-build": "npm run build"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "express": "^4.18.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "builds": [
    {
      "src": "dist/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/dist/app.js"
    }
  ]
}
```

### 2. 环境变量管理

#### 必需的环境变量

```bash
# 数据库连接（使用连接池模式）
DATABASE_URL="postgresql://postgres.ref:password@aws-0-xx.pooler.supabase.com:6543/postgres"

# JWT 密钥
JWT_SECRET="your-super-secret-jwt-key"

# 运行环境
NODE_ENV="production"

# CORS 允许的前端域名
CORS_ORIGIN="https://your-app.vercel.app"

# AI API 密钥（可选）
DEEPSEEK_API_KEY="sk-xxx"
```

#### 环境变量配置步骤

1. **Vercel Dashboard → Settings → Environment Variables**
2. **添加所有必需的变量**
3. **选择适用环境**（Production / Preview / Development）
4. **保存后重新部署**

### 3. 数据库连接池配置

#### Prisma 连接池配置

```javascript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Prisma 推荐在 serverless 环境使用单例模式
const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
```

#### 连接池参数（可选）

如果需要更精细的控制，可以在 `DATABASE_URL` 中添加连接池参数：

```bash
DATABASE_URL="postgresql://postgres.ref:password@aws-0-xx.pooler.supabase.com:6543/postgres?connection_limit=10&pool_timeout=20"
```

**参数说明**：
- `connection_limit`: 连接池大小（默认 10）
- `pool_timeout`: 连接超时时间（秒）
- `connect_timeout`: 连接建立超时（秒）

### 4. 错误监控与日志

#### 启用 Prisma 查询日志

```javascript
// 仅在开发环境启用
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
});
```

#### Vercel 函数日志

1. **Vercel Dashboard → Deployments → Function Logs**
2. 查看实时日志流
3. 过滤错误级别

#### 结构化日志输出

```javascript
// src/utils/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      ...meta,
      timestamp: new Date().toISOString(),
    }));
  },
  error: (message: string, error?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message || error,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
    }));
  },
};
```

### 5. 部署前检查清单

- [ ] **代码检查**
  - [ ] TypeScript 编译无错误（`npm run build`）
  - [ ] 移除 `console.log` 或使用日志工具
  - [ ] 环境变量已添加到 `.gitignore`

- [ ] **配置检查**
  - [ ] `vercel.json` 配置正确
  - [ ] `package.json` 的 `main` 字段正确
  - [ ] 移除 `"type": "module"` 或使用 `.mjs`

- [ ] **环境变量检查**
  - [ ] `DATABASE_URL` 使用连接池模式（端口 6543）
  - [ ] `JWT_SECRET` 已设置强随机值
  - [ ] `CORS_ORIGIN` 包含前端域名
  - [ ] 所有环境变量已添加到 Vercel

- [ ] **数据库检查**
  - [ ] Supabase 项目处于 Active 状态
  - [ ] 数据库迁移已运行（`prisma migrate deploy`）
  - [ ] Prisma Client 已生成（`prisma generate`）

- [ ] **部署后验证**
  - [ ] 访问健康检查端点
  - [ ] 测试主要 API 功能
  - [ ] 检查函数日志无错误
  - [ ] 测试数据库连接正常

### 6. 性能优化建议

#### 减少冷启动时间

```javascript
// ❌ 不好：每次请求都创建新实例
export async function handler(req, res) {
  const prisma = new PrismaClient();  // 冷启动慢
  // ...
}

// ✅ 好：使用单例模式
import prisma from './lib/prisma';
export async function handler(req, res) {
  // prisma 实例已初始化，响应快
}
```

#### 使用 Vercel 缓存

```javascript
// 对于不经常变化的数据，使用缓存
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  // ...
}
```

#### 优化数据库查询

```javascript
// ❌ 不好：N+1 查询
const users = await prisma.user.findMany();
for (const user of users) {
  user.positions = await prisma.position.findMany({
    where: { userId: user.id },
  });
}

// ✅ 好：使用 include 或 join
const users = await prisma.user.findMany({
  include: {
    positions: true,
  },
});
```

---

## 参考资源

### 官方文档

- [Vercel - Deployment Configuration](https://vercel.com/docs/configuration)
- [Vercel - Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel - Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vercel - Connection Pooling with Functions](https://vercel.com/kb/guide/connection-pooling-with-functions)
- [Supabase - Connection Pooling](https://supabase.com/docs/guides/platform/connecting-to-postgres#connection-pooler)
- [Prisma - Deployment](https://www.prisma.io/docs/guides/deployment)

### 社区资源

- [Vercel Community - Supabase Connection Issues](https://community.vercel.com/t/issue-with-vercel-connection-to-supabase/26876)
- [Stack Overflow - Can't reach database server](https://stackoverflow.com/questions/77990019/cant-reach-database-server-at-aws-0-us-east-1-pooler-supabase-com5432)
- [Database Connection Pool Exhaustion During Vercel Build](https://forum.plasmic.app/t/database-connection-pool-exhaustion-during-vercel-build/11141)

### 工具推荐

- **Vercel CLI**: `npm i -g vercel`
- **Prisma Studio**: `npx prisma studio`
- **环境变量管理**: [dotenv](https://www.npmjs.com/package/dotenv)
- **日志工具**: [winston](https://www.npmjs.com/package/winston) 或 [pino](https://www.npmjs.com/package/pino)

---

## 总结

Vercel 部署 Node.js + Prisma + Supabase 项目时，最关键的两个配置：

1. **ES 模块配置**：移除 `"type": "module"` 或使用 `.mjs` 扩展名
2. **数据库连接池**：必须使用 Supabase 连接池模式（端口 6543）

遵循本文档的最佳实践，可以避免 90% 的常见部署问题。

---

**文档维护**: 如遇到新的坑或解决方案，请及时更新本文档。
