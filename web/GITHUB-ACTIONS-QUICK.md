# GitHub Actions 快速参考

## ⚠️ 关键要点

**GitHub Actions workflow 文件必须放在仓库根目录！**

```
job-ai/                      # ✅ 仓库根目录
├── .github/
│   └── workflows/
│       └── deploy.yml      # ✅ 正确位置
└── web/                     # Web 项目
    ├── src/
    └── package.json
```

## ❌ 错误示例

```
job-ai/
└── web/
    └── .github/
        └── workflows/
            └── deploy.yml  # ❌ GitHub Actions 不会读取这里
```

## ✅ 正确配置

### Workflow 文件位置

**文件**: `.github/workflows/deploy.yml`（仓库根目录）

**关键配置**:
```yaml
steps:
  - name: Install dependencies
    working-directory: ./web  # 在 web 目录下执行
    run: npm ci

  - name: Build
    working-directory: ./web  # 在 web 目录下执行
    run: npm run build
```

## 🚀 部署流程

```
推送代码到 main
    ↓
GitHub Actions 读取根目录 .github/workflows/deploy.yml
    ↓
进入 web 目录执行命令
    ↓
构建产物在 web/dist/
    ↓
部署到 GitHub Pages ✅
```

## 📋 检查清单

- [ ] Workflow 在仓库根目录 `.github/workflows/`
- [ ] 所有命令都有 `working-directory: ./web`
- [ ] 构建产物路径为 `./web/dist`

## 📚 文档链接

- [详细配置说明](../.github/WORKFLOW-SETUP.md)
- [完整部署指南](./GITHUB-PAGES.md)
