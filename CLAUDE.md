# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

求职追踪助手是一款**全栈求职管理应用**，包含**Web前端**、**后端服务**和**微信小程序**三个部分，聚焦"岗位记录-进度追踪-面经收集-面试总结"全流程求职管理。

### 项目结构

```
job-ai/
├── web/              # Web 前端 (Vue 3 + TypeScript + Vite)
├── backend/          # 后端服务 (Express + TypeScript + Prisma)
├── miniprogram/      # 微信小程序 (原生小程序)
├── api/              # Vercel Serverless API 入口
├── docs/             # 项目文档
├── prototype/        # 页面原型设计
└── scripts/          # 工具脚本
```

---

## 一、Web 前端 (`web/`)

### 技术栈
- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **语言**: TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI 组件**: Naive UI + Headless UI
- **样式**: Tailwind CSS
- **富文本编辑器**: Tiptap

### 目录结构
```
web/
├── src/
│   ├── api/              # API 请求模块
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── constants/        # 常量定义
│   ├── router/           # 路由配置
│   ├── store/            # Pinia 状态管理
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### 主要页面
- `Login.vue` - 登录页
- `Register.vue` - 注册页
- `JobList.vue` - 岗位列表
- `JobDetail.vue` - 岗位详情
- `Interviews.vue` - 面试列表
- `Experiences.vue` - 面经列表
- `AddExperience.vue` - 添加面经
- `ExperienceDetail.vue` - 面经详情
- `Summaries.vue` - 总结列表
- `AddSummary.vue` - 添加总结
- `SummaryDetail.vue` - 总结详情
- `AIAssistant.vue` - AI 助手
- `Profile.vue` - 个人中心

### 常用命令
```bash
# 进入前端目录
cd web

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check

# 预览构建结果
npm run preview

# GitHub Pages 构建
npm run build:github
```

### API 调用
Web 端通过 `/src/api/` 目录下的模块调用后端接口：

```javascript
import { getJobs, createJob, updateJob } from '@/api/position';

// 获取岗位列表
const jobs = await getJobs({ status: 'applied' });

// 创建岗位
const job = await createJob({ company: '字节跳动', position: '前端工程师' });
```

---

## 二、后端服务 (`backend/`)

### 技术栈
- **框架**: Express.js
- **语言**: TypeScript
- **ORM**: Prisma
- **数据库**: PostgreSQL (本地 Docker 或云端 Supabase)
- **认证**: JWT + bcrypt
- **日志**: Winston
- **安全**: Helmet + CORS + Rate Limiting

### 目录结构
```
backend/
├── src/
│   ├── config/          # 配置文件
│   ├── constants/       # 常量定义
│   ├── controllers/     # 控制器
│   ├── middlewares/     # 中间件
│   ├── routes/          # 路由定义
│   ├── services/        # 业务逻辑
│   ├── types/           # TypeScript 类型
│   ├── utils/           # 工具函数
│   ├── app.ts           # Express 应用配置
│   └── index.ts         # 服务入口
├── prisma/
│   ├── schema.prisma    # 数据库模型定义
│   └── seed.ts          # 数据库种子数据
├── dist/                # 编译输出
├── logs/                # 日志文件
├── API.md               # API 文档
└── package.json
```

### API 路由
后端提供以下 API 路由（前缀 `/api`）：

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

### 常用命令
```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务
npm start

