/**
 * 类型定义统一导出
 */

export * from './enums'
export * from './position'
export * from './user'

// 单独导出面试相关类型,避免重复导出枚举
export type {
  Interview,
  InterviewCreateRequest,
  InterviewUpdateRequest,
  InterviewListResponse,
  InterviewResponse,
  InterviewQueryParams
} from './interview'

export { InterviewRound, InterviewForm } from './interview'

// 单独导出面经相关类型,避免重复导出枚举
export type {
  Experience,
  ExperienceCreateRequest,
  ExperienceUpdateRequest,
  ExperienceListResponse,
  ExperienceResponse,
  ExperienceQueryParams,
  ExperienceStats,
  ExperienceComment,
  ExperienceCommentCreateRequest,
  ExperienceCommentListResponse,
  ExperienceFavoriteResponse
} from './experience'

export { ExperienceRound, ExperienceContentType } from './experience'

/**
 * 通用工具类型
 */

/** 修改类型，使 T 的所有属性变为可选 */
export type Partial<T> = {
  [P in keyof T]?: T[P]
}

/** 修改类型，使 T 的所有属性变为必需 */
export type Required<T> = {
  [P in keyof T]-?: T[P]
}

/** 从 T 中选取一组属性 K */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

/** 从 T 中排除一组属性 K */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
