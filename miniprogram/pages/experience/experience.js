// pages/experience/experience.js
const DataManager = require('../../utils/data-manager.js');
const Format = require('../../utils/format.js');

Page({
  data: {
    currentTab: 'all',
    experiences: [],
    favoriteExperiences: [],
    allExperiences: [],
    searchKeyword: '',
    totalCount: 0,
    favoriteCount: 0
  },

  onLoad() {
    this.loadExperiences();
  },

  onShow() {
    this.loadExperiences();
  },

  /**
   * 加载面经数据
   */
  loadExperiences() {
    const allExperiences = DataManager.getExperiences();
    const favoriteExperiences = DataManager.getFavoriteExperiences();

    // 为每个面经添加显示属性
    const allWithDisplay = allExperiences.map(exp => ({
      ...exp,
      statusText: this.getRoundText(exp.round),
      dateText: Format.relativeTime(exp.date),
      tagsArray: exp.tags || [],
      tagsText: (exp.tags || []).join('、')
    }));

    const favoriteWithDisplay = favoriteExperiences.map(exp => ({
      ...exp,
      statusText: this.getRoundText(exp.round),
      dateText: Format.relativeTime(exp.date),
      tagsArray: exp.tags || [],
      tagsText: (exp.tags || []).join('、')
    }));

    this.setData({
      allExperiences: allWithDisplay,
      favoriteExperiences: favoriteWithDisplay,
      totalCount: allExperiences.length,
      favoriteCount: favoriteExperiences.length
    });

    // 根据当前Tab显示数据
    this.updateListByTab();
  },

  /**
   * 更新列表显示
   */
  updateListByTab() {
    if (this.data.currentTab === 'all') {
      this.setData({
        experiences: this.data.allExperiences
      });
    } else {
      this.setData({
        experiences: this.data.favoriteExperiences
      });
    }
  },

  /**
   * 获取轮次文本
   */
  getRoundText(round) {
    const roundMap = {
      '笔试': '笔试',
      '一面': '一面',
      '二面': '二面',
      '三面': '三面',
      '终面': '终面',
      'HR面': 'HR面'
    };
    return roundMap[round] || round;
  },

  /**
   * 切换Tab
   */
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.updateListByTab();
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });

    if (keyword) {
      const experiences = DataManager.searchExperiences(keyword);
      this.setData({
        experiences: experiences.map(exp => ({
          ...exp,
          statusText: this.getRoundText(exp.round),
          dateText: Format.relativeTime(exp.date),
          tagsArray: exp.tags || [],
          tagsText: (exp.tags || []).join('、')
        }))
      });
    } else {
      this.updateListByTab();
    }
  },

  /**
   * 点击面经卡片
   */
  onExperienceTap(e) {
    const expId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/experience-detail/experience-detail?id=' + expId
    });
  },

  /**
   * 添加面经
   */
  onAddExperience() {
    wx.navigateTo({
      url: '/pages/add-experience/add-experience'
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    setTimeout(() => {
      this.loadExperiences();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
    }, 500);
  }
});
