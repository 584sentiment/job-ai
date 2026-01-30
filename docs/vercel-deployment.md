# Vercel 部署配置说明

> 参考项目：https://github.com/584sentiment/blog-pro
> 配置时间：2025-01-30

---

## 一、配置架构概述

本项目采用 **同构部署架构**，在单个 Vercel 项目中同时部署前端（Vue 3）和后端（Express）。

### 核心设计理念

- **统一域名**：前端和后端共享同一个域名，避免跨域问题
- **路由分离**：通过 `vercel.json` 的 `rewrites` 规则实现前后端路由分离
- **环境自适应**：本地开发和生产环境使用相同的 API 配置，自动适配

---

## 二、配置文件说明

### 1. 根目录 vercel.json（主配置）

**路径**：`/vercel.json`

**内容**：
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

**配置解析**：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `version` | 2 | Vercel 配置文件版本 |
| `rewrites[0]` | `/api/:path*` → `/backend/api/index.ts` | 所有 API 请求转发到 Express 后端 |
| `rewrites[1]` | `/:path*` → `/web/dist/index.html` | 所有其他请求返回前端入口文件 |
| `buildCommand` | 先构建后端，再构建前端 | 确保依赖正确编译 |
| `outputDirectory` | `web/dist` | 前端构建输出目录 |

---

### 2. 备份的旧配置文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `backend/vercel.json` | 重命名为 `backend/vercel.json.bak` | 使用废弃的 `builds` 和 `routes` 配置 |
| `web/vercel.json` | 重命名为 `web/vercel.json.bak` | 只有前端路由，缺少 API 转发规则 |

**注意**：这些备份文件可以删除，不影响部署。

---

### 3. web/.env.example（环境变量配置）

**关键配置**：
```env
VITE_API_BASE_URL=/api
```

**工作原理**：
- **本地开发**：Vite 代理将 `/api` 转发到 `http://localhost:8080`
- **Vercel 部署**：相对路径 `/api` 通过 `vercel.json` 转发到 `backend/api/index.ts`

**优势**：
- ✅ 无需修改代码即可适配不同环境
- ✅ 避免跨域问题（生产环境同源）
- ✅ 避免混合内容错误（HTTPS 页面请求 HTTPS API）

---

## 三、请求路由流程

### 1. 路由决策图

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

### 2. 请求示例

| 请求路径 | 匹配规则 | 目标文件 | 处理方式 |
|---------|---------|---------|---------|
| `/api/positions` | `/api/:path*` | `backend/api/index.ts` | Express 返回岗位列表 |
| `/api/positions/1` | `/api/:path*` | `backend/api/index.ts` | Express 返回岗位详情 |
| `/api/auth/login` | `/api/:path*` | `backend/api/index.ts` | Express 处理登录 |
| `/` | `/:path*` | `web/dist/index.html` | Vue Router 首页 |
| `/positions` | `/:path*` | `web/dist/index.html` | Vue Router 岗位列表页 |
| `/positions/1` | `/:path*` | `web/dist/index.html` | Vue Router 岗位详情页 |
| `/admin` | `/:path*` | `web/dist/index.html` | Vue Router 管理页 |

---

## 四、本地开发 vs 生产部署

### 1. 环境对比

| 环境 | 前端地址 | 后端地址 | API 基础 URL | 请求代理方式 |
|------|---------|---------|-------------|-------------|
| **本地开发** | `localhost:3000` | `localhost:8080` | `/api` | Vite 代理到 `localhost:8080` |
| **Vercel** | `your-app.vercel.app` | `your-app.vercel.app/api` | `/api` | Vercel rewrites 到 `backend/api/index.ts` |

### 2. 前端 API 调用代码

**示例**（`web/src/api/position.ts`）：
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const getPositions = async () => {
  const res = await fetch(`${API_BASE}/positions`);
  return res.json();
};
```

**本地开发**：
- `VITE_API_BASE_URL = '/api'`
- 实际请求：`http://localhost:3000/api/positions`
- Vite 代理转发到：`http://localhost:8080/api/positions`

**Vercel 部署**：
- `VITE_API_BASE_URL = '/api'`
- 实际请求：`https://your-app.vercel.app/api/positions`
- Vercel 转发到：`backend/api/index.ts`

---

## 五、部署到 Vercel

