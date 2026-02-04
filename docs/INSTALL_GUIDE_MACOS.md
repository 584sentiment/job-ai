# 🔧 macOS PostgreSQL 安装和配置指南

**系统**: macOS
**数据库**: PostgreSQL 18
**日期**: 2025-02-05

---

## 📥 当前状态

### ⚠️ 网络问题
❌ **Homebrew 下载 PostgreSQL 失败**
- 原因: ghcr.io (GitHub Container Registry) 访问缓慢
- 状态: 下载卡在 3% (620KB / ~20MB)
- 时间: 已尝试 20+ 分钟

### ✅ 推荐替代方案

由于网络问题，建议使用以下方案之一：

1. **方案 A: 使用 Docker（推荐）** - 最快速稳定
2. **方案 B: 使用国内 Homebrew 镜像** - 中科大镜像源
3. **方案 C: PostgreSQL@16（旧版本）** - 可能在本地缓存

请查看下方的详细方案。

---

## 🚀 安装方案

### 方案 A: 使用 Docker（强烈推荐）⭐

**优势**:
- ✅ 5分钟内完成
- ✅ 隔离环境，不污染系统
- ✅ 数据持久化
- ✅ 易于管理

**安装步骤**:

```bash
# 1. 确认 Docker 已安装并运行
docker --version
docker info

# 2. 启动 PostgreSQL 容器
docker run -d \
  --name job-ai-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=job_ai_dev \
  -p 5432:5432 \
  -v job-ai-db-data:/var/lib/postgresql/data \
  postgres:18-alpine

# 3. 验证容器运行
docker ps | grep job-ai-postgres

# 4. 测试连接
docker exec -it job-ai-postgres psql -U postgres -c "SELECT version();"
```

**容器管理命令**:
```bash
# 停止
docker stop job-ai-postgres

# 启动
docker start job-ai-postgres

# 重启
docker restart job-ai-postgres

# 查看日志
docker logs -f job-ai-postgres

# 删除容器（数据会保留在 volume）
docker rm job-ai-postgres
```

**环境变量配置**:
```bash
# backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_ai_dev"
```

---

### 方案 B: 使用国内 Homebrew 镜像

**配置中科大镜像源**:

```bash
# 1. 替换 Homebrew 镜像
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles"

# 2. 安装 PostgreSQL
brew install postgresql@18

# 3. 验证安装
postgres --version
```

**如果仍然缓慢，尝试安装旧版本**:
```bash
brew install postgresql@16
```

---

### 方案 C: PostgreSQL@16（旧版本）

**为什么选择旧版本**:
- 可能在 Homebrew 缓存中已有
- 下载更快
- 功能差异不大（开发环境够用）

```bash
# 安装 PostgreSQL 16
brew install postgresql@16

# 启动服务
brew services start postgresql@16

# 创建数据库
psql -U postgres -c "CREATE DATABASE job_ai_dev;"
```

---

## 📋 快速配置（安装完成后）

### 步骤 1: 验证 PostgreSQL 状态

```bash
# 启动服务
brew services start postgresql@18

# 验证服务状态
brew services list | grep postgresql
```

**预期输出**:
```
postgresql@18 started
```

### 步骤 3: 创建数据库

```bash
# 连接到 PostgreSQL
psql -U postgres

# 在 psql 命令行中执行
CREATE DATABASE job_ai_dev;

# 退出
\q
```

**或使用一行命令**:
```bash
psql -U postgres -c "CREATE DATABASE job_ai_dev;"
```

### 步骤 4: 配置项目环境

后端的 `.env` 已经配置为本地 PostgreSQL：

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_ai_dev"
```

**如果您的密码不是 `postgres`，请修改**:
```bash
# 编辑 backend/.env
nano backend/.env

# 修改密码部分，例如密码是 mypass123
DATABASE_URL="postgresql://postgres:mypass123@localhost:5432/job_ai_dev"
```

### 步骤 5: 初始化数据库结构

```bash
cd backend

# 生成 Prisma Client
pnpm prisma generate

