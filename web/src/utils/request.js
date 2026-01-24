/**
 * API 请求基础配置
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

/**
 * 业务状态码常量
 */
const SUCCESS_CODE = 200

/**
 * 统一请求处理函数
 * @param {string} url - 请求地址
 * @param {object} options - 请求配置
 * @returns {Promise} 返回 Promise
 */
async function request(url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    needAuth = false
  } = options

  // 构建请求配置
  const config = {
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
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }

  // 如果有 body，添加到配置
  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, config)

    // 解析响应数据
    const result = await response.json()

    // 检查业务状态码
    if (result.code !== SUCCESS_CODE) {
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
export function get(url, options = {}) {
  return request(url, { ...options, method: 'GET' })
}

/**
 * POST 请求
 */
export function post(url, data, options = {}) {
  return request(url, { ...options, method: 'POST', body: data })
}

/**
 * PUT 请求
 */
export function put(url, data, options = {}) {
  return request(url, { ...options, method: 'PUT', body: data })
}

/**
 * DELETE 请求
 */
export function del(url, options = {}) {
  return request(url, { ...options, method: 'DELETE' })
}

/**
 * 需要认证的 GET 请求
 */
export function getWithAuth(url, options = {}) {
  return request(url, { ...options, method: 'GET', needAuth: true })
}

/**
 * 需要认证的 POST 请求
 */
export function postWithAuth(url, data, options = {}) {
  return request(url, { ...options, method: 'POST', body: data, needAuth: true })
}

/**
 * 需要认证的 PUT 请求
 */
export function putWithAuth(url, data, options = {}) {
  return request(url, { ...options, method: 'PUT', body: data, needAuth: true })
}

/**
 * 需要认证的 DELETE 请求
 */
export function delWithAuth(url, options = {}) {
  return request(url, { ...options, method: 'DELETE', needAuth: true })
}

export default request
