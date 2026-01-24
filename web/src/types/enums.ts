/**
 * 枚举类型定义
 * 与后端保持一致，减少字段转换
 */

/**
 * 岗位状态枚举（对应后端 PositionStatusEnum）
 */
export enum PositionStatus {
  /** 待投递 */
  TO_BE_DELIVERED = '0',
  /** 已投递 */
  DELIVERED = '1',
  /** 流程中（包括笔试、面试、等待Offer等流程） */
  IN_PROCESS = '2',
  /** 已Offer */
  OFFER = '3',
  /** 已入职 */
  JOINED = '4',
  /** 已拒绝 */
  REJECTED ='5',
  /** 未通过 */
  NOT_PASS = '-1',
}

/**
 * 岗位状态标签映射
 */
export const PositionStatusLabels: Record<PositionStatus, string> = {
  [PositionStatus.TO_BE_DELIVERED]: '待投递',
  [PositionStatus.DELIVERED]: '已投递',
  [PositionStatus.IN_PROCESS]: '流程中',
  [PositionStatus.OFFER]: '已Offer',
  [PositionStatus.JOINED]: '已入职',
  [PositionStatus.NOT_PASS]: '未通过',
  [PositionStatus.REJECTED]: '已拒绝'
}

/**
 * 岗位状态样式类映射
 */
export const PositionStatusClasses: Record<PositionStatus, string> = {
  [PositionStatus.TO_BE_DELIVERED]: 'bg-yellow-100 text-yellow-700',
  [PositionStatus.DELIVERED]: 'bg-blue-100 text-blue-700',
  [PositionStatus.IN_PROCESS]: 'bg-purple-100 text-purple-700',
  [PositionStatus.OFFER]: 'bg-green-100 text-green-700',
  [PositionStatus.JOINED]: 'bg-teal-100 text-teal-700',
  [PositionStatus.NOT_PASS]: 'bg-red-100 text-red-700',
  [PositionStatus.REJECTED]: 'bg-red-100 text-red-700'
}

/**
 * 业务响应码枚举（对应后端响应码）
 */
export enum ResponseCode {
  /** 成功 */
  SUCCESS = 200,
  /** 请求参数错误 */
  BAD_REQUEST = 400,
  /** 未授权 */
  UNAUTHORIZED = 401,
  /** 禁止访问 */
  FORBIDDEN = 403,
  /** 资源不存在 */
  NOT_FOUND = 404,
  /** 服务器错误 */
  INTERNAL_ERROR = 500
}

/**
 * 响应码消息映射
 */
export const ResponseCodeMessages: Record<ResponseCode, string> = {
  [ResponseCode.SUCCESS]: '操作成功',
  [ResponseCode.BAD_REQUEST]: '请求参数错误',
  [ResponseCode.UNAUTHORIZED]: '未授权，请先登录',
  [ResponseCode.FORBIDDEN]: '禁止访问',
  [ResponseCode.NOT_FOUND]: '资源不存在',
  [ResponseCode.INTERNAL_ERROR]: '服务器内部错误'
}

/**
 * HTTP 状态码枚举
 */
export enum HttpStatusCode {
  /** 成功 */
  OK = 200,
  /** 已创建 */
  CREATED = 201,
  /** 无内容 */
  NO_CONTENT = 204,
  /** 请求参数错误 */
  BAD_REQUEST = 400,
  /** 未授权 */
  UNAUTHORIZED = 401,
  /** 禁止访问 */
  FORBIDDEN = 403,
  /** 资源不存在 */
  NOT_FOUND = 404,
  /** 服务器错误 */
  INTERNAL_ERROR = 500
}

/**
 * HTTP 状态码消息映射
 */
export const HttpStatusCodeMessages: Record<HttpStatusCode, string> = {
  [HttpStatusCode.OK]: '请求成功',
  [HttpStatusCode.CREATED]: '创建成功',
  [HttpStatusCode.NO_CONTENT]: '无内容',
  [HttpStatusCode.BAD_REQUEST]: '请求参数错误',
  [HttpStatusCode.UNAUTHORIZED]: '未授权',
  [HttpStatusCode.FORBIDDEN]: '禁止访问',
  [HttpStatusCode.NOT_FOUND]: '资源不存在',
  [HttpStatusCode.INTERNAL_ERROR]: '服务器内部错误'
}
