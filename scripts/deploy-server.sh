#!/bin/bash

# 求职追踪助手 - 服务器一键部署脚本
# 系统: OpenCloudOS 9.4
# 域名: job.100million.top
# IP: 124.220.83.152

set -e  # 遇到错误立即退出

echo "======================================"
echo "求职追踪助手 - 服务器部署脚本"
echo "======================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
DOMAIN="job.100million.top"
PROJECT_DIR="/var/www/job-ai"
DB_NAME="jobai_db"
DB_USER="jobai_user"
GITHUB_REPO="584sentiment/job-ai"  # 请修改为你的 GitHub 仓库

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}请使用 root 用户或 sudo 运行此脚本${NC}"
    exit 1
fi

# ==================== 第一步：安装 PostgreSQL ====================
echo -e "${GREEN}第一步：安装 PostgreSQL${NC}"
echo ""

# 安装 PostgreSQL
yum install -y postgresql postgresql-server postgresql-contrib

# 初始化数据库
/usr/bin/postgresql-setup --initdb --unit postgresql

# 启动 PostgreSQL
systemctl start postgresql
systemctl enable postgresql

echo -e "${GREEN}PostgreSQL 安装完成！${NC}"
echo ""

# ==================== 第二步：配置数据库 ====================
echo -e "${GREEN}第二步：配置数据库${NC}"
echo ""

# 生成随机密码
DB_PASSWORD=$(openssl rand -base64 32)

# 创建数据库和用户
sudo -u postgres psql << EOF
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
\q
EOF

echo -e "${GREEN}数据库配置完成！${NC}"
echo ""

# 保存数据库信息
DB_INFO_FILE="/root/db_info.txt"
cat > $DB_INFO_FILE << EOF
数据库连接信息：
数据库名: ${DB_NAME}
用户名: ${DB_USER}
密码: ${DB_PASSWORD}
端口: 5432
主机: localhost

连接字符串:
postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}
EOF

chmod 600 $DB_INFO_FILE
echo -e "${YELLOW}数据库信息已保存到: ${DB_INFO_FILE}${NC}"
echo ""

# ==================== 第三步：安装 Node.js 和 PM2 ====================
echo -e "${GREEN}第三步：安装 Node.js 和 PM2${NC}"
echo ""

# 安装 Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# 验证安装
node_version=$(node -v)
npm_version=$(npm -v)
echo -e "Node.js 版本: ${node_version}"
echo -e "npm 版本: ${npm_version}"

# 安装 PM2
npm install -g pm2

echo -e "${GREEN}Node.js 和 PM2 安装完成！${NC}"
echo ""

# ==================== 第四步：克隆项目代码 ====================
echo -e "${GREEN}第四步：克隆项目代码${NC}"
echo ""

# 创建项目目录
mkdir -p /var/www

# 询问 GitHub 仓库地址
read -p "请输入你的 GitHub 仓库地址 (如: https://github.com/username/job-ai.git 或 git@github.com:username/job-ai.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo -e "${RED}仓库地址不能为空！${NC}"
    exit 1
fi

# 克隆项目
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}项目目录已存在，正在更新...${NC}"
    cd $PROJECT_DIR
    git pull origin main
else
    echo -e "${YELLOW}正在克隆项目...${NC}"
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
fi

# 设置权限
chown -R $SUDO_USER:$SUDO_USER $PROJECT_DIR

echo -e "${GREEN}项目代码克隆完成！${NC}"
echo ""

# ==================== 第五步：配置后端 ====================
echo -e "${GREEN}第五步：配置后端${NC}"
echo ""

cd $PROJECT_DIR/backend

# 创建 .env 文件
cat > .env << EOF
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"
JWT_SECRET="$(openssl rand -base64 64)"
PORT=3001
NODE_ENV=production
CORS_ORIGIN="https://${DOMAIN}"
EOF

echo -e "${GREEN}.env 文件创建完成！${NC}"

# 安装依赖
echo -e "${YELLOW}正在安装后端依赖...${NC}"
su - $SUDO_USER -c "cd $PROJECT_DIR/backend && npm install"

