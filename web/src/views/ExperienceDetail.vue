<template>
  <main class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20 space-y-6">
    <!-- 加载状态 -->
    <div v-if="experienceStore.loading || !experience" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">加载中...</p>
      </div>
    </div>

    <!-- 详情内容 -->
    <div v-if="!experienceStore.loading && experience">
      <!-- 导航栏 -->
      <div class="flex items-center justify-between mb-6">
        <button @click="goBack" class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>返回</span>
        </button>
        <div class="flex items-center space-x-2">
          <button
            @click="handleToggleFavorite"
            :class="experience.isFavorite === 1 ? 'text-yellow-500' : 'text-gray-400'"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg class="w-6 h-6" :fill="experience.isFavorite === 1 ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
          </button>
          <button
            @click="goToEdit"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          <button
            @click="handleDelete"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-red-500"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 内容卡片 -->
      <div class="glass-card rounded-xl p-8">
        <!-- 标题区域 -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                {{ experience.companyName.charAt(0) }}
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ experience.companyName }} - {{ experience.positionName }}</h1>
                <div class="flex items-center space-x-3 text-sm text-gray-500">
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded">{{ experience.interviewRound }}</span>
                  <span>{{ experience.interviewDate }}</span>
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <span>{{ experience.views }}次浏览</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 标签 -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in experience.tags"
              :key="tag"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors"
              @click="searchByTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 面经内容 -->
        <div class="prose prose-blue max-w-none" v-html="experience.content"></div>

        <!-- 底部信息 -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between text-sm text-gray-500">
            <div class="flex items-center space-x-4">
              <span>创建于 {{ formatDate(experience.createTime) }}</span>
              <span v-if="experience.isAnonymous === 1" class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>匿名发布</span>
              </span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span>{{ experience.views }} 次浏览</span>
              </span>
              <span class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
                <span>{{ experience.comments }} 条评论</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 关联岗位卡片 -->
      <div
        v-if="experience.positionId"
        @click="goToJob"
        class="glass-card rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">关联岗位</h3>
              <p class="text-sm text-gray-600">{{ experience.companyName }} - {{ experience.positionName }}</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="glass-card rounded-xl p-6">
        <h3 class="text-lg font-semibold mb-4">评论 ({{ experience.comments }})</h3>

        <!-- 评论列表（示例） -->
        <div class="space-y-4 mb-6">
          <div class="flex space-x-3">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" class="w-10 h-10 rounded-full">
            <div class="flex-1">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-medium text-sm">求职小王</span>
                  <span class="text-xs text-gray-500">2小时前</span>
                </div>
                <p class="text-sm text-gray-700">非常详细的面经，对我准备Vue面试很有帮助！感谢分享 👍</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 评论输入框 -->
        <div class="flex space-x-3">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser" class="w-10 h-10 rounded-full">
          <div class="flex-1">
            <textarea
              v-model="newComment"
              rows="2"
              class="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              placeholder="写下你的评论..."
            ></textarea>
            <div class="mt-2 flex justify-end">
              <button
                @click="submitComment"
                :disabled="!newComment.trim()"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发表评论
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExperienceStore } from '@/store/experiences'

const route = useRoute()
const router = useRouter()
const experienceStore = useExperienceStore()

const newComment = ref('')

// 当前面经
const experience = computed(() => experienceStore.currentExperience)

/**
 * 加载面经详情
 */
async function loadDetail() {
  const id = Number(route.query.id || route.params.id)
  if (id) {
    await experienceStore.fetchExperienceById(id)
  }
}

/**
 * 返回
 */
function goBack() {
  router.back()
}

/**
 * 跳转到编辑页
 */
function goToEdit() {
  if (experience.value) {
    router.push(`/add-experience?id=${experience.value.id}`)
  }
}

/**
 * 删除面经
 */
async function handleDelete() {
  if (!experience.value) return

  if (confirm('确定要删除这篇面经吗？删除后不可恢复。')) {
    try {
      await experienceStore.deleteExperience(experience.value.id)
      alert('删除成功')
      router.push('/experiences')
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    }
  }
}

/**
 * 切换收藏状态
 */
async function handleToggleFavorite() {
  if (!experience.value) return

  try {
    await experienceStore.toggleFavorite(experience.value.id)
  } catch (error) {
    console.error('操作失败:', error)
  }
}

/**
 * 按标签搜索
 */
function searchByTag(tag: string) {
  router.push(`/experiences?tag=${tag}`)
}

/**
 * 跳转到岗位详情
 */
function goToJob() {
  if (experience.value?.positionId) {
    router.push(`/job-detail?id=${experience.value.positionId}`)
  }
}

/**
 * 提交评论
 */
function submitComment() {
  if (!newComment.value.trim()) return

  // TODO: 实现评论功能
  alert('评论功能开发中...')
  newComment.value = ''
}

/**
 * 格式化日期
 */
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.prose h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1E293B;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: #334155;
}

.prose p {
  margin-bottom: 0.75rem;
  line-height: 1.75;
}

.prose ul, .prose ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.prose pre {
  background: #1E293B;
  color: #F8FAFC;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.prose code {
  background: #F1F5F9;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>
