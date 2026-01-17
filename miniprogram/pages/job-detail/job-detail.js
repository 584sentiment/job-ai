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
    wx.showToast({
      title: '编辑功能开发中',
      icon: 'none'
    });
  },

  /**
   * 添加面试
   */
  onAddInterview() {
    wx.showToast({
      title: '添加面试功能开发中',
      icon: 'none'
    });
  }
});
