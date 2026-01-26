/**
 * 应用入口文件
 */
import dotenv from 'dotenv'
import createApp from '@/app'
import PrismaConfig from '@/config/database'
import logger from '@/utils/logger'

// 加载环境变量
dotenv.config()

// 启动服务器
async function startServer() {
  try {
    // 测试数据库连接
    const prisma = PrismaConfig.getInstance()
    await prisma.$connect()
    logger.info('Database connected successfully')

    // 创建 Express 应用
    const app = createApp()

    // 启动服务器
    const port = process.env.PORT || 8080
    const server = app.listen(port, () => {
      logger.info(`Server is running on port ${port}`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`Health check: http://localhost:${port}/health`)
    })

    // 优雅关闭
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`)

      server.close(async () => {
        logger.info('HTTP server closed')

        try {
          await PrismaConfig.disconnect()
          logger.info('Database connection closed')
          process.exit(0)
        } catch (error) {
          logger.error('Error during shutdown:', error)
          process.exit(1)
        }
      })

      // 强制关闭超时
      setTimeout(() => {
        logger.error('Forced shutdown after timeout')
        process.exit(1)
      }, 10000)
    }

    // 监听退出信号
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// 启动应用
startServer()

export default startServer
