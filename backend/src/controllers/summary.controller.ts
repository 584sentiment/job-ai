/**
 * 面试总结控制器层
 */
import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import summaryService from '@/services/summary.service'
import { success, paginate } from '@/utils/response'
import { BadRequestError } from '@/utils/error'

/**
 * 分页查询总结列表
 */
export async function getSummariesPaginated(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { current, size, interviewId, positionId } = req.body

    // 参数验证
    if (current !== undefined && (typeof current !== 'number' || current < 1)) {
      throw new BadRequestError('页码必须大于0')
    }

    if (size !== undefined && (typeof size !== 'number' || size < 1 || size > 100)) {
      throw new BadRequestError('每页数量必须在1-100之间')
    }

    // 调用服务层查询
    const result = await summaryService.getSummariesPaginated(userId, {
      page: current || 1,
      pageSize: size || 10,
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
    const { id } = req.params as { id: string }

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
    const { interviewId, positionId, companyName, positionName, round, content } = req.body

    // 参数验证
    if (!companyName || !positionName || !content) {
      throw new BadRequestError('公司、职位名称和内容不能为空')
    }

    // 调用服务层创建
    const summary = await summaryService.createSummary(userId, {
      interviewId,
      positionId,
      companyName,
      positionName,
      round,
      content,
    } as Prisma.SummaryUncheckedCreateInput)

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
    const { id, interviewId, positionId, companyName, positionName, round, content } = req.body

    // 参数验证
    if (!id) {
      throw new BadRequestError('总结ID不能为空')
    }

    if (!companyName || !positionName || !content) {
      throw new BadRequestError('公司、职位名称和内容不能为空')
    }

    // 调用服务层更新
    const summary = await summaryService.updateSummary(id, userId, {
      interviewId,
      positionId,
      companyName,
      positionName,
      round,
      content,
    } as Prisma.SummaryUncheckedUpdateInput)

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
    const { id } = req.params as { id: string }

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
