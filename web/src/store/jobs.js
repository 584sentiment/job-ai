import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as positionApi from '@/api/position'
import { mapPositionFromBackend, mapPositionToBackend } from '@/utils/position-mapper'

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
      let backendJobs = []
      if (response.data && response.data.records) {
        backendJobs = response.data.records
      } else if (Array.isArray(response.data)) {
        backendJobs = response.data
      }

      // 将后端数据转换为前端格式
      jobs.value = backendJobs.map(mapPositionFromBackend)
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
    return jobs.value.filter(job => job.status === currentFilter.value)
  })

  const jobStats = computed(() => ({
    total: jobs.value.length,
    interviewing: jobs.value.filter(j => ['interview1', 'interview2', 'interview3', 'final'].includes(j.status)).length,
    offered: jobs.value.filter(j => j.status === 'offered').length,
    rejected: jobs.value.filter(j => j.status === 'rejected').length
  }))

  // 方法
  const getJobById = (id) => {
    return jobs.value.find(job => job.id === parseInt(id))
  }

  async function addJob(job) {
    try {
      // 将前端数据转换为后端格式
      const backendData = mapPositionToBackend(job)
      const response = await positionApi.createPosition(backendData)
      // 添加新岗位到列表
      if (response.data) {
        const newJob = mapPositionFromBackend(response.data)
        jobs.value.unshift(newJob)
      }
      return response
    } catch (error) {
      console.error('添加岗位失败:', error)
      throw error
    }
  }

  async function updateJob(id, updates) {
    try {
      // 将前端数据转换为后端格式
      const backendData = mapPositionToBackend({ ...updates, id })
      const response = await positionApi.updatePosition(id, backendData)
      // 更新本地数据
      const index = jobs.value.findIndex(job => job.id === parseInt(id))
      if (index !== -1 && response.data) {
        jobs.value[index] = mapPositionFromBackend(response.data)
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
