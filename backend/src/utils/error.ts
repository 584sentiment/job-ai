/**
 * 自定义错误类
 * 与前端 web/src/types/enums.ts 保持一致
 */
import { ResponseCode } from '@/constants/responseCode'

export class AppError extends Error {
  public readonly code: number
  public readonly statusCode: number
  public readonly data?: any

  constructor(message: string, code: ResponseCode = ResponseCode.INTERNAL_ERROR, data?: any) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = code >= 400 && code < 600 ? code : 500
    this.data = data

    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends AppError {
  constructor(message: string = '请求参数错误', data?: any) {
    super(message, ResponseCode.BAD_REQUEST, data)
    this.name = 'BadRequestError'
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = '未授权，请先登录') {
    super(message, ResponseCode.UNAUTHORIZED)
    this.name = 'UnauthorizedError'
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends AppError {
  constructor(message: string = '禁止访问') {
    super(message, ResponseCode.FORBIDDEN)
    this.name = 'ForbiddenError'
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
  constructor(message: string = '资源不存在') {
    super(message, ResponseCode.NOT_FOUND)
    this.name = 'NotFoundError'
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalError extends AppError {
  constructor(message: string = '服务器内部错误') {
    super(message, ResponseCode.INTERNAL_ERROR)
    this.name = 'InternalError'
  }
}

export default {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalError,
}
