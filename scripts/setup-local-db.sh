#!/bin/bash

# 本地 PostgreSQL 数据库快速配置脚本

set -e

# 切换到项目根目录（脚本在 scripts/ 目录）
cd "$(dirname "$0")/.."

echo "================================"
echo "求职追踪助手 - 本地 PostgreSQL 配置"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 PostgreSQL 是否安装
echo "1. 检查 PostgreSQL 安装..."
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL 已安装${NC}"
    psql --version
else
    echo -e "${RED}❌ PostgreSQL 未安装${NC}"
    echo ""
    echo "请先安装 PostgreSQL:"
    echo "  macOS: brew install postgresql@15"
    echo "  Ubuntu: sudo apt install postgresql"
    echo ""
    exit 1
fi

echo ""
echo "2. 请输入 PostgreSQL 配置信息:"
echo ""

# 读取配置
read -p "用户名 (默认: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "密码: " DB_PASSWORD
echo ""

read -p "端口 (默认: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "数据库名 (默认: job_ai_dev): " DB_NAME
DB_NAME=${DB_NAME:-job_ai_dev}

echo ""
echo "3. 测试数据库连接..."
if PGPASSWORD=$DB_PASSWORD psql -U "$DB_USER" -p "$DB_PORT" -d postgres -c "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✅ 数据库连接成功${NC}"
else
    echo -e "${RED}❌ 数据库连接失败${NC}"
    echo ""
    echo "请检查:"
    echo "1. PostgreSQL 服务是否运行"
    echo "2. 用户名和密码是否正确"
    echo "3. 端口是否正确"
    echo ""
    exit 1
fi

echo ""
echo "4. 创建数据库 $DB_NAME..."
PGPASSWORD=$DB_PASSWORD psql -U "$DB_USER" -p "$DB_PORT" -d postgres <<EOF
SELECT 'CREATE DATABASE $DB_NAME';
CREATE DATABASE $DB_NAME;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 数据库创建成功${NC}"
else
    echo -e "${YELLOW}⚠️  数据库可能已存在，继续...${NC}"
fi

echo ""
echo "5. 更新 backend/.env 文件..."

ENV_FILE="backend/.env"
ENV_BACKUP="backend/.env.backup.$(date +%Y%m%d_%H%M%S)"

# 备份原文件
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$ENV_BACKUP"
    echo -e "${GREEN}✅ 已备份原配置到: $ENV_BACKUP${NC}"
fi

# 更新 DATABASE_URL
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME"

if [ -f "$ENV_FILE" ]; then
    # 使用 sed 替换 DATABASE_URL
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|" "$ENV_FILE"
    else
        # Linux
        sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|" "$ENV_FILE"
    fi
    echo -e "${GREEN}✅ DATABASE_URL 已更新${NC}"
else
    echo -e "${RED}❌ backend/.env 文件不存在${NC}"
    exit 1
fi

echo ""
echo "6. 初始化数据库结构..."
cd backend

# 生成 Prisma Client
echo "生成 Prisma Client..."
pnpm prisma generate > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma Client 生成成功${NC}"
else
    echo -e "${RED}❌ Prisma Client 生成失败${NC}"
    exit 1
fi

# 推送数据库结构
echo "推送数据库结构..."
if PGPASSWORD=$DB_PASSWORD pnpm prisma db push --skip-generate > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 数据库结构初始化成功${NC}"
else
    echo -e "${RED}❌ 数据库结构初始化失败${NC}"
    echo ""
    echo "请手动运行:"
    echo "  cd backend"
    echo "  pnpm prisma db push"
    exit 1
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ 配置完成！${NC}"
echo "================================"
echo ""
echo "数据库配置信息:"
echo "  用户名: $DB_USER"
echo "  数据库: $DB_NAME"
echo "  端口: $DB_PORT"
echo "  主机: localhost"
echo ""
echo "连接字符串:"
echo "  $DATABASE_URL"
echo ""
echo "下一步:"
echo "  1. 启动后端: cd backend && pnpm dev"
echo "  2. 启动前端: pnpm dev"
echo "  3. 访问应用: http://localhost:5173"
echo ""
echo "数据库管理:"
echo "  Prisma Studio: cd backend && pnpm prisma studio"
echo "  命令行: psql -U $DB_USER -d $DB_NAME"
echo ""
