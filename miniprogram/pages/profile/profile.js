// pages/profile/profile.js
const DataManager = require('../../utils/data-manager.js');

Page({
  data: {
    userProfile: {},
    stats: {
      totalJobs: 0,
      interviewJobs: 0,
      experiences: 0,
      favorites: 0
    }
  },

  onLoad() {
    this.loadUserData();
    this.loadStats();
  },

  onShow() {
    this.loadStats();
  },

  loadUserData() {
    const userProfile = DataManager.getUserProfile() || {};
    this.setData({ userProfile });
  },

  loadStats() {
    const jobs = DataManager.getJobs();
    const experiences = DataManager.getExperiences();

    this.setData({
      stats: {
        totalJobs: jobs.length,
        interviewJobs: jobs.filter(j => j.status.includes('interview')).length,
        experiences: experiences.length,
        favorites: experiences.filter(e => e.isFavorite).length
      }
    });
  },

  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.switchTab({ url });
  },

  /**
   * 编辑个人资料
   */
  onEditProfile() {
    wx.navigateTo({
      url: '/pages/edit-profile/edit-profile'
    });
  },

  /**
   * 系统设置
   */
  onSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  }
});
