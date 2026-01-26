/**
 * 响应状态码常量
 * 与前端 web/src/types/enums.ts 保持一致
 */
export enum ResponseCode {
  SUCCESS = 200,           // 成功
  BAD_REQUEST = 400,       // 请求参数错误
  UNAUTHORIZED = 401,      // 未授权
  FORBIDDEN = 403,         // 禁止访问
  NOT_FOUND = 404,         // 资源不存在
  INTERNAL_ERROR = 500,    // 服务器内部错误
}

/**
 * 响应状态码描述
 */
export const ResponseMessage: Record<ResponseCode, string> = {
  [ResponseCode.SUCCESS]: '操作成功',
  [ResponseCode.BAD_REQUEST]: '请求参数错误',
  [ResponseCode.UNAUTHORIZED]: '未授权，请先登录',
  [ResponseCode.FORBIDDEN]: '禁止访问',
  [ResponseCode.NOT_FOUND]: '资源不存在',
  [ResponseCode.INTERNAL_ERROR]: '服务器内部错误',
}

/**
 * HTTP 状态码枚举
 */
export enum HttpStatusCode {
  OK = 200,                // 成功
  CREATED = 201,            // 已创建
  NO_CONTENT = 204,         // 无内容
  BAD_REQUEST = 400,        // 请求参数错误
  UNAUTHORIZED = 401,       // 未授权
  FORBIDDEN = 403,          // 禁止访问
  NOT_FOUND = 404,          // 资源不存在
  INTERNAL_ERROR = 500,    // 服务器内部错误
}

export default {
  ResponseCode,
  ResponseMessage,
  HttpStatusCode,
}
