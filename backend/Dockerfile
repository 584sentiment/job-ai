# 后端 Dockerfile - 多阶段构建
# 注意：此 Dockerfile 需要从项目根目录构建
# 构建命令：docker build -f backend/Dockerfile -t job-ai-backend .
#
# 阶段一：构建
FROM node:18-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制整个项目的依赖文件（Monorepo 结构）
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY backend/package.json ./backend/package.json

# 安装所有依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY packages/shared ./packages/shared
COPY backend ./backend

# 切换到 backend 目录进行构建
WORKDIR /app/backend

# 构建 Prisma 和应用
RUN pnpm run prisma:generate
RUN pnpm run build

# 阶段二：生产运行
FROM node:18-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 Monorepo 的依赖文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./

# 复制 shared 和 backend 的 package.json
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/backend/package.json ./backend/

# 安装生产依赖（现在包含 prisma）
RUN pnpm install --prod --frozen-lockfile

# 从构建阶段复制产物到 backend 目录
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./backend/prisma

# 复制环境变量文件（需要在服务器上创建 .env）
COPY backend/.env .env

# 切换到 backend 目录生成 Prisma Client
WORKDIR /app/backend
RUN pnpm run prisma:generate
WORKDIR /app

EXPOSE 8080

CMD ["node", "dist/index.js"]
