#!/bin/bash

################################################################################
# 求职追踪助手 - Docker 部署脚本
# 用途: 在服务器上首次部署和更新应用
# 环境: 腾讯云轻量服务器 + 1Panel + Nginx Proxy Manager + PostgreSQL
################################################################################

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_DIR="/var/www/job-ai"
DOMAIN="${DOMAIN:-job.100million.top}"
DOCKER_IMAGE_NAME="job-ai-backend"
DOCKER_CONTAINER_NAME="job-ai-backend"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}求职追踪助手 - Docker 部署脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}错误: 请使用 root 用户或 sudo 运行此脚本${NC}"
    exit 1
fi

# 函数：打印信息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# 函数：打印成功
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 函数：打印警告
print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 函数：打印错误
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ==================== 第一步：检查 Docker 环境 ====================
print_info "检查 Docker 环境..."

if ! command -v docker &> /dev/null; then
    print_error "Docker 未安装"
    print_info "正在安装 Docker..."

    # 安装 Docker
    curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

    # 启动 Docker
    systemctl start docker
    systemctl enable docker

    print_success "Docker 安装完成"
else
    print_success "Docker 已安装: $(docker --version)"
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose 未安装"
    print_info "正在安装 Docker Compose..."

    # 安装 Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    print_success "Docker Compose 安装完成"
else
    print_success "Docker Compose 已安装: $(docker-compose --version)"
fi

echo ""

# ==================== 第二步：创建项目目录 ====================
print_info "创建项目目录..."

mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

print_success "项目目录: $PROJECT_DIR"
echo ""

# ==================== 第三步：克隆/更新代码 ====================
print_info "获取项目代码..."

# 配置 Git 以解决网络问题
print_info "配置 Git 网络设置..."
git config --global http.postBuffer 524288000
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
git config --global core.compression 0

# 函数：带重试的 Git 操作
git_retry() {
    local max_attempts=3
    local attempt=1
    local command="$1"

    while [ $attempt -le $max_attempts ]; do
        print_info "Git 操作尝试 $attempt/$max_attempts..."
        if eval "$command"; then
            return 0
        fi
        attempt=$((attempt + 1))
        if [ $attempt -le $max_attempts ]; then
            print_warning "Git 操作失败，5秒后重试..."
            sleep 5
        fi
    done
    return 1
}

if [ -d ".git" ]; then
    print_info "项目已存在，拉取最新代码..."

    if git_retry "git fetch origin"; then
        git reset --hard origin/main
        print_success "代码更新完成"
    else
        print_error "无法从 GitHub 拉取代码"
        print_warning "可能的原因："
        echo "  1. 网络连接问题"
        echo "  2. GitHub 访问受限"
        echo ""
        print_info "建议解决方案："
        echo "  方案1: 手动上传代码到服务器"
        echo "  方案2: 使用代理"
        echo "  方案3: 使用 SSH 密钥克隆（推荐）"
        echo ""
        exit 1
    fi
else
    if [ -z "$REPO_URL" ]; then
        echo -e "${YELLOW}请选择代码获取方式:${NC}"
        echo "  1. HTTPS 克隆 (可能不稳定)"
        echo "  2. SSH 克隆 (推荐，需要配置密钥)"
        echo "  3. 跳过，手动上传代码"
        echo ""
        read -p "选择 (1/2/3, 默认 1): " CLONE_METHOD
        CLONE_METHOD=${CLONE_METHOD:-1}

        case $CLONE_METHOD in
            1)
                read -p "请输入 GitHub 仓库地址 (例如: https://github.com/584sentiment/job-ai.git): " REPO_URL
                ;;
            2)
                read -p "请输入 GitHub SSH 地址 (例如: git@github.com:584sentiment/job-ai.git): " REPO_URL
                ;;
            3)
                print_warning "跳过代码下载，请手动上传代码到 $PROJECT_DIR"
                exit 0
                ;;
            *)
                print_error "无效选择"
                exit 1
                ;;
        esac
    fi

    if git_retry "git clone $REPO_URL ."; then
        print_success "代码克隆完成"
    else
        print_error "代码克隆失败"
        print_info "请尝试以下方案："
        echo ""
        echo "方案1: 手动上传代码"
        echo "  在本地执行："
        echo "    tar czf job-ai.tar.gz ."
        echo "    scp job-ai.tar.gz root@你的服务器IP:/var/www/"
        echo ""
        echo "  在服务器执行："
        echo "    cd /var/www/job-ai"
        echo "    tar xzf /var/www/job-ai.tar.gz"
        echo ""
        echo "方案2: 使用 SSH 克隆"
        echo "  1. 生成 SSH 密钥: ssh-keygen -t ed25519"
        echo "  2. 复制公钥到 GitHub: cat ~/.ssh/id_ed25519.pub"
        echo "  3. 使用 SSH 地址克隆: git@github.com:584sentiment/job-ai.git"
        echo ""
        exit 1
    fi
