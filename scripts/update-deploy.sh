#!/bin/bash

################################################################################
# 求职追踪助手 - 自动更新脚本
# 用途: GitHub Actions 部署时调用，用于更新服务器上的应用
################################################################################

set -e

# 配置变量
PROJECT_DIR="/var/www/job-ai"
DOCKER_IMAGE_NAME="job-ai-backend"
DOCKER_CONTAINER_NAME="job-ai-backend"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}求职追踪助手 - 自动更新${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 进入项目目录
cd $PROJECT_DIR

# 1. 拉取最新代码
echo "📥 拉取最新代码..."
git fetch origin
git reset --hard origin/main

# 2. 停止并删除旧容器
echo "🛑 停止旧容器..."
if [ "$(docker ps -aq -f name=$DOCKER_CONTAINER_NAME)" ]; then
    docker stop $DOCKER_CONTAINER_NAME 2>/dev/null || true
    docker rm $DOCKER_CONTAINER_NAME 2>/dev/null || true
fi

# 3. 构建新镜像
echo "🔨 构建新镜像..."
docker build -t $DOCKER_IMAGE_NAME:latest -f backend/Dockerfile .

# 4. 启动新容器
echo "🚀 启动新容器..."
docker run -d \
    --name $DOCKER_CONTAINER_NAME \
    --restart unless-stopped \
    -p 3001:3001 \
    --env-file $PROJECT_DIR/backend/.env \
    $DOCKER_IMAGE_NAME:latest

# 5. 等待容器启动
echo "⏳ 等待容器启动..."
sleep 10

# 6. 数据库迁移
echo "💾 执行数据库迁移..."
docker exec $DOCKER_CONTAINER_NAME npx prisma db push || true

# 7. 构建前端
echo "🏗️ 构建前端..."
cd $PROJECT_DIR/web
npm ci
npm run build

# 8. 重载 Nginx（如果使用）
if command -v nginx &> /dev/null; then
    echo "🔄 重载 Nginx..."
    systemctl reload nginx || true
fi

echo ""
echo -e "${GREEN}✅ 更新完成！${NC}"
echo ""
echo "容器状态:"
docker ps -f name=$DOCKER_CONTAINER_NAME
echo ""
