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
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'
  app.use(cors({
    origin: corsOrigin.split(',').map(origin => origin.trim()),
    credentials: true,
  }))

  // 解析请求体
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // 请求日志
  app.use(loggerMiddleware)

  // 健康检查
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // API 路由
  app.use('/', routes)

  // 404 处理
  app.use(notFoundMiddleware)

  // 全局错误处理
  app.use(errorMiddleware)

  logger.info('Express app configured')

  return app
}

export default createApp
