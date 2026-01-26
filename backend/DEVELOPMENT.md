# 开发指南

## 本地开发

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置 Supabase 数据库连接：

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key"
PORT=8080
NODE_ENV="development"
LOG_LEVEL="debug"
CORS_ORIGIN="http://localhost:3000"
```

### 3. 初始化数据库

```bash
# 生成 Prisma Client
npm run prisma:generate

# 推送数据库结构到 Supabase
npm run prisma:push

# 可选：运行种子数据
npm run prisma:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:8080` 启动。

### 5. 测试 API

使用 Postman 或 cURL 测试 API：

```bash
# 健康检查
curl http://localhost:8080/health

# 用户注册
curl -X POST http://localhost:8080/users/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'

# 用户登录
curl -X POST http://localhost:8080/users/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'
```

## 数据库管理

### Prisma Studio

Prisma Studio 是一个可视化的数据库管理工具：

```bash
npm run prisma:studio
```

访问 `http://localhost:5555` 查看和编辑数据。

### 数据库迁移

```bash
# 创建迁移
npm run prisma:migrate

# 推送 schema（开发环境）
npm run prisma:push

# 重置数据库（危险操作）
npx prisma migrate reset
```

## 添加新功能

### 1. 添加数据模型

编辑 `prisma/schema.prisma`：

```prisma
model NewModel {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("new_models")
}
```

运行迁移：

```bash
npm run prisma:push
```

### 2. 创建服务层

创建 `src/services/newModel.service.ts`：

```typescript
import PrismaConfig from '@/config/database'
import { NotFoundError } from '@/utils/error'

const prisma = PrismaConfig.getInstance()

export async function getNewModel(id: string) {
  const model = await prisma.newModel.findUnique({ where: { id } })

  if (!model) {
    throw new NotFoundError('记录不存在')
  }

  return model
}

// ... 其他 CRUD 操作
```

### 3. 创建控制器层

创建 `src/controllers/newModel.controller.ts`：

```typescript
import { Request, Response, NextFunction } from 'express'
import newModelService from '@/services/newModel.service'
import { success } from '@/utils/response'

export async function getNewModel(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const model = await newModelService.getNewModel(id)
    success(res, model)
  } catch (error) {
    next(error)
  }
}

// ... 其他控制器方法
```

### 4. 创建路由

创建 `src/routes/newModel.routes.ts`：

```typescript
import { Router } from 'express'
import newModelController from '@/controllers/newModel.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'

const router = Router()

router.get('/:id', authMiddleware, newModelController.getNewModel)

// ... 其他路由

export default router
```

### 5. 注册路由

在 `src/routes/index.ts` 中添加：

```typescript
import newModelRoutes from './newModel.routes'

router.use('/newmodels', newModelRoutes)
```

## 代码规范

### 命名规范

- **文件命名**：短横线命名法（`user.service.ts`）
- **变量/函数命名**：驼峰命名法（`getUserById`）
- **类命名**：帕斯卡命名法（`PrismaConfig`）
- **常量命名**：全大写下划线分隔（`DEFAULT_PAGE_SIZE`）

### 目录结构规范

```
src/
├── config/         # 配置文件
├── controllers/    # 控制器层（处理请求和响应）
├── services/       # 服务层（业务逻辑）
├── middlewares/    # 中间件
├── routes/         # 路由定义
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数
└── constants/      # 常量定义
```

### 注释规范

使用 JSDoc 注释：

```typescript
/**
 * 根据 ID 获取用户信息
 * @param id - 用户ID
 * @returns 用户信息
 */
export async function getUserById(id: string): Promise<User> {
  // ...
}
```

## 常见问题

### 1. 路径别名 @/ 无法解析

确保 `tsconfig.json` 配置正确：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 2. Prisma Client 未生成

```bash
npm run prisma:generate
```

### 3. 数据库连接失败

检查 `.env` 文件中的 `DATABASE_URL` 是否正确配置。

### 4. JWT 验证失败

确保 `JWT_SECRET` 配置正确，且前后端使用相同的密钥。

## 调试技巧

### VS Code 调试配置

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "启动后端服务",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 日志查看

日志文件保存在 `logs/` 目录：

```bash
# 查看错误日志
cat logs/error.log

# 查看所有日志
cat logs/combined.log

# 实时查看日志
tail -f logs/combined.log
```

## 测试

### 单元测试（待实现）

```bash
npm test
```

### 集成测试（待实现）

```bash
npm run test:integration
```

## 部署

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 配置环境变量
vercel env add DATABASE_URL
vercel env add JWT_SECRET

# 生产环境部署
vercel --prod
```

详细部署步骤请参考 [README.md](./README.md)。
