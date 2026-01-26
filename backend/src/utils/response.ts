/**
 * 统一响应格式工具
 * 与前端 web/src/types/enums.ts 保持一致
 */
import { Response } from 'express'
import { ResponseCode, ResponseMessage } from '@/constants/responseCode'
import type { ApiResponse } from '@/types'

/**
 * 成功响应
 */
export function success<T>(res: Response, data: T, message?: string, code: ResponseCode = ResponseCode.SUCCESS): void {
  const response: ApiResponse<T> = {
    code,
    message: message || ResponseMessage[code],
    data,
  }
  res.status(code).json(response)
}

/**
 * 失败响应
 */
export function fail(res: Response, message?: string, code: ResponseCode = ResponseCode.BAD_REQUEST, data?: any): void {
  const response: ApiResponse = {
    code,
    message: message || ResponseMessage[code],
    data,
  }
  res.status(code >= 500 && code <= 599 ? code : 200).json(response)
}

/**
 * 分页响应
 */
export function paginate<T>(
  res: Response,
  list: T[],
  total: number,
  page: number,
  pageSize: number,
  message?: string
): void {
  const totalPages = Math.ceil(total / pageSize)
  const data = {
    list,
    total,
    page,
    pageSize,
    totalPages,
  }
  success(res, data, message)
}

export default {
  success,
  fail,
  paginate,
}
