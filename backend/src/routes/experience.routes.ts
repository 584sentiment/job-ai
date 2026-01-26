/**
 * 面经路由
 */
import { Router } from 'express'
import experienceController from '@/controllers/experience.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'

const router = Router()

/**
 * @route   POST /experiences
 * @desc    创建面经
 * @access  Private
 */
router.post('/', authMiddleware, experienceController.createExperience)

/**
 * @route   PUT /experiences/:id
 * @desc    更新面经
 * @access  Private
 */
router.put('/:id', authMiddleware, experienceController.updateExperience)

/**
 * @route   DELETE /experiences/:id
 * @desc    删除面经
 * @access  Private
 */
router.delete('/:id', authMiddleware, experienceController.deleteExperience)

/**
 * @route   GET /experiences/:id
 * @desc    获取面经详情
 * @access  Private
 */
router.get('/:id', authMiddleware, experienceController.getExperienceById)

/**
 * @route   POST /experiences/page
 * @desc    分页查询面经
 * @access  Private
 */
router.post('/page', authMiddleware, experienceController.getExperiencesPaginated)

/**
 * @route   GET /experiences/all
 * @desc    获取所有面经
 * @access  Private
 */
router.get('/all', authMiddleware, experienceController.getAllExperiences)

/**
 * @route   POST /experiences/:id/favorite
 * @desc    切换面经收藏状态
 * @access  Private
 */
router.post('/:id/favorite', authMiddleware, experienceController.toggleFavoriteExperience)

/**
 * @route   POST /experiences/search
 * @desc    搜索面经
 * @access  Private
 */
router.post('/search', authMiddleware, experienceController.searchExperiences)

/**
 * @route   POST /experiences/batch-delete
 * @desc    批量删除面经
 * @access  Private
 */
router.post('/batch-delete', authMiddleware, experienceController.batchDeleteExperiences)

export default router
