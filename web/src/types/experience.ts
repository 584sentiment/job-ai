/**
 * 面经相关类型定义
 * 与后端数据结构保持一致
 */
import type { ApiResponse } from './user'

// 重新导出 ApiResponse 以便其他模块使用
export type { ApiResponse }

/**
 * 面试轮次枚举（面经专用）
 */
export enum ExperienceRound {
  /** 笔试 */
  WRITTEN_TEST = '笔试',
  /** 一面 */
  FIRST_ROUND = '一面',
  /** 二面 */
  SECOND_ROUND = '二面',
  /** 三面 */
  THIRD_ROUND = '三面',
  /** 终面 */
  FINAL_ROUND = '终面',
  /** HR面 */
  HR_ROUND = 'HR面'
}

/**
 * 面经内容格式枚举
 */
export enum ExperienceContentType {
  /** 纯文本 */
  TEXT = 'text',
  /** Markdown */
  MARKDOWN = 'markdown',
  /** 富文本HTML */
  HTML = 'html'
}

/**
 * 面经实体（对应后端 Experience 实体）
 */
export interface Experience {
  /** 面经ID */
  id: string

  /** 关联岗位ID（可选） */
  positionId?: string

  /** 用户ID */
  userId?: string

  /** 公司名称 */
  companyName: string

  /** 岗位名称 */
  positionName: string

  /** 面试轮次 */
  interviewRound: string

  /** 面试日期（ISO 8601格式） */
  interviewDate: string

  /** 面经内容 */
  content: string

  /** 内容格式 */
  contentType: string

  /** 标签数组 */
  tags: string[]

  /** 是否收藏（0/1） */
  isFavorite: number

  /** 是否匿名（0/1） */
  isAnonymous: number

  /** 浏览次数 */
  views: number

  /** 评论数量 */
  comments: number

  /** 创建时间 */
  createTime: string

  /** 更新时间 */
  updateTime: string
}

/**
 * 面经创建请求
 */
export interface ExperienceCreateRequest {
  /** 关联岗位ID（可选） */
  positionId?: string

  /** 公司名称 */
  companyName: string

  /** 岗位名称 */
  positionName: string

  /** 面试轮次 */
  interviewRound: string

  /** 面试日期（ISO 8601格式） */
  interviewDate: string

  /** 面经内容 */
  content: string

  /** 内容格式（默认markdown） */
  contentType?: string

  /** 标签数组 */
  tags?: string[]

  /** 是否匿名（默认0） */
  isAnonymous?: number
}

/**
 * 面经更新请求
 */
export interface ExperienceUpdateRequest {
  /** 面经ID */
  id: string

  /** 关联岗位ID（可选） */
  positionId?: string

  /** 公司名称 */
  companyName?: string

  /** 岗位名称 */
  positionName?: string

  /** 面试轮次 */
  interviewRound?: string

  /** 面试日期（ISO 8601格式） */
  interviewDate?: string

  /** 面经内容 */
  content?: string

  /** 内容格式 */
  contentType?: string

  /** 标签数组 */
  tags?: string[]

  /** 是否匿名（0/1） */
  isAnonymous?: number
}

/**
 * 面经列表响应
 */
export type ExperienceListResponse = ApiResponse<Experience[]>

/**
 * 面经响应
 */
export type ExperienceResponse = ApiResponse<Experience>

/**
 * 面经查询参数
 */
export interface ExperienceQueryParams {
  /** 关联岗位ID */
  positionId?: string

  /** 公司名称（搜索） */
  companyName?: string

  /** 岗位名称（搜索） */
  positionName?: string

  /** 关键词搜索 */
  keyword?: string

  /** 是否收藏（0/1） */
  isFavorite?: number

  /** 标签筛选 */
  tags?: string[]

  /** 当前页码 */
  current: number

  /** 每页大小 */
  size: number

  /** 排序字段 */
  sortField?: 'createTime' | 'updateTime' | 'views' | 'comments'

  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 面经统计信息
 */
export interface ExperienceStats {
  /** 总面经数 */
  total: number

  /** 收藏数 */
  favorites: number

  /** 总浏览量 */
  totalViews: number

  /** 总评论数 */
  totalComments: number

  /** 按轮次统计 */
  byRound: {
    [key: string]: number
  }

  /** 按公司统计 */
  byCompany: {
    [key: string]: number
  }

  /** 按标签统计 */
  byTags: {
    [key: string]: number
  }
}

/**
 * 面经评论实体
 */
export interface ExperienceComment {
  /** 评论ID */
  id: string

  /** 面经ID */
  experienceId: string

  /** 用户ID */
  userId: string

  /** 用户昵称 */
  userNickname: string

  /** 用户头像 */
  userAvatar: string

  /** 父评论ID（0表示一级评论） */
  parentId: number

  /** 被回复的用户ID */
  replyToUserId?: number

  /** 被回复的用户昵称 */
  replyToNickname?: string

  /** 评论内容 */
  content: string

  /** 点赞数 */
  likes: number

  /** 是否点赞（当前用户） */
  isLiked: boolean

  /** 创建时间 */
  createTime: string

  /** 更新时间 */
  updateTime: string
}

/**
 * 评论创建请求
 */
export interface ExperienceCommentCreateRequest {
  /** 面经ID */
  experienceId: string

  /** 父评论ID（可选，用于回复评论） */
  parentId?: string

  /** 被回复的用户ID（可选） */
  replyToUserId?: string

  /** 评论内容 */
  content: string
}

/**
 * 评论列表响应
 */
export type ExperienceCommentListResponse = ApiResponse<ExperienceComment[]>

/**
 * 收藏操作响应
 */
export interface ExperienceFavoriteResponse {
  /** 是否收藏 */
  isFavorite: boolean

  /** 收藏总数 */
  totalFavorites: number
}
