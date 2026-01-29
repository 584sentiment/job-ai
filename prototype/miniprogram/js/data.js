// 模拟数据

// 岗位数据
const jobsData = [
  {
    id: 1,
    company: '字节跳动',
    position: '前端工程师',
    location: '北京',
    salary: '25-40K',
    channel: '招聘网站',
    status: 'interview',
    statusText: '面试中',
    applyDate: '2025-01-10',
    jd: '负责公司核心产品的前端开发，使用Vue3/React技术栈',
    aiParsed: {
      responsibilities: '负责核心产品前端开发',
      skills: ['Vue3', 'React', 'TypeScript', 'Node.js'],
      salaryRange: '25-40K'
    },
    aiMatchScore: {
      overall: 87,
      skills: 85,
      experience: 90,
      education: 100,
      salary: 75
    },
    interviews: [
      {
        id: 1,
        round: '一面',
        date: '2025-01-20',
        time: '14:00',
        location: '线上',
        status: 'upcoming'
      }
    ],
    timeline: [
      { date: '2025-01-10', status: '已投递', desc: '通过招聘网站投递' },
      { date: '2025-01-15', status: '初筛通过', desc: 'HR电话沟通' },
      { date: '2025-01-18', status: '面试中', desc: '安排一面' }
    ]
  },
  {
    id: 2,
    company: '阿里巴巴',
    position: '资深前端开发',
    location: '杭州',
    salary: '30-50K',
    channel: '内推',
    status: 'applied',
    statusText: '已投递',
    applyDate: '2025-01-12',
    jd: '负责淘宝直播业务线的前端架构设计和开发',
    aiParsed: {
      responsibilities: '淘宝直播业务前端架构',
      skills: ['React', 'Webpack', '性能优化', '架构设计'],
      salaryRange: '30-50K'
    },
    aiMatchScore: {
      overall: 82,
      skills: 88,
      experience: 85,
      education: 100,
      salary: 65
    },
    interviews: [],
    timeline: [
      { date: '2025-01-12', status: '已投递', desc: '通过内推投递' }
    ]
  },
  {
    id: 3,
    company: '腾讯',
    position: '前端开发工程师',
    location: '深圳',
    salary: '20-35K',
    channel: '招聘网站',
    status: 'interview',
    statusText: '面试中',
    applyDate: '2025-01-08',
    jd: '负责微信小程序相关的开发工作',
    aiParsed: {
      responsibilities: '微信小程序开发',
      skills: ['小程序', 'JavaScript', 'CSS', 'Vue'],
      salaryRange: '20-35K'
    },
    aiMatchScore: {
      overall: 90,
      skills: 92,
      experience: 88,
      education: 100,
      salary: 80
    },
    interviews: [
      {
        id: 2,
        round: '二面',
        date: '2025-01-22',
        time: '10:30',
        location: '深圳总部',
        status: 'upcoming'
      }
    ],
    timeline: [
      { date: '2025-01-08', status: '已投递', desc: '通过招聘网站投递' },
      { date: '2025-01-14', status: '初筛通过', desc: 'HR联系' },
      { date: '2025-01-16', status: '一面完成', desc: '技术面试' },
      { date: '2025-01-19', status: '面试中', desc: '安排二面' }
    ]
  },
  {
    id: 4,
    company: '美团',
    position: '前端开发',
    location: '北京',
    salary: '22-38K',
    channel: '宣讲会',
    status: 'pending',
    statusText: '待投递',
    applyDate: '2025-01-15',
    jd: '负责美团外卖业务的前端开发',
    aiParsed: null,
    aiMatchScore: null,
    interviews: [],
    timeline: []
  }
];

// 面试数据
const interviewsData = [
  {
    id: 1,
    jobId: 1,
    company: '字节跳动',
    position: '前端工程师',
    round: '一面',
    date: '2025-01-20',
    time: '14:00',
    location: '线上',
    status: 'upcoming',
    statusText: '即将到来',
    aiPrepList: [
      { id: 1, text: '复习 JavaScript 基础（闭包、原型链、异步）', completed: true },
      { id: 2, text: '准备项目介绍（STAR法则）', completed: false },
      { id: 3, text: '了解字节跳动企业文化', completed: false },
      { id: 4, text: '准备向面试官提问的问题', completed: false },
      { id: 5, text: '复习 Vue3 响应式原理', completed: false },
      { id: 6, text: '练习手写代码题', completed: false }
    ]
  },
  {
    id: 2,
    jobId: 3,
    company: '腾讯',
    position: '前端开发工程师',
    round: '二面',
    date: '2025-01-22',
    time: '10:30',
    location: '深圳总部',
    status: 'upcoming',
    statusText: '即将到来',
    aiPrepList: [
      { id: 1, text: '复习小程序开发最佳实践', completed: true },
      { id: 2, text: '准备项目难点讲解', completed: false },
      { id: 3, text: '了解微信团队技术栈', completed: false }
    ]
  },
  {
    id: 3,
    jobId: 1,
    company: '字节跳动',
    position: '前端工程师',
    round: '一面',
    date: '2025-01-10',
    time: '15:00',
    location: '线上',
    status: 'completed',
    statusText: '已完成',
    aiPrepList: []
  }
];

