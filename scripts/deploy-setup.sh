#!/bin/bash
# 腾讯云服务器快速部署脚本
# 用途：在服务器上执行初始化配置

set -e

echo "=========================================="
echo "求职追踪助手 - 服务器部署初始化"
echo "=========================================="

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
  echo "❌ 请使用 root 用户执行此脚本"
  exit 1
fi

# 1. 创建 Docker 网络
echo ""
echo "📡 创建 Docker 网络..."
docker network create job-ai-network 2>/dev/null || echo "网络已存在"

# 2. 提示连接 PostgreSQL 容器
echo ""
echo "⚠️  请手动执行以下命令连接 PostgreSQL 容器："
echo "   docker network connect job-ai-network <postgres_container_name>"
echo ""
read -p "是否已完成？(y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ 请先完成网络连接后再继续"
  exit 1
fi

# 3. 创建备份目录
echo ""
echo "📁 创建备份目录..."
mkdir -p /var/backups/job-ai
chown -R root:root /var/backups/job-ai

# 4. 检查环境变量文件
echo ""
echo "🔍 检查环境变量配置..."
if [ ! -f "/var/www/job-ai/backend/.env" ]; then
  echo "❌ 未找到 backend/.env 文件"
  echo "   请先创建环境变量文件："
  echo "   cp backend/.env.example backend/.env"
  echo "   然后编辑填写实际配置"
  exit 1
fi

echo "✅ 环境变量文件已找到"

# 5. 构建并启动容器
echo ""
echo "🐳 构建并启动 Docker 容器..."
cd /var/www/job-ai
docker-compose up -d --build

# 6. 等待容器启动
echo ""
echo "⏳ 等待容器启动..."
sleep 30

# 7. 初始化数据库
echo ""
echo "🗄️  初始化数据库..."
docker exec job-ai-backend npx prisma generate
docker exec job-ai-backend npx prisma db push

# 8. 配置备份脚本
echo ""
echo "💾 配置数据库备份..."
chmod +x /var/www/job-ai/scripts/backup-db.sh

# 询问是否配置定时任务
echo ""
read -p "是否配置定时备份任务（每天凌晨 2 点）？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  (crontab -l 2>/dev/null | grep -v "backup-db.sh"; echo "0 2 * * * /var/www/job-ai/scripts/backup-db.sh >> /var/backups/job-ai/backup.log 2>&1") | crontab -
  echo "✅ 定时备份任务已配置"
fi

# 9. 验证部署
echo ""
echo "🔍 验证部署..."
docker ps | grep job-ai

# 10. 测试服务
echo ""
echo "🧪 测试服务..."
echo "前端: curl http://localhost:3000/health"
curl -s http://localhost:3000/health || echo "❌ 前端服务异常"
echo ""
echo "后端: curl http://localhost:3001/api/health"
curl -s http://localhost:3001/api/health || echo "❌ 后端服务异常"

# 11. 完成
echo ""
echo "=========================================="
echo "🎉 部署初始化完成！"
echo "=========================================="
echo ""
echo "📋 下一步操作："
echo "   1. 配置 Nginx Proxy Manager 反向代理"
echo "   2. 申请 SSL 证书"
echo "   3. 配置 GitHub Secrets 和 CI/CD"
echo ""
echo "📖 详细文档: docs/deployment-guide.md"
echo ""
