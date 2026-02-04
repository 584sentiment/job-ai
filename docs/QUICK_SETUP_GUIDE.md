# 🎯 PostgreSQL 安装和配置 - 快速指南

## 当前状态

✅ **正在安装 PostgreSQL 18**
- 方法: Homebrew
- 预计时间: 3-5 分钟

## 📋 安装完成后的步骤

### 步骤 1: 验证安装

```bash
postgres --version
```

### 步骤 2: 启动服务

```bash
brew services start postgresql@18
brew services list | grep postgresql
```

### 步骤 3: 创建数据库

```bash
psql -U postgres -c "CREATE DATABASE job_ai_dev;"
```

### 步骤 4: 配置密码（如需要）

**PostgreSQL on macOS 默认密码通常为空**

如果是空密码，修改 `backend/.env`:
```bash
DATABASE_URL="postgresql://postgres:@localhost:5432/job_ai_dev"
```

### 步骤 5: 初始化数据库

```bash
cd backend
pnpm prisma generate
pnpm prisma db push
```

### 步骤 6: 启动后端

```bash
cd backend
pnpm dev
```

## ✅ 验证

```bash
# 测试数据库
psql -U postgres -d job_ai_dev -c "SELECT 1;"

# 测试后端
curl http://localhost:8080/api
```

## 🚨 故障排除

### 问题: 端口被占用
```bash
lsof -i :5432
sudo kill <PID>
```

### 问题: 服务无法启动
```bash
brew services restart postgresql@18
```

---

**预计总时间**: 5-8 分钟
