/**
 * 面经相关类型定义
 */

import type { ApiResponse, PageResponse, PageParams } from './common'
import { ExperienceRound, ExperienceContentType } from './enums'

/**
 * 面经信息
 */
export interface Experience {
  /** 面经ID */
  id: string
  /** 岗位ID */
  positionId?: string
  /** 用户ID */
  userId: string
  /** 公司名称 */
  companyName: string
  /** 岗位名称 */
  positionName: string
  /** 面试轮次 */
  interviewRound: ExperienceRound
  /** 面试日期（时间戳） */
  interviewDate: number
  /** 面经内容 */
  content: string
  /** 内容类型 */
  contentType: ExperienceContentType
  /** 标签 */
  tags: string[]
  /** 是否收藏 (0: 否, 1: 是) */
  isFavorite: number
  /** 是否匿名 (0: 否, 1: 是) */
  isAnonymous: number
  /** 浏览次数 */
  views: number
  /** 评论数 */
  comments: number
  /** 创建时间 */
  createTime: number
  /** 更新时间 */
  updateTime: number
}

/**
 * 面经查询参数
 */
export interface ExperienceQueryParams extends PageParams {
  /** 面经ID */
  id?: string
  /** 岗位ID */
  positionId?: string
  /** 搜索关键字 */
  keyword?: string
  /** 公司名称 */
  companyName?: string
  /** 岗位名称 */
  positionName?: string
  /** 面试轮次 */
  interviewRound?: ExperienceRound
  /** 面试日期开始 */
  interviewDateStart?: string
  /** 面试日期结束 */
  interviewDateEnd?: string
  /** 标签 */
  tags?: string[]
  /** 是否收藏 */
  isFavorite?: number
}

/**
 * 面经创建请求
 */
export interface ExperienceCreateRequest {
  /** 岗位ID */
  positionId?: string
  /** 公司名称 */
  companyName: string
  /** 岗位名称 */
  positionName: string
  /** 面试轮次 */
  interviewRound: ExperienceRound
  /** 面试日期（时间戳） */
  interviewDate: number
  /** 面经内容 */
  content: string
  /** 内容类型 */
  contentType?: ExperienceContentType
  /** 标签 */
  tags?: string[]
  /** 是否匿名 (0: 否, 1: 是) */
  isAnonymous?: number
}

/**
 * 面经更新请求
 */
export interface ExperienceUpdateRequest {
  /** 面经ID */
  id: string
  /** 岗位ID */
  positionId?: string
  /** 公司名称 */
  companyName?: string
  /** 岗位名称 */
  positionName?: string
  /** 面试轮次 */
  interviewRound?: ExperienceRound
  /** 面试日期（时间戳） */
  interviewDate?: number
  /** 面经内容 */
  content?: string
  /** 内容类型 */
  contentType?: ExperienceContentType
  /** 标签 */
  tags?: string[]
  /** 是否收藏 (0: 否, 1: 是) */
  isFavorite?: number
  /** 是否匿名 (0: 否, 1: 是) */
  isAnonymous?: number
}

/**
 * 面经列表响应
 */
export type ExperienceListResponse = ApiResponse<PageResponse<Experience>>

/**
 * 面经详情响应
 */
export type ExperienceDetailResponse = ApiResponse<Experience>

/**
 * 面经统计
 */
export interface ExperienceStats {
  /** 总面经数 */
  total: number
  /** 本月新增 */
  thisMonth: number
  /** 按公司统计 */
  byCompany: Array<{
    company: string
    count: number
  }>
  /** 按轮次统计 */
  byRound: Array<{
    round: ExperienceRound
    count: number
  }>
}
