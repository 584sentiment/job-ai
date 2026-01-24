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
        <h1 class="text-3xl font-bold font-heading text-primary">创建账号</h1>
        <p class="text-gray-600 mt-2">开始使用求职追踪助手</p>
      </div>

      <!-- 注册表单卡片 -->
      <div class="glass-card rounded-xl p-8">
        <form @submit.prevent="handleRegister">
          <!-- 昵称（必填） -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              昵称 <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="form.nickname"
              required
              placeholder="请输入昵称"
              class="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
            />
          </div>

          <!-- 手机号码（必填） -->
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

          <!-- 密码（必填） -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              密码 <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                @input="checkPasswordStrength"
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
            <!-- 密码强度指示器 -->
            <div v-if="form.password" class="mt-2">
              <div class="flex space-x-1">
                <div
                  class="h-1 rounded transition-all duration-200"
                  :class="passwordStrengthBar1"
                  style="flex: 1"
                ></div>
                <div
                  class="h-1 rounded transition-all duration-200"
                  :class="passwordStrengthBar2"
                  style="flex: 1"
                ></div>
                <div
                  class="h-1 rounded transition-all duration-200"
                  :class="passwordStrengthBar3"
                  style="flex: 1"
                ></div>
              </div>
              <p class="text-sm mt-1" :class="passwordStrengthTextClass">{{ passwordStrengthText }}</p>
            </div>
            <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
            <p v-else class="text-gray-500 text-sm mt-1">密码必须包含大小写字母、数字和特殊字符（@ $ ! % * ? &）</p>
          </div>

          <!-- 确认密码（必填） -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              确认密码 <span class="text-red-500">*</span>
            </label>
            <input
              type="password"
              v-model="form.confirmPassword"
              @blur="validateConfirmPassword"
              required
              placeholder="请再次输入密码"
              class="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              :class="{ 'border-red-500': confirmPasswordError }"
            />
            <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">{{ confirmPasswordError }}</p>
          </div>

          <!-- 邮箱（选填） -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              邮箱 <span class="text-gray-400 text-xs">(可选)</span>
            </label>
            <input
              type="email"
              v-model="form.email"
              @blur="validateEmail"
              placeholder="请输入邮箱"
              class="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              :class="{ 'border-red-500': emailError }"
            />
            <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
          </div>

          <!-- 用户协议 -->
          <div class="mb-6">
            <label class="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="form.agreeTerms"
                required
                class="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span class="text-sm text-gray-600">
                我已阅读并同意 <a href="#" class="text-primary hover:text-secondary transition-colors duration-200">用户协议</a> 和 <a href="#" class="text-primary hover:text-secondary transition-colors duration-200">隐私政策</a>
              </span>
            </label>
          </div>

          <!-- 提交错误提示 -->
          <div v-if="submitError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ submitError }}</p>
          </div>

          <!-- 注册按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>

        <!-- 已有账号 -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            已有账号？
            <router-link to="/login" class="text-primary hover:text-secondary font-medium transition-colors duration-200">立即登录</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const form = ref({
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  email: '',
  agreeTerms: false
})

// UI 状态
const loading = ref(false)
const showPassword = ref(false)

// 错误状态
const phoneError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const submitError = ref('')

// 密码强度
const passwordStrength = ref(0)

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

// 验证邮箱
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (form.value.email && !emailRegex.test(form.value.email)) {
    emailError.value = '请输入正确的邮箱地址'
    return false
  }
  emailError.value = ''
  return true
}

// 检查密码强度
const checkPasswordStrength = () => {
  const password = form.value.password
  if (!password) {
    passwordStrength.value = 0
    passwordError.value = ''
    return
  }

  let strength = 0

  // 长度检查
  if (password.length >= 6) strength++

  // 小写字母
  if (/[a-z]/.test(password)) strength++

  // 大写字母
  if (/[A-Z]/.test(password)) strength++

  // 数字
  if (/\d/.test(password)) strength++

  // 特殊字符
  if (/[@$!%*?&]/.test(password)) strength++

  passwordStrength.value = strength

  // 验证是否满足所有要求
  if (password.length < 6) {
    passwordError.value = '密码长度至少6位'
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
    passwordError.value = '密码必须包含大小写字母、数字和特殊字符'
  } else {
    passwordError.value = ''
  }
}

// 密码强度计算属性
const passwordStrengthBar1 = computed(() => {
  if (passwordStrength.value >= 1) return 'bg-red-500'
  return 'bg-gray-200'
})

const passwordStrengthBar2 = computed(() => {
  if (passwordStrength.value >= 3) return 'bg-yellow-500'
  if (passwordStrength.value >= 2) return 'bg-red-500'
  return 'bg-gray-200'
})

const passwordStrengthBar3 = computed(() => {
  if (passwordStrength.value >= 5) return 'bg-green-500'
  if (passwordStrength.value >= 3) return 'bg-yellow-500'
  return 'bg-gray-200'
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value >= 5) return '强'
  if (passwordStrength.value >= 3) return '中'
  if (passwordStrength.value >= 1) return '弱'
  return ''
})

const passwordStrengthTextClass = computed(() => {
  if (passwordStrength.value >= 5) return 'text-green-500'
  if (passwordStrength.value >= 3) return 'text-yellow-500'
  if (passwordStrength.value >= 1) return 'text-red-500'
  return 'text-gray-400'
})

// 验证确认密码
const validateConfirmPassword = () => {
  if (form.value.confirmPassword && form.value.confirmPassword !== form.value.password) {
    confirmPasswordError.value = '两次输入的密码不一致'
    return false
  }
  confirmPasswordError.value = ''
  return true
}

// 表单提交
const handleRegister = async () => {
  // 清除之前的提交错误
  submitError.value = ''

  // 最终验证
  const isPhoneValid = validatePhone()
  const isEmailValid = validateEmail()
  const isConfirmPasswordValid = validateConfirmPassword()

  if (!isPhoneValid || !isEmailValid || !isConfirmPasswordValid || passwordError.value) {
    return
  }

  loading.value = true

  try {
    // 调用 store 注册方法（会调用真实 API）
    await authStore.register({
      nickname: form.value.nickname,
      phone: form.value.phone,
      password: form.value.password,
      email: form.value.email
    })

    // 注册成功，跳转到首页
    router.push('/')
  } catch (error) {
    console.error('注册失败:', error)

    // 显示友好的错误消息
    if (error.message) {
      submitError.value = error.message
    } else {
      submitError.value = '注册失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 无额外样式，使用 Tailwind CSS */
</style>
