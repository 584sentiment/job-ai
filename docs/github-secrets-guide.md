# GitHub Secrets 配置指南

## 什么是 GitHub Secrets

GitHub Secrets 是加密的环境变量，用于在 GitHub Actions 中存储敏感信息（如密码、API 密钥、SSH 密钥等），这些信息在日志中会被隐藏。

---

## 配置步骤

### 第一步：进入 GitHub 仓库

1. 打开浏览器，访问你的 GitHub 仓库
2. 例如：`https://github.com/你的用户名/job-ai`

### 第二步：进入 Settings 页面

1. 点击仓库顶部的 **Settings**（设置）标签
2. 在左侧菜单中找到 **Secrets and variables**（密钥和变量）
3. 点击 **Actions** 子菜单

### 第三步：添加 Repository Secrets

点击 **New repository secret** 按钮，开始添加密钥。

---

## 需要添加的 Secrets 列表

### 1. SERVER_HOST

**Name**: `SERVER_HOST`
**Secret**: 你的服务器 IP 地址或域名

```
示例：124.220.83.152
```

**获取方式**：
- 腾讯云控制台 → 云服务器 → 实例列表 → 查看 IPv4 地址

---

### 2. SERVER_USERNAME

**Name**: `SERVER_USERNAME`
**Secret**: SSH 登录用户名

```
示例：root
或：ubuntu
```

**获取方式**：
- 通常腾讯云轻量服务器默认是 `root`
- 如果是 Ubuntu 系统，可能是 `ubuntu`

---

### 3. SSH_PRIVATE_KEY（重要）

**Name**: `SSH_PRIVATE_KEY`
**Secret**: SSH 私钥的完整内容

**生成步骤**：

#### 方式一：在服务器上生成（推荐）

```bash
# 1. SSH 连接到服务器
ssh root@your-server-ip

# 2. 生成 SSH 密钥对
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""

# 3. 查看私钥（复制全部内容）
cat ~/.ssh/github_actions
```

复制输出的**全部内容**，应该类似：
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
...（很多行）...
HhqaGV5Z2l0LW15c2VybmFtZUBleGFtcGxlLmNvbQAAAAAAAAAAAAAAAAAAAAAAAAAA
-----END OPENSSH PRIVATE KEY-----
```

#### 方式二：在本地生成

```bash
# 本地终端执行
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""

# 查看私钥
cat ~/.ssh/github_actions

# 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/github_actions.pub root@your-server-ip
```

**重要提示**：
- 必须复制**完整内容**，包括 `-----BEGIN` 和 `-----END` 行
- 不要添加额外的空格或换行

#### 配置授权（服务器端）

```bash
# SSH 连接到服务器
ssh root@your-server-ip

# 添加公钥到 authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# 设置正确的权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# 测试 SSH 连接（在本地测试）
ssh -i ~/.ssh/github_actions root@your-server-ip
```

---

### 4. DATABASE_URL

**Name**: `DATABASE_URL`
**Secret**: PostgreSQL 数据库连接字符串

```
格式：postgresql://用户名:密码@主机:端口/数据库名
示例：postgresql://jobai_user:your_password@localhost:5432/jobai_db
```

**获取方式**：

#### 如果使用 1Panel 的 PostgreSQL

1. 登录 1Panel
2. 进入"数据库" → "PostgreSQL"
3. 点击你的数据库
4. 查看连接信息

#### 如果是手动安装的 PostgreSQL

```bash
# 连接到数据库
sudo -u postgres psql

# 查看用户和数据库
\du
\l

