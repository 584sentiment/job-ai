import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  // 注册并自动登录
  function register(userData) {
    user.value = {
      id: Date.now(),
      nickname: userData.nickname,
      phone: userData.phone,
      email: userData.email || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.phone}`,
      createTime: new Date().toISOString()
    }
    isLoggedIn.value = true
    token.value = 'mock-token-' + Date.now()

    // 持久化到 localStorage
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('token', token.value)
  }

  // 登录
  function login(credentials) {
    // 模拟登录逻辑（后续可接入真实API）
    user.value = {
      id: Date.now(),
      nickname: credentials.nickname || '用户',
      phone: credentials.phone,
      email: credentials.email || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.phone}`,
      createTime: new Date().toISOString()
    }
    isLoggedIn.value = true
    token.value = 'mock-token-' + Date.now()

    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('token', token.value)
  }

  // 登出
  function logout() {
    user.value = null
    isLoggedIn.value = false
    token.value = null

    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // 更新用户信息
  function updateUser(updates) {
    if (user.value) {
      user.value = {
        ...user.value,
        ...updates,
        updateTime: new Date().toISOString()
      }
      localStorage.setItem('user', JSON.stringify(user.value))
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
    updateUser
  }
})