# Prisma 相关
npm run prisma:generate   # 生成 Prisma Client
npm run prisma:push       # 推送 schema 到数据库
npm run prisma:migrate    # 运行数据库迁移
npm run prisma:studio     # 打开 Prisma Studio
npm run prisma:seed       # 填充种子数据
```

### 数据库模型
Prisma Schema 定义了以下主要模型：
- `User` - 用户
- `Position` - 岗位
- `Interview` - 面试
- `Experience` - 面经
- `Summary` - 面试总结
- `Comment` - 评论

---

## 三、微信小程序 (`miniprogram/`)

### 技术栈
- **原生微信小程序**
- **本地存储**: wx.setStorageSync/wx.getStorageSync
- **AI 功能**: 模拟响应（预留真实 API 接口）

### 目录结构
```
miniprogram/
├── pages/              # 页面（16个页面）
│   ├── index/          # 岗位列表
│   ├── add-job/        # 添加岗位
│   ├── edit-job/       # 编辑岗位
│   ├── job-detail/     # 岗位详情
│   ├── interviews/     # 面试列表
│   ├── add-interview/  # 添加面试
│   ├── interview-detail/ # 面试详情
│   ├── experience/     # 面经列表
│   ├── add-experience/ # 添加面经
│   ├── experience-detail/ # 面经详情
│   ├── add-summary/    # 添加总结
│   ├── summary-list/   # 总结列表
│   ├── summary-detail/ # 总结详情
│   ├── ai-assistant/   # AI助手
│   ├── profile/        # 个人中心
│   ├── edit-profile/   # 编辑个人资料
│   └── settings/       # 设置
├── components/         # 组件（待实现）
├── utils/              # 工具函数
│   ├── storage.js      # 存储封装
│   ├── data-manager.js # 数据管理
│   ├── ai-helper.js    # AI功能封装
│   ├── ai-mock.js      # AI模拟响应
│   └── format.js       # 格式化工具
├── styles/             # 全局样式
│   └── variables.wxss  # CSS变量
├── assets/             # 静态资源
│   └── icons/          # 图标（PNG）
├── app.js              # 小程序入口
├── app.json            # 全局配置
└── app.wxss            # 全局样式
```

### 常用命令
```bash
# 微信小程序开发
# 1. 打开微信开发者工具
# 2. 选择"导入项目"
# 3. 项目路径选择 miniprogram/ 目录
# 4. 开发者工具会自动编译和预览

# 下载图标资源
node scripts/download-icons.js
```

### TabBar 页面
小程序底部导航包含 4 个 Tab：
- **岗位** (`/pages/index/index`)
- **面试** (`/pages/interviews/interviews`)
- **面经** (`/pages/experience/experience`)
- **我的** (`/pages/profile/profile`)

### 数据存储
小程序使用本地存储，通过 `utils/storage.js` 封装：

```javascript
const { Storage, STORAGE_KEYS } = require('../../utils/storage.js');

// 读取数据
const jobs = Storage.get(STORAGE_KEYS.JOBS);

// 写入数据
Storage.set(STORAGE_KEYS.JOBS, jobs);
```

---

## 四、部署配置

### Docker 部署（推荐）

项目使用 Docker Compose 进行部署，配置文件为 `docker-compose.yml`。

**启动所有服务**：
```bash
docker-compose up -d
```

**服务包括**：
- 前端（Vue 3 + Vite）
- 后端（Express + TypeScript）
- 数据库（PostgreSQL）

### 其他部署方式

项目也支持：
- GitHub Pages（仅前端）
- 腾讯云
- 宝塔面板
- 其他支持静态网站和 Node.js 的平台

---

## 五、根目录命令

项目根目录 `package.json` 提供了便捷命令：

```bash
# 构建整个项目（Web + Backend）
npm run build

# 启动 Web 前端开发服务器
npm run dev

