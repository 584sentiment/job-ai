# 本地 PostgreSQL 数据库配置指南

**配置时间**: 2025-02-05
**数据库**: PostgreSQL (自建)
**用途**: 本地开发环境

---

## 📋 前置要求

### 1. 安装 PostgreSQL

#### macOS
```bash
# 使用 Homebrew 安装
brew install postgresql@15
brew services start postgresql@15

# 或使用 Postgres.app (GUI)
# 下载: https://postgresapp.com/
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
- 下载安装程序: https://www.postgresql.org/download/windows/
- 安装时记住设置的密码

### 2. 验证安装
```bash
psql --version
# 应显示: psql (PostgreSQL) 15.x 或更高版本
```

---

## 🗄️ 创建数据库

### 方式 1: 使用命令行

```bash
# 连接到 PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE job_ai_dev;

# 创建用户（可选）
CREATE USER job_ai_user WITH PASSWORD 'your_password';

# 授权
GRANT ALL PRIVILEGES ON DATABASE job_ai_dev TO job_ai_user;

# 退出
\q
```

### 方式 2: 使用 pgAdmin（GUI）

1. 打开 pgAdmin
2. 连接到本地服务器
3. 右键 "Databases" → "Create" → "Database"
4. 数据库名: `job_ai_dev`
5. 点击 "Save"

### 方式 3. 使用 TablePlus（GUI）

1. 创建新连接
2. 选择 PostgreSQL
3. 配置:
   - Host: `localhost`
   - Port: `5432`
   - User: `postgres`
   - Password: (您的密码)
4. 连接后创建数据库: `job_ai_dev`

---

## ⚙️ 配置项目

### 步骤 1: 修改 backend/.env

打开 `backend/.env` 文件，修改 `DATABASE_URL`：

```bash
# 本地 PostgreSQL 数据库
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/job_ai_dev"

# 如果创建了专用用户
# DATABASE_URL="postgresql://job_ai_user:your_password@localhost:5432/job_ai_dev"

# JWT 密钥
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# 服务器端口
PORT=8080

# 环境
NODE_ENV="development"

# 日志级别
LOG_LEVEL="debug"

# CORS 允许的源
CORS_ORIGIN="http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"

# DeepSeek API (保持不变)
DEEPSEEK_API_KEY="sk-6b52fe2259e1457aa40b0d65331e770d"
```

**重要**: 将 `your_password` 替换为您的 PostgreSQL 密码

### 步骤 2: 初始化数据库结构

```bash
cd backend

# 生成 Prisma Client
pnpm prisma generate

# 推送数据库结构
pnpm prisma db push

# 可选：填充种子数据
pnpm prisma seed
```

**预期输出**:
```
✔ Loaded env from .env
✔ Generated Prisma Client
✔ Connected to database
...
🚀 Done in Xs
```

### 步骤 3: 验证连接

```bash
# 方式 1: 使用 Prisma
cd backend
pnpm prisma studio

# 方式 2: 使用 psql
psql -U postgres -d job_ai_dev

# 在 psql 中查看表
\dt

# 应该看到以下表:
# - users
# - positions
# - interviews
# - experiences
# - experience_comments
# - summaries
# - summary_remarks

# 退出
\q
```

---

## 🚀 启动开发服务器

### 后端

```bash
cd backend
pnpm dev
```

**预期输出**:
```
> job-ai-backend@1.0.0 dev
> tsx watch src/index.ts

Server is running on port 8080
Database connected successfully
[2025-02-05 12:00:00] [info]: API server started on port 8080
```

### 前端

```bash
pnpm dev
```

**预期输出**:
```
  VITE v5.4.21  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🧪 测试数据库连接

### 1. 健康检查
```bash
curl http://localhost:8080/api
```

**预期响应**:
```json
{
  "code": 200,
  "message": "API is running",
  "data": {
    "status": "ok",
    "timestamp": "2025-02-05T..."
  }
}
```

### 2. 用户注册测试
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "password": "test123456",
    "nickname": "测试用户"
  }'
```

### 3. 验证数据写入
```bash
# 方式 1: Prisma Studio
cd backend
pnpm prisma studio
# 在浏览器中查看: http://localhost:5555

