// pages/settings/settings.js
const DataManager = require('../../utils/data-manager.js');

Page({
  data: {
    notificationEnabled: true
  },

  onLoad() {
    this.loadSettings();
  },

  /**
   * 加载设置
   */
  loadSettings() {
    const userProfile = DataManager.getUserProfile() || {};
    this.setData({
      notificationEnabled: userProfile.notificationEnabled !== false // 默认开启
    });
  },

  /**
   * 消息提醒开关
   */
  onNotificationChange(e) {
    const enabled = e.detail.value;
    this.setData({
      notificationEnabled: enabled
    });

    // 保存设置
    DataManager.updateUserProfile({
      notificationEnabled: enabled
    });

    wx.showToast({
      title: enabled ? '已开启消息提醒' : '已关闭消息提醒',
      icon: 'success',
      duration: 1500
    });
  },

  /**
   * 导出数据
   */
  onExportData() {
    wx.showLoading({
      title: '导出中...',
      mask: true
    });

    try {
      // 收集所有数据
      const exportData = {
        version: '1.0.0',
        exportTime: new Date().toISOString(),
        userProfile: DataManager.getUserProfile(),
        jobs: DataManager.getJobs(),
        interviews: DataManager.getInterviews(),
        experiences: DataManager.getExperiences(),
        summaries: DataManager.getSummaries()
      };

      // 转换为 JSON 字符串
      const jsonString = JSON.stringify(exportData, null, 2);

      // 由于小程序限制，这里使用复制到剪贴板的方式
      wx.setClipboardData({
        data: jsonString,
        success: () => {
          wx.hideLoading();
          wx.showModal({
            title: '导出成功',
            content: '数据已复制到剪贴板，请粘贴到文本文件中保存',
            showCancel: false
          });
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({
            title: '导出失败',
            icon: 'none'
          });
        }
      });
    } catch (error) {
      wx.hideLoading();
      console.error('导出数据失败:', error);
      wx.showToast({
        title: '导出失败',
        icon: 'none'
      });
    }
  },

  /**
   * 清空数据
   */
  onClearData() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有本地数据吗？此操作不可恢复！',
      confirmText: '确认清空',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          // 二次确认
          wx.showModal({
            title: '最后确认',
            content: '清空后将删除所有岗位、面试、面经和总结数据，确定要继续吗？',
            confirmText: '确定删除',
            confirmColor: '#EF4444',
            success: (res) => {
              if (res.confirm) {
                this.clearAllData();
              }
            }
          });
        }
      }
    });
  },

  /**
   * 清空所有数据
   */
  clearAllData() {
    try {
      wx.clearStorageSync();

      wx.showToast({
        title: '清空成功',
        icon: 'success',
        duration: 1500
      });

      // 延迟后返回个人中心
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/profile/profile'
        });
      }, 1500);
    } catch (error) {
      console.error('清空数据失败:', error);
      wx.showToast({
        title: '清空失败',
        icon: 'none'
      });
    }
  },

  /**
   * 意见反馈
   */
  onFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的反馈！\n\n您可以通过以下方式联系我们：\n邮箱：feedback@example.com\n微信：job-ai-support',
      confirmText: '知道了',
      showCancel: false
    });
  },

  /**
   * 关于我们
   */
  onAbout() {
    wx.showModal({
      title: '关于我们',
      content: '求职追踪助手是一款专为求职人员打造的微信小程序，聚焦"岗位记录-进度追踪-面经收集-面试总结"全流程求职管理。\n\n特色功能：\n• AI智能解析JD\n• 岗位匹配度分析\n• AI面试准备清单\n• AI助手对话',
      confirmText: '知道了',
      showCancel: false
    });
  }
});
