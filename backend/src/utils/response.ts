/**
 * 统一响应格式工具
 * 与前端 web/src/types/enums.ts 保持一致
 */
import { Response } from 'express'
import { ResponseCode, ResponseMessage } from '@/constants/responseCode'
import type { ApiResponse } from '@/types'

/**
 * 将 BigInt 转换为字符串（用于 JSON 序列化）
 */
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  // 处理 BigInt
  if (typeof obj === 'bigint') {
    return obj.toString()
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt)
  }

  // 处理普通对象
  if (typeof obj === 'object') {
    const result: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = serializeBigInt(obj[key])
      }
    }
    return result
  }

  return obj
}

/**
 * 成功响应
 */
export function success<T>(res: Response, data: T, message?: string, code: ResponseCode = ResponseCode.SUCCESS): void {
  const serializedData = serializeBigInt(data)
  const response: ApiResponse<T> = {
    code,
    message: message || ResponseMessage[code],
    data: serializedData,
  }
  res.status(code).json(response)
}

/**
 * 失败响应
 */
export function fail(res: Response, message?: string, code: ResponseCode = ResponseCode.BAD_REQUEST, data?: any): void {
  const serializedData = data ? serializeBigInt(data) : undefined
  const response: ApiResponse = {
    code,
    message: message || ResponseMessage[code],
    data: serializedData,
  }
  res.status(code >= 500 && code <= 599 ? code : 200).json(response)
}

/**
 * 分页响应（前端格式：records/total/current/size/pages）
 */
export function paginate<T>(
  res: Response,
  list: T[],
  total: number,
  current: number,
  size: number,
  message?: string
): void {
  const pages = Math.ceil(total / size)
  const data = {
    records: serializeBigInt(list),
    total,
    current,
    size,
    pages,
  }
  success(res, data, message)
}

export default {
  success,
  fail,
  paginate,
}
