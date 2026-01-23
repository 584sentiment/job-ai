<template>
  <main class="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- 页面标题和操作栏 -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">面试总结</h1>
        <p class="text-gray-600 mt-1">记录每次面试的收获与反思</p>
      </div>
      <div class="flex gap-3">
        <div class="relative">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索总结..."
            class="pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 w-64"
          >
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <button class="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>添加总结</span>
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="glass-card rounded-xl p-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold">{{ summaryStats.total }}</p>
            <p class="text-sm text-gray-600">总总结数</p>
          </div>
        </div>
      </div>

      <div class="glass-card rounded-xl p-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold">{{ summaryStats.completed }}</p>
            <p class="text-sm text-gray-600">已完成改进</p>
          </div>
        </div>
      </div>

      <div class="glass-card rounded-xl p-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold">{{ summaryStats.pending }}</p>
            <p class="text-sm text-gray-600">待改进项</p>
          </div>
        </div>
      </div>

      <div class="glass-card rounded-xl p-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold">{{ summaryStats.progress }}%</p>
            <p class="text-sm text-gray-600">进步率</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签筛选 -->
    <div class="mb-6 overflow-x-auto">
      <div class="flex space-x-2 pb-2">
        <button
          v-for="filter in filterOptions"
          :key="filter.value"
          @click="summariesStore.setFilter(filter.value)"
          :class="[
            'px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200',
            summariesStore.currentFilter === filter.value
              ? 'bg-primary text-white'
              : 'bg-white text-text border border-border hover:border-primary hover:text-primary'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- 总结列表 -->
    <div class="space-y-4">
      <div
        v-for="summary in filteredSummaries"
        :key="summary.id"
        class="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg"
              :class="`from-${summary.color}-500 to-${summary.color}-600`"
            >
              {{ summary.company.charAt(0) }}
            </div>
            <div>
              <h3 class="font-semibold text-lg">{{ summary.company }} - {{ summary.round }}总结</h3>
              <p class="text-sm text-gray-500">{{ summary.position }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span
              class="px-2 py-1 text-xs rounded"
              :class="summary.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'"
            >
              {{ summary.status === 'pending' ? '待改进' : '已改进' }}
            </span>
            <span class="text-xs text-gray-500">{{ summary.date }}</span>
          </div>
        </div>

        <div class="space-y-3 mb-4">
          <div class="flex items-start space-x-2">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p class="font-medium text-red-700">不足之处</p>
              <p class="text-sm text-gray-600">{{ summary.weakness }}</p>
            </div>
          </div>

          <div class="flex items-start space-x-2">
            <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p class="font-medium text-green-700">改进方向</p>
              <p class="text-sm text-gray-600">{{ summary.improvements }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-border">
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              <span>{{ summary.comments }} 条备注</span>
            </span>
          </div>
          <button class="text-primary hover:text-secondary font-medium text-sm flex items-center space-x-1">
            <span>查看详情</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSummariesStore } from '@/store/summaries'

const summariesStore = useSummariesStore()
const searchKeyword = ref('')

const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '待改进', value: 'pending' },
  { label: '字节跳动', value: '字节跳动' },
  { label: '腾讯', value: '腾讯' }
]

const filteredSummaries = computed(() => {
  let summaries = summariesStore.filteredSummaries

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    summaries = summaries.filter(s =>
      s.company.toLowerCase().includes(keyword) ||
      s.position.toLowerCase().includes(keyword)
    )
  }

  return summaries
})

const summaryStats = computed(() => summariesStore.summaryStats)
</script>
