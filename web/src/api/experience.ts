import {
  postWithAuth,
  getWithAuth,
  putWithAuth,
  delWithAuth,
} from '@/utils/request';
import type {
  Experience,
  ExperienceCreateRequest,
  ExperienceUpdateRequest,
  ExperienceListResponse,
  ExperienceResponse,
  ExperienceQueryParams,
  ExperienceStats,
  ExperienceComment,
  ExperienceCommentCreateRequest,
  ExperienceCommentListResponse,
  ExperienceFavoriteResponse,
  ApiResponse,
} from '@/types';

/**
 * ==================== 面经 CRUD ====================
 */

/**
 * 创建面经
 * @param data - 面经数据
 * @returns 创建的面经响应
 */
export function createExperience(
  data: ExperienceCreateRequest,
): Promise<ExperienceResponse> {
  return postWithAuth('/experiences', data) as Promise<ExperienceResponse>;
}

/**
 * 更新面经
 * @param id - 面经ID
 * @param data - 更新数据
 * @returns 更新后的面经响应
 */
export function updateExperience(
  id: number,
  data: ExperienceUpdateRequest,
): Promise<ExperienceResponse> {
  return putWithAuth(`/experiences/${id}`, data) as Promise<ExperienceResponse>;
}

/**
 * 删除面经
 * @param id - 面经ID
 * @returns 删除结果响应
 */
export function deleteExperience(id: number): Promise<ApiResponse<void>> {
  return delWithAuth(`/experiences/${id}`) as Promise<ApiResponse<void>>;
}

/**
 * 根据ID获取面经详情
 * @param id - 面经ID
 * @returns 面经详情响应
 */
export function getExperienceById(id: number): Promise<ExperienceResponse> {
  return getWithAuth(`/experiences/${id}`) as Promise<ExperienceResponse>;
}

/**
 * 分页查询面经
 * @param params - 查询参数
 * @returns 面经列表响应
 */
export function getExperiencesPage(
  params: ExperienceQueryParams,
): Promise<ExperienceListResponse> {
  return postWithAuth('/experiences/page', params) as Promise<ExperienceListResponse>;
}

/**
 * 获取用户的所有面经
 * @returns 面经列表响应
 */
export function getAllExperiences(): Promise<ExperienceListResponse> {
  return getWithAuth('/experiences/all') as Promise<ExperienceListResponse>;
}

/**
 * 获取岗位的面经列表
 * @param positionId - 岗位ID
 * @returns 面经列表响应
 */
export function getExperiencesByPosition(
  positionId: string,
): Promise<ExperienceListResponse> {
  return getWithAuth(`/experiences/position/${positionId}`) as Promise<ExperienceListResponse>;
}

/**
 * ==================== 收藏功能 ====================
 */

/**
 * 切换面经收藏状态
 * @param id - 面经ID
 * @returns 收藏操作响应
 */
export function toggleExperienceFavorite(id: number): Promise<ExperienceFavoriteResponse> {
  return postWithAuth(`/experiences/${id}/favorite`, {}) as Promise<ExperienceFavoriteResponse>;
}

/**
 * 获取用户收藏的面经列表
 * @returns 面经列表响应
 */
export function getFavoriteExperiences(): Promise<ExperienceListResponse> {
  return getWithAuth('/experiences/favorites') as Promise<ExperienceListResponse>;
}

/**
 * ==================== 搜索功能 ====================
 */

/**
 * 搜索面经
 * @param keyword - 搜索关键词
 * @param page - 页码（默认1）
 * @param size - 每页大小（默认10）
 * @returns 面经列表响应
 */
export function searchExperiences(
  keyword: string,
  page: number = 1,
  size: number = 10,
): Promise<ExperienceListResponse> {
  return postWithAuth('/experiences/search', {
    keyword,
    current: page,
    size,
  }) as Promise<ExperienceListResponse>;
}

/**
 * ==================== 统计功能 ====================
 */

/**
 * 获取面经统计信息
 * @returns 面经统计响应
 */
