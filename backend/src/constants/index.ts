/**
 * 常量定义
 */

// 岗位状态
export const POSITION_STATUS = {
  PENDING: 'pending',       // 待投递
  APPLIED: 'applied',       // 已投递
  INTERVIEW: 'interview',   // 面试中
  OFFERED: 'offered',       // 已录用
  REJECTED: 'rejected',     // 已拒绝
} as const

// 面试状态
export const INTERVIEW_STATUS = {
  UPCOMING: 'upcoming',     // 即将到来
  COMPLETED: 'completed',   // 已完成
  CANCELLED: 'cancelled',   // 已取消
} as const

// 初始面试记录状态（投递状态）
export const INITIAL_INTERVIEW_STATUS = {
  NOT_DELIVERED: 0,         // 未投递
  DELIVERED: 1,             // 已投递
} as const

// 初始面试记录轮次和形式
export const INITIAL_INTERVIEW_ROUND = '投递状态'
export const INITIAL_INTERVIEW_FORM = '投递'

// 面试结果
export const INTERVIEW_RESULT = {
  PASS: 'pass',             // 通过
  FAIL: 'fail',             // 未通过
  PENDING: 'pending',       // 待定
} as const

// 面经分类
export const EXPERIENCE_CATEGORY = {
  TECHNICAL: 'technical',   // 技术面
  HR: 'hr',                 // HR 面
  COMPREHENSIVE: 'comprehensive', // 综合面
} as const

// 分页默认参数
export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10

export default {
  POSITION_STATUS,
  INTERVIEW_STATUS,
  INTERVIEW_RESULT,
  EXPERIENCE_CATEGORY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
}
