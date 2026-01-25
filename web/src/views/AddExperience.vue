<template>
  <main class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">{{ isEditMode ? '编辑面经' : '添加面经' }}</h1>
      <p class="text-gray-600 mt-1">{{ isEditMode ? '修改面经信息' : '记录你的面试经历，帮助更多求职者' }}</p>
    </div>

    <!-- 表单卡片 -->
    <div class="glass-card rounded-xl p-8">
      <form @submit.prevent="handleSubmit">
        <!-- 关联岗位 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            关联岗位 <span class="text-gray-400">(可选)</span>
          </label>
          <select
            v-model="formData.positionId"
            @change="handleJobChange"
            class="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          >
            <option value="">不关联岗位</option>
            <option v-for="job in jobs" :key="job.id" :value="job.id">
              {{ job.companyName }} - {{ job.positionName }}
            </option>
          </select>
          <p class="mt-1 text-sm text-gray-500">选择岗位后，公司和岗位名称会自动填充</p>
        </div>

        <!-- 基本信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              公司名称 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.companyName"
              type="text"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="请输入公司名称"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              岗位名称 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.positionName"
              type="text"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="请输入岗位名称"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              面试轮次 <span class="text-red-500">*</span>
            </label>
            <n-select
              v-model:value="formData.interviewRound"
              :options="roundOptions"
              placeholder="请选择面试轮次"
              size="large"
              :theme-overrides="selectThemeOverrides"
              :consistent-menu-width="false"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              面试日期 <span class="text-red-500">*</span>
            </label>
            <n-date-picker
              v-model:value="interviewDateTimestamp"
              type="date"
              placeholder="请选择面试日期"
              size="large"
              :theme-overrides="datePickerThemeOverrides"
              @update:value="handleInterviewDateChange"
            />
          </div>
        </div>

        <!-- 面经内容 - 富文本编辑器 -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              面经内容 <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center space-x-2">
              <button
                type="button"
                @click="aiAssist"
                :disabled="aiLoading"
                class="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="aiLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <span>{{ aiLoading ? 'AI生成中...' : 'AI 辅助' }}</span>
              </button>
            </div>
          </div>

          <!-- 富文本编辑器 -->
          <div class="border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all duration-200">
            <!-- 工具栏 -->
            <div class="bg-gray-50 px-4 py-2 border-b border-border flex items-center gap-2 flex-wrap">
              <button
                type="button"
                @click="formatText('bold')"
                class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="粗体"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                </svg>
              </button>
              <button
                type="button"
                @click="formatText('italic')"
                class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="斜体"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-2 0v16m-4 0h8"></path>
                </svg>
              </button>
              <button
                type="button"
                @click="formatText('formatBlock', 'h2')"
                class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="标题"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
              <div class="w-px h-4 bg-gray-300"></div>
              <button
                type="button"
                @click="formatText('insertUnorderedList')"
                class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="无序列表"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <button
                type="button"
                @click="formatText('insertOrderedList')"
                class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="有序列表"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6h13M7 12h13M7 18h13M2 6h.01M2 12h.01M2 18h.01"></path>
                </svg>
              </button>
              <button
                type="button"
                @click="insertCodeBlock"
                class="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title="代码块"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </button>
            </div>

            <!-- 编辑区域 -->
            <div
              ref="editorRef"
              contenteditable="true"
              @input="updateContent"
              class="p-4 min-h-[300px] max-h-[500px] overflow-y-auto focus:outline-none prose prose-sm max-w-none"
              data-placeholder="支持富文本编辑，可以使用工具栏格式化内容..."
            ></div>
          </div>

          <p class="mt-2 text-sm text-gray-500">
            <svg class="w-4 h-4 text-yellow-500 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547z"></path>
            </svg>
            提示：可使用工具栏格式化内容，或点击"AI辅助"优化文章结构
          </p>
        </div>

        <!-- 标签 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            标签 <span class="text-gray-400">(可选)</span>
          </label>
          <input
            v-model="tagsInput"
            type="text"
            class="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            placeholder="多个标签用空格分隔，例如：Vue3 性能优化 源码"
          >
          <p class="mt-1 text-sm text-gray-500">建议添加技术栈、考察重点等标签</p>
        </div>

        <!-- 匿名开关 -->
        <div class="mb-8">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p class="font-medium text-gray-900">匿名发布</p>
                <p class="text-sm text-gray-500">开启后，其他用户无法看到你的个人信息</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="formData.isAnonymous" type="checkbox" class="sr-only peer" :value="1">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="flex items-center justify-end space-x-4">
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-2.5 rounded-lg border border-border text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{{ submitting ? '保存中...' : '保存面经' }}</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NSelect, NDatePicker, type SelectOption, SelectProps, DatePickerProps } from 'naive-ui'
import { useExperienceStore } from '@/store/experiences'
import { useJobsStore } from '@/store/jobs'
import type { ExperienceCreateRequest } from '@/types'

