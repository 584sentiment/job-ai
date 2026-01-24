<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="max-w-md w-full text-center">
      <!-- 错误图标 -->
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <div class="w-32 h-32 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <div class="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            !
          </div>
        </div>
      </div>

      <!-- 错误代码 -->
      <h1 class="text-8xl font-bold text-red-500 mb-4">500</h1>

      <!-- 错误标题 -->
      <h2 class="text-2xl font-bold text-gray-800 mb-4">服务器内部错误</h2>

      <!-- 错误描述 -->
      <p class="text-gray-600 mb-8">
        抱歉，服务器遇到了一些问题。我们正在努力修复中，请稍后再试。
      </p>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="goBack"
          class="px-6 py-3 border border-border rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
        >
          返回上一页
        </button>
        <router-link
          to="/"
          class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200 font-medium"
        >
          回到首页
        </router-link>
      </div>

      <!-- 帮助信息 -->
      <div class="mt-12 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p class="text-sm text-blue-800">
          <strong>问题依然存在？</strong><br>
          请联系客服或稍后再试。给您带来不便，我们深表歉意。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
