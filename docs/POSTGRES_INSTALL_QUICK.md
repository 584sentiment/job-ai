# 🚀 PostgreSQL 快速安装指南

**日期**: 2025-02-05
**问题**: Homebrew 下载 PostgreSQL 18 网络超时

---

## ⚡ 3 分钟快速解决

### 方案 1: Docker（推荐）⭐

```bash
# 运行 PostgreSQL（1 条命令）
docker run -d \
  --name job-ai-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=job_ai_dev \
  -p 5432:5432 \
  -v job-ai-db-data:/var/lib/postgresql/data \
  postgres:18-alpine

# 验证
docker exec -it job-ai-postgres psql -U postgres -c "SELECT version();"
```

**完成！** 后端配置如下：
```bash
# backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_ai_dev"
```

---

### 方案 2: PostgreSQL@16

```bash
# 安装
brew install postgresql@16

# 启动
brew services start postgresql@16

# 创建数据库
createdb job_ai_dev
```

**完成！** 后端配置同上。

---

### 方案 3: 使用国内镜像

```bash
# 配置镜像
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles"

# 安装
brew install postgresql@18

# 启动
brew services start postgresql@18

# 创建数据库
createdb job_ai_dev
```

---

## 📋 后续步骤（所有方案通用）

```bash
# 1. 进入后端目录
cd backend

# 2. 初始化数据库
pnpm prisma generate
pnpm prisma db push

# 3. 启动后端
pnpm dev
```

---

## 🧪 验证安装

```bash
# Docker 用户
docker exec -it job-ai-postgres psql -U postgres -d job_ai_dev -c "SELECT 1;"

# Homebrew 用户
psql -U postgres -d job_ai_dev -c "SELECT 1;"

# 预期输出: 1 行返回 "1"
```

---

## 💡 推荐选择

- **有 Docker**: 方案 1（最快最稳定）
- **无 Docker**: 方案 2（PostgreSQL@16 足够用）
- **追求最新版**: 方案 3（需等待下载）

---

**预计时间**: 3-5 分钟
