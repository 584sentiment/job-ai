#!/bin/bash

# 后端服务测试脚本

set -e

echo "=== 后端服务测试脚本 ==="
echo ""

# 切换到后端目录
cd "$(dirname "$0")/backend"

echo "当前目录: $(pwd)"
echo ""

# 检查环境变量文件
if [ ! -f .env ]; then
    echo "❌ 错误: .env 文件不存在"
    exit 1
fi

echo "✅ .env 文件存在"
echo ""

# 检查编译输出
if [ ! -d dist ]; then
    echo "❌ 错误: dist 目录不存在，请先运行 pnpm build"
    exit 1
fi

echo "✅ dist 目录存在"
echo ""

# 加载环境变量
export $(grep -v '^#' .env | xargs)

echo "环境变量:"
echo "  PORT=$PORT"
echo "  DATABASE_URL=已配置"
echo "  NODE_ENV=$NODE_ENV"
echo ""

# 启动后端服务
echo "启动后端服务..."
PORT=8080 NODE_ENV=development node dist/index.js &
BACKEND_PID=$!

echo "后端 PID: $BACKEND_PID"
echo ""

# 等待服务启动
echo "等待服务启动..."
sleep 5

# 检查进程是否还在运行
if ! ps -p $BACKEND_PID > /dev/null; then
    echo "❌ 后端进程已退出"
    echo ""
    echo "可能的原因："
    echo "1. bcrypt 模块未正确编译"
    echo "2. 数据库连接失败"
    echo "3. 其他运行时错误"
    echo ""
    echo "建议检查："
    echo "- 运行 'cd backend && npm rebuild bcrypt'"
    echo "- 检查 .env 配置"
    echo "- 查看日志: logs/error.log"
    exit 1
fi

echo "✅ 后端进程运行中"
echo ""

# 测试健康检查端点
echo "测试健康检查端点..."
for i in {1..10}; do
    if curl -s http://localhost:8080/api > /dev/null 2>&1; then
        echo "✅ 后端服务已就绪"
        echo ""
        echo "服务信息:"
        curl -s http://localhost:8080/api | head -20
        echo ""

        # 清理
        kill $BACKEND_PID 2>/dev/null || true
        exit 0
    fi
    echo "等待中... ($i/10)"
    sleep 2
done

echo "❌ 后端服务未能启动"
kill $BACKEND_PID 2>/dev/null || true
exit 1
