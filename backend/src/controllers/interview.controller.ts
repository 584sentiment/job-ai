/**
 * 面试控制器层
 */
import { Request, Response, NextFunction } from 'express'
import interviewService from '@/services/interview.service'
import { success, created, paginate } from '@/utils/response'
import { BadRequestError } from '@/utils/error'

/**
 * 分页查询面试记录
 */
export async function getInterviewsPaginated(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { page, pageSize, status, positionId } = req.body

    // 参数验证
    if (page !== undefined && (typeof page !== 'number' || page < 1)) {
      throw new BadRequestError('页码必须大于0')
    }

    if (pageSize !== undefined && (typeof pageSize !== 'number' || pageSize < 1 || pageSize > 100)) {
      throw new BadRequestError('每页数量必须在1-100之间')
    }

    // 调用服务层查询
    const result = await interviewService.getInterviewsPaginated(userId, {
      page: page || 1,
      pageSize: pageSize || 10,
      status,
      positionId,
    })

    paginate(res, result.list, result.total, result.page, result.pageSize)
  } catch (error) {
    next(error)
  }
}

/**
 * 获取岗位的面试列表
 */
export async function getInterviewsByPosition(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { positionId } = req.params

    // 调用服务层查询
    const interviews = await interviewService.getInterviewsByPosition(positionId, userId)

    success(res, interviews)
  } catch (error) {
    next(error)
  }
}

/**
 * 根据 ID 获取面试详情
 */
export async function getInterviewById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id } = req.params

    // 调用服务层查询
    const interview = await interviewService.getInterviewById(id, userId)

    success(res, interview)
  } catch (error) {
    next(error)
  }
}

/**
 * 创建面试记录
 */
export async function createInterview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const {
      positionId,
      company,
      position: positionName,
      round,
      date,
      time,
      location,
      form,
      status,
      aiPrepList,
    } = req.body

    // 参数验证
    if (!company || !positionName) {
      throw new BadRequestError('公司和职位名称不能为空')
    }

    // 调用服务层创建
    const interview = await interviewService.createInterview(userId, {
      positionId,
      company,
      position: positionName,
      round,
      date: date ? new Date(date) : null,
      time,
      location,
      form,
      status,
      aiPrepList,
    })

    created(res, interview, '创建成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 更新面试记录
 */
export async function updateInterview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const {
      id,
      positionId,
      company,
      position: positionName,
      round,
      date,
      time,
      location,
      form,
      status,
      aiPrepList,
      feedback,
      result,
    } = req.body

    // 参数验证
    if (!id) {
      throw new BadRequestError('面试记录ID不能为空')
    }

    if (!company || !positionName) {
      throw new BadRequestError('公司和职位名称不能为空')
    }

    // 调用服务层更新
    const interview = await interviewService.updateInterview(id, userId, {
      positionId,
      company,
      position: positionName,
      round,
      date: date ? new Date(date) : null,
      time,
      location,
      form,
      status,
      aiPrepList,
      feedback,
      result,
    })

    success(res, interview, '更新成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 删除面试记录
 */
export async function deleteInterview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id } = req.params

    // 调用服务层删除
    await interviewService.deleteInterview(id, userId)

    success(res, null, '删除成功')
  } catch (error) {
    next(error)
  }
}

export default {
  getInterviewsPaginated,
  getInterviewsByPosition,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
}
