/**
 * 面试记录相关类型定义
 * 与后端数据结构保持一致
 */
import type { ApiResponse } from './user'

// 重新导出 ApiResponse 以便其他模块使用
export type { ApiResponse }

/**
 * 面试轮次枚举
 */
export enum InterviewRound {
  /** 笔试 */
  WRITTEN_TEST = '笔试',
  /** 一面 */
  FIRST_ROUND = '一面',
  /** 二面 */
  SECOND_ROUND = '二面',
  /** 三面 */
  THIRD_ROUND = '三面',
  /** 终面 */
  FINAL_ROUND = '终面'
}

/**
 * 面试形式枚举
 */
export enum InterviewForm {
  /** 现场面试 */
  ONSITE = '现场面试',
  /** 视频面试 */
  VIDEO = '视频面试',
  /** 电话面试 */
  PHONE = '电话面试'
}

/**
 * 面试记录实体（对应后端 Interview 实体）
 */
export interface Interview {
  /** 面试记录ID */
  id: number
  /** 岗位ID */
  positionId: string
  /** 用户ID */
  userId: number
  /** 面试轮次 */
  interviewRound: string
  /** 面试时间（时间戳） */
  interviewTime: number
  /** 面试地点 */
  interviewLocation: string
  /** 面试形式 */
  interviewForm: string
  /** 面试官信息 */
  interviewerInfo: string
  /** 备注 */
  remarks: string
  /** 状态 */
  status: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 面试记录创建请求
 */
export interface InterviewCreateRequest {
  /** 岗位ID */
  positionId: string
  /** 面试轮次 */
  interviewRound: string
  /** 面试时间（时间戳） */
  interviewTime: number
  /** 面试地点 */
  interviewLocation: string
  /** 面试形式 */
  interviewForm: string
  /** 面试官信息 */
  interviewerInfo: string
  /** 备注 */
  remarks: string
}

/**
 * 面试记录更新请求
 */
export interface InterviewUpdateRequest extends Partial<InterviewCreateRequest> {
  /** 面试记录ID */
  id: number
}

/**
 * 面试记录列表响应
 */
export type InterviewListResponse = ApiResponse<Interview[]>

/**
 * 面试记录响应
 */
export type InterviewResponse = ApiResponse<Interview>

/**
 * 面试记录查询参数
 */
export interface InterviewQueryParams {
  /** 岗位ID */
  positionId?: string
  /** 当前页码 */
  current: number
  /** 每页大小 */
  size: number
}
