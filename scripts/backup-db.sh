#!/bin/bash
# 数据库自动备份脚本

set -e

BACKUP_DIR="/var/backups/job-ai"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="job_ai_backup_${DATE}.sql"
RETENTION_DAYS=7
POSTGRES_CONTAINER="postgres"  # 替换为实际的容器名

# 创建备份目录
mkdir -p $BACKUP_DIR

echo "=========================================="
echo "数据库备份开始"
echo "=========================================="

# 备份数据库
docker exec $POSTGRES_CONTAINER pg_dump -U jobai_user job_ai_prod > $BACKUP_DIR/$BACKUP_FILE

# 压缩备份
gzip $BACKUP_DIR/$BACKUP_FILE

echo "✅ 数据库备份完成: ${BACKUP_FILE}.gz"

# 删除过期备份
find $BACKUP_DIR -name "job_ai_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "✅ 已删除 ${RETENTION_DAYS} 天前的备份"

# 显示备份大小
BACKUP_SIZE=$(du -h ${BACKUP_DIR}/${BACKUP_FILE}.gz | cut -f1)
echo "📊 备份文件大小: $BACKUP_SIZE"

echo "=========================================="