# 生成 Prisma Client
echo -e "${YELLOW}正在生成 Prisma Client...${NC}"
su - $SUDO_USER -c "cd $PROJECT_DIR/backend && npm run prisma:generate"

# 推送数据库 schema
echo -e "${YELLOW}正在推送数据库 schema...${NC}"
su - $SUDO_USER -c "cd $PROJECT_DIR/backend && npm run prisma:push"

# 构建项目
echo -e "${YELLOW}正在构建后端...${NC}"
su - $SUDO_USER -c "cd $PROJECT_DIR/backend && npm run build"

echo -e "${GREEN}后端配置完成！${NC}"
echo ""

# ==================== 第六步：构建前端 ====================
echo -e "${GREEN}第六步：构建前端${NC}"
echo ""

cd $PROJECT_DIR/web

# 安装依赖
echo -e "${YELLOW}正在安装前端依赖...${NC}"
su - $SUDO_USER -c "cd $PROJECT_DIR/web && npm install"

# 构建生产版本
echo -e "${YELLOW}正在构建前端...${NC}"
su - $SUDO_USER -c "cd $PROJECT_DIR/web && npm run build"

echo -e "${GREEN}前端构建完成！${NC}"
echo ""

# ==================== 第七步：配置 PM2 ====================
echo -e "${GREEN}第七步：配置 PM2${NC}"
echo ""

cd $PROJECT_DIR/backend

# 创建 PM2 配置文件
cat > ecosystem.config.js << EOF
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

# 启动 PM2 服务
su - $SUDO_USER -c "cd $PROJECT_DIR/backend && pm2 start ecosystem.config.js"
su - $SUDO_USER -c "pm2 save"
su - $SUDO_USER -c "pm2 startup"

echo -e "${GREEN}PM2 配置完成！${NC}"
echo ""

# ==================== 第八步：配置 Nginx ====================
echo -e "${GREEN}第八步：配置 Nginx${NC}"
echo ""

# 创建 Nginx 配置文件
cat > /etc/nginx/conf.d/job-ai.conf << EOF
# HTTP 服务器配置（重定向到 HTTPS）
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS 服务器配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};

    # SSL 证书配置（稍后配置）
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

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
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Web 前端静态文件
    location / {
        root ${PROJECT_DIR}/web/dist;
        try_files \$uri \$uri/ /index.html;

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
EOF

# 删除默认配置
rm -f /etc/nginx/conf.d/default.conf

# 测试配置
nginx -t

# 重新加载 Nginx
systemctl reload nginx

echo -e "${GREEN}Nginx 配置完成！${NC}"
echo ""

# ==================== 第九步：配置防火墙 ====================
echo -e "${GREEN}第九步：配置防火墙${NC}"
echo ""

firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

echo -e "${GREEN}防火墙配置完成！${NC}"
echo ""

# ==================== 第十步：申请 SSL 证书 ====================
echo -e "${GREEN}第十步：申请 SSL 证书${NC}"
echo ""

# 安装 Certbot
yum install -y certbot

# 创建验证目录
mkdir -p /var/www/html/.well-known/acme-challenge

# 申请证书
echo -e "${YELLOW}正在申请 SSL 证书...${NC}"
certbot certonly --webroot -w /var/www/html -d ${DOMAIN}

# 重新加载 Nginx
systemctl reload nginx

echo -e "${GREEN}SSL 证书申请完成！${NC}"
echo ""

# ==================== 完成 ====================
echo ""
echo "======================================"
echo -e "${GREEN}部署完成！${NC}"
echo "======================================"
echo ""
echo "访问地址: https://${DOMAIN}"
echo ""
echo "数据库信息请查看: ${DB_INFO_FILE}"
echo ""
echo "常用命令:"
echo "  查看后端日志: pm2 logs job-ai-backend"
echo "  查看Nginx日志: tail -f /var/log/nginx/job-ai-error.log"
echo "  重启后端: pm2 restart job-ai-backend"
echo ""
echo -e "${YELLOW}请将数据库密码保存到安全的地方！${NC}"
echo ""
