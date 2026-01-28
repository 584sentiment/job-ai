<template>
  <main class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <!-- 用户信息卡片 -->
    <div class="glass-card rounded-xl p-6 mb-6">
      <div class="flex items-center space-x-4">
        <img
          :src="userAvatar"
          alt="用户头像"
          class="w-20 h-20 rounded-full"
        >
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <h2 class="text-2xl font-bold">{{ userNickname }}</h2>
            <button
              @click="showEditProfile = true"
              class="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
              title="编辑个人资料"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
          </div>
          <p class="text-gray-600">{{ userJobTitle }} · {{ userExperience }}</p>
          <p class="text-sm text-gray-500 mt-1">已绑定手机: {{ maskedPhone }}</p>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="glass-card rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-primary">{{ jobStats.total }}</p>
        <p class="text-sm text-gray-600 mt-1">投递岗位</p>
      </div>
      <div class="glass-card rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-blue-600">{{ jobStats.inProcess }}</p>
        <p class="text-sm text-gray-600 mt-1">流程中</p>
      </div>
      <div class="glass-card rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-green-600">{{ jobStats.offered }}</p>
        <p class="text-sm text-gray-600 mt-1">已录用</p>
      </div>
      <div class="glass-card rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-purple-600">{{ totalExperiencesAndSummaries }}</p>
        <p class="text-sm text-gray-600 mt-1">面经/总结</p>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="glass-card rounded-xl p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">我的岗位</h3>
      <div class="grid grid-cols-2 gap-3">
        <!-- AI助手卡片 - 紫色渐变突出显示 -->
        <router-link
          to="/ai-assistant"
          class="col-span-2 flex items-center justify-between p-4 rounded-lg transition-all duration-200 cursor-pointer"
          style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div class="text-white">
              <div class="font-bold">AI助手</div>
              <div class="text-xs opacity-90">简历优化 · 面试准备</div>
            </div>
          </div>
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </router-link>

        <router-link
          to="/"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span class="font-medium">全部岗位</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </router-link>

        <router-link
          to="/"
          class="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-medium">面试中</span>
          </div>
          <span class="text-sm text-blue-600 font-medium">{{ jobStats.interviewing }}</span>
        </router-link>

        <router-link
          to="/"
          class="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-medium">已录用</span>
          </div>
          <span class="text-sm text-green-600 font-medium">{{ jobStats.offered }}</span>
        </router-link>

        <router-link
          to="/"
          class="flex items-center justify-between p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
            </svg>
            <span class="font-medium">待跟进</span>
          </div>
          <span class="text-sm text-yellow-600 font-medium">{{ pendingJobsCount }}</span>
        </router-link>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="glass-card rounded-xl overflow-hidden">
      <div class="divide-y divide-border">
        <!-- AI助手入口 - 放在首位突出显示 -->
        <router-link
          to="/ai-assistant"
          class="flex items-center justify-between p-4 hover:bg-purple-50 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div>
              <span class="font-medium text-purple-700">AI助手</span>
              <p class="text-xs text-gray-500">智能简历优化 · 面试准备 · 匹配分析</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full">智能</span>
            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </router-link>

        <router-link
          to="/interviews"
          class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span class="font-medium">我的面经</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">{{ interviewsStore.interviews.length }}篇</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </router-link>

        <router-link
          to="/summaries"
          class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <span class="font-medium">面试总结</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">{{ summariesStore.summaries.length }}篇</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </router-link>

        <button
          @click="handleNotifications"
          class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span class="font-medium">消息提醒</span>
          </div>
          <div class="flex items-center space-x-2">
            <span v-if="hasNotifications" class="w-2 h-2 bg-cta rounded-full"></span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </button>

        <button
          @click="showSettings = true"
          class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="font-medium">设置</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <button
          @click="showHelp = true"
          class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-medium">帮助与反馈</span>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <button
      @click="handleLogout"
      class="w-full mt-6 px-6 py-3 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium"
    >
      退出登录
    </button>

    <!-- 编辑个人资料对话框 -->
    <n-modal v-model:show="showEditProfile" preset="dialog" title="编辑个人资料">
      <n-form ref="editFormRef" :model="editForm" label-placement="left" label-width="80px">
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="editForm.nickname" placeholder="请输入昵称" />
        </n-form-item>
        <n-form-item label="职位" path="jobTitle">
          <n-input v-model:value="editForm.jobTitle" placeholder="请输入您的职位" />
        </n-form-item>
        <n-form-item label="工作经验" path="experience">
          <n-input v-model:value="editForm.experience" placeholder="例如: 3年经验" />
        </n-form-item>
        <n-form-item label="个人简介" path="bio">
          <n-input
            v-model:value="editForm.bio"
            type="textarea"
            placeholder="简单介绍一下自己"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showEditProfile = false">取消</n-button>
        <n-button type="primary" @click="handleSaveProfile" :loading="savingProfile">保存</n-button>
      </template>
    </n-modal>

    <!-- 设置对话框 -->
    <n-modal v-model:show="showSettings" preset="dialog" title="设置">
      <div class="space-y-4 py-2">
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p class="font-medium">深色模式</p>
            <p class="text-sm text-gray-500">切换深色/浅色主题</p>
          </div>
          <n-switch v-model:value="settings.darkMode" @update:value="handleDarkModeChange" />
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p class="font-medium">消息通知</p>
            <p class="text-sm text-gray-500">接收面试提醒通知</p>
          </div>
          <n-switch v-model:value="settings.notifications" />
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p class="font-medium">声音提醒</p>
            <p class="text-sm text-gray-500">开启声音提醒</p>
          </div>
          <n-switch v-model:value="settings.sound" />
        </div>
      </div>
      <template #action>
        <n-button type="primary" @click="showSettings = false">关闭</n-button>
      </template>
    </n-modal>

    <!-- 帮助与反馈对话框 -->
    <n-modal v-model:show="showHelp" preset="dialog" title="帮助与反馈" style="width: 600px;">
      <n-tabs type="line" animated>
        <n-tab-pane name="help" tab="使用帮助">
          <div class="space-y-4 py-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <h4 class="font-semibold mb-2">如何添加岗位?</h4>
              <p class="text-sm text-gray-600">点击首页的"新增岗位"按钮,填写公司、职位、薪资等信息即可添加。</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg">
              <h4 class="font-semibold mb-2">如何使用 AI 助手?</h4>
              <p class="text-sm text-gray-600">点击底部的 AI 助手图标或个人中心的入口,可以与 AI 对话获取求职建议。</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <h4 class="font-semibold mb-2">如何记录面试?</h4>
              <p class="text-sm text-gray-600">在岗位详情页面可以添加面试记录,包括面试轮次、时间、地点等信息。</p>
            </div>
            <div class="p-4 bg-orange-50 rounded-lg">
              <h4 class="font-semibold mb-2">数据会丢失吗?</h4>
              <p class="text-sm text-gray-600">所有数据都保存在云端,登录同一个账号即可同步数据。</p>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="feedback" tab="意见反馈">
          <div class="py-4">
            <n-form ref="feedbackFormRef" :model="feedbackForm" label-placement="top">
              <n-form-item label="反馈类型" path="type">
                <n-select v-model:value="feedbackForm.type" :options="feedbackTypes" placeholder="请选择反馈类型" />
              </n-form-item>
              <n-form-item label="详细描述" path="content">
                <n-input
                  v-model:value="feedbackForm.content"
                  type="textarea"
                  placeholder="请详细描述您遇到的问题或建议..."
                  :autosize="{ minRows: 5, maxRows: 10 }"
                />
              </n-form-item>
              <n-form-item label="联系方式(可选)" path="contact">
                <n-input v-model:value="feedbackForm.contact" placeholder="手机号或邮箱,方便我们联系您" />
              </n-form-item>
            </n-form>
            <div class="flex justify-end mt-4">
              <n-button type="primary" @click="handleSubmitFeedback" :loading="submittingFeedback">
                提交反馈
              </n-button>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="about" tab="关于我们">
          <div class="py-4 text-center">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">求职追踪助手</h3>
            <p class="text-gray-600 mb-4">版本 1.0.0</p>
            <p class="text-sm text-gray-500 mb-4">
              专为求职人员打造的工具,聚焦"岗位记录-进度追踪-面经收集-面试总结"全流程求职管理。
            </p>
            <div class="text-xs text-gray-400">
              <p>© 2025 求职追踪助手. All rights reserved.</p>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
      <template #action>
        <n-button type="primary" @click="showHelp = false">关闭</n-button>
      </template>
    </n-modal>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDialog, useMessage } from 'naive-ui'
