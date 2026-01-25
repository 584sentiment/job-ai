# GitHub Pages 部署配置完成

## ✅ 已完成的配置

### 1. 创建 GitHub Actions Workflow
- **文件**: `.github/workflows/deploy.yml`
- **功能**: 自动构建并部署到 GitHub Pages
- **触发条件**:
  - 推送到 `main` 或 `master` 分支
  - 手动触发 (workflow_dispatch)

### 2. 配置 Vite 支持 GitHub Pages
- **文件**: `vite.config.js`
- **修改**: 添加 `base` 配置
- **配置**: `base: process.env.NODE_ENV === 'production' ? '/job-ai/' : '/'`

### 3. 更新 Vue Router
- **文件**: `src/router/index.js`
- **修改**: 使用 `import.meta.env.BASE_URL`
- **配置**: `history: createWebHistory(import.meta.env.BASE_URL)`

### 4. 添加部署脚本
- **文件**: `package.json`
- **新增**: `build:github` 命令
- **功能**: 本地构建 GitHub Pages 版本

### 5. 创建文档
- **文件**: `GITHUB-PAGES.md`
- **内容**: 详细的 GitHub Pages 部署指南

### 6. 更新 README
- **文件**: `README.md`
- **新增**: 部署章节

## 🚀 部署步骤

### 第一次部署

1. **在 GitHub 上启用 Pages**
   ```
   仓库 > Settings > Pages
   Source: GitHub Actions
   ```

2. **配置环境变量（可选）**
   ```
   仓库 > Settings > Secrets and variables > Actions > Variables

   Name: VITE_API_BASE_URL
   Value: http://ybb9647b.natappfree.cc/job-track-assistant
   ```

3. **推送代码**
   ```bash
   git add .
   git commit -m "feat: 配置 GitHub Pages 部署"
   git push origin main
   ```

4. **查看部署进度**
   ```
   仓库 > Actions > Deploy to GitHub Pages
   ```

5. **访问网站**
   ```
   https://username.github.io/job-ai/
   ```

### 后续更新

以后每次推送代码到 `main` 分支都会自动部署：

```bash
git add .
git commit -m "feat: 添加新功能"
git push origin main
# 等待 2-5 分钟...
# 自动部署完成 ✅
```

## 🔧 重要配置说明

### base 路径配置

如果仓库名不是 `job-ai`，需要修改：

**vite.config.js**:
```javascript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

**GitHub Actions workflow** (无需修改，自动使用)

### 环境变量

在 GitHub 仓库中配置后端 API 地址：

```
Settings > Secrets and variables > Actions > Variables

添加变量:
- Name: VITE_API_BASE_URL
- Value: http://ybb9647b.natappfree.cc/job-track-assistant
```

## 📋 文件清单

### 新增文件
```
web/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml          # GitHub Actions 配置
│   └── SETUP-GUIDE.md          # 本文件
├── GITHUB-PAGES.md              # GitHub Pages 部署指南
└── README.md                    # 已更新
```

### 修改的文件
```
web/
├── vite.config.js               # 添加 base 配置
├── package.json                 # 添加 build:github 脚本
└── src/router/index.js          # 更新路由配置
```

## 🎯 部署流程

```
┌─────────────┐
│ 推送代码     │
│ git push    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ GitHub Actions 触发 │
└──────┬──────────────┘
       │
       ▼
┌─────────────┐
│ 安装依赖     │
│ npm ci      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 构建项目     │
│ npm run     │
│ build       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 上传产物     │
│ dist/       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 部署到       │
│ GitHub Pages│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 网站上线 ✅  │
└─────────────┘
```

## ⚠️ 注意事项

1. **首次部署**: 可能需要等待几分钟才能访问
2. **仓库名称**: 确保 `vite.config.js` 中的 `base` 路径与仓库名一致
3. **环境变量**: 后端 API 地址需要在 GitHub 仓库中配置
4. **分支保护**: 可以设置分支保护规则，确保只有测试通过的代码才能部署
5. **HTTPS**: GitHub Pages 自动提供 HTTPS，无需额外配置

## 🔗 相关链接

- **部署指南**: `web/GITHUB-PAGES.md`
- **Vercel 部署**: `web/DEPLOYMENT.md`
- **组件开发**: `web/COMPONENTS.md`
- **项目 README**: `web/README.md`

## 📞 常见问题

### 部署失败？

查看 GitHub Actions 日志：
```
仓库 > Actions > 选择失败的运行 > 查看日志
```

### 页面空白？

检查：
1. `vite.config.js` 中的 `base` 配置
2. 浏览器控制台是否有 404 错误
3. Vue Router 是否使用了 `import.meta.env.BASE_URL`

### API 请求失败？

检查：
1. GitHub Actions 环境变量是否配置
2. 后端 API 是否可从公网访问
3. 浏览器网络请求日志

## ✨ 下一步

1. 推送代码到 GitHub
2. 等待 GitHub Actions 完成部署
3. 访问你的 GitHub Pages 网站
4. （可选）配置自定义域名
5. （可选）添加构建状态徽章到 README

祝部署顺利！🎉
