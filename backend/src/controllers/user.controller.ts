/**
 * 用户控制器层
 */
import { Request, Response, NextFunction } from 'express'
import userService from '@/services/user.service'
import { generateToken } from '@/utils/jwt'
import { success } from '@/utils/response'
import { BadRequestError } from '@/utils/error'

/**
 * 用户注册
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { phone, password, nickname } = req.body

    // 参数验证
    if (!phone || !password) {
      throw new BadRequestError('手机号和密码不能为空')
    }

    // 手机号格式验证（简单验证）
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      throw new BadRequestError('手机号格式不正确')
    }

    // 密码长度验证
    if (password.length < 6) {
      throw new BadRequestError('密码长度不能少于6位')
    }

    // 调用服务层注册
    const user = await userService.register(phone, password, nickname)

    // 生成 JWT Token
    const token = generateToken(user)

    // 返回用户信息和 Token
    success(res, {
      user,
      token,
    }, '注册成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 用户登录
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { phone, password } = req.body

    // 参数验证
    if (!phone || !password) {
      throw new BadRequestError('手机号和密码不能为空')
    }

    // 调用服务层登录
    const user = await userService.login(phone, password)

    // 生成 JWT Token
    const token = generateToken(user)

    // 返回用户信息和 Token
    success(res, {
      user,
      token,
    }, '登录成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id

    // 调用服务层获取用户信息
    const user = await userService.getCurrentUser(userId)

    success(res, user)
  } catch (error) {
    next(error)
  }
}

/**
 * 根据 ID 获取用户信息
 */
export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string }

    // 调用服务层获取用户信息
    const user = await userService.getUserById(id)

    success(res, user)
  } catch (error) {
    next(error)
  }
}

/**
 * 更新用户信息
 */
export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { nickname, avatar, bio, email } = req.body

    // 调用服务层更新用户信息
    const user = await userService.updateUser(userId, {
      nickname,
      avatar,
      bio,
      email,
    })

    success(res, user, '更新成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 修改密码
 */
export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { oldPassword, newPassword } = req.body

    // 参数验证
    if (!oldPassword || !newPassword) {
      throw new BadRequestError('旧密码和新密码不能为空')
    }

    // 新密码长度验证
    if (newPassword.length < 6) {
      throw new BadRequestError('新密码长度不能少于6位')
    }

    // 调用服务层修改密码
    await userService.changePassword(userId, oldPassword, newPassword)

    success(res, null, '密码修改成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 用户登出
 */
export async function logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 调用服务层登出（JWT 无状态，无需特殊处理）
    await userService.logout()

    success(res, null, '登出成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 删除用户
 */
export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as { id: string }

    // 调用服务层删除用户
    await userService.deleteUser(id)

    success(res, null, '删除成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 获取用户统计数据
 */
export async function getUserStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id

    // 调用服务层获取用户统计数据
    const stats = await userService.getUserStats(userId)

    success(res, stats)
  } catch (error) {
    next(error)
  }
}

export default {
  register,
  login,
  getCurrentUser,
  getUserById,
  updateUser,
  changePassword,
  logout,
  deleteUser,
  getUserStats,
}
