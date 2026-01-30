<template>
  <main class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">
        {{ isEditMode ? '编辑总结' : '添加总结' }}
      </h1>
      <p class="text-gray-600 mt-1">
        {{ isEditMode ? '修改面试总结' : '记录面试心得，持续进步' }}
      </p>
    </div>

    <!-- 表单卡片 -->
    <div class="glass-card rounded-xl p-8">
      <form @submit.prevent="handleSubmit">
        
        <!-- 基础信息 -->
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
              面试轮次 <span class="text-gray-400">(可选)</span>
            </label>
            <select
              v-model="formData.round"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            >
              <option value="">请选择轮次</option>
              <option v-for="round in roundOptions" :key="round.value" :value="round.value">
                {{ round.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- 总结内容 -->
         <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">总结详情</h3>
            
            <div class="space-y-4">
                <div>
                     <label class="block text-sm font-medium text-gray-700 mb-2">
                      不足之处 <span class="text-red-500">*</span>
                    </label>
                    <textarea
                        v-model="contentData.weakness"
                        rows="3"
                        class="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        placeholder="记录面试中表现不足的地方..."
                    ></textarea>
                </div>

                 <div>
                     <label class="block text-sm font-medium text-gray-700 mb-2">
                      改进方向 <span class="text-red-500">*</span>
                    </label>
                     <textarea
                        v-model="contentData.improvements"
                        rows="3"
                        class="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        placeholder="针对不足之处，计划如何改进..."
                    ></textarea>
                </div>

                 <div>
                     <label class="block text-sm font-medium text-gray-700 mb-2">
                      面试官关注点 <span class="text-gray-400">(可选)</span>
                    </label>
                     <textarea
                        v-model="contentData.focus"
                        rows="2"
                        class="w-full px-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        placeholder="面试官特别关注的技术点或软技能..."
                    ></textarea>
                </div>
            </div>
         </div>

        <!-- 状态选择 -->
         <div class="mb-8">
            <label class="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" v-model="isCompleted" class="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary">
                <span class="text-gray-700">已完成改进</span>
            </label>
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
            <span v-if="submitting">保存中...</span>
            <span v-else>保存总结</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSummariesStore } from '@/store/summaries';
import type { SummaryCreateRequest } from '@/types';

const route = useRoute();
const router = useRouter();
const summariesStore = useSummariesStore();

const submitting = ref(false);

const roundOptions = [
  { label: '笔试', value: '笔试' },
  { label: '一面', value: '一面' },
  { label: '二面', value: '二面' },
  { label: '三面', value: '三面' },
  { label: '终面', value: '终面' },
  { label: 'HR面', value: 'HR面' },
];

// 表单数据绑定
const formData = reactive({
    companyName: '',
    positionName: '',
    round: '',
})

// 内容部分单独绑定，最后合并为 content JSON
const contentData = reactive({
    weakness: '',
    improvements: '',
    focus: '',
})

const isCompleted = ref(false)

const isEditMode = computed(() => !!route.query.id);

onMounted(async () => {
    if (isEditMode.value) {
        const id = route.query.id as string;
        const summary = await summariesStore.getSummaryById(id);
        if (summary) {
            formData.companyName = summary.companyName;
            formData.positionName = summary.positionName;
            formData.round = summary.round || '';
            
            // Parse content
            let contentObj: any = {};
            try {
                contentObj = typeof summary.content === 'string' ? JSON.parse(summary.content) : summary.content;
            } catch (e) {
                console.error('Failed to parse content', e);
            }

            contentData.weakness = contentObj.weakness || summary.weakness || '';
            contentData.improvements = contentObj.improvements || summary.improvements || '';
            contentData.focus = contentObj.focus || '';
            
             // Check status
             isCompleted.value = summary.status === 'completed';
        }
    }
})

async function handleSubmit() {
    if (!formData.companyName || !formData.positionName || !contentData.weakness || !contentData.improvements) {
        alert('请填写所有必填项'); // Simple alert for now, ideally use message provider like AddExperience
        return;
    }

    submitting.value = true;

    try {
        const content = JSON.stringify({
            weakness: contentData.weakness,
            improvements: contentData.improvements,
            focus: contentData.focus,
            status: isCompleted.value ? 'completed' : 'pending'
        });

        const payload: SummaryCreateRequest = {
            companyName: formData.companyName,
            positionName: formData.positionName,
            round: formData.round,
            content: content
        };

        if (isEditMode.value) {
             const id = route.query.id as string;
             await summariesStore.editSummary(id, { id, ...payload });
        } else {
            await summariesStore.addSummary(payload);
        }

        router.push('/summaries');
    } catch (error) {
        console.error(error);
        alert('保存失败');
    } finally {
        submitting.value = false;
    }
}

function handleCancel() {
    router.back();
}
</script>
