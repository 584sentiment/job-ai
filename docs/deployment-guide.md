# 腾讯云服务器部署与 CI/CD 配置指南

> 更新时间：2025-02-05

## 项目概述

将求职追踪助手（job-ai）项目部署到腾讯云服务器（IP: 124.220.83.152），通过 GitHub Actions 实现 CI/CD 自动化部署。

**域名**: job.100million.top

**已有基础设施**（通过 1Panel 安装）：
- ✅ Nginx Proxy Manager（反向代理 + SSL 管理）
- ✅ PostgreSQL 18.1-alpine（Docker 容器）
- ✅ Docker
- ✅ Docker Compose

## 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                      腾讯云服务器                              │
│                  124.220.83.152                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Nginx Proxy Manager (1Panel)                  │   │
│  │              管理 SSL 和反向代理                       │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   │                                          │
│    ┌──────────────┴────────────────┐                        │
│    │                               │                        │
│  ┌─▼──────────┐          ┌──────▼─────┐                   │
│  │ Frontend   │          │  Backend   │                   │
│  │  (Docker)  │          │  (Docker)  │                   │
│  │   :3000    │          │   :3001    │                   │
│  └────────────┘          └──────┬─────┘                   │
│                                 │                           │
│                         ┌───────▼──────────┐               │
│                         │  PostgreSQL      │               │
│                         │  (1Panel 容器)   │               │
│                         └──────────────────┘               │
│                                                           │
└───────────────────────────────────────────────────────────┘
                                ▲
                                │
                          GitHub Actions
                      (自动构建 + 部署)
```

## 部署步骤

### 第一步：获取 PostgreSQL 连接信息

#### 1.1 在 1Panel 中查找 PostgreSQL 配置

**方法 1：通过 1Panel 容器面板**

1. 登录 1Panel（通常在 `http://your-server-ip:port`）
2. 进入「容器」→「容器」菜单
3. 找到 `postgres:18.1-alpine` 容器
4. 点击容器名称查看详情

**需要记录的信息**：
- **容器名称**：例如 `1panel-postgres` 或 `postgres`
- **端口映射**：例如 `5432:5432` 或 `外部端口:5432`
- **环境变量**：查找 `POSTGRES_USER`、`POSTGRES_PASSWORD`、`POSTGRES_DB`

**方法 2：通过命令行查询**

SSH 连接到服务器后执行：

```bash
# 查看所有 PostgreSQL 容器
docker ps | grep postgres

# 查看容器详细信息（替换 <container_name> 为实际容器名）
docker inspect <container_name>

# 查看环境变量
docker inspect <container_name> | grep -A 20 "Env"

# 查看端口映射
docker inspect <container_name> | grep -A 10 "PortBindings"
```

#### 1.2 创建 job-ai 专用数据库和用户

**方法 1：通过 1Panel 数据库管理**

1. 登录 1Panel
2. 进入「数据库」→「PostgreSQL」菜单
3. 找到 PostgreSQL 实例，点击「管理」或「终端」
4. 进入数据库命令行

**方法 2：通过 Docker 命令**

```bash
# 进入 PostgreSQL 容器（替换 <container_name>）
docker exec -it <container_name> psql -U postgres
```

**创建数据库和用户**：

```sql
-- 创建用户（密码请替换为强随机字符串）
CREATE USER jobai_user WITH ENCRYPTED PASSWORD 'your_strong_password_here';

-- 创建数据库
CREATE DATABASE job_ai_prod OWNER jobai_user;

-- 授权
GRANT ALL PRIVILEGES ON DATABASE job_ai_prod TO jobai_user;

-- 退出
\q
```

**生成强密码**：
```bash
openssl rand -base64 32
```

#### 1.3 记录连接信息

完成上述步骤后，记录以下信息：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **容器名称** | `postgres` 或 `1panel-postgres` | Docker 容器名 |
| **主机地址** | `postgres` 或 `host.docker.internal` | Docker 网络内地址 |
| **端口** | `5432` | PostgreSQL 默认端口 |
| **数据库名** | `job_ai_prod` | 创建的数据库名 |
| **用户名** | `jobai_user` | 创建的用户名 |
| **密码** | `生成的强密码` | 数据库密码 |

**最终连接字符串**（用于环境变量）：
```
postgresql://jobai_user:your_password@postgres:5432/job_ai_prod
```

### 第二步：准备部署文件

#### 2.1 克隆代码到服务器

```bash
# SSH 连接服务器
ssh root@124.220.83.152

# 创建项目目录
mkdir -p /var/www/job-ai

# 克隆代码
cd /var/www
git clone https://github.com/584sentiment/job-ai.git

cd job-ai
```

