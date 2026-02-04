/**
 * 通用类型定义
 */

import { ResponseCode } from './enums'

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

/**
 * 分页响应
 */
export interface PageResponse<T> {
  /** 数据列表 */
  records: T[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  current: number
  /** 每页大小 */
  size: number
  /** 总页数 */
  pages: number
}
