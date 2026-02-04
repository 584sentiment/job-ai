/**
 * Express 应用配置
 */
import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { loggerMiddleware } from '@/middlewares/logger.middleware'
import { errorMiddleware, notFoundMiddleware } from '@/middlewares/error.middleware'
import routes from '@/routes'
import logger from '@/utils/logger'

/**
 * 创建并配置 Express 应用
 */
export function createApp(): Application {
  const app: Application = express()

  // 安全头设置
  app.use(helmet())

  // CORS 配置
  const isDevelopment = process.env.NODE_ENV === 'development'

  app.use(cors({
    origin: (requestOrigin, callback) => {
      // 允许没有 origin 的请求（比如 curl 或移动端）
      if (!requestOrigin) {
        return callback(null, true)
      }

      // 开发环境：允许所有本地请求
      if (isDevelopment) {
        // 允许 localhost（包括 IPv4 和 IPv6）
        if (
          requestOrigin.includes('localhost') ||
          requestOrigin.includes('127.0.0.1') ||
          requestOrigin.includes('[::1]') ||
          requestOrigin.startsWith('http://[::')  // IPv6 地址
        ) {
          return callback(null, true)
        }
        // 开发环境下也允许明确的白名单
        const allowedOrigins = process.env.CORS_ORIGIN
          ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
          : []
        if (allowedOrigins.includes(requestOrigin)) {
          return callback(null, true)
        }
      }

      // 生产环境：严格检查白名单
      const allowedOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
        : []

      // 检查逻辑：
      // 1. 在白名单中
      // 2. 是 Vercel 部署域名 (.vercel.app)
      // 3. 是自定义域名 (.100million.top)
      if (
        allowedOrigins.includes(requestOrigin) ||
        requestOrigin.endsWith('.vercel.app') ||
        requestOrigin.endsWith('.100million.top')
      ) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }))

  // 解析请求体
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // 请求日志
  app.use(loggerMiddleware)

  // 健康检查
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // API 路由
  app.use('/api', routes)

  // 404 处理
  app.use(notFoundMiddleware)

  // 全局错误处理
  app.use(errorMiddleware)

  logger.info('Express app configured')

  return app
}

export default createApp
