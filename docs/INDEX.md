# 📚 文档索引

**更新日期**: 2025-02-05

---

## 🚀 快速开始

### 新用户必读
1. **[README.md](../README.md)** - 项目介绍和基本说明
2. **[QUICK_START.md](./QUICK_START.md)** - 快速开始指南
3. **[QUICK_START_LOCAL_DB.md](./QUICK_START_LOCAL_DB.md)** - 本地数据库快速配置

---

## 📖 项目文档

### 架构与设计
1. **[arch-design.md](./arch-design.md)** - 系统架构设计
2. **[CLAUDE.md](../CLAUDE.md)** - 项目开发指南（必读）

### Monorepo 优化
1. **[MONOREPO_SUMMARY.md](./MONOREPO_SUMMARY.md)** - Monorepo 优化总结
2. **[monorepo-migration.md](./monorepo-migration.md)** - 迁移完成报告

### 本地数据库配置
1. **[local-postgresql-setup.md](./local-postgresql-setup.md)** - 详细配置指南
2. **[LOCAL_DB_SETUP_DONE.md](./LOCAL_DB_SETUP_DONE.md)** - 配置完成总结

---

## 🧪 测试文档

### 测试报告
1. **[TESTING_SUMMARY.md](./TESTING_SUMMARY.md)** - 测试总结
2. **[TEST_REPORT.md](./TEST_REPORT.md)** - 详细测试报告
3. **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - 项目状态报告

### 部署检查
1. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - 部署检查清单

---

## 📊 进度管理

### 开发进度
1. **[dev-progress.md](./dev-progress.md)** - 开发进度文档
2. **[bug-fix.md](./bug-fix.md)** - 问题修复日志

### 待办事项
1. **[todo.md](./todo.md)** - 待办事项清单

---

## 🚀 部署文档

### 云平台部署
1. **[vercel-deployment.md](./vercel-deployment.md)** - Vercel 部署指南
2. **[tencent-cloud-docker-deployment.md](./tencent-cloud-docker-deployment.md)** - 腾讯云部署指南
3. **[github-secrets-guide.md](./github-secrets-guide.md)** - GitHub Secrets 配置
4. **[vercel-config-summary.md](./vercel-config-summary.md)** - Vercel 配置总结

### 网络修复
1. **[git-network-fix.md](./git-network-fix.md)** - Git 网络问题修复

---

## 📝 产品文档

### 产品需求
1. **[../求职追踪助手微信小程序产品需求文档（PRD）.md](../求职追踪助手微信小程序产品需求文档（PRD）.md)** - 产品需求文档

---

## 🛠️ 脚本工具

所有脚本位于项目根目录的 **[scripts/](../scripts/)** 目录。

### 数据库配置
- **[setup-local-db.sh](../scripts/setup-local-db.sh)** - 本地 PostgreSQL 配置脚本

### 测试脚本
- **[test-backend.sh](../scripts/test-backend.sh)** - 后端服务测试脚本

### 部署脚本
- **[deploy-docker.sh](../scripts/deploy-docker.sh)** - Docker 部署脚本
- **[deploy-quick.sh](../scripts/deploy-quick.sh)** - 快速部署脚本
- **[deploy-server-fixed.sh](../scripts/deploy-server-fixed.sh)** - 服务器部署脚本
- **[update-deploy.sh](../scripts/update-deploy.sh)** - 更新部署脚本

### 工具脚本
- **[download-icons.sh](../scripts/download-icons.sh)** - 下载图标脚本
- **[generate-types-from-prisma.js](../scripts/generate-types-from-prisma.js)** - 类型生成脚本

---

## 📂 目录结构

```
job-ai/
├── docs/                    # 📚 所有文档
│   ├── QUICK_START.md
│   ├── arch-design.md
│   └── ...
├── scripts/                 # 🛠️ 所有脚本
│   ├── setup-local-db.sh
│   ├── test-backend.sh
│   └── ...
├── web/                     # 前端项目
├── backend/                 # 后端项目
├── packages/                # 共享包
│   └── shared/
├── miniprogram/             # 微信小程序
├── CLAUDE.md                # 项目开发指南
├── README.md                # 项目说明
└── 求职追踪助手微信小程序产品需求文档（PRD）.md
```

---

## 🎯 快速导航

### 我想...

#### 开始使用项目
→ [README.md](../README.md) → [QUICK_START.md](./QUICK_START.md)

#### 配置本地数据库
→ [QUICK_START_LOCAL_DB.md](./QUICK_START_LOCAL_DB.md) → [LOCAL_DB_SETUP_DONE.md](./LOCAL_DB_SETUP_DONE.md)

#### 了解项目架构
→ [arch-design.md](./arch-design.md) → [CLAUDE.md](../CLAUDE.md)

#### 查看 Monorepo 优化
→ [MONOREPO_SUMMARY.md](./MONOREPO_SUMMARY.md) → [monorepo-migration.md](./monorepo-migration.md)

#### 查看测试报告
→ [TESTING_SUMMARY.md](./TESTING_SUMMARY.md) → [PROJECT_STATUS.md](./PROJECT_STATUS.md)

#### 部署到生产环境
→ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) → [vercel-deployment.md](./vercel-deployment.md)

#### 查看开发进度
→ [dev-progress.md](./dev-progress.md)

#### 使用脚本工具
→ [scripts/](../scripts/) 目录

---

## 📞 获取帮助

### 常见问题
1. **如何配置数据库?** → 查看 [QUICK_START_LOCAL_DB.md](./QUICK_START_LOCAL_DB.md)
2. **如何启动项目?** → 查看 [QUICK_START.md](./QUICK_START.md)
3. **如何部署?** → 查看 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
4. **遇到问题?** → 查看 [bug-fix.md](./bug-fix.md)

### 文档更新
文档会随项目开发持续更新，最后更新时间：2025-02-05

---

**提示**: 建议将 [QUICK_START.md](./QUICK_START.md) 和 [CLAUDE.md](../CLAUDE.md) 加入书签，方便随时查阅。
