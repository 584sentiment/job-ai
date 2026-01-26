/**
 * 响应状态码常量
 */
export enum ResponseCode {
  SUCCESS = 200,           // 成功
  CREATED = 201,           // 创建成功
  BAD_REQUEST = 400,       // 请求参数错误
  UNAUTHORIZED = 401,      // 未授权
  FORBIDDEN = 403,         // 禁止访问
  NOT_FOUND = 404,         // 资源不存在
  CONFLICT = 409,          // 资源冲突（如手机号已注册）
  INTERNAL_ERROR = 500,    // 服务器内部错误
  NOT_IMPLEMENTED = 501,   // 功能未实现
}

/**
 * 响应状态码描述
 */
export const ResponseMessage: Record<ResponseCode, string> = {
  [ResponseCode.SUCCESS]: '操作成功',
  [ResponseCode.CREATED]: '创建成功',
  [ResponseCode.BAD_REQUEST]: '请求参数错误',
  [ResponseCode.UNAUTHORIZED]: '未授权，请重新登录',
  [ResponseCode.FORBIDDEN]: '禁止访问',
  [ResponseCode.NOT_FOUND]: '资源不存在',
  [ResponseCode.CONFLICT]: '资源冲突',
  [ResponseCode.INTERNAL_ERROR]: '服务器内部错误',
  [ResponseCode.NOT_IMPLEMENTED]: '功能暂未实现',
}

export default {
  ResponseCode,
  ResponseMessage,
}
