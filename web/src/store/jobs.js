import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as positionApi from '@/api/position'

export const useJobsStore = defineStore('jobs', () => {
  // 状态
  const jobs = ref([])
  const loading = ref(false)
  const currentFilter = ref('all')

  /**
   * 获取岗位列表
   * @param {object} params - 查询参数
   */
  async function fetchJobs(params = {}) {
    loading.value = true
    try {
      const response = await positionApi.getPositions({
        current: 1,
        size: 100,
        ...params
      })
      // 后端返回格式: { code: 200, data: { records: [], total: 0 } }
      if (response.data && response.data.records) {
        // 由于类型定义已与后端一致，直接使用后端数据
        jobs.value = response.data.records
      } else if (Array.isArray(response.data)) {
        jobs.value = response.data
      } else {
        jobs.value = []
      }
    } catch (error) {
      console.error('获取岗位列表失败:', error)
      jobs.value = []
    } finally {
      loading.value = false
    }
  }

  // 计算属性
  const filteredJobs = computed(() => {
    if (currentFilter.value === 'all') {
      return jobs.value
    }
    // 由于现在使用数字枚举值，需要将字符串转换为数字
    const filterValue = parseInt(currentFilter.value) || currentFilter.value
    return jobs.value.filter(job => job.status === filterValue)
  })

  const jobStats = computed(() => ({
    total: jobs.value.length,
    // 使用 PositionStatus 枚举值进行统计
    interviewing: jobs.value.filter(j => j.status === 2).length, // IN_PROCESS
    offered: jobs.value.filter(j => j.status === 3).length,      // OFFER
    rejected: jobs.value.filter(j => j.status === 5 || j.status === -1).length // REJECTED, NOT_PASS
  }))

  // 方法
  const getJobById = (id) => {
    return jobs.value.find(job => job.id === parseInt(id))
  }

  async function addJob(job) {
    try {
      // 直接使用后端字段名创建数据
      const backendData = {
        companyName: job.company || job.companyName,
        positionName: job.position || job.positionName,
        deliveryChannel: job.channel || job.deliveryChannel,
        deliveryDate: job.applyDate || new Date().toISOString(),
        workLocation: job.location || job.workLocation || '',
        salaryRange: job.salary || job.salaryRange || '',
        jobDescription: job.jd || job.jobDescription || '',
        contactName: job.contact || job.contactName || '',
        contactPhone: job.contactPhone || '',
        remarks: job.remark || job.remarks || '',
        status: job.status ?? 0,
        isCollected: job.isCollected ?? 0
      }

      const response = await positionApi.createPosition(backendData)
      // 添加新岗位到列表
      if (response.data) {
        jobs.value.unshift(response.data)
      }
      return response
    } catch (error) {
      console.error('添加岗位失败:', error)
      throw error
    }
  }

  async function updateJob(id, updates) {
    try {
      // 支持新旧字段名
      const backendData = {
        ...(updates.companyName !== undefined ? {} : { companyName: updates.company }),
        ...(updates.positionName !== undefined ? {} : { positionName: updates.position }),
        ...(updates.deliveryChannel !== undefined ? {} : { deliveryChannel: updates.channel }),
        ...(updates.deliveryDate !== undefined ? {} : { deliveryDate: updates.applyDate }),
        ...(updates.workLocation !== undefined ? {} : { workLocation: updates.location }),
        ...(updates.salaryRange !== undefined ? {} : { salaryRange: updates.salary }),
        ...(updates.jobDescription !== undefined ? {} : { jobDescription: updates.jd }),
        ...(updates.contactName !== undefined ? {} : { contactName: updates.contact }),
        ...(updates.contactPhone !== undefined ? {} : { contactPhone: updates.contactPhone }),
        ...(updates.remarks !== undefined ? {} : { remarks: updates.remark }),
        ...(updates.status !== undefined ? {} : { status: updates.status }),
        ...(updates.isCollected !== undefined ? {} : { isCollected: updates.isCollected }),
        id
      }

      // 移除 undefined 值
      Object.keys(backendData).forEach(key => {
        if (backendData[key] === undefined) delete backendData[key]
      })

      const response = await positionApi.updatePosition(id, backendData)
      // 更新本地数据
      const index = jobs.value.findIndex(job => job.id === parseInt(id))
      if (index !== -1 && response.data) {
        jobs.value[index] = response.data
      }
      return response
    } catch (error) {
      console.error('更新岗位失败:', error)
      throw error
    }
  }

  async function deleteJob(id) {
    try {
      const response = await positionApi.deletePosition(id)
      // 从列表中移除
      const index = jobs.value.findIndex(job => job.id === parseInt(id))
      if (index !== -1) {
        jobs.value.splice(index, 1)
      }
      return response
    } catch (error) {
      console.error('删除岗位失败:', error)
      throw error
    }
  }

  const setFilter = (filter) => {
    currentFilter.value = filter
  }

  return {
    jobs,
    loading,
    currentFilter,
    filteredJobs,
    jobStats,
    fetchJobs,
    getJobById,
    addJob,
    updateJob,
    deleteJob,
    setFilter
  }
})
