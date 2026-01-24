/**
 * 岗位数据映射工具
 * 将后端数据结构转换为前端使用的格式
 */
import {
  mapBackendStatusToFrontend,
  mapFrontendStatusToBackend
} from '@/constants/position'

/**
 * 将后端岗位数据转换为前端格式
 * @param {object} backendData - 后端返回的岗位数据
 * @returns {object} 前端格式的岗位数据
 */
export function mapPositionFromBackend(backendData) {
  if (!backendData) return null

  return {
    id: backendData.id,
    company: backendData.companyName,
    position: backendData.positionName,
    channel: backendData.deliveryChannel,
    location: backendData.workLocation,
    salary: backendData.salaryRange,
    // 将后端状态值转换为前端状态值
    status: mapBackendStatusToFrontend(backendData.status),
    applyDate: backendData.deliveryDate ? formatDate(backendData.deliveryDate) : '',
    jd: backendData.jobDescription || '',
    contact: backendData.contactName || '',
    contactPhone: backendData.contactPhone || '',
    remark: backendData.remarks || '',
    isCollected: backendData.isCollected || 0,
    // 面试记录映射为 timeline
    timeline: (backendData.interviewRecordList || []).map(record => ({
      status: record.interviewRound || '面试',
      date: record.interviewTime ? formatDate(record.interviewTime) : '',
      desc: record.remarks || record.interviewerInfo || ''
    })),
    // 面试记录原始数据
    interviews: backendData.interviewRecordList || [],
    createTime: backendData.createTime,
    updateTime: backendData.updateTime,
    // 为兼容性保留的颜色字段
    color: getColorByStatus(mapBackendStatusToFrontend(backendData.status))
  }
}

/**
 * 将前端岗位数据转换为后端格式（用于创建/更新）
 * @param {object} frontendData - 前端格式的岗位数据
 * @returns {object} 后端格式的岗位数据
 */
export function mapPositionToBackend(frontendData) {
  const data = {
    companyName: frontendData.company,
    positionName: frontendData.position,
    deliveryChannel: frontendData.channel,
    workLocation: frontendData.location,
    salaryRange: frontendData.salary,
    // 将前端状态值转换为后端状态值
    status: mapFrontendStatusToBackend(frontendData.status),
    deliveryDate: frontendData.applyDate || new Date().toISOString(),
    jobDescription: frontendData.jd || '',
    contactName: frontendData.contact || '',
    contactPhone: frontendData.contactPhone || '',
    remarks: frontendData.remark || '',
    isCollected: frontendData.isCollected || 0
  }

  // 如果有 ID，添加到数据中（更新时需要）
  if (frontendData.id) {
    data.id = frontendData.id
  }

  return data
}

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {string} dateString - ISO 日期字符串
 * @returns {string} 格式化后的日期
 */
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

/**
 * 根据状态获取对应的颜色（用于 UI 显示）
 * @param {string} status - 岗位状态
 * @returns {string} 颜色名称
 */
function getColorByStatus(status) {
  const colorMap = {
    pending: 'yellow',
    submitted: 'blue',
    screening: 'purple',
    test: 'gray',
    interview1: 'blue',
    interview2: 'blue',
    interview3: 'blue',
    final: 'indigo',
    offered: 'green',
    rejected: 'red'
  }
  return colorMap[status] || 'blue'
}
