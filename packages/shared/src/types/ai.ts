/**
 * AI 相关类型定义
 */

import type { ApiResponse } from './common'

/**
 * JD 解析结果
 */
export interface JDParseResult {
  /** 公司名称 */
  company: string
  /** 岗位名称 */
  position: string
  /** 岗位职责 */
  responsibilities: string[]
  /** 岗位要求 */
  requirements: string[]
  /** 福利待遇 */
  benefits?: string[]
  /** 工作地点 */
  location?: string
  /** 薪资范围 */
  salary?: string
}

/**
 * 岗位匹配度分析
 */
export interface JobMatchAnalysis {
  /** 岗位ID */
  positionId: string
  /** 匹配度分数 (0-100) */
  matchScore: number
  /** 匹配的优势 */
  strengths: string[]
  /** 需要提升的点 */
  weaknesses: string[]
  /** 面试准备建议 */
  preparationTips: string[]
}

/**
 * 面试准备清单项
 */
export interface PrepListItem {
  /** 内容 */
  content: string
  /** 是否完成 */
  completed: boolean
  /** 优先级 (high/medium/low) */
  priority: 'high' | 'medium' | 'low'
}

/**
 * AI 动作类型
 */
export enum AIAction {
  PARSE_JD = 'parse_jd',
  ANALYZE_MATCH = 'analyze_match',
  GENERATE_PREP = 'generate_prep',
  IMPROVE_RESUME = 'improve_resume',
  MOCK_INTERVIEW = 'mock_interview'
}

/**
 * AI 消息
 */
export interface AIMessage {
  /** 角色 (user/assistant) */
  role: 'user' | 'assistant'
  /** 内容 */
  content: string
  /** 时间戳 */
  timestamp: number
}

/**
 * AI 响应
 */
export type AIResponse = ApiResponse<{
  /** 动作类型 */
  action: AIAction
  /** 结果数据 */
  result: any
}>
