/**
 * AI相关类型定义
 */

/** JD解析结果 */
export interface JDParseResult {
  /** 岗位职责 */
  responsibilities: string
  /** 技能要求 */
  skills: string[]
  /** 工作地点 */
  location: string
  /** 薪资范围 */
  salaryRange: string
}

/** 岗位匹配度分析结果 */
export interface JobMatchAnalysis {
  /** 总体匹配度 */
  overall: number
  /** 技能匹配度 */
  skills: number
  /** 经验匹配度 */
  experience: number
  /** 学历匹配度 */
  education: number
  /** 薪资匹配度 */
  salary: number
  /** 优势列表 */
  advantages: string[]
  /** 改进建议 */
  suggestions: string[]
}

/** 面试准备清单项 */
export interface PrepListItem {
  id: number
  /** 清单项内容 */
  text: string
  /** 是否已完成 */
  completed: boolean
}

/** AI对话动作按钮 */
export interface AIAction {
  /** 按钮文字 */
  text: string
  /** 动作类型 */
  action: string
}

/** AI对话消息 */
export interface AIMessage {
  id: number
  /** 角色：user/assistant */
  role: 'user' | 'assistant'
  /** 消息内容 */
  content: string
  /** 可选的操作按钮 */
  actions?: AIAction[]
  /** 创建时间 */
  createTime: string
}

/** AI请求响应 */
export interface AIResponse<T = any> {
  code: number
  message: string
  data: T
}
