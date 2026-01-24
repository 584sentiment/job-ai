import { get, post, postWithAuth, getWithAuth, putWithAuth, delWithAuth } from '@/utils/request'
import type {
  Position,
  PositionQueryParams,
  PositionCreateRequest,
  PositionListResponse,
  PositionDetailResponse,
  PositionMutationResponse
} from '@/types'

/**
 * 获取岗位列表
 * @param params - 查询参数
 * @returns 岗位列表响应
 */
export function getPositions(params: PositionQueryParams): Promise<PositionListResponse> {
  return postWithAuth('/positions/page', { params }) as Promise<PositionListResponse>
}

/**
 * 根据ID获取岗位详情
 * @param id - 岗位ID
 * @returns 岗位详情响应
 */
export function getPositionById(id: number): Promise<PositionDetailResponse> {
  return getWithAuth(`/positions/${id}`) as Promise<PositionDetailResponse>
}

/**
 * 创建岗位
 * @param data - 岗位数据
 * @returns 创建结果响应
 */
export function createPosition(data: PositionCreateRequest): Promise<PositionMutationResponse> {
  return postWithAuth('/positions', data) as Promise<PositionMutationResponse>
}

/**
 * 更新岗位
 * @param id - 岗位ID
 * @param data - 更新数据
 * @returns 更新结果响应
 */
export function updatePosition(id: number, data: PositionCreateRequest): Promise<PositionMutationResponse> {
  return putWithAuth(`/positions/${id}`, data) as Promise<PositionMutationResponse>
}

/**
 * 删除岗位
 * @param id - 岗位ID
 * @returns 删除结果响应
 */
export function deletePosition(id: number): Promise<ApiResponse> {
  return delWithAuth(`/positions/${id}`) as Promise<ApiResponse>
}

/**
 * 切换岗位收藏状态
 * @param id - 岗位ID
 * @returns 操作结果响应
 */
export function toggleCollect(id: number): Promise<ApiResponse> {
  return postWithAuth(`/positions/${id}/collect`) as Promise<ApiResponse>
}
