import { post, postWithAuth, getWithAuth, putWithAuth, delWithAuth } from '@/utils/request'
import type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  LoginApiResponse,
  RegisterApiResponse,
  UserInfoApiResponse,
  UserStatsApiResponse,
  ApiResponse
} from '@/types'

/**
 * 用户注册
 * @param data - 注册数据
 * @returns 注册结果
 */
export function register(data: RegisterRequest): Promise<RegisterApiResponse> {
  return post('/users/register', data) as Promise<RegisterApiResponse>
}

/**
 * 用户登录
 * @param data - 登录数据
 * @returns 登录结果
 */
export function login(data: LoginRequest): Promise<LoginApiResponse> {
  return post('/users/login', data) as Promise<LoginApiResponse>
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export function getUserInfo(): Promise<UserInfoApiResponse> {
  return getWithAuth('/users/current') as Promise<UserInfoApiResponse>
}

/**
 * 根据id获取用户信息
 * @param id 用户id
 * @returns 用户信息
 */
export function getUserInfoById(id: string): Promise<UserInfoApiResponse> {
  return getWithAuth(`/users/${id}`) as Promise<UserInfoApiResponse>
}

/**
 * 更新用户信息
 * @param data - 更新数据
 * @returns 更新结果
 */
export function updateUser(data: UpdateUserRequest): Promise<UserInfoApiResponse> {
  return putWithAuth('/users', data) as Promise<UserInfoApiResponse>
}

/**
 * 删除用户
 * @param id - 用户id
 * @returns 更新结果
 */
export function deleteUser(id: string): Promise<UserInfoApiResponse> {
  return delWithAuth(`/users${id}`) as Promise<UserInfoApiResponse>
}

/**
 * 修改密码
 * @param data - 密码数据
 * @returns 修改结果
 */
export function changePassword(data: { oldPassword: string; newPassword: string }): Promise<ApiResponse> {
  return postWithAuth('/users/change-password', data) as Promise<ApiResponse>
}

/**
 * 用户登出
 * @returns 登出结果
 */
export function logout(): Promise<ApiResponse> {
  return postWithAuth('/users/logout', {}) as Promise<ApiResponse>
}

/**
 * 获取用户统计数据
 * @returns 用户统计数据
 */
export function getUserStats(): Promise<UserStatsApiResponse> {
  return getWithAuth('/users/stats') as Promise<UserStatsApiResponse>
}
