# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

求职追踪助手是一款**全栈求职管理应用**，采用 **Monorepo 架构**（pnpm workspace），包含**Web 前端**、**后端服务**和**微信小程序**三个独立模块。

### 架构图

```
job-ai/ (Monorepo)
├── web/              # Vue 3 前端 (端口 5173)
├── backend/          # Express + Prisma 后端 (端口 3001)
├── miniprogram/      # 微信小程序（独立运行，本地存储）
├── packages/shared/  # 共享类型和工具（工作空间依赖）
├── docs/             # 项目文档（按分类输出）
└── scripts/          # 工具脚本
```

### 三大模块职责

| 模块 | 技术栈 | 端口 | 数据源 |
|------|--------|------|--------|
| **Web** | Vue 3 + Vite + Pinia | 5173 | 后端 API (`/api`) |
| **Backend** | Express + Prisma + TypeScript | 3001 | PostgreSQL |
| **Miniprogram** | 原生微信小程序 | - | 本地存储 |

---

## 快速开始

### 一次性设置

```bash
# 1. 安装所有依赖（pnpm 会自动处理工作空间）
pnpm install

# 2. 配置后端环境变量
cd backend
cp .env.example .env
# 编辑 .env，设置 DATABASE_URL、JWT_SECRET、PORT

# 3. 初始化数据库
cd backend
npm run prisma:push    # 推送 schema 到数据库
npm run prisma:seed    # 填充种子数据（可选）
```

### 启动开发服务器

```bash
# 终端 1 - 启动后端（端口 3001）
cd backend && npm run dev

# 终端 2 - 启动前端（端口 5173）
cd web && npm run dev

# 终端 3 - 启动小程序（使用微信开发者工具）
# 打开 miniprogram/ 目录
```

访问：`http://localhost:5173`

---

## 架构关键点

### 1. Monorepo 与类型共享

项目使用 **pnpm workspace** 管理依赖，`packages/shared/` 包存放前后端共享的 TypeScript 类型和工具函数。

**依赖引用**：
```json
// web/package.json 和 backend/package.json
{
  "dependencies": {
    "@job-ai/shared": "workspace:*"  // 工作空间依赖
  }
}
```

**导入共享类型**：
```typescript
import type { Position, Interview, User } from '@job-ai/shared'
```

### 2. 数据模型与类型同步

**Prisma Schema 是数据源的单一真相来源**（`backend/prisma/schema.prisma`）。

**修改数据模型的完整流程**：
```bash
# 1. 修改 backend/prisma/schema.prisma
# 2. 重新生成 Prisma Client
cd backend && npm run prisma:generate

# 3. 更新 packages/shared/src/types/ 中的类型定义
#    手动同步 Prisma schema 的变更

# 4. 重新构建 shared 包
cd packages/shared && npm run build

# 5. Web 和 Backend 会自动获取最新类型
```

**类型同步规则**：
- 新增/修改字段时，必须同步更新 `packages/shared/src/types/`
- Prisma 使用 `camelCase`（如 `companyName`），新功能统一使用此规范
- 历史遗留字段映射：`company` → `companyName`（已在 Prisma 中统一）

### 3. API 调用链路

```
Web Frontend (Vue) → API Module (src/api/*.ts) → Backend API (routes/*.ts) → Controller → Service → Prisma → PostgreSQL
```

**BaseURL 配置**（`web/src/api/`）：
- 开发环境：`http://localhost:3001/api`
- 生产环境：从环境变量 `VITE_API_BASE_URL` 读取

**API 路由结构**（后端）：
| 路由 | 功能 | 文件 |
|------|------|------|
| `/api/auth/*` | 用户认证（注册/登录） | `auth.routes.ts` |
| `/api/user/*` | 用户信息管理 | `user.routes.ts` |
| `/api/positions/*` | 岗位管理 | `position.routes.ts` |
| `/api/interviews/*` | 面试管理 | `interview.routes.ts` |
| `/api/experiences/*` | 面经管理 | `experience.routes.ts` |
| `/api/summaries/*` | 总结管理 | `summary.routes.ts` |
| `/api/comments/*` | 评论管理 | `comment.routes.ts` |
| `/api/ai/*` | AI 功能 | `ai.routes.ts` |

### 4. 认证与安全

**JWT 认证流程**：
1. 用户登录 → 后端验证密码 → 签发 JWT Token
2. 前端存储 Token（localStorage）→ 每次请求在 Header 中携带
3. 后端中间件验证 Token → 解析 userId → 注入到 `req.user`

**CORS 配置**（`backend/src/app.ts`）：
- 开发环境：允许 `localhost`、`127.0.0.1`、`[::1]`
- 生产环境：检查白名单（`CORS_ORIGIN` 环境变量）或允许 `.vercel.app`、`.100million.top` 域名

---

## 开发工作流

### 添加新功能（需要 API）

**示例：添加"岗位收藏"功能**

