/**
 * 数据库配置
 * 使用单例模式管理 Prisma Client 实例
 */
import 'dotenv/config'
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool, PoolConfig } from 'pg'

class PrismaConfig {
  private static instance: PrismaClient | null = null
  private static pool: Pool | null = null

  /**
   * 解析 DATABASE_URL 并返回 Pool 配置
   */
  private static parseDatabaseUrl(): PoolConfig {
    const url = process.env.DATABASE_URL

    if (!url) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    try {
      const parsed = new URL(url)
      const config: PoolConfig = {
        host: parsed.hostname,
        port: parsed.port ? parseInt(parsed.port) : 5432,
        database: parsed.pathname.slice(1), // 移除开头的 /
        user: parsed.username,
        password: decodeURIComponent(parsed.password),
      }

      // 支持 SSL 参数
      if (parsed.searchParams.has('sslmode')) {
        config.ssl = parsed.searchParams.get('sslmode') === 'require'
          ? { rejectUnauthorized: false }
          : undefined
      }

      return config
    } catch (error) {
      console.error('Failed to parse DATABASE_URL:', error)
      throw new Error('Invalid DATABASE_URL format')
    }
  }

  /**
   * 获取 Prisma Client 实例（单例模式）
   */
  static getInstance(): PrismaClient {
    if (!PrismaConfig.instance) {
      // 解析 DATABASE_URL 并创建 pg Pool
      const poolConfig = PrismaConfig.parseDatabaseUrl()
      PrismaConfig.pool = new Pool(poolConfig)

      const adapter = new PrismaPg(PrismaConfig.pool)

      PrismaConfig.instance = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error']
      })

      // 开发环境下，监听进程退出事件，关闭数据库连接
      if (process.env.NODE_ENV === 'development') {
        process.on('beforeExit', async () => {
          await PrismaConfig.disconnect()
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
    if (PrismaConfig.pool) {
      await PrismaConfig.pool.end()
      PrismaConfig.pool = null
    }
  }
}

export default PrismaConfig