### 方式 1：通过 Vercel CLI（推荐用于测试）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署项目
vercel

# 4. 生产环境部署
vercel --prod
```

### 方式 2：通过 Vercel Dashboard（推荐用于正式部署）

#### Step 1: 导入 GitHub 仓库
1. 访问 https://vercel.com
2. 点击 **"Add New..."** → **"Project"**
3. 导入你的 GitHub 仓库

#### Step 2: 配置项目
在 **"Configure Project"** 页面：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Framework Preset** | Vite | Vercel 会自动检测 |
| **Build Command** | `cd backend && npm run build && cd ../web && npm run build` | 构建命令 |
| **Output Directory** | `web/dist` | 前端构建输出 |
| **Install Command** | `npm install` | 安装依赖 |

#### Step 3: 配置环境变量
在 **"Environment Variables"** 部分添加：

| 变量名 | 值 | 环境 | 说明 |
|--------|-----|------|------|
| `DATABASE_URL` | `file:./dev.db` 或 Turso URL | Production | 数据库连接 URL |
| `JWT_SECRET` | `your-secret-key-here` | Production | JWT 签名密钥 |
| `NODE_ENV` | `production` | Production | 环境标识 |
| `VITE_API_BASE_URL` | `/api` | Production | API 基础 URL（可选） |

**注意**：
- 如果使用本地 SQLite 数据库，`DATABASE_URL` 设置为 `file:./dev.db`
- 如果使用云数据库（如 Turso），设置对应的连接 URL

#### Step 4: 部署
点击 **"Deploy"** 按钮，等待部署完成（约 2-3 分钟）。

---

## 六、部署验证清单

### 1. 前端页面验证
- [ ] 首页可以正常访问（`https://your-app.vercel.app/`）
- [ ] Vue Router 路由正常工作（如 `/positions`, `/interviews`）
- [ ] 刷新页面不出现 404
- [ ] 页面样式正常加载

### 2. API 调用验证
- [ ] 获取岗位列表（`GET /api/positions`）
- [ ] 创建岗位（`POST /api/positions`）
- [ ] 更新岗位（`PUT /api/positions/:id`）
- [ ] 删除岗位（`DELETE /api/positions/:id`）
- [ ] 用户认证（`POST /api/auth/login`）

### 3. 跨域和认证验证
- [ ] 没有 CORS 错误
- [ ] JWT token 正常传递
- [ ] 受保护的 API 需要认证
- [ ] 认证失败返回 401

### 4. 控制台检查
打开浏览器开发者工具（F12），检查：
- [ ] 无 404 错误
- [ ] 无混合内容错误（Mixed Content）
- [ ] API 请求正确代理
- [ ] 响应数据格式正确

---

## 七、常见问题排查

### 问题 1: API 请求返回 404

**症状**：
```
GET https://your-app.vercel.app/api/positions 404
```

**原因**：`vercel.json` 路由配置错误

**解决方案**：
1. 检查根目录 `vercel.json` 是否存在
2. 检查 `rewrites` 规则是否正确：
   ```json
   {
     "source": "/api/:path*",
     "destination": "/backend/api/index.ts"
   }
   ```
3. 确认 `backend/api/index.ts` 文件存在
4. 重新部署项目

---

### 问题 2: CORS 错误

**症状**：
```
Access to fetch at 'https://your-app.vercel.app/api/positions' from origin 'https://your-app.vercel.app'
has been blocked by CORS policy
```

**原因**：后端 CORS 配置问题

**解决方案**：
检查 `backend/src/app.ts` 中的 CORS 配置，确保允许 `.vercel.app` 域名：

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'
  ],
  credentials: true
}));
```

---

### 问题 3: 前端刷新 404

**症状**：
- 访问 `https://your-app.vercel.app/positions` 正常
- 刷新页面后显示 404

**原因**：`vercel.json` 没有配置前端路由 fallback

**解决方案**：
确保 `vercel.json` 的第二条 `rewrites` 规则指向前端入口文件：

```json
{
  "source": "/:path*",
  "destination": "/web/dist/index.html"
}
```

---

### 问题 4: 构建失败

**症状**：
```
Error: Build failed with exit code 1
```

**原因**：`buildCommand` 路径错误

