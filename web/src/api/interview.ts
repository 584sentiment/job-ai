import {
  postWithAuth,
  getWithAuth,
  putWithAuth,
  delWithAuth,
} from '@/utils/request';
import type {
  InterviewCreateRequest,
  InterviewUpdateRequest,
  InterviewListResponse,
  InterviewResponse,
  InterviewQueryParams,
  ApiResponse,
} from '@/types';

/**
 * 创建面试记录
 * @param data - 面试记录数据
 * @returns 创建的面试记录响应
 */
export function createInterview(
  data: InterviewCreateRequest,
): Promise<InterviewResponse> {
  return postWithAuth('/interviews', data) as Promise<InterviewResponse>;
}

/**
 * 更新面试记录
 * @param id - 面试记录ID
 * @param data - 更新数据
 * @returns 更新后的面试记录响应
 */
export function updateInterview(
  id: number,
  data: InterviewUpdateRequest,
): Promise<InterviewResponse> {
  return putWithAuth(`/interviews/${id}`, data) as Promise<InterviewResponse>;
}

/**
 * 删除面试记录
 * @param id - 面试记录ID
 * @returns 删除结果响应
 */
export function deleteInterview(id: number): Promise<ApiResponse<void>> {
  return delWithAuth(`/interviews/${id}`) as Promise<ApiResponse<void>>;
}

/**
 * 获取岗位的面试记录列表
 * @param positionId - 岗位ID
 * @returns 面试记录列表响应
 */
export function getInterviewsByPosition(
  positionId: string,
): Promise<InterviewListResponse> {
  return getWithAuth(`/interviews/position/${positionId}`) as Promise<InterviewListResponse>;
}

/**
 * 分页查询面试记录
 * @param params - 查询参数
 * @returns 面试记录列表响应
 */
export function getInterviewsPage(
  params: InterviewQueryParams,
): Promise<InterviewListResponse> {
  return postWithAuth('/interviews/page', params) as Promise<InterviewListResponse>;
}

/**
 * 根据ID获取面试记录详情
 * @param id - 面试记录ID
 * @returns 面试记录详情响应
 */
export function getInterviewById(id: number): Promise<InterviewResponse> {
  return getWithAuth(`/interviews/${id}`) as Promise<InterviewResponse>;
}
