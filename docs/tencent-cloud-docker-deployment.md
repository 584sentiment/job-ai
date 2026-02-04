# 腾讯云服务器部署指南 (Docker 方案)

## 概述

本指南介绍如何将求职追踪助手项目部署到腾讯云轻量服务器，使用 Docker 容器化部署，并配置 GitHub Actions 实现代码推送后自动部署。

**服务器环境**：
- 腾讯云轻量服务器
- 1Panel 管理面板
- Nginx Proxy Manager（反向代理 + SSL）
- PostgreSQL 数据库

**部署架构**：
```
GitHub → GitHub Actions → SSH → 服务器 (Docker) → 后端服务
                                              ↓
                                         Nginx Proxy Manager
                                              ↓
                                         前端静态文件
```

---

## 前置条件

### 1. 服务器要求
- 操作系统：Ubuntu 20.04+ / CentOS 8+ / OpenCloudOS
- 内存：至少 2GB RAM
- 存储：至少 20GB
- 已安装 Docker 和 Docker Compose
- 已安装 PostgreSQL（通过 1Panel 或手动安装）

### 2. 域名和 DNS
- 已有域名（如 `job.100million.top`）
- DNS 已解析到服务器 IP

### 3. 本地环境
- Git 已安装
- 已有 GitHub 账户

---

## 部署步骤

### 第一步：服务器准备

#### 1.1 安装 Docker（如未安装）

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

# 启动 Docker
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
```

#### 1.2 安装 Docker Compose（如未安装）

```bash
# 下载 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

#### 1.3 创建项目目录

```bash
# 创建目录
sudo mkdir -p /var/www/job-ai

# 设置权限
sudo chown -R $USER:$USER /var/www/job-ai
```

#### 1.4 配置 SSH 密钥（用于 GitHub Actions）

```bash
# 生成 SSH 密钥对
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""

# 将公钥添加到 authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# 测试 SSH 连接
ssh -i ~/.ssh/github_actions localhost
```

**保存私钥内容**（后续配置 GitHub Secrets 需要用到）：
```bash
cat ~/.ssh/github_actions
```

---

### 第二步：配置数据库

#### 2.1 创建数据库和用户

**方式一：使用 1Panel 创建**
1. 登录 1Panel 管理面板
2. 进入"数据库"→"PostgreSQL"
3. 创建数据库：`jobai_db`
4. 创建用户：`jobai_user` 并设置密码
5. 授予用户对数据库的所有权限

**方式二：命令行创建**

```sql
-- 连接到 PostgreSQL
sudo -u postgres psql

-- 创建用户和数据库
CREATE USER jobai_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE jobai_db OWNER jobai_user;
GRANT ALL PRIVILEGES ON DATABASE jobai_db TO jobai_user;
\q
```

#### 2.2 记录数据库连接信息

```
Host: localhost (或 Docker 容器名称)
Port: 5432
Database: jobai_db
User: jobai_user
Password: **********
```

---

### 第三步：首次部署

#### 3.1 克隆项目到服务器

```bash
cd /var/www/job-ai
git clone https://github.com/your-username/job-ai.git .
```

#### 3.2 创建环境变量文件

```bash
cd /var/www/job-ai/backend
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库连接
DATABASE_URL="postgresql://jobai_user:your_password@localhost:5432/jobai_db"

# JWT 密钥（随机生成）
JWT_SECRET="your_random_jwt_secret"

# 服务端口
PORT=3001

# 运行环境
NODE_ENV=production

# CORS 允许的域名
CORS_ORIGIN="https://job.100million.top"

# 日志级别
LOG_LEVEL=info

# DeepSeek API（可选）
DEEPSEEK_API_KEY="your_api_key"
```

生成随机密钥：
```bash
openssl rand -base64 64
```

#### 3.3 执行部署脚本

```bash
cd /var/www/job-ai
bash scripts/deploy-docker.sh
```

部署脚本会自动完成以下操作：
1. 构建 Docker 镜像
2. 启动后端容器（端口 3001）
3. 执行数据库迁移
4. 构建前端静态文件

---

### 第四步：配置 Nginx Proxy Manager

#### 4.1 登录 Nginx Proxy Manager

访问：`http://your-server-ip:81`（默认端口）

#### 4.2 添加代理主机

**配置后端 API**：

1. 点击"Proxy Hosts"→"Add Proxy Host"
2. 填写配置：
   - **Domain Names**: `api.job.100million.top`（可选，或使用主域名）
   - **Scheme**: `http`
   - **Forward Hostname**: `172.17.0.1`（Docker 宿主机 IP）
   - **Forward Port**: `3001`

3. 启用"Cache Assets"（可选）

4. **SSL 证书**：
   - 选择"SSL"标签
   - 勾选"Force SSL"
   - 选择"Let's Encrypt"或"Custom Certificate"
   - 保存

**配置前端**：

1. 再次点击"Add Proxy Host"
2. 填写配置：
   - **Domain Names**: `job.100million.top`
   - **Scheme**: `http`
   - **Forward Hostname**: `服务器 IP 或 localhost`
   - **Forward Port**: `80`（Nginx 静态文件服务）

3. **Custom Nginx Configuration**（添加到"Advanced"标签）：

