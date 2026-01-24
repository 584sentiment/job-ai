/**
 * 数据映射工具（TypeScript 版本）
 * 由于类型定义已与后端保持一致，转换逻辑已大大简化
 */
import type { Position, PositionCreateRequest } from '@/types'
import { PositionStatus, PositionStatusLabels, PositionStatusClasses } from '@/types'

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
 * 确保所有必填字段都存在
 */
export function preparePositionData(data: Partial<PositionCreateRequest>): PositionCreateRequest {
  const now = new Date().toISOString()

  return {
    companyName: data.companyName || '',
    positionName: data.positionName || '',
    deliveryChannel: data.deliveryChannel || '',
    deliveryDate: data.deliveryDate || now,
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
