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

# 复制 package 文件（从 backend 目录）
COPY backend/package*.json ./

# 复制 prisma schema
RUN mkdir -p ./prisma
COPY backend/prisma/schema.prisma ./prisma/schema.prisma

# 关键：复制 shared 包（npm 无法处理 workspace:* 依赖）
COPY packages/shared/ ../packages/shared/

# 安装依赖（使用 npm install 而不是 npm ci）
RUN npm install

# 复制源代码（从 backend 目录）
COPY backend/ ./

# 生成 Prisma Client
RUN npx prisma generate

# 构建项目
RUN npm run build

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

# 复制 package 文件（从 backend 目录）
COPY backend/package*.json ./

# 从构建阶段复制所有文件（包括 node_modules）
# 不需要在生产阶段重新安装依赖
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

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
