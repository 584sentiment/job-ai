<template>
  <main class="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20 space-y-6">
    <!-- 加载状态 -->
    <div v-if="experienceStore.loading || !experience" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">加载中...</p>
      </div>
    </div>

    <!-- 详情内容 -->
    <div v-if="!experienceStore.loading && experience">
      <!-- 导航栏 -->
      <div class="flex items-center justify-between mb-6">
        <button @click="goBack" class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>返回</span>
        </button>
        <div class="flex items-center space-x-2">
          <button
            @click="handleToggleFavorite"
            :class="experience.isFavorite === 1 ? 'text-yellow-500' : 'text-gray-400'"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg class="w-6 h-6" :fill="experience.isFavorite === 1 ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
          </button>
          <button
            @click="goToEdit"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          <button
            @click="handleDelete"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-red-500"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 内容卡片 -->
      <div class="glass-card rounded-xl p-8">
        <!-- 标题区域 -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                {{ experience.companyName.charAt(0) }}
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ experience.companyName }} - {{ experience.positionName }}</h1>
                <div class="flex items-center space-x-3 text-sm text-gray-500">
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded">{{ experience.interviewRound }}</span>
                  <span>{{ formatTimestamp(experience.interviewDate) }}</span>
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <span>{{ experience.views }}次浏览</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 标签 -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in experience.tags"
              :key="tag"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors"
              @click="searchByTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 面经内容 -->
        <div class="prose prose-blue max-w-none" v-html="experience.content"></div>

        <!-- 底部信息 -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between text-sm text-gray-500">
            <div class="flex items-center space-x-4">
              <span>创建于 {{ formatDate(experience.createTime) }}</span>
              <span v-if="experience.isAnonymous === 1" class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>匿名发布</span>
              </span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span>{{ experience.views }} 次浏览</span>
              </span>
              <span class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
                <span>{{ experience.comments }} 条评论</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 关联岗位卡片 -->
      <div v-if="experience.positionId">
        <!-- 加载中 -->
        <div v-if="positionLoading" class="glass-card rounded-xl p-6">
          <div class="flex items-center justify-center">
            <svg class="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 0 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="ml-3 text-gray-600">加载岗位信息中...</span>
          </div>
        </div>

        <!-- 加载失败 -->
        <div v-else-if="positionError" class="glass-card rounded-xl p-6">
          <div class="flex items-center justify-between text-gray-500">
            <div class="flex items-center space-x-3">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-medium text-gray-700">岗位信息</h3>
                <p class="text-sm">{{ positionError }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 正常显示 -->
        <div
          v-else-if="position"
          @click="goToJob"
          class="glass-card rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-green-500"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">关联岗位</h3>
                <span
                  :class="getPositionStatusClass(position.status)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getPositionStatusLabel(position.status) }}
                </span>
              </div>
              <h4 class="text-base font-medium text-gray-800 mb-1">{{ position.companyName }} - {{ position.positionName }}</h4>
              <p class="text-sm text-gray-500" v-if="position.salaryRange">{{ position.salaryRange }}</p>
            </div>
            <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex items-center space-x-2 text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="truncate">{{ position.workLocation || '地点未知' }}</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>投递于 {{ formatTimestamp(position.deliveryDate) }}</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              <span class="truncate">{{ position.deliveryChannel || '未知渠道' }}</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span class="truncate">{{ position.interviewRecordList?.length || 0 }} 轮面试</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="glass-card rounded-xl p-6">
        <h3 class="text-lg font-semibold mb-4">评论 ({{ commentStore.pagination.total }})</h3>

        <!-- 加载状态 -->
        <div v-if="commentStore.loading" class="flex items-center justify-center py-8">
          <svg class="animate-spin h-6 w-6 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 0 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">加载中...</span>
        </div>

        <!-- 评论列表 -->
        <div v-else-if="commentStore.comments.length > 0" class="space-y-6 mb-6">
          <div
            v-for="comment in commentStore.comments"
            :key="comment.id"
            class="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
          >
            <!-- 一级评论 -->
            <div class="flex space-x-3">
              <!-- 头像 -->
              <img
                :src="comment.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.nickname || comment.user?.id}`"
                class="w-10 h-10 rounded-full flex-shrink-0"
              >

              <div class="flex-1 min-w-0">
                <!-- 评论头部 -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-sm">{{ comment.user?.nickname || '匿名用户' }}</span>
                    <span class="text-xs text-gray-500">{{ formatCommentTime(comment.createTime) }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <!-- 删除按钮（只对作者显示） -->
                    <button
                      v-if="comment.userId === authStore.user?.id"
                      @click="handleDeleteComment(comment.id)"
                      class="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>

                <!-- 评论内容 -->
                <div class="mb-2">
                  <p class="text-sm text-gray-700 whitespace-pre-wrap break-words">{{ comment.content }}</p>
                </div>

                <!-- 评论操作 -->
                <div class="flex items-center space-x-4">
                  <button
                    @click="handleLikeComment(comment)"
                    :class="comment.isLiked ? 'text-red-500' : 'text-gray-400'"
                    class="flex items-center space-x-1 text-xs hover:text-red-500 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span>{{ comment.likes || 0 }}</span>
                  </button>

                  <!-- 回复按钮 -->
                  <button
                    @click="setReplyComment(comment)"
                    class="flex items-center space-x-1 text-xs text-gray-400 hover:text-primary transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                    </svg>
                    <span>回复</span>
                  </button>
                </div>

                <!-- 回复列表 -->
                <div
                  v-if="comment.replies && comment.replies.length > 0"
                  class="mt-4 space-y-4 pl-4 border-l-2 border-gray-100"
                >
                  <div
                    v-for="reply in comment.replies"
                    :key="reply.id"
                    class="flex space-x-3"
                  >
                    <img
                      :src="reply.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user?.nickname || reply.user?.id}`"
                      class="w-8 h-8 rounded-full flex-shrink-0"
                    >

                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1">
                        <div class="flex items-center space-x-2">
                          <span class="font-medium text-xs">{{ reply.user?.nickname || '匿名用户' }}</span>
                          <span class="text-xs text-gray-500">{{ formatCommentTime(reply.createTime) }}</span>
                          <span v-if="reply.replyToUser" class="text-xs text-blue-600">
                            回复 @{{ reply.replyToUser?.nickname }}
                          </span>
                        </div>
                        <div class="flex items-center space-x-2">
                          <!-- 删除按钮 -->
                          <button
                            v-if="reply.userId === authStore.user?.id"
                            @click="handleDeleteComment(reply.id)"
                            class="text-xs text-gray-400 hover:text-red-500 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                      <p class="text-xs text-gray-700 whitespace-pre-wrap break-words">{{ reply.content }}</p>

                      <!-- 回复的操作 -->
                      <div class="mt-1 flex items-center space-x-4">
                        <button
                          @click="handleLikeComment(reply)"
                          :class="reply.isLiked ? 'text-red-500' : 'text-gray-400'"
                          class="flex items-center space-x-1 text-xs hover:text-red-500 transition-colors"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                          </svg>
                          <span>{{ reply.likes || 0 }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 回复输入框 -->
                <div
                  v-if="replyingTo === comment.id"
                  class="mt-3 flex space-x-3"
                >
                  <img
                    :src="authStore.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.user?.nickname || authStore.user?.id}`"
                    class="w-8 h-8 rounded-full flex-shrink-0"
                  >
                  <div class="flex-1">
                    <textarea
                      v-model="replyContent"
                      rows="2"
                      class="w-full px-3 py-2 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                      :placeholder="`回复 ${comment.user?.nickname}...`"
                    ></textarea>
                    <div class="mt-2 flex space-x-2">
                      <button
                        @click="cancelReply"
                        class="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        @click="submitReply(comment)"
                        :disabled="!replyContent.trim()"
                        class="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        发表
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-8 text-gray-500">
          <p>暂无评论，快来发表第一条评论吧~</p>
        </div>

        <!-- 评论输入框 -->
        <div class="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
          <img
            :src="authStore.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.user?.nickname || authStore.user?.id}`"
            class="w-10 h-10 rounded-full flex-shrink-0"
          >
          <div class="flex-1">
            <textarea
              v-model="newComment"
              rows="3"
              class="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              placeholder="写下你的评论..."
            ></textarea>
            <div class="mt-2 flex justify-end">
              <button
                @click="submitComment"
                :disabled="!newComment.trim()"
                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg v-if="submittingComment" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>{{ submittingComment ? '发表中...' : '发表评论' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExperienceStore } from '@/store/experiences'
import { useCommentStore } from '@/store/comments'
import { useAuthStore } from '@/store/auth'
import { useMessage } from 'naive-ui'
import type { Position } from '@/types'
import { getPositionById } from '@/api/position'
import { PositionStatus, PositionStatusLabels, PositionStatusClasses } from '@/types/enums'

const route = useRoute()
const router = useRouter()
const experienceStore = useExperienceStore()
const commentStore = useCommentStore()
const authStore = useAuthStore()
const message = useMessage()

const newComment = ref('')
const replyingTo = ref<string | null>(null)
const replyContent = ref('')
const submittingComment = ref(false)

// 当前面经
const experience = computed(() => experienceStore.currentExperience)

// 关联岗位详情
const position = ref<Position | null>(null)
const positionLoading = ref(false)
const positionError = ref<string | null>(null)

/**
 * 加载面经详情
 */
async function loadDetail() {
  const id = (route.query.id || route.params.id) as string
  if (id) {
    await experienceStore.fetchExperienceById(id)
    // 加载评论列表
    await commentStore.fetchComments(id)

    // 如果有关联岗位，加载岗位详情
    if (experience.value?.positionId) {
      await loadPositionDetails(experience.value.positionId)
    }
  }
}

/**
 * 加载岗位详情
 */
async function loadPositionDetails(positionId: string) {
  positionLoading.value = true
  positionError.value = null

  try {
    const response = await getPositionById(positionId)
    if (response.code === 200 && response.data) {
      position.value = response.data
    } else {
      positionError.value = '岗位不存在或已被删除'
    }
  } catch (error) {
    console.error('加载岗位详情失败:', error)
    positionError.value = '加载岗位详情失败'
  } finally {
    positionLoading.value = false
  }
}

/**
 * 返回
 */
function goBack() {
  router.back()
}

/**
 * 跳转到编辑页
 */
function goToEdit() {
  if (experience.value) {
    router.push(`/add-experience?id=${experience.value.id}`)
  }
}

/**
 * 删除面经
 */
async function handleDelete() {
  if (!experience.value) return

  if (confirm('确定要删除这篇面经吗？删除后不可恢复。')) {
    try {
      await experienceStore.deleteExperience(experience.value.id)
      alert('删除成功')
      router.push('/experiences')
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    }
  }
}

/**
 * 切换收藏状态
 */
async function handleToggleFavorite() {
  if (!experience.value) return

  try {
    await experienceStore.toggleFavorite(experience.value.id)
  } catch (error) {
    console.error('操作失败:', error)
  }
}

/**
 * 按标签搜索
 */
function searchByTag(tag: string) {
  router.push(`/experiences?tag=${tag}`)
}

/**
 * 获取岗位状态标签
 */
function getPositionStatusLabel(status: PositionStatus): string {
  return PositionStatusLabels[status] || '未知'
}

/**
 * 获取岗位状态样式
 */
function getPositionStatusClass(status: PositionStatus): string {
  return PositionStatusClasses[status] || 'bg-gray-100 text-gray-700'
}

/**
 * 跳转到岗位详情
 */
function goToJob() {
  if (experience.value?.positionId) {
    router.push(`/job-detail?id=${experience.value.positionId}`)
  }
}

/**
 * 格式化评论时间（相对时间）
 */
function formatCommentTime(timestamp: string | number | bigint): string {
  let ms: number

  // 处理 BigInt
  if (typeof timestamp === 'bigint') {
    ms = Number(timestamp)
  }
  // 处理数字字符串或数字
  else if (typeof timestamp === 'string') {
    if (/^\d+$/.test(timestamp)) {
      ms = parseInt(timestamp)
    } else {
      return timestamp // 如果不是纯数字，直接返回
    }
  }
  // 处理数字
  else if (typeof timestamp === 'number') {
    ms = timestamp
  }
  else {
    return timestamp.toString()
  }

  const now = Date.now()
  const diff = now - ms

  // 计算相对时间
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < month) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`
  } else {
    return `${Math.floor(diff / year)}年前`
  }
}

/**
 * 设置回复的评论
 */
function setReplyComment(comment: any) {
  replyingTo.value = comment.id
  replyContent.value = ''
  // 自动聚焦回复输入框
  setTimeout(() => {
    const textarea = document.querySelector(`textarea[placeholder*="回复 ${comment.user?.nickname}"]`) as HTMLTextAreaElement
    textarea?.focus()
  }, 100)
}

/**
 * 取消回复
 */
function cancelReply() {
  replyingTo.value = null
  replyContent.value = ''
}

/**
 * 提交评论
 */
async function submitComment() {
  if (!newComment.value.trim()) {
    message.warning('请输入评论内容')
    return
  }

  if (!experience.value) {
    message.error('面经信息加载中，请稍后重试')
    return
  }

  submittingComment.value = true

  try {
    await commentStore.createComment({
      experienceId: experience.value.id,
      content: newComment.value.trim(),
    })

    message.success('评论成功')
    newComment.value = ''

    // 重新加载评论列表，确保数据最新
    await commentStore.fetchComments(experience.value.id)
  } catch (error: any) {
    console.error('评论失败:', error)
    message.error(error.message || '评论失败，请重试')
  } finally {
    submittingComment.value = false
  }
}

/**
 * 提交回复
 */
async function submitReply(parentComment: any) {
  if (!replyContent.value.trim()) {
    message.warning('请输入回复内容')
    return
  }

  submittingComment.value = true

  try {
    await commentStore.createComment({
      experienceId: experience.value!.id,
      content: replyContent.value.trim(),
      parentId: parentComment.id,
      replyToUserId: parentComment.userId,
    })

    message.success('回复成功')
    cancelReply()

    // 重新加载评论列表
    await commentStore.fetchComments(experience.value!.id)
  } catch (error: any) {
    console.error('回复失败:', error)
    message.error(error.message || '回复失败，请重试')
  } finally {
    submittingComment.value = false
  }
}

/**
 * 删除评论
 */
async function handleDeleteComment(commentId: string) {
  const confirmed = confirm('确定要删除这条评论吗？')
  if (!confirmed) return

  try {
    await commentStore.deleteComment(commentId)
    message.success('删除成功')

    // 重新加载评论列表
    if (experience.value) {
      await commentStore.fetchComments(experience.value.id)
    }
  } catch (error: any) {
    console.error('删除失败:', error)
    message.error(error.message || '删除失败，请重试')
  }
}

/**
 * 点赞/取消点赞评论
 */
async function handleLikeComment(comment: any) {
  try {
    if (comment.isLiked) {
      await commentStore.unlikeComment(comment.id)
      comment.isLiked = false
    } else {
      await commentStore.likeComment(comment.id)
      comment.isLiked = true
    }
  } catch (error: any) {
    console.error('操作失败:', error)
    message.error(error.message || '操作失败，请重试')
  }
}

/**
 * 格式化 BigInt 时间戳或日期字符串
 */
function formatTimestamp(timestamp: string | number | bigint): string {
  let ms: number

  // 处理 BigInt
  if (typeof timestamp === 'bigint') {
    ms = Number(timestamp)
  }
  // 处理数字字符串或数字
  else if (typeof timestamp === 'string') {
    // 如果是纯数字字符串，当作时间戳处理
    if (/^\d+$/.test(timestamp)) {
      ms = parseInt(timestamp)
    } else {
      // 否则当作日期字符串处理
      return formatDate(timestamp)
    }
  }
  // 处理数字
  else if (typeof timestamp === 'number') {
    ms = timestamp
  }
  else {
    return timestamp.toString()
  }

  const date = new Date(ms)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * 格式化日期字符串或时间戳字符串
 */
function formatDate(dateString: string) {
  let date: Date

  // 如果是纯数字字符串（时间戳），先转换为数字
  if (/^\d+$/.test(dateString)) {
    date = new Date(parseInt(dateString))
  } else {
    // 否则直接当作日期字符串处理
    date = new Date(dateString)
  }

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return dateString // 如果解析失败，返回原字符串
  }

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadDetail()
})
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
</style>
