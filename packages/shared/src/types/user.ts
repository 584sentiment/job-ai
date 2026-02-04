/**
 * 用户相关类型定义
 */

import type { ApiResponse } from './common'

/**
 * 用户信息
 */
export interface User {
  /** 用户ID */
  id: string
  /** 手机号 */
  phone: string
  /** 昵称 */
  nickname: string
  /** 头像 */
  avatar?: string
  /** 个人简介 */
  bio?: string
  /** 邮箱 */
  email?: string
  /** 创建时间 */
  createTime: number
  /** 更新时间 */
  updateTime: number
}

/**
 * 用户注册请求
 */
export interface UserRegisterRequest {
  /** 手机号 */
  phone: string
  /** 密码 */
  password: string
  /** 昵称 */
  nickname: string
  /** 验证码 */
  code?: string
}

/**
 * 用户登录请求
 */
export interface UserLoginRequest {
  /** 手机号 */
  phone: string
  /** 密码 */
  password: string
}

/**
 * 用户更新请求
 */
export interface UserUpdateRequest {
  /** 昵称 */
  nickname?: string
  /** 头像 */
  avatar?: string
  /** 个人简介 */
  bio?: string
  /** 邮箱 */
  email?: string
}

/**
 * 用户注册响应
 */
export type UserRegisterResponse = ApiResponse<{
  /** 用户ID */
  userId: string
  /** Token */
  token: string
}>

/**
 * 用户登录响应
 */
export type UserLoginResponse = ApiResponse<{
  /** 用户信息 */
  user: User
  /** Token */
  token: string
}>

/**
 * 用户信息响应
 */
export type UserInfoResponse = ApiResponse<User>
