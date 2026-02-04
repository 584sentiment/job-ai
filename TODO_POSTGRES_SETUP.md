# ✅ PostgreSQL 安装和配置 - 待办清单

**配置时间**: 2025-02-05
**系统**: macOS
**目标**: 配置本地 PostgreSQL 数据库用于开发

---

## 📋 待办事项

### ⏳ 正在进行（3-5 分钟）

- [ ] **PostgreSQL 18 安装中**
  - 命令: `brew install postgresql@18`
  - 状态: 后台运行中
  - 预计剩余: 2-3 分钟

**请等待安装完成后再执行以下步骤**

---

### 📝 安装完成后的步骤

#### 步骤 1: 验证安装

```bash
# 验证 PostgreSQL 已安装
postgres --version

# 应显示: postgres (PostgreSQL) 18.x
```

#### 步骤 2: 启动 PostgreSQL 服务

```bash
# 启动服务
brew services start postgresql@18

# 验证服务状态
brew services list | grep postgresql

# 预期输出: postgresql@18 started
```

#### 步骤 3: 创建应用数据库

```bash
# 方式 1: 使用 psql 命令行
psql -U postgres
# 在 psql 中输入: CREATE DATABASE job_ai_dev;
# 然后输入: \q

# 方式 2: 使用一行命令
psql -U postgres -c "CREATE DATABASE job_ai_dev;"
```

#### 步骤 4: 检查数据库密码配置

**PostgreSQL on macOS 默认情况**:
- 用户名: `postgres`
- 密码: 通常为**空**

**当前配置** (`backend/.env`):
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_ai_dev"
```

**如果您的密码为空**，修改为:
```bash
DATABASE_URL="postgresql://postgres:@localhost:5432/job_ai_dev"
```

**编辑命令**:
```bash
nano backend/.env
# 或
vim backend/.env
```

#### 步骤 5: 初始化数据库结构

```bash
cd backend

# 生成 Prisma Client
pnpm prisma generate

# 推送数据库结构
pnpm prisma db push

# 预期输出: ✔ Connected to database
```

#### 步骤 6: 测试数据库连接

```bash
# 方式 1: 命令行
psql -U postgres -d job_ai_dev -c "SELECT version();"

# 方式 2: Prisma Studio
pnpm prisma studio
# 浏览器访问: http://localhost:5555

# 方式 3: 测试后端
curl http://localhost:8080/api
```

#### 步骤 7: 启动开发服务器

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

## ✅ 验证清单

完成配置后，请确认以下项目：

- [ ] PostgreSQL 已安装（`postgres --version`）
- [ ] PostgreSQL 服务已启动（`brew services list`）
- [ ] 数据库 `job_ai_dev` 已创建
- [ ] Prisma Client 已生成（`backend/node_modules/.prisma/client` 存在）
- [ ] 数据库结构已推送（`pnpm prisma db push` 成功）
- [ ] 后端服务启动成功（无数据库错误）
- [ ] 可以访问 Prisma Studio（http://localhost:5555）
- [ ] API 健康检查通过（`curl http://localhost:8080/api`）

---

## 🛠️ 常见问题解决

### Q1: brew services 命令不存在

```bash
# 安装 services tap
brew tap homebrew/services

# 重新启动
brew services start postgresql@18
```

### Q2: 端口 5432 被占用

```bash
# 查找占用进程
lsof -i :5432

# 停止该进程
sudo kill <PID>

# 重启 PostgreSQL
brew services restart postgresql@18
```

### Q3: 密码认证失败

**方案 A**: 使用空密码
```bash
DATABASE_URL="postgresql://postgres:@localhost:5432/job_ai_dev"
```

**方案 B**: 重置密码
```bash
psql -U postgres
ALTER USER postgres WITH PASSWORD 'new_password';
\q
```

### Q4: 数据库连接失败

```bash
# 检查服务状态
brew services list | grep postgresql

# 重启服务
brew services restart postgresql@18

# 检查端口
lsof -i :5432
```

---

## 📚 参考文档

### 详细指南
- **[INSTALL_GUIDE_MACOS.md](./INSTALL_GUIDE_MACOS.md)** - 完整安装指南
- **[QUICK_SETUP_GUIDE.md](./QUICK_SETUP_GUIDE.md)** - 快速配置指南
- **[docs/QUICK_START_LOCAL_DB.md](./docs/QUICK_START_LOCAL_DB.md)** - 本地数据库配置

### 官方文档
- PostgreSQL: https://www.postgresql.org/docs/
- Homebrew: https://docs.brew.sh/

---

## 🎯 下一步

**PostgreSQL 安装完成后，请按照上述步骤 1-7 依次执行**

**预计总配置时间**: 8-10 分钟

**完成后，您将拥有**:
- ✅ 本地 PostgreSQL 数据库
- ✅ 完整的开发环境
- ✅ 可以离线开发的系统

---

**当前状态**: ⏳ 等待 PostgreSQL 安装完成...

**建议**: 先休息一下，安装完成后回来继续配置！☕
