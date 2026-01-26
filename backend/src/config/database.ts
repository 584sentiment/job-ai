/**
 * 数据库配置
 * 使用单例模式管理 Prisma Client 实例
 */
import { PrismaClient } from '@prisma/client'

class PrismaConfig {
  private static instance: PrismaClient | null = null

  /**
   * 获取 Prisma Client 实例（单例模式）
   */
  static getInstance(): PrismaClient {
    if (!PrismaConfig.instance) {
      PrismaConfig.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error']
      })

      // 开发环境下，监听进程退出事件，关闭数据库连接
      if (process.env.NODE_ENV === 'development') {
        process.on('beforeExit', () => {
          PrismaConfig.instance?.$disconnect()
        })
      }
    }

    return PrismaConfig.instance
  }

  /**
   * 关闭数据库连接
   */
  static async disconnect(): Promise<void> {
    if (PrismaConfig.instance) {
      await PrismaConfig.instance.$disconnect()
      PrismaConfig.instance = null
    }
  }
}

export default PrismaConfig
