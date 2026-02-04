# 🔍 查看数据库表指南

**更新日期**: 2025-02-05

---

## 方法 1: Prisma Studio（推荐）⭐

**可视化界面，操作简单**

### 启动 Prisma Studio

```bash
# 方式 1: 使用 npm 脚本（推荐）
cd backend
npm run prisma:studio

# 方式 2: 使用 npx
cd backend
npx prisma studio

# 方式 3: 指定端口
cd backend
npx prisma studio --port 5555
```

### 访问 Prisma Studio

1. **浏览器访问**: http://localhost:5555
2. **查看所有表**: 左侧边栏显示 7 个表
   - ✅ users (用户表)
   - ✅ positions (岗位表)
   - ✅ interviews (面试表)
   - ✅ experiences (面经表)
   - ✅ summaries (总结表)
   - ✅ experience_comments (面经评论表)
   - ✅ summary_remarks (总结备注表)

### Prisma Studio 功能

| 功能 | 说明 |
|------|------|
| **浏览数据** | 点击表名查看所有记录 |
| **添加记录** | 点击 "Add record" 添加新数据 |
| **编辑记录** | 点击记录进行编辑 |
| **删除记录** | 选择记录后删除 |
| **筛选排序** | 支持简单的筛选和排序 |
| **搜索** | 在表中搜索关键字 |
| **关系查看** | 查看表之间的关联关系 |

---

## 方法 2: psql 命令行（专业）

**适合快速查询和批量操作**

### 连接到数据库

```bash
# 方式 1: 通过 Docker 连接
docker exec -it job-ai-postgres psql -U postgres -d job_ai_dev

# 方式 2: 从项目根目录
docker exec -it job-ai-postgres psql -U postgres -d job_ai_dev
```

### 常用 psql 命令

#### 查看所有表

```sql
\dt
```

**输出示例**:
```
                List of relations
 Schema |        Name         | Type  |  Owner
--------+---------------------+-------+----------
 public | experience_comments | table | postgres
 public | experiences         | table | postgres
 public | interviews          | table | postgres
 public | positions           | table | postgres
 public | summaries           | table | postgres
 public | summary_remarks     | table | postgres
 public | users               | table | postgres
```

#### 查看表结构

```sql
-- 查看表结构
\d positions

-- 查看所有列
\d positions

-- 查看索引
\di positions
```

#### 查询数据

```sql
-- 查询所有岗位
SELECT * FROM positions;

-- 查询前 10 条岗位
SELECT * FROM positions LIMIT 10;

-- 查询岗位数量
SELECT COUNT(*) FROM positions;

-- 按状态统计岗位
SELECT status, COUNT(*) as count
FROM positions
GROUP BY status
ORDER BY status;

-- 查询特定状态的岗位
SELECT * FROM positions WHERE status = '1';

-- 查询最近添加的岗位
SELECT * FROM positions
ORDER BY "createTime" DESC
LIMIT 5;
```

#### 格式化输出

```sql
-- 对齐输出
\x

-- 查看岗位（格式化）
SELECT * FROM positions LIMIT 1;

-- 关闭格式化
\x
```

#### 退出 psql

```sql
\q
```

---

## 方法 3: Docker 快速查询（便捷）

**适合单行命令查询**

### 快速查询命令

```bash
# 查看所有岗位
docker exec job-ai-postgres psql -U postgres -d job_ai_dev -c "SELECT * FROM positions;"

# 查看岗位数量
docker exec job-ai-postgres psql -U postgres -d job_ai_dev -c "SELECT COUNT(*) FROM positions;"

# 查看所有表
docker exec job-ai-postgres psql -U postgres -d job_ai_dev -c "\dt"

# 查看表结构
docker exec job-ai-postgres psql -U postgres -d job_ai_dev -c "\d positions"
```

---

## 方法 4: 可视化工具（DBeaver, pgAdmin 等）

**适合复杂数据库管理**

### 推荐工具

1. **DBeaver** (免费)
   - 下载: https://dbeaver.io/download/
   - 功能强大，支持多种数据库

2. **pgAdmin 4** (免费)
   - 下载: https://www.pgadmin.org/download/
   - PostgreSQL 官方可视化工具

3. **TablePlus** (付费，有免费版)
   - 下载: https://tableplus.com/
   - 界面美观，操作简单

### 连接配置

```
Host: localhost
Port: 5432
Database: job_ai_dev
User: postgres
Password: postgres
```

