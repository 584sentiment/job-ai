<template>
  <nav class="fixed top-0 left-0 right-0 z-50 glass-card shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <span class="text-xl font-semibold font-heading">求职追踪助手</span>
        </div>

        <!-- 导航链接 -->
        <div class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="nav-link" :class="{ 'text-primary font-medium': $route.name === 'JobList' }">
            岗位列表
          </router-link>
          <router-link to="/interviews" class="nav-link" :class="{ 'text-primary font-medium': $route.name === 'Interviews' }">
            面经管理
          </router-link>
          <router-link to="/summaries" class="nav-link" :class="{ 'text-primary font-medium': $route.name === 'Summaries' }">
            面试总结
          </router-link>
        </div>

        <!-- 右侧操作 -->
        <div class="flex items-center space-x-4">
          <button class="relative p-2 hover:text-primary transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span class="absolute top-1 right-1 w-2 h-2 bg-cta rounded-full"></span>
          </button>

          <!-- 未登录：显示注册和登录按钮 -->
          <template v-if="!authStore.isLoggedIn">
            <router-link
              to="/register"
              class="px-4 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors duration-200 font-medium"
            >
              注册
            </router-link>
            <router-link
              to="/login"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200 font-medium"
            >
              登录
            </router-link>
          </template>

          <!-- 已登录：显示用户头像 -->
          <router-link
            v-else
            to="/profile"
            class="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <img
              :src="authStore.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=jobseeker'"
              alt="用户头像"
              class="w-8 h-8 rounded-full"
            >
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

// 应用启动时加载认证状态
authStore.loadState()
</script>

<style scoped>
.nav-link {
  @apply transition-colors duration-200;
}
</style>
