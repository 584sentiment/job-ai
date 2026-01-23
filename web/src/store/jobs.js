import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useJobsStore = defineStore('jobs', () => {
  // 状态
  const jobs = ref([
    {
      id: 1,
      company: '字节跳动',
      position: '前端开发工程师',
      channel: '内推',
      location: '北京',
      salary: '25-40K',
      status: 'interview2',
      applyDate: '2025-12-15',
      remark: '一面结束,面试官反馈技术能力不错,等待二面通知',
      color: 'blue',
      timeline: [
        { status: '投递简历', date: '2025-12-15', desc: '通过内推投递简历' },
        { status: '初筛通过', date: '2025-12-17', desc: 'HR电话沟通,邀请参加笔试' },
        { status: '笔试完成', date: '2025-12-20', desc: '线上笔试,成绩良好' },
        { status: '一面', date: '2025-12-25', desc: '技术面试,考察Vue/React及算法' }
      ],
      createTime: '2025-12-15T08:00:00.000Z',
      updateTime: '2025-12-15T08:00:00.000Z'
    },
    {
      id: 2,
      company: '腾讯',
      position: '全栈开发工程师',
      channel: '招聘APP',
      location: '深圳',
      salary: '30-50K',
      status: 'screening',
      applyDate: '2025-12-18',
      remark: '简历已提交,等待HR审核',
      color: 'green',
      timeline: [
        { status: '投递简历', date: '2025-12-18', desc: '通过招聘APP投递简历' }
      ],
      createTime: '2025-12-18T08:00:00.000Z',
      updateTime: '2025-12-18T08:00:00.000Z'
    },
    {
      id: 3,
      company: '阿里巴巴',
      position: '前端开发工程师',
      channel: '内推',
      location: '杭州',
      salary: '28-45K',
      status: 'offered',
      applyDate: '2025-12-01',
      remark: '收到offer,正在考虑中',
      color: 'orange',
      timeline: [
        { status: '投递简历', date: '2025-12-01', desc: '通过内推投递简历' },
        { status: '终面', date: '2025-12-10', desc: '终面通过' }
      ],
      createTime: '2025-12-01T08:00:00.000Z',
      updateTime: '2025-12-01T08:00:00.000Z'
    },
    {
      id: 4,
      company: '美团',
      position: '后端开发工程师',
      channel: '宣讲会',
      location: '北京',
      salary: '25-40K',
      status: 'rejected',
      applyDate: '2025-12-05',
      remark: '二面未通过,经验不够匹配',
      color: 'purple',
      timeline: [
        { status: '投递简历', date: '2025-12-05', desc: '宣讲会后投递简历' },
        { status: '一面', date: '2025-12-08', desc: '技术面试' },
        { status: '二面未通过', date: '2025-12-12', desc: '经验不够匹配' }
      ],
      createTime: '2025-12-05T08:00:00.000Z',
      updateTime: '2025-12-05T08:00:00.000Z'
    },
    {
      id: 5,
      company: '京东',
      position: '前端开发工程师',
      channel: '招聘APP',
      location: '北京',
      salary: '20-35K',
      status: 'test',
      applyDate: '2025-12-20',
      remark: '笔试时间: 2025-12-28 14:00',
      color: 'red',
      timeline: [
        { status: '投递简历', date: '2025-12-20', desc: '通过招聘APP投递' }
      ],
      createTime: '2025-12-20T08:00:00.000Z',
      updateTime: '2025-12-20T08:00:00.000Z'
    }
  ])

  const currentFilter = ref('all')

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

  const addJob = (job) => {
    const newJob = {
      ...job,
      id: Date.now(),
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      timeline: job.timeline || [{ status: '投递简历', date: job.applyDate, desc: '投递简历' }]
    }
    jobs.value.unshift(newJob)
  }

  const updateJob = (id, updates) => {
    const index = jobs.value.findIndex(job => job.id === parseInt(id))
    if (index !== -1) {
      jobs.value[index] = {
        ...jobs.value[index],
        ...updates,
        updateTime: new Date().toISOString()
      }
    }
  }

  const deleteJob = (id) => {
    const index = jobs.value.findIndex(job => job.id === parseInt(id))
    if (index !== -1) {
      jobs.value.splice(index, 1)
    }
  }

  const setFilter = (filter) => {
    currentFilter.value = filter
  }

  return {
    jobs,
    currentFilter,
    filteredJobs,
    jobStats,
    getJobById,
    addJob,
    updateJob,
    deleteJob,
    setFilter
  }
})
