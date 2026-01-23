<template>
  <main class="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- 页面标题和操作栏 -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">面经管理</h1>
        <p class="text-gray-600 mt-1">记录和整理面试经验</p>
      </div>
      <div class="flex gap-3">
        <div class="relative">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索面经..."
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
          <span>添加面经</span>
        </button>
      </div>
    </div>

    <!-- 标签筛选 -->
    <div class="mb-6 overflow-x-auto">
      <div class="flex space-x-2 pb-2">
        <button
          v-for="filter in filterOptions"
          :key="filter.value"
          @click="interviewsStore.setFilter(filter.value)"
          :class="[
            'px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200',
            interviewsStore.currentFilter === filter.value
              ? 'bg-primary text-white'
              : 'bg-white text-text border border-border hover:border-primary hover:text-primary'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- 面经列表 -->
    <div class="grid gap-4 md:grid-cols-2">
      <div
        v-for="interview in filteredInterviews"
        :key="interview.id"
        class="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg"
              :class="`from-${interview.color}-500 to-${interview.color}-600`"
            >
              {{ interview.company.charAt(0) }}
            </div>
            <div>
              <h3 class="font-semibold text-lg">{{ interview.company }}</h3>
              <p class="text-sm text-gray-500">{{ interview.position }}</p>
            </div>
          </div>
          <button
            @click.stop="interviewsStore.toggleFavorite(interview.id)"
            :class="interview.isFavorite ? 'text-yellow-500' : 'text-gray-300'"
            class="hover:text-yellow-500 transition-colors duration-200"
          >
            <svg
              class="w-6 h-6"
              :fill="interview.isFavorite ? 'currentColor' : 'none'"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <div class="flex items-center space-x-2 mb-2">
            <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{{ interview.round }}</span>
            <span class="text-xs text-gray-500">{{ interview.date }}</span>
          </div>
          <p class="text-gray-700 text-sm line-clamp-3">{{ interview.content }}</p>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-border">
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>{{ interview.views }}</span>
            </span>
            <span class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              <span>{{ interview.comments }}</span>
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
import { useInterviewsStore } from '@/store/interviews'

const interviewsStore = useInterviewsStore()
const searchKeyword = ref('')

const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '我的收藏', value: 'favorite' },
  { label: '字节跳动', value: '字节跳动' },
  { label: '腾讯', value: '腾讯' },
  { label: '阿里巴巴', value: '阿里巴巴' }
]

const filteredInterviews = computed(() => {
  let interviews = interviewsStore.filteredInterviews

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    interviews = interviews.filter(i =>
      i.company.toLowerCase().includes(keyword) ||
      i.position.toLowerCase().includes(keyword) ||
      i.content.toLowerCase().includes(keyword)
    )
  }

  return interviews
})
</script>