**解决方案**：
1. 检查 `buildCommand` 是否正确：
   ```json
   "buildCommand": "cd backend && npm run build && cd ../web && npm run build"
   ```
2. 确保后端和前端的 `package.json` 中都有 `build` 脚本
3. 本地测试构建命令：
   ```bash
   cd backend && npm run build && cd ../web && npm run build
   ```

---

### 问题 5: 环境变量未生效

**症状**：
- API 调用失败
- 数据库连接失败
- JWT 认证失败

**解决方案**：
1. 检查 Vercel Dashboard 中的环境变量是否正确配置
2. 确认环境变量在正确的环境（Production/Preview/Development）中设置
3. 重新部署项目（环境变量更改后需要重新部署）
4. 在 Vercel 部署日志中查看环境变量是否正确加载

---

## 八、进阶配置

### 1. 自定义域名

在 Vercel Dashboard 中：
1. 进入项目设置 → **Domains**
2. 添加自定义域名（如 `app.yourdomain.com`）
3. 配置 DNS 记录

### 2. 自动部署

配置 GitHub 集成后，每次推送到 `main` 分支会自动触发部署。

**推荐分支策略**：
- `main` 分支 → 生产环境
- `dev` 分支 → 预览环境

### 3. 数据库迁移到云数据库

**当前配置**：使用本地 SQLite 数据库（`file:./dev.db`）

**升级到 Turso（云数据库）**：

```bash
# 1. 安装 Turso CLI
npm install -g turso

# 2. 登录
turso auth login

# 3. 创建数据库
turso db create job-ai

# 4. 导入本地数据
cd backend/prisma
turso db shell job-ai < schema.sql

# 5. 获取连接信息
turso db show job-ai --url              # DATABASE_URL
turso db tokens create job-ai           # TURSO_AUTH_TOKEN

# 6. 在 Vercel 中配置环境变量
# DATABASE_URL = libsql://xxx.turso.io
# TURSO_AUTH_TOKEN = eyJhbGciOi...
```

---

## 九、对比 Blog-Pro 配置

| 项目 | 前端框架 | 后端框架 | 入口文件 | 构建命令 |
|------|---------|---------|---------|---------|
| **Blog-Pro** | React + Vite | Express | `/api/index.ts` | `npm run build` |
| **Job-AI** | Vue + Vite | Express | `/backend/api/index.ts` | `cd backend && npm run build && cd ../web && npm run build` |

**关键差异**：
1. **目录结构**：Blog-Pro 的 API 在根目录，Job-AI 在 `backend/` 目录
2. **构建命令**：Job-AI 需要分别构建后端和前端
3. **前端框架**：Blog-Pro 使用 React，Job-AI 使用 Vue

**相同点**：
1. 都使用 `vercel.json` 的 `rewrites` 实现路由分离
2. 都导出 Express app 供 Vercel 使用
3. 都使用环境变量实现 API 基础 URL 自适应

---

## 十、总结

### 核心优势

1. **部署简单**：一个项目，一个域名，一条命令
2. **成本低**：Vercel 免费额度足够个人项目使用
3. **开发体验好**：统一的 TypeScript 技术栈，热重载支持
4. **可扩展性强**：易于添加新功能，支持云数据库

### 参考资源

- **Blog-Pro 项目**：https://github.com/584sentiment/blog-pro
- **Vercel 文档**：https://vercel.com/docs
- **Turso 文档**：https://docs.turso.tech
- **Prisma LibSQL**：https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases/libsql

---

## 附录：配置文件清单

### 已修改文件

| 文件 | 状态 | 说明 |
|------|------|------|
| `/vercel.json` | ✅ 创建 | 根目录统一配置文件 |
| `/backend/vercel.json` | ✅ 备份 | 改为 `vercel.json.bak` |
| `/web/vercel.json` | ✅ 备份 | 改为 `vercel.json.bak` |
| `/web/.env.example` | ✅ 更新 | 完善部署说明 |

### 关键文件路径

- **Vercel 配置**：`/vercel.json`
- **后端入口**：`/backend/api/index.ts`
- **前端入口**：`/web/dist/index.html`
- **前端配置**：`/web/vite.config.js`
- **环境变量**：`/web/.env.example`

---

**最后更新**：2025-01-30
**配置版本**：v2.0
**维护者**：Claude Code
