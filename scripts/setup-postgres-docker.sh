#!/bin/bash

# 求职追踪助手 - PostgreSQL Docker 快速设置脚本
# 日期: 2025-02-05

set -e

echo "🚀 求职追踪助手 - PostgreSQL Docker 设置"
echo "========================================="
echo ""

# 检查 Docker 是否运行
echo "1️⃣  检查 Docker 状态..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行"
    echo ""
    echo "请先启动 Docker Desktop："
    echo "  1. 打开 Docker Desktop 应用"
    echo "  2. 等待 Docker 图标显示为运行状态"
    echo "  3. 重新运行此脚本"
    echo ""
    exit 1
fi

echo "✅ Docker 已运行"
echo ""

# 检查是否已存在容器
echo "2️⃣  检查现有容器..."
if docker ps -a | grep -q job-ai-postgres; then
    echo "⚠️  容器 'job-ai-postgres' 已存在"
    read -p "是否删除并重新创建？(y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker stop job-ai-postgres 2>/dev/null || true
        docker rm job-ai-postgres 2>/dev/null || true
        echo "✅ 旧容器已删除"
    else
        echo "ℹ️  使用现有容器"
        docker start job-ai-postgres 2>/dev/null || true
    fi
else
    echo "✅ 无冲突容器"
fi
echo ""

# 创建 PostgreSQL 容器
echo "3️⃣  创建 PostgreSQL 容器..."
if ! docker ps | grep -q job-ai-postgres; then
    docker run -d \
        --name job-ai-postgres \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=job_ai_dev \
        -p 5432:5432 \
        -v job-ai-db-data:/var/lib/postgresql/data \
        postgres:18-alpine

    echo "⏳ 等待 PostgreSQL 启动..."
    sleep 5

    # 检查容器状态
    if docker ps | grep -q job-ai-postgres; then
        echo "✅ PostgreSQL 容器已启动"
    else
        echo "❌ 容器启动失败"
        docker logs job-ai-postgres
        exit 1
    fi
else
    echo "✅ PostgreSQL 容器已在运行"
fi
echo ""

# 测试连接
echo "4️⃣  测试数据库连接..."
if docker exec job-ai-postgres psql -U postgres -c "SELECT version();" > /dev/null 2>&1; then
    VERSION=$(docker exec job-ai-postgres psql -U postgres -t -c "SELECT version();" | head -1)
    echo "✅ 数据库连接成功"
    echo "   $VERSION"
else
    echo "❌ 数据库连接失败"
    exit 1
fi
echo ""

# 检查数据库
echo "5️⃣  检查数据库..."
DB_EXISTS=$(docker exec job-ai-postgres psql -U postgres -t -c "SELECT 1 FROM pg_database WHERE datname='job_ai_dev';" | xargs)
if [ "$DB_EXISTS" = "1" ]; then
    echo "✅ 数据库 'job_ai_dev' 已存在"
else
    echo "❌ 数据库 'job_ai_dev' 不存在"
    exit 1
fi
echo ""

# 显示连接信息
echo "6️⃣  连接信息"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Host:     localhost"
echo "Port:     5432"
echo "Database: job_ai_dev"
echo "Username: postgres"
echo "Password: postgres"
echo ""
echo "连接字符串:"
echo "postgresql://postgres:postgres@localhost:5432/job_ai_dev"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 显示容器管理命令
echo "📋 常用命令"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "查看状态:  docker ps | grep job-ai-postgres"
echo "查看日志:  docker logs -f job-ai-postgres"
echo "停止:      docker stop job-ai-postgres"
echo "启动:      docker start job-ai-postgres"
echo "重启:      docker restart job-ai-postgres"
echo "删除:      docker rm -f job-ai-postgres"
echo ""
echo "数据库操作:"
echo "连接数据库: docker exec -it job-ai-postgres psql -U postgres"
echo "查看表:     docker exec -it job-ai-postgres psql -U postgres -d job_ai_dev -c '\dt'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 下一步
echo "7️⃣  后续步骤"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. 确认 backend/.env 配置:"
echo "   DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/job_ai_dev\""
echo ""
echo "2. 初始化数据库结构:"
echo "   cd backend"
echo "   pnpm prisma generate"
echo "   pnpm prisma db push"
echo ""
echo "3. 启动后端服务:"
echo "   pnpm dev"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✅ PostgreSQL 设置完成！"
