// pages/interviews/interviews.js
const DataManager = require('../../utils/data-manager.js');
const AIHelper = require('../../utils/ai-helper.js');
const Format = require('../../utils/format.js');

Page({
  data: {
    currentTab: 'upcoming',
    interviews: [],
    upcomingCount: 0,
    completedCount: 0,
    nextInterview: null
  },

  onLoad() {
    this.loadInterviews();
  },

  onShow() {
    this.loadInterviews();
  },

  /**
   * 加载面试列表
   */
  loadInterviews() {
    const allInterviews = DataManager.getInterviews();

    // 分类
    const upcoming = allInterviews.filter(i => i.status === 'upcoming');
    const completed = allInterviews.filter(i => i.status === 'completed');

    // 为每个面试添加显示属性
    const interviewsWithDisplay = (this.data.currentTab === 'upcoming' ? upcoming : completed).map(interview => ({
      ...interview,
      statusText: this.getStatusText(interview.status)
    }));

    // 获取最近的面试
    let nextInterview = null;
    if (this.data.currentTab === 'upcoming' && upcoming.length > 0) {
      nextInterview = upcoming[0];

      // 如果没有AI准备清单，生成一个
      if (!nextInterview.aiPrepList) {
        nextInterview.aiPrepList = AIHelper.generatePrepList(nextInterview);
      }

      // 添加相对时间
      nextInterview.relativeTime = Format.relativeTime(nextInterview.date + ' ' + nextInterview.time);
    }

    this.setData({
      interviews: interviewsWithDisplay,
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      nextInterview
    });
  },

  /**
   * 获取状态文本
   */
  getStatusText(status) {
    const statusMap = {
      'upcoming': '即将到来',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statusMap[status] || '未知';
  },

  /**
   * 切换Tab
   */
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadInterviews();
  },

  /**
   * 切换准备清单项
   */
  togglePrepItem(e) {
    const itemId = e.currentTarget.dataset.id;
    const prepList = this.data.nextInterview.aiPrepList;
    const item = prepList.find(i => i.id === itemId);

    if (item) {
      item.completed = !item.completed;
      this.setData({
        'nextInterview.aiPrepList': prepList
      });

      // TODO: 保存到存储
    }
  },

  /**
   * 开始模拟面试
   */
  startMockInterview() {
    wx.navigateTo({
      url: '/pages/ai-assistant/ai-assistant?mode=mock'
    });
  },

  /**
   * 切换准备清单项
   */
  togglePrepItem(e) {
    const itemId = e.currentTarget.dataset.id;
    const prepList = this.data.nextInterview.aiPrepList;
    const item = prepList.find(i => i.id === itemId);

    if (item) {
      item.completed = !item.completed;
      this.setData({
        'nextInterview.aiPrepList': prepList
      });

      // 保存到存储
      DataManager.updateInterview(this.data.nextInterview.id, {
        aiPrepList: prepList
      });

      wx.showToast({
        title: item.completed ? '已完成' : '未完成',
        icon: 'none',
        duration: 1000
      });
    }
  },

  /**
   * 开始模拟面试
   */
  startMockInterview() {
    wx.navigateTo({
      url: '/pages/ai-assistant/ai-assistant?mode=mock'
    });
  },

  /**
   * 点击面试卡片
   */
  onInterviewTap(e) {
    const interviewId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/interview-detail/interview-detail?id=' + interviewId
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    setTimeout(() => {
      this.loadInterviews();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
    }, 500);
  }
});
