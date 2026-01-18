// pages/experience-detail/experience-detail.js
const DataManager = require('../../utils/data-manager.js');
const Format = require('../../utils/format.js');

Page({
  data: {
    experienceId: null,
    experience: {},
    experienceText: ''
  },

  onLoad(options) {
    const experienceId = options.id;
    if (experienceId) {
      this.loadExperience(parseInt(experienceId));
    }
  },

  /**
   * 加载面经详情
   */
  loadExperience(experienceId) {
    const experience = DataManager.getExperienceById(experienceId);
    if (experience) {
      this.setData({
        experienceId: experienceId,
        experience: {
          ...experience,
          tagsArray: experience.tags || [],
          tagsText: (experience.tags || []).join('、'),
          statusText: this.getRoundText(experience.round),
          dateText: Format.relativeTime(experience.date)
        },
        experienceText: `在 ${experience.company} 的 ${experience.position} 面试中的经验分享`
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
   * 切换收藏状态
   */
  onToggleFavorite() {
    const experience = DataManager.toggleFavorite(this.data.experienceId);
    if (experience) {
      this.setData({
        'experience.isFavorite': experience.isFavorite
      });

      wx.showToast({
        title: experience.isFavorite ? '已收藏' : '已取消收藏',
        icon: 'success',
        duration: 1000
      });
    } else {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  },

  /**
   * 编辑面经
   */
  onEdit() {
    wx.navigateTo({
      url: '/pages/add-experience/add-experience?id=' + this.data.experienceId + '&mode=edit'
    });
  },

  /**
   * 删除面经
   */
  onDelete() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这篇面经吗？删除后不可恢复。',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const success = DataManager.deleteExperience(this.data.experienceId);

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
  },

  /**
   * 跳转到关联岗位
   */
  onJobTap() {
    if (this.data.experience.jobId) {
      wx.navigateTo({
        url: '/pages/job-detail/job-detail?id=' + this.data.experience.jobId
      });
    }
  }
});
