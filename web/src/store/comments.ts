/**
 * 评论 Store
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as commentApi from '@/api/experience'
import type { ExperienceComment } from '@/types'

export const useCommentStore = defineStore('comment', () => {
  // 状态
  const comments = ref<ExperienceComment[]>([])
  const loading = ref<boolean>(false)
  const pagination = ref({
    current: 1,
    size: 20,
    total: 0,
    pages: 0,
  })

  /**
   * 获取面经的评论列表
   */
  async function fetchComments(experienceId: string, page: number = 1) {
    loading.value = true
    try {
      const response = await commentApi.getExperienceComments(experienceId, page)

      if (response.code === 200 && response.data) {
        comments.value = response.data.list || []
        pagination.value = {
          current: response.data.page || page,
          size: response.data.pageSize || 20,
          total: response.data.total || 0,
          pages: response.data.pages || 0,
        }
      }
    } catch (error) {
      console.error('获取评论列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建评论
   */
  async function createComment(data: {
    experienceId: string
    content: string
    parentId?: string
    replyToUserId?: string
  }) {
    loading.value = true
    try {
      const response = await commentApi.createExperienceComment(data)

      if (response.code === 200 && response.data) {
        // 添加到评论列表顶部
        comments.value.unshift(response.data)

        // 更新面经的评论数
        return response.data
      }
    } catch (error) {
      console.error('创建评论失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除评论
   */
  async function deleteComment(commentId: string) {
    try {
      const response = await commentApi.deleteExperienceComment(commentId)

      if (response.code === 200) {
        // 从列表中移除
        const index = comments.value.findIndex((c) => c.id === commentId)
        if (index !== -1) {
          comments.value.splice(index, 1)
        }

        return true
      }
    } catch (error) {
      console.error('删除评论失败:', error)
      throw error
    }
  }

  /**
   * 点赞评论
   */
  async function likeComment(commentId: string) {
    try {
      const response = await commentApi.likeExperienceComment(commentId)

      if (response.code === 200 && response.data) {
        // 更新本地评论的点赞数
        const comment = comments.value.find((c) => c.id === commentId)
        if (comment) {
          comment.likes = response.data.likes
        }

        return response.data
      }
    } catch (error) {
      console.error('点赞失败:', error)
      throw error
    }
  }

  /**
   * 取消点赞评论
   */
  async function unlikeComment(commentId: string) {
    try {
      const response = await commentApi.unlikeExperienceComment(commentId)

      if (response.code === 200 && response.data) {
        // 更新本地评论的点赞数
        const comment = comments.value.find((c) => c.id === commentId)
        if (comment) {
          comment.likes = response.data.likes
        }

        return response.data
      }
    } catch (error) {
      console.error('取消点赞失败:', error)
      throw error
    }
  }

  /**
   * 重置状态
   */
  function reset() {
    comments.value = []
    pagination.value = {
      current: 1,
      size: 20,
      total: 0,
      pages: 0,
    }
  }

  return {
    // 状态
    comments,
    loading,
    pagination,

    // 方法
    fetchComments,
    createComment,
    deleteComment,
    likeComment,
    unlikeComment,
    reset,
  }
})
