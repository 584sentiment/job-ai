/**
 * 评论服务层
 */
import PrismaConfig from '@/config/database'
import { NotFoundError, BadRequestError } from '@/utils/error'

const prisma = PrismaConfig.getInstance()

/**
 * 获取面经的评论列表（分页）
 */
export async function getCommentsByExperienceId(
  experienceId: string,
  page: number = 1,
  pageSize: number = 20
) {
  const skip = (page - 1) * pageSize

  // 并行查询评论列表和总数
  const [comments, total] = await Promise.all([
    prisma.experienceComment.findMany({
      where: {
        experienceId,
        parentId: null, // 只获取顶级评论
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        replyToUser: {
          select: {
            id: true,
            nickname: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
            replyToUser: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
          orderBy: {
            createTime: 'asc',
          },
        },
      },
      orderBy: {
        createTime: 'desc',
      },
      skip,
      take: pageSize,
    }),
    prisma.experienceComment.count({
      where: {
        experienceId,
        parentId: null,
      },
    }),
  ])

  return {
    list: comments,
    total,
    page,
    pageSize,
    pages: Math.ceil(total / pageSize),
  }
}

/**
 * 根据 ID 获取评论详情
 */
export async function getCommentById(id: string) {
  const comment = await prisma.experienceComment.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
      replyToUser: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  })

  if (!comment) {
    throw new NotFoundError('评论不存在')
  }

  return comment
}

/**
 * 创建评论
 */
export async function createComment(
  userId: string,
  data: {
    experienceId: string
    content: string
    parentId?: string
    replyToUserId?: string
  }
) {
  // 验证面经是否存在
  const experience = await prisma.experience.findUnique({
    where: { id: data.experienceId },
  })

  if (!experience) {
    throw new NotFoundError('面经不存在')
  }

  // 如果是回复评论，验证父评论是否存在
  if (data.parentId) {
    const parentComment = await prisma.experienceComment.findUnique({
      where: { id: data.parentId },
    })

    if (!parentComment) {
      throw new NotFoundError('父评论不存在')
    }

    if (parentComment.experienceId !== data.experienceId) {
      throw new BadRequestError('父评论不属于该面经')
    }
  }

  // 当前时间戳
  const now = BigInt(Date.now())

  // 创建评论
  const comment = await prisma.experienceComment.create({
    data: {
      experienceId: data.experienceId,
      userId,
      content: data.content,
      parentId: data.parentId,
      replyToUserId: data.replyToUserId,
      createTime: now,
      updateTime: now,
    },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
      replyToUser: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  })

  // 增加面经的评论数
  await prisma.experience.update({
    where: { id: data.experienceId },
    data: {
      comments: {
        increment: 1,
      },
    },
  })

  return comment
}

/**
 * 删除评论
 */
export async function deleteComment(id: string, userId: string) {
  const comment = await prisma.experienceComment.findUnique({
    where: { id },
  })

  if (!comment) {
    throw new NotFoundError('评论不存在')
  }

  // 只有评论作者或面经作者可以删除评论
  const experience = await prisma.experience.findUnique({
    where: { id: comment.experienceId },
    select: { userId: true },
  })

  if (comment.userId !== userId && experience?.userId !== userId) {
    throw new BadRequestError('无权删除此评论')
  }

  // 删除评论（级联删除回复）
  await prisma.experienceComment.delete({
    where: { id },
  })

  // 减少面经的评论数（需要计算实际删除的评论数，包括回复）
  const deletedCount = await prisma.experienceComment.count({
    where: {
      OR: [
        { id },
        { parentId: id },
      ],
    },
  })

  await prisma.experience.update({
    where: { id: comment.experienceId },
    data: {
      comments: {
        decrement: deletedCount,
      },
    },
  })

  return { success: true }
}

/**
 * 点赞评论
 */
export async function likeComment(id: string) {
  const comment = await prisma.experienceComment.findUnique({
    where: { id },
  })

  if (!comment) {
    throw new NotFoundError('评论不存在')
  }

  // 增加点赞数
  const updated = await prisma.experienceComment.update({
    where: { id },
    data: {
      likes: {
        increment: 1,
      },
    },
  })

  return { likes: updated.likes }
}

/**
 * 取消点赞评论
 */
export async function unlikeComment(id: string) {
  const comment = await prisma.experienceComment.findUnique({
    where: { id },
  })

  if (!comment) {
    throw new NotFoundError('评论不存在')
  }

  // 减少点赞数（确保不会小于0）
  const updated = await prisma.experienceComment.update({
    where: { id },
    data: {
      likes: {
        decrement: 1,
      },
    },
  })

  return { likes: Math.max(0, updated.likes) }
}

export default {
  getCommentsByExperienceId,
  getCommentById,
  createComment,
  deleteComment,
  likeComment,
  unlikeComment,
}
