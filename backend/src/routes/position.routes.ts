/**
 * 岗位路由
 */
import { Router } from 'express'
import positionController from '@/controllers/position.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'

const router = Router()

/**
 * @route   POST /positions/page
 * @desc    分页查询岗位列表
 * @access  Private
 */
router.post('/page', authMiddleware, positionController.getPositionsPaginated)

/**
 * @route   GET /positions/:id
 * @desc    获取岗位详情
 * @access  Private
 */
router.get('/:id', authMiddleware, positionController.getPositionById)

/**
 * @route   POST /positions
 * @desc    创建岗位
 * @access  Private
 */
router.post('/', authMiddleware, positionController.createPosition)

/**
 * @route   PUT /positions
 * @desc    更新岗位
 * @access  Private
 */
router.put('/', authMiddleware, positionController.updatePosition)

/**
 * @route   DELETE /positions/:id
 * @desc    删除岗位
 * @access  Private
 */
router.delete('/:id', authMiddleware, positionController.deletePosition)

/**
 * @route   POST /positions/:id/collect
 * @desc    切换岗位收藏状态
 * @access  Private
 */
router.post('/:id/collect', authMiddleware, positionController.toggleCollectPosition)

export default router