const route = useRoute()
const router = useRouter()
const experienceStore = useExperienceStore()
const jobsStore = useJobsStore()

const editorRef = ref<HTMLDivElement>()
const aiLoading = ref(false)
const submitting = ref(false)
const tagsInput = ref('')

// 面试轮次选项
const roundOptions: SelectOption[] = [
  { label: '笔试', value: '笔试' },
  { label: '一面', value: '一面' },
  { label: '二面', value: '二面' },
  { label: '三面', value: '三面' },
  { label: '终面', value: '终面' },
  { label: 'HR面', value: 'HR面' }
]

// NSelect 主题覆盖 - 使其与现有输入框风格一致
const selectThemeOverrides: NonNullable<SelectProps['themeOverrides']> = {
  menuBoxShadow: '0 0 2px #3b82f6',
  peers: {
    InternalSelection: {
      border: '1px solid #E2E8F0',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      height: '48px',
      color: '#fff',
      caretColor: '#0369A1',
      borderFocus: '1px solid #0369A1',
      borderHover: '1px solid #0369A1',
      borderActive: '1px solid var(--primary)',
      boxShadowFocus: '0 0 0 2px rgba(14, 165, 233, 0.2)',
      textColor: '#1E293B',
      placeholderColor: '#9CA3AF'
    }
  }
}

// NDatePicker 主题覆盖
const datePickerThemeOverrides: NonNullable<DatePickerProps['themeOverrides']> = {
  peers: {
    Input: {
      borderRadius: '0.5rem',
      borderHover: '',
      borderFocus: '',
      boxShadowFocus: '0 0 2px var(--secondary)',
    }
  }
}

// 表单数据
const formData = ref<ExperienceCreateRequest>({
  companyName: '',
  positionName: '',
  interviewRound: '',
  interviewDate: '',
  content: '',
  contentType: 'html',
  tags: [],
  isAnonymous: 1
})

// 面试日期的时间戳格式(用于 n-date-picker)
const interviewDateTimestamp = ref<number>(Date.now())

// 岗位列表
const jobs = computed(() => jobsStore.jobs)

// 是否为编辑模式
const isEditMode = computed(() => !!route.query.id || !!route.params.id)

/**
 * 初始化
 */
onMounted(async () => {
  // 设置默认日期为当前时间戳
  interviewDateTimestamp.value = Date.now()
  formData.value.interviewDate = new Date().toISOString().split('T')[0]

  // 加载岗位列表
  await jobsStore.fetchJobs()

  // 如果是编辑模式，加载数据
  if (isEditMode.value) {
    const id = Number(route.query.id || route.params.id)
    await experienceStore.fetchExperienceById(id)

    if (experienceStore.currentExperience) {
      const exp = experienceStore.currentExperience
      formData.value = {
        companyName: exp.companyName,
        positionName: exp.positionName,
        interviewRound: exp.interviewRound,
        interviewDate: exp.interviewDate.split(' ')[0],
        content: exp.content,
        contentType: exp.contentType,
        tags: exp.tags,
        isAnonymous: exp.isAnonymous
      }
      tagsInput.value = exp.tags.join(' ')

      // 将日期字符串转换为时间戳
      const dateParts = exp.interviewDate.split(' ')[0].split('-')
      interviewDateTimestamp.value = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2])
      ).getTime()

      // 设置编辑器内容
      if (editorRef.value) {
        editorRef.value.innerHTML = exp.content
      }
    }
  }

  // 从路由参数获取岗位ID
  if (route.query.jobId) {
    formData.value.positionId = route.query.jobId as string
    await handleJobChange()
  }
})

