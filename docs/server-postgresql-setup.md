# PostgreSQL 安装配置指南

**服务器：** OpenCloudOS 9.4

---

## 一、安装 PostgreSQL

### 1.1 安装 PostgreSQL

```bash
# 安装 PostgreSQL 15（推荐版本）
sudo yum install -y postgresql postgresql-server postgresql-contrib

# 初始化数据库
sudo /usr/bin/postgresql-setup --initdb --unit postgresql

# 启动 PostgreSQL 服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 验证安装
sudo -u postgres psql --version
```

### 1.2 配置 PostgreSQL 远程访问

```bash
# 编辑 postgresql.conf
sudo nano /var/lib/pgsql/data/postgresql.conf
```

找到并修改以下行：

```conf
# 监听所有地址
listen_addresses = 'localhost'

# 改为
listen_addresses = '*'

# 或者
listen_addresses = 'localhost,127.0.0.1,124.220.83.152'
```

```bash
# 编辑 pg_hba.conf 配置认证
sudo nano /var/lib/pgsql/data/pg_hba.conf
```

在文件末尾添加以下行：

```conf
# 允许本地连接
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256

# 允许服务器本机连接（使用密码）
host    all             all             124.220.83.152/32       scram-sha-256
```

```bash
# 重启 PostgreSQL 使配置生效
sudo systemctl restart postgresql

# 检查 PostgreSQL 状态
sudo systemctl status postgresql
```

---

## 二、创建数据库和用户

### 2.1 切换到 postgres 用户并创建数据库

```bash
# 切换到 postgres 用户
sudo -u postgres psql
```

在 PostgreSQL 命令行中执行：

```sql
-- 创建数据库用户
CREATE USER jobai_user WITH PASSWORD 'your_strong_password_here';

-- 创建数据库
CREATE DATABASE jobai_db OWNER jobai_user;

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE jobai_db TO jobai_user;

-- 退出
\q
```

### 2.2 测试连接

```bash
# 测试连接
psql -h localhost -U jobai_user -d jobai_db

# 或者
sudo -u postgres psql -d jobai_db
```

---

## 三、生成数据库连接字符串

```
postgresql://jobai_user:your_strong_password_here@localhost:5432/jobai_db
```

**注意：** 请将 `your_strong_password_here` 替换为你设置的强密码。

---

## 四、配置防火墙（可选）

如果需要从外部访问数据库（不推荐生产环境）：

```bash
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload
```

**安全建议：** 生产环境建议只允许本地访问，不要对外开放 5432 端口。

---

## 五、PostgreSQL 常用命令

### 5.1 服务管理

```bash
# 启动服务
sudo systemctl start postgresql

# 停止服务
sudo systemctl stop postgresql

# 重启服务
sudo systemctl restart postgresql

# 查看状态
sudo systemctl status postgresql
```

### 5.2 数据库管理

```bash
# 连接到数据库
sudo -u postgres psql

# 列出所有数据库
sudo -u postgres psql -c "\l"

# 列出所有用户
sudo -u postgres psql -c "\du"

# 备份数据库
pg_dump -U jobai_user jobai_db > backup.sql

# 恢复数据库
psql -U jobai_user jobai_db < backup.sql

# 删除数据库
sudo -u postgres psql -c "DROP DATABASE jobai_db;"

# 删除用户
sudo -u postgres psql -c "DROP USER jobai_user;"
```

### 5.3 监控

```bash
# 查看连接数
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# 查看数据库大小
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('jobai_db'));"

# 查看表大小
sudo -u postgres psql -d jobai_db -c "\dt+"
```

---

## 六、性能优化（可选）

### 6.1 配置共享内存

```bash
# 编辑配置
sudo nano /var/lib/pgsql/data/postgresql.conf
```

根据服务器内存调整：

```conf
# 内存配置（根据实际情况调整）
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 16MB

# 连接配置
max_connections = 100
```

```bash
# 重启服务
sudo systemctl restart postgresql
```

### 6.2 配置自动清理

```bash
sudo -u postgres psql -d jobai_db
```

```sql
-- 配置自动清理
ALTER DATABASE jobai_db SET vacuum_analyze_threshold = 50;
ALTER DATABASE jobai_db SET vacuum_analyze_scale_factor = 0.05;

-- 退出
\q
```

---

## 七、自动备份

### 7.1 创建备份脚本

```bash
# 创建备份目录
sudo mkdir -p /backup/postgresql

# 创建备份脚本
sudo nano /usr/local/bin/backup-postgresql.sh
```

**备份脚本内容：**

```bash
#!/bin/bash

# 配置
DB_NAME="jobai_db"
DB_USER="jobai_user"
BACKUP_DIR="/backup/postgresql"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql"

# 保留最近7天的备份
KEEP_DAYS=7

# 创建备份
pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

# 压缩备份
gzip $BACKUP_FILE

# 删除旧备份
find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -mtime +$KEEP_DAYS -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
```

```bash
# 设置执行权限
sudo chmod +x /usr/local/bin/backup-postgresql.sh

# 测试备份
sudo /usr/local/bin/backup-postgresql.sh
```

### 7.2 配置定时任务

```bash
# 编辑 crontab
sudo crontab -e
```

添加以下行（每天凌晨 2 点备份）：

```cron
0 2 * * * /usr/local/bin/backup-postgresql.sh >> /var/log/postgresql-backup.log 2>&1
```

---

## 八、安全加固

### 8.1 修改默认 postgres 用户密码

```bash
sudo -u postgres psql
```

```sql
-- 修改密码
ALTER USER postgres WITH PASSWORD 'your_strong_password';

-- 退出
\q
```

### 8.2 限制网络访问

确保 `pg_hba.conf` 只允许必要的连接：

```bash
sudo nano /var/lib/pgsql/data/pg_hba.conf
```

只保留本地连接：

```conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   all             all                                     peer
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
```

---

## 九、故障排查

### 9.1 连接失败

```bash
# 检查服务状态
sudo systemctl status postgresql

# 查看错误日志
sudo tail -f /var/lib/pgsql/data/log/postgresql-*.log

# 检查端口监听
sudo netstat -tlnp | grep 5432
```

### 9.2 权限问题

```bash
# 检查数据目录权限
sudo ls -la /var/lib/pgsql/data/

# 修复权限
sudo chown -R postgres:postgres /var/lib/pgsql/data/
sudo chmod 700 /var/lib/pgsql/data/
```

### 9.3 认证失败

```bash
# 查看 pg_hba.conf
sudo cat /var/lib/pgsql/data/pg_hba.conf

# 修改后重启
sudo systemctl restart postgresql
```

---

## 十、数据库连接信息汇总

安装完成后，你将获得以下信息：

```
主机: localhost
端口: 5432
数据库: jobai_db
用户: jobai_user
密码: [你设置的密码]

连接字符串:
postgresql://jobai_user:your_password@localhost:5432/jobai_db
```

---

## 更新日志

- 2025-02-02: 创建 PostgreSQL 安装配置指南（OpenCloudOS 9.4）