# 启动后端开发服务器
npm run start
```

---

## 六、文档规范

项目文档统一存放在 `/docs/` 目录：

- **`/docs/arch-design.md`** - 架构设计文档
- **`/docs/dev-progress.md`** - 开发进度文档
- **`/docs/bug-fix.md`** - 问题修复日志
- **`/docs/vercel-deployment.md`** - Vercel 部署指南
- **`/docs/github-actions-deployment.md`** - GitHub Actions 部署指南
- **`/docs/tencent-cloud-deployment.md`** - 腾讯云部署指南
- **`/docs/baota-deployment.md`** - 宝塔面板部署指南

**文档更新原则**:
- 尽量使用现有文档文件
- 每次更新需标注更新时间（YYYY-MM-DD）
- 保持简洁，使用清晰的章节结构

---

## 七、Git 提交规范

每个功能实现完成之后必须进行 commit。

**Commit Message 格式**：
```
<类型>: <模块>/<功能>: <简要描述>
```

**示例**：
- `feat: backend/api/positions: 实现岗位列表接口`
- `feat: web/views/JobDetail: 实现岗位详情页`
- `feat: miniprogram/pages/add-job: 实现添加岗位页`
- `fix: web/api/position: 修复岗位查询参数问题`
- `style: web/styles: 优化全局样式`

**Commit 类型**：
- `feat`: 新功能
- `fix`: Bug 修复
- `refactor`: 代码重构
- `style`: 样式调整
- `docs`: 文档更新
- `test`: 测试相关
- `chore`: 构建/工具链相关
- `opt`: 优化

---

## 八、开发注意事项

### 开发前确认
1. **明确你正在开发哪个部分**：
   - Web 前端 (`web/`)
   - 后端服务 (`backend/`)
   - 微信小程序 (`miniprogram/`)

2. **各部分独立运行**：
   - Web 前端: `cd web && npm run dev` (端口通常为 5173)
   - 后端服务: `cd backend && npm run dev` (端口通常配置在环境变量)
   - 微信小程序: 使用微信开发者工具打开 `miniprogram/` 目录

### 跨部分交互
- **Web 前端 ↔ 后端**: Web 端通过 `/src/api/` 调用后端 RESTful API
- **微信小程序**: 独立运行，使用本地存储（未来可对接后端 API）

### 环境变量
后端服务使用 `.env` 文件配置环境变量：
```env
DATABASE_URL=           # 数据库连接 URL
JWT_SECRET=             # JWT 密钥
PORT=3001               # 服务端口
```

### 代码规范
- **TypeScript**: Web 和 Backend 都使用 TypeScript，注意类型定义
- **Vue 组件**: 使用 Composition API + `<script setup>`
- **API 设计**: RESTful 风格，统一返回格式
- **错误处理**: 统一的错误处理中间件

---

## 九、功能完成检查清单

每个功能完成后执行：

- [ ] 代码已实现所有功能点
- [ ] 代码已 commit（使用规范的 commit message）
- [ ] 更新 `/docs/dev-progress.md`（记录功能完成情况）
- [ ] 如有设计变更，更新 `/docs/arch-design.md`
- [ ] 如遇到问题，记录到 `/docs/bug-fix.md`
- [ ] 基本测试通过，无明显错误

---

## 十、技术亮点

### 1. 全栈架构
- 前后端分离，RESTful API 设计
- TypeScript 全栈，类型安全
- Prisma ORM，类型安全的数据库操作

### 2. 部署灵活
- 支持 Docker 一键部署
- Serverless 架构，自动扩缩容
- 支持多种部署平台（Docker/GitHub Pages/腾讯云/宝塔）

### 3. 微信小程序独立运行
- 本地存储方案，无需后端即可使用
- AI 功能预留接口，便于后续对接真实 API
- 模块化架构，易于维护

### 4. 现代化技术栈
- Vue 3 Composition API
- Pinia 状态管理
- Tailwind CSS 样式
- Tiptap 富文本编辑器
- Naive UI 组件库

---

## 参考文档

### 产品需求文档 (PRD)
- **文件**: `求职追踪助手微信小程序产品需求文档（PRD）.md`
- **内容**: 完整的产品功能需求、用户痛点分析、核心功能定义

### 页面原型设计
- **目录**: `prototype/` - 可交互原型 (用于设计参考)

**注意**: HTML 文件仅为设计参考原型，展示 UI/UX 设计思路，并非项目实际源代码。

---

## 快速开始

### 第一次使用

1. **克隆项目**
```bash
git clone <repository-url>
cd job-ai
```

2. **安装依赖**
```bash
# Web 前端
cd web && npm install

# 后端服务
cd ../backend && npm install
```

3. **配置环境变量**
```bash
# 在 backend/ 目录创建 .env 文件
cd backend
cp .env.example .env
# 编辑 .env 文件，填写配置
```

4. **启动开发服务器**
```bash
# 终端 1 - 启动后端
cd backend && npm run dev

# 终端 2 - 启动前端
cd web && npm run dev

# 终端 3 - 启动小程序（使用微信开发者工具）
# 打开 miniprogram/ 目录
```

### 开发流程

1. **选择开发模块**（Web/Backend/Miniprogram）
2. **实现功能代码**
3. **功能测试**
4. **Git Commit**（使用规范 commit message）
5. **更新文档**（`/docs/dev-progress.md`）
6. **检查是否有遗漏功能**
7. **重复以上步骤**

---

## 项目完成检查清单

**所有功能开发完成后**，必须执行以下检查：

### 编译与类型检查
- [ ] Web 前端能够正常构建 (`npm run build`)
- [ ] 后端服务能够正常构建 (`npm run build`)
- [ ] 无 TypeScript 类型错误
- [ ] 无微信小程序开发者工具报错

### 功能完整性检查
- [ ] Web 前端所有页面均可正常访问
- [ ] 后端 API 接口正常响应
- [ ] 微信小程序所有页面正常显示
- [ ] 数据库读写正常

### 交互联通性检查
- [ ] Web 前端与后端 API 通信正常
- [ ] 页面跳转路由正常
- [ ] 表单提交后数据流转正常
- [ ] 搜索/筛选功能联动正常
- [ ] 详情页数据展示正确

### 部署测试
- [ ] Docker 部署验证
- [ ] 生产环境功能正常
- [ ] API 接口可访问
