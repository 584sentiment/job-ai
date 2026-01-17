// pages/interview-detail/interview-detail.js
const DataManager = require('../../utils/data-manager.js');

Page({
  data: {
    interviewId: null,
    interview: {},
    job: null,
    statusText: '',
    prepProgress: 0
  },

  onLoad(options) {
    const interviewId = options.id;
    if (interviewId) {
      this.loadInterview(parseInt(interviewId));
    }
  },

  /**
   * 加载面试详情
   */
  loadInterview(interviewId) {
    const interview = DataManager.getInterviewById(interviewId);
    if (interview) {
      // 计算准备清单完成进度
      const completedCount = interview.aiPrepList ?
        interview.aiPrepList.filter(item => item.completed).length : 0;
      const totalCount = interview.aiPrepList ? interview.aiPrepList.length : 1;
      const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      // 获取关联的岗位信息
      const job = interview.jobId ? DataManager.getJobById(interview.jobId) : null;

      this.setData({
        interviewId: interviewId,
        interview: interview,
        job: job,
        statusText: this.getStatusText(interview.status),
        prepProgress: progress
      });
    }
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
   * 切换准备项状态
   */
  onTogglePrep(e) {
    const index = e.currentTarget.dataset.index;
    const prepList = [...this.data.interview.aiPrepList];
    prepList[index].completed = !prepList[index].completed;

    // 计算新的进度
    const completedCount = prepList.filter(item => item.completed).length;
    const totalCount = prepList.length;
    const progress = Math.round((completedCount / totalCount) * 100);

    // 更新面试数据
    const interview = { ...this.data.interview, aiPrepList: prepList };
    this.setData({
      interview: interview,
      prepProgress: progress
    });

    // 保存到存储
    DataManager.updateInterview(this.data.interviewId, {
      aiPrepList: prepList
    });

    wx.showToast({
      title: prepList[index].completed ? '已完成' : '未完成',
      icon: 'none',
      duration: 1000
    });
  },

  /**
   * 点击关联岗位
   */
  onJobTap() {
    if (this.data.job) {
      wx.navigateTo({
        url: '/pages/job-detail/job-detail?id=' + this.data.job.id
      });
    }
  },

  /**
   * 记录面试
   */
  onEditNotes() {
    wx.showModal({
      title: '面试记录',
      editable: true,
      placeholderText: '记录面试问题、你的表现、改进建议等...',
      content: this.data.interview.notes || '',
      success: (res) => {
        if (res.confirm) {
          const notes = res.content;
          DataManager.updateInterview(this.data.interviewId, {
            notes: notes
          });

          this.setData({
            'interview.notes': notes
          });

          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 更新状态
   */
  onUpdateStatus() {
    wx.showActionSheet({
      itemList: ['标记为已完成', '标记为已取消'],
      success: (res) => {
        let status = '';
        if (res.tapIndex === 0) {
          status = 'completed';
        } else if (res.tapIndex === 1) {
          status = 'cancelled';
        }

        if (status) {
          DataManager.updateInterview(this.data.interviewId, {
            status: status
          });

          this.setData({
            'interview.status': status,
            statusText: this.getStatusText(status)
          });

          wx.showToast({
            title: '状态已更新',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 删除面试
   */
  onDelete() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个面试记录吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          DataManager.deleteInterview(this.data.interviewId);

          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          });

          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  }
});