// 面经数据
const experiencesData = [
  {
    id: 1,
    company: '字节跳动',
    position: '前端工程师',
    round: '一面',
    date: '2025-01-10',
    content: `
## 技术问题
1. 介绍一下 Vue3 的响应式原理
2. 手写实现防抖和节流
3. 虚拟DOM diff算法的理解
4. Webpack打包优化方案

## 行为问题
1. 介绍一个你最有挑战的项目
2. 遇到的最大技术难点是什么
3. 如何与团队协作

## 面试官关注的点
- 技术深度和原理理解
- 项目经验的完整性
- 学习能力和成长性
    `,
    tags: ['Vue3', 'JavaScript', 'Webpack'],
    isAnonymous: false,
    isFavorite: true
  },
  {
    id: 2,
    company: '腾讯',
    position: '前端开发工程师',
    round: '二面',
    date: '2025-01-05',
    content: `
## 技术问题
1. 小程序的双线程模型
2. 性能优化实战经验
3. 组件设计思路

## 系统设计
- 设计一个图片上传组件
- 考虑点：断点续传、压缩、进度展示
    `,
    tags: ['小程序', '性能优化', '组件设计'],
    isAnonymous: true,
    isFavorite: false
  }
];

// AI对话数据
const aiConversations = [
  {
    role: 'assistant',
    content: '欢迎使用AI求职助手！我可以帮你准备面试、优化简历、分析岗位匹配度。有什么我可以帮助你的吗？',
    quickActions: [
      { text: '如何准备前端面试？', icon: '💡' },
      { text: '简历如何突出项目经验？', icon: '📝' },
      { text: '面试后如何跟进HR？', icon: '💬' }
    ]
  }
];

// 用户数据
const userData = {
  nickname: '求职者',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jobseeker',
  stats: {
    totalJobs: 4,
    interviewJobs: 2,
    experiences: 2,
    favorites: 1
  }
};

// 全局数据存储
const appData = {
  jobs: jobsData,
  interviews: interviewsData,
  experiences: experiencesData,
  conversations: aiConversations,
  user: userData
};

// 数据操作方法
const DataUtils = {
  // 获取所有岗位
  getJobs: (filter = 'all') => {
    if (filter === 'all') return appData.jobs;
    return appData.jobs.filter(job => job.status === filter);
  },

  // 获取单个岗位
  getJobById: (id) => {
    return appData.jobs.find(job => job.id === id);
  },

  // 添加岗位
  addJob: (job) => {
    const newJob = {
      id: Date.now(),
      ...job,
      interviews: [],
      timeline: [{ date: job.applyDate, status: '已录入', desc: '添加岗位' }]
    };
    appData.jobs.unshift(newJob);
    return newJob;
  },

  // 更新岗位
  updateJob: (id, data) => {
    const index = appData.jobs.findIndex(job => job.id === id);
    if (index !== -1) {
      appData.jobs[index] = { ...appData.jobs[index], ...data };
      return appData.jobs[index];
    }
    return null;
  },

  // 删除岗位
  deleteJob: (id) => {
    appData.jobs = appData.jobs.filter(job => job.id !== id);
  },

  // 获取所有面试
  getInterviews: (filter = 'all') => {
    if (filter === 'all') return appData.interviews;
    return appData.interviews.filter(int => int.status === filter);
  },

  // 添加面试
  addInterview: (interview) => {
    const newInterview = {
      id: Date.now(),
      ...interview,
      aiPrepList: []
    };
    appData.interviews.unshift(newInterview);

    // 更新对应岗位的timeline
    const job = appData.jobs.find(j => j.id === interview.jobId);
    if (job) {
      job.interviews.push(newInterview);
      job.timeline.push({
        date: interview.date,
        status: `${interview.round}`,
        desc: `安排${interview.round}`
      });
    }

    return newInterview;
  },

  // 获取所有面经
  getExperiences: () => {
    return appData.experiences;
  },

  // 获取用户信息
  getUser: () => {
    return appData.user;
  },

  // 添加面经
  addExperience: (exp) => {
    const newExp = {
      id: Date.now(),
      ...exp,
      isFavorite: false
    };
    appData.experiences.unshift(newExp);
    return newExp;
  },

  // 收藏/取消收藏面经
  toggleFavorite: (id) => {
    const exp = appData.experiences.find(e => e.id === id);
    if (exp) {
      exp.isFavorite = !exp.isFavorite;
      return exp.isFavorite;
    }
    return false;
  },

  // 添加对话消息
  addMessage: (message) => {
    appData.conversations.push(message);
  },

  // 获取对话历史
  getConversations: () => {
    return appData.conversations;
  },

  // 清空对话
  clearConversations: () => {
    appData.conversations = [{
      role: 'assistant',
      content: '欢迎使用AI求职助手！我可以帮你准备面试、优化简历、分析岗位匹配度。有什么我可以帮助你的吗？',
      quickActions: [
        { text: '如何准备前端面试？', icon: '💡' },
        { text: '简历如何突出项目经验？', icon: '📝' },
        { text: '面试后如何跟进HR？', icon: '💬' }
      ]
    }];
  }
};

// 导出到全局
window.appData = appData;
window.DataUtils = DataUtils;
