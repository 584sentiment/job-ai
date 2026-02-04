/**
 * 面试相关类型定义
 */

import type { ApiResponse, PageResponse, PageParams } from './common'
import { InterviewRound, InterviewForm } from './enums'

/**
 * 面试信息
 */
export interface Interview {
  /** 面试ID */
  id: string
  /** 岗位ID */
  positionId: string
  /** 用户ID */
  userId: string
  /** 面试轮次 */
  interviewRound: InterviewRound
  /** 面试时间（时间戳） */
  interviewTime: number
  /** 面试地点 */
  interviewLocation: string
  /** 面试形式 */
  interviewForm: InterviewForm
  /** 面试官信息 */
  interviewerInfo?: string
  /** 备注 */
  remarks?: string
  /** 状态 */
  status: number
  /** 创建时间 */
  createTime: number
  /** 更新时间 */
  updateTime: number
}

/**
 * 面试查询参数
 */
export interface InterviewQueryParams extends PageParams {
  /** 面试ID */
  id?: string
  /** 岗位ID */
  positionId?: string
  /** 搜索关键字 */
  keyword?: string
  /** 面试轮次 */
  interviewRound?: InterviewRound
  /** 面试形式 */
  interviewForm?: InterviewForm
  /** 面试时间开始 */
  interviewTimeStart?: string
  /** 面试时间结束 */
  interviewTimeEnd?: string
}

/**
 * 面试创建请求
 */
export interface InterviewCreateRequest {
  /** 岗位ID */
  positionId: string
  /** 面试轮次 */
  interviewRound: InterviewRound
  /** 面试时间（时间戳） */
  interviewTime: number
  /** 面试地点 */
  interviewLocation: string
  /** 面试形式 */
  interviewForm: InterviewForm
  /** 面试官信息 */
  interviewerInfo?: string
  /** 备注 */
  remarks?: string
}

/**
 * 面试更新请求
 */
export interface InterviewUpdateRequest {
  /** 面试ID */
  id: string
  /** 岗位ID */
  positionId?: string
  /** 面试轮次 */
  interviewRound?: InterviewRound
  /** 面试时间（时间戳） */
  interviewTime?: number
  /** 面试地点 */
  interviewLocation?: string
  /** 面试形式 */
  interviewForm?: InterviewForm
  /** 面试官信息 */
  interviewerInfo?: string
  /** 备注 */
  remarks?: string
}

/**
 * 面试列表响应
 */
export type InterviewListResponse = ApiResponse<PageResponse<Interview>>

/**
 * 面试详情响应
 */
export type InterviewResponse = ApiResponse<Interview>
