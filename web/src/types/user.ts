/**
 * 用户相关类型定义
 * 与后端数据结构保持一致
 */

/**
 * 用户信息（对应后端 User 实体）
 */
export interface User {
  /** 用户ID */
  userId: number
  /** 手机号 */
  phone: string
  /** 昵称 */
  nickname: string
  /** 头像 */
  avatar: string | null
  /** Token */
  token?: string
  /** 邮箱 */
  email?: string
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 登录请求
 */
export interface LoginRequest {
  /** 手机号 */
  phone: string
  /** 密码 */
  password: string
}

/**
 * 登录响应
 */
export interface LoginResponse {
  /** 用户ID */
  userId: number
  /** 手机号 */
  phone: string
  /** 昵称 */
  nickname: string
  /** 头像 */
  avatar: string | null
  /** Token */
  token: string
}

/**
 * 注册请求
 */
export interface RegisterRequest {
  /** 手机号 */
  phone: string
  /** 密码 */
  password: string
  /** 昵称 */
  nickname: string
  /** 邮箱 */
  email?: string
}

/**
 * 注册响应
 */
export interface RegisterResponse {
  /** 用户ID */
  userId: number
  /** 手机号 */
  phone: string
  /** 昵称 */
  nickname: string
  /** 头像 */
  avatar: string | null
  /** Token */
  token: string
}

/**
 * 用户信息更新请求
 */
export interface UpdateUserRequest {
  /** 昵称 */
  nickname?: string
  /** 头像 */
  avatar?: string
  /** 邮箱 */
  email?: string
}

/**
 * API 响应
 */
export interface ApiResponse<T = any> {
  /** 业务状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
}

/**
 * 登录响应数据
 */
export type LoginApiResponse = ApiResponse<LoginResponse>

/**
 * 注册响应数据
 */
export type RegisterApiResponse = ApiResponse<RegisterResponse>

/**
 * 用户信息响应数据
 */
export type UserInfoApiResponse = ApiResponse<User>
