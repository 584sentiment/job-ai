# Docker 部署指南

本文档说明如何使用 Docker 部署 Job-AI 应用。

## 前置条件

- ✅ Docker 已安装
- ✅ PostgreSQL 已安装（本地或容器）
- ✅ Nginx Proxy Manager 已安装
- ✅ 域名已解析到服务器

---

## 第一步：配置后端环境变量

在服务器上创建 `.env` 文件：

```bash
cd /var/www/job-ai/backend
nano .env
```

**`.env` 配置示例**：

```env
# 数据库连接（使用已有的 PostgreSQL）
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/job_ai_dev"

# JWT 密钥（生产环境必须更换！）
JWT_SECRET="请更换为随机强密码-至少32位"

# 服务器端口
PORT=8080

# 环境
NODE_ENV="production"

# 日志级别
LOG_LEVEL="info"

# CORS 允许的源（你的域名）
CORS_ORIGIN="https://your-domain.com,https://www.your-domain.com"

# DeepSeek API
DEEPSEEK_API_KEY="your-api-key"
```

---

## 第二步：配置前端 API 地址

编辑 `web/Dockerfile`，修改 API 地址：

```dockerfile
ARG BUILD_BASE_URL=/
ENV VITE_API_BASE_URL=https://api.your-domain.com/api  # 修改为你的后端域名
```

或者在构建时传入参数：

```bash
docker build --build-arg VITE_API_BASE_URL=https://api.your-domain.com/api ...
```

---

## 第三步：构建和启动容器

```bash
cd /var/www/job-ai

# 构建镜像
docker-compose -f docker-compose.prod.yml build

# 启动容器
docker-compose -f docker-compose.prod.yml up -d

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看容器状态
docker-compose -f docker-compose.prod.yml ps
```

---

## 第四步：配置 Nginx Proxy Manager

### 登录 Nginx Proxy Manager

访问：`http://your-server-ip:81`

默认账号：
- Email: `admin@example.com`
- Password: `changeme`

**首次登录后立即修改密码！**

### 添加前端代理

1. 点击 **"Proxy Hosts"** → **"Add Proxy Host"**
2. 填写配置：
   - **Domain Names**: `your-domain.com` 和 `www.your-domain.com`
   - **Scheme**: `http`
   - **Forward Hostname/IP**: `172.17.0.1`（Docker 宿主机 IP）
   - **Forward Port**: `3000`（前端容器端口）
3. **SSL** 选项卡：
   - 勾选 **"Force SSL"**
   - **SSL Certificate**: 选择 **"Request a new SSL Certificate"**
   - **Let's Encrypt**: 填写你的邮箱
4. 点击 **"Save"**

### 添加后端 API 代理

1. 点击 **"Proxy Hosts"** → **"Add Proxy Host"**
2. 填写配置：
   - **Domain Names**: `api.your-domain.com`
   - **Scheme**: `http`
   - **Forward Hostname/IP**: `172.17.0.1`
   - **Forward Port**: `8080`（后端容器端口）
3. **SSL** 选项卡：
   - 勾选 **"Force SSL"**
   - **SSL Certificate**: 选择 **"Request a new SSL Certificate"**
   - **Let's Encrypt**: 填写你的邮箱
4. 点击 **"Save"**

---

## 第五步：验证部署

```bash
# 检查容器状态
docker ps

# 检查后端健康
curl http://localhost:8080/api/health

# 检查前端
curl -I http://localhost:3000

# 查看容器日志
docker logs job-ai-backend
docker logs job-ai-web
```

访问：
- 前端：`https://your-domain.com`
- 后端 API：`https://api.your-domain.com/api/health`

---

## 常用管理命令

### 容器管理

```bash
# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 查看容器日志
docker logs job-ai-backend -f
docker logs job-ai-web -f

# 重启容器
docker restart job-ai-backend
docker restart job-ai-web

# 停止容器
docker stop job-ai-backend job-ai-web

# 删除容器
docker rm job-ai-backend job-ai-web

# 进入容器（调试用）
docker exec -it job-ai-backend sh
```