import { useAuthStore } from '@/store/auth'
import { useJobsStore } from '@/store/jobs'
import { useInterviewsStore } from '@/store/interviews'
import { useSummariesStore } from '@/store/summaries'
import { useExperienceStore } from '@/store/experiences'

const router = useRouter()
const dialog = useDialog()
const message = useMessage()
const authStore = useAuthStore()
const jobsStore = useJobsStore()
const interviewsStore = useInterviewsStore()
const summariesStore = useSummariesStore()
const experiencesStore = useExperienceStore()

// UI 状态
const showEditProfile = ref(false)
const showSettings = ref(false)
const showHelp = ref(false)
const savingProfile = ref(false)
const submittingFeedback = ref(false)
const hasNotifications = ref(false)

// 编辑表单
const editForm = ref({
  nickname: '',
  jobTitle: '',
  experience: '',
  bio: ''
})

// 反馈表单
const feedbackForm = ref({
  type: null,
  content: '',
  contact: ''
})

// 反馈类型选项
const feedbackTypes = [
  { label: '功能建议', value: 'suggestion' },
  { label: 'Bug 反馈', value: 'bug' },
  { label: '使用问题', value: 'usage' },
  { label: '其他', value: 'other' }
]

// 设置项
const settings = ref({
  darkMode: false,
  notifications: true,
  sound: false
})