---

## 📊 当前数据库表概览

### 7 个数据表

| 表名 | 说明 | 记录数（估计） |
|------|------|--------------|
| **users** | 用户表 | 1+ |
| **positions** | 岗位表 | 10+ |
| **interviews** | 面试表 | - |
| **experiences** | 面经表 | - |
| **summaries** | 总结表 | - |
| **experience_comments** | 面经评论表 | - |
| **summary_remarks** | 总结备注表 | - |

### 岗位表 (positions) 结构

```
┌─────────────────────┬─────────────────┬──────────┬──────────────┐
│ 列名                │ 类型            │ 可空     │ 说明         │
├─────────────────────┼─────────────────┼──────────┼──────────────┤
│ id                  │ string (UUID)    │ 否       │ 主键         │
│ userId              │ string (UUID)    │ 否       │ 用户ID       │
│ companyName         │ string          │ 否       │ 公司名称     │
│ positionName        │ string          │ 否       │ 岗位名称     │
│ deliveryChannel     │ string          │ 否       │ 投递渠道     │
│ deliveryDate        │ bigint          │ 否       │ 投递日期     │
│ workLocation        │ string          │ 是       │ 工作地点     │
│ salaryRange         │ string          │ 是       │ 薪资范围     │
│ jobDescription      │ text            │ 是       │ 岗位描述     │
│ contactName         │ string          │ 是       │ 联系人姓名   │
│ contactPhone        │ string          │ 是       │ 联系人电话   │
│ remarks             │ text            │ 是       │ 备注         │
│ status              │ string          │ 否       │ 状态         │
│ isCollected         │ integer         │ 否       │ 是否收藏     │
│ createTime          │ bigint          │ 否       │ 创建时间     │
│ updateTime          │ bigint          │ 否       │ 更新时间     │
└─────────────────────┴─────────────────┴──────────┴──────────────┘
```

---

## 🎯 推荐查看方式

### 日常开发
**Prisma Studio** - 可视化界面，操作直观

```bash
cd backend
npm run prisma:studio
# 访问 http://localhost:5555
```

### 快速查询
**Docker 命令** - 一行命令查看数据

```bash
docker exec job-ai-postgres psql -U postgres -d job_ai_dev -c "SELECT * FROM positions LIMIT 10;"
```

### 复杂查询
**psql 命令行** - 强大的查询功能

```bash
docker exec -it job-ai-postgres psql -U postgres -d job_ai_dev
```

---

## 📝 常用查询示例

### 查看所有岗位（带格式化）

```sql
\x
SELECT
  id,
  "companyName",
  "positionName",
  status,
  "isCollected",
  "createTime"
FROM positions
LIMIT 5;
```

### 统计各状态的岗位数量

```sql
SELECT
  status,
  COUNT(*) as count
FROM positions
GROUP BY status
ORDER BY status;
```

### 查看最近添加的岗位

```sql
SELECT
  "companyName",
  "positionName",
  "deliveryDate",
  status
FROM positions
ORDER BY "createTime" DESC
LIMIT 10;
```

### 查看某个用户的所有岗位

```sql
SELECT
  "companyName",
  "positionName",
  status
FROM positions
WHERE "userId" = 'your-user-id-here'
ORDER BY "createTime" DESC;
```

---

## 🔧 实用技巧

### 1. 导出数据到 CSV

```sql
\copy (SELECT * FROM positions) TO '/tmp/positions.csv' WITH CSV HEADER;
```

### 2. 查看数据库大小

```sql
SELECT
  pg_size_pretty(pg_database_size('job_ai_dev')) as database_size;
```

### 3. 查看表大小

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname::text || '.' || tablename::text)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname::text || '.' || tablename::text) DESC;
```

### 4. 查看所有索引

```sql
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## 🚀 快速开始

### 现在就试试！

**最简单的方式**：
```bash
# 1. 启动 Prisma Studio
cd backend
npm run prisma:studio

# 2. 浏览器访问
# http://localhost:5555

# 3. 点击 "positions" 表
# 即可看到所有岗位数据
```

**查看命令行**：
```bash
# 查看所有岗位
docker exec job-ai-postgres psql -U postgres -d job_ai_dev -c "SELECT * FROM positions;"

# 查看表列表
docker exec job-ai-postgres psql -U postgres -d job_ai_dev -c "\dt"
```

---

**推荐**: 对于日常开发，使用 **Prisma Studio** 最方便！🎉
