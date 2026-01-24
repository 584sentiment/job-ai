/**
 * API 响应相关常量
 */

/**
 * 业务状态码枚举
 */
export const ResponseCode = {
  /** 成功 */
  SUCCESS: 200,
  /** 请求参数错误 */
  BAD_REQUEST: 400,
  /** 未授权 */
  UNAUTHORIZED: 401,
  /** 禁止访问 */
  FORBIDDEN: 403,
  /** 资源不存在 */
  NOT_FOUND: 404,
  /** 服务器错误 */
  INTERNAL_ERROR: 500
}

/**
 * HTTP 状态码枚举
 */
export const HttpStatusCode = {
  /** 成功 */
  OK: 200,
  /** 已创建 */
  CREATED: 201,
  /** 无内容 */
  NO_CONTENT: 204,
  /** 请求参数错误 */
  BAD_REQUEST: 400,
  /** 未授权 */
  UNAUTHORIZED: 401,
  /** 禁止访问 */
  FORBIDDEN: 403,
  /** 资源不存在 */
  NOT_FOUND: 404,
  /** 服务器错误 */
  INTERNAL_ERROR: 500
}

/**
 * 默认导出 - 成功响应码
 */
export default ResponseCode
