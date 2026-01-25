import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as positionApi from '@/api/position';
import { Position, PositionCreateRequest, PositionQueryParams, PositionStatus } from '@/types';

export const useJobsStore = defineStore('jobs', () => {
  // 状态
  const jobs = ref<Position[]>([]);
  const loading = ref<boolean>(false);
  const currentFilter = ref<number | string | 'all'>('all');
  const searchKeyword = ref<string>('');

  // 分页状态
  const pagination = ref({
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
  });

  /**
   * 获取岗位列表
   * @param params - 查询参数
   */
  async function fetchJobs(
    params?: Partial<PositionQueryParams>,
  ): Promise<void> {
    loading.value = true;
    try {
      const response = await positionApi.getPositions({
        current: pagination.value.current,
        size: pagination.value.size,
        ...params,
      });

      // 后端返回格式: { code: 200, data: { records: [], total: 0, current: 1, size: 10 } }
      if (response.data) {
        if (response.data.records) {
          jobs.value = response.data.records;
        } else if (Array.isArray(response.data)) {
          jobs.value = response.data;
        } else {
          jobs.value = [];
        }

        // 更新分页信息
        if (response.data.total !== undefined) {
          pagination.value.total = response.data.total;
        }
        if (response.data.current !== undefined) {
          pagination.value.current = response.data.current;
        }
        if (response.data.size !== undefined) {
          pagination.value.size = response.data.size;
        }
        // 如果后端没有返回 pages，手动计算
        if (response.data.pages !== undefined) {
          pagination.value.pages = response.data.pages;
        } else {
          // 手动计算总页数
          pagination.value.pages = Math.ceil(
            pagination.value.total / pagination.value.size,
          );
        }
      } else {
        jobs.value = [];
      }
    } catch (error) {
      console.error('获取岗位列表失败:', error);
      jobs.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * 根据状态筛选岗位（后端筛选）
   * @param status - 状态值
   */
  async function filterByStatus(
    status: number | string | PositionStatus | 'all',
  ): Promise<void> {
    // 更新当前筛选器
    currentFilter.value = status;

    // 构建查询参数
    const params: Partial<PositionQueryParams> = {};

    // 如果不是"全部"，添加状态参数
    if (status !== 'all' && status !== null) {
      params.status = status as unknown as PositionStatus;
    }

    // 如果有搜索关键词，添加搜索参数
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      params.companyName = searchKeyword.value;
      params.positionName = searchKeyword.value;
    }

    // 调用后端API
    await fetchJobs(params);
  }

  /**
   * 搜索岗位（后端搜索）
   * @param keyword - 搜索关键词
   */
  async function searchJobs(keyword: string): Promise<void> {
    searchKeyword.value = keyword;

    // 如果关键词为空，重新获取所有数据
    if (!keyword || keyword.trim() === '') {
      // 如果有状态筛选，保持状态筛选
      if (currentFilter.value !== 'all' && currentFilter.value !== null) {
        const statusValue =
          typeof currentFilter.value === 'number'
            ? currentFilter.value
            : parseInt(currentFilter.value as string);
        await fetchJobs({ status: statusValue as unknown as PositionStatus });
      } else {
        await fetchJobs();
      }
      return;
    }

    // 调用后端API进行搜索
    const params: Partial<PositionQueryParams> = {
      // 使用 keyword 字段进行搜索
      keyword: keyword,
    };

    // 如果同时有状态筛选，也传递状态参数
    if (currentFilter.value !== 'all' && currentFilter.value !== null) {
      const statusValue =
        typeof currentFilter.value === 'number'
          ? currentFilter.value
          : parseInt(currentFilter.value as string);
      params.status = statusValue as unknown as PositionStatus;
    }

    await fetchJobs(params);
  }

  /**
   * 设置筛选器并触发后端筛选
   * @param filter - 筛选值
   */
  async function setFilter(filter: number | string | 'all'): Promise<void> {
    await filterByStatus(filter);
  }

  /**
   * 重置筛选
   */
  async function resetFilter(): Promise<void> {
    currentFilter.value = 'all';
    searchKeyword.value = '';
    pagination.value.current = 1; // 重置到第一页
    await fetchJobs();
  }

  /**
   * 跳转到指定页码
   * @param page - 页码
   */
  async function goToPage(page: number): Promise<void> {
    if (page < 1 || page > pagination.value.pages) return;
    pagination.value.current = page;
    await fetchJobs();
  }

  /**
   * 改变每页大小
   * @param size - 每页大小
   */
  async function changePageSize(size: number): Promise<void> {
    pagination.value.size = size;
    pagination.value.current = 1; // 改变大小时重置到第一页
    await fetchJobs();
  }

  // 计算属性 - 直接返回后端返回的岗位列表（不进行前端筛选）
  const filteredJobs = computed<Position[]>(() => {
    return jobs.value;
  });

  // 计算属性 - 岗位统计
  const jobStats = computed(() => {
    return {
      total: jobs.value.length,
      // 待投递
      pending: jobs.value.filter(
        j => j.status === PositionStatus.TO_BE_DELIVERED,
      ).length,
      // 已投递
      delivered: jobs.value.filter(j => j.status === PositionStatus.DELIVERED)
        .length,
      // 流程中
      inProcess: jobs.value.filter(j => j.status === PositionStatus.IN_PROCESS)
        .length,
      // 已Offer
      offered: jobs.value.filter(j => j.status === PositionStatus.OFFER).length,
      // 已入职
      joined: jobs.value.filter(j => j.status === PositionStatus.JOINED).length,
      // 未通过或已拒绝
      rejected: jobs.value.filter(
        j =>
          j.status === PositionStatus.REJECTED ||
          j.status === PositionStatus.NOT_PASS,
      ).length,
    };
  });

  /**
   * 根据 ID 获取岗位
   * @param id - 岗位ID
   */
  function getJobById(id: string): Position | undefined {
    return jobs.value.find(job => job.id === id);
  }

  /**
   * 添加岗位
   * @param job - 岗位数据
   */
  async function addJob(job: Partial<Position>): Promise<void> {
    try {
      // 直接使用后端字段名创建数据
      const backendData = {
        companyName: job.companyName || '',
        positionName: job.positionName || '',
        deliveryChannel: job.deliveryChannel || '',
        deliveryDate: job.deliveryDate || new Date().toISOString(),
        workLocation: job.workLocation || '',
        salaryRange: job.salaryRange || '',
        jobDescription: job.jobDescription || '',
        contactName: job.contactName || '',
        contactPhone: job.contactPhone || '',
        remarks: job.remarks || '',
        status: job.status ?? PositionStatus.TO_BE_DELIVERED,
        isCollected: job.isCollected ?? 0,
      };

      const response = await positionApi.createPosition(backendData);
      // 添加新岗位到列表
      if (response.data) {
        jobs.value.unshift(response.data);
      }
    } catch (error) {
      console.error('添加岗位失败:', error);
      throw error;
    }
  }

  /**
   * 更新岗位
   * @param id - 岗位ID
   * @param updates - 更新数据
   */
  async function updateJob(updates: PositionCreateRequest): Promise<void> {
    try {
      const response = await positionApi.updatePosition(updates);
      // 更新本地数据
      const index = jobs.value.findIndex(
        job => job.id === String(updates.id),
      );
      if (index !== -1 && response.data) {
        jobs.value[index] = response.data;
      }
    } catch (error) {
      console.error('更新岗位失败:', error);
      throw error;
    }
  }

  /**
   * 删除岗位
   * @param id - 岗位ID
   */
  async function deleteJob(id: string): Promise<void> {
    try {
      await positionApi.deletePosition(id);
      // 从列表中移除
      const index = jobs.value.findIndex(
        job => job.id === String(id),
      );
      if (index !== -1) {
        jobs.value.splice(index, 1);
      }
    } catch (error) {
      console.error('删除岗位失败:', error);
      throw error;
    }
  }

  return {
    // 状态
    jobs,
    loading,
    currentFilter,
    searchKeyword,
    pagination,

    // 计算属性
    filteredJobs,
    jobStats,

    // 方法
    fetchJobs,
    getJobById,
    addJob,
    updateJob,
    deleteJob,
    setFilter,
    filterByStatus,
    searchJobs,
    resetFilter,
    goToPage,
    changePageSize,
  };
});
