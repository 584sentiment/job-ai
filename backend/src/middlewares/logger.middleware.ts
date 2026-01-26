/**
 * 日志记录中间件
 */
import { Request, Response, NextFunction } from 'express'
import logger from '@/utils/logger'

/**
 * 请求日志中间件
 */
export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now()

  // 记录请求信息
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })

  // 监听响应完成事件
  res.on('finish', () => {
    const duration = Date.now() - startTime
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
    })
  })

  next()
}

export default loggerMiddleware
