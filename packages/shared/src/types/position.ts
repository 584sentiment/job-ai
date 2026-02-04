/**
 * 岗位相关类型定义
 */

import { PositionStatus } from './enums'
import type { ApiResponse, PageResponse, PageParams } from './common'

/**
 * 岗位信息
 */
export interface Position {
  /** 岗位ID */
  id: string
  /** 用户ID */
  userId: string
  /** 公司名称 */
  companyName: string
  /** 岗位名称 */
  positionName: string
  /** 投递渠道 */
  deliveryChannel: string
  /** 投递日期（时间戳） */
  deliveryDate: number
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
  /** 是否收藏 (0: 否, 1: 是) */
  isCollected: number
  /** 创建时间 */
  createTime: number
  /** 更新时间 */
  updateTime: number
}

/**
 * 岗位查询参数
 */
export interface PositionQueryParams extends PageParams {
  /** 岗位ID */
  id?: string
  /** 搜索关键字 */
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
}

/**
 * 岗位创建请求
 */
export interface PositionCreateRequest {
  /** 公司名称 */
  companyName: string
  /** 岗位名称 */
  positionName: string
  /** 投递渠道 */
  deliveryChannel: string
  /** 投递日期（时间戳） */
  deliveryDate: number
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
  status?: PositionStatus
  /** 是否收藏 */
  isCollected?: number
}

/**
 * 岗位更新请求
 */
export interface PositionUpdateRequest {
  /** 岗位ID */
  id: string
  /** 公司名称 */
  companyName?: string
  /** 岗位名称 */
  positionName?: string
  /** 投递渠道 */
  deliveryChannel?: string
  /** 投递日期（时间戳） */
  deliveryDate?: number
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
  status?: PositionStatus
  /** 是否收藏 */
  isCollected?: number
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
