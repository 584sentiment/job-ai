import { post, postWithAuth, getWithAuth, putWithAuth } from '@/utils/request'

/**
 * 用户注册
 * @param {object} data - 注册数据
 * @param {string} data.phone - 手机号
 * @param {string} data.password - 密码
 * @param {string} data.nickname - 昵称
 * @param {string} data.email - 邮箱（可选）
 * @returns {Promise} 返回注册结果
 */
export function register(data) {
  return post('/users/register', data)
}

/**
 * 用户登录
 * @param {object} data - 登录数据
 * @param {string} data.phone - 手机号
 * @param {string} data.password - 密码
 * @returns {Promise} 返回登录结果
 */
export function login(data) {
  return post('/users/login', data)
}

/**
 * 获取当前用户信息
 * @returns {Promise} 返回用户信息
 */
export function getUserInfo() {
  return getWithAuth('/users/profile')
}

/**
 * 更新用户信息
 * @param {object} data - 更新数据
 * @returns {Promise} 返回更新结果
 */
export function updateUser(data) {
  return putWithAuth('/users/profile', data)
}

/**
 * 修改密码
 * @param {object} data - 密码数据
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise} 返回修改结果
 */
export function changePassword(data) {
  return postWithAuth('/users/change-password', data)
}

/**
 * 用户登出
 * @returns {Promise} 返回登出结果
 */
export function logout() {
  return postWithAuth('/users/logout')
}
