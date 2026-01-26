/**
 * 通用类型定义
 */

import { ResponseCode } from '@/constants/responseCode'

/**
 * API 统一响应格式
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 分页参数
 */
export interface PageParams {
  page?: number
  pageSize?: number
}

/**
 * 分页结果
 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 请求成功响应
 */
export interface SuccessResponse<T = any> {
  code: ResponseCode.SUCCESS
  message: string
  data: T
}

/**
 * 错误响应
 */
export interface ErrorResponse {
  code: ResponseCode
  message: string
  data?: any
}

export default {
  ApiResponse,
  PageParams,
  PageResult,
}
