/**
 * 评论控制器层
 */
import { Request, Response, NextFunction } from 'express'
import commentService from '@/services/comment.service'
import { success } from '@/utils/response'
import { BadRequestError } from '@/utils/error'

/**
 * 获取面经的评论列表（分页）
 */
export async function getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string }
    const { page, size } = req.query as { page?: string; size?: string }

    const comments = await commentService.getCommentsByExperienceId(
      id,
      page ? parseInt(page) : 1,
      size ? parseInt(size) : 20
    )

    success(res, comments)
  } catch (error) {
    next(error)
  }
}

/**
 * 根据 ID 获取评论详情
 */
export async function getCommentById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string }

    const comment = await commentService.getCommentById(id)

    success(res, comment)
  } catch (error) {
    next(error)
  }
}

/**
 * 创建评论
 */
export async function createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { experienceId, content, parentId, replyToUserId } = req.body

    // 参数验证
    if (!experienceId || !content) {
      throw new BadRequestError('experienceId 和 content 不能为空')
    }

    if (!content.trim()) {
      throw new BadRequestError('评论内容不能为空')
    }

    if (content.length > 1000) {
      throw new BadRequestError('评论内容不能超过1000字符')
    }

    // 调用服务层创建评论
    const comment = await commentService.createComment(userId, {
      experienceId,
      content: content.trim(),
      parentId,
      replyToUserId,
    })

    success(res, comment, '评论成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 删除评论
 */
export async function deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id } = req.params as { id: string }

    // 调用服务层删除评论
    await commentService.deleteComment(id, userId)

    success(res, null, '删除成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 点赞评论
 */
export async function likeComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string }

    const result = await commentService.likeComment(id)

    success(res, result, '点赞成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 取消点赞评论
 */
export async function unlikeComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string }

    const result = await commentService.unlikeComment(id)

    success(res, result, '取消点赞成功')
  } catch (error) {
    next(error)
  }
}

export default {
  getComments,
  getCommentById,
  createComment,
  deleteComment,
  likeComment,
  unlikeComment,
}