export function getExperienceStats(): Promise<ApiResponse<ExperienceStats>> {
  return getWithAuth('/experiences/stats') as Promise<ApiResponse<ExperienceStats>>;
}

/**
 * 增加面经浏览量
 * @param id - 面经ID
 * @returns 操作结果响应
 */
export function incrementExperienceViews(id: number): Promise<ApiResponse<{ views: number }>> {
  return postWithAuth(`/experiences/${id}/view`, {}) as Promise<ApiResponse<{ views: number }>>;
}

/**
 * ==================== 评论功能 ====================
 */

/**
 * 获取面经的评论列表
 * @param experienceId - 面经ID
 * @param page - 页码（默认1）
 * @param size - 每页大小（默认20）
 * @returns 评论列表响应
 */
export function getExperienceComments(
  experienceId: number,
  page: number = 1,
  size: number = 20,
): Promise<ExperienceCommentListResponse> {
  return getWithAuth(
    `/experiences/${experienceId}/comments?page=${page}&size=${size}`
  ) as Promise<ExperienceCommentListResponse>;
}

/**
 * 创建评论
 * @param data - 评论数据
 * @returns 评论响应
 */
export function createExperienceComment(
  data: ExperienceCommentCreateRequest,
): Promise<ApiResponse<ExperienceComment>> {
  return postWithAuth('/experiences/comments', data) as Promise<ApiResponse<ExperienceComment>>;
}

/**
 * 删除评论
 * @param commentId - 评论ID
 * @returns 删除结果响应
 */
export function deleteExperienceComment(commentId: number): Promise<ApiResponse<void>> {
  return delWithAuth(`/experiences/comments/${commentId}`) as Promise<ApiResponse<void>>;
}

/**
 * 点赞评论
 * @param commentId - 评论ID
 * @returns 操作结果响应
 */
export function likeExperienceComment(commentId: number): Promise<ApiResponse<{ likes: number }>> {
  return postWithAuth(`/experiences/comments/${commentId}/like`, {}) as Promise<ApiResponse<{ likes: number }>>;
}

/**
 * 取消点赞评论
 * @param commentId - 评论ID
 * @returns 操作结果响应
 */
export function unlikeExperienceComment(commentId: number): Promise<ApiResponse<{ likes: number }>> {
  return delWithAuth(`/experiences/comments/${commentId}/like`) as Promise<ApiResponse<{ likes: number }>>;
}

/**
 * ==================== 标签功能 ====================
 */

/**
 * 获取热门标签
 * @param limit - 返回数量（默认20）
 * @returns 标签列表响应
 */
export function getHotTags(limit: number = 20): Promise<ApiResponse<{ tag: string; count: number }[]>> {
  return getWithAuth(`/experiences/tags/hot?limit=${limit}`) as Promise<ApiResponse<{ tag: string; count: number }[]>>;
}

/**
 * 根据标签获取面经
 * @param tags - 标签数组
 * @param page - 页码（默认1）
 * @param size - 每页大小（默认10）
 * @returns 面经列表响应
 */
export function getExperiencesByTags(
  tags: string[],
  page: number = 1,
  size: number = 10,
): Promise<ExperienceListResponse> {
  return postWithAuth('/experiences/tags/filter', {
    tags,
    current: page,
    size,
  }) as Promise<ExperienceListResponse>;
}

/**
 * ==================== 批量操作 ====================
 */

/**
 * 批量删除面经
 * @param ids - 面经ID数组
 * @returns 删除结果响应
 */
export function batchDeleteExperiences(ids: number[]): Promise<ApiResponse<{ success: number; failed: number }>> {
  return postWithAuth('/experiences/batch-delete', { ids }) as Promise<ApiResponse<{ success: number; failed: number }>>;
}

/**
 * 批量更新标签
 * @param ids - 面经ID数组
 * @param tags - 新标签数组
 * @returns 操作结果响应
 */
export function batchUpdateTags(
  ids: number[],
  tags: string[],
): Promise<ApiResponse<void>> {
  return postWithAuth('/experiences/batch-update-tags', { ids, tags }) as Promise<ApiResponse<void>>;
}
