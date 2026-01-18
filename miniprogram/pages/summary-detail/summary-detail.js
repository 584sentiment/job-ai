// pages/summary-detail/summary-detail.js
const DataManager = require('../../utils/data-manager.js');

Page({
  data: {
    summaryId: null,
    summary: {}
  },

  onLoad(options) {
    const summaryId = parseInt(options.id);
    this.loadSummary(summaryId);
  },

  /**
   * 加载总结详情
   */
  loadSummary(summaryId) {
    const summary = DataManager.getSummaryById(summaryId);
    if (summary) {
      const job = DataManager.getJobById(summary.jobId);

      this.setData({
        summaryId: summaryId,
        summary: {
          ...summary,
          jobText: job ? `${job.company} - ${job.position}` : '未知岗位',
          position: job ? job.position : '',
          statusType: this.getRoundType(summary.round),
          tagsArray: summary.tags || [],
          tagsText: (summary.tags || []).join('、')
        }
      });
    } else {
      wx.showToast({
        title: '总结不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
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
   * 编辑总结
   */
  onEdit() {
    wx.navigateTo({
      url: '/pages/add-summary/add-summary?id=' + this.data.summaryId + '&mode=edit'
    });
  },

  /**
   * 删除总结
   */
  onDelete() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条总结吗？删除后不可恢复。',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const success = DataManager.deleteSummary(this.data.summaryId);
          if (success) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1500
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          } else {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
});