```bash
# 1. Backend - 添加路由和控制器
backend/src/routes/position.routes.ts      # 添加 POST /api/positions/:id/collect
backend/src/controllers/position.controller.ts  # 实现业务逻辑

# 2. Shared - 添加类型定义
packages/shared/src/types/index.ts         # 添加响应类型

# 3. Web - 添加 API 调用
web/src/api/position.ts                    # 添加 collectPosition() 函数

# 4. Web - 调用 API
web/src/views/JobDetail.vue                # 调用 API 并更新 UI
```

### 添加纯前端功能

```bash
# 仅需修改 Web 端
web/src/views/NewPage.vue                  # 新页面
web/src/router/index.js                    # 添加路由
web/src/components/NewComponent.vue        # 新组件
```

### 添加纯后端功能

```bash
# 仅需修改 Backend 端
backend/src/routes/newFeature.routes.ts    # 新路由
backend/src/controllers/newFeature.controller.ts  # 新控制器
backend/src/services/newFeature.service.ts # 新服务层
```

### 修改数据模型

```bash
# 1. 修改 Prisma Schema
backend/prisma/schema.prisma               # 添加/修改 model

# 2. 重新生成 Prisma Client
cd backend && npm run prisma:generate

# 3. 更新共享类型
packages/shared/src/types/index.ts         # 同步类型定义

# 4. 推送变更到数据库
cd backend && npm run prisma:push

# 5. 更新前后端使用该模型的代码
#    Backend: controllers, services
#    Web: stores, views
```

---

## 关键命令

### 根目录（不推荐使用，建议进入子目录操作）
```bash
npm run dev         # 启动前端开发服务器
npm run build       # 构建整个项目
```

### Web 前端
```bash
cd web
npm run dev              # 开发模式（热重载）
npm run build            # 构建生产版本
npm run type-check       # TypeScript 类型检查
npm run preview          # 预览构建结果
```

### Backend 后端
```bash
cd backend
npm run dev              # 开发模式（热重载）
npm run build            # 构建生产版本
npm start                # 启动生产服务

# Prisma 相关
npm run prisma:generate  # 生成 Prisma Client
npm run prisma:push      # 推送 schema 到数据库（开发环境）
npm run prisma:migrate   # 运行数据库迁移（生产环境）
npm run prisma:studio    # 打开 Prisma Studio（可视化工具）
npm run prisma:seed      # 填充种子数据
```

### Shared 包
```bash
cd packages/shared
npm run build            # 构建共享类型包
npm run watch            # 监听模式（自动重新构建）
```

### 小程序
```bash
# 使用微信开发者工具打开 miniprogram/ 目录
node scripts/download-icons.js  # 下载图标资源（可选）
```

---

## 环境变量配置

### Backend 环境变量（`backend/.env`）

```env
# 必需
DATABASE_URL="postgresql://user:password@localhost:5432/job_ai"  # 数据库连接 URL
JWT_SECRET="your-secret-key"  # JWT 密钥（任意字符串）
PORT=3001                     # 服务端口

# 可选
NODE_ENV=development          # 环境：development/production
CORS_ORIGIN="http://localhost:5173,https://your-domain.com"  # CORS 白名单（逗号分隔）
```

### Web 环境变量（`web/.env`）

```env
VITE_API_BASE_URL="http://localhost:3001/api"  # API Base URL
```

---

## 调试与故障排查

### 端口和 URL

| 服务 | URL | 说明 |
|------|-----|------|
| Web 前端 | `http://localhost:5173` | Vite 默认端口 |
| Backend API | `http://localhost:3001` | 后端服务端口 |
| API 健康检查 | `http://localhost:3001/api/health` | 返回 `{"status":"ok"}` |
| Prisma Studio | 运行 `npm run prisma:studio` 后自动打开 | 数据库可视化工具 |

### 常见问题

**问题 1：前端无法连接后端 API**
- 检查后端是否启动：`curl http://localhost:3001/api/health`
- 检查 `web/.env` 中的 `VITE_API_BASE_URL` 是否正确
- 检查后端 CORS 配置是否允许前端域名

**问题 2：Prisma Client 生成失败**
```bash
cd backend
rm -rf node_modules/.prisma  # 删除旧的 Prisma Client
npm run prisma:generate       # 重新生成
```

**问题 3：TypeScript 类型不匹配**
- 确认 `packages/shared` 已构建：`cd packages/shared && npm run build`
- 重启 TypeScript 服务器（VSCode：`Cmd+Shift+P` → "TypeScript: Restart TS Server"）

**问题 4：数据库连接失败**
- 检查 `backend/.env` 中的 `DATABASE_URL` 是否正确
- 确认 PostgreSQL 服务是否运行：`psql postgresql://user:password@localhost:5432/job_ai`
- 本地开发可使用 Docker 运行 PostgreSQL：
  ```bash
  docker run -d --name job-ai-db \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=job_ai \
    -p 5432:5432 \
    postgres:16
  ```

---

## 数据库操作

### 查看和编辑数据
```bash
cd backend
npm run prisma:studio
# 自动打开浏览器，可视化操作数据库
```

