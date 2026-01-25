# GitHub Actions Workflow 配置说明

## 📁 文件位置

⚠️ **重要**: GitHub Actions workflow 文件必须放在**仓库根目录**。

```
job-ai/                          # 仓库根目录
├── .github/
│   └── workflows/
│       └── deploy.yml          # ✅ Workflow 文件在这里
├── miniprogram/                 # 微信小程序
├── web/                         # Web 前端项目
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── ...
```

## 🔧 工作原理

GitHub Actions 从仓库根目录读取 workflow 文件，然后使用 `working-directory` 指定在 `web` 目录下执行命令：

```yaml
steps:
  - name: Install dependencies
    working-directory: ./web  # 进入 web 目录
    run: npm ci

  - name: Build
    working-directory: ./web  # 在 web 目录下构建
    run: npm run build

  - name: Upload artifact
    # 上传 web 目录下的构建产物
    path: ./web/dist
```

## 📝 Workflow 配置说明

### 触发条件

```yaml
on:
  push:
    branches: [main, master]  # 推送到 main/master 分支时触发
  workflow_dispatch:          # 允许手动触发
```

### 构建步骤

1. **Checkout 代码**
   ```yaml
   - uses: actions/checkout@v4
   ```

2. **设置 Node.js**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: '20'
       cache: 'npm'
       cache-dependency-path: web/package-lock.json
   ```

3. **安装依赖**（在 web 目录）
   ```yaml
   - working-directory: ./web
     run: npm ci
   ```

4. **构建项目**（在 web 目录）
   ```yaml
   - working-directory: ./web
     run: npm run build
     env:
       VITE_API_BASE_URL: ${{ vars.VITE_API_BASE_URL || 'http://ybb9647b.natappfree.cc/job-track-assistant' }}
   ```

5. **上传构建产物**
   ```yaml
   - uses: actions/upload-pages-artifact@v3
     with:
       path: ./web/dist  # web 目录下的 dist
   ```

6. **部署到 GitHub Pages**
   ```yaml
   - uses: actions/deploy-pages@v4
   ```

## 🚀 使用方法

### 自动部署

```bash
# 推送代码到 main 分支
git push origin main

# GitHub Actions 自动触发
# 构建并部署到 GitHub Pages
```

### 手动触发

1. 访问 GitHub 仓库
2. 点击 **Actions** 标签
3. 选择 **Deploy to GitHub Pages** workflow
4. 点击 **Run workflow**
5. 选择分支并运行

## 🔍 查看部署日志

```
GitHub 仓库 > Actions > Deploy to GitHub Pages > 选择运行记录
```

可以查看：
- 构建进度
- 错误日志
- 部署状态

## ⚙️ 环境变量配置

在 GitHub 仓库配置后端 API 地址：

```
Settings > Secrets and variables > Actions > Variables

添加变量：
Name: VITE_API_BASE_URL
Value: http://ybb9647b.natappfree.cc/job-track-assistant
```

## 📊 构建状态徽章

在 README.md 中添加：

```markdown
![Deploy](https://github.com/username/job-ai/actions/workflows/deploy.yml/badge.svg)
```

替换 `username` 和 `job-ai` 为你的实际值。

## ❌ 常见错误

### 错误 1: Workflow 文件找不到

**问题**: `Workflow file not found`

**原因**: Workflow 文件放在了子目录（如 `web/.github/workflows/`）

**解决**: 将文件移到仓库根目录 `.github/workflows/`

### 错误 2: 找不到 package.json

**问题**: `package.json not found`

**原因**: 没有使用 `working-directory`

**解决**: 确保所有命令都指定了 `working-directory: ./web`

### 错误 3: 构建产物找不到

**问题**: `No files were found with the provided path`

**原因**: 上传路径不正确

**解决**: 使用 `path: ./web/dist`

## ✅ 检查清单

部署前检查：

- [ ] Workflow 文件在仓库根目录 `.github/workflows/deploy.yml`
- [ ] 所有命令都指定了 `working-directory: ./web`
- [ ] 上传路径为 `./web/dist`
- [ ] GitHub Pages 已启用（Source: GitHub Actions）
- [ ] 环境变量已配置（如果需要）
- [ ] `vite.config.js` 中的 `base` 路径正确

## 📚 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [详细部署指南](../web/GITHUB-PAGES.md)
