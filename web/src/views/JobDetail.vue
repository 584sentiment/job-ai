<template>
  <main v-if="loading" class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">加载中...</p>
      </div>
    </div>
  </main>

  <main v-else-if="job" class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
    <!-- 顶部导航栏 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link to="/" class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </router-link>
        <h1 class="text-xl font-semibold">岗位详情</h1>
      </div>
      <div class="flex items-center space-x-2">
        <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
        </button>
        <button
          @click="deleteJob"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-red-500"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 岗位基本信息卡片 -->
    <div class="glass-card rounded-xl p-6">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center space-x-4">
          <div
            class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl"
          >
            {{ job.companyName?.charAt(0) || '?' }}
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ job.companyName }}</h2>
            <p class="text-gray-600 text-lg">{{ job.positionName }}</p>
            <div class="flex items-center space-x-2 mt-1">
              <span
                class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
              >
                {{ getStatusLabel(job.status) }}
              </span>
              <span class="text-sm text-gray-500">{{ formatDate(job.deliveryDate) }} 投递</span>
            </div>
          </div>
        </div>
        <button
          @click="openEditDialog"
          class="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span>编辑</span>
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="flex items-center space-x-2 text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>{{ job.workLocation }}</span>
        </div>
        <div class="flex items-center space-x-2 text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ job.salaryRange }}</span>
        </div>
        <div class="flex items-center space-x-2 text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          <span>{{ job.deliveryChannel }}</span>
        </div>
        <div class="flex items-center space-x-2 text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>简历v2.0</span>
        </div>
      </div>

      <!-- 联系人信息 -->
      <div v-if="job.contactName || job.contactPhone" class="pt-4 border-t border-border">
        <div class="flex items-center space-x-2 mb-3">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <h3 class="text-sm font-semibold text-gray-700">联系人信息</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="job.contactName" class="flex items-center space-x-2 text-sm text-gray-600">
            <span class="text-gray-500">姓名：</span>
            <span class="font-medium text-gray-900">{{ job.contactName }}</span>
          </div>
          <div v-if="job.contactPhone" class="flex items-center space-x-2 text-sm text-gray-600">
            <span class="text-gray-500">电话：</span>
            <a
              :href="`tel:${job.contactPhone}`"
              class="font-medium text-primary hover:text-secondary transition-colors duration-200"
            >
              {{ job.contactPhone }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 投递进度 Timeline -->
    <div class="glass-card rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold">投递进度</h3>
        <button
          @click="openAddInterviewDialog"
          class="text-primary hover:text-secondary font-medium text-sm flex items-center space-x-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>添加记录</span>
        </button>
      </div>

      <div class="relative pl-6 space-y-6">
        <div class="timeline-line"></div>

        <div
          v-for="(item, index) in timeline"
          :key="index"
          class="timeline-item relative group"
          :class="{ 'cursor-pointer hover:bg-gray-50 rounded-lg -mx-2 px-2 py-1 transition-colors duration-200': item.recordId }"
          @click="item.recordId ? openEditInterviewDialog(job?.interviewRecordList?.find((r: Interview) => r.id === item.recordId)!) : undefined"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="font-medium">{{ item.status }}</p>
              <p class="text-sm text-gray-600 mt-1 whitespace-pre-line">{{ item.desc }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">{{ item.date }}</span>
              <!-- 删除按钮（hover 显示） -->
              <button
                v-if="item.recordId"
                @click.stop="handleDeleteRecord(item.recordId)"
                class="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all duration-200 text-red-500"
                title="删除记录"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 关联信息区 -->
    <div class="space-y-4">
      <!-- 关联面经 -->
      <div class="glass-card rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h3 class="text-lg font-semibold">关联面经</h3>
          </div>
          <button class="text-primary hover:text-secondary font-medium text-sm flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>查看全部</span>
          </button>
        </div>

        <!-- 空状态 -->
        <div v-if="!job.relatedExperiences || job.relatedExperiences?.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-gray-500 mb-2">暂无关联面经</p>
          <p class="text-sm text-gray-400">可以添加该岗位相关的面试经验记录</p>
        </div>

        <!-- 面经列表 -->
        <div v-else class="space-y-3">
          <div
            v-for="exp in job.relatedExperiences.slice(0, 3)"
            :key="exp.id"
            class="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors duration-200 cursor-pointer"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  {{ exp.position }}
                </span>
                <span class="text-sm text-gray-600">{{ formatDate(exp.date) }}</span>
              </div>
              <button class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            <p class="text-sm font-medium text-gray-900 mb-1">{{ exp.title }}</p>
            <p class="text-sm text-gray-700 line-clamp-2">{{ exp.summary }}</p>
            <div v-if="exp.tags && exp.tags.length" class="flex flex-wrap gap-1 mt-2">
              <span v-for="tag in exp.tags" :key="tag" class="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 查看更多提示 -->
          <div v-if="job.relatedExperiences.length > 3" class="text-center pt-2">
            <button class="text-sm text-primary hover:text-secondary font-medium">
              查看全部 {{ job.relatedExperiences.length }} 条面经 →
            </button>
          </div>
        </div>
      </div>

      <!-- 面试总结 -->
      <div class="glass-card rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="text-lg font-semibold">面试总结</h3>
          </div>
          <button class="text-primary hover:text-secondary font-medium text-sm flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>添加总结</span>
          </button>
        </div>

        <!-- 空状态 -->
        <div v-if="!job.summaries || job.summaries?.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012 2m0 0h2a2 2 0 012 2"></path>
          </svg>
          <p class="text-gray-500 mb-2">暂无面试总结</p>
          <p class="text-sm text-gray-400">记录每轮面试的得失，助力后续改进</p>
        </div>

        <!-- 总结列表 -->
        <div v-else class="space-y-4">
          <div
            v-for="summary in job.summaries.slice(0, 2)"
            :key="summary.id"
            class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {{ summary.round }}
                </span>
                <span class="text-sm text-gray-600">{{ formatDate(summary.date) }}</span>
              </div>
            </div>
            <p class="text-sm text-gray-700 line-clamp-3 mb-2">{{ summary.content }}</p>
            <div v-if="summary.highlights && summary.highlights.length" class="mb-2">
              <p class="text-xs font-medium text-gray-700 mb-1">亮点：</p>
              <ul class="text-xs text-gray-600 space-y-1">
                <li v-for="item in summary.highlights.slice(0, 2)" :key="item" class="flex items-start">
                  <span class="text-green-500 mr-1">✓</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
            <div v-if="summary.improvements && summary.improvements.length">
              <p class="text-xs font-medium text-gray-700 mb-1">改进点：</p>
              <ul class="text-xs text-gray-600 space-y-1">
                <li v-for="item in summary.improvements.slice(0, 2)" :key="item" class="flex items-start">
                  <span class="text-orange-500 mr-1">•</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- 查看更多提示 -->
          <div v-if="job.summaries.length > 2" class="text-center pt-2">
            <button class="text-sm text-primary hover:text-secondary font-medium">
              查看全部 {{ job.summaries.length }} 条总结 →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="flex gap-3 pb-4">
      <button
        @click="openStatusDialog"
        class="flex-1 px-4 py-3 bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
        </svg>
        <span>更新状态</span>
      </button>
      <button
        @click="openAddInterviewDialog"
        class="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary shadow-md hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span>添加面试</span>
      </button>
    </div>
  </main>

  <div v-else class="pt-20 px-4 text-center text-gray-500">
    <p>岗位不存在或已被删除</p>
    <router-link to="/" class="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200">
      返回首页
    </router-link>
  </div>

  <!-- 编辑对话框 -->
  <Dialog as="div" class="relative z-50" :open="isEditDialogOpen" @close="closeEditDialog">
    <!-- 背景遮罩 -->
    <div class="fixed inset-0 bg-black/30 transition-opacity" aria-hidden="true"></div>

    <!-- 对话框容器 -->
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <!-- 对话框头部 -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 flex items-center justify-between border-b border-gray-200">
            <DialogTitle class="text-lg font-semibold text-gray-900">编辑岗位</DialogTitle>
            <button
              @click="closeEditDialog"
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
            <JobForm
              v-if="isEditDialogOpen"
              mode="edit"
              :initial-data="job"
              :on-cancel="closeEditDialog"
              @submit="handleEditSubmit"
            />
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>

  <!-- 删除确认对话框 -->
  <Dialog as="div" class="relative z-50" :open="isDeleteDialogOpen" @close="closeDeleteDialog">
    <!-- 背景遮罩 -->
    <div class="fixed inset-0 bg-black/30 transition-opacity" aria-hidden="true"></div>

    <!-- 对话框容器 -->
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <!-- 对话框内容 -->
          <div class="px-4 py-5 sm:p-6">
            <!-- 警告图标 -->
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>

            <!-- 对话框标题和描述 -->
            <div class="text-center">
              <DialogTitle as="h3" class="text-lg font-semibold text-gray-900 mb-2">
                确认删除岗位
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  您确定要删除这个岗位吗？此操作无法撤销，所有相关数据将被永久删除。
                </p>
              </div>
            </div>
          </div>

          <!-- 对话框底部按钮 -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 border-t border-gray-200">
            <button
              @click="handleDeleteConfirm"
              type="button"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
            >
              确认删除
            </button>
            <button
              @click="closeDeleteDialog"
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

  <!-- 面试记录对话框 -->
  <InterviewRecordDialog
    v-model:open="isInterviewDialogOpen"
    :mode="editingRecord ? 'edit' : 'add'"
    :position-id="jobId"
    :initial-data="editingRecord"
    @submit="handleInterviewSubmit"
  />

  <!-- 状态更新对话框 -->
  <StatusUpdateDialog
    v-model:open="isStatusDialogOpen"
    :current-status="job?.status || PositionStatus.TO_BE_DELIVERED"
    :position-id="jobId"
    @submit="handleStatusUpdate"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '@/store/jobs'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import JobForm from '@/components/JobForm.vue'
import InterviewRecordDialog from '@/components/InterviewRecordDialog.vue'
import StatusUpdateDialog from '@/components/StatusUpdateDialog.vue'
import { getStatusLabel } from '@/constants/position'
import { formatDate } from '@/utils/mappers'
import * as positionApi from '@/api/position'
import { PositionStatus, type Interview, type InterviewCreateRequest } from '@/types'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()

// 编辑对话框状态
const isEditDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)  // 删除确认对话框状态
const jobDetail = ref<any>(null)  // 从 API 获取的岗位详情
const loading = ref(false)   // 加载状态

// 面试记录对话框状态
const isInterviewDialogOpen = ref(false)
const isStatusDialogOpen = ref(false)
const editingRecord = ref<Interview | null>(null)

// 获取路由参数中的岗位 ID,确保是 string 类型
const jobId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : id
})