/**
 * 岗位改变处理
 */
async function handleJobChange() {
  if (formData.value.positionId) {
    const job = jobs.value.find(j => j.id === formData.value.positionId)
    if (job) {
      formData.value.companyName = job.companyName
      formData.value.positionName = job.positionName
    }
  }
}

/**
 * 面试日期改变处理
 */
function handleInterviewDateChange(timestamp: number) {
  interviewDateTimestamp.value = timestamp
  // 将时间戳转换为日期字符串 YYYY-MM-DD
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  formData.value.interviewDate = `${year}-${month}-${day}`
}

/**
 * 更新内容
 */
function updateContent() {
  if (editorRef.value) {
    formData.value.content = editorRef.value.innerHTML
  }
}

/**
 * 格式化文本
 */
function formatText(command: string, value?: string) {
  document.execCommand(command, false, value)
  if (editorRef.value) {
    editorRef.value.focus()
    updateContent()
  }
}

/**
 * 插入代码块
 */
function insertCodeBlock() {
  const code = prompt('请输入代码:')
  if (code && editorRef.value) {
    const pre = document.createElement('pre')
    const codeEl = document.createElement('code')
    codeEl.textContent = code
    pre.appendChild(codeEl)
    editorRef.value.appendChild(pre)
    updateContent()
  }
}

/**
 * AI辅助生成内容
 */
async function aiAssist() {
  if (!confirm('AI辅助将覆盖现有内容，是否继续？')) {
    return
  }

  aiLoading.value = true

  try {
    // 模拟AI生成
    await new Promise(resolve => setTimeout(resolve, 1500))

    const aiContent = `
<h2>面试概述</h2>
<p>本次面试主要考察核心技术能力和项目经验，面试官非常专业。</p>

<h2>具体问题</h2>

<h3>1. 技术基础</h3>
<p>考察对基础知识的理解程度。</p>

<h3>2. 项目经验</h3>
<p>详细介绍之前的项目经历，包括技术选型和实现细节。</p>

<h3>3. 算法题</h3>
<pre><code>// 代码示例
function solution() {
  // TODO
}
</code></pre>

<h2>面试感受</h2>
<p>整体面试体验良好，建议加强基础知识。</p>

<h2>后续安排</h2>
<p>面试结束后3个工作日内会通知结果。</p>
`

    if (editorRef.value) {
      editorRef.value.innerHTML = aiContent
      updateContent()
    }
  } catch (error) {
    console.error('AI生成失败:', error)
  } finally {
    aiLoading.value = false
  }
}

/**
 * 提交表单
 */
async function handleSubmit() {
  // 表单验证
  if (!formData.value.companyName || !formData.value.positionName || !formData.value.interviewRound || !formData.value.interviewDate) {
    alert('请填写所有必填项')
    return
  }

  if (!editorRef.value?.textContent.trim()) {
    alert('请填写面经内容')
    return
  }

  // 处理标签
  formData.value.tags = tagsInput.value ? tagsInput.value.split(' ').filter(tag => tag.trim()) : []

  submitting.value = true

  try {
    if (isEditMode.value) {
      const id = Number(route.query.id || route.params.id)
      await experienceStore.updateExperience(id, {
        id,
        ...formData.value
      })
    } else {
      await experienceStore.createExperience(formData.value)
    }

    alert(isEditMode.value ? '更新成功！' : '保存成功！')
    router.push('/experiences')
  } catch (error) {
    console.error('操作失败:', error)
    alert('操作失败，请重试')
  } finally {
    submitting.value = false
  }
}

/**
 * 取消
 */
function handleCancel() {
  if (formData.value.content || formData.value.companyName) {
    if (!confirm('确定要取消吗？未保存的内容将丢失。')) {
      return
    }
  }
  router.back()
}
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

[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #94A3B8;
  pointer-events: none;
}
</style>
