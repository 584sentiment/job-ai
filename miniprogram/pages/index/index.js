// pages/index/index.js
const app = getApp();
const DataManager = require('../../utils/data-manager.js');

Page({
  data: {
    searchKeyword: '',
    currentFilter: 'all',
    jobs: [],
    allJobs: [], // 用于分页的所有数据
    interviewCount: 0,
    userProfile: {},
    currentPage: 1,
    pageSize: 10,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadUserData();
    this.loadJobs();
  },

  onShow() {
    // 每次显示页面时重新加载数据
    this.loadJobs();
  },

  /**
   * 加载用户信息
   */
  loadUserData() {
    const userProfile = JSON.parse(wx.getStorageSync('user_profile') || '{}');
    this.setData({ userProfile });
  },

  /**
   * 加载岗位列表
   */
  loadJobs() {
    const jobs = DataManager.getJobs(this.data.currentFilter);
    const interviewCount = DataManager.getJobs('interview').length;

    // 为每个岗位添加显示属性
    const jobsWithDisplay = jobs.map(job => ({
      ...job,
      logoText: job.company.charAt(0),
      logoColor: this.getLogoColor(job.company),
      statusText: this.getStatusText(job.status)
    }));

    // 重置分页状态
    this.setData({
      allJobs: jobsWithDisplay,
      jobs: jobsWithDisplay.slice(0, this.data.pageSize),
      currentPage: 1,
      hasMore: jobsWithDisplay.length > this.data.pageSize,
      interviewCount
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    // 模拟网络请求
    setTimeout(() => {
      this.loadJobs();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
    }, 500);
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    if (this.data.loading || !this.data.hasMore) {
      return;
    }

    this.setData({ loading: true });

    // 模拟网络请求
    setTimeout(() => {
      const nextPage = this.data.currentPage + 1;
      const start = nextPage * this.data.pageSize;
      const end = start + this.data.pageSize;
      const newJobs = this.data.allJobs.slice(start, end);

      this.setData({
        jobs: [...this.data.jobs, ...newJobs],
        currentPage: nextPage,
        hasMore: end < this.data.allJobs.length,
        loading: false
      });
    }, 500);
  },

  /**
   * 获取公司 logo 颜色
   */
  getLogoColor(company) {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];
    const index = company.charCodeAt(0) % colors.length;
    return colors[index];
  },

  /**
   * 获取状态文本
   */
  getStatusText(status) {
    const statusMap = {
      'pending': '待投递',
      'applied': '已投递',
      'screening': '初筛中',
      'test': '笔试',
      'interview': '面试中',
      'interview1': '一面',
      'interview2': '二面',
      'interview3': '三面',
      'final': '终面',
      'offered': '已录用',
      'rejected': '已拒绝'
    };
    return statusMap[status] || '未知';
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });

    if (keyword) {
      const jobs = DataManager.searchJobs(keyword);
      const jobsWithDisplay = jobs.map(job => ({
        ...job,
        logoText: job.company.charAt(0),
        logoColor: this.getLogoColor(job.company),
        statusText: this.getStatusText(job.status)
      }));

      this.setData({
        allJobs: jobsWithDisplay,
        jobs: jobsWithDisplay.slice(0, this.data.pageSize),
        currentPage: 1,
        hasMore: jobsWithDisplay.length > this.data.pageSize
      });
    } else {
      this.loadJobs();
    }
  },

  /**
   * 切换筛选
   */
  onFilterChange(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ currentFilter: filter });
    this.loadJobs();
  },

  /**
   * 点击岗位卡片
   */
  onJobTap(e) {
    const jobId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/job-detail/job-detail?id=${jobId}`
    });
  },

  /**
   * 添加新岗位
   */
  onAddJob() {
    wx.navigateTo({
      url: '/pages/add-job/add-job'
    });
  }
});
