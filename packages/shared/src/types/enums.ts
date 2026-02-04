/**
 * 共享枚举定义
 */

/**
 * 岗位状态
 */
export enum PositionStatus {
  PENDING = 'pending',        // 待处理
  APPLIED = 'applied',        // 已投递
  INTERVIEW = 'interview',    // 面试中
  OFFERED = 'offered',        // 已录用
  REJECTED = 'rejected'       // 已拒绝
}

/**
 * 面试轮次
 */
export enum InterviewRound {
  WRITTEN = 'written',        // 笔试
  FIRST = 'first',            // 一面
  SECOND = 'second',          // 二面
  THIRD = 'third',            // 三面
  FINAL = 'final',            // 终面
  HR = 'hr'                   // HR面
}

/**
 * 面试形式
 */
export enum InterviewForm {
  ONSITE = 'onsite',          // 现场面试
  VIDEO = 'video',            // 视频面试
  PHONE = 'phone'             // 电话面试
}

/**
 * 面经轮次
 */
export enum ExperienceRound {
  WRITTEN = 'written',        // 笔试
  FIRST = 'first',            // 一面
  SECOND = 'second',          // 二面
  THIRD = 'third',            // 三面
  HR = 'hr'                   // HR面
}

/**
 * 面经内容类型
 */
export enum ExperienceContentType {
  TEXT = 'text',              // 纯文本
  MARKDOWN = 'markdown',      // Markdown
  HTML = 'html'               // HTML
}

/**
 * 响应状态码
 */
export enum ResponseCode {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500
}
