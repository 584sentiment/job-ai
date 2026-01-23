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

    <!-- 录入模式切换 -->
    <div class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="font-medium text-blue-900">快速录入模式</p>
            <p class="text-sm text-blue-700">仅需填写必填字段,快速记录岗位信息</p>
          </div>
        </div>
        <button class="text-primary hover:text-secondary font-medium text-sm transition-colors duration-200">切换到完整模式</button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 基础信息 -->
      <div class="glass-card rounded-xl p-6">
        <div class="flex items-center space-x-2 mb-6">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <h2 class="text-lg font-semibold">基础信息</h2>
          <span class="text-red-500 text-sm">*</span>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              公司名称 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.company"
              type="text"
              required
              placeholder="例如:字节跳动"
              class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              岗位名称 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.position"
              type="text"
              required
              placeholder="例如:前端开发工程师"
              class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none"
            >
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                投递渠道 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.channel"
                required
                class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none"
              >
                <option value="">请选择</option>
                <option value="招聘APP">招聘APP</option>
                <option value="企业官网">企业官网</option>
                <option value="内推">内推</option>
                <option value="宣讲会">宣讲会</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                投递日期 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.applyDate"
                type="date"
                required
                class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 可选信息 -->
      <details class="glass-card rounded-xl overflow-hidden group">
        <summary class="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 class="text-lg font-semibold text-gray-700">详细信息(可选)</h2>
          </div>
          <svg class="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </summary>

        <div class="px-6 pb-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">工作地点</label>
              <input
                v-model="form.location"
                type="text"
                placeholder="例如:北京"
                class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">薪资范围</label>
              <input
                v-model="form.salary"
                type="text"
                placeholder="例如:25-40K"
                class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <textarea
              v-model="form.remark"
              rows="2"
              placeholder="例如:内推人是校友、岗位亮点等"
              class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none resize-none"
            ></textarea>
          </div>
        </div>
      </details>

      <!-- 投递状态 -->
      <div class="glass-card rounded-xl p-6">
        <div class="flex items-center space-x-2 mb-6">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-lg font-semibold">投递状态</h2>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <label
            v-for="status in statusOptions"
            :key="status.value"
            class="cursor-pointer"
          >
            <input
              v-model="form.status"
              type="radio"
              :value="status.value"
              class="sr-only peer"
            >
            <div
              class="px-4 py-3 rounded-lg border-2 border-border text-center peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white transition-all duration-200 hover:border-gray-300"
              :class="{
                'peer-checked:border-green-500 peer-checked:bg-green-500': status.value === 'offered',
                'peer-checked:border-red-500 peer-checked:bg-red-500': status.value === 'rejected'
              }"
            >
              {{ status.label }}
            </div>
          </label>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          class="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
        >
          保存为草稿
        </button>
        <button
          type="submit"
          class="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200 font-medium"
        >
          保存岗位
        </button>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/store/jobs'

const router = useRouter()
const jobsStore = useJobsStore()

const form = ref({
  company: '',
  position: '',
  channel: '',
  applyDate: new Date().toISOString().split('T')[0],
  location: '',
  salary: '',
  remark: '',
  status: 'pending'
})

const statusOptions = [
  { label: '待投递', value: 'pending' },
  { label: '已投递', value: 'submitted' },
  { label: '初筛中', value: 'screening' },
  { label: '笔试', value: 'test' },
  { label: '一面', value: 'interview1' },
  { label: '二面', value: 'interview2' },
  { label: '三面', value: 'interview3' },
  { label: '终面', value: 'final' },
  { label: '已录用', value: 'offered' },
  { label: '已拒绝', value: 'rejected' }
]

const handleSubmit = () => {
  // 生成随机颜色
  const colors = ['blue', 'green', 'orange', 'purple', 'red']
  const color = colors[Math.floor(Math.random() * colors.length)]

  jobsStore.addJob({
    ...form.value,
    color
  })

  router.push('/')
}
</script>
