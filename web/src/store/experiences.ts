import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as experienceApi from '@/api/experience'
import type { Experience, ExperienceCreateRequest, ExperienceUpdateRequest, ExperienceQueryParams } from '@/types'

export const useExperienceStore = defineStore('experience', () => {
  // 状态
  const experiences = ref<Experience[]>([
    {
      id: 1,
      companyName: '字节跳动',
      positionName: '前端开发工程师',
      interviewRound: '一面',
      interviewDate: '2025-01-20',
      content: '<h2>面试概述</h2><p>主要考察了Vue3的响应式原理、性能优化、组件通信等内容。面试官很专业，问题比较有深度。</p><h2>具体问题</h2><ol><li>Vue3的响应式原理与Vue2的区别</li><li>如何优化Vue应用的性能</li><li>provide/inject的实现原理</li><li>手写一个简单的响应式系统</li></ol>',
      contentType: 'html',
      tags: ['Vue3', '性能优化', '源码'],
      isFavorite: 1,
      isAnonymous: 1,
      views: 128,
      comments: 8,
      createTime: '2025-01-20T10:00:00Z',
      updateTime: '2025-01-20T10:00:00Z'
    },
    {
      id: 2,
      companyName: '腾讯',
      positionName: '全栈开发工程师',
      interviewRound: '二面',
      interviewDate: '2025-01-18',
      content: '<h2>面试概述</h2><p>二面主要考察系统设计和架构能力。需要设计一个在线协作文档系统，考察了实时通信方案、数据一致性处理、多人冲突解决等。</p>',
      contentType: 'html',
      tags: ['系统设计', '架构', '实时通信'],
      isFavorite: 0,
      isAnonymous: 0,
      views: 89,
      comments: 5,
      createTime: '2025-01-18T10:00:00Z',
      updateTime: '2025-01-18T10:00:00Z'
    },
    {
      id: 3,
      companyName: '阿里巴巴',
      positionName: '前端开发工程师',
      interviewRound: '终面',
      interviewDate: '2025-01-15',
      content: '<h2>面试概述</h2><p>终面是交叉面，由其他团队的Leader面试。主要考察项目经验和团队协作能力，问了很多之前项目的架构设计和技术选型理由。</p>',
      contentType: 'html',
      tags: ['项目经验', '团队协作', '架构设计'],
      isFavorite: 1,
      isAnonymous: 1,
      views: 256,
      comments: 15,
      createTime: '2025-01-15T10:00:00Z',
      updateTime: '2025-01-15T10:00:00Z'
    },
    {
      id: 4,
      companyName: '美团',
      positionName: '后端开发工程师',
      interviewRound: '笔试',
      interviewDate: '2025-01-10',
      content: '<h2>面试概述</h2><p>笔试主要考察算法和编程能力，包括动态规划、图论、字符串处理等。题目难度适中，需要熟悉常见数据结构和算法。</p>',
      contentType: 'html',
      tags: ['算法', '动态规划', '数据结构'],
      isFavorite: 0,
      isAnonymous: 0,
      views: 64,
      comments: 3,
      createTime: '2025-01-10T10:00:00Z',
      updateTime: '2025-01-10T10:00:00Z'
    }
  ])
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
    // 如果已经有模拟数据，直接返回
    if (experiences.value.length > 0) {
      return
    }

    loading.value = true
    try {
      const queryParams: ExperienceQueryParams = {
        current: pagination.value.current,
        size: pagination.value.size,
        ...params
      }

      const response = await experienceApi.getExperiencesPage(queryParams)

      if (response.code === 200 && response.data) {
        experiences.value = response.data

        // 更新分页信息（如果后端返回了分页信息）
        // 注意：这里假设后端在响应中包含分页信息
        // 实际实现可能需要根据后端响应结构调整
      }
    } catch (error) {
      console.error('获取面经列表失败:', error)
      // 保持模拟数据，不清空
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据ID获取面经详情
   * @param id - 面经ID
   */
  async function fetchExperienceById(id: number) {
    loading.value = true
    try {
      // 先从模拟数据中查找
      const mockData = experiences.value.find(exp => exp.id === id)
      if (mockData) {
        currentExperience.value = mockData
        return currentExperience.value
      }

      // 如果模拟数据中没有，再调用API
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
  async function updateExperience(id: number, data: ExperienceUpdateRequest) {
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
  async function deleteExperience(id: number) {
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
  async function toggleFavorite(id: number) {
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
