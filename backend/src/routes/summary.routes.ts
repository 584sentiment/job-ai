/**
 * 面试总结路由
 */
import { Router } from 'express'
import summaryController from '@/controllers/summary.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'

const router = Router()

/**
 * @route   POST /summaries
 * @desc    创建总结
 * @access  Private
 */
router.post('/', authMiddleware, summaryController.createSummary)

/**
 * @route   GET /summaries/:id
 * @desc    获取总结详情
 * @access  Private
 */
router.get('/:id', authMiddleware, summaryController.getSummaryById)

/**
 * @route   PUT /summaries/:id
 * @desc    更新总结
 * @access  Private
 */
router.put('/:id', authMiddleware, summaryController.updateSummary)

/**
 * @route   DELETE /summaries/:id
 * @desc    删除总结
 * @access  Private
 */
router.delete('/:id', authMiddleware, summaryController.deleteSummary)

/**
 * @route   POST /summaries/page
 * @desc    分页查询总结
 * @access  Private
 */
router.post('/page', authMiddleware, summaryController.getSummariesPaginated)

export default router
