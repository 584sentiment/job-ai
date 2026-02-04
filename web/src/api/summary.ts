import {
    postWithAuth,
    getWithAuth,
    putWithAuth,
    delWithAuth,
} from '@/utils/request';
import type {
    SummaryCreateRequest,
    SummaryUpdateRequest,
    SummaryListResponse,
    SummaryResponse,
    SummaryQueryParams,
    ApiResponse,
} from '@job-ai/shared';

/**
 * 创建总结
 * @param data - 总结数据
 * @returns 创建的总结响应
 */
export function createSummary(
    data: SummaryCreateRequest,
): Promise<SummaryResponse> {
    return postWithAuth('/summaries', data) as Promise<SummaryResponse>;
}

/**
 * 更新总结
 * @param id - 总结ID
 * @param data - 更新数据
 * @returns 更新后的总结响应
 */
export function updateSummary(
    id: string,
    data: SummaryUpdateRequest,
): Promise<SummaryResponse> {
    return putWithAuth(`/summaries/${id}`, data) as Promise<SummaryResponse>;
}

/**
 * 删除总结
 * @param id - 总结ID
 * @returns 删除结果响应
 */
export function deleteSummary(id: string): Promise<ApiResponse<void>> {
    return delWithAuth(`/summaries/${id}`) as Promise<ApiResponse<void>>;
}

/**
 * 分页查询总结
 * @param params - 查询参数
 * @returns 总结列表响应
 */
export function getSummariesPaginated(
    params: SummaryQueryParams,
): Promise<SummaryListResponse> {
    return postWithAuth('/summaries/page', params) as Promise<SummaryListResponse>;
}

/**
 * 根据ID获取总结详情
 * @param id - 总结ID
 * @returns 总结详情响应
 */
export function getSummaryById(id: string): Promise<SummaryResponse> {
    return getWithAuth(`/summaries/${id}`) as Promise<SummaryResponse>;
}
