/**
 * 面试总结相关类型定义
 */

import type { ApiResponse, PageResponse, PageParams } from './common'
import { InterviewRound } from './enums'

/**
 * 面试总结
 */
export interface Summary {
  /** 总结ID */
  id: string
  /** 岗位ID */
  positionId?: string
  /** 面试ID */
  interviewId?: string
  /** 用户ID */
  userId: string
  /** 公司名称 */
  companyName: string
  /** 岗位名称 */
  positionName: string
  /** 面试轮次 */
  interviewRound?: string
  /** 总结内容（结构化数据，JSON 格式） */
  content: {
    /** 总结内容 */
    content: string
    /** 亮点 */
    highlights: string[]
    /** 改进点 */
    improvements: string[]
  }
  /** 面试轮次 */
  round?: string
  /** 面试日期（时间戳） */
  date?: number
  /** 备注数 */
  remarkCount: number
  /** 创建时间 */
  createTime: number
  /** 更新时间 */
  updateTime: number
}

/**
 * 总结查询参数
 */
export interface SummaryQueryParams extends PageParams {
  /** 总结ID */
  id?: string
  /** 岗位ID */
  positionId?: string
  /** 面试ID */
  interviewId?: string
  /** 搜索关键字 */
  keyword?: string
  /** 公司名称 */
  companyName?: string
  /** 岗位名称 */
  positionName?: string
  /** 面试轮次 */
  interviewRound?: InterviewRound
}

/**
 * 总结创建请求
 */
export interface SummaryCreateRequest {
  /** 岗位ID */
  positionId?: string
  /** 面试ID */
  interviewId?: string
  /** 公司名称 */
  companyName: string
  /** 岗位名称 */
  positionName: string
  /** 面试轮次 */
  interviewRound?: string
  /** 总结内容 */
  content: {
    content: string
    highlights: string[]
    improvements: string[]
  }
  /** 面试轮次 */
  round?: string
  /** 面试日期（时间戳） */
  date?: number
}

/**
 * 总结更新请求
 */
export interface SummaryUpdateRequest {
  /** 总结ID */
  id: string
  /** 岗位ID */
  positionId?: string
  /** 面试ID */
  interviewId?: string
  /** 公司名称 */
  companyName?: string
  /** 岗位名称 */
  positionName?: string
  /** 面试轮次 */
  interviewRound?: string
  /** 总结内容 */
  content?: {
    content: string
    highlights: string[]
    improvements: string[]
  }
  /** 面试轮次 */
  round?: string
  /** 面试日期（时间戳） */
  date?: number
}

/**
 * 总结列表响应
 */
export type SummaryListResponse = ApiResponse<PageResponse<Summary>>

/**
 * 总结详情响应
 */
export type SummaryDetailResponse = ApiResponse<Summary>
