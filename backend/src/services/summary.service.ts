/**
 * 面试总结服务层
 */
import PrismaConfig from '@/config/database'
import { NotFoundError } from '@/utils/error'
import type { Summary, Prisma } from '@prisma/client'

const prisma = PrismaConfig.getInstance()

/**
 * 分页查询总结列表
 */
export async function getSummariesPaginated(
  userId: string,
  params: {
    page?: number
    pageSize?: number
    interviewId?: string
    positionId?: string
  }
): Promise<{
  list: Summary[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}> {
  const { page = 1, pageSize = 10, interviewId, positionId } = params

  // 构建查询条件
  const where: Prisma.SummaryWhereInput = {
    userId,
  }

  // 面试筛选
  if (interviewId) {
    where.interviewId = interviewId
  }

  // 岗位筛选
  if (positionId) {
    where.positionId = positionId
  }

  // 查询总数
  const total = await prisma.summary.count({ where })

  // 分页查询
  const list = await prisma.summary.findMany({
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
 * 根据 ID 获取总结详情
 */
export async function getSummaryById(id: string, userId: string): Promise<Summary> {
  const summary = await prisma.summary.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!summary) {
    throw new NotFoundError('总结不存在')
  }

  return summary
}

/**
 * 创建总结
 */
export async function createSummary(
  userId: string,
  data: Prisma.SummaryUncheckedCreateInput
): Promise<Summary> {
  // 当前时间戳
  const now = BigInt(Date.now())

  return prisma.summary.create({
    data: {
      ...data,
      userId,
      createTime: now,
      updateTime: now,
    },
  })
}

/**
 * 更新总结
 */
export async function updateSummary(
  id: string,
  userId: string,
  data: Prisma.SummaryUncheckedUpdateInput
): Promise<Summary> {
  // 检查总结是否存在
  const existing = await prisma.summary.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    throw new NotFoundError('总结不存在')
  }

  // 当前时间戳
  const now = BigInt(Date.now())

  // 更新总结
  return prisma.summary.update({
    where: { id },
    data: {
      ...data,
      updateTime: now,
    },
  })
}

/**
 * 删除总结
 */
export async function deleteSummary(id: string, userId: string): Promise<void> {
  // 检查总结是否存在
  const existing = await prisma.summary.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    throw new NotFoundError('总结不存在')
  }

  // 删除总结
  await prisma.summary.delete({
    where: { id },
  })
}

export default {
  getSummariesPaginated,
  getSummaryById,
  createSummary,
  updateSummary,
  deleteSummary,
}
