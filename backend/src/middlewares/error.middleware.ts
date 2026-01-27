/**
 * 错误处理中间件
 */
import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import logger from '@/utils/logger'
import { AppError } from '@/utils/error'
import { fail } from '@/utils/response'
import { ResponseCode } from '@/constants/responseCode'

/**
 * 全局错误处理中间件
 */
export function errorMiddleware(
  error: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 记录错误日志
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  })

  // 处理自定义错误
  if (error instanceof AppError) {
    fail(res, error.message, error.code as ResponseCode, error.data)
    return
  }

  // 处理 Prisma 错误
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // 唯一约束冲突（如手机号已注册）
    if (error.code === 'P2002') {
      fail(res, '该手机号已注册', ResponseCode.BAD_REQUEST)
      return
    }

    // 记录不存在
    if (error.code === 'P2025') {
      fail(res, '记录不存在', ResponseCode.NOT_FOUND)
      return
    }

    // 其他 Prisma 错误
    fail(res, '数据库操作失败', ResponseCode.INTERNAL_ERROR)
    return
  }

  // 处理验证错误（如 Joi 验证失败）
  if (error.name === 'ValidationError') {
    fail(res, error.message, ResponseCode.BAD_REQUEST)
    return
  }

  // 未知错误
  fail(
    res,
    process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误',
    ResponseCode.INTERNAL_ERROR
  )
}

/**
 * 404 处理中间件
 */
export function notFoundMiddleware(req: Request, res: Response): void {
  fail(res, `路径 ${req.url} 不存在`, ResponseCode.NOT_FOUND)
}

export default {
  errorMiddleware,
  notFoundMiddleware,
}
