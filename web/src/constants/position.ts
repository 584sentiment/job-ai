/**
 * 岗位状态常量（从枚举重新导出，提供统一访问点）
 */
import {
  PositionStatus,
  PositionStatusLabels,
  PositionStatusClasses
} from '@/types'

// 重新导出枚举
export { PositionStatus }

// 重新导出标签映射
export { PositionStatusLabels }

// 重新导出样式映射
export { PositionStatusClasses }

/**
 * 状态选项列表（用于表单选择器）
 */
export const StatusOptions = [
  { label: PositionStatusLabels[PositionStatus.TO_BE_DELIVERED], value: PositionStatus.TO_BE_DELIVERED },
  { label: PositionStatusLabels[PositionStatus.DELIVERED], value: PositionStatus.DELIVERED },
  { label: PositionStatusLabels[PositionStatus.IN_PROCESS], value: PositionStatus.IN_PROCESS },
  { label: PositionStatusLabels[PositionStatus.OFFER], value: PositionStatus.OFFER },
  { label: PositionStatusLabels[PositionStatus.JOINED], value: PositionStatus.JOINED },
  { label: PositionStatusLabels[PositionStatus.NOT_PASS], value: PositionStatus.NOT_PASS },
  { label: PositionStatusLabels[PositionStatus.REJECTED], value: PositionStatus.REJECTED }
]

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

// 默认导出
export default PositionStatus
