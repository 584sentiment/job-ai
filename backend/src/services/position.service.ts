/**
 * 岗位服务层
 */
import PrismaConfig from '@/config/database'
import { NotFoundError } from '@/utils/error'
import { INITIAL_INTERVIEW_STATUS, INITIAL_INTERVIEW_ROUND, INITIAL_INTERVIEW_FORM } from '@/constants'
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

  // 创建岗位
  const position = await prisma.position.create({
    data: {
      ...data,
      userId,
      createTime: now,
      updateTime: now,
    },
  })

  // 根据投递状态自动创建初始面试记录
  // 如果是已投递状态（'1' 或其他已投递相关状态），创建已投递记录；否则创建未投递记录
  const isDelivered = data.status === '1' || data.status === 'applied' || data.status === 'interview'
  const initialInterviewStatus = isDelivered
    ? INITIAL_INTERVIEW_STATUS.DELIVERED
    : INITIAL_INTERVIEW_STATUS.NOT_DELIVERED

  await prisma.interview.create({
    data: {
      positionId: position.id,
      userId,
      interviewRound: INITIAL_INTERVIEW_ROUND,
      interviewTime: data.deliveryDate || now,  // 使用投递日期作为面试时间
      interviewLocation: '-',
      interviewForm: INITIAL_INTERVIEW_FORM,
      status: initialInterviewStatus,
      createTime: now,
      updateTime: now,
    },
  })

  return position
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
  const position = await prisma.position.update({
    where: { id },
    data: {
      ...data,
      updateTime: now,
    },
  })

  // 如果更新了状态，需要检查是否需要同步更新面试记录
  if (data.status !== undefined) {
    // 查询该岗位的所有面试记录，按时间倒序排列
    const interviews = await prisma.interview.findMany({
      where: {
        positionId: id,
        userId,
      },
      orderBy: {
        interviewTime: 'desc',
      },
    })

    if (interviews.length === 0) {
      // 没有面试记录，不做处理
      return position
    }

    // 检查是否有初始投递记录
    const initialInterview = interviews.find(
      r => r.interviewRound === INITIAL_INTERVIEW_ROUND && r.interviewForm === INITIAL_INTERVIEW_FORM
    )

    if (initialInterview && interviews.length === 1) {
      // 只有初始面试记录（没有其他面试记录），则同步更新初始面试记录的状态
      const isDelivered = data.status === '1' || data.status === 'applied' || data.status === 'interview'
      const newInterviewStatus = isDelivered
        ? INITIAL_INTERVIEW_STATUS.DELIVERED
        : INITIAL_INTERVIEW_STATUS.NOT_DELIVERED

      // 更新初始面试记录的状态
      await prisma.interview.update({
        where: { id: initialInterview.id },
        data: {
          status: newInterviewStatus,
          updateTime: now,
        },
      })
    } else {
      // 有真实面试记录，更新最新的真实面试记录状态为已完成（status=1）
      const latestRealInterview = interviews.find(
        r => r.interviewRound !== INITIAL_INTERVIEW_ROUND || r.interviewForm !== INITIAL_INTERVIEW_FORM
      )

      if (latestRealInterview) {
        // 更新最新的真实面试记录为已完成状态
        await prisma.interview.update({
          where: { id: latestRealInterview.id },
          data: {
            status: 1, // 已完成
            updateTime: now,
          },
        })
      }
    }
  }

  return position
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
