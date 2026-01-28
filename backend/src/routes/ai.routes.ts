/**
 * AI 路由
 */
import { Router } from 'express'
import aiController from '@/controllers/ai.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'

const router = Router()

/**
 * @route   POST /ai/parse-jd
 * @desc    AI智能解析JD
 * @access  Private
 */
router.post('/parse-jd', authMiddleware, aiController.parseJD)

/**
 * @route   POST /ai/analyze-match
 * @desc    AI岗位匹配度分析
 * @access  Private
 */
router.post('/analyze-match', authMiddleware, aiController.analyzeMatch)

/**
 * @route   POST /ai/generate-prep-list
 * @desc    AI生成面试准备清单
 * @access  Private
 */
router.post('/generate-prep-list', authMiddleware, aiController.generatePrepList)

/**
 * @route   POST /ai/chat
 * @desc    AI对话
 * @access  Private
 */
router.post('/chat', authMiddleware, aiController.chat)

export default router
