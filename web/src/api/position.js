import { get, post, postWithAuth, getWithAuth, putWithAuth, delWithAuth } from '@/utils/request'

/**
 * 获取岗位列表
 * @param {object} params - 查询参数
 * @param {number} params.id - 岗位ID
 * @param {string} params.companyName - 公司名称
 * @param {string} params.positionName - 岗位名称
 * @param {string} params.deliveryChannel - 投递渠道
 * @param {string} params.deliveryDateStart - 投递日期开始
 * @param {string} params.deliveryDateEnd - 投递日期结束
 * @param {string} params.workLocation - 工作地点
 * @param {string} params.status - 状态
 * @param {number} params.isCollected - 是否收藏 (0: 否, 1: 是)
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @returns {Promise} 返回岗位列表
 */
export function getPositions(params) {
  return postWithAuth('/positions/page', { params })
}

/**
 * 根据ID获取岗位详情
 * @param {number} id - 岗位ID
 * @returns {Promise} 返回岗位详情
 */
export function getPositionById(id) {
  return getWithAuth(`/positions/${id}`)
}

/**
 * 创建岗位
 * @param {object} data - 岗位数据
 * @returns {Promise} 返回创建结果
 */
export function createPosition(data) {
  return postWithAuth('/positions', data)
}

/**
 * 更新岗位
 * @param {number} id - 岗位ID
 * @param {object} data - 更新数据
 * @returns {Promise} 返回更新结果
 */
export function updatePosition(id, data) {
  return putWithAuth(`/positions/${id}`, data)
}

/**
 * 删除岗位
 * @param {number} id - 岗位ID
 * @returns {Promise} 返回删除结果
 */
export function deletePosition(id) {
  return delWithAuth(`/positions/${id}`)
}

/**
 * 切换岗位收藏状态
 * @param {number} id - 岗位ID
 * @returns {Promise} 返回操作结果
 */
export function toggleCollect(id) {
  return postWithAuth(`/positions/${id}/collect`)
}
