<template>
  <n-message-provider>
    <n-dialog-provider>
      <main class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20">
        <!-- 页面标题 -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold">
            {{ isEditMode ? '编辑面经' : '添加面经' }}
          </h1>
          <p class="text-gray-600 mt-1">
            {{
              isEditMode ? '修改面经信息' : '记录你的面试经历，帮助更多求职者'
            }}
          </p>
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
              <p class="mt-1 text-sm text-gray-500">
                选择岗位后，公司和岗位名称会自动填充
              </p>
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
                />
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
                />
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
              <label class="block text-sm font-medium text-gray-700 mb-2">
                面经内容 <span class="text-red-500">*</span>
              </label>

              <!-- AI 辅助功能卡片 -->
              <div
                class="mb-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-3 flex-1">
                    <div class="flex-shrink-0">
                      <div
                        class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center"
                      >
                        <svg
                          class="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="font-semibold text-gray-800 text-sm mb-1">
                        AI 智能生成面经
                      </div>
                      <p class="text-xs text-gray-600 leading-relaxed">
                        填写基本信息后，AI
                        将为你生成结构化的面经模板，包含面试流程、具体问题、面试感受等模块
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="aiAssist"
                    :disabled="aiLoading"
                    class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    <svg
                      v-if="aiLoading"
                      class="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                    <span>{{ aiLoading ? '生成中...' : '开始生成' }}</span>
                  </button>
                </div>
              </div>

              <!-- Tiptap 富文本编辑器 -->
              <TiptapEditor
                v-model="formData.content"
                placeholder="支持富文本编辑，可以使用工具栏格式化内容..."
              />

              <p class="mt-2 text-xs text-gray-500">
                💡
                支持富文本编辑，可使用工具栏格式化内容。生成的面经模板可以根据实际情况修改和完善。
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
              />
              <p class="mt-1 text-sm text-gray-500">
                建议添加技术栈、考察重点等标签
              </p>
            </div>

            <!-- 匿名开关 -->
            <div class="mb-8">
              <div
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <div>
                    <p class="font-medium text-gray-900">匿名发布</p>
                    <p class="text-sm text-gray-500">
                      开启后，其他用户无法看到你的个人信息
                    </p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="formData.isAnonymous"
                    type="checkbox"
                    class="sr-only peer"
                    :value="1"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  ></div>
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
                <svg
                  v-if="submitting"
                  class="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>{{ submitting ? '保存中...' : '保存面经' }}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </n-dialog-provider>
  </n-message-provider>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NSelect,
  NDatePicker,
  NMessageProvider,
  NDialogProvider,
  useMessage,
  useDialog,
  type SelectOption,
  SelectProps,
  DatePickerProps,
} from 'naive-ui';
import { useExperienceStore } from '@/store/experiences';
import { useJobsStore } from '@/store/jobs';
import type { ExperienceCreateRequest } from '@job-ai/shared';
import aiApi from '@/api/ai';
import TiptapEditor from '@/components/TiptapEditor.vue';

const route = useRoute();
const router = useRouter();
const experienceStore = useExperienceStore();
const jobsStore = useJobsStore();
const message = useMessage();
const dialog = useDialog();

const tiptapEditorRef = ref<InstanceType<typeof TiptapEditor> | null>(null);
const aiLoading = ref(false);
const submitting = ref(false);
const tagsInput = ref('');

// 面试轮次选项
const roundOptions: SelectOption[] = [
  { label: '笔试', value: '笔试' },
  { label: '一面', value: '一面' },
  { label: '二面', value: '二面' },
  { label: '三面', value: '三面' },
  { label: '终面', value: '终面' },
  { label: 'HR面', value: 'HR面' },
];

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
      placeholderColor: '#9CA3AF',
    },
  },
};

// NDatePicker 主题覆盖
const datePickerThemeOverrides: NonNullable<DatePickerProps['themeOverrides']> =
  {
    peers: {
      Input: {
        borderRadius: '0.5rem',
        borderHover: '',
        borderFocus: '',
        boxShadowFocus: '0 0 2px var(--secondary)',
      },
    },
  };

// 表单数据
const formData = ref<ExperienceCreateRequest>({
  companyName: '',
  positionName: '',
  interviewRound: '',
  interviewDate: '',
  content: '',
  contentType: 'html',
  tags: [],
  isAnonymous: 1,
});

// 面试日期的时间戳格式(用于 n-date-picker)
const interviewDateTimestamp = ref<number>(Date.now());

