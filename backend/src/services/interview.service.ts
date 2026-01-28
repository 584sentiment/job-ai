/**
 * 面试服务层
 */
import PrismaConfig from '@/config/database'
import { NotFoundError } from '@/utils/error'
import { INITIAL_INTERVIEW_ROUND, INITIAL_INTERVIEW_FORM } from '@/constants'
import type { Interview, Prisma } from '@prisma/client'

const prisma = PrismaConfig.getInstance()

/**
 * 分页查询面试记录
 */
export async function getInterviewsPaginated(
  userId: string,
  params: {
    page?: number
    pageSize?: number
    status?: number
    positionId?: string
  }
): Promise<{
  list: Interview[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}> {
  const { page = 1, pageSize = 10, status, positionId } = params

  // 构建查询条件
  const where: Prisma.InterviewWhereInput = {
    userId,
  }

  // 状态筛选
  if (status !== undefined) {
    where.status = status
  }

  // 岗位筛选
  if (positionId) {
    where.positionId = positionId
  }

  // 查询总数
  const total = await prisma.interview.count({ where })

  // 分页查询
  const list = await prisma.interview.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { interviewTime: 'desc' },
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
 * 获取岗位的面试列表
 */
export async function getInterviewsByPosition(positionId: string, userId: string): Promise<Interview[]> {
  // 验证岗位是否存在且属于当前用户
  const position = await prisma.position.findFirst({
    where: {
      id: positionId,
      userId,
    },
  })

  if (!position) {
    throw new NotFoundError('岗位不存在')
  }

  return prisma.interview.findMany({
    where: {
      positionId,
      userId,
    },
    orderBy: { interviewTime: 'desc' },
  })
}

/**
 * 根据 ID 获取面试详情
 */
export async function getInterviewById(id: string, userId: string): Promise<Interview> {
  const interview = await prisma.interview.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!interview) {
    throw new NotFoundError('面试记录不存在')
  }

  return interview
}

/**
 * 创建面试记录
 */
export async function createInterview(
  userId: string,
  data: Prisma.InterviewUncheckedCreateInput
): Promise<Interview> {
  // 当前时间戳
  const now = BigInt(Date.now())

  // 创建面试记录
  const interview = await prisma.interview.create({
    data: {
      ...data,
      userId,
      createTime: now,
      updateTime: now,
    },
  })

  // 自动流转逻辑：检查是否是第一个真实面试
  // 如果是第一个真实面试，自动将岗位状态更新为"流程中"
  const allInterviews = await prisma.interview.findMany({
    where: {
      positionId: data.positionId,
      userId,
    },
  })

  // 检查是否包含初始投递记录
  const hasInitialRecord = allInterviews.some(
    r => r.interviewRound === INITIAL_INTERVIEW_ROUND && r.interviewForm === INITIAL_INTERVIEW_FORM
  )

  // 如果有初始记录且只有一条初始记录（说明这是第一个真实面试）
  if (hasInitialRecord && allInterviews.length === 2) {
    // 更新岗位状态为"流程中"（'2'）
    await prisma.position.update({
      where: { id: data.positionId },
      data: {
        status: '2',
        updateTime: now,
      },
    })
  }
  // 如果没有初始记录且这是第一条记录，说明是旧数据，不需要自动流转
  // 这种情况保持原样

  return interview
}

/**
 * 更新面试记录
 */
export async function updateInterview(
  id: string,
  userId: string,
  data: Prisma.InterviewUncheckedUpdateInput
): Promise<Interview> {
  // 检查面试记录是否存在
  const interview = await getInterviewById(id, userId)

  // 检查是否是初始投递记录
  if (interview.interviewRound === INITIAL_INTERVIEW_ROUND &&
      interview.interviewForm === INITIAL_INTERVIEW_FORM) {
    throw new Error('初始投递记录不能编辑')
  }

  // 当前时间戳
  const now = BigInt(Date.now())

  // 更新面试记录
  return prisma.interview.update({
    where: { id },
    data: {
      ...data,
      updateTime: now,
    },
  })
}

/**
 * 删除面试记录
 */
export async function deleteInterview(id: string, userId: string): Promise<void> {
  // 检查面试记录是否存在
  const interview = await getInterviewById(id, userId)

  // 检查是否是初始投递记录
  if (interview.interviewRound === INITIAL_INTERVIEW_ROUND &&
      interview.interviewForm === INITIAL_INTERVIEW_FORM) {
    throw new Error('初始投递记录不能删除')
  }

  // 删除面试记录
  await prisma.interview.delete({
    where: { id },
  })
}

export default {
  getInterviewsPaginated,
  getInterviewsByPosition,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
}
