/**
 * Express 类型扩展
 */
import { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      // JWT 认证后，将用户信息附加到 request 对象
      user?: {
        id: string
        phone: string
        nickname?: string
      }
    }
  }
}

export {}