### 重置数据库（⚠️ 会删除所有数据）
```bash
cd backend
npm run prisma:migrate reset  # 删除所有数据并重新运行迁移
npm run prisma:seed           # 重新填充种子数据
```

### 仅推送 schema 变更（不删除数据）
```bash
cd backend
npm run prisma:push  # 开发环境推荐
```

### 查看数据库迁移历史
```bash
cd backend
# 查看迁移文件
ls -la prisma/migrations/
```

---

## 文档管理规范

### 🚨 重要纪律

1. **禁止随意添加文档**
   - 不要在根目录添加 `xxx指南.md`、`xxx说明.md`、`xxx教程.md`
   - 不要创建无用的 README 或临时文档后不删除

2. **保持目录整洁**
   - 根目录只保留必要的配置文件和指向 `/docs` 的说明
   - 临时文档必须在完成任务后立即删除

3. **工作记录分类输出**
   - 所有开发记录必须输出到 `/docs/` 目录下的对应文档
   - 不得随意创建新的记录文档

### 文档分类说明

项目文档统一存放在 `/docs/` 目录，按以下分类：

| 文档 | 用途 | 使用场景 |
|------|------|----------|
| `/docs/arch-design.md` | 架构设计文档 | 记录架构决策、设计思路、技术选型 |
| `/docs/dev-progress.md` | 开发进度文档 | 记录每次功能开发完成情况 |
| `/docs/bug-fix.md` | 问题修复日志 | 记录遇到的 Bug 和解决方案 |

**文档更新原则**：
- 尽量使用现有文档文件，不要创建新的
- 每次更新必须标注时间（YYYY-MM-DD）
- 保持简洁，使用清晰的章节结构

### 临时文档处理

**开发过程中**：
- 可以创建临时文档（如 `TODO.md`、`test.md`）
- 但必须在完成任务后立即删除

**示例流程**：
```bash
# 1. 创建临时文档记录思路
echo "# 某功能开发思路" > tmp-idea.md

# 2. 完成开发后，整理并输出到 /docs/dev-progress.md
# 删除临时文档
rm tmp-idea.md
```

---

## Git 提交规范

每个功能实现完成后必须进行 commit。

**Commit Message 格式**：
```
<类型>: <模块>/<功能>: <简要描述>
```

**示例**：
- `feat: backend/api/positions: 实现岗位收藏功能`
- `feat: web/views/JobDetail: 添加收藏按钮`
- `fix: backend/auth: 修复 JWT 验证中间件问题`
- `refactor: packages/shared/types: 统一岗位字段命名`
- `docs: 更新开发进度文档`

**Commit 类型**：
- `feat`: 新功能
- `fix`: Bug 修复
- `refactor`: 代码重构
- `docs`: 文档更新
- `test`: 测试相关
- `chore`: 构建/工具链相关
- `opt`: 优化

**Commit 后操作**：
1. 更新 `/docs/dev-progress.md`（记录功能完成情况）
2. 如有设计变更，更新 `/docs/arch-design.md`
3. 如遇到问题，记录到 `/docs/bug-fix.md`

---

## 技术栈总结

### Web 前端
- Vue 3 (Composition API + `<script setup>`)
- Vite（构建工具）
- TypeScript
- Pinia（状态管理）
- Vue Router 4（路由）
- Tailwind CSS（样式）
- Naive UI + Headless UI（组件库）
- Tiptap（富文本编辑器）

### Backend 后端
- Express.js（框架）
- TypeScript
- Prisma（ORM）
- PostgreSQL（数据库）
- JWT + bcryptjs（认证）
- Winston（日志）
- Helmet + CORS + Rate Limiting（安全）

### Miniprogram 小程序
- 原生微信小程序（WXML + WXSS + JavaScript）
- 本地存储（wx.setStorage/wx.getStorage）
- AI 功能为模拟响应（预留真实 API 接口）

### DevOps
- pnpm（包管理器，支持 workspace）
- Docker（容器化部署）
- TypeScript（类型系统）

---

## 参考资源

### 产品需求
- **PRD**：`求职追踪助手微信小程序产品需求文档（PRD）.md`（根目录）

### 页面原型
- **目录**：`prototype/` - HTML 原型（设计参考）
- **注意**：HTML 文件仅为设计参考，不是实际源代码

### 部署文档
- **Docker 部署**：查看 `docker-compose.yml` 配置
- **其他部署方式**：参考 `/docs/` 目录下的部署指南

---

## 功能完成检查清单

每个功能完成后执行：

- [ ] 代码已实现所有功能点
- [ ] 代码已 commit（使用规范的 commit message）
- [ ] 更新 `/docs/dev-progress.md`（记录功能完成情况）
- [ ] 如有设计变更，更新 `/docs/arch-design.md`
- [ ] 如遇到问题，记录到 `/docs/bug-fix.md`
- [ ] 删除所有临时文档
- [ ] 基本测试通过，无明显错误
