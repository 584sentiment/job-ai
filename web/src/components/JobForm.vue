<template>
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
            v-model="form.companyName"
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
            v-model="form.positionName"
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
              v-model="form.deliveryChannel"
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
              v-model="form.deliveryDate"
              type="date"
              required
              class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 可选信息 -->
    <details class="glass-card rounded-xl overflow-hidden group" :open="mode === 'edit'">
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
              v-model="form.workLocation"
              type="text"
              placeholder="例如:北京"
              class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">薪资范围</label>
            <input
              v-model="form.salaryRange"
              type="text"
              placeholder="例如:25-40K"
              class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">岗位描述 (JD)</label>
          <textarea
            v-model="form.jobDescription"
            rows="4"
            placeholder="粘贴岗位描述..."
            class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">联系人姓名</label>
            <input
              v-model="form.contactName"
              type="text"
              placeholder="联系人"
              class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">联系人电话</label>
            <input
              v-model="form.contactPhone"
              type="text"
              placeholder="联系电话"
              class="form-input w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
          <textarea
            v-model="form.remarks"
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
            class="px-4 py-3 rounded-lg border-2 border-border text-center peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white transition-all duration-200 hover:border-gray-300 text-sm"
            :class="{
              'peer-checked:border-green-500 peer-checked:bg-green-500': status.value === PositionStatus.OFFER || status.value === PositionStatus.JOINED,
              'peer-checked:border-red-500 peer-checked:bg-red-500': status.value === PositionStatus.REJECTED || status.value === PositionStatus.NOT_PASS
            }"
          >
            {{ status.label }}
          </div>
        </label>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-3 pt-4">
      <button
        v-if="onCancel"
        type="button"
        @click="onCancel"
        class="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
      >
        取消
      </button>
      <button
        type="submit"
        class="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200 font-medium"
      >
        {{ mode === 'add' ? '保存岗位' : '保存修改' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { PositionStatus } from '@/types'

interface Props {
  mode?: 'add' | 'edit'
  initialData?: any
  onCancel?: (() => void) | null
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
  initialData: null,
  onCancel: null
})

const emit = defineEmits(['submit'])

// 表单数据 - 使用后端字段名
const form = ref({
  id: undefined as number | undefined,
  companyName: '',
  positionName: '',
  deliveryChannel: '',
  deliveryDate: new Date().toISOString().split('T')[0],
  workLocation: '',
  salaryRange: '',
  jobDescription: '',
  contactName: '',
  contactPhone: '',
  remarks: '',
  status: PositionStatus.TO_BE_DELIVERED
})

// 状态选项 - 使用后端枚举值
const statusOptions = [
  { label: '待投递', value: PositionStatus.TO_BE_DELIVERED },       // 0
  { label: '已投递', value: PositionStatus.DELIVERED },             // 1
  { label: '流程中', value: PositionStatus.IN_PROCESS },            // 2
  { label: '已Offer', value: PositionStatus.OFFER },                // 3
  { label: '已入职', value: PositionStatus.JOINED },                // 4
  { label: '未通过', value: PositionStatus.NOT_PASS },              // 7
  { label: '已拒绝', value: PositionStatus.REJECTED }               // 8
]

// 监听初始数据变化（编辑模式）
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = {
      id: newData.id,
      companyName: newData.companyName || '',
      positionName: newData.positionName || '',
      deliveryChannel: newData.deliveryChannel || '',
      deliveryDate: newData.deliveryDate ? newData.deliveryDate.split('T')[0] : new Date().toISOString().split('T')[0],
      workLocation: newData.workLocation || '',
      salaryRange: newData.salaryRange || '',
      jobDescription: newData.jobDescription || '',
      contactName: newData.contactName || '',
      contactPhone: newData.contactPhone || '',
      remarks: newData.remarks || '',
      status: newData.status ?? PositionStatus.TO_BE_DELIVERED
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', { ...form.value })
}
</script>
