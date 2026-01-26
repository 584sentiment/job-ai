/**
 * JWT 工具函数
 */
import jwt from 'jsonwebtoken'
import JWT_CONFIG from '@/config/jwt'
import type { User } from '@prisma/client'

export interface JwtPayload {
  id: string
  phone: string
  nickname?: string
}

/**
 * 生成 JWT Token
 */
export function generateToken(user: Pick<User, 'id' | 'phone' | 'nickname'>): string {
  const payload: JwtPayload = {
    id: user.id,
    phone: user.phone,
    nickname: user.nickname || undefined,
  }

  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expiresIn,
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience,
  })
}

/**
 * 验证 JWT Token
 */
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret, {
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience,
    }) as JwtPayload

    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token 已过期')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token 无效')
    } else {
      throw error
    }
  }
}

/**
 * 解析 JWT Token（不验证，仅用于调试）
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.decode(token) as JwtPayload
    return decoded
  } catch {
    return null
  }
}

export default {
  generateToken,
  verifyToken,
  decodeToken,
}
