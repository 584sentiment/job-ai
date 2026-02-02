# OpenCloudOS 服务器部署指南

**服务器信息：**
- IP: 124.220.83.152
- 域名: job.100million.top
- 系统: OpenCloudOS 9.4

---

## 第一步：安装 Node.js 和 PM2

```bash
# 安装 Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v
npm -v

# 安装 PM2
sudo npm install -g pm2

# 验证安装
pm2 -v
```

---

## 第二步：克隆项目代码

```bash
# 创建项目目录
sudo mkdir -p /var/www
cd /var/www

# 克隆项目（请替换为你的仓库地址）
# 方式1: 使用 HTTPS
sudo git clone https://github.com/your-username/job-ai.git

# 方式2: 使用 SSH（如果你已配置 SSH 密钥）
sudo git clone git@github.com:your-username/job-ai.git

# 进入项目目录
cd job-ai

# 设置目录权限
sudo chown -R $USER:$USER /var/www/job-ai
```

---

## 第三步：配置后端

```bash
# 进入后端目录
cd /var/www/job-ai/backend

# 创建 .env 文件
cat > .env << 'EOF'
# 数据库配置（请替换为你的数据库连接字符串）
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# JWT 密钥（请使用随机字符串，生产环境必须修改）
JWT_SECRET="your-random-secret-key-change-this-in-production"

# 服务端口
PORT=3001

# Node 环境
NODE_ENV=production

# CORS 配置
CORS_ORIGIN="https://job.100million.top"
EOF

# 编辑 .env 文件，填写真实的数据库连接字符串
nano .env

# 安装依赖
npm install

# 生成 Prisma Client
npm run prisma:generate

# 推送数据库 schema（如果使用自己的数据库）
npm run prisma:push

# 构建项目
npm run build
```

---

## 第四步：构建前端

```bash
# 进入前端目录
cd /var/www/job-ai/web

# 安装依赖
npm install

# 构建生产版本
npm run build

# 验证构建结果
ls -la dist/
```

---

## 第五步：配置 PM2

```bash
# 进入后端目录
cd /var/www/job-ai/backend

# 创建 PM2 配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'job-ai-backend',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

# 启动后端服务
pm2 start ecosystem.config.js

# 查看服务状态
pm2 status

# 查看日志
pm2 logs job-ai-backend

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
# 按照提示执行输出的命令
```

---

## 第六步：配置 Nginx

```bash
# 创建 Nginx 配置文件
sudo nano /etc/nginx/conf.d/job-ai.conf
```

**复制以下内容到配置文件：**

```nginx
# HTTP 服务器配置（重定向到 HTTPS）
server {
    listen 80;
    listen [::]:80;
    server_name job.100million.top;

    # Let's Encrypt 验证目录
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # 其他请求重定向到 HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 服务器配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name job.100million.top;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/job.100million.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/job.100million.top/privkey.pem;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 日志
    access_log /var/log/nginx/job-ai-access.log;
    error_log /var/log/nginx/job-ai-error.log;

    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Web 前端静态文件
    location / {
        root /var/www/job-ai/web/dist;
        try_files $uri $uri/ /index.html;

        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

```bash
# 删除默认配置（可选）
sudo rm -f /etc/nginx/conf.d/default.conf

# 测试 Nginx 配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

---

## 第七步：申请 SSL 证书

```bash
# 安装 Certbot
sudo yum install -y certbot python3-certbot-nginx

# 创建验证目录
sudo mkdir -p /var/www/html/.well-known/acme-challenge

# 申请 SSL 证书
sudo certbot certonly --webroot -w /var/www/html -d job.100million.top

# 按照提示输入邮箱并同意服务条款

# 验证证书
sudo ls -l /etc/letsencrypt/live/job.100million.top/
```

**证书申请成功后，重新加载 Nginx：**

```bash
sudo systemctl reload nginx
```

---

## 第八步：配置防火墙

```bash
# OpenCloudOS 使用 firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# 查看防火墙状态
sudo firewall-cmd --list-all
```

---

## 第九步：验证部署

```bash
# 1. 检查 PM2 服务状态
pm2 status

# 2. 检查 Nginx 状态
sudo systemctl status nginx

# 3. 检查端口监听
sudo netstat -tlnp | grep -E ':(80|443|3001)'

# 4. 查看后端日志
pm2 logs job-ai-backend --lines 50

# 5. 测试后端 API
curl http://localhost:3001/api/health

# 6. 在浏览器访问
# https://job.100million.top
```

---

