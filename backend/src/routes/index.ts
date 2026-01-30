/**
 * 路由总入口
 */
import { Router } from 'express'
import userRoutes from './user.routes.js'
import positionRoutes from './position.routes.js'
import interviewRoutes from './interview.routes.js'
import experienceRoutes from './experience.routes.js'
import summaryRoutes from './summary.routes.js'
import aiRoutes from './ai.routes.js'

const router = Router()

// 注册各模块路由
router.use('/users', userRoutes)
router.use('/positions', positionRoutes)
router.use('/interviews', interviewRoutes)
router.use('/experiences', experienceRoutes)
router.use('/summaries', summaryRoutes)
router.use('/ai', aiRoutes)

export default router
