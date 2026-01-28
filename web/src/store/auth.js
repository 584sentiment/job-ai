import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as userApi from '@/api/user'
import { hashPassword } from '@/utils/crypto'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null)
  const isLoggedIn = ref(false)
  const token = ref(null)

  // 从 localStorage 恢复状态
  function loadState() {
    try {
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('token')

      if (savedUser && savedToken) {
        user.value = JSON.parse(savedUser)
        isLoggedIn.value = true
        token.value = savedToken
      }
    } catch (error) {
      console.error('Failed to load auth state:', error)
      // 清除损坏的数据
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }

  /**
   * 保存登录状态
   * @param {object} userData - 用户数据
   * @param {string} tokenValue - token
   */
  function saveAuthState(userData, tokenValue) {
    user.value = userData
    isLoggedIn.value = true
    token.value = tokenValue

    // 持久化到 localStorage
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', tokenValue)
  }

  /**
   * 注册
   * @param {object} userData - 注册数据
   * @param {string} userData.phone - 手机号
   * @param {string} userData.password - 密码
   * @param {string} userData.nickname - 昵称
   * @param {string} userData.email - 邮箱（可选）
   * @returns {Promise<{hasToken: boolean}>} 返回注册结果和是否有 token
   */
  async function register(userData) {
    try {
      // 对密码进行加密
      const hashedPassword = await hashPassword(userData.password)

      // 调用后端注册 API
      const response = await userApi.register({
        phone: userData.phone,
        password: hashedPassword,
        nickname: userData.nickname,
        email: userData.email || undefined
      })

      // 后端返回的数据结构是 { user: {...}, token: "..." }
      // 需要提取出 user 对象和 token
      const registerData = response.data
      const userObj = registerData.user || registerData
      const tokenValue = registerData.token || userObj.token

      // 检查响应中是否包含 token
      const hasToken = !!tokenValue

      // 如果返回了 token，直接保存登录状态
      if (hasToken) {
        saveAuthState(userObj, tokenValue)
      }

      return {
        ...response,
        hasToken // 返回是否有 token，供页面判断跳转逻辑
      }
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    }
  }

  /**
   * 登录
   * @param {object} credentials - 登录凭证
   * @param {string} credentials.phone - 手机号
   * @param {string} credentials.password - 密码
   * @returns {Promise} 返回登录结果
   */
  async function login(credentials) {
    try {
      // 对密码进行加密
      const hashedPassword = await hashPassword(credentials.password)

      // 调用后端登录 API
      const response = await userApi.login({
        phone: credentials.phone,
        password: hashedPassword
      })

      // 后端返回的数据结构是 { user: {...}, token: "..." }
      // 需要提取出 user 对象和 token
      const userData = response.data.user || response.data
      const tokenValue = response.data.token || userData.token || `token-${userData.id || userData.userId}`

      // 保存登录状态
      saveAuthState(userData, tokenValue)

      return response
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  /**
   * 登出
   */
  async function logout() {
    try {
      // 调用后端登出 API
      if (isLoggedIn.value) {
        await userApi.logout()
      }
    } catch (error) {
      console.error('登出 API 调用失败:', error)
    } finally {
      // 无论 API 调用成功与否，都清除本地状态
      user.value = null
      isLoggedIn.value = false
      token.value = null

      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }

  /**
   * 更新用户信息
   * @param {object} updates - 更新数据
   * @returns {Promise} 返回更新结果
   */
  async function updateUser(updates) {
    try {
      if (user.value) {
        // 调用后端更新 API
        const response = await userApi.updateUser(updates)

        // 更新本地用户信息
        user.value = response.data

        // 持久化到 localStorage
        localStorage.setItem('user', JSON.stringify(user.value))

        return response
      }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      throw error
    }
  }

  /**
   * 获取最新用户信息
   * @returns {Promise} 返回用户信息
   */
  async function fetchUserInfo() {
    try {
      const response = await userApi.getUserInfo()
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(user.value))
      return response
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  return {
    user,
    isLoggedIn,
    token,
    loadState,
    register,
    login,
    logout,
    updateUser,
    fetchUserInfo
  }
})
