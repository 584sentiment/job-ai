# 求职追踪助手后端服务

求职追踪助手（Job Tracker）的后端 API 服务，为 Web 端和微信小程序提供数据支持。

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Express 4.x
- **语言**: TypeScript 5.x
- **ORM**: Prisma 5.x
- **数据库**: Supabase (PostgreSQL 15)
- **认证**: JWT (jsonwebtoken)
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并填入配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置 Supabase 数据库连接：

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key"
PORT=8080
NODE_ENV="development"
```

### 3. 初始化数据库

```bash
# 生成 Prisma Client
npm run prisma:generate

# 推送数据库结构
npm run prisma:push

# 可选：运行种子数据
npm run prisma:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:8080` 启动。

## 项目结构

```
backend/
├── prisma/                      # 数据库相关
│   ├── schema.prisma            # 数据模型定义
│   └── seed.ts                  # 种子数据
├── src/
│   ├── index.ts                 # 应用入口
│   ├── app.ts                   # Express 应用配置
│   ├── config/                  # 配置文件
│   │   ├── database.ts          # 数据库配置
│   │   └── jwt.ts               # JWT 配置
│   ├── controllers/             # 控制器层（处理请求）
│   │   ├── user.controller.ts
│   │   ├── position.controller.ts
│   │   ├── interview.controller.ts
│   │   ├── experience.controller.ts
│   │   └── summary.controller.ts
│   ├── services/                # 业务逻辑层
│   │   ├── user.service.ts
│   │   ├── position.service.ts
│   │   ├── interview.service.ts
│   │   ├── experience.service.ts
│   │   └── summary.service.ts
│   ├── middlewares/             # 中间件
│   │   ├── auth.middleware.ts   # JWT 认证
│   │   ├── error.middleware.ts  # 错误处理
│   │   ├── validate.middleware.ts # 请求验证
│   │   └── logger.middleware.ts # 日志记录
│   ├── routes/                  # 路由定义
│   │   ├── index.ts
│   │   ├── user.routes.ts
│   │   ├── position.routes.ts
│   │   ├── interview.routes.ts
│   │   ├── experience.routes.ts
│   │   └── summary.routes.ts
│   ├── types/                   # TypeScript 类型定义
│   │   ├── express.d.ts
│   │   └── index.ts
│   ├── utils/                   # 工具函数
│   │   ├── logger.ts            # 日志工具
│   │   ├── response.ts          # 统一响应格式
│   │   ├── error.ts             # 错误处理
│   │   └── jwt.ts               # JWT 工具
│   └── constants/               # 常量定义
│       ├── responseCode.ts      # 响应状态码
│       └── index.ts
├── .env.example                 # 环境变量示例
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## API 文档

### 用户认证

- `POST /users/register` - 用户注册
- `POST /users/login` - 用户登录
- `GET /users/current` - 获取当前用户信息
- `PUT /users` - 更新用户信息
- `POST /users/change-password` - 修改密码
- `POST /users/logout` - 用户登出

### 岗位管理

- `POST /positions/page` - 分页查询岗位
- `GET /positions/:id` - 获取岗位详情
- `POST /positions` - 创建岗位
- `PUT /positions` - 更新岗位
- `DELETE /positions/:id` - 删除岗位
- `POST /positions/:id/collect` - 切换收藏状态

### 面试管理

- `POST /interviews` - 创建面试记录
- `PUT /interviews/:id` - 更新面试记录
- `DELETE /interviews/:id` - 删除面试记录
- `GET /interviews/position/:positionId` - 获取岗位的面试列表
- `POST /interviews/page` - 分页查询面试记录
- `GET /interviews/:id` - 获取面试详情

### 面经管理

- `POST /experiences` - 创建面经
- `PUT /experiences/:id` - 更新面经
- `DELETE /experiences/:id` - 删除面经
- `GET /experiences/:id` - 获取面经详情
- `POST /experiences/page` - 分页查询面经
- `GET /experiences/all` - 获取所有面经
- `POST /experiences/:id/favorite` - 切换收藏状态
- `POST /experiences/search` - 搜索面经
- `POST /experiences/batch-delete` - 批量删除面经

### 面试总结

- `POST /summaries` - 创建总结
- `GET /summaries/:id` - 获取总结详情
- `PUT /summaries/:id` - 更新总结
- `DELETE /summaries/:id` - 删除总结
- `POST /summaries/page` - 分页查询总结

## 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量（`DATABASE_URL`、`JWT_SECRET`）
4. 部署完成

### 本地构建

```bash
npm run build
npm start
```

## 开发指南

### 添加新的 API 接口

1. 在 `prisma/schema.prisma` 中定义数据模型
2. 运行 `npm run prisma:push` 更新数据库
3. 在 `src/services/` 中创建业务逻辑
4. 在 `src/controllers/` 中创建控制器
5. 在 `src/routes/` 中定义路由
6. 在 `src/routes/index.ts` 中注册路由

### 数据库操作

使用 Prisma Client：

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 查询
const users = await prisma.user.findMany()

// 创建
const user = await prisma.user.create({
  data: {
    phone: '13800138000',
    password: 'hashedPassword',
    nickname: '张三'
  }
})

// 更新
const updated = await prisma.user.update({
  where: { id: userId },
  data: { nickname: '李四' }
})

// 删除
await prisma.user.delete({
  where: { id: userId }
})
```

## 环境变量说明

| 变量 | 说明 | 示例 |
|------|------|------|
| `DATABASE_URL` | Supabase PostgreSQL 连接字符串 | `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres` |
| `JWT_SECRET` | JWT 签名密钥 | `your-super-secret-jwt-key` |
| `PORT` | 服务器端口 | `8080` |
| `NODE_ENV` | 运行环境 | `development` / `production` |
| `LOG_LEVEL` | 日志级别 | `debug` / `info` / `warn` / `error` |
| `CORS_ORIGIN` | 允许的跨域源 | `http://localhost:3000` |

## 常见问题

### 1. Prisma Client 生成失败

```bash
# 重新生成 Prisma Client
npm run prisma:generate
```

### 2. 数据库连接失败

检查 `DATABASE_URL` 是否正确配置，可以从 Supabase Dashboard 获取。

### 3. JWT 验证失败

确保 `JWT_SECRET` 配置正确，且前后端使用相同的密钥。

## License

MIT
