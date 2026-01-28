/**
 * AI相关API接口
 */

import { postWithAuth } from '@/utils/request'
import type {
  JDParseResult,
  JobMatchAnalysis,
  PrepListItem,
  AIMessage,
  AIResponse
} from '@/types'

/**
 * AI功能API类
 */
class AIAPI {
  /**
   * 智能解析JD
   * @param jdText JD文本内容
   * @returns 解析结果
   */
  async parseJD(jdText: string): Promise<JDParseResult> {
    const response = await postWithAuth('/ai/parse-jd', { jdText })
    return response.data as JDParseResult
  }

  /**
   * 分析岗位匹配度
   * @param job 岗位信息
   * @param userProfile 用户信息
   * @returns 匹配度分析结果
   */
  async analyzeMatch(job: any, userProfile: any): Promise<JobMatchAnalysis> {
    const response = await postWithAuth('/ai/analyze-match', {
      positionId: job.id,
      job,
      userProfile
    })
    return response.data as JobMatchAnalysis
  }

  /**
   * 生成面试准备清单
   * @param interview 面试信息
   * @returns 准备清单
   */
  async generatePrepList(interview: any): Promise<PrepListItem[]> {
    const response = await postWithAuth('/ai/generate-prep-list', { interview })
    return response.data as PrepListItem[]
  }

  /**
   * AI对话接口
   * @param message 用户消息
   * @param history 对话历史（可选）
   * @returns AI回复
   */
  async chat(message: string, history?: AIMessage[]): Promise<{ content: string; actions?: any[] }> {
    const response = await postWithAuth('/ai/chat', { message, history })
    return response.data as { content: string; actions?: any[] }
  }
}

export default new AIAPI()