### Docker Compose 管理

```bash
# 启动所有服务
docker-compose -f docker-compose.prod.yml up -d

# 停止所有服务
docker-compose -f docker-compose.prod.yml down

# 重启服务
docker-compose -f docker-compose.prod.yml restart

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f backend

# 重新构建并启动
docker-compose -f docker-compose.prod.yml up -d --build
```

### 更新部署

```bash
cd /var/www/job-ai

# 拉取最新代码
git pull

# 重新构建镜像
docker-compose -f docker-compose.prod.yml build

# 重启容器
docker-compose -f docker-compose.prod.yml up -d
```

---

## 数据库迁移

如果数据库结构有更新：

```bash
# 进入后端容器
docker exec -it job-ai-backend sh

# 推送 schema 到数据库
npx prisma db push

# 或运行迁移
npx prisma migrate deploy

# 退出容器
exit
```

---

## 端口说明

| 服务 | 容器端口 | 宿主机端口 | 说明 |
|------|---------|-----------|------|
| 后端 API | 8080 | 8080 | 后端服务 |
| 前端 | 80 | 3000 | 前端静态文件 |
| Nginx Proxy Manager | 81 | 81 | 管理界面 |

---

## 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker logs job-ai-backend

# 检查容器配置
docker inspect job-ai-backend
```

### 数据库连接失败

1. 检查 PostgreSQL 是否运行：
   ```bash
   docker ps | grep postgres
   # 或
   systemctl status postgresql
   ```

2. 检查 `.env` 中的 `DATABASE_URL` 是否正确

3. 测试数据库连接：
   ```bash
   psql postgresql://postgres:password@localhost:5432/job_ai_dev
   ```

### 前端无法连接后端 API

1. 检查 `web/Dockerfile` 中的 `VITE_API_BASE_URL` 是否正确

2. 检查后端 CORS 配置

3. 检查 Nginx Proxy Manager 的代理配置

### SSL 证书申请失败

1. 确保域名已正确解析到服务器 IP

2. 检查防火墙是否开放 80 和 443 端口：
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

3. 查看 Nginx Proxy Manager 日志

---

## 安全建议

1. **修改默认密码**
   - Nginx Proxy Manager 管理界面密码
   - 数据库密码
   - JWT_SECRET

2. **配置防火墙**
   ```bash
   sudo ufw enable
   sudo ufw allow 22/tcp  # SSH
   sudo ufw allow 80/tcp  # HTTP
   sudo ufw allow 443/tcp # HTTPS
   ```

3. **定期备份数据库**
   ```bash
   pg_dump -U postgres job_ai_dev > backup.sql
   ```

4. **定期更新**
   ```bash
   # 更新系统
   sudo apt update && sudo apt upgrade -y

   # 更新 Docker
   docker-compose -f docker-compose.prod.yml pull
   docker-compose -f docker-compose.prod.yml up -d
   ```

---

## 性能优化

### 限制容器资源

在 `docker-compose.prod.yml` 中添加：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

### 启用 Docker 日志轮转

在 `/etc/docker/daemon.json` 中添加：

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

重启 Docker：
```bash
sudo systemctl restart docker
```

---

## 监控

### 查看容器资源使用

```bash
docker stats
```

### 查看容器日志

```bash
docker logs job-ai-backend --tail 100 -f
```

---

## 备份与恢复

### 备份数据库

```bash
# 导出数据库
docker exec postgres-container pg_dump -U postgres job_ai_dev > backup.sql

# 或使用本地 psql
pg_dump -U postgres -h localhost job_ai_dev > backup.sql
```

### 恢复数据库

```bash
# 导入数据库
cat backup.sql | docker exec -i postgres-container psql -U postgres job_ai_dev

# 或使用本地 psql
psql -U postgres -h localhost job_ai_dev < backup.sql
```

---

## 联系与支持

如有问题，请查看：
- 项目文档：[docs/](./)
- 问题反馈：[GitHub Issues](https://github.com/your-repo/issues)