fi

echo ""

# ==================== 第四步：检查数据库配置 ====================
print_info "检查数据库配置..."

if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
    print_warning ".env 文件不存在，创建默认配置..."

    # 提示用户输入数据库信息
    echo -e "${YELLOW}请输入数据库连接信息:${NC}"
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

    # 创建 .env 文件
    cat > $PROJECT_DIR/backend/.env << EOF
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
JWT_SECRET="${JWT_SECRET}"
PORT=3001
NODE_ENV=production
CORS_ORIGIN="https://${DOMAIN}"
LOG_LEVEL=info
EOF

    chmod 600 $PROJECT_DIR/backend/.env
    print_success ".env 文件创建完成"
else
    print_success ".env 文件已存在"
fi

echo ""

# ==================== 第五步：构建 Docker 镜像 ====================
print_info "构建 Docker 镜像..."

cd $PROJECT_DIR

# 停止并删除旧容器
if [ "$(docker ps -aq -f name=$DOCKER_CONTAINER_NAME)" ]; then
    print_info "停止旧容器..."
    docker stop $DOCKER_CONTAINER_NAME 2>/dev/null || true
    docker rm $DOCKER_CONTAINER_NAME 2>/dev/null || true
fi

# 构建新镜像
print_info "开始构建镜像..."
docker build -t $DOCKER_IMAGE_NAME:latest -f backend/Dockerfile .

if [ $? -eq 0 ]; then
    print_success "Docker 镜像构建完成"
else
    print_error "Docker 镜像构建失败"
    exit 1
fi

echo ""

# ==================== 第六步：启动 Docker 容器 ====================
print_info "启动 Docker 容器..."

# 运行容器
docker run -d \
    --name $DOCKER_CONTAINER_NAME \
    --restart unless-stopped \
    -p 3001:3001 \
    --env-file $PROJECT_DIR/backend/.env \
    $DOCKER_IMAGE_NAME:latest

if [ $? -eq 0 ]; then
    print_success "Docker 容器启动成功"
else
    print_error "Docker 容器启动失败"
    exit 1
fi

echo ""

# ==================== 第七步：数据库迁移 ====================
print_info "执行数据库迁移..."

# 等待容器启动
sleep 5

# 在容器中执行 Prisma 推送
docker exec $DOCKER_CONTAINER_NAME npx prisma db push

if [ $? -eq 0 ]; then
    print_success "数据库迁移完成"
else
    print_warning "数据库迁移失败，请手动检查"
fi

echo ""

# ==================== 第八步：构建前端 ====================
print_info "构建前端..."

cd $PROJECT_DIR/web

# 安装依赖
print_info "安装前端依赖..."
npm ci

# 构建生产版本
print_info "构建前端生产版本..."
npm run build

if [ $? -eq 0 ]; then
    print_success "前端构建完成"
else
    print_error "前端构建失败"
    exit 1
fi

echo ""

# ==================== 完成 ====================
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
print_info "服务信息:"
echo -e "  后端容器: ${BLUE}$DOCKER_CONTAINER_NAME${NC}"
echo -e "  后端地址: ${BLUE}http://localhost:3001${NC}"
echo -e "  前端目录: ${BLUE}$PROJECT_DIR/web/dist${NC}"
echo -e "  域名: ${BLUE}https://$DOMAIN${NC}"
echo ""
print_info "Docker 容器管理命令:"
echo -e "  查看日志: ${YELLOW}docker logs -f $DOCKER_CONTAINER_NAME${NC}"
echo -e "  重启容器: ${YELLOW}docker restart $DOCKER_CONTAINER_NAME${NC}"
echo -e "  停止容器: ${YELLOW}docker stop $DOCKER_CONTAINER_NAME${NC}"
echo -e "  查看状态: ${YELLOW}docker ps${NC}"
echo ""
print_warning "下一步操作:"
echo -e "  1. 在 Nginx Proxy Manager 中配置反向代理"
echo -e "  2. 配置 SSL 证书"
echo -e "  3. 测试访问 https://$DOMAIN"
echo ""
