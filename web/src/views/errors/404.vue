<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="max-w-md w-full text-center">
      <!-- 404 图标 -->
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <div class="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <div class="absolute -top-2 -right-2 w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            ?
          </div>
        </div>
      </div>

      <!-- 错误代码 -->
      <h1 class="text-8xl font-bold text-gray-400 mb-4">404</h1>

      <!-- 错误标题 -->
      <h2 class="text-2xl font-bold text-gray-800 mb-4">页面未找到</h2>

      <!-- 错误描述 -->
      <p class="text-gray-600 mb-8">
        抱歉，您访问的页面不存在。可能是链接错误或页面已被删除。
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

      <!-- 快速链接 -->
      <div class="mt-12">
        <p class="text-sm text-gray-500 mb-4">您可能在寻找</p>
        <div class="flex flex-wrap gap-3 justify-center">
          <router-link to="/" class="px-4 py-2 bg-white rounded-lg border border-border hover:border-primary hover:text-primary transition-colors duration-200 text-sm">
            岗位列表
          </router-link>
          <router-link to="/add-job" class="px-4 py-2 bg-white rounded-lg border border-border hover:border-primary hover:text-primary transition-colors duration-200 text-sm">
            添加岗位
          </router-link>
          <router-link to="/interviews" class="px-4 py-2 bg-white rounded-lg border border-border hover:border-primary hover:text-primary transition-colors duration-200 text-sm">
            面试安排
          </router-link>
        </div>
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
