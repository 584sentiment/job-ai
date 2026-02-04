# 🚀 本地 PostgreSQL 快速开始

**适用场景**: 已安装本地 PostgreSQL 数据库

---

## ⚡ 快速配置（3 分钟）

### 方式 1: 使用自动化脚本 ⭐ 推荐

```bash
# 运行配置脚本
bash setup-local-db.sh

# 脚本会提示您输入:
# - 用户名 (默认: postgres)
# - 密码
# - 端口 (默认: 5432)
# - 数据库名 (默认: job_ai_dev)
```

### 方式 2: 手动配置

#### 步骤 1: 创建数据库

```bash
# 连接到 PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE job_ai_dev;

# 退出
\q
```

#### 步骤 2: 配置 backend/.env

已自动配置为本地 PostgreSQL:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_ai_dev"
```

**如果您的密码不是 `postgres`，请修改:**
```bash
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/job_ai_dev"
```

#### 步骤 3: 初始化数据库

```bash
cd backend

# 生成 Prisma Client
pnpm prisma generate

# 推送数据库结构
pnpm prisma db push
```

#### 步骤 4: 启动服务

**终端 1 - 后端**:
```bash
cd backend
pnpm dev
```

**终端 2 - 前端**:
```bash
pnpm dev
```

---

## ✅ 验证配置

### 1. 测试数据库连接

```bash
cd backend

# 启动 Prisma Studio
pnpm prisma studio
```

浏览器访问: http://localhost:5555

应该能看到所有数据表。

### 2. 测试后端 API

```bash
curl http://localhost:8080/api
```

预期响应:
```json
{
  "code": 200,
  "message": "API is running",
  "data": {
    "status": "ok"
  }
}
```

### 3. 测试前端

浏览器访问: http://localhost:5173

尝试注册新用户，数据会保存到本地数据库。

---

## 🛠️ 常用操作

### 查看数据库

```bash
# 方式 1: Prisma Studio (推荐)
cd backend && pnpm prisma studio

# 方式 2: 命令行
psql -U postgres -d job_ai_dev
```

### 重置数据库

```bash
# 方式 1: 删除所有数据
cd backend
psql -U postgres -d job_ai_dev -c "TRUNCATE TABLE users CASCADE;"

# 方式 2: 重新推送结构
pnpm prisma db push --force-reset
```

### 备份数据

```bash
# 备份
pg_dump -U postgres job_ai_dev > backup.sql

# 恢复
psql -U postgres job_ai_dev < backup.sql
```

---

## 🔧 故障排除

### 问题 1: 密码错误

**错误**: `password authentication failed`

**解决**: 修改 backend/.env 中的密码

```bash
# 查看当前配置
grep DATABASE_URL backend/.env

# 修改密码 (替换 your_password 为实际密码)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/job_ai_dev"
```

### 问题 2: 数据库不存在

**错误**: `database "job_ai_dev" does not exist`

**解决**: 创建数据库

```bash
psql -U postgres -c "CREATE DATABASE job_ai_dev;"
```

### 问题 3: 连接被拒绝

**错误**: `Connection refused`

**解决**: 检查 PostgreSQL 是否运行

```bash
# macOS
brew services list | grep postgresql
brew services start postgresql@15

# Linux
sudo systemctl status postgresql
sudo systemctl start postgresql
```

---

## 📊 配置参考

### 默认配置

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| 用户名 | `postgres` | 默认 PostgreSQL 用户 |
| 密码 | `postgres` | 请修改为实际密码 |
| 主机 | `localhost` | 本地服务器 |
| 端口 | `5432` | PostgreSQL 默认端口 |
| 数据库 | `job_ai_dev` | 应用数据库名 |

### 连接字符串格式

```
postgresql://用户名:密码@主机:端口/数据库名
```

**示例**:
```
postgresql://postgres:mypassword@localhost:5432/job_ai_dev
postgresql://myuser:secret@127.0.0.1:5432/job_ai
```

---

## 🎯 下一步

配置完成后，您可以:

1. ✅ **启动开发服务器** - 后端和前端
2. ✅ **测试功能** - 注册、登录、CRUD 操作
3. ✅ **查看数据** - 使用 Prisma Studio
4. ✅ **开发新功能** - 热重载，实时更新

---

**需要帮助?** 查看 [docs/local-postgresql-setup.md](./docs/local-postgresql-setup.md)
