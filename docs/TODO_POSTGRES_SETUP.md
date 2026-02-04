# ✅ PostgreSQL 安装和配置 - 待办清单

**配置时间**: 2025-02-05
**系统**: macOS
**方案**: Docker（已安装 Docker 25.0.3）
**目标**: 配置本地 PostgreSQL 数据库用于开发

---

## 📋 方案变更

### ❌ 原方案问题
- Homebrew 安装 PostgreSQL 18 网络超时
- 下载卡在 3% (620KB / ~20MB)
- 原因: ghcr.io 访问缓慢

### ✅ 新方案
- 使用 Docker 运行 PostgreSQL
- 优势: 快速（5分钟）、稳定、隔离
- 状态: **准备执行**

---

## 🚀 执行步骤（5 分钟）

### 步骤 1: 启动 Docker Desktop

```bash
# 打开 Docker Desktop
open -a Docker
```

**等待 Docker 图标显示为运行状态**（约 30 秒）

---

### 步骤 2: 运行自动设置脚本

```bash
# 从项目根目录运行
bash scripts/setup-postgres-docker.sh
```

**脚本会自动完成**：
- ✅ 检查 Docker 状态
- ✅ 创建 PostgreSQL 容器
- ✅ 配置数据持久化
- ✅ 测试数据库连接
- ✅ 验证数据库存在

**预计时间**: 2 分钟

**预期输出**:
```
✅ Docker 已运行
✅ PostgreSQL 容器已启动
✅ 数据库连接成功
✅ 数据库 'job_ai_dev' 已存在
```

---

### 步骤 3: 初始化数据库结构

```bash
# 进入后端目录
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

---

### 步骤 4: 验证配置

```bash
# 使用 Prisma Studio 查看数据库
pnpm prisma studio
```

浏览器访问: http://localhost:5555

应该能看到所有数据表（User, Position, Interview 等）

---

### 步骤 5: 启动后端服务

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

## ✅ 验证清单

完成配置后，请确认以下项目：

- [ ] Docker Desktop 正在运行
- [ ] 容器 `job-ai-postgres` 正在运行（`docker ps`）
- [ ] 数据库 `job_ai_dev` 已创建
- [ ] Prisma Client 已生成（`backend/node_modules/.prisma/client` 存在）
- [ ] 数据库结构已推送（`pnpm prisma db push` 成功）
- [ ] 后端服务启动成功（无数据库错误）
- [ ] 可以访问 Prisma Studio（http://localhost:5555）
- [ ] API 健康检查通过（`curl http://localhost:8080/api`）

---

## 🛠️ 常见问题解决

### Q1: Docker 未运行

```bash
# 启动 Docker Desktop
open -a Docker

# 等待 30 秒后验证
docker info
```

---

### Q2: 端口 5432 被占用

```bash
# 查找占用进程
lsof -i :5432

# 如果是 Homebrew PostgreSQL，停止它
brew services stop postgresql@*  # 停止所有 Homebrew PostgreSQL

# 重新运行脚本
bash scripts/setup-postgres-docker.sh
```

---

### Q3: 容器启动失败

```bash
# 查看容器日志
docker logs job-ai-postgres

# 删除容器重新创建
docker rm -f job-ai-postgres
bash scripts/setup-postgres-docker.sh
```

---

### Q4: Prisma 连接失败

```bash
# 确认 DATABASE_URL 正确
cat backend/.env | grep DATABASE_URL

# 应该是:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_ai_dev"

# 测试连接
docker exec -it job-ai-postgres psql -U postgres -d job_ai_dev -c "SELECT 1;"
```

---

## 📚 参考文档

### 详细指南
- **[INSTALL_GUIDE_MACOS.md](./INSTALL_GUIDE_MACOS.md)** - 完整安装指南（含 Docker 方案）
- **[POSTGRES_INSTALL_QUICK.md](./POSTGRES_INSTALL_QUICK.md)** - 快速参考
- **[scripts/setup-postgres-docker.sh](../scripts/setup-postgres-docker.sh)** - 自动化脚本

### 官方文档
- PostgreSQL: https://www.postgresql.org/docs/
- Docker Hub: https://hub.docker.com/_/postgres

---

## 🎯 下一步

**请按照上述步骤 1-5 依次执行**

**预计总配置时间**: 5 分钟

**完成后，您将拥有**:
- ✅ Docker PostgreSQL 数据库
- ✅ 完整的开发环境
- ✅ 可以离线开发的系统
- ✅ 数据持久化存储

---

## 📊 容器管理命令

```bash
# 查看运行状态
docker ps | grep job-ai-postgres

# 查看日志
docker logs -f job-ai-postgres

# 停止容器
docker stop job-ai-postgres

# 启动容器
docker start job-ai-postgres

# 重启容器
docker restart job-ai-postgres

# 删除容器（数据保留在 volume）
docker rm -f job-ai-postgres

# 连接到数据库
docker exec -it job-ai-postgres psql -U postgres -d job_ai_dev
```

---

**当前状态**: ✅ 准备就绪，等待执行

**建议**: 打开 Docker Desktop，然后运行自动设置脚本！🚀
