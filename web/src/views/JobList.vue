<template>
  <main class="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- 搜索和操作栏 -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="relative flex-1 max-w-xl w-full">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="请输入关键字进行搜索"
          class="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        >
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <!-- 清除搜索按钮 -->
        <button
          v-if="searchKeyword"
          @click="searchKeyword = ''"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
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
          :disabled="jobsStore.loading"
        >
          {{ filter.label }}
          <span v-if="filter.value !== 'all'" class="ml-1 opacity-75">
            ({{ getStatusCount(filter.value) }})
          </span>
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="jobsStore.loading" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">加载中...</p>
      </div>
    </div>

    <!-- 筛选结果统计 -->
    <div v-if="!jobsStore.loading && jobsStore.pagination.total > 0" class="mb-4 flex items-center justify-between">
      <p class="text-sm text-gray-600">
        找到 <span class="font-semibold text-primary">{{ jobsStore.pagination.total }}</span> 个岗位
      </p>
      <button
        v-if="jobsStore.currentFilter !== 'all'"
        @click="jobsStore.resetFilter()"
        class="text-sm text-gray-500 hover:text-primary transition-colors duration-200"
      >
        清除筛选
      </button>
    </div>

    <!-- 岗位卡片网格 -->
    <div v-if="!jobsStore.loading && filteredJobs.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                :class="`from-${getColorByStatus(job.status)}-500 to-${getColorByStatus(job.status)}-600`"
              >
                {{ job.companyName?.charAt(0) }}
              </div>
            <div>
              <h3 class="font-semibold text-lg text-text">{{ job.companyName }}</h3>
              <p class="text-sm text-gray-500">{{ job.positionName }}</p>
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
            <span>{{ job.workLocation }}</span>
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ job.salaryRange }}</span>
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            <span>{{ job.deliveryChannel }}</span>
          </div>
        </div>

        <div class="pt-4 border-t border-border">
          <p class="text-sm text-gray-600 line-clamp-2">{{ job.remarks }}</p>
        </div>

        <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>投递日期: {{ job.deliveryDate?.split('T')[0] }}</span>
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

    <!-- 空状态提示 -->
    <div
      v-if="!jobsStore.loading && filteredJobs.length === 0"
      class="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center"
    >
      <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">暂无岗位</h3>
      <p class="text-gray-500 text-center mb-4">
        {{ jobsStore.currentFilter !== 'all' ? '该状态下暂无岗位' : '还没有添加任何岗位' }}
      </p>
      <router-link
        to="/add-job"
        class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200"
      >
        添加第一个岗位
      </router-link>
    </div>

    <!-- 分页组件 -->
    <div
      v-if="!jobsStore.loading && jobsStore.pagination.total > 0"
      class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg p-4 shadow-sm"
    >
      <!-- 每页大小选择器 -->
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-600">每页显示</span>
        <select
          :value="jobsStore.pagination.size"
          @change="handlePageSizeChange($event)"
          class="px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          :disabled="jobsStore.loading"
        >
          <option value="10">10 条</option>
          <option value="20">20 条</option>
          <option value="50">50 条</option>
          <option value="100">100 条</option>
        </select>
      </div>

      <!-- 分页信息和分页组件 -->
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600">
          共 <span class="font-semibold">{{ jobsStore.pagination.total }}</span> 条
        </span>

        <Pagination
          :pages="jobsStore.pagination.pages"
          v-model="jobsStore.pagination.current"
          @update:modelValue="handlePageChange"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/store/jobs'
import { getStatusLabel, getStatusClass } from '@/constants/position'
import { getColorByStatus } from '@/utils/mappers'
import { PositionStatus } from '@/types'
import Pagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'

const router = useRouter()
const jobsStore = useJobsStore()

const searchKeyword = ref('')
const showFilter = ref(false)

// 页面加载时获取岗位列表
onMounted(() => {
  jobsStore.fetchJobs()
})

// 监听搜索框变化，进行后端搜索（防抖处理）
let searchTimer: NodeJS.Timeout | null = null
watch(searchKeyword, (newKeyword) => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  searchTimer = setTimeout(() => {
    jobsStore.searchJobs(newKeyword)
  }, 500) // 500ms 防抖
})

// 状态筛选选项（使用枚举值）
const statusFilters = [
  { label: '全部', value: 'all' },
  { label: '待投递', value: PositionStatus.TO_BE_DELIVERED },
  { label: '已投递', value: PositionStatus.DELIVERED },
  { label: '流程中', value: PositionStatus.IN_PROCESS },
  { label: '已Offer', value: PositionStatus.OFFER },
  { label: '已拒绝', value: PositionStatus.REJECTED }
]

// 获取指定状态的岗位数量
const getStatusCount = (statusValue: number | string) => {
  if (statusValue === 'all') {
    return jobsStore.jobs.length
  }
  // PositionStatus 枚举值是字符串类型，保持原样比较
  const status = statusValue
  return jobsStore.jobs.filter(job => job.status === status).length
}

// 直接使用后端返回的数据，不进行前端筛选
const filteredJobs = computed(() => {
  return jobsStore.filteredJobs
})

// 处理分页变化
const handlePageChange = async (page: number) => {
  console.log('分页变化:', page)
  await jobsStore.goToPage(page)
}

// 处理每页大小变化
const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const size = parseInt(target.value)
  jobsStore.changePageSize(size)
}

const goToDetail = (id: number) => {
  router.push(`/job/${id}`)
}
</script>
