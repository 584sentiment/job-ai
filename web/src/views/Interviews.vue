<template>
  <main class="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- 页面标题和操作栏 -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">面试记录</h1>
        <p class="text-gray-600 mt-1">管理所有面试安排和记录</p>
      </div>
      <div class="relative">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索面试记录..."
          class="pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 w-full sm:w-64"
        >
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <!-- Tab切换 -->
    <div class="mb-6 border-b border-border">
      <div class="flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="currentTab = tab.value"
          :class="[
            'py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
            currentTab === tab.value
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="ml-2 text-xs">({{ tab.count }})</span>
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">加载中...</p>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredInterviews.length === 0" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6">
        <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">暂无面试记录</h3>
      <p class="text-gray-500 mb-6">还没有添加任何面试记录</p>
      <router-link
        to="/"
        class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        添加面试记录
      </router-link>
    </div>

    <!-- 面试记录列表 -->
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="interview in filteredInterviews"
        :key="interview.id"
        class="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
        @click="goToInterviewDetail(interview)"
      >
        <!-- 状态标签 -->
        <div class="flex items-center justify-between mb-4">
          <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="{
              'bg-blue-100 text-blue-700': interview.status === 0,
              'bg-green-100 text-green-700': interview.status === 1
            }"
          >
            {{ interview.status === 0 ? '即将到来' : '已完成' }}
          </span>
          <span class="text-xs text-gray-500">{{ formatInterviewTime(interview.interviewTime) }}</span>
        </div>

        <!-- 公司和岗位信息 -->
        <div class="mb-4">
          <div class="flex items-start gap-3">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            >
              {{ interview.companyName?.charAt(0) || '?' }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-lg truncate">{{ interview.companyName }}</h3>
              <p class="text-sm text-gray-600 truncate">{{ interview.positionName }}</p>
            </div>
          </div>
        </div>

        <!-- 面试详情 -->
        <div class="space-y-2 mb-4">
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            <span class="truncate">{{ interview.interviewRound }}</span>
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="truncate">{{ interview.interviewLocation }}</span>
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span class="truncate">{{ interview.interviewForm }}</span>
          </div>
        </div>

        <!-- 倒计时或已完成标识 -->
        <div class="pt-4 border-t border-border">
          <div v-if="interview.status === 0" class="flex items-center justify-between">
            <span class="text-sm text-gray-500">面试倒计时</span>
            <span class="text-sm font-medium text-primary">{{ getCountdown(interview.interviewTime) }}</span>
          </div>
          <div v-else class="flex items-center justify-between">
            <span class="text-sm text-gray-500">面试时间</span>
            <span class="text-sm text-gray-700">{{ formatDateTime(interview.interviewTime) }}</span>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- 底部导航 -->
  <BottomNav />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/store/jobs'
import BottomNav from '@/components/BottomNav.vue'
import type { Interview } from '@/types'

const router = useRouter()
const jobsStore = useJobsStore()

const currentTab = ref<'upcoming' | 'completed'>('upcoming')
const searchKeyword = ref('')
const loading = ref(false)
const allInterviews = ref<Interview[]>([])

// Tab选项
const tabs = computed(() => [
  {
    label: '即将到来',
    value: 'upcoming',
    count: allInterviews.value.filter(i => i.status === 0).length
  },
  {
    label: '已完成',
    value: 'completed',
    count: allInterviews.value.filter(i => i.status === 1).length
  }
])

// 过滤后的面试列表
const filteredInterviews = computed(() => {
  let interviews = allInterviews.value.filter(i => {
    if (currentTab.value === 'upcoming') {
      return i.status === 0
    } else {
      return i.status === 1
    }
  })

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    interviews = interviews.filter(i =>
      i.companyName?.toLowerCase().includes(keyword) ||
      i.positionName?.toLowerCase().includes(keyword) ||
      i.interviewRound?.toLowerCase().includes(keyword)
    )
  }

  return interviews
})

// 加载所有面试记录
async function loadInterviews() {
  loading.value = true
  try {
    // 从所有岗位中收集面试记录
    const jobs = jobsStore.jobs
    const interviews: Interview[] = []

    jobs.forEach(job => {
      if (job.interviewRecordList && job.interviewRecordList.length > 0) {
        job.interviewRecordList.forEach(record => {
          interviews.push({
            ...record,
            companyName: job.companyName,
            positionName: job.positionName
          })
        })
      }
    })

    allInterviews.value = interviews.sort((a, b) => {
      return new Date(b.interviewTime).getTime() - new Date(a.interviewTime).getTime()
    })
  } catch (error) {
    console.error('加载面试记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 格式化面试时间显示
function formatInterviewTime(timestamp: number | string): string {
  const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return '已过期'
  } else if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '明天'
  } else if (diffDays <= 7) {
    return `${diffDays}天后`
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
  }
}

// 格式化日期时间
function formatDateTime(timestamp: number | string): string {
  const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取倒计时文本
function getCountdown(timestamp: number | string): string {
  const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (diffDays > 0) {
    return `${diffDays}天${diffHours}小时`
  } else {
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHours}小时${diffMinutes}分钟`
  }
}

// 跳转到面试详情（岗位详情页）
function goToInterviewDetail(interview: Interview) {
  if (interview.positionId) {
    router.push(`/job/${interview.positionId}`)
  }
}

onMounted(() => {
  loadInterviews()
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-card:hover {
  transform: translateY(-2px);
}
</style>
