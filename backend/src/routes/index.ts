/**
 * 路由总入口
 */
import { Router } from 'express'
import userRoutes from './user.routes'
import positionRoutes from './position.routes'
import interviewRoutes from './interview.routes'
import experienceRoutes from './experience.routes'
import summaryRoutes from './summary.routes'

const router = Router()

// 注册各模块路由
router.use('/users', userRoutes)
router.use('/positions', positionRoutes)
router.use('/interviews', interviewRoutes)
router.use('/experiences', experienceRoutes)
router.use('/summaries', summaryRoutes)

export default router
