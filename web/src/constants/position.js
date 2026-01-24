/**
 * 岗位状态枚举
 */

/**
 * 岗位状态枚举（对应后端 PositionStatusEnum）
 */
export const PositionStatus = {
  /** 待投递 */
  TO_BE_DELIVERED: {
    value: 0,
    code: 'TO_BE_DELIVERED',
    label: '待投递',
    // 前端使用的状态值（用于兼容和UI展示）
    frontendValue: 'pending',
    // 样式类
    badgeClass: 'bg-yellow-100 text-yellow-700'
  },
  /** 已投递 */
  DELIVERED: {
    value: 1,
    code: 'DELIVERED',
    label: '已投递',
    frontendValue: 'submitted',
    badgeClass: 'bg-blue-100 text-blue-700'
  },
  /** 流程中 */
  IN_PROCESS: {
    value: 2,
    code: 'IN_PROCESS',
    label: '流程中',
    frontendValue: 'interview1',
    badgeClass: 'bg-purple-100 text-purple-700'
  },
  /** 已Offer */
  OFFER: {
    value: 3,
    code: 'OFFER',
    label: '已Offer',
    frontendValue: 'offered',
    badgeClass: 'bg-green-100 text-green-700'
  },
  /** 已入职 */
  JOINED: {
    value: 4,
    code: 'JOINED',
    label: '已入职',
    frontendValue: 'joined',
    badgeClass: 'bg-teal-100 text-teal-700'
  },
  /** 未通过 */
  NOT_PASS: {
    value: -1,
    code: 'NOT_PASS',
    label: '未通过',
    frontendValue: 'rejected',
    badgeClass: 'bg-red-100 text-red-700'
  },
  /** 已拒绝 */
  REJECTED: {
    value: 5,
    code: 'REJECTED',
    label: '已拒绝',
    frontendValue: 'rejected',
    badgeClass: 'bg-red-100 text-red-700'
  }
}

/**
 * 前端状态值映射表（用于筛选等场景）
 * @type {Object.<string, number>}
 */
export const FrontendStatusToBackend = {
  pending: 0,
  submitted: 1,
  screening: 2,
  test: 2,
  interview1: 2,
  interview2: 2,
  interview3: 2,
  final: 2,
  offered: 3,
  joined: 4,
  rejected: 5,
  not_pass: -1
}

/**
 * 后端状态值映射表（用于从后端数据转换为前端）
 * @type {Object.<number, string>}
 */
export const BackendStatusToFrontend = {
  0: 'pending',
  1: 'submitted',
  2: 'interview1',
  3: 'offered',
  4: 'joined',
  5: 'rejected',
  '-1': 'rejected'
}

/**
 * 状态选项列表（用于表单选择器）
 */
export const StatusOptions = [
  { label: '待投递', value: 0, code: 'TO_BE_DELIVERED' },
  { label: '已投递', value: 1, code: 'DELIVERED' },
  { label: '流程中', value: 2, code: 'IN_PROCESS' },
  { label: '已Offer', value: 3, code: 'OFFER' },
  { label: '已入职', value: 4, code: 'JOINED' },
  { label: '未通过', value: -1, code: 'NOT_PASS' },
  { label: '已拒绝', value: 5, code: 'REJECTED' }
]

/**
 * 获取状态标签文本
 * @param {number|string} status - 状态值（后端数字或前端字符串）
 * @returns {string} 状态标签文本
 */
export function getStatusLabel(status) {
  // 如果是数字，先转换为前端值
  const frontendValue = typeof status === 'number'
    ? BackendStatusToFrontend[status]
    : status

  // 查找对应的状态枚举
  const statusEnum = Object.values(PositionStatus).find(
    item => item.frontendValue === frontendValue
  )

  return statusEnum?.label || '未知状态'
}

/**
 * 获取状态样式类
 * @param {number|string} status - 状态值（后端数字或前端字符串）
 * @returns {string} CSS 类名
 */
export function getStatusClass(status) {
  // 如果是数字，先转换为前端值
  const frontendValue = typeof status === 'number'
    ? BackendStatusToFrontend[status]
    : status

  // 查找对应的状态枚举
  const statusEnum = Object.values(PositionStatus).find(
    item => item.frontendValue === frontendValue
  )

  return statusEnum?.badgeClass || 'bg-gray-100 text-gray-700'
}

/**
 * 将前端状态值转换为后端状态值
 * @param {string} frontendStatus - 前端状态值
 * @returns {number} 后端状态值
 */
export function mapFrontendStatusToBackend(frontendStatus) {
  return FrontendStatusToBackend[frontendStatus] ?? 0
}

/**
 * 将后端状态值转换为前端状态值
 * @param {number} backendStatus - 后端状态值
 * @returns {string} 前端状态值
 */
export function mapBackendStatusToFrontend(backendStatus) {
  return BackendStatusToFrontend[backendStatus] ?? 'pending'
}

/**
 * 默认导出
 */
export default PositionStatus
