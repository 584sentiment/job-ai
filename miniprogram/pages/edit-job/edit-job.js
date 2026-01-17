// pages/edit-job/edit-job.js
const DataManager = require('../../utils/data-manager.js');
const AIHelper = require('../../utils/ai-helper.js');

Page({
  data: {
    jobId: null,
    job: {},
    statusOptions: [
      { value: 'pending', label: '待投递' },
      { value: 'applied', label: '已投递' },
      { value: 'screening', label: '初筛中' },
      { value: 'test', label: '笔试' },
      { value: 'interview', label: '面试中' },
      { value: 'offered', label: '已录用' },
      { value: 'rejected', label: '已拒绝' }
    ],
    channels: ['招聘网站', '内推', '猎头', '校园招聘', '其他'],
    statusIndex: 0,
    channelIndex: 0,
    statusText: ''
  },

  onLoad(options) {
    const jobId = options.id;
    if (jobId) {
      const job = DataManager.getJobById(parseInt(jobId));
      if (job) {
        // 查找状态和渠道的索引
        const statusIndex = this.data.statusOptions.findIndex(item => item.value === job.status);
        const channelIndex = this.data.channels.findIndex(item => item === job.channel);

        this.setData({
          jobId: parseInt(jobId),
          job: job,
          statusIndex: statusIndex >= 0 ? statusIndex : 0,
          channelIndex: channelIndex >= 0 ? channelIndex : 0,
          statusText: this.data.statusOptions[statusIndex >= 0 ? statusIndex : 0].label
        });
      }
    }
  },

  /**
   * 状态改变
   */
  onStatusChange(e) {
    const index = e.detail.value;
    this.setData({
      statusIndex: index,
      statusText: this.data.statusOptions[index].label
    });
  },

  /**
   * 渠道改变
   */
  onChannelChange(e) {
    const index = e.detail.value;
    this.setData({
      channelIndex: index,
      'job.channel': this.data.channels[index]
    });
  },

  /**
   * 日期改变
   */
  onDateChange(e) {
    this.setData({
      'job.applyDate': e.detail.value
    });
  },

  /**
   * JD输入
   */
  onJDInput(e) {
    this.setData({
      'job.jd': e.detail.value
    });
  },

  /**
   * AI解析JD
   */
  async onParseJD() {
    const jd = this.data.job.jd;
    if (!jd || jd.trim() === '') {
      wx.showToast({
        title: '请先输入JD文本',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: 'AI解析中...' });

    try {
      const result = await AIHelper.parseJD(jd);

      // 更新表单字段
      this.setData({
        'job.location': result.location || this.data.job.location,
        'job.salary': result.salaryRange || this.data.job.salary
      });

      wx.showToast({
        title: '解析成功',
        icon: 'success'
      });
    } catch (error) {
      wx.showToast({
        title: '解析失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 提交表单
   */
  onSubmit(e) {
    const formData = e.detail.value;

    // 表单验证
    if (!formData.company || !formData.position || !formData.applyDate) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      });
      return;
    }

    // 获取选中的状态
    const selectedStatus = this.data.statusOptions[this.data.statusIndex];

    // 构建更新数据
    const updates = {
      company: formData.company,
      position: formData.position,
      status: selectedStatus.value,
      channel: this.data.job.channel,
      location: formData.location,
      salary: formData.salary,
      applyDate: formData.applyDate,
      jd: formData.jd,
      contact: formData.contact,
      remark: formData.remark
    };

    // 检查状态是否变更
    const oldStatus = this.data.job.status;
    const newStatus = selectedStatus.value;

    if (oldStatus !== newStatus) {
      // 状态发生变更，添加timeline记录
      const newTimelineItem = {
        status: selectedStatus.label,
        date: new Date().toISOString().split('T')[0],
        desc: '状态更新'
      };

      updates.timeline = [
        ...(this.data.job.timeline || []),
        newTimelineItem
      ];
    }

    // 检查JD是否变更
    const oldJD = this.data.job.jd || '';
    const newJD = formData.jd || '';

    if (oldJD !== newJD && newJD.trim() !== '') {
      // JD发生变更，重新生成AI匹配度分析
      const updatedJob = { ...this.data.job, ...updates };
      const aiMatchScore = AIHelper.analyzeJob(updatedJob);
      updates.aiMatchScore = aiMatchScore;
    }

    // 更新岗位
    const success = DataManager.updateJob(this.data.jobId, updates);

    if (success) {
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1500
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } else {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  /**
   * 取消
   */
  onCancel() {
    wx.navigateBack();
  }
});