// 优先使用 API 获取的详情，如果没有则使用 store 中的数据
const job = computed(() => {
  return jobDetail.value || jobsStore.getJobById(jobId.value)
})

// 计算属性：将面试记录转换为时间线格式
const timeline = computed(() => {
  if (!job.value?.interviewRecordList || job.value.interviewRecordList.length === 0) {
    // 如果没有面试记录，显示投递进度
    return [
      {
        status: '已投递',
        date: formatDate(job.value?.deliveryDate) || '',
        desc: '简历已投递，等待回复',
        recordId: null
      }
    ]
  }

  // 将面试记录转换为时间线格式
  return job.value.interviewRecordList.map((record: Interview) => ({
    status: record.interviewRound,
    date: formatDate(record.interviewTime) || '',
    desc: `面试地点：${record.interviewLocation}\n面试形式：${record.interviewForm}`,
    recordId: record.id  // 添加记录 ID 用于编辑和删除
  }))
})

const deleteJob = () => {
  // 打开删除确认对话框
  isDeleteDialogOpen.value = true
}

// 确认删除
const handleDeleteConfirm = async () => {
  try {
    await jobsStore.deleteJob(jobId.value)
    // 删除成功后跳转到首页
    router.push('/')
  } catch (error) {
    console.error('删除岗位失败:', error)
    alert('删除岗位失败，请重试')
  }
}

