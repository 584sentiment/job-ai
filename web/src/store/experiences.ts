import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as experienceApi from '@/api/experience'
import type { Experience, ExperienceCreateRequest, ExperienceUpdateRequest, ExperienceQueryParams } from '@/types'

export const useExperienceStore = defineStore('experience', () => {
  // 状态
  const experiences = ref<Experience[]>([])
  const currentExperience = ref<Experience | null>(null)
  const loading = ref<boolean>(false)
  const currentFilter = ref<'all' | 'favorite'>('all')
  const searchKeyword = ref<string>('')

  // 分页状态
  const pagination = ref({
    current: 1,
    size: 10,
    total: 0,
    pages: 0
  })

  // 计算属性 - 过滤后的面经列表
  const filteredExperiences = computed(() => {
    let filtered = experiences.value

    // 按筛选条件过滤
    if (currentFilter.value === 'favorite') {
      filtered = filtered.filter(exp => exp.isFavorite === 1)
    }

    // 按关键词搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      filtered = filtered.filter(exp =>
        exp.companyName.toLowerCase().includes(keyword) ||
        exp.positionName.toLowerCase().includes(keyword) ||
        exp.content.toLowerCase().includes(keyword) ||
        exp.tags.some(tag => tag.toLowerCase().includes(keyword))
      )
    }

    return filtered
  })

  // 计算属性 - 收藏的面经
  const favoriteExperiences = computed(() =>
    experiences.value.filter(exp => exp.isFavorite === 1)
  )

  // 计算属性 - 统计信息
  const stats = computed(() => ({
    total: experiences.value.length,
    favorites: experiences.value.filter(exp => exp.isFavorite === 1).length,
    totalViews: experiences.value.reduce((sum, exp) => sum + exp.views, 0),
    totalComments: experiences.value.reduce((sum, exp) => sum + exp.comments, 0)
  }))

  /**
   * 获取面经列表
   * @param params - 查询参数
   */
  async function fetchExperiences(params?: Partial<ExperienceQueryParams>) {
    loading.value = true
    try {
      const queryParams: ExperienceQueryParams = {
        current: pagination.value.current,
        size: pagination.value.size,
        ...params
      }

      const response = await experienceApi.getExperiencesPage(queryParams)

      if (response.code === 200 && response.data) {
        // 如果后端返回的是分页响应结构 { records, total, current, size }
        if (response.data.records && Array.isArray(response.data.records)) {
          experiences.value = response.data.records
          pagination.value.total = response.data.total || 0
          pagination.value.current = response.data.current || 1
          pagination.value.pages = Math.ceil(pagination.value.total / pagination.value.size)
        } else if (response.data.list && Array.isArray(response.data.list)) {
          // 兼容其他分页结构 { list, total, page, pageSize }
          experiences.value = response.data.list
          pagination.value.total = response.data.total || 0
          pagination.value.pages = Math.ceil(pagination.value.total / pagination.value.size)
        } else if (Array.isArray(response.data)) {
          // 如果后端直接返回数组
          experiences.value = response.data
        }
      }
    } catch (error) {
      console.error('获取面经列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据ID获取面经详情
   * @param id - 面经ID
   */
  async function fetchExperienceById(id: string) {
    loading.value = true
    try {
      // 直接调用真实API
      const response = await experienceApi.getExperienceById(id)

      if (response.code === 200 && response.data) {
        currentExperience.value = response.data
        return currentExperience.value
      }
    } catch (error) {
      console.error('获取面经详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建面经
   * @param data - 面经数据
   */
  async function createExperience(data: ExperienceCreateRequest) {
    loading.value = true
    try {
      const response = await experienceApi.createExperience(data)

      if (response.code === 200 && response.data) {
        experiences.value.unshift(response.data)
        return response.data
      }
    } catch (error) {
      console.error('创建面经失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新面经
   * @param id - 面经ID
   * @param data - 更新数据
   */
  async function updateExperience(id: string, data: ExperienceUpdateRequest) {
    loading.value = true
    try {
      const response = await experienceApi.updateExperience(id, data)

      if (response.code === 200 && response.data) {
        const index = experiences.value.findIndex(exp => exp.id === id)
        if (index !== -1) {
          experiences.value[index] = response.data
        }
        if (currentExperience.value?.id === id) {
          currentExperience.value = response.data
        }
        return response.data
      }
    } catch (error) {
      console.error('更新面经失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除面经
   * @param id - 面经ID
   */
  async function deleteExperience(id: string) {
    loading.value = true
    try {
      const response = await experienceApi.deleteExperience(id)

      if (response.code === 200) {
        const index = experiences.value.findIndex(exp => exp.id === id)
        if (index !== -1) {
          experiences.value.splice(index, 1)
        }
        if (currentExperience.value?.id === id) {
          currentExperience.value = null
        }
        return true
      }
    } catch (error) {
      console.error('删除面经失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 切换收藏状态
   * @param id - 面经ID
   */
  async function toggleFavorite(id: string) {
    try {
      const response = await experienceApi.toggleExperienceFavorite(id)

      if (response.code === 200) {
        const exp = experiences.value.find(e => e.id === id)
        if (exp) {
          exp.isFavorite = response.data.isFavorite ? 1 : 0
        }
        if (currentExperience.value?.id === id) {
          currentExperience.value.isFavorite = response.data.isFavorite ? 1 : 0
        }
        return response.data
      }
    } catch (error) {
      console.error('切换收藏失败:', error)
      throw error
    }
  }

  /**
   * 设置筛选器
   * @param filter - 筛选值
   */
  function setFilter(filter: 'all' | 'favorite') {
    currentFilter.value = filter
  }

  /**
   * 设置搜索关键词
   * @param keyword - 关键词
   */
  function setSearchKeyword(keyword: string) {
    searchKeyword.value = keyword
  }

  /**
   * 重置筛选
   */
  function resetFilter() {
    currentFilter.value = 'all'
    searchKeyword.value = ''
    pagination.value.current = 1
  }

  /**
   * 跳转到指定页码
   * @param page - 页码
   */
  async function goToPage(page: number) {
    if (page < 1 || page > pagination.value.pages) return
    pagination.value.current = page
    await fetchExperiences()
  }

  /**
   * 改变每页大小
   * @param size - 每页大小
   */
  async function changePageSize(size: number) {
    pagination.value.size = size
    pagination.value.current = 1
    await fetchExperiences()
  }

  return {
    // 状态
    experiences,
    currentExperience,
    loading,
    currentFilter,
    searchKeyword,
    pagination,

    // 计算属性
    filteredExperiences,
    favoriteExperiences,
    stats,

    // 方法
    fetchExperiences,
    fetchExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
    toggleFavorite,
    setFilter,
    setSearchKeyword,
    resetFilter,
    goToPage,
    changePageSize
  }
})
