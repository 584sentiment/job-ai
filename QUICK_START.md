# 🚀 快速开始指南

## 环境检查 ✅

- ✅ Node.js: v24.9.0
- ✅ pnpm: 10.12.4
- ✅ 编译状态: 全部通过
- ⚠️ 数据库: 需要恢复

## 快速命令

### 安装依赖
```bash
pnpm install
```

### 编译项目
```bash
# 编译所有包
pnpm build

# 单独编译
pnpm build:shared   # 共享包
pnpm build:web      # 前端
pnpm build:backend  # 后端
```

### 启动服务

#### 后端 (数据库可用后)
```bash
# 开发模式
cd backend && pnpm dev

# 生产模式
pnpm start
# 或
PORT=8080 node backend/dist/index.js
```

#### 前端
```bash
# 开发模式
pnpm dev

# 生产预览
cd web && pnpm preview
```

### 测试
```bash
# 后端测试
bash test-backend.sh

# 类型检查
pnpm type-check
```

## 🔧 故障排除

### bcrypt 问题
✅ **已解决** - 使用 bcryptjs

### 数据库连接
⚠️ **需手动处理**:
1. 登录 Supabase Dashboard
2. 恢复数据库服务
3. 验证连接: `cd backend && pnpm prisma db push`

### 端口占用
```bash
# 检查端口
lsof -i :8080

# 更改端口
PORT=3001 pnpm dev
```

## 📁 项目结构

```
job-ai/
├── packages/shared/     # 共享类型和工具
├── web/                 # Vue 3 前端
├── backend/             # Express 后端
├── miniprogram/         # 微信小程序
├── pnpm-workspace.yaml  # Workspace 配置
├── test-backend.sh      # 后端测试脚本
├── TEST_REPORT.md       # 测试报告
└── TESTING_SUMMARY.md   # 测试总结
```

## 🎯 当前状态

### ✅ 已完成
- Monorepo 架构
- 代码重复消除
- bcrypt 模块修复
- 所有包编译成功

### ⚠️ 待处理
- 数据库连接恢复
- API 功能测试
- 前后端联调

## 📞 下一步

1. **恢复数据库** - 登录 Supabase
2. **测试后端** - 运行 `bash test-backend.sh`
3. **测试前端** - 运行 `pnpm dev`
4. **功能测试** - 测试 API 和页面

---

**文档**: [TESTING_SUMMARY.md](./TESTING_SUMMARY.md) | [TEST_REPORT.md](./TEST_REPORT.md)
