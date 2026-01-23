import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSummariesStore = defineStore('summaries', () => {
  // 状态
  const summaries = ref([
    {
      id: 1,
      company: '字节跳动',
      position: '前端开发工程师',
      round: '一面',
      date: '2025-12-25',
      color: 'blue',
      status: 'pending',
      weakness: '对Vue3响应式原理理解不够深入,性能优化实践经验较少',
      improvements: '1. 深入学习Vue3源码,理解Proxy实现原理 2. 学习性能优化最佳实践 3. 实践项目优化',
      focus: '面试官特别关注源码阅读能力和实际项目经验',
      comments: 3,
      createTime: '2025-12-25T08:00:00.000Z'
    },
    {
      id: 2,
      company: '腾讯',
      position: '全栈开发工程师',
      round: '二面',
      date: '2025-12-20',
      color: 'green',
      status: 'completed',
      weakness: '系统设计经验不足,对分布式系统理解不够深入',
      improvements: '1. 学习分布式系统基础理论 2. 研究大型系统架构案例 3. 实践系统设计题目',
      focus: '面试官强调系统设计的可扩展性和容错性考虑',
      comments: 5,
      createTime: '2025-12-20T08:00:00.000Z'
    },
    {
      id: 3,
      company: '阿里巴巴',
      position: '前端开发工程师',
      round: '终面',
      date: '2025-12-15',
      color: 'orange',
      status: 'completed',
      weakness: '项目经验表达不够清晰,技术选型理由阐述不够充分',
      improvements: '1. 整理项目经验,用STAR法则描述 2. 梳理技术选型决策过程 3. 准备项目难点案例',
      focus: '终面更看重项目影响力和个人成长,而非技术细节',
      comments: 4,
      createTime: '2025-12-15T08:00:00.000Z'
    }
  ])

  const currentFilter = ref('all')

  // 计算属性
  const filteredSummaries = computed(() => {
    if (currentFilter.value === 'all') {
      return summaries.value
    }
    if (currentFilter.value === 'pending') {
      return summaries.value.filter(s => s.status === 'pending')
    }
    return summaries.value.filter(s => s.company === currentFilter.value)
  })

  const summaryStats = computed(() => ({
    total: summaries.value.length,
    completed: summaries.value.filter(s => s.status === 'completed').length,
    pending: summaries.value.filter(s => s.status === 'pending').length,
    progress: summaries.value.length > 0
      ? Math.round((summaries.value.filter(s => s.status === 'completed').length / summaries.value.length) * 100)
      : 0
  }))

  // 方法
  const getSummaryById = (id) => {
    return summaries.value.find(item => item.id === parseInt(id))
  }

  const addSummary = (summary) => {
    const newSummary = {
      ...summary,
      id: Date.now(),
      comments: 0,
      createTime: new Date().toISOString()
    }
    summaries.value.unshift(newSummary)
  }

  const updateSummaryStatus = (id, status) => {
    const summary = getSummaryById(id)
    if (summary) {
      summary.status = status
    }
  }

  const setFilter = (filter) => {
    currentFilter.value = filter
  }

  return {
    summaries,
    currentFilter,
    filteredSummaries,
    summaryStats,
    getSummaryById,
    addSummary,
    updateSummaryStatus,
    setFilter
  }
})
