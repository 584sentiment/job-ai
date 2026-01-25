<template>
  <n-modal
    v-model:show="localOpen"
    :mask-closable="true"
    preset="card"
    :title="mode === 'add' ? '添加面试记录' : '编辑面试记录'"
    size="huge"
    :style="{ width: '600px' }"
    :segmented="{ content: 'soft', footer: 'soft' }"
    :auto-focus="false"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 面试轮次 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          面试轮次 <span class="text-red-500">*</span>
        </label>
        <n-select
          v-model:value="form.interviewRound"
          :options="roundOptions"
          placeholder="请选择面试轮次"
          :consistent-menu-width="false"
          size="large"
          class="w-full"
        />
      </div>

      <!-- 面试时间 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          面试时间 <span class="text-red-500">*</span>
        </label>
        <n-date-picker
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
        <n-input
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
        <n-select
          v-model:value="form.interviewForm"
          :options="formOptions"
          placeholder="请选择面试形式"
          :consistent-menu-width="false"
          size="large"
          class="w-full"
        />
      </div>

      <!-- 面试官信息 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">面试官信息</label>
        <n-input
          v-model:value="form.interviewerInfo"
          type="text"
          placeholder="例如:张经理（技术总监）"
          size="large"
        />
      </div>

      <!-- 备注 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
        <n-input
          v-model:value="form.remarks"
          type="textarea"
          placeholder="面试注意事项、准备材料等"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </div>
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
          :disabled="!isFormValid"
          class="flex-1"
        >
          {{ mode === 'add' ? '添加' : '保存' }}
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { NModal, NSelect, NDatePicker, NInput, NButton } from 'naive-ui'
import { InterviewRound, InterviewForm, type Interview, type InterviewCreateRequest } from '@/types'

interface Props {
  open: boolean
  mode: 'add' | 'edit'
  positionId: string
  initialData?: Interview | null
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'add',
  initialData: null
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
watch(localOpen, (newVal) => {
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

const handleCancel = () => {
  localOpen.value = false
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
  localOpen.value = false
}
</script>
