/**
 * AI 控制器层
 */
import { Request, Response, NextFunction } from 'express'
import aiService from '@/services/ai.service'
import { success } from '@/utils/response'
import { BadRequestError } from '@/utils/error'

/**
 * AI智能解析JD
 */
export async function parseJD(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { jdText } = req.body

    // 参数验证
    if (!jdText || typeof jdText !== 'string') {
      throw new BadRequestError('JD文本不能为空')
    }

    if (jdText.length > 10000) {
      throw new BadRequestError('JD文本过长，请控制在10000字符以内')
    }

    // 调用AI服务解析JD
    const result = await aiService.parseJD(jdText)

    success(res, result, 'JD解析成功')
  } catch (error) {
    next(error)
  }
}

/**
 * AI岗位匹配度分析
 */
export async function analyzeMatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { positionId, userProfile } = req.body

    // 参数验证
    if (!positionId) {
      throw new BadRequestError('岗位ID不能为空')
    }

    // 这里应该从数据库获取岗位详情
    // 暂时使用req.body中的job信息
    const job = req.body.job || {}
    const profile = userProfile || {}

    // 调用AI服务分析匹配度
    const result = await aiService.analyzeMatch(job, profile)

    success(res, result, '匹配度分析完成')
  } catch (error) {
    next(error)
  }
}

/**
 * AI生成面试准备清单
 */
export async function generatePrepList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { interview } = req.body

    // 参数验证
    if (!interview) {
      throw new BadRequestError('面试信息不能为空')
    }

    // 调用AI服务生成准备清单
    const result = await aiService.generatePrepList(interview)

    success(res, result, '准备清单生成成功')
  } catch (error) {
    next(error)
  }
}

/**
 * AI对话
 */
export async function chat(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { message, history } = req.body

    // 参数验证
    if (!message || typeof message !== 'string') {
      throw new BadRequestError('消息内容不能为空')
    }

    if (message.length > 500) {
      throw new BadRequestError('消息内容过长，请控制在500字符以内')
    }

    // 调用AI服务进行对话
    const result = await aiService.chat(message, history)

    success(res, result, 'AI响应成功')
  } catch (error) {
    next(error)
  }
}

/**
 * AI辅助生成面经内容
 */
export async function generateExperienceContent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { companyName, positionName, interviewRound, interviewDate, existingContent } = req.body

    // 参数验证
    if (!companyName || typeof companyName !== 'string') {
      throw new BadRequestError('公司名称不能为空')
    }

    if (!positionName || typeof positionName !== 'string') {
      throw new BadRequestError('岗位名称不能为空')
    }

    if (!interviewRound || typeof interviewRound !== 'string') {
      throw new BadRequestError('面试轮次不能为空')
    }

    if (!interviewDate || typeof interviewDate !== 'string') {
      throw new BadRequestError('面试日期不能为空')
    }

    // 调用AI服务生成面经内容
    const result = await aiService.generateExperienceContent({
      companyName,
      positionName,
      interviewRound,
      interviewDate,
      existingContent
    })

    success(res, result, '面经内容生成成功')
  } catch (error) {
    next(error)
  }
}

/**
 * AI优化面经内容
 */
export async function optimizeExperienceContent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { content } = req.body

    // 参数验证
    if (!content || typeof content !== 'string') {
      throw new BadRequestError('面经内容不能为空')
    }

    if (content.length > 50000) {
      throw new BadRequestError('面经内容过长，请控制在50000字符以内')
    }

    // 调用AI服务优化面经内容
    const result = await aiService.optimizeExperienceContent(content)

    success(res, result, '面经内容优化成功')
  } catch (error) {
    next(error)
  }
}

export default {
  parseJD,
  analyzeMatch,
  generatePrepList,
  chat,
  generateExperienceContent,
  optimizeExperienceContent
}
