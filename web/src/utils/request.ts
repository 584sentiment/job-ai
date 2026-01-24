/**
 * API 请求工具（TypeScript 版本）
 */
import { ResponseCode, HttpStatusCode } from '@/types'
import type { ApiResponse } from '@/types'
import router from '@/router'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

/**
 * 请求配置
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  params?: Record<string, any>
  needAuth?: boolean
}

/**
 * 将对象转换为 URL 查询参数字符串
 */
function buildQueryString(params: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return ''
  }

  const queryPairs = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)

  return queryPairs.length > 0 ? `?${queryPairs.join('&')}` : ''
}

/**
 * 处理 HTTP 错误状态码
 */
function handleHttpError(status: number): void {
  switch (status) {
    case HttpStatusCode.INTERNAL_ERROR:
      router.push('/500')
      break
    case HttpStatusCode.NOT_FOUND:
      router.push('/404')
      break
    case HttpStatusCode.UNAUTHORIZED:
      router.push('/login')
      break
    default:
      break
  }
}

/**
 * 统一请求处理函数
 */
async function request<T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body = null,
    params = null,
    needAuth = false
  } = options

  // 构建完整 URL（处理查询参数）
  let fullUrl = `${BASE_URL}${url}`
  if (params && method === 'GET') {
    fullUrl += buildQueryString(params)
  }

  // 构建请求配置
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  // 如果需要认证且存在 token，添加到请求头
  if (needAuth) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      }
    }
  }

  // 如果有 body，添加到配置
  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(fullUrl, config)

    // 检查 HTTP 状态码
    if (!response.ok) {
      handleHttpError(response.status)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // 解析响应数据
    const result: ApiResponse<T> = await response.json()

    // 检查业务状态码
    if (result.code !== ResponseCode.SUCCESS) {
      throw new Error(result.message || '请求失败')
    }

    return result
  } catch (error) {
    // 网络错误或业务错误
    console.error('API请求失败:', error)
    throw error
  }
}

/**
 * GET 请求
 */
export function get<T = any>(url: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'GET' })
}

/**
 * POST 请求
 */
export function post<T = any>(url: string, data: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'POST', body: data })
}

/**
 * PUT 请求
 */
export function put<T = any>(url: string, data: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'PUT', body: data })
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'DELETE' })
}

/**
 * 需要认证的 GET 请求
 */
export function getWithAuth<T = any>(url: string, options: Omit<RequestOptions, 'method' | 'needAuth'> = {}): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'GET', needAuth: true })
}

/**
 * 需要认证的 POST 请求
 */
export function postWithAuth<T = any>(url: string, data: any, options: Omit<RequestOptions, 'method' | 'body' | 'needAuth'> = {}): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'POST', body: data, needAuth: true })
}

/**
 * 需要认证的 PUT 请求
 */
export function putWithAuth<T = any>(url: string, data: any, options: Omit<RequestOptions, 'method' | 'body' | 'needAuth'> = {}): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'PUT', body: data, needAuth: true })
}

/**
 * 需要认证的 DELETE 请求
 */
export function delWithAuth<T = any>(url: string, options: Omit<RequestOptions, 'method' | 'needAuth'> = {}): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'DELETE', needAuth: true })
}

export default request
