<template>
  <main class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20 space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">加载中...</p>
      </div>
    </div>

    <div v-else-if="summary">
      <!-- Nav -->
      <div class="flex items-center justify-between mb-6">
        <button @click="$router.back()" class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>返回</span>
        </button>
        <div class="flex items-center space-x-2">
          <button @click="handleEdit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm">
            编辑
          </button>
          <button @click="handleDelete" class="px-4 py-2 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm">
            删除
          </button>
        </div>
      </div>

      <!-- Main Card -->
      <div class="glass-card rounded-xl p-8">
        <!-- Header -->
        <div class="border-b border-gray-200 pb-6 mb-6">
           <div class="flex items-start justify-between">
              <div class="flex items-center space-x-4">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                    {{ summary.companyName.charAt(0) }}
                  </div>
                  <div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ summary.companyName }}</h1>
                    <div class="flex items-center space-x-3 text-sm text-gray-500">
                      <span class="font-medium text-gray-700">{{ summary.positionName }}</span>
                      <span class="px-2 py-0.5 bg-gray-100 rounded text-xs">{{ summary.interviewRound || '面试' }}</span>
                      <span>{{ formatDate(summary.date) }}</span>
                    </div>
                  </div>
              </div>
              <div class="px-3 py-1 rounded-full text-sm font-medium" :class="parsedContent.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                  {{ parsedContent.status === 'completed' ? '已改进' : '待改进' }}
              </div>
           </div>
        </div>

        <!-- Content -->
        <div class="space-y-8">
             <!-- Weakness -->
            <div>
                <h3 class="flex items-center text-lg font-semibold text-gray-900 mb-3">
                     <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    不足之处
                </h3>
                <div class="bg-red-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {{ parsedContent.weakness }}
                </div>
            </div>

            <!-- Improvements -->
            <div>
                <h3 class="flex items-center text-lg font-semibold text-gray-900 mb-3">
                     <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    改进方向
                </h3>
                  <div class="bg-green-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {{ parsedContent.improvements }}
                </div>
            </div>

             <!-- Focus -->
            <div v-if="parsedContent.focus">
                <h3 class="flex items-center text-lg font-semibold text-gray-900 mb-3">
                    <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    面试官关注点
                </h3>
                <div class="bg-blue-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {{ parsedContent.focus }}
                </div>
            </div>

             <!-- Remark -->
            <div v-if="parsedContent.remark">
                <h3 class="flex items-center text-lg font-semibold text-gray-900 mb-3">
                     <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                    备注
                </h3>
                <div class="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {{ parsedContent.remark }}
                </div>
            </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12 text-gray-500">
        未找到相关记录
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSummariesStore } from '@/store/summaries';
import type { Summary } from '@job-ai/shared';

const route = useRoute();
const router = useRouter();
const summariesStore = useSummariesStore();

const loading = ref(true);
const summary = ref<Summary | null>(null);

const parsedContent = computed(() => {
    if (!summary.value || !summary.value.content) return {};
    try {
        return typeof summary.value.content === 'string' 
            ? JSON.parse(summary.value.content) 
            : summary.value.content;
    } catch (e) {
        return {};
    }
});

onMounted(async () => {
    const id = route.query.id as string;
    if (id) {
        try {
            summary.value = await summariesStore.getSummaryById(id);
        } catch (e) {
            console.error(e);
        } finally {
            loading.value = false;
        }
    } else {
        loading.value = false;
    }
});

function formatDate(timestamp: number | undefined) {
    if (!timestamp) return '';
    return new Date(Number(timestamp)).toLocaleDateString('zh-CN');
}

function handleEdit() {
    if (summary.value) {
        router.push(`/add-summary?id=${summary.value.id}`);
    }
}

async function handleDelete() {
     if (!summary.value) return;
     if (confirm('确定要删除这条总结吗？')) {
         try {
             await summariesStore.deleteSummary(summary.value.id);
             router.push('/summaries');
         } catch (e) {
             alert('删除失败');
         }
     }
}
</script>
