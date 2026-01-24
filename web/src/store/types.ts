/**
 * Store 类型定义
 */
import type { Position, PositionStatus } from '@/types'

/**
 * 岗位 Store 状态
 */
export interface JobsState {
  /** 岗位列表 */
  jobs: Position[]
  /** 加载状态 */
  loading: boolean
  /** 当前筛选器 */
  currentFilter: number | string | 'all'
  /** 搜索关键词 */
  searchKeyword: string
}

/**
 * 岗位统计数据
 */
export interface JobStatistics {
  /** 总数 */
  total: number
  /** 待投递数量 */
  pending: number
  /** 已投递数量 */
  delivered: number
  /** 流程中数量 */
  inProcess: number
  /** 已Offer数量 */
  offered: number
  /** 已入职数量 */
  joined: number
  /** 已拒绝数量 */
  rejected: number
}

/**
 * 岗位筛选器选项
 */
export interface JobFilterOption {
  /** 标签文本 */
  label: string
  /** 筛选值 */
  value: number | 'all'
}

/**
 * 岗位表单数据（兼容旧字段名）
 */
export interface JobFormData {
  /** 公司名称 */
  company?: string
  /** 公司名称（后端字段） */
  companyName?: string
  /** 岗位名称 */
  position?: string
  /** 岗位名称（后端字段） */
  positionName?: string
  /** 投递渠道 */
  channel?: string
  /** 投递渠道（后端字段） */
  deliveryChannel?: string
  /** 投递日期 */
  applyDate?: string
  /** 投递日期（后端字段） */
  deliveryDate?: string
  /** 工作地点 */
  location?: string
  /** 工作地点（后端字段） */
  workLocation?: string
  /** 薪资范围 */
  salary?: string
  /** 薪资范围（后端字段） */
  salaryRange?: string
  /** 岗位描述 */
  jd?: string
  /** 岗位描述（后端字段） */
  jobDescription?: string
  /** 联系人 */
  contact?: string
  /** 联系人（后端字段） */
  contactName?: string
  /** 联系电话 */
  contactPhone?: string
  /** 备注 */
  remark?: string
  /** 备注（后端字段） */
  remarks?: string
  /** 状态 */
  status?: PositionStatus
  /** 是否收藏 */
  isCollected?: number
  /** 颜色（仅前端显示） */
  color?: string
}

/**
 * Store getters
 */
export interface JobsGetters {
  /** 过滤后的岗位列表 */
  filteredJobs: Position[]
  /** 岗位统计 */
  jobStats: JobStatistics
}
