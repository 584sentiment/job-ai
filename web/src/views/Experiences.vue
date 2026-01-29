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
            v-model="experienceStore.searchKeyword"
            type="text"
            placeholder="搜索面经..."
            class="pl-10 pr-10 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 w-64"
          >
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <!-- 清除搜索按钮 -->
          <button
            v-if="experienceStore.searchKeyword"
            @click="experienceStore.setSearchKeyword('')"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <router-link
          to="/add-experience"
          class="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>添加面经</span>
        </router-link>
      </div>
    </div>

    <!-- Tab筛选 -->
    <div class="mb-6 overflow-x-auto">
      <div class="flex space-x-2 pb-2">
        <button
          @click="experienceStore.setFilter('all')"
          :class="[
            'px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200',
            experienceStore.currentFilter === 'all'
              ? 'bg-primary text-white'
              : 'bg-white text-text border border-border hover:border-primary hover:text-primary'
          ]"
        >
          全部 ({{ experienceStore.stats.total }})
        </button>
        <button
          @click="experienceStore.setFilter('favorite')"
          :class="[
            'px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200',
            experienceStore.currentFilter === 'favorite'
              ? 'bg-primary text-white'
              : 'bg-white text-text border border-border hover:border-primary hover:text-primary'
          ]"
        >
          我的收藏 ({{ experienceStore.stats.favorites }})
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="experienceStore.loading" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">加载中...</p>
      </div>
    </div>

    <!-- 面经列表 -->
    <div v-if="!experienceStore.loading && experienceStore.filteredExperiences.length > 0" class="grid gap-4 md:grid-cols-2">
      <div
        v-for="exp in experienceStore.filteredExperiences"
        :key="exp.id"
        @click="goToDetail(exp.id)"
        class="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {{ exp.companyName.charAt(0) }}
            </div>
            <div>
              <h3 class="font-semibold text-lg">{{ exp.companyName }}</h3>
              <p class="text-sm text-gray-500">{{ exp.positionName }}</p>
            </div>
          </div>
          <button
            @click.stop="handleToggleFavorite(exp.id)"
            :class="[exp.isFavorite === 1 ? 'text-yellow-500' : 'text-gray-300']"
            class="hover:text-yellow-500 transition-colors duration-200"
          >
            <svg class="w-6 h-6" :fill="exp.isFavorite === 1 ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <div class="flex items-center space-x-2 mb-2">
            <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{{ exp.interviewRound }}</span>
            <span class="text-xs text-gray-500">{{ formatTimestamp(exp.interviewDate) }}</span>
          </div>
          <p class="text-gray-700 text-sm line-clamp-3">
            {{ exp.content.substring(0, 150) }}...
          </p>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between pt-4 border-t border-gray-200">
            <div class="flex items-center space-x-2">
              <span
                v-for="tag in exp.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {{ tag }}
              </span>
              <span v-if="exp.tags.length > 3" class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{{ exp.tags.length - 3 }}
              </span>
            </div>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span>{{ exp.views }}</span>
              </span>
              <span class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
                <span>{{ exp.comments }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!experienceStore.loading && experienceStore.filteredExperiences.length === 0" class="text-center py-16">
      <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p class="text-gray-500 text-lg">暂无面经记录</p>
      <p class="text-gray-400 mt-2">点击上方"添加面经"按钮记录第一篇面经</p>
      <router-link
        to="/add-experience"
        class="inline-block mt-4 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200"
      >
        立即添加
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExperienceStore } from '@/store/experiences'

const router = useRouter()
const experienceStore = useExperienceStore()

/**
 * 加载面经列表
 */
async function loadExperiences() {
  await experienceStore.fetchExperiences()
}

/**
 * 跳转到详情页
 */
function goToDetail(id: number) {
  router.push(`/experience-detail?id=${id}`)
}

/**
 * 切换收藏状态
 */
async function handleToggleFavorite(id: number) {
  try {
    await experienceStore.toggleFavorite(id)
  } catch (error) {
    console.error('操作失败:', error)
  }
}

/**
 * 格式化 BigInt 时间戳或日期字符串
 */
function formatTimestamp(timestamp: string | number | bigint): string {
  let ms: number

  // 处理 BigInt
  if (typeof timestamp === 'bigint') {
    ms = Number(timestamp)
  }
  // 处理数字字符串或数字
  else if (typeof timestamp === 'string') {
    // 如果是纯数字字符串，当作时间戳处理
    if (/^\d+$/.test(timestamp)) {
      ms = parseInt(timestamp)
    } else {
      // 否则直接返回（已经是格式化的日期字符串）
      return timestamp
    }
  }
  // 处理数字
  else if (typeof timestamp === 'number') {
    ms = timestamp
  }
  else {
    return timestamp.toString()
  }

  const date = new Date(ms)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

onMounted(() => {
  loadExperiences()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
