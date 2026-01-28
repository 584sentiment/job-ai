/**
 * 用户路由
 */
import { Router } from 'express'
import userController from '@/controllers/user.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'

const router = Router()

/**
 * @route   POST /users/register
 * @desc    用户注册
 * @access  Public
 */
router.post('/register', userController.register)

/**
 * @route   POST /users/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', userController.login)

/**
 * @route   GET /users/current
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get('/current', authMiddleware, userController.getCurrentUser)

/**
 * @route   GET /users/:id
 * @desc    根据 ID 获取用户信息
 * @access  Private
 */
router.get('/:id', authMiddleware, userController.getUserById)

/**
 * @route   PUT /users
 * @desc    更新用户信息
 * @access  Private
 */
router.put('/', authMiddleware, userController.updateUser)

/**
 * @route   POST /users/change-password
 * @desc    修改密码
 * @access  Private
 */
router.post('/change-password', authMiddleware, userController.changePassword)

/**
 * @route   POST /users/logout
 * @desc    用户登出
 * @access  Private
 */
router.post('/logout', authMiddleware, userController.logout)

/**
 * @route   GET /users/stats
 * @desc    获取用户统计数据
 * @access  Private
 */
router.get('/stats', authMiddleware, userController.getUserStats)

/**
 * @route   DELETE /users/:id
 * @desc    删除用户
 * @access  Private
 */
router.delete('/:id', authMiddleware, userController.deleteUser)

export default router
