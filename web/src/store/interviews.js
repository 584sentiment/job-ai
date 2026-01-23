import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useInterviewsStore = defineStore('interviews', () => {
  // 状态
  const interviews = ref([
    {
      id: 1,
      company: '字节跳动',
      position: '前端开发工程师',
      round: '一面',
      date: '2025-12-26',
      color: 'blue',
      content: `主要考察了Vue3的响应式原理、性能优化、组件通信等内容。面试官很专业,问题比较有深度。具体问题包括:
1. Vue3的响应式原理与Vue2的区别
2. 如何优化Vue应用的性能
3. provide/inject的实现原理
4. 手写一个简单的响应式系统`,
      tags: ['Vue3', '性能优化', '源码'],
      views: 128,
      comments: 8,
      isFavorite: true,
      createTime: '2025-12-26T08:00:00.000Z'
    },
    {
      id: 2,
      company: '腾讯',
      position: '全栈开发工程师',
      round: '二面',
      date: '2025-12-20',
      color: 'green',
      content: `二面主要考察系统设计和架构能力。需要设计一个在线协作文档系统,考察了实时通信方案、数据一致性处理、多人冲突解决等。面试官注重思考过程和方案对比。`,
      tags: ['系统设计', '架构', '实时通信'],
      views: 89,
      comments: 5,
      isFavorite: false,
      createTime: '2025-12-20T08:00:00.000Z'
    },
    {
      id: 3,
      company: '阿里巴巴',
      position: '前端开发工程师',
      round: '终面',
      date: '2025-12-15',
      color: 'orange',
      content: `终面是交叉面,由其他团队的Leader面试。主要考察项目经验和团队协作能力,问了很多之前项目的架构设计和技术选型理由,以及遇到的难点和解决方案。`,
      tags: ['项目经验', '团队协作', '架构设计'],
      views: 256,
      comments: 15,
      isFavorite: true,
      createTime: '2025-12-15T08:00:00.000Z'
    },
    {
      id: 4,
      company: '美团',
      position: '后端开发工程师',
      round: '笔试',
      date: '2025-12-10',
      color: 'purple',
      content: `笔试主要考察算法和编程能力,包括动态规划、图论、字符串处理等。题目难度适中,需要熟悉常见数据结构和算法。建议提前刷LeetCode。`,
      tags: ['算法', '动态规划', '数据结构'],
      views: 64,
      comments: 3,
      isFavorite: false,
      createTime: '2025-12-10T08:00:00.000Z'
    }
  ])

  const currentFilter = ref('all')

  // 计算属性
  const filteredInterviews = computed(() => {
    if (currentFilter.value === 'all') {
      return interviews.value
    }
    if (currentFilter.value === 'favorite') {
      return interviews.value.filter(i => i.isFavorite)
    }
    return interviews.value.filter(i => i.company === currentFilter.value)
  })

  // 方法
  const getInterviewById = (id) => {
    return interviews.value.find(item => item.id === parseInt(id))
  }

  const addInterview = (interview) => {
    const newInterview = {
      ...interview,
      id: Date.now(),
      views: 0,
      comments: 0,
      isFavorite: false,
      createTime: new Date().toISOString()
    }
    interviews.value.unshift(newInterview)
  }

  const toggleFavorite = (id) => {
    const interview = getInterviewById(id)
    if (interview) {
      interview.isFavorite = !interview.isFavorite
    }
  }

  const setFilter = (filter) => {
    currentFilter.value = filter
  }

  return {
    interviews,
    currentFilter,
    filteredInterviews,
    getInterviewById,
    addInterview,
    toggleFavorite,
    setFilter
  }
})