#### 2.2 配置 Docker 网络

```bash
# 创建 job-ai 网络
docker network create job-ai-network

# 将 PostgreSQL 容器连接到 job-ai 网络（替换 <postgres_container_name>）
docker network connect job-ai-network <postgres_container_name>

# 验证网络连接
docker network inspect job-ai-network
```

#### 2.3 创建后端环境变量

**文件**: `/var/www/job-ai/backend/.env`

```env
# 数据库配置
DATABASE_URL="postgresql://jobai_user:YOUR_DB_PASSWORD@postgres:5432/job_ai_prod"

# JWT 配置
JWT_SECRET="YOUR_JWT_SECRET_64_CHARS"

# 服务器配置
PORT=3001
NODE_ENV=production

# CORS 配置
CORS_ORIGIN="https://job.100million.top"

# AI 服务配置（可选）
DEEPSEEK_API_KEY="sk-your-deepseek-api-key"
```

**生成 JWT_SECRET**：
```bash
openssl rand -base64 64
```

### 第三步：配置 Nginx Proxy Manager

#### 3.1 登录 Nginx Proxy Manager

1. 访问 Nginx Proxy Manager（通常在 `http://your-server-ip:port`，默认端口 81）
2. 使用默认凭据登录：
   - 默认用户名：`admin@example.com`
   - 默认密码：`changeme`
3. 首次登录后立即修改密码

#### 3.2 添加反向代理 - 前端

1. 点击「Proxy Hosts」→「Add Proxy Host」
2. 填写配置：
   - **Domain Names**: `job.100million.top`
   - **Scheme**: `http`
   - **Forward Hostname/IP**: `localhost`
   - **Forward Port**: `3000`
   - **Cache Assets**: ✅
   - **Block Common Exploits**: ✅
   - **Websockets Support**: ❌

3. 点击「Save」

#### 3.3 添加反向代理 - 后端 API

编辑刚创建的 Proxy Host（`job.100million.top`），点击「Custom Locations」，添加：

```
location /api/ {
    proxy_pass http://localhost:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

#### 3.4 配置 SSL 证书

1. 编辑 Proxy Host（`job.100million.top`）
2. 点击「SSL」标签
3. 配置：
   - **SSL Certificate**: 「Request a new SSL Certificate」
   - **Domain Names**: `job.100million.top`
   - **Email Address for Let's Encrypt**: 您的邮箱
   - **Agree to Let's Encrypt Terms of Service**: ✅
4. 点击「Save」

Nginx Proxy Manager 会自动申请和配置 SSL 证书，并强制 HTTPS 重定向。

### 第四步：启动服务

#### 4.1 构建并启动容器

```bash
cd /var/www/job-ai

# 构建并启动所有服务
docker-compose up -d --build

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

#### 4.2 初始化数据库

```bash
# 等待后端容器启动（约 30 秒）
sleep 30

# 生成 Prisma Client
docker exec job-ai-backend npx prisma generate

# 推送数据库 schema
docker exec job-ai-backend npx prisma db push

# 可选：填充种子数据
docker exec job-ai-backend npx prisma seed
```

#### 4.3 验证部署

```bash
# 查看所有容器
docker ps

# 测试后端健康检查
curl http://localhost:3001/api/health

# 测试前端
curl http://localhost:3000/health

# 通过域名测试
curl https://job.100million.top
curl https://job.100million.top/api/health
```

### 第五步：配置 GitHub Actions

#### 5.1 生成 SSH 密钥

**本地执行**：

```bash
# 生成 SSH 密钥对
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_job_ai -N ""

# 复制公钥到服务器
ssh-copy-id -i ~/.ssh/github_actions_job_ai.pub root@124.220.83.152

# 测试连接
ssh -i ~/.ssh/github_actions_job_ai root@124.220.83.152

# 复制私钥内容（用于 GitHub Secret）
cat ~/.ssh/github_actions_job_ai
```

#### 5.2 配置 GitHub Secrets

在 GitHub 仓库中配置以下 Secrets（Settings → Secrets and variables → Actions）：

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `SERVER_HOST` | 服务器 IP | `124.220.83.152` |
| `SERVER_USERNAME` | 服务器用户名 | `root` |
| `SSH_PRIVATE_KEY` | SSH 私钥 | 完整的私钥内容 |
| `DB_PASSWORD` | 数据库密码 | 您的数据库密码 |
| `JWT_SECRET` | JWT 密钥 | 您的 JWT 密钥 |
| `DEEPSEEK_API_KEY` | DeepSeek API（可选） | `sk-xxx` |

### 第六步：测试 CI/CD

#### 6.1 触发自动部署

```bash
# 本地执行
git add .
git commit -m "feat: 配置 CI/CD 自动部署"
git push origin main
```

