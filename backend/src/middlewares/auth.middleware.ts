/**
 * JWT 认证中间件
 */
import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@/utils/jwt'
import { UnauthorizedError } from '@/utils/error'

/**
 * JWT 认证中间件
 * 验证请求头中的 Authorization: Bearer <token>
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    // 获取 Token
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('缺少认证令牌')
    }

    const token = authHeader.substring(7) // 移除 "Bearer " 前缀

    // 验证 Token
    const decoded = verifyToken(token)

    // 添加调试日志
    console.log('[Auth Middleware] Token 验证成功:', {
      id: decoded.id,
      phone: decoded.phone,
      nickname: decoded.nickname
    })

    // 将用户信息附加到 request 对象
    req.user = {
      id: decoded.id,
      phone: decoded.phone,
      nickname: decoded.nickname,
    }

    next()
  } catch (error) {
    console.error('[Auth Middleware] Token 验证失败:', error)
    if (error instanceof Error) {
      next(new UnauthorizedError(error.message))
    } else {
      next(new UnauthorizedError('认证失败'))
    }
  }
}

/**
 * 可选认证中间件
 * 如果有 Token 则验证，没有则跳过
 */
export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = verifyToken(token)

      req.user = {
        id: decoded.id,
        phone: decoded.phone,
        nickname: decoded.nickname,
      }
    }

    next()
  } catch {
    // 静默失败，不阻断请求
    next()
  }
}

export default {
  authMiddleware,
  optionalAuthMiddleware,
}
