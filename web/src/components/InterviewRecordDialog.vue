<template>
  <Dialog as="div" class="relative z-50" :open="open" @close="handleClose">
    <!-- 背景遮罩 -->
    <div class="fixed inset-0 bg-black/30 transition-opacity" aria-hidden="true"></div>

    <!-- 对话框容器 -->
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center px-4 py-0 sm:p-0">
        <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full">
          <!-- 对话框头部 -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 flex items-center justify-between border-b border-gray-200">
            <DialogTitle class="text-lg font-semibold text-gray-900">
              {{ mode === 'add' ? '添加面试记录' : '编辑面试记录' }}
            </DialogTitle>
            <button
              @click="handleClose"
              type="button"
              class="rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- 对话框内容 -->
          <div class="px-4 py-5 sm:p-6 max-h-[70vh] overflow-y-auto">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- 面试轮次 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  面试轮次 <span class="text-red-500">*</span>
                </label>
                <NSelect
                  v-model:value="form.interviewRound"
                  :options="roundOptions"
                  placeholder="请选择面试轮次"
                  size="large"
                  class="w-full"
                />
              </div>

              <!-- 面试时间 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  面试时间 <span class="text-red-500">*</span>
                </label>
                <NDatePicker
                  v-model:value="form.interviewTime"
                  type="datetime"
                  placeholder="请选择面试时间"
                  class="w-full"
                  size="large"
                  clearable
                />
              </div>

              <!-- 面试地点 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  面试地点 <span class="text-red-500">*</span>
                </label>
                <NInput
                  v-model:value="form.interviewLocation"
                  type="text"
                  placeholder="例如:北京海淀区中关村软件园"
                  size="large"
                />
              </div>

              <!-- 面试形式 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  面试形式 <span class="text-red-500">*</span>
                </label>
                <NSelect
                  v-model:value="form.interviewForm"
                  :options="formOptions"
                  placeholder="请选择面试形式"
                  size="large"
                  class="w-full"
                />
              </div>

              <!-- 面试官信息 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">面试官信息</label>
                <NInput
                  v-model:value="form.interviewerInfo"
                  type="text"
                  placeholder="例如:张经理（技术总监）"
                  size="large"
                />
              </div>

              <!-- 备注 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <NInput
                  v-model:value="form.remarks"
                  type="textarea"
                  placeholder="面试注意事项、准备材料等"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                />
              </div>

              <!-- AI准备清单 -->
              <div class="border-t border-gray-200 pt-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                    <h4 class="text-sm font-semibold text-gray-800">AI面试准备清单</h4>
                  </div>
                  <button
                    type="button"
                    @click="generatePrepList"
                    :disabled="isGeneratingPrepList"
                    class="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs font-medium"
                  >
                    <svg v-if="!isGeneratingPrepList" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <svg v-else class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isGeneratingPrepList ? '生成中...' : 'AI生成清单' }}
                  </button>
                </div>

                <!-- 清单内容 -->
                <div v-if="prepList.length > 0" class="bg-purple-50 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                  <div
                    v-for="item in prepList"
                    :key="item.id"
                    class="flex items-start gap-2 p-2 bg-white rounded-lg hover:shadow-sm transition-shadow duration-200"
                  >
                    <input
                      type="checkbox"
                      :id="`prep-item-${item.id}`"
                      v-model="item.completed"
                      class="mt-0.5 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    >
                    <label
                      :for="`prep-item-${item.id}`"
                      class="flex-1 text-sm text-gray-700 cursor-pointer"
                      :class="{ 'line-through text-gray-400': item.completed }"
                    >
                      {{ item.text }}
                    </label>
                  </div>
                  <!-- 完成进度 -->
                  <div class="mt-3 pt-3 border-t border-purple-200">
                    <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>完成进度</span>
                      <span>{{ completedPrepCount }}/{{ prepList.length }}</span>
                    </div>
                    <div class="w-full bg-purple-200 rounded-full h-1.5">
                      <div
                        class="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
                        :style="{ width: prepListProgress + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- 空状态 -->
                <div v-else class="text-center py-6 text-gray-500 text-sm">
                  <svg class="w-10 h-10 mx-auto mb-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                  <p>点击"AI生成清单"按钮</p>
                  <p class="text-xs mt-1">AI将根据面试信息为您生成准备清单</p>
                </div>
              </div>
            </form>
          </div>

          <!-- 对话框底部按钮 -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 border-t border-gray-200">
            <button
              @click="handleSubmit"
              type="button"
              :disabled="!isFormValid || props.submitting"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="props.submitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ props.submitting ? '提交中...' : (mode === 'add' ? '添加' : '保存') }}
            </button>
            <button
              @click="handleClose"
              type="button"
              :disabled="props.submitting"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              取消
            </button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { NSelect, NDatePicker, NInput, useMessage } from 'naive-ui'