// 计算属性 - 用户信息
const userAvatar = computed(() => {
  if (authStore.user?.avatar) {
    return authStore.user.avatar
  }
  // 使用 dicebear API 生成默认头像,基于用户昵称或 ID
  const seed = authStore.user?.nickname || authStore.user?.id || 'jobseeker'
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`
})

const userNickname = computed(() => {
  return authStore.user?.nickname || '求职者'
})

const maskedPhone = computed(() => {
  const phone = authStore.user?.phone
  if (!phone) return '未绑定手机'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

const userJobTitle = computed(() => {
  // 从用户信息中获取,如果没有则使用默认值
  return authStore.user?.jobTitle || '前端开发工程师'
})

const userExperience = computed(() => {
  // 从用户信息中获取,如果没有则使用默认值
  return authStore.user?.experience || '3年经验'
})

// 计算属性 - 岗位统计
const jobStats = computed(() => jobsStore.jobStats)

// 计算属性 - 待跟进岗位数量(待投递 + 已投递)
const pendingJobsCount = computed(() => {
  return jobStats.value.pending + jobStats.value.delivered
})

// 计算属性 - 面经和总结总数
const totalExperiencesAndSummaries = computed(() => {
  return experiencesStore.experiences.length + summariesStore.summaries.length
})

// 方法 - 处理退出登录
const handleLogout = () => {
  dialog.warning({
    title: '退出登录',
    content: '确定要退出登录吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await authStore.logout()
        message.success('已退出登录')
        router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
        message.error('退出登录失败,请重试')
      }
    }
  })
}

// 方法 - 处理消息提醒
const handleNotifications = () => {
  message.info('暂无新消息提醒')
}

// 方法 - 保存个人资料
const handleSaveProfile = async () => {
  if (!editForm.value.nickname) {
    message.warning('请输入昵称')
    return
  }

  savingProfile.value = true

  try {
    await authStore.updateUser({
      nickname: editForm.value.nickname,
      jobTitle: editForm.value.jobTitle,
      experience: editForm.value.experience,
      bio: editForm.value.bio
    })

    message.success('个人资料保存成功')
    showEditProfile.value = false
  } catch (error) {
    console.error('保存个人资料失败:', error)
    message.error('保存失败,请重试')
  } finally {
    savingProfile.value = false
  }
}

// 方法 - 提交反馈
const handleSubmitFeedback = () => {
  if (!feedbackForm.value.type) {
    message.warning('请选择反馈类型')
    return
  }

  if (!feedbackForm.value.content || feedbackForm.value.content.trim().length === 0) {
    message.warning('请输入详细描述')
    return
  }

  submittingFeedback.value = true

  // 模拟提交反馈(实际项目中应该调用真实的 API)
  setTimeout(() => {
    message.success('感谢您的反馈!我们会尽快处理')
    feedbackForm.value = {
      type: null,
      content: '',
      contact: ''
    }
    submittingFeedback.value = false
    showHelp.value = false
  }, 1000)
}

// 方法 - 深色模式切换
const handleDarkModeChange = (value) => {
  if (value) {
    message.info('深色模式功能开发中,敬请期待')
    settings.value.darkMode = false
  }
}

// 页面加载时初始化编辑表单
onMounted(() => {
  if (authStore.user) {
    editForm.value = {
      nickname: authStore.user.nickname || '',
      jobTitle: authStore.user.jobTitle || userJobTitle.value,
      experience: authStore.user.experience || userExperience.value,
      bio: authStore.user.bio || ''
    }
  }

  // 从 localStorage 加载设置
  const savedSettings = localStorage.getItem('app_settings')
  if (savedSettings) {
    try {
      settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }
})

// 监听设置变化,自动保存
const saveSettings = () => {
  localStorage.setItem('app_settings', JSON.stringify(settings.value))
}
</script>
