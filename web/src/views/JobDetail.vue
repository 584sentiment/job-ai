<template>
  <main v-if="job" class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
    <!-- 顶部导航栏 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link to="/" class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </router-link>
        <h1 class="text-xl font-semibold">岗位详情</h1>
      </div>
      <div class="flex items-center space-x-2">
        <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
        </button>
        <button
          @click="deleteJob"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-red-500"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 岗位基本信息卡片 -->
    <div class="glass-card rounded-xl p-6">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center space-x-4">
          <div
            class="w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-2xl"
            :class="`from-${job.color}-500 to-${job.color}-600`"
          >
            {{ job.company.charAt(0) }}
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ job.company }}</h2>
            <p class="text-gray-600 text-lg">{{ job.position }}</p>
            <div class="flex items-center space-x-2 mt-1">
              <span
                class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
              >
                {{ getStatusLabel(job.status) }}
              </span>
              <span class="text-sm text-gray-500">{{ job.applyDate }} 投递</span>
            </div>
          </div>
        </div>
        <button class="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span>编辑</span>
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center space-x-2 text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>{{ job.location }}</span>
        </div>
        <div class="flex items-center space-x-2 text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ job.salary }}</span>
        </div>
        <div class="flex items-center space-x-2 text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          <span>{{ job.channel }}</span>
        </div>
        <div class="flex items-center space-x-2 text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>简历v2.0</span>
        </div>
      </div>
    </div>

    <!-- 投递进度 Timeline -->
    <div class="glass-card rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold">投递进度</h3>
        <button class="text-primary hover:text-secondary font-medium text-sm flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>添加记录</span>
        </button>
      </div>

      <div class="relative pl-6 space-y-6">
        <div class="timeline-line"></div>

        <div
          v-for="(item, index) in job.timeline"
          :key="index"
          class="timeline-item relative"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="font-medium">{{ item.status }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ item.desc }}</p>
            </div>
            <span class="text-sm text-gray-500">{{ item.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="flex gap-3 pb-4">
      <button class="flex-1 px-4 py-3 bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center justify-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
        </svg>
        <span>更新状态</span>
      </button>
      <button class="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span>添加面试</span>
      </button>
    </div>
  </main>

  <div v-else class="pt-20 px-4 text-center text-gray-500">
    <p>加载中...</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '@/store/jobs'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()

const job = computed(() => {
  return jobsStore.getJobById(route.params.id)
})

const getStatusLabel = (status) => {
  const statusMap = {
    pending: '待投递',
    submitted: '已投递',
    screening: '初筛中',
    test: '笔试',
    interview1: '一面',
    interview2: '二面',
    interview3: '三面',
    final: '终面',
    offered: '已录用',
    rejected: '已拒绝'
  }
  return statusMap[status] || status
}

const deleteJob = () => {
  if (confirm('确定要删除这个岗位吗?')) {
    jobsStore.deleteJob(route.params.id)
    router.push('/')
  }
}

onMounted(() => {
  if (!job.value) {
    router.push('/')
  }
})
</script>
