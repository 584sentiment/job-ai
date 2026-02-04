# Git 网络问题解决方案

## 问题说明

在国内服务器上访问 GitHub 经常会遇到 TLS 连接错误：

```
fatal: unable to access 'https://github.com/...':
GnuTLS recv error (-110): The TLS connection was non-properly terminated.
```

这是因为网络不稳定或 GitHub 访问受限。

---

## 解决方案

### 方案一：手动上传代码（最稳定）

#### 1. 在本地打包代码

```bash
# 在你的本地项目目录执行
cd /path/to/job-ai
tar czf job-ai.tar.gz \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=.git \
    --exclude=logs \
    .
```

#### 2. 上传到服务器

```bash
# 使用 scp 上传
scp job-ai.tar.gz root@你的服务器IP:/tmp/

# 或使用 rsync（推荐，支持断点续传）
rsync -avz --progress \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=.git \
    /path/to/job-ai/ root@你的服务器IP:/var/www/job-ai/
```

#### 3. 在服务器上解压

```bash
# SSH 连接到服务器
ssh root@你的服务器IP

# 如果使用 tar 上传
cd /var/www
mkdir -p job-ai
cd job-ai
tar xzf /tmp/job-ai.tar.gz

# 如果使用 rsync，代码已经上传完成，跳过此步
```

#### 4. 运行部署脚本

```bash
cd /var/www/job-ai
bash scripts/deploy-quick.sh
# 选择方案 1（已有代码）
```

---

### 方案二：使用 SSH 克隆（推荐）

#### 1. 在服务器上生成 SSH 密钥

```bash
# SSH 连接到服务器
ssh root@你的服务器IP

# 生成密钥
ssh-keygen -t ed25519 -C "server" -f ~/.ssh/github_ed25519 -N ""
```

#### 2. 查看公钥并添加到 GitHub

```bash
# 查看公钥
cat ~/.ssh/github_ed25519.pub
```

复制输出的公钥内容。

#### 3. 在 GitHub 上添加 SSH 密钥

1. 访问：https://github.com/settings/keys
2. 点击 **New SSH key**
3. Title: `腾讯云服务器`
4. Key: 粘贴公钥内容
5. 点击 **Add SSH key**

#### 4. 配置 Git 使用 SSH

```bash
# 在服务器上
git config --global core.sshCommand "ssh -i ~/.ssh/github_ed25519"
```

#### 5. 使用 SSH 地址克隆

```bash
cd /var/www/job-ai
git clone git@github.com:584sentiment/job-ai.git .
```

---

### 方案三：使用代理（可选）

如果你有代理服务器：

```bash
# 设置代理
export http_proxy=http://代理地址:端口
export https_proxy=http://代理地址:端口

# 或为 Git 设置代理
git config --global http.proxy http://代理地址:端口
git config --global https.proxy http://代理地址:端口
```

---

### 方案四：修改 Git 配置（提高成功率）

```bash
# 增加缓冲区大小
git config --global http.postBuffer 524288000

# 禁用低速限制
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999

# 禁用压缩
git config --global core.compression 0
```

---

## 快速部署（推荐）

我已经创建了一个快速部署脚本，支持多种代码获取方式：

```bash
cd /var/www/job-ai
bash scripts/deploy-quick.sh
```

这个脚本会提供以下选项：
1. 使用已上传的代码
2. 使用 SSH 克隆
3. 使用 HTTPS 克隆（带重试）
4. 跳过代码获取

---

## 完整部署流程（推荐方式）

### 步骤 1: 本地准备

```bash
# 在本地项目目录
cd /Users/wang/Documents/study/job-ai

# 方式 A: 使用 rsync 直接上传（推荐）
rsync -avz --progress \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=.git \
    --exclude=logs \
    . root@124.220.83.152:/var/www/job-ai/

# 方式 B: 打包后上传
tar czf job-ai.tar.gz \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=.git \
    --exclude=logs \
    .
scp job-ai.tar.gz root@124.220.83.152:/tmp/
```

### 步骤 2: 服务器部署

```bash
# SSH 连接到服务器
ssh root@124.220.83.152

# 如果使用 tar 上传，需要解压
cd /var/www/job-ai
tar xzf /tmp/job-ai.tar.gz

# 运行快速部署脚本
bash scripts/deploy-quick.sh
# 选择: 1（已有代码）
```

### 步骤 3: 配置环境变量

脚本会提示你输入数据库信息，准备好这些信息：
- 数据库主机：`localhost` 或容器 IP
- 数据库端口：`5432`
- 数据库名称：`jobai_db`
- 数据库用户：`jobai_user`
- 数据库密码：`your_password`

### 步骤 4: 等待部署完成

脚本会自动：
1. 检查 Docker 环境
2. 配置环境变量
3. 构建 Docker 镜像
4. 启动后端容器
5. 执行数据库迁移
6. 构建前端

---

## 验证部署

```bash
# 检查容器状态
docker ps

# 检查后端健康
curl http://localhost:3001/api/health

# 查看日志
docker logs -f job-ai-backend
```

---

## 后续更新

配置好首次部署后，后续更新可以使用：

### 方式 A: 使用 rsync 更新（推荐）

```bash
# 本地执行
rsync -avz --progress \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=.git \
    --exclude=logs \
    . root@124.220.83.152:/var/www/job-ai/

# 服务器执行
ssh root@124.220.83.152 "cd /var/www/job-ai && bash scripts/update-deploy.sh"
```

### 方式 B: 使用 GitHub Actions（推荐）

配置好 GitHub Secrets 后，推送代码会自动部署：

```bash
git add .
git commit -m "feat: 新功能"
git push origin main
```

---

## 常见问题

### Q1: rsync 命令找不到？

**Mac 安装**:
```bash
brew install rsync
```

**Linux 安装**:
```bash
yum install rsync  # CentOS/RHEL
apt install rsync  # Ubuntu/Debian
```

### Q2: SSH 连接被拒绝？

检查服务器 SSH 端口：
```bash
# 使用非标准端口
ssh -p 端口号 root@124.220.83.152
```

### Q3: 上传速度慢？

使用压缩：
```bash
# 使用 rsync 的 -z 参数启用压缩
rsync -avzz --progress ...
```

---

更新时间：2025-01-15
