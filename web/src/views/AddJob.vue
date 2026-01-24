<template>
  <main class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <!-- 顶部导航栏 -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <router-link to="/" class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </router-link>
        <h1 class="text-xl font-semibold">新增岗位</h1>
      </div>
      <button class="p-2 text-gray-500 hover:text-primary transition-colors duration-200">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
        </svg>
      </button>
    </div>

    <!-- 快速录入模式提示 -->
    <div class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <p class="font-medium text-blue-900">快速录入模式</p>
          <p class="text-sm text-blue-700">仅需填写必填字段,快速记录岗位信息。详细信息可稍后在详情页补充。</p>
        </div>
      </div>
    </div>

    <JobForm mode="add" @submit="handleSubmit" />
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/store/jobs'
import JobForm from '@/components/JobForm.vue'

const router = useRouter()
const jobsStore = useJobsStore()

const handleSubmit = async (formData) => {
  try {
    await jobsStore.addJob(formData)
    router.push('/')
  } catch (error) {
    console.error('添加岗位失败:', error)
    alert('添加岗位失败，请重试')
  }
}
</script>
