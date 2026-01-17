// pages/job-detail/job-detail.js
const DataManager = require('../../utils/data-manager.js');

Page({
  data: {
    job: {}
  },

  onLoad(options) {
    const jobId = options.id;
    if (jobId) {
      const job = DataManager.getJobById(parseInt(jobId));
      if (job) {
        this.setData({
          job: {
            ...job,
            statusText: this.getStatusText(job.status)
          }
        });
      }
    }
  },

  getStatusText(status) {
    const statusMap = {
      'pending': '待投递',
      'applied': '已投递',
      'offered': '已录用',
      'rejected': '已拒绝'
    };
    return statusMap[status] || '未知';
  }
});