import { InterviewRound, InterviewForm, type Interview, type InterviewCreateRequest } from '@/types'
import aiAPI from '@/api/ai'
import type { PrepListItem } from '@/types'

interface Props {
  open: boolean
  mode: 'add' | 'edit'
  positionId?: string
  initialData?: Interview | null
  submitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'add',
  positionId: '',
  initialData: null,
  submitting: false
})

const emit = defineEmits(['update:open', 'submit'])
const message = useMessage()

// AI准备清单状态
const prepList = ref<PrepListItem[]>([])
const isGeneratingPrepList = ref(false)

// 表单数据
const form = ref({
  interviewRound: '',
  interviewTime: Date.now(),
  interviewLocation: '',
  interviewForm: '',
  interviewerInfo: '',
  remarks: ''
})

// 面试轮次选项
const roundOptions = [
  { label: '笔试', value: InterviewRound.WRITTEN_TEST },
  { label: '一面', value: InterviewRound.FIRST_ROUND },
  { label: '二面', value: InterviewRound.SECOND_ROUND },
  { label: '三面', value: InterviewRound.THIRD_ROUND },
  { label: '终面', value: InterviewRound.FINAL_ROUND }
]

// 面试形式选项
const formOptions = [
  { label: '现场面试', value: InterviewForm.ONSITE },
  { label: '视频面试', value: InterviewForm.VIDEO },
  { label: '电话面试', value: InterviewForm.PHONE }
]

// 表单验证
const isFormValid = computed(() => {
  return form.value.interviewRound &&
         form.value.interviewTime &&
         form.value.interviewLocation &&
         form.value.interviewForm
})

// 监听初始数据变化（编辑模式）
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = {
      interviewRound: newData.interviewRound || '',
      interviewTime: newData.interviewTime || Date.now(),
      interviewLocation: newData.interviewLocation || '',
      interviewForm: newData.interviewForm || '',
      interviewerInfo: newData.interviewerInfo || '',
      remarks: newData.remarks || ''
    }
  } else {
    // 重置表单
    form.value = {
      interviewRound: '',
      interviewTime: Date.now(),
      interviewLocation: '',
      interviewForm: '',
      interviewerInfo: '',
      remarks: ''
    }
  }
}, { immediate: true })

// 对话框关闭时重置表单
watch(() => props.open, (newVal) => {
  if (!newVal) {
    // 延迟重置,避免动画过程中表单突然清空
    setTimeout(() => {
      form.value = {
        interviewRound: '',
        interviewTime: Date.now(),
        interviewLocation: '',
        interviewForm: '',
        interviewerInfo: '',
        remarks: ''
      }
    }, 300)
  }
})

const handleClose = () => {
  emit('update:open', false)
}

const handleSubmit = () => {
  if (!isFormValid.value) {
    return
  }

  // 使用时间戳格式
  const submitData: InterviewCreateRequest = {
    positionId: props.positionId,
    interviewRound: form.value.interviewRound,
    interviewTime: form.value.interviewTime,
    interviewLocation: form.value.interviewLocation,
    interviewForm: form.value.interviewForm,
    interviewerInfo: form.value.interviewerInfo,
    remarks: form.value.remarks
  }

  // 如果是编辑模式,添加 id
  if (props.mode === 'edit' && props.initialData) {
    (submitData as any).id = props.initialData.id
  }

  emit('submit', submitData)
  emit('update:open', false)
}

// 计算准备清单完成进度
const completedPrepCount = computed(() => {
  return prepList.value.filter(item => item.completed).length
})

const prepListProgress = computed(() => {
  if (prepList.value.length === 0) return 0
  return Math.round((completedPrepCount.value / prepList.value.length) * 100)
})

// AI生成准备清单
async function generatePrepList() {
  if (!form.value.interviewRound) {
    message.warning('请先选择面试轮次')
    return
  }

  isGeneratingPrepList.value = true

  try {
    const interview = {
      round: form.value.interviewRound,
      position: '', // 可以从岗位信息获取
      company: '' // 可以从岗位信息获取
    }

    const response = await aiAPI.generatePrepList(interview)

    // 后端返回格式：{ code, message, data: [...] }
    prepList.value = response.data || response

    message.success('AI准备清单已生成！')
  } catch (error) {
    message.error('AI生成失败，请稍后重试')
    console.error('AI prep list generation error:', error)
  } finally {
    isGeneratingPrepList.value = false
  }
}
</script>
