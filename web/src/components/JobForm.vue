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
            <n-select
              v-model:value="form.deliveryChannel"
              :options="deliveryChannelOptions"
              placeholder="请选择"
              :consistent-menu-width="false"
              size="large"
              class="w-full custom-select"
              :theme-overrides="selectThemeOverrides"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              投递日期 <span class="text-red-500">*</span>
            </label>
            <n-date-picker
              v-model:value="form.deliveryDate"
              type="date"
              placeholder="请选择日期"
              class="w-full custom-date-picker"
              size="large"
              clearable
            />
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
          <!-- AI智能解析按钮 -->
          <div class="mt-2 flex items-center justify-between">
            <button
              type="button"
              @click="parseJDWithAI"
              :disabled="!form.jobDescription.trim() || isParsingJD"
              class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
            >
              <svg v-if="!isParsingJD" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isParsingJD ? 'AI解析中...' : 'AI智能解析JD' }}
            </button>
            <span class="text-xs text-gray-500">AI将自动提取关键信息填充表单</span>
          </div>
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
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-lg font-semibold">投递状态</h2>
        </div>
        <!-- 禁用提示 -->
        <div v-if="hasRealInterviews && mode === 'edit'" class="flex items-start gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <svg class="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-xs text-yellow-700">已有面试记录，投递状态不可修改</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <label
          v-for="status in statusOptions"
          :key="status.value"
          :class="hasRealInterviews && mode === 'edit' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
        >
          <input
            v-model="form.status"
            type="radio"
            :value="status.value"
            :disabled="hasRealInterviews && mode === 'edit'"
            class="sr-only peer"
          >
          <div
            class="px-4 py-3 rounded-lg border-2 border-border text-center peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white transition-all duration-200 text-sm font-medium"
            :class="{
              'hover:border-gray-300': !(hasRealInterviews && mode === 'edit'),
              'bg-gray-100': hasRealInterviews && mode === 'edit'
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
import { NSelect, NDatePicker, useMessage } from 'naive-ui'
import aiAPI from '@/api/ai'

interface Props {
  mode?: 'add' | 'edit'
  initialData?: any
  onCancel?: (() => void) | null
  hasRealInterviews?: boolean // 是否有真实面试记录
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
  initialData: null,
  onCancel: null,
  hasRealInterviews: false
})

const emit = defineEmits(['submit'])
const message = useMessage()

// AI解析状态
const isParsingJD = ref(false)

// 表单数据 - 使用后端字段名（时间使用时间戳格式）
const form = ref({
  id: undefined as number | undefined,
  companyName: '',
  positionName: '',
  deliveryChannel: '',
  deliveryDate: Date.now(), // 使用时间戳格式
  workLocation: '',
  salaryRange: '',
  jobDescription: '',
  contactName: '',
  contactPhone: '',
  remarks: '',
  status: PositionStatus.TO_BE_DELIVERED
})

// 状态选项 - 只保留未投递和已投递两个选项
const statusOptions = [
  { label: '未投递', value: PositionStatus.TO_BE_DELIVERED },       // 0
  { label: '已投递', value: PositionStatus.DELIVERED }              // 1
]

// 投递渠道选项
const deliveryChannelOptions = [
  { label: '招聘APP', value: '招聘APP' },
  { label: '企业官网', value: '企业官网' },
  { label: '内推', value: '内推' },
  { label: '宣讲会', value: '宣讲会' },
  { label: '其他', value: '其他' }
]

// NSelect 主题覆盖 - 使其与现有输入框风格一致
const selectThemeOverrides = {
  peers: {
    InternalSelection: {
      border: '1px solid #E2E8F0',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      height: '48px',
      color: '#1E293B',
      caretColor: '#2563EB',
      borderFocus: '1px solid #2563EB',
      borderHover: '1px solid #2563EB',
      borderActive: '1px solid #2563EB',
      boxShadowFocus: '0 0 0 2px rgba(37, 99, 235, 0.1)',
      textColor: '#1E293B',
      placeholderColor: '#9CA3AF'
    }
  }
}

// 监听初始数据变化（编辑模式）
watch(() => props.initialData, (newData) => {
  if (newData) {
    // 处理 deliveryDate - 支持 BigInt 字符串格式（如 "1769530615256"）
    let deliveryDate = Date.now()
    if (newData.deliveryDate) {
      if (typeof newData.deliveryDate === 'string' && /^\d+$/.test(newData.deliveryDate)) {
        // 纯数字字符串（时间戳），直接转换为数字
        deliveryDate = parseInt(newData.deliveryDate, 10)
      } else if (typeof newData.deliveryDate === 'number') {
        // 已经是数字时间戳，直接使用
        deliveryDate = newData.deliveryDate
      } else {
        // 其他格式（ISO 字符串等），用 Date 解析
        deliveryDate = new Date(newData.deliveryDate).getTime()
      }
    }

    form.value = {
      id: newData.id,
      companyName: newData.companyName || '',
      positionName: newData.positionName || '',
      deliveryChannel: newData.deliveryChannel || '',
      deliveryDate,
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

// AI智能解析JD
async function parseJDWithAI() {
  const jdText = form.value.jobDescription.trim()
  if (!jdText) {
    message.warning('请先粘贴岗位描述(JD)')
    return
  }

  isParsingJD.value = true

  try {
    const response = await aiAPI.parseJD(jdText)

    // 后端返回格式：{ code, message, data: { location, salaryRange, ... } }
    const result = response.data || response

    // 自动填充表单
    if (result.location && result.location !== '未提及') {
      form.value.workLocation = result.location
    }
    if (result.salaryRange && result.salaryRange !== '未提及') {
      form.value.salaryRange = result.salaryRange
    }

    // 显示解析结果
    message.success('AI解析成功！已自动填充工作地点和薪资范围')

    // 显示更多解析信息
    if (result.responsibilities || (result.skills && result.skills.length > 0)) {
      setTimeout(() => {
        const details = []
        if (result.responsibilities && result.responsibilities !== '未提及') {
          details.push(`**岗位职责**: ${result.responsibilities}`)
        }
        if (result.skills && result.skills.length > 0 && result.skills[0] !== '未提及') {
          details.push(`**技能要求**: ${result.skills.join('、')}`)
        }
        if (details.length > 0) {
          message.info(details.join('\n'), { duration: 5000 })
        }
      }, 500)
    }
  } catch (error) {
    message.error('AI解析失败，请稍后重试')
    console.error('JD parsing error:', error)
  } finally {
    isParsingJD.value = false
  }
}
</script>
