// pages/job-detail/job-detail.js
const DataManager = require('../../utils/data-manager.js');
const AIHelper = require('../../utils/ai-helper.js');

Page({
  data: {
    job: {}
  },

  onLoad(options) {
    const jobId = options.id;
    if (jobId) {
      const job = DataManager.getJobById(parseInt(jobId));
      if (job) {
        // 如果没有AI匹配度分析，则生成一个
        if (!job.aiMatchScore) {
          const aiMatchScore = AIHelper.analyzeJob(job);
          job.aiMatchScore = aiMatchScore;
        }

        // 如果没有时间线，初始化一个
        if (!job.timeline || job.timeline.length === 0) {
          job.timeline = [
            {
              status: this.getStatusText(job.status),
              date: job.applyDate,
              desc: '投递成功'
            }
          ];
        }

        this.setData({
          job: {
            ...job,
            statusText: this.getStatusText(job.status)
          }
        });
      }
    }
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
   * 编辑岗位
   */
  onEdit() {
    wx.navigateTo({
      url: '/pages/edit-job/edit-job?id=' + this.data.job.id
    });
  },

  /**
   * 删除岗位
   */
  onDelete() {
    const that = this;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个岗位吗？删除后不可恢复。',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success(res) {
        if (res.confirm) {
          // 删除岗位
          const success = DataManager.deleteJob(that.data.job.id);

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
   * 添加面试
   */
  onAddInterview() {
    wx.navigateTo({
      url: '/pages/add-interview/add-interview?jobId=' + this.data.job.id
    });
  }
});
