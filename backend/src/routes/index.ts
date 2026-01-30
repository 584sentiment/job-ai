/**
 * 路由总入口
 */
import { Router } from 'express'
import userRoutes from './user.routes'
import positionRoutes from './position.routes'
import interviewRoutes from './interview.routes'
import experienceRoutes from './experience.routes'
import summaryRoutes from './summary.routes'
import aiRoutes from './ai.routes'

const router = Router()

// 注册各模块路由
router.use('/api/users', userRoutes)
router.use('/api/positions', positionRoutes)
router.use('/api/interviews', interviewRoutes)
router.use('/api/experiences', experienceRoutes)
router.use('/api/summaries', summaryRoutes)
router.use('/api/ai', aiRoutes)

export default router
