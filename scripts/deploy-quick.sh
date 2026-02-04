#!/bin/bash

################################################################################
# 求职追踪助手 - 快速部署脚本（网络问题修复版）
# 用途: 解决 GitHub 访问问题，提供多种代码获取方式
################################################################################

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}求职追踪助手 - 快速部署${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

PROJECT_DIR="/var/www/job-ai"
DOCKER_IMAGE_NAME="job-ai-backend"
DOCKER_CONTAINER_NAME="job-ai-backend"

# 检查是否为 root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}请使用 root 用户运行${NC}"
    exit 1
fi

# 创建目录
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# ==================== 代码获取选择 ====================
echo -e "${YELLOW}请选择代码获取方式:${NC}"
echo ""
echo "  1) ${GREEN}已有代码${NC} - 我已经手动上传了代码"
echo "  2) ${GREEN}SSH 克隆${NC} - 使用 SSH 密钥从 GitHub 克隆（推荐）"
echo "  3) ${YELLOW}HTTPS 克隆${NC} - 使用 HTTPS 克隆（可能不稳定）"
echo "  4) ${YELLOW}跳过此步骤${NC} - 稍后手动处理"
echo ""
read -p "请选择 (1-4): " CHOICE

case $CHOICE in
    1)
        echo -e "${GREEN}使用现有代码...${NC}"
        if [ ! -d "$PROJECT_DIR/backend" ] || [ ! -d "$PROJECT_DIR/web" ]; then
            echo -e "${RED}错误: 找不到 backend 或 web 目录${NC}"
            exit 1
        fi
        ;;

    2)
        echo -e "${GREEN}使用 SSH 克隆...${NC}"
        read -p "请输入 SSH 仓库地址 (如: git@github.com:584sentiment/job-ai.git): " REPO_URL

        # 清理旧代码
        rm -rf $PROJECT_DIR/*

        # 克隆
        git clone $REPO_URL .
        ;;

    3)
        echo -e "${YELLOW}使用 HTTPS 克隆（可能需要多次尝试）...${NC}"

        # 配置 Git
        git config --global http.postBuffer 524288000
        git config --global http.lowSpeedLimit 0
        git config --global http.lowSpeedTime 999999

        read -p "请输入 HTTPS 仓库地址 (如: https://github.com/584sentiment/job-ai.git): " REPO_URL

        # 清理旧代码
        rm -rf $PROJECT_DIR/*

        # 尝试克隆（最多3次）
        for i in {1..3}; do
            echo "第 $i 次尝试..."
            if git clone $REPO_URL .; then
                echo -e "${GREEN}克隆成功！${NC}"
                break
            else
                if [ $i -lt 3 ]; then
                    echo "等待 5 秒后重试..."
                    sleep 5
                else
                    echo -e "${RED}克隆失败，请尝试方案 1 或 2${NC}"
                    exit 1
                fi
            fi
        done
        ;;

    4)
        echo -e "${YELLOW}跳过代码获取${NC}"
        echo "请稍后手动上传代码到 $PROJECT_DIR"
        exit 0
        ;;

    *)
        echo -e "${RED}无效选择${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ 代码准备完成${NC}"
echo ""

# ==================== 检查 Docker ====================
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}正在安装 Docker...${NC}"
    curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
    systemctl start docker
    systemctl enable docker
fi

echo -e "${GREEN}✅ Docker 已就绪${NC}"
echo ""

# ==================== 环境变量配置 ====================
if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
    echo -e "${YELLOW}配置环境变量...${NC}"

    read -p "数据库主机 (默认: localhost): " DB_HOST
    DB_HOST=${DB_HOST:-localhost}

    read -p "数据库端口 (默认: 5432): " DB_PORT
    DB_PORT=${DB_PORT:-5432}

    read -p "数据库名称 (默认: jobai_db): " DB_NAME
    DB_NAME=${DB_NAME:-jobai_db}

    read -p "数据库用户 (默认: jobai_user): " DB_USER
    DB_USER=${DB_USER:-jobai_user}

    read -sp "数据库密码: " DB_PASSWORD
    echo ""

    read -p "JWT_SECRET (留空自动生成): " JWT_SECRET
    if [ -z "$JWT_SECRET" ]; then
        JWT_SECRET=$(openssl rand -base64 64)
    fi

    cat > $PROJECT_DIR/backend/.env << EOF
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
JWT_SECRET="${JWT_SECRET}"
PORT=3001
NODE_ENV=production
CORS_ORIGIN="https://job.100million.top"
LOG_LEVEL=info
EOF

    chmod 600 $PROJECT_DIR/backend/.env
    echo -e "${GREEN}✅ 环境变量配置完成${NC}"
else
    echo -e "${GREEN}✅ 环境变量已存在${NC}"
fi

echo ""

# ==================== 构建 Docker 镜像 ====================
echo -e "${YELLOW}构建 Docker 镜像...${NC}"

# 停止旧容器
if [ "$(docker ps -aq -f name=$DOCKER_CONTAINER_NAME)" ]; then
    docker stop $DOCKER_CONTAINER_NAME 2>/dev/null || true
    docker rm $DOCKER_CONTAINER_NAME 2>/dev/null || true
fi

# 构建
docker build -t $DOCKER_IMAGE_NAME:latest -f backend/Dockerfile .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 镜像构建成功${NC}"
else
    echo -e "${RED}❌ 镜像构建失败${NC}"
    exit 1
fi

echo ""

# ==================== 启动容器 ====================
echo -e "${YELLOW}启动容器...${NC}"

docker run -d \
    --name $DOCKER_CONTAINER_NAME \
    --restart unless-stopped \
    -p 3001:3001 \
    --env-file $PROJECT_DIR/backend/.env \
    $DOCKER_IMAGE_NAME:latest

echo -e "${GREEN}✅ 容器启动成功${NC}"
echo ""

# 等待启动
sleep 10

# 数据库迁移
echo -e "${YELLOW}执行数据库迁移...${NC}"
docker exec $DOCKER_CONTAINER_NAME npx prisma db push || echo "⚠️ 数据库迁移跳过"

echo ""

# ==================== 构建前端 ====================
echo -e "${YELLOW}构建前端...${NC}"

cd $PROJECT_DIR/web
npm ci
npm run build

echo -e "${GREEN}✅ 前端构建完成${NC}"
echo ""

# ==================== 完成 ====================
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "后端容器: $DOCKER_CONTAINER_NAME"
echo "后端地址: http://localhost:3001"
echo "前端目录: $PROJECT_DIR/web/dist"
echo ""
echo "常用命令:"
echo "  查看日志: docker logs -f $DOCKER_CONTAINER_NAME"
echo "  重启容器: docker restart $DOCKER_CONTAINER_NAME"
echo "  查看状态: docker ps"
echo ""