// 打开编辑对话框
const openEditDialog = () => {
  isEditDialogOpen.value = true
}

// 关闭编辑对话框
const closeEditDialog = () => {
  isEditDialogOpen.value = false
}

// 关闭删除对话框
const closeDeleteDialog = () => {
  isDeleteDialogOpen.value = false
}

// 处理编辑提交
const handleEditSubmit = async (formData: any) => {
  try {
    await jobsStore.updateJob(formData)

    // 重新获取岗位详情，确保显示最新数据
    loading.value = true
    try {
      const response = await positionApi.getPositionById(jobId.value)
      if (response.data) {
        jobDetail.value = response.data
      }
    } catch (error) {
      console.error('刷新岗位详情失败:', error)
      // 即使刷新失败，也不影响编辑成功的提示
    } finally {
      loading.value = false
    }

    closeEditDialog()
  } catch (error) {
    console.error('更新岗位失败:', error)
    alert('更新岗位失败，请重试')
  }
}

// 打开添加面试记录对话框
const openAddInterviewDialog = () => {
  editingRecord.value = null
  isInterviewDialogOpen.value = true
}

// 打开编辑面试记录对话框
const openEditInterviewDialog = (record: Interview | undefined) => {
  if (record) {
    editingRecord.value = record
    isInterviewDialogOpen.value = true
  }
}

