/**
 * 数据映射工具（TypeScript 版本）
 * 由于类型定义已与后端保持一致，转换逻辑已大大简化
 */
import type { Position, PositionCreateRequest } from '@/types'
import { PositionStatus, PositionStatusLabels, PositionStatusClasses } from '@/types'

/**
 * 格式化时间戳为日期字符串（YYYY-MM-DD）
 * @param timestamp - 时间戳（毫秒）或日期字符串
 * @returns 格式化的日期字符串
 */
export function formatDate(timestamp: number | string | undefined | null): string {
  if (!timestamp) return ''
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化时间戳为 ISO 字符串
 * @param timestamp - 时间戳（毫秒）
 * @returns ISO 格式的日期时间字符串
 */
export function toISOString(timestamp: number): string {
  return new Date(timestamp).toISOString()
}

/**
 * 转换 ISO 字符串或日期字符串为时间戳
 * @param dateStr - 日期字符串
 * @returns 时间戳（毫秒）
 */
export function toTimestamp(dateStr: string): number {
  return new Date(dateStr).getTime()
}

/**
 * 获取状态标签文本
 */
export function getStatusLabel(status: PositionStatus): string {
  return PositionStatusLabels[status] || '未知状态'
}

/**
 * 获取状态样式类
 */
export function getStatusClass(status: PositionStatus): string {
  return PositionStatusClasses[status] || 'bg-gray-100 text-gray-700'
}

/**
 * 获取颜色（用于 UI 显示，兼容旧代码）
 */
export function getColorByStatus(status: PositionStatus): string {
  const colorMap: Record<PositionStatus, string> = {
    [PositionStatus.TO_BE_DELIVERED]: 'yellow',
    [PositionStatus.DELIVERED]: 'blue',
    [PositionStatus.IN_PROCESS]: 'purple',
    [PositionStatus.OFFER]: 'green',
    [PositionStatus.JOINED]: 'teal',
    [PositionStatus.NOT_PASS]: 'red',
    [PositionStatus.REJECTED]: 'red'
  }
  return colorMap[status] || 'blue'
}

/**
 * 获取渐变背景类名（返回完整的静态类名，确保 Tailwind 能够识别）
 *
 * 注意：不能使用动态拼接的类名（如 `from-${color}-500`），
 * 因为 Tailwind 的 JIT 编译器只能识别静态的类名。
 * 必须返回完整的类名字符串。
 *
 * @param status - 岗位状态（可以是 PositionStatus 或 string）
 */
export function getGradientClass(status: PositionStatus | string): string {
  const gradientMap: Record<string, string> = {
    [PositionStatus.TO_BE_DELIVERED]: 'from-yellow-500 to-yellow-600',
    [PositionStatus.DELIVERED]: 'from-blue-500 to-blue-600',
    [PositionStatus.IN_PROCESS]: 'from-purple-500 to-purple-600',
    [PositionStatus.OFFER]: 'from-green-500 to-green-600',
    [PositionStatus.JOINED]: 'from-teal-500 to-teal-600',
    [PositionStatus.NOT_PASS]: 'from-red-500 to-red-600',
    [PositionStatus.REJECTED]: 'from-red-500 to-red-600'
  }
  return gradientMap[status] || 'from-blue-500 to-blue-600'
}

/**
 * 将后端岗位数据转换为前端显示格式
 * 注意：由于使用了 TypeScript 类型，字段名已与后端一致
 * 只需要处理一些展示相关的转换
 */
export function mapPositionForDisplay(position: Position): Position {
  // 直接返回，因为字段名已经一致
  return position
}

/**
 * 准备岗位创建数据
 * 确保所有必填字段都存在，并转换时间戳为 ISO 字符串
 */
export function preparePositionData(data: Partial<PositionCreateRequest>): PositionCreateRequest {
  const now = new Date().toISOString()

  // 处理 deliveryDate - 如果是时间戳，转换为 ISO 字符串
  let deliveryDate = data.deliveryDate || now
  if (typeof deliveryDate === 'number') {
    deliveryDate = toISOString(deliveryDate)
  } else if (deliveryDate && !deliveryDate.includes('T')) {
    // 如果是日期字符串（YYYY-MM-DD），转换为 ISO 字符串
    deliveryDate = new Date(deliveryDate).toISOString()
  }

  return {
    companyName: data.companyName || '',
    positionName: data.positionName || '',
    deliveryChannel: data.deliveryChannel || '',
    deliveryDate,
    workLocation: data.workLocation || '',
    salaryRange: data.salaryRange || '',
    jobDescription: data.jobDescription || '',
    contactName: data.contactName || '',
    contactPhone: data.contactPhone || '',
    remarks: data.remarks || '',
    status: data.status ?? PositionStatus.TO_BE_DELIVERED,
    isCollected: data.isCollected ?? 0,
    ...data
  }
}
