# 🎯 本地 PostgreSQL 配置 - 完成总结

**配置日期**: 2025-02-05
**数据库**: PostgreSQL (本地自建)
**状态**: ✅ 配置文件已准备就绪

---

## ✅ 已完成的配置

### 1. 环境配置文件
- ✅ **backend/.env** - 已更新为本地 PostgreSQL
  - 默认连接: `postgresql://postgres:postgres@localhost:5432/job_ai_dev`
  - ⚠️ **需要修改**: 请将密码改为您的实际密码

### 2. 配置工具
- ✅ **setup-local-db.sh** - 自动化配置脚本
  - 交互式配置向导
  - 自动创建数据库
  - 自动初始化表结构

### 3. 配置文档
- ✅ **QUICK_START_LOCAL_DB.md** - 快速开始（3 分钟）
- ✅ **docs/local-postgresql-setup.md** - 详细配置指南
- ✅ **backend/.env.example** - 环境变量示例

---

## 🚀 下一步操作

### 步骤 1: 确保 PostgreSQL 已安装并运行

```bash
# 检查是否安装
psql --version

# 如果未安装，请安装：
# macOS: brew install postgresql@15
# Ubuntu: sudo apt install postgresql
```

### 步骤 2: 运行自动化配置脚本（推荐）

```bash
bash setup-local-db.sh
```

**脚本会提示您输入**:
- 用户名 (默认: `postgres`)
- 密码 (必填)
- 端口 (默认: `5432`)
- 数据库名 (默认: `job_ai_dev`)

### 步骤 3: 手动修改密码（重要！）

打开 `backend/.env` 文件，修改 DATABASE_URL：

```bash
# 如果您的 PostgreSQL 密码不是 "postgres"
# 请修改为实际密码

# 例如，您的密码是 "mypass123"
DATABASE_URL="postgresql://postgres:mypass123@localhost:5432/job_ai_dev"
```

### 步骤 4: 初始化数据库

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

### 步骤 5: 启动开发服务器

**终端 1 - 后端**:
```bash
cd backend
pnpm dev
```

**预期输出**:
```
Server is running on port 8080
Database connected successfully
```

**终端 2 - 前端**:
```bash
pnpm dev
```

**预期输出**:
```
➜  Local:   http://localhost:5173/
```

---

## ✅ 验证配置

### 1. 测试数据库连接

```bash
cd backend

# 方式 1: Prisma Studio
pnpm prisma studio
# 浏览器访问: http://localhost:5555

# 方式 2: 命令行
psql -U postgres -d job_ai_dev
\dt  # 查看所有表
\q   # 退出
```

### 2. 测试后端 API

```bash
curl http://localhost:8080/api
```

**预期响应**:
```json
{
  "code": 200,
  "message": "API is running"
}
```

### 3. 测试前端功能

浏览器访问: http://localhost:5173

1. 注册新用户
2. 登录
3. 添加岗位
4. 查看数据

---

## 🔧 配置说明

### 默认配置

| 配置项 | 值 | 说明 |
|--------|---|------|
| 用户名 | `postgres` | PostgreSQL 默认用户 |
| 密码 | `postgres` | **需要修改为实际密码** |
| 主机 | `localhost` | 本地服务器 |
| 端口 | `5432` | PostgreSQL 默认端口 |
| 数据库 | `job_ai_dev` | 应用数据库 |

### 连接字符串格式

```
postgresql://用户名:密码@主机:端口/数据库名
```

**示例**:
```bash
# 默认配置（密码是 postgres）
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_ai_dev"

# 如果您的密码是 mypass123
DATABASE_URL="postgresql://postgres:mypass123@localhost:5432/job_ai_dev"

# 如果创建了专用用户
DATABASE_URL="postgresql://job_ai_user:userpass@localhost:5432/job_ai_dev"
```

---

## 🛠️ 常见场景

### 场景 1: 首次使用本地 PostgreSQL

**操作步骤**:
1. 确保 PostgreSQL 已安装并运行
2. 运行 `bash setup-local-db.sh`
3. 按提示输入配置信息
4. 等待初始化完成
5. 启动服务

### 场景 2: 只修改密码

**操作步骤**:
1. 打开 `backend/.env`
2. 修改 DATABASE_URL 中的密码
3. 运行 `cd backend && pnpm prisma db push`
4. 启动服务

### 场景 3: 重置数据库

```bash
# 删除所有数据
cd backend
psql -U postgres -d job_ai_dev <<EOF
TRUNCATE TABLE summary_remarks CASCADE;
TRUNCATE TABLE summaries CASCADE;
TRUNCATE TABLE experience_comments CASCADE;
TRUNCATE TABLE experiences CASCADE;
TRUNCATE TABLE interviews CASCADE;
TRUNCATE TABLE positions CASCADE;
TRUNCATE TABLE users CASCADE;
EOF

# 或重新推送结构（危险：会删除表）
pnpm prisma db push --force-reset
```

### 场景 4: 数据库管理

**查看数据**:
```bash
# 方式 1: Prisma Studio (推荐)
cd backend && pnpm prisma studio
# 浏览器: http://localhost:5555

# 方式 2: 命令行
psql -U postgres -d job_ai_dev
\dt          # 查看表
SELECT * FROM users;  # 查询数据
\q           # 退出
```

**备份数据**:
```bash
pg_dump -U postgres job_ai_dev > backup.sql
```

**恢复数据**:
```bash
psql -U postgres job_ai_dev < backup.sql
```

---

## 🔧 故障排除

### 问题 1: 密码认证失败

**错误**: `password authentication failed for user "postgres"`

**解决**: 修改 `backend/.env` 中的密码

```bash
# 查看当前配置
cat backend/.env | grep DATABASE_URL

# 修改密码
nano backend/.env
# 或使用 vim
vim backend/.env
```

### 问题 2: 数据库不存在

**错误**: `database "job_ai_dev" does not exist`

**解决**: 创建数据库

```bash
psql -U postgres -c "CREATE DATABASE job_ai_dev;"
```

### 问题 3: 连接被拒绝

**错误**: `Connection refused at localhost:5432`

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

## 📚 参考文档

### 快速开始
- **[QUICK_START_LOCAL_DB.md](./QUICK_START_LOCAL_DB.md)** - 本地数据库快速开始

### 详细指南
- **[docs/local-postgresql-setup.md](./docs/local-postgresql-setup.md)** - 完整配置指南

### 项目文档
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - 项目状态
- **[QUICK_START.md](./QUICK_START.md)** - 通用快速开始

---

## 🎯 配置清单

在启动服务前，请确认：

- [ ] PostgreSQL 已安装并运行
- [ ] 数据库 `job_ai_dev` 已创建
- [ ] `backend/.env` 中密码已修改为实际密码
- [ ] `pnpm prisma db push` 已成功执行
- [ ] 可以访问 Prisma Studio (`pnpm prisma studio`)

**全部完成后，即可启动服务开始开发！** 🚀
