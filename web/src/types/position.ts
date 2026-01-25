/**
 * 岗位相关类型定义
 * 与后端数据结构保持一致
 */
import { PositionStatus } from './enums'
import type { ApiResponse } from './user'
import type { Interview } from './interview'

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
  interviewRecordList: Interview[]
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 关联面经列表 */
  relatedExperiences?: RelatedExperience[]
  /** 面试总结列表 */
  summaries?: InterviewSummary[]
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

/**
 * 关联面经
 */
export interface RelatedExperience {
  /** 面经ID */
  id: string
  /** 面试公司 */
  company: string
  /** 面试岗位 */
  position: string
  /** 面经标题 */
  title: string
  /** 面经内容摘要 */
  summary: string
  /** 面试日期 */
  date: string
  /** 标签 */
  tags: string[]
}

/**
 * 面试总结
 */
export interface InterviewSummary {
  /** 总结ID */
  id: string
  /** 岗位ID */
  positionId: string
  /** 面试轮次 */
  round: string
  /** 面试日期 */
  date: string
  /** 总结内容 */
  content: string
  /** 亮点 */
  highlights: string[]
  /** 不足 */
  improvements: string[]
  /** 创建时间 */
  createTime: string
}
