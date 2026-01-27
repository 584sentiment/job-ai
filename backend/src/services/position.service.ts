/**
 * 岗位服务层
 */
import PrismaConfig from '@/config/database'
import { NotFoundError } from '@/utils/error'
import type { Position, Prisma } from '@prisma/client'

const prisma = PrismaConfig.getInstance()

/**
 * 分页查询岗位列表
 */
export async function getPositionsPaginated(
  userId: string,
  params: {
    page?: number
    pageSize?: number
    status?: string
    keyword?: string
    isCollected?: number
  }
): Promise<{
  list: Position[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}> {
  const { page = 1, pageSize = 10, status, keyword, isCollected } = params

  // 构建查询条件
  const where: Prisma.PositionWhereInput = {
    userId,
  }

  // 状态筛选
  if (status) {
    where.status = status
  }

  // 收藏筛选（前端使用 0/1）
  if (isCollected !== undefined) {
    where.isCollected = isCollected
  }

  // 关键词搜索（更新字段名）
  if (keyword) {
    where.OR = [
      { companyName: { contains: keyword, mode: 'insensitive' } },
      { positionName: { contains: keyword, mode: 'insensitive' } },
    ]
  }

  // 查询总数
  const total = await prisma.position.count({ where })

  // 分页查询
  const list = await prisma.position.findMany({
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
 * 根据 ID 获取岗位详情
 */
export async function getPositionById(id: string, userId: string): Promise<Position & { interviewRecordList: any[] }> {
  const position = await prisma.position.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!position) {
    throw new NotFoundError('岗位不存在')
  }

  // 查询该岗位的面试记录
  const interviews = await prisma.interview.findMany({
    where: {
      positionId: id,
      userId,
    },
    orderBy: {
      interviewTime: 'asc',
    },
    select: {
      id: true,
      interviewRound: true,
      interviewTime: true,
      interviewLocation: true,
      interviewForm: true,
      status: true,
      createTime: true,
    },
  })

  return {
    ...position,
    interviewRecordList: interviews,
  }
}

/**
 * 创建岗位
 */
export async function createPosition(
  userId: string,
  data: Prisma.PositionUncheckedCreateInput
): Promise<Position> {
  // 当前时间戳
  const now = BigInt(Date.now())

  return prisma.position.create({
    data: {
      ...data,
      userId,
      createTime: now,
      updateTime: now,
    },
  })
}

/**
 * 更新岗位
 */
export async function updatePosition(
  id: string,
  userId: string,
  data: Prisma.PositionUncheckedUpdateInput
): Promise<Position> {
  // 检查岗位是否存在
  await getPositionById(id, userId)

  // 当前时间戳
  const now = BigInt(Date.now())

  // 更新岗位
  return prisma.position.update({
    where: { id },
    data: {
      ...data,
      updateTime: now,
    },
  })
}

/**
 * 删除岗位
 */
export async function deletePosition(id: string, userId: string): Promise<void> {
  // 检查岗位是否存在
  await getPositionById(id, userId)

  // 删除岗位
  await prisma.position.delete({
    where: { id },
  })
}

/**
 * 切换岗位收藏状态（0/1）
 */
export async function toggleCollectPosition(id: string, userId: string): Promise<Position> {
  // 检查岗位是否存在
  const existing = await getPositionById(id, userId)

  // 切换收藏状态（0 -> 1, 1 -> 0）
  return prisma.position.update({
    where: { id },
    data: {
      isCollected: existing.isCollected === 1 ? 0 : 1,
    },
  })
}

export default {
  getPositionsPaginated,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
  toggleCollectPosition,
}