```nginx
location / {
    root /var/www/job-ai/web/dist;
    try_files $uri $uri/ /index.html;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# API 反向代理
location /api/ {
    proxy_pass http://172.17.0.1:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

4. **SSL 证书**：同上

---

### 第五步：配置 GitHub Actions

#### 5.1 添加 GitHub Secrets

进入 GitHub 仓库：**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

添加以下 Secrets：

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `SERVER_HOST` | 服务器 IP 或域名 | `124.220.83.152` |
| `SERVER_USERNAME` | SSH 登录用户名 | `root` 或 `ubuntu` |
| `SSH_PRIVATE_KEY` | SSH 私钥内容 | （第一步生成的私钥） |
| `SERVER_PORT` | SSH 端口（可选） | `22` |
| `DATABASE_URL` | 数据库连接字符串 | `postgresql://jobai_user:password@localhost:5432/jobai_db` |
| `JWT_SECRET` | JWT 密钥 | （随机生成的密钥） |
| `DOMAIN` | 域名 | `job.100million.top` |

**重要**：`SSH_PRIVATE_KEY` 的值应该是完整的私钥内容，包括：
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
...
-----END OPENSSH PRIVATE KEY-----
```

#### 5.2 触发自动部署

配置完成后，推送代码到 `main` 分支即可自动触发部署：

```bash
git add .
git commit -m "feat: 新功能"
git push origin main
```

或在 GitHub 网页端：**Actions** → **Deploy to Tencent Cloud (Docker)** → **Run workflow**

---

## 验证部署

### 1. 检查 Docker 容器

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs -f job-ai-backend

# 进入容器
docker exec -it job-ai-backend sh
```

### 2. 检查后端健康状态

```bash
curl http://localhost:3001/api/health
```

预期响应：
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 3. 访问前端

浏览器访问：`https://job.100million.top`

### 4. 检查 GitHub Actions

进入 GitHub 仓库：**Actions** 标签，查看工作流运行状态。

---

## 常用运维命令

### Docker 容器管理

```bash
# 查看容器状态
docker ps -a

# 重启容器
docker restart job-ai-backend

# 停止容器
docker stop job-ai-backend

# 删除容器
docker rm job-ai-backend

# 查看日志
docker logs -f job-ai-backend

# 进入容器
docker exec -it job-ai-backend sh

# 查看容器资源使用
docker stats job-ai-backend
```

### 手动更新部署

```bash
cd /var/www/job-ai
bash scripts/update-deploy.sh
```

### 数据库操作

```bash
# 进入后端容器
docker exec -it job-ai-backend sh

# 执行数据库迁移
npx prisma db push

# 打开 Prisma Studio（数据库可视化管理）
npx prisma studio
```

### 查看日志

```bash
# Docker 容器日志
docker logs -f job-ai-backend

# Nginx 日志
tail -f /var/log/nginx/job-ai-access.log
tail -f /var/log/nginx/job-ai-error.log
```

---

## 故障排查

### 问题 1：容器无法启动

**排查步骤**：
```bash
# 查看容器日志
docker logs job-ai-backend

# 检查环境变量
docker inspect job-ai-backend | grep -A 20 "Env"

# 检查数据库连接
docker exec job-ai-backend sh -c "echo $DATABASE_URL"
```

**常见原因**：
- `.env` 文件配置错误
- 数据库连接失败
- 端口被占用

### 问题 2：健康检查失败

**排查步骤**：
```bash
# 手动检查健康端点
curl http://localhost:3001/api/health

# 检查容器内进程
docker exec job-ai-backend ps aux

# 检查容器健康状态
docker inspect --format='{{json .State.Health}}' job-ai-backend | jq
```

### 问题 3：GitHub Actions 部署失败

**排查步骤**：
1. 检查 GitHub Secrets 是否正确配置
2. 检查 SSH 密钥权限：`chmod 600 ~/.ssh/github_actions`
3. 检查服务器防火墙是否允许 SSH 连接
4. 查看 GitHub Actions 日志

### 问题 4：Nginx 502 错误

**排查步骤**：
```bash
# 检查后端容器是否运行
docker ps | grep job-ai-backend

# 检查端口是否监听
netstat -tlnp | grep 3001

# 检查 Nginx 配置
nginx -t
```

---

## 安全加固

### 1. 限制 SSH 访问

```bash
# 编辑 SSH 配置
sudo nano /etc/ssh/sshd_config

# 禁用密码登录
PasswordAuthentication no

# 限制登录用户
AllowUsers github-actions

# 重启 SSH 服务
sudo systemctl restart sshd
```

### 2. 配置防火墙

```bash
# UFW 防火墙
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 3. 定期备份数据库

```bash
# 创建备份脚本
cat > /var/www/job-ai/scripts/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/jobai"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# 备份数据库
docker exec postgres-container pg_dump -U jobai_user jobai_db > $BACKUP_DIR/backup_$DATE.sql

# 保留最近 7 天的备份
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /var/www/job-ai/scripts/backup-db.sh

# 添加定时任务
crontab -e
# 添加：每天凌晨 2 点备份
0 2 * * * /var/www/job-ai/scripts/backup-db.sh
```

---

## 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2025-01-15 | 初始版本，完成 Docker 自动部署配置 |

---

## 相关文档

- [架构设计文档](/docs/arch-design.md)
- [开发进度文档](/docs/dev-progress.md)
- [问题修复日志](/docs/bug-fix.md)
- [Docker 官方文档](https://docs.docker.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
