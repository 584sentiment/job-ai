# 🔧 macOS PostgreSQL 安装和配置指南

**系统**: macOS
**数据库**: PostgreSQL 18
**日期**: 2025-02-05

---

## 📥 当前状态

### 正在进行的操作
✅ **正在安装 PostgreSQL 18**
- 使用 Homebrew 安装
- 预计时间: 3-5 分钟
- 状态: 进行中...

### 安装完成后需要做的事情
1. 启动 PostgreSQL 服务
2. 创建数据库 `job_ai_dev`
3. 配置项目环境
4. 初始化数据库结构
5. 测试连接

---

## 🚀 完整步骤

### 步骤 1: 安装 PostgreSQL（正在进行）

```bash
# 正在后台运行
brew install postgresql@18
```

**预计剩余时间**: 2-3 分钟

**验证安装**:
```bash
# 安装完成后验证
postgres --version
# 应显示: postgres (PostgreSQL) 18.x
```

### 步骤 2: 启动 PostgreSQL 服务

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
