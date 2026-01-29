/**
 * 评论路由
 */
import { Router } from 'express'
import commentController from '@/controllers/comment.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'

const router = Router()

/**
 * @route   GET /experiences/:id/comments
 * @desc    获取面经的评论列表（分页）
 * @access  Private
 */
router.get('/:id/comments', authMiddleware, commentController.getComments)

/**
 * @route   POST /experiences/comments
 * @desc    创建评论
 * @access  Private
 */
router.post('/comments', authMiddleware, commentController.createComment)

/**
 * @route   GET /experiences/comments/:id
 * @desc    获取评论详情
 * @access  Private
 */
router.get('/comments/:id', authMiddleware, commentController.getCommentById)

/**
 * @route   DELETE /experiences/comments/:id
 * @desc    删除评论
 * @access  Private
 */
router.delete('/comments/:id', authMiddleware, commentController.deleteComment)

/**
 * @route   POST /experiences/comments/:id/like
 * @desc    点赞评论
 * @access  Private
 */
router.post('/comments/:id/like', authMiddleware, commentController.likeComment)

/**
 * @route   DELETE /experiences/comments/:id/like
 * @desc    取消点赞评论
 * @access  Private
 */
router.delete('/comments/:id/like', authMiddleware, commentController.unlikeComment)

export default router
