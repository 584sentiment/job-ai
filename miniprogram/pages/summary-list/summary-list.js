// pages/summary-list/summary-list.js
const DataManager = require('../../utils/data-manager.js');
const Format = require('../../utils/format.js');

Page({
  data: {
    summaries: [],
    allSummaries: [],
    searchKeyword: '',
    totalCount: 0
  },

  onLoad(options) {
    // 从岗位详情页进入，筛选该岗位的总结
    if (options.jobId) {
      this.loadSummariesByJob(parseInt(options.jobId));
    } else {
      this.loadAllSummaries();
    }
  },

  onShow() {
    // 从添加/编辑页返回时重新加载数据
    if (this.data.allSummaries.length > 0 || this.data.summaries.length === 0) {
      this.loadAllSummaries();
    }
  },

  /**
   * 加载所有总结
   */
  loadAllSummaries() {
    const summaries = DataManager.getSummaries();
    const jobs = DataManager.getJobs();

    // 为每个总结添加显示属性
    const summariesWithDisplay = summaries.map(summary => {
      const job = jobs.find(j => j.id === summary.jobId);
      return {
        ...summary,
        jobText: job ? `${job.company} - ${job.position}` : '未知岗位',
        position: job ? job.position : '',
        statusType: this.getRoundType(summary.round),
        dateText: Format.relativeTime(summary.date),
        tagsArray: summary.tags || [],
        tagsText: (summary.tags || []).join('、'),
        questionsPreview: this.getPreviewText(summary.questions, 30),
        weaknessesPreview: this.getPreviewText(summary.weaknesses, 30),
        improvementsPreview: this.getPreviewText(summary.improvements, 30)
      };
    });

    this.setData({
      allSummaries: summariesWithDisplay,
      summaries: summariesWithDisplay,
      totalCount: summaries.length
    });
  },

  /**
   * 根据岗位加载总结
   */
  loadSummariesByJob(jobId) {
    const summaries = DataManager.getSummariesByJobId(jobId);
    const job = DataManager.getJobById(jobId);

    const summariesWithDisplay = summaries.map(summary => ({
      ...summary,
      jobText: job ? `${job.company} - ${job.position}` : '未知岗位',
      position: job ? job.position : '',
      statusType: this.getRoundType(summary.round),
      dateText: Format.relativeTime(summary.date),
      tagsArray: summary.tags || [],
      tagsText: (summary.tags || []).join('、'),
      questionsPreview: this.getPreviewText(summary.questions, 30),
      weaknessesPreview: this.getPreviewText(summary.weaknesses, 30),
      improvementsPreview: this.getPreviewText(summary.improvements, 30)
    }));

    this.setData({
      allSummaries: summariesWithDisplay,
      summaries: summariesWithDisplay,
      totalCount: summaries.length
    });
  },

  /**
   * 获取预览文本
   */
  getPreviewText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  },

  /**
   * 获取轮次类型（用于样式）
   */
  getRoundType(round) {
    const roundMap = {
      '一面': 'first',
      '二面': 'second',
      '三面': 'third',
      '终面': 'final',
      'HR面': 'hr'
    };
    return roundMap[round] || 'default';
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });

    if (keyword) {
      const summaries = DataManager.searchSummaries(keyword);
      const jobs = DataManager.getJobs();

      this.setData({
        summaries: summaries.map(summary => {
          const job = jobs.find(j => j.id === summary.jobId);
          return {
            ...summary,
            jobText: job ? `${job.company} - ${job.position}` : '未知岗位',
            position: job ? job.position : '',
            statusType: this.getRoundType(summary.round),
            dateText: Format.relativeTime(summary.date),
            tagsArray: summary.tags || [],
            tagsText: (summary.tags || []).join('、'),
            questionsPreview: this.getPreviewText(summary.questions, 30),
            weaknessesPreview: this.getPreviewText(summary.weaknesses, 30),
            improvementsPreview: this.getPreviewText(summary.improvements, 30)
          };
        })
      });
    } else {
      this.setData({
        summaries: this.data.allSummaries
      });
    }
  },

  /**
   * 清除搜索
   */
  onClearSearch() {
    this.setData({
      searchKeyword: '',
      summaries: this.data.allSummaries
    });
  },

  /**
   * 点击总结卡片
   */
  onSummaryTap(e) {
    const summaryId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/summary-detail/summary-detail?id=' + summaryId
    });
  },

  /**
   * 添加总结
   */
  onAddSummary() {
    wx.navigateTo({
      url: '/pages/add-summary/add-summary'
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadAllSummaries();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  }
});