#### 6.2 监控部署

1. 访问 GitHub 仓库 → Actions 标签
2. 查看 "Deploy to Production" workflow 运行状态
3. 点击具体任务查看详细日志

#### 6.3 验证部署

```bash
# 在服务器上查看容器状态
ssh root@124.220.83.152
docker ps

# 查看日志
docker logs -f job-ai-backend
docker logs -f job-ai-frontend

# 测试服务
curl https://job.100million.top
curl https://job.100million.top/api/health
```

### 第七步：创建数据库备份脚本

#### 7.1 配置备份脚本

备份脚本已创建在 `scripts/backup-db.sh`，需要在服务器上设置：

```bash
# 添加执行权限
chmod +x /var/www/job-ai/scripts/backup-db.sh

# 编辑 crontab
crontab -e

# 添加以下行（每天凌晨 2 点自动备份）
0 2 * * * /var/www/job-ai/scripts/backup-db.sh >> /var/backups/job-ai/backup.log 2>&1
```

#### 7.2 手动测试备份

```bash
# 手动运行备份脚本
/var/www/job-ai/scripts/backup-db.sh

# 检查备份文件
ls -lh /var/backups/job-ai/
```

## 验证清单

### 服务器配置

- [ ] PostgreSQL 连接信息已获取
- [ ] 数据库 `job_ai_prod` 和用户 `jobai_user` 已创建
- [ ] 代码已克隆到 `/var/www/job-ai`
- [ ] Docker 网络 `job-ai-network` 已创建
- [ ] PostgreSQL 容器已连接到 `job-ai-network`
- [ ] 环境变量文件已配置

### 应用部署

- [ ] 前端和后端容器已启动
- [ ] 数据库 schema 已推送
- [ ] 容器健康检查正常

### Nginx Proxy Manager

- [ ] 前端反向代理已配置（job.100million.top → localhost:3000）
- [ ] 后端反向代理已配置（/api/ → localhost:3001）
- [ ] SSL 证书已申请并生效
- [ ] HTTPS 强制重定向已启用

### CI/CD

- [ ] GitHub Secrets 已配置
- [ ] SSH 密钥已配置
- [ ] GitHub Actions workflow 可以成功运行
- [ ] 代码推送后能自动部署

### 备份

- [ ] 数据库备份脚本已创建
- [ ] 定时任务已配置
- [ ] 备份文件正常生成

## 故障排查

### PostgreSQL 连接问题

**症状**: 后端日志显示数据库连接失败

**解决方案**:

```bash
# 1. 检查 PostgreSQL 容器是否运行
docker ps | grep postgres

# 2. 检查网络连接
docker network inspect job-ai-network

# 3. 测试数据库连接
docker exec -it <postgres_container> psql -U jobai_user -d job_ai_prod

# 4. 从后端容器测试
docker exec job-ai-backend ping postgres

# 5. 检查环境变量
docker exec job-ai-backend env | grep DATABASE
```

### 容器网络问题

**症状**: 容器无法互相访问

**解决方案**:

```bash
# 查看网络详情
docker network inspect job-ai-network

# 确保 PostgreSQL 在网络中
docker network connect job-ai-network <postgres_container>

# 重启容器
docker restart job-ai-backend
```

### Nginx Proxy Manager 配置问题

**症状**: 域名无法访问或 502 错误

**解决方案**:

1. 检查容器是否运行：
   ```bash
   docker ps | grep nginx
   ```