# 退出
\q
```

---

### 5. JWT_SECRET

**Name**: `JWT_SECRET`
**Secret**: 随机生成的 JWT 签名密钥

**生成方式**：

```bash
# 在服务器或本地执行
openssl rand -base64 64
```

复制输出的随机字符串，例如：
```
r8KJ3j5k2m9P1q6wX7nY4zV0bC8dF5gH2jL9mN3oP6qR1sT4uV7wX0yZ3aB5cD8eF1
```

**注意**：
- 这是一个强随机密钥，用于 JWT token 签名
- 不要泄露，一旦泄露需要重新生成

---

### 6. DOMAIN

**Name**: `DOMAIN`
**Secret**: 你的域名

```
示例：job.100million.top
```

---

### 7. SERVER_PORT（可选）

**Name**: `SERVER_PORT`
**Secret**: SSH 端口

```
默认：22
```

如果你的 SSH 使用了非标准端口，需要添加此 Secret。

---

## 验证配置

### 1. 检查 Secrets 列表

添加完成后，你应该看到以下 Secrets：

- ✅ SERVER_HOST
- ✅ SERVER_USERNAME
- ✅ SSH_PRIVATE_KEY
- ✅ DATABASE_URL
- ✅ JWT_SECRET
- ✅ DOMAIN
- ✅ SERVER_PORT（可选）

### 2. 测试 GitHub Actions

**方式一：手动触发**

1. 进入 GitHub 仓库
2. 点击 **Actions** 标签
3. 选择 **Deploy to Tencent Cloud (Docker)** 工作流
4. 点击 **Run workflow** → **Run workflow**

**方式二：推送代码触发**

```bash
# 本地执行
git add .
git commit -m "test: 测试 GitHub Actions"
git push origin main
```

### 3. 查看运行日志

1. 进入 **Actions** 标签
2. 点击最近的工作流运行
3. 查看各个步骤的执行情况

---

## 常见问题

### Q1: 如何验证 SSH_PRIVATE_KEY 是否正确？

**测试步骤**：

```bash
# 1. 将 SSH_PRIVATE_KEY 保存到本地文件
nano ~/.ssh/test_github_key

# 2. 粘贴私钥内容
# 3. 设置权限
chmod 600 ~/.ssh/test_github_key

# 4. 测试连接
ssh -i ~/.ssh/test_github_key root@your-server-ip
```

如果连接成功，说明密钥配置正确。

---

### Q2: GitHub Actions 报错 "Permission denied (publickey)"

**解决方案**：

1. 确认 `SSH_PRIVATE_KEY` 是完整的私钥
2. 确认服务器的 `~/.ssh/authorized_keys` 包含对应的公钥
3. 确认 `~/.ssh/authorized_keys` 权限为 `600`
4. 确认 `~/.ssh` 目录权限为 `700`

```bash
# 服务器端修复权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chown -R $USER:$USER ~/.ssh
```

---

### Q3: 如何更新已存在的 Secret？

1. 进入 **Settings** → **Secrets and variables** → **Actions**
2. 找到要更新的 Secret
3. 点击 **Update** 按钮
4. 修改值后点击 **Update secret**

---

### Q4: 数据库连接失败怎么办？

**排查步骤**：

1. 确认 `DATABASE_URL` 格式正确
2. 确认数据库服务正在运行：
   ```bash
   systemctl status postgresql
   ```
3. 确认防火墙允许本地连接：
   ```bash
   # 如果使用 Docker，可能需要使用宿主机 IP
   # 获取 Docker 宿主机 IP
   ip addr show docker0 | grep inet
   ```
4. 测试数据库连接：
   ```bash
   psql "postgresql://jobai_user:password@localhost:5432/jobai_db"
   ```

---

## 安全建议

### 1. 定期轮换密钥

```bash
# 每 3-6 个月更换一次 JWT_SECRET
openssl rand -base64 64

# 更新 GitHub Secrets 和服务器 .env 文件
```

### 2. 使用最小权限原则

- 创建专用的 GitHub Actions SSH 用户（可选）
- 限制 SSH 密钥只能执行特定命令

### 3. 监控访问日志

```bash
# 定期检查服务器登录日志
sudo tail -f /var/log/auth.log
```

---

## Secrets 完整示例

```
SERVER_HOST = 124.220.83.152
SERVER_USERNAME = root
SSH_PRIVATE_KEY =
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
  ...（中间内容省略）...
  -----END OPENSSH PRIVATE KEY-----

DATABASE_URL = postgresql://jobai_user:StrongPassword123@localhost:5432/jobai_db
JWT_SECRET = r8KJ3j5k2m9P1q6wX7nY4zV0bC8dF5gH2jL9mN3oP6qR1sT4uV7wX0yZ3aB5cD8eF1
DOMAIN = job.100million.top
SERVER_PORT = 22
```

---

## 下一步

配置完 Secrets 后：

1. ✅ 在服务器上执行首次部署：`bash scripts/deploy-docker.sh`
2. ✅ 推送代码触发 GitHub Actions
3. ✅ 查看 Actions 日志确认部署成功
4. ✅ 配置 Nginx Proxy Manager
5. ✅ 访问 `https://job.100million.top` 测试

---

更新时间：2025-01-15
