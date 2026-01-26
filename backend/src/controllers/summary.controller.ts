/**
 * 面试总结控制器层
 */
import { Request, Response, NextFunction } from 'express'
import summaryService from '@/services/summary.service'
import { success, created, paginate } from '@/utils/response'
import { BadRequestError } from '@/utils/error'

/**
 * 分页查询总结列表
 */
export async function getSummariesPaginated(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { page, pageSize, interviewId, positionId } = req.body

    // 参数验证
    if (page !== undefined && (typeof page !== 'number' || page < 1)) {
      throw new BadRequestError('页码必须大于0')
    }

    if (pageSize !== undefined && (typeof pageSize !== 'number' || pageSize < 1 || pageSize > 100)) {
      throw new BadRequestError('每页数量必须在1-100之间')
    }

    // 调用服务层查询
    const result = await summaryService.getSummariesPaginated(userId, {
      page: page || 1,
      pageSize: pageSize || 10,
      interviewId,
      positionId,
    })

    paginate(res, result.list, result.total, result.page, result.pageSize)
  } catch (error) {
    next(error)
  }
}

/**
 * 根据 ID 获取总结详情
 */
export async function getSummaryById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id } = req.params

    // 调用服务层查询
    const summary = await summaryService.getSummaryById(id, userId)

    success(res, summary)
  } catch (error) {
    next(error)
  }
}

/**
 * 创建总结
 */
export async function createSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { interviewId, positionId, company, position: positionName, round, content } = req.body

    // 参数验证
    if (!company || !positionName || !content) {
      throw new BadRequestError('公司、职位名称和内容不能为空')
    }

    // 调用服务层创建
    const summary = await summaryService.createSummary(userId, {
      interviewId,
      positionId,
      company,
      position: positionName,
      round,
      content,
    })

    success(res, summary, '创建成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 更新总结
 */
export async function updateSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id, interviewId, positionId, company, position: positionName, round, content } = req.body

    // 参数验证
    if (!id) {
      throw new BadRequestError('总结ID不能为空')
    }

    if (!company || !positionName || !content) {
      throw new BadRequestError('公司、职位名称和内容不能为空')
    }

    // 调用服务层更新
    const summary = await summaryService.updateSummary(id, userId, {
      interviewId,
      positionId,
      company,
      position: positionName,
      round,
      content,
    })

    success(res, summary, '更新成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 删除总结
 */
export async function deleteSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id } = req.params

    // 调用服务层删除
    await summaryService.deleteSummary(id, userId)

    success(res, null, '删除成功')
  } catch (error) {
    next(error)
  }
}

export default {
  getSummariesPaginated,
  getSummaryById,
  createSummary,
  updateSummary,
  deleteSummary,
}
