<template>
  <main class="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- 搜索和操作栏 -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="relative flex-1 max-w-xl w-full">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索公司或岗位名称..."
          class="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        >
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <div class="flex gap-3">
        <button
          @click="showFilter = !showFilter"
          class="px-4 py-2.5 hover:text-primary hover:bg-white rounded-lg border border-border transition-all duration-200 flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          <span>筛选</span>
        </button>
        <router-link
          to="/add-job"
          class="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>新增岗位</span>
        </router-link>
      </div>
    </div>

    <!-- 状态筛选标签 -->
    <div class="mb-6 overflow-x-auto">
      <div class="flex space-x-2 pb-2">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          @click="jobsStore.setFilter(filter.value)"
          :class="[
            'px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200',
            jobsStore.currentFilter === filter.value
              ? 'bg-primary text-white'
              : 'bg-white text-text border border-border hover:border-primary hover:text-primary'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- 岗位卡片列表 -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <!-- 岗位卡片 -->
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        @click="goToDetail(job.id)"
        class="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg"
              :class="`from-${job.color}-500 to-${job.color}-600`"
            >
              {{ job.company.charAt(0) }}
            </div>
            <div>
              <h3 class="font-semibold text-lg text-text">{{ job.company }}</h3>
              <p class="text-sm text-gray-500">{{ job.position }}</p>
            </div>
          </div>
          <span
            class="status-badge px-3 py-1 rounded-full text-sm font-medium"
            :class="getStatusClass(job.status)"
          >
            {{ getStatusLabel(job.status) }}
          </span>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{{ job.location }}</span>
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ job.salary }}</span>
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            <span>{{ job.channel }}</span>
          </div>
        </div>

        <div class="pt-4 border-t border-border">
          <p class="text-sm text-gray-600 line-clamp-2">{{ job.remark }}</p>
        </div>

        <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>投递日期: {{ job.applyDate }}</span>
          <span class="text-primary font-medium">查看详情 →</span>
        </div>
      </div>

      <!-- 新增岗位卡片 -->
      <router-link
        to="/add-job"
        class="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200"
      >
        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </div>
        <p class="text-gray-600 font-medium">添加新岗位</p>
        <p class="text-sm text-gray-400 mt-1">记录新的求职机会</p>
      </router-link>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/store/jobs'

const router = useRouter()
const jobsStore = useJobsStore()

const searchKeyword = ref('')
const showFilter = ref(false)

const statusFilters = [
  { label: '全部', value: 'all' },
  { label: '待投递', value: 'pending' },
  { label: '已投递', value: 'submitted' },
  { label: '面试中', value: 'interview1' },
  { label: '已录用', value: 'offered' },
  { label: '已拒绝', value: 'rejected' }
]

const filteredJobs = computed(() => {
  let jobs = jobsStore.filteredJobs

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    jobs = jobs.filter(job =>
      job.company.toLowerCase().includes(keyword) ||
      job.position.toLowerCase().includes(keyword)
    )
  }

  return jobs
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

const getStatusClass = (status) => {
  const classMap = {
    pending: 'bg-yellow-100 text-yellow-700',
    submitted: 'bg-blue-100 text-blue-700',
    screening: 'bg-purple-100 text-purple-700',
    test: 'bg-gray-100 text-gray-700',
    interview1: 'bg-blue-100 text-blue-700',
    interview2: 'bg-blue-100 text-blue-700',
    interview3: 'bg-blue-100 text-blue-700',
    final: 'bg-indigo-100 text-indigo-700',
    offered: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  }
  return classMap[status] || 'bg-gray-100 text-gray-700'
}

const goToDetail = (id) => {
  router.push(`/job/${id}`)
}
</script>