# 方式 2: psql 查询
psql -U postgres -d job_ai_dev -c "SELECT * FROM users;"
```

---

## 🛠️ 常用数据库操作

### 查看所有表
```bash
psql -U postgres -d job_ai_dev
\dt
```

### 查看表结构
```bash
\d users
\d positions
```

### 查询数据
```sql
-- 查看所有用户
SELECT * FROM users;

-- 查看所有岗位
SELECT * FROM positions;

-- 查看最近 10 条面经
SELECT * FROM experiences ORDER BY createTime DESC LIMIT 10;
```

### 清空数据
```sql
-- 清空所有数据（保留表结构）
TRUNCATE TABLE summary_remarks CASCADE;
TRUNCATE TABLE summaries CASCADE;
TRUNCATE TABLE experience_comments CASCADE;
TRUNCATE TABLE experiences CASCADE;
TRUNCATE TABLE interviews CASCADE;
TRUNCATE TABLE positions CASCADE;
TRUNCATE TABLE users CASCADE;
```

### 删除数据库
```bash
psql -U postgres -c "DROP DATABASE job_ai_dev;"
```

---

## 🔧 故障排除

### 问题 1: 连接被拒绝

**错误**:
```
Connection refused at localhost:5432
```

**解决**:
```bash
# 检查 PostgreSQL 是否运行
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# 启动服务
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### 问题 2: 密码认证失败

**错误**:
```
password authentication failed for user "postgres"
```

**解决**:
1. 检查 .env 中的密码是否正确
2. 重置 PostgreSQL 密码（macOS/Linux）:
```bash
psql -U postgres
ALTER USER postgres WITH PASSWORD 'new_password';
\q
```

### 问题 3: 数据库不存在

**错误**:
```
database "job_ai_dev" does not exist
```

**解决**:
```bash
psql -U postgres -c "CREATE DATABASE job_ai_dev;"
```

### 问题 4: 端口被占用

**错误**:
```
port 5432 is already in use
```

**解决**:
```bash
# 查找占用端口的进程
lsof -i :5432

# 如果不是 PostgreSQL，杀掉进程
kill -9 <PID>
```

---

## 📊 数据库管理工具推荐

### GUI 工具

1. **Prisma Studio** (推荐)
   - 内置，无需安装
   - 启动: `cd backend && pnpm prisma studio`
   - 访问: http://localhost:5555

2. **pgAdmin** (官方工具)
   - 下载: https://www.pgadmin.org/download/
   - 功能强大，适合复杂操作

3. **TablePlus** (付费，易用)
   - 下载: https://tableplus.com/
   - 界面美观，支持多种数据库

4. **DBeaver** (免费)
   - 下载: https://dbeaver.io/
   - 开源，功能全面

### 命令行工具

```bash
# psql - PostgreSQL 官方 CLI
psql -U postgres -d job_ai_dev

# 常用命令
\l          # 列出所有数据库
\dt         # 列出所有表
\d table_name  # 查看表结构
\q          # 退出
```

---

## 🎯 生产环境配置

### 生产数据库配置

当部署到生产环境时，修改 `backend/.env.production`:

```bash
# 生产环境数据库
DATABASE_URL="postgresql://user:password@your-server:5432/job_ai_prod"

# 或使用连接池
DATABASE_URL="postgresql://user:password@your-server-pooler:6543/job_ai_prod?pgbouncer=true"
```

### 数据库备份

```bash
# 备份
pg_dump -U postgres job_ai_dev > backup.sql

# 恢复
psql -U postgres job_ai_dev < backup.sql
```

---

## ✅ 配置检查清单

- [ ] PostgreSQL 已安装并运行
- [ ] 数据库 `job_ai_dev` 已创建
- [ ] backend/.env 已更新 DATABASE_URL
- [ ] `pnpm prisma db push` 成功执行
- [ ] 后端服务启动成功
- [ ] 可以访问 Prisma Studio
- [ ] API 健康检查通过
- [ ] 用户注册功能测试通过

---

**配置完成后，您的本地开发环境就完全独立了！** 🎉