// 岗位列表
const jobs = computed(() => jobsStore.jobs);

// 是否为编辑模式
const isEditMode = computed(() => !!route.query.id || !!route.params.id);

/**
 * 初始化
 */
onMounted(async () => {
  // 设置默认日期为当前时间戳
  interviewDateTimestamp.value = Date.now();
  formData.value.interviewDate = new Date().toISOString().split('T')[0];

  // 加载岗位列表
  await jobsStore.fetchJobs();

  // 如果是编辑模式，加载数据
  if (isEditMode.value) {
    const id = (route.query.id || route.params.id) as string;
    await experienceStore.fetchExperienceById(id);

    if (experienceStore.currentExperience) {
      const exp = experienceStore.currentExperience;
      formData.value = {
        companyName: exp.companyName,
        positionName: exp.positionName,
        interviewRound: exp.interviewRound,
        interviewDate: exp.interviewDate.split(' ')[0],
        content: exp.content,
        contentType: exp.contentType,
        tags: exp.tags,
        isAnonymous: exp.isAnonymous,
      };
      tagsInput.value = exp.tags.join(' ');

      // 将日期字符串转换为时间戳
      const dateParts = exp.interviewDate.split(' ')[0].split('-');
      interviewDateTimestamp.value = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2]),
      ).getTime();

      // 设置编辑器内容
      formData.value.content = exp.content;
    }
  }

  // 从路由参数获取岗位ID
  if (route.query.jobId) {
    formData.value.positionId = route.query.jobId as string;
    await handleJobChange();
  }
});

/**
 * 岗位改变处理
 */
async function handleJobChange() {
  if (formData.value.positionId) {
    const job = jobs.value.find(j => j.id === formData.value.positionId);
    if (job) {
      formData.value.companyName = job.companyName;
      formData.value.positionName = job.positionName;
    }
  }
}

/**
 * 面试日期改变处理
 */
function handleInterviewDateChange(timestamp: number) {
  interviewDateTimestamp.value = timestamp;
  // 将时间戳转换为日期字符串 YYYY-MM-DD
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  formData.value.interviewDate = `${year}-${month}-${day}`;
}

/**
 * AI辅助生成内容
 */
async function aiAssist() {
  // 验证必填字段
  if (
    !formData.value.companyName ||
    !formData.value.positionName ||
    !formData.value.interviewRound ||
    !formData.value.interviewDate
  ) {
    message.warning(
      '请先填写公司名称、岗位名称、面试轮次和面试日期，AI将根据这些信息生成面经模板',
    );
    return;
  }

  // 检查是否有已存在的内容
  const hasContent = formData.value.content && formData.value.content.trim().length > 0;

  // 提取数据用于对话框显示
  const companyName = formData.value.companyName;
  const positionName = formData.value.positionName;
  const interviewRound = formData.value.interviewRound;
  const interviewDate = formData.value.interviewDate;

  // 显示友好的AI说明对话框
  dialog.create({
    type: 'warning',
    title: 'AI 智能生成面经',
    content:
      '🤖 AI 将根据以下信息生成面经模板：\n\n公司：' +
      companyName +
      '\n岗位：' +
      positionName +
      '\n轮次：' +
      interviewRound +
      '\n日期：' +
      interviewDate +
      (hasContent
        ? '\n\n⚠️ 检测到编辑器中已有内容，生成后将覆盖现有内容'
        : '') +
      '\n\n💡 提示：AI 生成的是结构化模板，你可以根据实际情况修改和完善',
    positiveText: '开始生成',
    negativeText: '取消',
    onPositiveClick: async () => {
      await performAIGeneration(hasContent);
    },
  });
}

/**
 * 执行 AI 生成
 */
