# 📂 项目根目录规范

**更新日期**: 2025-02-05

---

## 📋 根目录文件规范

### ✅ 保留在根目录的核心文件

#### 项目配置文件
- `package.json` - 根目录包配置
- `pnpm-workspace.yaml` - pnpm workspace 配置
- `pnpm-lock.yaml` - 依赖锁定文件
- `vercel.json` - Vercel 部署配置
- `docker-compose.yml` - Docker 编排配置
- `.gitignore` - Git 忽略规则
- `.dockerignore` - Docker 忽略规则

#### 核心文档
- `README.md` - 项目说明（对外展示）
- `CLAUDE.md` - 开发指南（对内开发）
- `求职追踪助手微信小程序产品需求文档（PRD）.md` - 产品需求文档

#### 系统文件
- `.DS_Store` - macOS 系统文件（已忽略）

---

## 🚫 根目录不应包含的文件

### ❌ 应移到 docs/ 目录
- 安装指南
- 配置教程
- 测试报告
- 部署文档
- 技术总结
- 待办清单
- 其他项目文档

### ❌ 应移到 scripts/ 目录
- 测试脚本
- 配置脚本
- 部署脚本
- 工具脚本

### ❌ 应移到 packages/ 目录
- 共享代码
- 类型定义
- 工具函数

---

## 📁 正确的目录结构

```
job-ai/                      # 项目根目录（只保留核心文件）
│
├── docs/                   # 📚 所有文档和指南
│   ├── INDEX.md            # 文档索引
│   ├── QUICK_START.md      # 快速开始
│   ├── arch-design.md      # 架构设计
│   ├── dev-progress.md     # 开发进度
│   ├── INSTALL_GUIDE_MACOS.md        # 安装指南
│   ├── INSTALL_PROGRESS.md           # 安装进度
│   ├── QUICK_SETUP_GUIDE.md           # 快速配置
│   ├── TODO_POSTGRES_SETUP.md         # 配置待办
│   └── ...               # 其他文档
│
├── scripts/                # 🛠️ 所有脚本和工具
│   ├── setup-local-db.sh  # 本地数据库配置
│   ├── test-backend.sh    # 后端测试
│   └── ...               # 其他脚本
│
├── web/                    # 前端项目
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/               # 后端项目
│   ├── src/
│   ├── prisma/
│   └── ...
│
├── packages/               # 共享包
│   └── shared/           # 共享类型和工具
│       ├── src/
│       └── dist/
│
├── miniprogram/           # 微信小程序
│   ├── pages/
│   ├── components/
│   └── ...
│
├── api/                   # Vercel Serverless
│
├── logs/                  # 日志目录
│
├── node_modules/          # 依赖（不提交）
│
├── README.md              # 项目说明 ⭐
├── CLAUDE.md              # 开发指南 ⭐
├── 求职追踪助手微信小程序产品需求文档（PRD）.md  # 产品需求 ⭐
│
├── package.json           # 根配置
├── pnpm-workspace.yaml   # workspace 配置
├── pnpm-lock.yaml        # 锁文件
├── vercel.json            # Vercel 配置
├── docker-compose.yml    # Docker 配置
│
├── .gitignore            # Git 忽略
├── .dockerignore         # Docker 忽略
└── ...
```

---

## 📝 文件分类指南

### 📖 文档（docs/）

**应该放在 docs/** 的文件**:
- 安装指南
- 配置教程
- 测试报告
- 部署文档
- 技术总结
- 进度报告
- 待办清单
- 快速开始指南
- FAQ

**示例**:
- ✅ `docs/QUICK_START.md`
- ✅ `docs/INSTALL_GUIDE.md`
- ✅ `docs/TEST_REPORT.md`
- ❌ `./QUICK_START.md`（错误！应该在 docs/）

### 🛠️ 脚本（scripts/）

**应该放在 scripts/** 的文件**:
- 配置脚本
- 测试脚本
- 部署脚本
- 工具脚本

**示例**:
- ✅ `scripts/setup-local-db.sh`
- ✅ `scripts/test-backend.sh`
- ❌ `./setup.sh`（错误！应该在 scripts/）

### 📦 核心文件（根目录）

**应该保留在根目录的文件**:
- `README.md` - 项目说明（对用户）
- `CLAUDE.md` - 开发指南（对开发者）
- `产品需求文档.md` - 产品文档
- `package.json` - 项目配置
- `pnpm-workspace.yaml` - workspace 配置
- `vercel.json` - 部署配置
- `docker-compose.yml` - Docker 配置
- `.gitignore` - Git 配置

---

## 🎯 遵循原则

### 1. 最小化根目录
- ✅ 只保留必要的配置文件
- ✅ 只保留核心文档（3 个）
- ✅ 保持根目录整洁

### 2. 分类存放
- 📚 文档 → `docs/`
- 🛠️ 脚本 → `scripts/`
- 📦 代码 → `web/`, `backend/`, `packages/`

### 3. 清晰命名
- 文件名要清晰表达用途
- 目录名要符合通用规范
- 避免使用中文命名（产品文档除外）

### 4. 易于维护
- 新文档自动放在 `docs/`
- 新脚本自动放在 `scripts/`
- 定期清理过时文件

---

## ⚠️ 常见错误

### ❌ 错误示例

```bash
# ❌ 在根目录创建文档
./安装指南.md              # 错误！应该在 docs/
./测试报告.md             # 错误！应该在 docs/

# ❌ 在根目录创建脚本
./setup.sh                # 错误！应该在 scripts/
./test-backend.sh        # 错误！应该在 scripts/

# ❌ 文档命名
./docs/README.md         # 正确（docs 的索引）
./README.md              # 正确（项目说明）
```

### ✅ 正确示例

```bash
# ✅ 文档放在 docs/
docs/安装指南.md
docs/测试报告.md

# ✅ 脚本放在 scripts/
scripts/setup.sh
scripts/test.sh

# ✅ 核心文档在根目录
README.md
CLAUDE.md
```

---

## 🔍 文件检查清单

### 添加文件前检查

**我要添加一个文档，应该放在哪里？**

1. **是否是项目说明？**
   - 是 → 根目录 `README.md`

2. **是否是开发指南？**
   - 是 → 根目录 `CLAUDE.md`

3. **是否是产品文档？**
   - 是 → 根目录 `PRD.md`

4. **其他文档？**
   - 是 → `docs/` 目录

**我要添加一个脚本，应该放在哪里？**
- → `scripts/` 目录

### 提交前检查

**根目录是否保持简洁？**
- [ ] 只有 3 个核心文档
- [ ] 只有必要的配置文件
- [ ] 没有临时文件
- [ ] 没有测试脚本
- [ ] 没有安装指南

---

## 📚 参考文档

### 文档管理
- **[docs/INDEX.md](docs/INDEX.md)** - 所有文档索引
- **[CLAUDE.md](CLAUDE.md)** - 项目开发指南

### 目录结构
- **[README.md](README.md)** - 项目说明
- **[docs/arch-design.md](docs/arch-design.md)** - 架构设计

---

## 🎯 总结

### 根目录只保留
- ✅ 3 个核心文档
- ✅ 必要的配置文件
- ✅ 系统文件

### 所有其他内容
- 📚 文档 → `docs/`
- 🛠️ 脚本 → `scripts/`
- 💻 代码 → `web/`, `backend/`, `packages/`

### 好处
- ✅ 根目录整洁清晰
- ✅ 文档易于查找
- ✅ 脚本集中管理
- ✅ 符合项目规范

---

**记住**: 根目录 = 项目的"门面"，请保持整洁！🚪