2. 检查端口是否正确：
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3001/api/health
   ```

3. 查看 Nginx Proxy Manager 日志

4. 验证 DNS 解析：
   ```bash
   nslookup job.100million.top
   ```

## 维护建议

### 日常维护

1. **查看容器状态**
   ```bash
   docker ps
   docker stats
   ```

2. **查看日志**
   ```bash
   docker logs -f job-ai-backend
   docker logs -f job-ai-frontend
   ```

3. **清理资源**
   ```bash
   docker system prune -a
   ```

### 安全加固

1. **定期更新系统**
   ```bash
   apt update && apt upgrade -y
   ```

2. **定期备份数据库**
   - 验证备份脚本运行正常
   - 定期测试备份恢复

3. **监控日志**
   ```bash
   tail -f /var/backups/job-ai/backup.log
   ```

## 关键文件清单

### 已创建的文件

1. ✅ **web/Dockerfile** - 前端 Docker 镜像
2. ✅ **web/nginx.conf** - 前端容器 Nginx 配置
3. ✅ **backend/Dockerfile** - 后端 Docker 镜像（已存在）
4. ✅ **docker-compose.yml** - Docker Compose 配置（已更新）
5. ✅ **scripts/backup-db.sh** - 数据库备份脚本
6. ✅ **.github/workflows/deploy-production.yml** - CI/CD workflow

### 需要配置的服务

1. **Docker 网络** - 连接 PostgreSQL 容器
2. **Nginx Proxy Manager** - 反向代理和 SSL 证书
3. **GitHub Secrets** - CI/CD 环境变量
4. **Crontab** - 数据库定时备份

## 总结

本方案利用已有的 1Panel 基础设施，实现了：

✅ **简化部署** - 利用已有的 PostgreSQL 和 Nginx Proxy Manager
✅ **全容器化** - 前后端均使用 Docker 部署
✅ **自动化部署** - GitHub Actions CI/CD
✅ **SSL 证书** - Nginx Proxy Manager 自动管理
✅ **数据安全** - 自动备份脚本
✅ **易于维护** - Docker 容器化管理

部署完成后，您只需推送代码到 GitHub，系统将自动完成构建和部署，真正实现 CI/CD 自动化。

---


## GitHub Container Registry 配置（2026-02-06 更新）

> **重要变更**：从"服务器构建"改为"GitHub Actions 构建 + GHCR 部署"

### 新架构优势

```
旧架构：代码 → GitHub Actions → SCP 传输 → 服务器构建 → 启动
        ↓ 慢，大量文件    ↓ 慢，需要 Node.js

新架构：代码 → GitHub Actions 构建镜像 → 推送到 GHCR
                                         ↓ 快（只传差异层）
        服务器 docker compose pull → docker compose up -d
        ↓ 快，只需 Docker
```

**优势**：
- ✅ 服务器不需要访问 GitHub（解决国内网络问题）
- ✅ 服务器不需要 Node.js/pnpm 等构建工具
- ✅ 镜像可复用，只需拉取差异层
- ✅ 部署速度更快
- ✅ 更容易回滚（切换镜像标签）
- ✅ 完全免费，无额度限制
- ✅ 与 GitHub 深度集成，无需额外配置

### 配置步骤

#### 1. 启用 GitHub Container Registry

GitHub Container Registry 默认已启用，无需额外配置。

#### 2. 无需配置 Secrets

GHCR 使用 `GITHUB_TOKEN` 自动认证，无需手动配置任何 Secrets！

#### 3. 配置文件已就绪

以下文件已配置完成，无需修改：
- `.github/workflows/build-images.yml` - 构建并推送到 GHCR
- `docker-compose.yml` - 使用 GHCR 镜像

**镜像地址**：
- 后端：`ghcr.io/584sentiment/job-ai-backend:main`
- 前端：`ghcr.io/584sentiment/job-ai-frontend:main`

#### 4. 服务器首次配置

SSH 登录服务器，执行：

```bash
cd /var/www/job-ai

# 拉取镜像（首次需要，可能需要几分钟）
docker compose pull

# 启动服务
docker compose up -d
```

### 工作流程

```
代码推送
  ↓
触发 build-images.yml
  ↓
GitHub Actions 构建镜像
  ↓
推送到 GitHub Container Registry
  ↓
触发 deploy-production.yml
  ↓
服务器 docker compose pull
  ↓
服务器 docker compose up -d
  ↓
部署完成
```

### 验证配置

#### 手动触发构建

1. GitHub → Actions → "Build and Push Docker Images"
2. 点击 "Run workflow" → 选择 `main` 分支
3. 等待构建完成（约 5-10 分钟）

#### 检查镜像

在 GitHub 仓库页面：
1. 点击仓库上方的 "Packages"
2. 查看 `job-ai-backend` 和 `job-ai-frontend` 镜像
3. 确认有 `main` 标签

### 故障排查

**问题 1：镜像拉取失败**
```bash
Error: image not found
```
解决：
1. 检查 GitHub Actions 构建是否成功
2. 检查镜像名称和标签是否正确
3. 确认仓库是公开的，或服务器已登录 GHCR

**问题 2：服务器需要登录 GHCR（私有仓库）**
```bash
# 生成 GitHub Personal Access Token
# 1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
# 2. Generate new token (classic)
# 3. 勾选 `read:packages` 权限
# 4. 复制 token

# 服务器登录
echo "your-github-token" | docker login ghcr.io -u your-username --password-stdin
```

**问题 3：health-check 失败**
```bash
# 检查容器状态
docker compose ps

# 查看日志
docker compose logs backend
docker compose logs frontend
```

### 更新的文件清单

新增：
- `.github/workflows/build-images.yml` - 构建并推送到 GHCR

更新：
- `.github/workflows/deploy-production.yml` - 简化为 pull + up
- `docker-compose.yml` - 使用 GHCR 镜像地址
