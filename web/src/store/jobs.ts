import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as positionApi from '@/api/position';
import type { Position, PositionStatus, PositionQueryParams } from '@/types';

/**
 * 岗位 Store 状态类型
 */
interface JobsState {
  jobs: Position[];
  loading: boolean;
  currentFilter: number | string | 'all';
  searchKeyword: string;
}

export const useJobsStore = defineStore('jobs', () => {
  // 状态
  const jobs = ref<Position[]>([]);
  const loading = ref<boolean>(false);
  const currentFilter = ref<number | string | 'all'>('all');
  const searchKeyword = ref<string>('');

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
        current: 1,
        size: 100,
        ...params,
      });

      // 后端返回格式: { code: 200, data: { records: [], total: 0 } }
      if (response.data && response.data.records) {
        jobs.value = response.data.records;
      } else if (Array.isArray(response.data)) {
        jobs.value = response.data;
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
    status: number | PositionStatus | 'all',
  ): Promise<void> {
    // 更新当前筛选器
    currentFilter.value = status;

    // 构建查询参数
    const params: Partial<PositionQueryParams> = {};

    // 如果不是"全部"，添加状态参数
    if (status !== 'all' && status !== null) {
      params.status = status as PositionStatus;
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
        await fetchJobs({ status: statusValue as PositionStatus });
      } else {
        await fetchJobs();
      }
      return;
    }

    // 调用后端API进行搜索
    const params: Partial<PositionQueryParams> = {
      // 同时搜索公司和岗位名称（后端需要支持这两个字段的模糊搜索）
      companyName: keyword,
      positionName: keyword,
    };

    // 如果同时有状态筛选，也传递状态参数
    if (currentFilter.value !== 'all' && currentFilter.value !== null) {
      const statusValue =
        typeof currentFilter.value === 'number'
          ? currentFilter.value
          : parseInt(currentFilter.value as string);
      params.status = statusValue as PositionStatus;
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
  function getJobById(id: number | string): Position | undefined {
    return jobs.value.find(job => job.id === parseInt(id as string));
  }

  /**
   * 添加岗位
   * @param job - 岗位数据
   */
  async function addJob(job: Partial<Position>): Promise<void> {
    try {
      // 直接使用后端字段名创建数据
      const backendData = {
        companyName: job.companyName || job.company || '',
        positionName: job.positionName || job.position || '',
        deliveryChannel: job.deliveryChannel || job.channel || '',
        deliveryDate:
          job.deliveryDate || job.applyDate || new Date().toISOString(),
        workLocation: job.workLocation || job.location || '',
        salaryRange: job.salaryRange || job.salary || '',
        jobDescription: job.jobDescription || job.jd || '',
        contactName: job.contactName || job.contact || '',
        contactPhone: job.contactPhone || '',
        remarks: job.remarks || job.remark || '',
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
  async function updateJob(
    id: number | string,
    updates: Partial<Position>,
  ): Promise<void> {
    try {
      // 支持新旧字段名
      const backendData: Record<string, any> = {};

      // 处理可能的旧字段名
      if (updates.company !== undefined && updates.companyName === undefined) {
        backendData.companyName = updates.company;
      }
      if (updates.companyName !== undefined) {
        backendData.companyName = updates.companyName;
      }

      if (
        updates.position !== undefined &&
        updates.positionName === undefined
      ) {
        backendData.positionName = updates.position;
      }
      if (updates.positionName !== undefined) {
        backendData.positionName = updates.positionName;
      }

      if (
        updates.channel !== undefined &&
        updates.deliveryChannel === undefined
      ) {
        backendData.deliveryChannel = updates.channel;
      }
      if (updates.deliveryChannel !== undefined) {
        backendData.deliveryChannel = updates.deliveryChannel;
      }

      if (
        updates.applyDate !== undefined &&
        updates.deliveryDate === undefined
      ) {
        backendData.deliveryDate = updates.applyDate;
      }
      if (updates.deliveryDate !== undefined) {
        backendData.deliveryDate = updates.deliveryDate;
      }

      if (
        updates.location !== undefined &&
        updates.workLocation === undefined
      ) {
        backendData.workLocation = updates.location;
      }
      if (updates.workLocation !== undefined) {
        backendData.workLocation = updates.workLocation;
      }

      if (updates.salary !== undefined && updates.salaryRange === undefined) {
        backendData.salaryRange = updates.salary;
      }
      if (updates.salaryRange !== undefined) {
        backendData.salaryRange = updates.salaryRange;
      }

      if (updates.jd !== undefined && updates.jobDescription === undefined) {
        backendData.jobDescription = updates.jd;
      }
      if (updates.jobDescription !== undefined) {
        backendData.jobDescription = updates.jobDescription;
      }

      if (updates.contact !== undefined && updates.contactName === undefined) {
        backendData.contactName = updates.contact;
      }
      if (updates.contactName !== undefined) {
        backendData.contactName = updates.contactName;
      }

      if (updates.remark !== undefined && updates.remarks === undefined) {
        backendData.remarks = updates.remark;
      }
      if (updates.remarks !== undefined) {
        backendData.remarks = updates.remarks;
      }

      if (updates.status !== undefined) {
        backendData.status = updates.status;
      }

      if (updates.isCollected !== undefined) {
        backendData.isCollected = updates.isCollected;
      }

      // 添加 ID
      backendData.id = parseInt(id as string);

      const response = await positionApi.updatePosition(
        parseInt(id as string),
        backendData,
      );
      // 更新本地数据
      const index = jobs.value.findIndex(
        job => job.id === parseInt(id as string),
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
  async function deleteJob(id: number | string): Promise<void> {
    try {
      const response = await positionApi.deletePosition(parseInt(id as string));
      // 从列表中移除
      const index = jobs.value.findIndex(
        job => job.id === parseInt(id as string),
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
  };
});
