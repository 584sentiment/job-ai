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
            <DialogTitle class="text-lg font-semibold text-gray-900">更新投递状态</DialogTitle>
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
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- 投递状态 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  选择新状态 <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                        'peer-checked:border-red-500 peer-checked:bg-red-500': status.value === PositionStatus.NOT_PASS || status.value === PositionStatus.REJECTED
                      }"
                    >
                      {{ status.label }}
                    </div>
                  </label>
                </div>
              </div>

              <!-- 状态备注 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">状态备注（可选）</label>
                <textarea
                  v-model="form.remark"
                  rows="3"
                  placeholder="记录状态变更的原因、备注等信息"
                  class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none"
                ></textarea>
              </div>

              <!-- 流程中状态提示 -->
              <div
                v-if="form.status === PositionStatus.IN_PROCESS"
                class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm text-blue-700">选择了"流程中"状态，建议添加面试记录以跟踪面试进度。</p>
              </div>
            </form>
          </div>

          <!-- 对话框底部按钮 -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 border-t border-gray-200">
            <button
              @click="handleSubmit"
              type="button"
              :disabled="!form.status"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              更新状态
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
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { PositionStatus } from '@/types'

interface Props {
  open: boolean
  currentStatus: PositionStatus
  positionId?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  positionId: ''
})

const emit = defineEmits(['update:open', 'submit'])

// 表单数据
const form = ref({
  status: props.currentStatus || PositionStatus.TO_BE_DELIVERED,
  remark: ''
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

// 对话框打开时初始化状态
watch(() => props.open, (newVal) => {
  if (newVal) {
    form.value.status = props.currentStatus || PositionStatus.TO_BE_DELIVERED
    form.value.remark = ''
  }
})

const handleClose = () => {
  emit('update:open', false)
}

const handleSubmit = () => {
  if (!form.value.status) {
    return
  }

  emit('submit', {
    status: form.value.status,
    remark: form.value.remark || undefined
  })

  emit('update:open', false)
}
</script>
