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
            </form>
          </div>

          <!-- 对话框底部按钮 -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 border-t border-gray-200">
            <button
              @click="handleSubmit"
              type="button"
              :disabled="!isFormValid"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ mode === 'add' ? '添加' : '保存' }}
            </button>
            <button
              @click="handleClose"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
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
import { NSelect, NDatePicker, NInput } from 'naive-ui'
import { InterviewRound, InterviewForm, type Interview, type InterviewCreateRequest } from '@/types'

interface Props {
  open: boolean
  mode: 'add' | 'edit'
  positionId?: string
  initialData?: Interview | null
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'add',
  positionId: '',
  initialData: null
})

const emit = defineEmits(['update:open', 'submit'])

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
</script>
