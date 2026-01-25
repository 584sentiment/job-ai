# GitHub Pages 部署指南

本项目已配置为可以通过 GitHub Actions 自动部署到 GitHub Pages。

## 📋 前置要求

1. **GitHub 仓库**
   - 确保项目已推送到 GitHub
   - 仓库名称会影响部署 URL

2. **GitHub Pages 启用**
   - 在仓库设置中启用 GitHub Pages
   - 选择 GitHub Actions 作为部署源

## 🚀 部署步骤

### 方式一：自动部署（推荐）

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   git push origin main
   ```

2. **GitHub Actions 自动构建**
   - 推送后，GitHub Actions 会自动运行
   - 在仓库的 "Actions" 标签页可以查看构建进度

3. **访问网站**
   - 部署成功后，访问：`https://username.github.io/job-ai/`
   - 替换 `username` 为你的 GitHub 用户名
   - 如果仓库名不是 `job-ai`，替换为实际仓库名

### 方式二：手动触发部署

1. 访问 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择 "Deploy to GitHub Pages" workflow
4. 点击 "Run workflow" 按钮
5. 选择分支并运行

## ⚙️ 配置说明

### 1. GitHub Pages 设置

在 GitHub 仓库中配置：

1. 进入 **Settings** > **Pages**
2. **Source**: 选择 `GitHub Actions`
3. **Branch**: 不需要选择（使用 Actions 部署）

### 2. Workflow 配置

⚠️ **重要**: GitHub Actions 的 workflow 文件必须放在**仓库根目录**，不能放在 `web/` 子目录下。

文件位置：`.github/workflows/deploy.yml`（仓库根目录）

关键配置：
```yaml
build:
  steps:
    - name: Install dependencies
      working-directory: ./web  # 在 web 目录下执行
      run: npm ci

    - name: Build
      working-directory: ./web  # 在 web 目录下执行
      run: npm run build
```

### 3. Vite 配置

文件位置：`vite.config.js`

```javascript
// GitHub Pages 部署配置
base: process.env.NODE_ENV === 'production' ? '/job-ai/' : '/',
```

**重要**: 如果你的仓库名不是 `job-ai`，需要修改这个值！

#### 修改 base 路径

```javascript
// 方式 1: 如果部署到 https://username.github.io/
base: '/',

// 方式 2: 如果部署到 https://username.github.io/repo-name/
base: '/repo-name/',

// 方式 3: 根据环境变量动态设置
base: process.env.NODE_ENV === 'production'
  ? process.env.VITE_BASE_URL || '/repo-name/'
  : '/',
```

### 4. 环境变量配置

在 GitHub 仓库中配置后端 API 地址：

1. 进入 **Settings** > **Secrets and variables** > **Actions**
2. 在 **Variables** 部分添加：
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `http://ybb9647b.natappfree.cc/job-track-assistant`

## 🔧 本地测试

在部署前，可以先本地测试构建：

```bash
# 方式 1: 标准构建
npm run build

# 方式 2: GitHub Pages 构建（指定 base 路径）
npm run build:github

# 预览构建结果
npm run preview
```

## 📦 构建产物

构建完成后，产物位于 `web/dist/` 目录：

```
web/dist/
├── index.html
├── assets/
│   ├── index-xxx.js
│   ├── index-xxx.css
│   └── ...
└── ...
```

GitHub Actions 会自动将此目录部署到 GitHub Pages。

## 🎯 自定义域名

如果需要使用自定义域名：

1. **在域名 DNS 设置中添加 CNAME 记录**
   ```
   blog.yourdomain.com -> username.github.io
   ```

2. **在仓库根目录添加 `CNAME` 文件**
   ```
   web/CNAME
   ```
   文件内容：
   ```
   blog.yourdomain.com
   ```

3. **在 GitHub Pages 设置中配置域名**
   - Settings > Pages > Custom domain

## 🔄 持续部署

配置完成后，每次推送到 `main` 或 `master` 分支都会自动部署：

```
代码推送到 GitHub
    ↓
GitHub Actions 触发
    ↓
安装依赖
    ↓
构建项目
    ↓
部署到 GitHub Pages
    ↓
网站更新完成 ✅
```

## 📊 构建状态

在仓库根目录可以添加构建状态徽章：

```markdown
![GitHub Pages](https://github.com/username/job-ai/actions/workflows/deploy.yml/badge.svg)
```

替换 `username` 和 `job-ai` 为你的实际值。

## ⚠️ 常见问题

### Q1: 部署后页面空白？

**A**: 可能是 base 路径配置错误。检查：

1. `vite.config.js` 中的 `base` 配置
2. 确保与 GitHub Pages URL 匹配
3. 检查浏览器控制台是否有 404 错误

### Q2: API 请求失败？

**A**: 检查：

1. GitHub Actions 环境变量是否配置正确
2. 后端 API 是否可以从公网访问
3. 检查浏览器控制台的网络请求

### Q3: 路由跳转不工作？

**A**: Vue Router 需要配置为 HTML5 History 模式：

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
```

### Q4: 部署很慢？

**A**: 这是正常的，因为：

1. GitHub Actions 需要时间启动
2. 依赖安装需要时间
3. 构建过程需要时间

通常整个过程需要 2-5 分钟。

### Q5: 如何回滚到之前的版本？

**A**: 在 GitHub Pages 中：

1. 进入 **Pages** 设置
2. 查看部署历史
3. 选择之前的版本重新部署

或者在 Git 中：
```bash
git revert HEAD
git push origin main
```

## 📝 更新日志

### 已完成的配置

- ✅ 创建 GitHub Actions workflow 文件（仓库根目录）
- ✅ 配置 Vite 支持 GitHub Pages
- ✅ 添加环境变量支持
- ✅ 自动化部署流程
- ✅ 所有命令在 web 目录下执行

### 文件结构

```
job-ai/                          # 仓库根目录
├── .github/
│   ├── workflows/
│   │   └── deploy.yml          # ✅ GitHub Actions 配置
│   └── WORKFLOW-SETUP.md       # Workflow 配置说明
├── web/                         # Web 前端项目
│   ├── src/
│   ├── package.json
│   ├── vite.config.js          # ✅ Vite 配置
│   └── GITHUB-PAGES.md         # ✅ 部署指南
└── ...
```

### 可能需要的改进

- [ ] 添加 Lighthouse CI 性能测试
- [ ] 添加部署通知（Email/Slack）
- [ ] 配置预览环境（Pull Request 预览）
- [ ] 添加构建缓存优化

## 🔗 相关资源

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [Vue Router 部署](https://router.vuejs.org/guide/essentials/history-mode.html)

## 💡 提示

1. **首次部署可能需要几分钟**才能生效
2. **HTTPS 自动启用**，无需额外配置
3. **流量限额**：GitHub Pages 有 100GB/月的带宽限制
4. **构建时间**：Actions 有每月 2000 分钟的免费额度

## 🚀 快速开始

```bash
# 1. 克隆仓库（如果还没有）
git clone https://github.com/username/job-ai.git
cd job-ai/web

# 2. 安装依赖
npm install

# 3. 本地开发
npm run dev

# 4. 提交代码
git add .
git commit -m "feat: 初始化项目"
git push origin main

# 5. 等待部署完成...
# 访问 https://username.github.io/job-ai/
```
