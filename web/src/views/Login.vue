<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
    <div class="max-w-md w-full">
      <!-- Logo 和标题 -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <svg class="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold font-heading text-primary">欢迎回来</h1>
        <p class="text-gray-600 mt-2">登录求职追踪助手</p>
      </div>

      <!-- 登录表单卡片 -->
      <div class="glass-card rounded-xl p-8">
        <form @submit.prevent="handleLogin">
          <!-- 手机号码 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              手机号码 <span class="text-red-500">*</span>
            </label>
            <input
              type="tel"
              v-model="form.phone"
              @blur="validatePhone"
              required
              placeholder="请输入手机号码"
              class="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              :class="{ 'border-red-500': phoneError }"
            />
            <p v-if="phoneError" class="text-red-500 text-sm mt-1">{{ phoneError }}</p>
          </div>

          <!-- 密码 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              密码 <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                required
                placeholder="请输入密码"
                class="w-full px-4 py-3 rounded-lg border pr-10 border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                :class="{ 'border-red-500': passwordError }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <!-- Eye icon -->
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
          </div>

          <!-- 记住我和忘记密码 -->
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="form.rememberMe"
                class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span class="ml-2 text-sm text-gray-600">记住我</span>
            </label>
            <a href="#" class="text-sm text-primary hover:text-secondary transition-colors duration-200">
              忘记密码？
            </a>
          </div>

          <!-- 提交错误提示 -->
          <div v-if="submitError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ submitError }}</p>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 还没有账号 -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            还没有账号？
            <router-link to="/register" class="text-primary hover:text-secondary font-medium transition-colors duration-200">立即注册</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 表单数据
const form = ref({
  phone: '',
  password: '',
  rememberMe: false
})

// UI 状态
const loading = ref(false)
const showPassword = ref(false)

// 错误状态
const phoneError = ref('')
const passwordError = ref('')
const submitError = ref('')

// 验证手机号
const validatePhone = () => {
  const phoneRegex = /^1[3-9]\d{9}$/
  if (form.value.phone && !phoneRegex.test(form.value.phone)) {
    phoneError.value = '请输入正确的手机号码'
    return false
  }
  phoneError.value = ''
  return true
}

// 表单提交
const handleLogin = async () => {
  // 清除之前的提交错误
  submitError.value = ''

  // 验证
  const isPhoneValid = validatePhone()
  if (!isPhoneValid) {
    return
  }

  if (!form.value.password) {
    passwordError.value = '请输入密码'
    return
  }
  passwordError.value = ''

  loading.value = true

  try {
    // 调用 store 登录方法（会调用真实 API）
    await authStore.login({
      phone: form.value.phone,
      password: form.value.password
    })

    // 登录成功，跳转到原始目标页面或首页
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    console.error('登录失败:', error)

    // 显示友好的错误消息
    if (error.message) {
      submitError.value = error.message
    } else {
      submitError.value = '登录失败，请检查手机号和密码'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 无额外样式，使用 Tailwind CSS */
</style>
