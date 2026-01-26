/**
 * 用户服务层
 */
import bcrypt from 'bcrypt'
import PrismaConfig from '@/config/database'
import { BadRequestError, NotFoundError, UnauthorizedError } from '@/utils/error'
import type { User, Prisma } from '@prisma/client'

const prisma = PrismaConfig.getInstance()

export type UserCreateInput = Prisma.UserGetPayload<{}>

/**
 * 用户注册
 */
export async function register(phone: string, password: string, nickname?: string): Promise<User> {
  // 检查手机号是否已注册
  const existingUser = await prisma.user.findUnique({
    where: { phone },
  })

  if (existingUser) {
    throw new BadRequestError('该手机号已注册')
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 10)

  // 创建用户
  const user = await prisma.user.create({
    data: {
      phone,
      password: hashedPassword,
      nickname: nickname || phone.slice(-4), // 默认昵称为手机号后4位
    },
  })

  // 返回用户信息（不包含密码）
  return omitPassword(user)
}

/**
 * 用户登录
 */
export async function login(phone: string, password: string): Promise<User> {
  // 查找用户
  const user = await prisma.user.findUnique({
    where: { phone },
  })

  if (!user) {
    throw new UnauthorizedError('手机号或密码错误')
  }

  // 验证密码
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new UnauthorizedError('手机号或密码错误')
  }

  // 返回用户信息（不包含密码）
  return omitPassword(user)
}

/**
 * 根据 ID 获取用户信息
 */
export async function getUserById(id: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw new NotFoundError('用户不存在')
  }

  return omitPassword(user)
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(id: string): Promise<User> {
  return getUserById(id)
}

/**
 * 更新用户信息
 */
export async function updateUser(
  id: string,
  data: Prisma.UserUpdateInput
): Promise<User> {
  // 移除不允许更新的字段
  const { phone, password, ...allowedData } = data as any

  // 如果要更新手机号，检查是否已被占用
  if (phone && phone !== id) {
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    })

    if (existingUser && existingUser.id !== id) {
      throw new BadRequestError('该手机号已被使用')
    }
  }

  // 更新用户信息
  const user = await prisma.user.update({
    where: { id },
    data: allowedData,
  })

  return omitPassword(user)
}

/**
 * 修改密码
 */
export async function changePassword(
  id: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  // 获取用户信息
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw new NotFoundError('用户不存在')
  }

  // 验证旧密码
  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password)

  if (!isOldPasswordValid) {
    throw new UnauthorizedError('原密码错误')
  }

  // 加密新密码
  const hashedNewPassword = await bcrypt.hash(newPassword, 10)

  // 更新密码
  await prisma.user.update({
    where: { id },
    data: { password: hashedNewPassword },
  })
}

/**
 * 删除用户
 */
export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({
    where: { id },
  })
}

/**
 * 用户登出（无状态 JWT，客户端删除 Token 即可）
 */
export async function logout(): Promise<void> {
  // JWT 无状态，无需服务端处理
  // 未来可以添加 Token 黑名单功能
}

/**
 * 移除用户密码字段
 */
function omitPassword(user: User): Omit<User, 'password'> {
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

export default {
  register,
  login,
  getUserById,
  getCurrentUser,
  updateUser,
  changePassword,
  deleteUser,
  logout,
}
