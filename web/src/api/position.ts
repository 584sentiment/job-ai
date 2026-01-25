import {
  postWithAuth,
  getWithAuth,
  putWithAuth,
  delWithAuth,
} from '@/utils/request';
import type {
  PositionQueryParams,
  PositionCreateRequest,
  PositionListResponse,
  PositionDetailResponse,
  PositionMutationResponse,
  ApiResponse,
  InterviewRecordCreateRequest,
  InterviewRecordUpdateRequest,
  InterviewRecordListResponse,
  InterviewRecordResponse,
} from '@/types';

/**
 * 获取岗位列表
 * @param params - 查询参数
 * @returns 岗位列表响应
 */
export function getPositions(
  params: PositionQueryParams,
): Promise<PositionListResponse> {
  return postWithAuth('/positions/page', {
    ...params,
  }) as Promise<PositionListResponse>;
}

/**
 * 根据ID获取岗位详情
 * @param id - 岗位ID
 * @returns 岗位详情响应
 */
export function getPositionById(id: string): Promise<PositionDetailResponse> {
  return getWithAuth(`/positions/${id}`) as Promise<PositionDetailResponse>;
}

/**
 * 创建岗位
 * @param data - 岗位数据
 * @returns 创建结果响应
 */
export function createPosition(
  data: PositionCreateRequest,
): Promise<PositionMutationResponse> {
  return postWithAuth('/positions', data) as Promise<PositionMutationResponse>;
}

/**
 * 更新岗位
 * @param id - 岗位ID
 * @param data - 更新数据
 * @returns 更新结果响应
 */
export function updatePosition(
  data: PositionCreateRequest,
): Promise<PositionMutationResponse> {
  return putWithAuth(`/positions`, data) as Promise<PositionMutationResponse>;
}

/**
 * 删除岗位
 * @param id - 岗位ID
 * @returns 删除结果响应
 */
export function deletePosition(id: string): Promise<ApiResponse> {
  return delWithAuth(`/positions/${id}`) as Promise<ApiResponse>;
}

/**
 * 切换岗位收藏状态
 * @param id - 岗位ID
 * @returns 操作结果响应
 */
export function toggleCollect(id: string): Promise<ApiResponse> {
  return postWithAuth(`/positions/${id}/collect`, {}) as Promise<ApiResponse>;
}

/**
 * 创建面试记录
 * @param data - 面试记录数据
 * @returns 创建的面试记录响应
 */
export function createInterviewRecord(
  data: InterviewRecordCreateRequest,
): Promise<InterviewRecordResponse> {
  return postWithAuth('/interview-records', data) as Promise<InterviewRecordResponse>;
}

/**
 * 更新面试记录
 * @param id - 面试记录ID
 * @param data - 更新数据
 * @returns 更新后的面试记录响应
 */
export function updateInterviewRecord(
  id: number,
  data: InterviewRecordUpdateRequest,
): Promise<InterviewRecordResponse> {
  return putWithAuth(`/interview-records/${id}`, data) as Promise<InterviewRecordResponse>;
}

/**
 * 删除面试记录
 * @param id - 面试记录ID
 * @returns 删除结果响应
 */
export function deleteInterviewRecord(id: number): Promise<ApiResponse<void>> {
  return delWithAuth(`/interview-records/${id}`) as Promise<ApiResponse<void>>;
}

/**
 * 获取岗位的面试记录列表
 * @param positionId - 岗位ID
 * @returns 面试记录列表响应
 */
export function getInterviewRecordsByPosition(
  positionId: string,
): Promise<InterviewRecordListResponse> {
  return getWithAuth(`/positions/${positionId}/interview-records`) as Promise<InterviewRecordListResponse>;
}