# 推送数据库结构
pnpm prisma db push
```

**预期输出**:
```
✔ Loaded env from .env
✔ Generated Prisma Client
✔ Connected to database
...
🚀 Done in Xs
```

### 步骤 6: 启动后端服务

```bash
cd backend
pnpm dev
```

**预期输出**:
```
Server is running on port 8080
Database connected successfully
```

---

## 🧪 验证配置

### 测试 1: 检查 PostgreSQL 状态

```bash
brew services list | grep postgresql
```

应该看到 `postgresql@18` 并显示 `started`

### 测试 2: 验证数据库连接

```bash
psql -U postgres -d job_ai_dev -c "SELECT version();"
```

应该返回 PostgreSQL 版本信息。

### 测试 3: 使用 Prisma Studio

```bash
cd backend
pnpm prisma studio
```

浏览器访问: http://localhost:5555

应该能看到所有数据表。

### 测试 4: 测试后端 API

```bash
curl http://localhost:8080/api
```

预期响应:
```json
{
  "code": 200,
  "message": "API is running"
}
```

---

## 🛠️ 常见问题

### 问题 1: brew services 无法启动

**错误**: `brew services` 命令不存在

**解决**: 安装 services tap
```bash
brew tap homebrew/services
brew services start postgresql@18
```

### 问题 2: 端口 5432 被占用

**错误**: `port 5432 is already in use`

**原因**: 可能有其他 PostgreSQL 实例在运行

**解决**:
```bash
# 查找占用端口的进程
lsof -i :5432

# 如果不是 PostgreSQL，停止该进程
sudo kill <PID>

# 或者停止当前 PostgreSQL
brew services stop postgresql@18
brew services start postgresql@18
```

### 问题 3: 密码认证失败

**错误**: `password authentication failed for user "postgres"`

**解决**: PostgreSQL on macOS 通常使用空密码

**修改 .env**:
```bash
DATABASE_URL="postgresql://postgres:@localhost:5432/job_ai_dev"
```

### 问题 4: 数据库无法创建

**错误**: `database "job_ai_dev" already exists`

**说明**: 数据库已存在，可以直接使用

**继续执行步骤 5**

---

## 📊 PostgreSQL 管理命令

### 服务管理

```bash
# 启动服务
brew services start postgresql@18

# 停止服务
brew services stop postgresql@18

# 重启服务
brew services restart postgresql@18

# 查看状态
brew services list | grep postgresql

# 开机自启动
brew services start postgresql@18
```

### 数据库操作

```bash
# 连接到 PostgreSQL
psql -U postgres

# 列出所有数据库
\l

# 连接到特定数据库
\c job_ai_dev

# 列出所有表
\dt

# 查看表结构
\d users

# 执行 SQL 查询
SELECT * FROM users;

# 退出
\q
```

### 数据备份和恢复

```bash
# 备份
pg_dump -U postgres job_ai_dev > backup.sql

# 恢复
psql -U postgres job_ai_dev < backup.sql

# 或恢复到新数据库
psql -U postgres -d new_db < backup.sql
```

---

## 🎯 快速参考

### 默认配置

| 配置项 | 默认值 |
|--------|----------|
| 用户名 | `postgres` |
| 密码 | （通常为空） |
| 主机 | `localhost` |
| 端口 | `5432` |
| 数据库 | `job_ai_dev` |

### 连接字符串

```bash
# 默认密码（空）
DATABASE_URL="postgresql://postgres:@localhost:5432/job_ai_dev"

# 如果设置了密码
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/job_ai_dev"
```

---

## 📞 获取帮助

### PostgreSQL 文档
- 官方文档: https://www.postgresql.org/docs/
- Homebrew PostgreSQL: https://wiki.postgresql.org/wiki/Homebrew

### 项目文档
- [docs/QUICK_START_LOCAL_DB.md](docs/QUICK_START_LOCAL_DB.md)
- [docs/INDEX.md](docs/INDEX.md)

### 常用命令

```bash
# 查看版本
postgres --version

# 连接数据库
psql -U postgres

# 启动服务
brew services start postgresql@18

# 查看日志
tail -f /usr/local/var/log/postgresql@18.log
```

---

**安装完成后，请按照上述步骤继续配置！** 🚀

**预计总配置时间**: 5-8 分钟

---

## 🔥 快速决策指南

### 我该选择哪个方案？

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| **已有 Docker** | 方案 A | 5分钟完成，最稳定 |
| **不想安装 Docker** | 方案 C | 安装 PostgreSQL@16 更快 |
| **网络稳定** | 方案 B | 使用镜像源安装最新版 |
| **追求速度** | 方案 A | Docker 方案最快 |

### 推荐流程

1. **检查是否已有 Docker**:
   ```bash
   docker --version
   ```
   - 如果有 → 使用方案 A
   - 如果没有 → 继续第2步

2. **尝试安装 PostgreSQL@16**:
   ```bash
   brew install postgresql@16
   ```
   - 如果成功 → 使用方案 C
   - 如果仍然缓慢 → 考虑安装 Docker

3. **最坏情况**: 考虑使用云数据库或稍后重试
