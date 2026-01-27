/**
 * 岗位控制器层
 */
import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import positionService from '@/services/position.service'
import { success, paginate } from '@/utils/response'
import { BadRequestError } from '@/utils/error'

/**
 * 分页查询岗位列表
 */
export async function getPositionsPaginated(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { current, size, status, keyword, isCollected } = req.body

    // 参数验证
    if (current !== undefined && (typeof current !== 'number' || current < 1)) {
      throw new BadRequestError('页码必须大于0')
    }

    if (size !== undefined && (typeof size !== 'number' || size < 1 || size > 100)) {
      throw new BadRequestError('每页数量必须在1-100之间')
    }

    // 调用服务层查询
    const result = await positionService.getPositionsPaginated(userId, {
      page: current || 1,
      pageSize: size || 10,
      status,
      keyword,
      isCollected,
    })

    paginate(res, result.list, result.total, result.page, result.pageSize)
  } catch (error) {
    next(error)
  }
}

/**
 * 根据 ID 获取岗位详情
 */
export async function getPositionById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id } = req.params

    // 调用服务层查询
    const position = await positionService.getPositionById(id as string, userId)

    success(res, position)
  } catch (error) {
    next(error)
  }
}

/**
 * 创建岗位
 */
export async function createPosition(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const {
      companyName,
      positionName,
      deliveryChannel,
      deliveryDate,
      workLocation,
      salaryRange,
      jobDescription,
      contactName,
      contactPhone,
      remarks,
      status,
      isCollected,
    } = req.body

    // 参数验证
    if (!companyName || !positionName) {
      throw new BadRequestError('公司和职位名称不能为空')
    }

    if (!deliveryChannel) {
      throw new BadRequestError('投递渠道不能为空')
    }

    if (!deliveryDate) {
      throw new BadRequestError('投递日期不能为空')
    }

    // 调用服务层创建
    const position = await positionService.createPosition(userId, {
      companyName,
      positionName,
      deliveryChannel,
      deliveryDate: BigInt(deliveryDate),
      workLocation,
      salaryRange,
      jobDescription,
      contactName,
      contactPhone,
      remarks,
      status,
      isCollected: isCollected ?? 0,
    } as Prisma.PositionUncheckedCreateInput)

    success(res, position, '创建成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 更新岗位
 */
export async function updatePosition(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const {
      id,
      companyName,
      positionName,
      deliveryChannel,
      deliveryDate,
      workLocation,
      salaryRange,
      jobDescription,
      contactName,
      contactPhone,
      remarks,
      status,
      isCollected,
    } = req.body

    // 参数验证
    if (!id) {
      throw new BadRequestError('岗位ID不能为空')
    }

    if (!companyName || !positionName) {
      throw new BadRequestError('公司和职位名称不能为空')
    }

    // 调用服务层更新
    const position = await positionService.updatePosition(id, userId, {
      companyName,
      positionName,
      deliveryChannel,
      deliveryDate: deliveryDate ? BigInt(deliveryDate) : undefined,
      workLocation,
      salaryRange,
      jobDescription,
      contactName,
      contactPhone,
      remarks,
      status,
      isCollected,
    })

    success(res, position, '更新成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 删除岗位
 */
export async function deletePosition(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id } = req.params

    // 调用服务层删除
    await positionService.deletePosition(id as string, userId)

    success(res, null, '删除成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 切换岗位收藏状态
 */
export async function toggleCollectPosition(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 从中间件获取用户 ID
    const userId = req.user!.id
    const { id } = req.params

    // 调用服务层切换收藏
    const position = await positionService.toggleCollectPosition(id as string, userId)

    success(res, position, '操作成功')
  } catch (error) {
    next(error)
  }
}

export default {
  getPositionsPaginated,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
  toggleCollectPosition,
}
