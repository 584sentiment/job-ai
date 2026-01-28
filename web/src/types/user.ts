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
  /** 职位 */
  jobTitle?: string
  /** 工作经验 */
  experience?: string
  /** 个人简介 */
  bio?: string
}

/**
 * 用户统计数据
 */
export interface UserStats {
  /** 投递岗位总数 */
  totalPositions: number
  /** 待投递岗位数 */
  pendingPositions: number
  /** 已投递岗位数 */
  deliveredPositions: number
  /** 流程中岗位数 */
  inProcessPositions: number
  /** 已录用岗位数 */
  offeredPositions: number
  /** 已入职岗位数 */
  joinedPositions: number
  /** 未通过岗位数 */
  rejectedPositions: number
  /** 面试记录总数 */
  totalInterviews: number
  /** 面经总数 */
  totalExperiences: number
  /** 面试总结总数 */
  totalSummaries: number
  /** 待跟进岗位数(待投递+已投递) */
  pendingFollowUp: number
}

/**
 * 用户统计数据响应
 */
export type UserStatsApiResponse = ApiResponse<UserStats>

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
