# 🎯 部署检查清单

**检查日期**: 2025-02-05
**检查人**: Claude Sonnet 4.5

---

## ✅ 代码层面检查

### 1. 编译状态 ✅
```bash
✅ pnpm build:shared   # 共享包编译成功
✅ pnpm build:web      # 前端编译成功 (3.6s)
✅ pnpm build:backend  # 后端编译成功 (56ms)
```

### 2. 代码质量 ✅
```bash
✅ TypeScript 类型检查通过
✅ 无编译错误
✅ 无类型错误
✅ 导入路径正确
```

### 3. 依赖管理 ✅
```bash
✅ bcrypt → bcryptjs (已修复)
✅ pnpm workspace 配置正确
✅ 所有依赖安装成功
```

---

## ⚠️ 运行时检查

### 1. 数据库连接 ❌
**状态**: 需要用户操作

**错误信息**:
```
PrismaClientInitializationError:
Can't reach database server at `db.wwrljcwcadsckdghmexm.supabase.co:5432`
```

**原因**:
- Supabase 数据库可能已暂停（免费版自动暂停）
- 或网络连接问题

**解决步骤**:

#### 步骤 1: 登录 Supabase
```
https://supabase.com/dashboard
```

#### 步骤 2: 找到项目
- 项目名称: (根据您的 Supabase 账号)
- 项目 ID: wwrljcwcadsckdghmexm

#### 步骤 3: 检查数据库状态
- 导航到: **Settings** → **Database**
- 查看数据库状态指示器

#### 步骤 4: 恢复数据库
如果显示暂停状态：
- 点击 **"Resume"** 或 **"恢复"** 按钮
- 等待数据库启动完成（约 1-2 分钟）

#### 步骤 5: 验证连接
```bash
cd backend
pnpm prisma db push
```

**预期结果**:
```
✔ Loaded env from .env
✔ Connected to database
...
🚀 Done in Xs
```

---

## 🚀 启动服务（数据库恢复后）

### 方式 1: 开发模式

#### 终端 1 - 启动后端
```bash
cd backend
pnpm dev
```

**预期输出**:
```
> job-ai-backend@1.0.0 dev
> tsx watch src/index.ts

Server is running on port 8080
Database connected successfully
```

#### 终端 2 - 启动前端
```bash
pnpm dev
```

**预期输出**:
```
> job-ai-monorepo@1.0.0 dev
> pnpm --filter job-tracker-web dev

  VITE v5.4.21  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 方式 2: 生产模式

#### 启动后端
```bash
cd backend
PORT=8080 NODE_ENV=production node dist/index.js
```

#### 启动前端预览
```bash
cd web
pnpm preview
```

---

## 🧪 功能测试

### 1. 健康检查
```bash
curl http://localhost:8080/api
```

**预期响应**:
```json
{
  "code": 200,
  "message": "API is running",
  "data": {
    "status": "ok",
    "timestamp": "2025-02-05T..."
  }
}
```

### 2. 用户注册测试
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "password": "test123456",
    "nickname": "测试用户"
  }'
```

### 3. 前端访问
```
http://localhost:5173
```

**测试功能**:
- [ ] 注册页面
- [ ] 登录页面
- [ ] 岗位列表
- [ ] 添加岗位
- [ ] 面试列表
- [ ] 面经列表

---

## 🐛 故障排除

### 问题 1: bcrypt 模块错误
✅ **已解决** - 已替换为 bcryptjs

### 问题 2: 数据库连接失败
⚠️ **需要处理** - 按照上述步骤恢复 Supabase 数据库

### 问题 3: 端口被占用
```bash
# 查看端口占用
lsof -i :8080

# 更改端口
PORT=3001 pnpm dev
```

### 问题 4: 前端无法连接后端
**检查项**:
1. 后端是否启动: `curl http://localhost:8080/api`
2. CORS 配置是否正确
3. 前端代理配置: `web/vite.config.js`

---

## 📊 验证清单

### 环境检查
- [ ] Node.js 已安装 (v20+)
- [ ] pnpm 已安装 (v8+)
- [ ] Supabase 数据库已恢复
- [ ] .env 文件配置正确

### 编译检查
- [ ] pnpm build 成功
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告

### 运行检查
- [ ] 后端启动成功
- [ ] 前端启动成功
- [ ] 健康检查通过
- [ ] 数据库连接正常

### 功能检查
- [ ] 用户注册功能
- [ ] 用户登录功能
- [ ] 岗位 CRUD 功能
- [ ] 面试记录功能
- [ ] 面经管理功能

---

## 📞 获取帮助

### 文档资源
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - 项目状态
- [QUICK_START.md](./QUICK_START.md) - 快速开始
- [TESTING_SUMMARY.md](./TESTING_SUMMARY.md) - 测试总结

### 常用命令
```bash
# 查看日志
tail -f backend/logs/combined.log

# 数据库操作
cd backend
pnpm prisma studio        # 打开 Prisma Studio
pnpm prisma db pull       # 拉取数据库结构
pnpm prisma generate      # 生成 Prisma Client

# 清理和重建
pnpm clean
pnpm install
pnpm build
```

---

## ✨ 下一步

### 立即行动
1. **恢复 Supabase 数据库** ⭐ 最重要
2. **运行 `bash test-backend.sh`** 测试后端
3. **运行 `pnpm dev`** 启动前端

### 后续优化
1. 添加自动化测试
2. 性能监控
3. 错误日志收集
4. 部署到生产环境

---

**准备就绪后，所有功能即可正常使用！** 🎉
