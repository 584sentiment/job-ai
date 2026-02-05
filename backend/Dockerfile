# 后端服务 Dockerfile
# 构建上下文：项目根目录（/var/www/job-ai）

# 阶段 1: 构建阶段
FROM node:20-alpine AS builder

# 安装 OpenSSL 和构建依赖（Prisma 需要）
RUN apk add --no-cache \
    openssl \
    curl \
    python3 \
    make \
    g++

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 workspace 配置文件
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY backend/package*.json ./backend/

# 安装所有依赖（使用 pnpm）
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY backend/ ./backend/
COPY packages/shared/ ./packages/shared/

# 生成 Prisma Client
RUN pnpm --filter backend prisma generate

# 构建项目
RUN pnpm --filter backend build

# 阶段 2: 生产阶段
FROM node:20-alpine AS production

# 安装运行时依赖
RUN apk add --no-cache \
    dumb-init \
    openssl \
    libgcc \
    libstdc++

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# 从构建阶段复制文件
COPY --from=builder --chown=nodejs:nodejs /app/backend/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/backend/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/backend/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared ./packages/shared

# 设置 OpenSSL 库路径
ENV LD_LIBRARY_PATH=/usr/lib:/usr/local/lib:/lib:/lib64

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 使用 dumb-init 启动
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
