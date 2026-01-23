<template>
  <main class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <!-- 用户信息卡片 -->
    <div class="glass-card rounded-xl p-6 mb-6">
      <div class="flex items-center space-x-4">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=jobseeker" alt="用户头像" class="w-20 h-20 rounded-full">
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <h2 class="text-2xl font-bold">求职者</h2>
            <button class="p-1 hover:bg-gray-100 rounded transition-colors duration-200">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
          </div>
          <p class="text-gray-600">前端开发工程师 · 3年经验</p>
          <p class="text-sm text-gray-500 mt-1">已绑定手机: 138****8888</p>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="glass-card rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-primary">{{ jobStats.total }}</p>
        <p class="text-sm text-gray-600 mt-1">投递岗位</p>
      </div>
      <div class="glass-card rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-blue-600">{{ jobStats.interviewing }}</p>
        <p class="text-sm text-gray-600 mt-1">面试中</p>
      </div>
      <div class="glass-card rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-green-600">{{ jobStats.offered }}</p>
        <p class="text-sm text-gray-600 mt-1">已录用</p>
      </div>
      <div class="glass-card rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-purple-600">{{ summariesStore.summaries.length }}</p>
        <p class="text-sm text-gray-600 mt-1">面经/总结</p>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="glass-card rounded-xl p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">我的岗位</h3>
      <div class="grid grid-cols-2 gap-3">
        <router-link
          to="/"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span class="font-medium">全部岗位</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </router-link>

        <router-link
          to="/"
          class="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-medium">面试中</span>
          </div>
          <span class="text-sm text-blue-600 font-medium">{{ jobStats.interviewing }}</span>
        </router-link>

        <router-link
          to="/"
          class="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-medium">已录用</span>
          </div>
          <span class="text-sm text-green-600 font-medium">{{ jobStats.offered }}</span>
        </router-link>

        <router-link
          to="/"
          class="flex items-center justify-between p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
            </svg>
            <span class="font-medium">待跟进</span>
          </div>
          <span class="text-sm text-yellow-600 font-medium">3</span>
        </router-link>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="glass-card rounded-xl overflow-hidden">
      <div class="divide-y divide-border">
        <router-link
          to="/interviews"
          class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span class="font-medium">我的面经</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">{{ interviewsStore.interviews.length }}篇</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </router-link>

        <router-link
          to="/summaries"
          class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <span class="font-medium">面试总结</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">{{ summariesStore.summaries.length }}篇</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </router-link>

        <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span class="font-medium">消息提醒</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 bg-cta rounded-full"></span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </button>

        <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="font-medium">设置</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <button class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-medium">帮助与反馈</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <button class="w-full mt-6 px-6 py-3 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium">
      退出登录
    </button>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useJobsStore } from '@/store/jobs'
import { useInterviewsStore } from '@/store/interviews'
import { useSummariesStore } from '@/store/summaries'

const jobsStore = useJobsStore()
const interviewsStore = useInterviewsStore()
const summariesStore = useSummariesStore()

const jobStats = computed(() => jobsStore.jobStats)
</script>
