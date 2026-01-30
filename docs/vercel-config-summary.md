# Vercel 配置修改总结

> 修改时间：2025-01-30
> 参考项目：https://github.com/584sentiment/blog-pro

---

## 修改概述

根据 Blog-Pro 项目的 Vercel 部署架构，对当前项目进行了配置优化，实现了**前后端同构部署**。

---

## 核心改进

### 1. 统一配置入口

**之前**：
- ❌ `backend/vercel.json` - 使用废弃的 `builds` 和 `routes` 配置
- ❌ `web/vercel.json` - 只有前端路由，缺少 API 转发规则
- ❌ 根目录无统一配置

**现在**：
- ✅ 根目录 `/vercel.json` - 统一的路由和构建配置
- ✅ 所有 API 请求自动转发到 Express 后端
- ✅ 所有其他请求返回 Vue 前端入口

---

## 配置对比

### vercel.json 对比

#### 旧配置（backend/vercel.json）
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/vercel.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/vercel.js"
    }
  ]
}
```

**问题**：
- 使用废弃的 `builds` 配置（Vercel 已不推荐）
- 没有前后端路由分离
- 没有前端 SPA 路由支持

#### 新配置（/vercel.json）
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/backend/api/index.ts"
    },
    {
      "source": "/:path*",
      "destination": "/web/dist/index.html"
    }
  ],
  "buildCommand": "cd backend && npm run build && cd ../web && npm run build",
  "outputDirectory": "web/dist"
}
```

**优势**：
- ✅ 使用推荐的 `rewrites` 配置
- ✅ 前后端路由自动分离
- ✅ 支持 Vue Router SPA 路由
- ✅ 统一的构建流程

---

## 路由工作原理

### 请求处理流程

```
用户请求
    │
    ▼
┌─────────────────────────────────────┐
│   根目录 vercel.json 路由判断        │
└─────────────────────────────────────┘
    │
    ├─→ 匹配 /api/:path*
    │   └─→ backend/api/index.ts
    │       └─→ Express 处理（返回 JSON）
    │
    └─→ 匹配 /:path*
        └─→ web/dist/index.html
            └─→ Vue Router 处理（返回页面）
```

### 示例请求

| 请求路径 | 路由匹配 | 目标 | 处理方式 |
|---------|---------|------|---------|
| `/api/positions` | `/api/:path*` | `backend/api/index.ts` | Express 返回岗位列表 |
| `/api/positions/1` | `/api/:path*` | `backend/api/index.ts` | Express 返回岗位详情 |
| `/` | `/:path*` | `web/dist/index.html` | Vue Router 首页 |
| `/positions` | `/:path*` | `web/dist/index.html` | Vue Router 岗位列表页 |
| `/positions/1` | `/:path*` | `web/dist/index.html` | Vue Router 岗位详情页 |

---

## 文件变更清单

### 新增文件

| 文件 | 说明 |
|------|------|
| `/vercel.json` | 根目录统一配置文件 |
| `/docs/vercel-deployment.md` | 详细的部署文档（10个章节） |
| `/backend/vercel.json.bak` | 旧配置备份 |
| `/web/vercel.json.bak` | 旧配置备份 |

### 修改文件

| 文件 | 修改内容 |
|------|---------|
| `/web/.env.example` | 完善部署说明，添加详细的注释 |

### 删除文件

| 文件 | 说明 |
|------|------|
| `/backend/vercel.json` | 已备份为 `.bak` |
| `/web/vercel.json` | 已备份为 `.bak` |

---

## 关键特性

### 1. 环境自适应

```typescript
// 前端 API 调用代码
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
```

**本地开发**：
- `VITE_API_BASE_URL = '/api'`
- Vite 代理转发到 `http://localhost:8080`

**Vercel 部署**：
- `VITE_API_BASE_URL = '/api'`
- Vercel 转发到 `backend/api/index.ts`

**优势**：无需修改代码，自动适配不同环境

### 2. 同源部署

**之前**：
- 前端：`https://your-app.vercel.app`
- 后端：`https://your-backend.vercel.app`（需要单独部署）

**现在**：
- 前端和后端：`https://your-app.vercel.app`
- API 路径：`https://your-app.vercel.app/api/*`

**优势**：
- ✅ 避免跨域问题
- ✅ 避免混合内容错误
- ✅ 简化部署流程

### 3. SPA 路由支持

**问题**：Vue Router 使用 `history` 模式，刷新页面会 404

**解决方案**：
```json
{
  "source": "/:path*",
  "destination": "/web/dist/index.html"
}
```

**效果**：所有路径都返回 `index.html`，由 Vue Router 处理路由

---

## 部署优势

### 与 Blog-Pro 对比

| 特性 | Blog-Pro | Job-AI |
|------|----------|--------|
| **前端框架** | React + Vite | Vue + Vite |
| **后端框架** | Express | Express |
| **API 入口** | `/api/index.ts` | `/backend/api/index.ts` |
| **前端入口** | `/index.html` | `/web/dist/index.html` |
| **数据库** | Prisma + Turso | Prisma + SQLite/Turso |
| **部署方式** | 同构部署 | 同构部署 |
| **路由分离** | ✅ | ✅ |
| **环境自适应** | ✅ | ✅ |

### 核心优势

1. **部署简单**
   - 一个 Git 仓库
   - 一个 Vercel 项目
   - 一条部署命令

2. **成本低**
   - Vercel 免费额度（100GB 带宽/月）
   - Turso 免费版（500 行读取/天）
   - 适合个人项目

3. **开发体验好**
   - 统一的 TypeScript 技术栈
   - 热重载支持
   - 类型安全

4. **可扩展性强**
   - 易于添加新功能
   - 支持云数据库升级
   - 支持自定义域名

---

## 下一步行动

### 1. 测试本地开发
```bash
# 后端（终端 1）
cd backend
npm run dev

# 前端（终端 2）
cd web
npm run dev

# 访问 http://localhost:3000
```

### 2. 部署到 Vercel

#### 方式 1：Vercel CLI
```bash
npm install -g vercel
vercel
```

#### 方式 2：Vercel Dashboard
1. 访问 https://vercel.com
2. 导入 GitHub 仓库
3. 配置环境变量
4. 点击 Deploy

### 3. 配置环境变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `file:./dev.db` | 数据库连接 URL |
| `JWT_SECRET` | `your-secret-key` | JWT 签名密钥 |
| `NODE_ENV` | `production` | 环境标识 |

### 4. 验证部署

参考 `/docs/vercel-deployment.md` 的**部署验证清单**。

---

## 参考资源

- **Blog-Pro 项目**：https://github.com/584sentiment/blog-pro
- **Vercel 文档**：https://vercel.com/docs
- **详细部署文档**：`/docs/vercel-deployment.md`

---

**修改完成时间**：2025-01-30
**配置版本**：v2.0
**提交哈希**：`3e559c0`
