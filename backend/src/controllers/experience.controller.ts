/**
 * 面经控制器层
 */
import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import experienceService from '@/services/experience.service'
import { success, paginate } from '@/utils/response'
import { BadRequestError } from '@/utils/error'

/**
 * 分页查询面经列表
 */
export async function getExperiencesPaginated(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { current, size, positionId, tags, isFavorite } = req.body

    // 参数验证
    if (current !== undefined && (typeof current !== 'number' || current < 1)) {
      throw new BadRequestError('页码必须大于0')
    }

    if (size !== undefined && (typeof size !== 'number' || size < 1 || size > 100)) {
      throw new BadRequestError('每页数量必须在1-100之间')
    }

    // 调用服务层查询
    const result = await experienceService.getExperiencesPaginated(userId, {
      page: current || 1,
      pageSize: size || 10,
      positionId,
      tags,
      isFavorite,
    })

    paginate(res, result.list, result.total, result.page, result.pageSize)
  } catch (error) {
    next(error)
  }
}

/**
 * 获取所有面经
 */
export async function getAllExperiences(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id

    // 调用服务层查询
    const experiences = await experienceService.getAllExperiences(userId)

    success(res, experiences)
  } catch (error) {
    next(error)
  }
}

/**
 * 搜索面经
 */
export async function searchExperiences(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { keyword } = req.body

    // 参数验证
    if (!keyword || typeof keyword !== 'string') {
      throw new BadRequestError('搜索关键词不能为空')
    }

    // 调用服务层搜索
    const experiences = await experienceService.searchExperiences(userId, keyword)

    success(res, experiences)
  } catch (error) {
    next(error)
  }
}

/**
 * 根据 ID 获取面经详情
 */
export async function getExperienceById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id } = req.params as { id: string }

    // 调用服务层查询
    const experience = await experienceService.getExperienceById(id, userId)

    success(res, experience)
  } catch (error) {
    next(error)
  }
}

/**
 * 创建面经
 */
export async function createExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const {
      positionId,
      companyName,
      positionName,
      interviewRound,
      interviewDate,
      content,
      contentType,
      tags,
      isAnonymous,
    } = req.body

    // 参数验证
    if (!companyName || !positionName || !content) {
      throw new BadRequestError('公司、职位名称和内容不能为空')
    }

    if (!interviewDate) {
      throw new BadRequestError('面试日期不能为空')
    }

    // 调用服务层创建
    const experience = await experienceService.createExperience(userId, {
      positionId,
      companyName,
      positionName,
      interviewRound,
      interviewDate: BigInt(interviewDate),
      content,
      contentType: contentType || 'markdown',
      tags: tags || [],
      isAnonymous: isAnonymous ?? 0,
    } as Prisma.ExperienceUncheckedCreateInput)

    success(res, experience, '创建成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 更新面经
 */
export async function updateExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const {
      id,
      positionId,
      companyName,
      positionName,
      interviewRound,
      interviewDate,
      content,
      contentType,
      tags,
      isAnonymous,
    } = req.body

    // 参数验证
    if (!id) {
      throw new BadRequestError('面经ID不能为空')
    }

    if (!companyName || !positionName || !content) {
      throw new BadRequestError('公司、职位名称和内容不能为空')
    }

    // 调用服务层更新
    const experience = await experienceService.updateExperience(id, userId, {
      positionId,
      companyName,
      positionName,
      interviewRound,
      interviewDate: interviewDate ? BigInt(interviewDate) : undefined,
      content,
      contentType,
      tags,
      isAnonymous,
    })

    success(res, experience, '更新成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 删除面经
 */
export async function deleteExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id } = req.params as { id: string }

    // 调用服务层删除
    await experienceService.deleteExperience(id, userId)

    success(res, null, '删除成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 批量删除面经
 */
export async function batchDeleteExperiences(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { ids } = req.body

    // 参数验证
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestError('请选择要删除的面经')
    }

    // 调用服务层批量删除
    await experienceService.batchDeleteExperiences(ids, userId)

    success(res, null, '批量删除成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 切换面经收藏状态
 */
export async function toggleFavoriteExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id } = req.params as { id: string }

    // 调用服务层切换收藏
    const experience = await experienceService.toggleFavoriteExperience(id, userId)

    success(res, experience, '操作成功')
  } catch (error) {
    next(error)
  }
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
