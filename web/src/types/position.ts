/**
 * 岗位相关类型定义
 * 与后端数据结构保持一致
 */
import { PositionStatus } from './enums'
import type { ApiResponse } from './user'

// 重新导出 ApiResponse 以便其他模块使用
export type { ApiResponse }

/**
 * 岗位信息（对应后端 Position 实体）
 */
export interface Position {
  /** 岗位ID */
  id: string
  /** 公司名称 */
  companyName: string
  /** 岗位名称 */
  positionName: string
  /** 投递渠道 */
  deliveryChannel: string
  /** 投递日期 */
  deliveryDate: string
  /** 工作地点 */
  workLocation: string
  /** 薪资范围 */
  salaryRange: string
  /** 岗位描述 */
  jobDescription: string
  /** 联系人姓名 */
  contactName: string
  /** 联系人电话 */
  contactPhone: string
  /** 备注 */
  remarks: string
  /** 状态 */
  status: PositionStatus
  /** 是否收藏 (0: 否, 1: 是) */
  isCollected: number
  /** 面试记录列表 */
  interviewRecordList: InterviewRecord[]
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 面试记录（对应后端 InterviewRecord 实体）
 */
export interface InterviewRecord {
  /** 面试记录ID */
  id: number
  /** 岗位ID */
  positionId: string
  /** 用户ID */
  userId: number
  /** 面试轮次 */
  interviewRound: string
  /** 面试时间 */
  interviewTime: string
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
 * 岗位查询参数（对应后端分页查询）
 */
export interface PositionQueryParams {
  /** 岗位ID */
  id?: string
  /** 搜索关键字（可搜索公司名称、岗位名称等） */
  keyword?: string
  /** 公司名称 */
  companyName?: string
  /** 岗位名称 */
  positionName?: string
  /** 投递渠道 */
  deliveryChannel?: string
  /** 投递日期开始 */
  deliveryDateStart?: string
  /** 投递日期结束 */
  deliveryDateEnd?: string
  /** 工作地点 */
  workLocation?: string
  /** 状态 */
  status?: PositionStatus
  /** 是否收藏 */
  isCollected?: number
  /** 当前页码 */
  current: number
  /** 每页大小 */
  size: number
}

/**
 * 岗位创建/更新请求
 */
export interface PositionCreateRequest {
  /** 岗位ID（更新时需要） */
  id?: string
  /** 公司名称 */
  companyName: string
  /** 岗位名称 */
  positionName: string
  /** 投递渠道 */
  deliveryChannel: string
  /** 投递日期 */
  deliveryDate: string
  /** 工作地点 */
  workLocation?: string
  /** 薪资范围 */
  salaryRange?: string
  /** 岗位描述 */
  jobDescription?: string
  /** 联系人姓名 */
  contactName?: string
  /** 联系人电话 */
  contactPhone?: string
  /** 备注 */
  remarks?: string
  /** 状态 */
  status: PositionStatus
  /** 是否收藏 */
  isCollected?: number
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  /** 数据列表 */
  records: T[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  current: number
  /** 每页大小 */
  size: number
  /** 总页数 */
  pages: number
}

/**
 * 岗位列表响应
 */
export type PositionListResponse = ApiResponse<PageResponse<Position>>

/**
 * 岗位详情响应
 */
export type PositionDetailResponse = ApiResponse<Position>

/**
 * 岗位创建/更新响应
 */
export type PositionMutationResponse = ApiResponse<Position>
