<template>
  <n-modal
    v-model:show="localOpen"
    :mask-closable="true"
    preset="card"
    title="更新投递状态"
    size="huge"
    :style="{ width: '600px' }"
    :segmented="{ content: 'soft', footer: 'soft' }"
    :auto-focus="false"
  >
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
                'peer-checked:border-red-500 peer-checked:bg-red-500': status.value === PositionStatus.REJECTED || status.value === PositionStatus.NOT_PASS
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
        <n-input
          v-model:value="form.remark"
          type="textarea"
          placeholder="记录状态变更的原因、备注等信息"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </div>

      <!-- 流程中状态提示 -->
      <n-alert
        v-if="form.status === PositionStatus.IN_PROCESS"
        type="info"
        :show-icon="true"
      >
        选择了"流程中"状态，建议添加面试记录以跟踪面试进度。
      </n-alert>
    </form>

    <template #footer>
      <div class="flex gap-3">
        <n-button
          size="large"
          @click="handleCancel"
          class="flex-1"
        >
          取消
        </n-button>
        <n-button
          type="primary"
          size="large"
          @click="handleSubmit"
          :disabled="!form.status"
          class="flex-1"
        >
          更新状态
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NModal, NInput, NButton, NAlert } from 'naive-ui'
import { PositionStatus } from '@/types'

interface Props {
  open: boolean
  currentStatus: PositionStatus
  positionId: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  positionId: ''
})

const emit = defineEmits(['update:open', 'submit'])

// 本地的 open 状态
const localOpen = ref(props.open)

// 同步 open 状态
watch(() => props.open, (newVal) => {
  localOpen.value = newVal
})

watch(localOpen, (newVal) => {
  emit('update:open', newVal)
})

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
watch(localOpen, (newVal) => {
  if (newVal) {
    form.value.status = props.currentStatus || PositionStatus.TO_BE_DELIVERED
    form.value.remark = ''
  }
})

const handleCancel = () => {
  localOpen.value = false
}

const handleSubmit = () => {
  if (!form.value.status) {
    return
  }

  emit('submit', {
    status: form.value.status,
    remark: form.value.remark || undefined
  })

  localOpen.value = false
}
</script>