async function performAIGeneration(hasContent: boolean) {
  aiLoading.value = true;

  try {
    // 调用真实 API 生成面经内容
    const response = await aiApi.generateExperienceContent({
      companyName: formData.value.companyName,
      positionName: formData.value.positionName,
      interviewRound: formData.value.interviewRound,
      interviewDate: formData.value.interviewDate,
      existingContent: hasContent ? formData.value.content : undefined,
    });

    if (response && response.content) {
      formData.value.content = response.content;
      message.success('✨ AI 生成成功！请根据实际情况修改和完善内容', {
        duration: 3000,
      });

      // 滚动到编辑器位置
      setTimeout(() => {
        const editorElement = document.querySelector('.tiptap-editor');
        editorElement?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    } else {
      throw new Error('AI返回内容为空');
    }
  } catch (error: any) {
    console.error('AI生成失败:', error);

    // 根据错误类型显示不同的提示
    if (error.message?.includes('401') || error.message?.includes('403')) {
      message.error('登录已过期，请重新登录后重试');
    } else if (error.message?.includes('500')) {
      message.error('AI服务暂时不可用，请稍后重试');
    } else if (error.message?.includes('timeout')) {
      message.error('AI生成超时，请稍后重试');
    } else {
      message.error('AI生成失败：' + (error.message || '未知错误'));
    }

    // 降级方案：使用预设模板
    const fallbackTemplate = generateFallbackTemplate();
    formData.value.content = fallbackTemplate;
  } finally {
    aiLoading.value = false;
  }
}

/**
 * 生成降级模板（当AI服务不可用时使用）
 */
function generateFallbackTemplate(): string {
  const { companyName, positionName, interviewRound, interviewDate } =
    formData.value;

  return (
    '<h2>面试概述</h2>' +
    '<p>2024年' +
    interviewDate +
    '，我参加了' +
    companyName +
    '的' +
    positionName +
    '岗位' +
    interviewRound +
    '。以下是本次面试的详细记录。</p>' +
    '<h2>面试流程</h2>' +
    '<ul>' +
    '  <li>自我介绍（3-5分钟）</li>' +
    '  <li>项目经验深挖</li>' +
    '  <li>技术基础考察</li>' +
    '  <li>算法/编程题</li>' +
    '  <li>HR交流（如果是终面或HR面）</li>' +
    '</ul>' +
    '<h2>具体问题</h2>' +
    '<h3>1. 技术基础</h3>' +
    '<p>请描述面试官考察的技术知识点：</p>' +
    '<ul>' +
    '  <li>问题1：</li>' +
    '  <li>问题2：</li>' +
    '  <li>问题3：</li>' +
    '</ul>' +
    '<h3>2. 项目经验</h3>' +
    '<p>请描述面试官对项目的提问：</p>' +
    '<ul>' +
    '  <li>项目背景和技术选型</li>' +
    '  <li>遇到的难点和解决方案</li>' +
    '  <li>项目亮点和成果</li>' +
    '</ul>' +
    '<h3>3. 算法/编程题</h3>' +
    '<pre><code>// 请在这里记录算法题和你的解答\n' +
    'function solution() {\n' +
    '  // TODO\n' +
    '}\n' +
    '</code></pre>' +
    '<h2>面试感受</h2>' +
    '<p>请描述你的面试感受，包括面试官的态度、面试难度等。</p>' +
    '<h2>后续安排</h2>' +
    '<p>请记录面试后的安排，如复试时间、结果通知时间等。</p>' +
    '<h2>建议</h2>' +
    '<p>给其他求职者的建议...</p>'
  );
}

/**
 * 提交表单
 */
async function handleSubmit() {
  // 表单验证
  if (
    !formData.value.companyName ||
    !formData.value.positionName ||
    !formData.value.interviewRound ||
    !formData.value.interviewDate
  ) {
    message.warning('请填写所有必填项');
    return;
  }

  // 检查内容是否为空（移除HTML标签后检查）
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = formData.value.content;
  if (!tempDiv.textContent?.trim()) {
    message.warning('请填写面经内容');
    return;
  }

  // 处理标签
  formData.value.tags = tagsInput.value
    ? tagsInput.value.split(' ').filter(tag => tag.trim())
    : [];

  submitting.value = true;

  try {
    if (isEditMode.value) {
      const id = (route.query.id || route.params.id) as string;
      await experienceStore.updateExperience(id, {
        id,
        ...formData.value,
      });
    } else {
      await experienceStore.createExperience(formData.value);
    }

    message.success(isEditMode.value ? '更新成功！' : '保存成功！');
    setTimeout(() => {
      router.push('/experiences');
    }, 500);
  } catch (error: any) {
    console.error('操作失败:', error);
    message.error(error.message || '操作失败，请重试');
  } finally {
    submitting.value = false;
  }
}

/**
 * 取消
 */
function handleCancel() {
  const hasContent = formData.value.content || formData.value.companyName;

  if (!hasContent) {
    router.back();
    return;
  }

  dialog.create({
    type: 'warning',
    title: '确认取消',
    content: '确定要取消吗？未保存的内容将丢失。',
    positiveText: '确定取消',
    negativeText: '继续编辑',
    onPositiveClick: () => {
      router.back();
    },
  });
}
</script>