// 处理面试记录提交
const handleInterviewSubmit = async (formData: InterviewCreateRequest & { id?: number }) => {
  try {
    if (editingRecord.value) {
      // 编辑模式：构造包含 id 的更新请求
      const updateData: any = {
        id: editingRecord.value.id,
        ...formData
      }
      delete updateData.positionId // 编辑时不需要修改 positionId
      await jobsStore.updateInterviewRecord(editingRecord.value.id, updateData)
    } else {
      // 添加模式：不传递 id
      const { id, ...data } = formData
      await jobsStore.addInterviewRecord(data)
    }
    await refreshJobDetail()
  } catch (error) {
    console.error('面试记录操作失败:', error)
    alert(editingRecord.value ? '更新面试记录失败' : '添加面试记录失败')
  }
}

// 处理删除面试记录
const handleDeleteRecord = async (recordId: number) => {
  if (!confirm('确认删除这条面试记录吗？')) return
  try {
    await jobsStore.deleteInterviewRecord(recordId)
    await refreshJobDetail()
  } catch (error) {
    console.error('删除面试记录失败:', error)
    alert('删除面试记录失败')
  }
}

// 打开状态更新对话框
const openStatusDialog = () => {
  isStatusDialogOpen.value = true
}

// 处理状态更新
const handleStatusUpdate = async ({ status, remark }: { status: PositionStatus, remark?: string }) => {
  try {
    await jobsStore.updateJob({
      id: jobId.value,
      companyName: job.value?.companyName || '',
      positionName: job.value?.positionName || '',
      deliveryChannel: job.value?.deliveryChannel || '',
      deliveryDate: job.value?.deliveryDate || '',
      status,
      remarks: remark || job.value?.remarks || ''
    })

    // 如果切换到"流程中"状态，自动打开面试记录对话框
    if (status === PositionStatus.IN_PROCESS) {
      isStatusDialogOpen.value = false
      openAddInterviewDialog()
    } else {
      isStatusDialogOpen.value = false
      await refreshJobDetail()
    }
  } catch (error) {
    console.error('更新状态失败:', error)
    alert('更新状态失败')
  }
}

// 刷新岗位详情
const refreshJobDetail = async () => {
  loading.value = true
  try {
    const response = await positionApi.getPositionById(jobId.value)
    if (response.data) {
      jobDetail.value = response.data
    }
  } catch (error) {
    console.error('刷新岗位详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 如果 ID 无效，跳转到首页
  if (!jobId.value) {
    router.push('/')
    return
  }

  // 先尝试从 store 中获取
  const existingJob = jobsStore.getJobById(jobId.value)
  if (existingJob) {
    jobDetail.value = existingJob
  } else {
    // 如果 store 中没有，从 API 获取
    loading.value = true
    try {
      const response = await positionApi.getPositionById(jobId.value)
      if (response.data) {
        jobDetail.value = response.data
      } else {
        console.error('岗位不存在:', jobId)
        router.push('/')
      }
    } catch (error) {
      console.error('获取岗位详情失败:', error)
      router.push('/')
    } finally {
      loading.value = false
    }
  }
})
</script>