## 第十步：设置自动续期 SSL 证书

```bash
# 测试续期
sudo certbot renew --dry-run

# Certbot 会自动创建 systemd timer
# 查看定时任务
systemctl list-timers | grep certbot
```

---

## 常用维护命令

### 更新项目

```bash
cd /var/www/job-ai

# 拉取最新代码
git pull origin main

# 更新后端
cd backend
npm install
npm run build
pm2 restart job-ai-backend

# 更新前端
cd ../web
npm install
npm run build
```

### 查看日志

```bash
# PM2 日志
pm2 logs job-ai-backend

# 实时查看日志
pm2 logs job-ai-backend --lines 100

# Nginx 访问日志
sudo tail -f /var/log/nginx/job-ai-access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/job-ai-error.log
```

### PM2 管理

```bash
# 查看状态
pm2 status

# 重启服务
pm2 restart job-ai-backend

# 停止服务
pm2 stop job-ai-backend

# 删除服务
pm2 delete job-ai-backend

# 监控
pm2 monit
```

### 数据库操作

```bash
cd /var/www/job-ai/backend

# 重新生成 Prisma Client
npm run prisma:generate

# 推送 schema 到数据库
npm run prisma:push

# 运行数据库迁移
npm run prisma:migrate

# 打开 Prisma Studio（数据库管理界面）
npm run prisma:studio
```

---

## 故障排查

### 后端服务无法启动

```bash
# 查看详细日志
pm2 logs job-ai-backend --lines 100

# 检查环境变量
cd /var/www/job-ai/backend
cat .env

# 检查端口占用
sudo netstat -tlnp | grep 3001

# 手动运行测试
cd /var/www/job-ai/backend
node dist/index.js
```

### 前端页面无法访问

```bash
# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/job-ai-error.log

# 检查静态文件
ls -la /var/www/job-ai/web/dist

# 检查文件权限
sudo chown -R nginx:nginx /var/www/job-ai/web/dist
sudo chmod -R 755 /var/www/job-ai/web/dist
```

### SSL 证书问题

```bash
# 重新申请证书
sudo certbot certonly --webroot -w /var/www/html -d job.100million.top --force-renewal

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 数据库连接失败

```bash
# 测试数据库连接
cd /var/www/job-ai/backend
npm run prisma:studio

# 检查 .env 配置
cat .env | grep DATABASE_URL
```

---

## 性能优化

### 启用 PM2 集群模式

```bash
cd /var/www/job-ai/backend

# 修改 ecosystem.config.js
nano ecosystem.config.js

# 将 instances 改为 "max" 或具体 CPU 核心数
# instances: 'max'
# exec_mode: 'cluster'

# 重启服务
pm2 restart job-ai-backend
```

### 配置 Nginx 缓存（可选）

在 Nginx 配置中添加：

```nginx
# 在 http 块中添加
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;

# 在 location /api/ 中添加
proxy_cache api_cache;
proxy_cache_valid 200 5m;
proxy_cache_bypass $http_cache_control;
add_header X-Cache-Status $upstream_cache_status;
```

---

## 安全建议

```bash
# 1. 定期更新系统
sudo yum update -y

# 2. 安装 fail2ban 防止暴力破解
sudo yum install -y fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# 3. 修改 SSH 默认端口（可选）
sudo nano /etc/ssh/sshd_config
# 修改 Port 22 为其他端口
sudo systemctl restart sshd

# 4. 配置自动备份数据库
crontab -e
# 添加: 0 2 * * * pg_dump -U username dbname > /backup/db_$(date +\%Y\%m\%d).sql
```

---

## 监控建议

推荐使用以下工具进行监控：

1. **PM2 Plus** - 进程监控
2. **Uptime Kuma** - 开源监控工具
3. **Grafana + Prometheus** - 完整监控方案

---

## 部署检查清单

- [ ] Node.js 和 PM2 已安装
- [ ] 项目代码已克隆到 /var/www/job-ai
- [ ] 后端 .env 文件已配置
- [ ] 后端依赖已安装并构建
- [ ] 前端已构建（dist 目录存在）
- [ ] PM2 服务已启动并正常运行
- [ ] Nginx 配置文件已创建
- [ ] SSL 证书已申请
- [ ] 防火墙已配置
- [ ] 可以通过 https://job.100million.top 访问
- [ ] API 接口正常工作
- [ ] PM2 开机自启已配置

---

## 更新日志

- 2025-02-02: 创建 OpenCloudOS 部署文档（域名：job.100million.top）
