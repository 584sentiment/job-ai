/**
 * 面经服务层
 */
import PrismaConfig from '@/config/database'
import { NotFoundError } from '@/utils/error'
import type { Experience, Prisma } from '@prisma/client'

const prisma = PrismaConfig.getInstance()

/**
 * 分页查询面经列表
 */
export async function getExperiencesPaginated(
  userId: string,
  params: {
    page?: number
    pageSize?: number
    positionId?: string
    tags?: string[]
    isFavorite?: number
  }
): Promise<{
  list: Experience[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}> {
  const { page = 1, pageSize = 10, positionId, tags, isFavorite } = params

  // 构建查询条件
  const where: Prisma.ExperienceWhereInput = {
    userId,
  }

  // 岗位筛选
  if (positionId) {
    where.positionId = positionId
  }

  // 标签筛选（有交集即可）
  if (tags && tags.length > 0) {
    where.tags = {
      hasSome: tags,
    }
  }

  // 收藏筛选（前端使用 0/1）
  if (isFavorite !== undefined) {
    where.isFavorite = isFavorite
  }

  // 查询总数
  const total = await prisma.experience.count({ where })

  // 分页查询
  const list = await prisma.experience.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createTime: 'desc' },
  })

  return {
    list,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

/**
 * 获取所有面经（不分页，用于下拉选择等）
 */
export async function getAllExperiences(userId: string): Promise<Experience[]> {
  return prisma.experience.findMany({
    where: {
      userId,
    },
    orderBy: { createTime: 'desc' },
  })
}

/**
 * 搜索面经
 */
export async function searchExperiences(
  userId: string,
  keyword: string
): Promise<Experience[]> {
  return prisma.experience.findMany({
    where: {
      userId,
      OR: [
        { companyName: { contains: keyword, mode: 'insensitive' } },
        { positionName: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } },
      ],
    },
    orderBy: { createTime: 'desc' },
  })
}

/**
 * 根据 ID 获取面经详情
 */
export async function getExperienceById(id: string, userId: string): Promise<Experience> {
  const experience = await prisma.experience.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!experience) {
    throw new NotFoundError('面经不存在')
  }

  // 增加浏览次数
  await prisma.experience.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  })

  return experience
}

/**
 * 创建面经
 */
export async function createExperience(
  userId: string,
  data: Prisma.ExperienceCreateInput
): Promise<Experience> {
  return prisma.experience.create({
    data: {
      ...data,
      userId,
    },
  })
}

/**
 * 更新面经
 */
export async function updateExperience(
  id: string,
  userId: string,
  data: Prisma.ExperienceUpdateInput
): Promise<Experience> {
  // 检查面经是否存在
  const existing = await prisma.experience.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    throw new NotFoundError('面经不存在')
  }

  // 更新面经
  return prisma.experience.update({
    where: { id },
    data,
  })
}

/**
 * 删除面经
 */
export async function deleteExperience(id: string, userId: string): Promise<void> {
  // 检查面经是否存在
  const existing = await prisma.experience.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    throw new NotFoundError('面经不存在')
  }

  // 删除面经
  await prisma.experience.delete({
    where: { id },
  })
}

/**
 * 批量删除面经
 */
export async function batchDeleteExperiences(ids: string[], userId: string): Promise<void> {
  // 验证所有面经是否都属于当前用户
  const experiences = await prisma.experience.findMany({
    where: {
      id: { in: ids },
      userId,
    },
  })

  if (experiences.length !== ids.length) {
    throw new NotFoundError('部分面经不存在或不属于当前用户')
  }

  // 批量删除
  await prisma.experience.deleteMany({
    where: {
      id: { in: ids },
      userId,
    },
  })
}

/**
 * 切换面经收藏状态（0/1）
 */
export async function toggleFavoriteExperience(id: string, userId: string): Promise<Experience> {
  // 检查面经是否存在
  const existing = await prisma.experience.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    throw new NotFoundError('面经不存在')
  }

  // 切换收藏状态（0 -> 1, 1 -> 0）
  return prisma.experience.update({
    where: { id },
    data: {
      isFavorite: existing.isFavorite === 1 ? 0 : 1,
    },
  })
}

export default {
  getExperiencesPaginated,
  getAllExperiences,
  searchExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  batchDeleteExperiences,
  toggleFavoriteExperience,
}
