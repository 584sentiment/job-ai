/**
 * 面试路由
 */
import { Router } from 'express'
import interviewController from '@/controllers/interview.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'

const router = Router()

/**
 * @route   POST /interviews
 * @desc    创建面试记录
 * @access  Private
 */
router.post('/', authMiddleware, interviewController.createInterview)

/**
 * @route   PUT /interviews/:id
 * @desc    更新面试记录
 * @access  Private
 */
router.put('/:id', authMiddleware, interviewController.updateInterview)

/**
 * @route   DELETE /interviews/:id
 * @desc    删除面试记录
 * @access  Private
 */
router.delete('/:id', authMiddleware, interviewController.deleteInterview)

/**
 * @route   GET /interviews/position/:positionId
 * @desc    获取岗位的面试列表
 * @access  Private
 */
router.get('/position/:positionId', authMiddleware, interviewController.getInterviewsByPosition)

/**
 * @route   POST /interviews/page
 * @desc    分页查询面试记录
 * @access  Private
 */
router.post('/page', authMiddleware, interviewController.getInterviewsPaginated)

/**
 * @route   GET /interviews/:id
 * @desc    获取面试详情
 * @access  Private
 */
router.get('/:id', authMiddleware, interviewController.getInterviewById)

export default router
