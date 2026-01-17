// pages/add-interview/add-interview.js
const DataManager = require('../../utils/data-manager.js');
const AIHelper = require('../../utils/ai-helper.js');

Page({
  data: {
    jobId: null,
    job: null,
    rounds: ['一面', '二面', '三面', '终面', 'HR面'],
    forms: ['现场面试', '视频面试', '电话面试', '其他'],
    round: '',
    roundIndex: 0,
    form: '',
    formIndex: 0,
    date: '',
    time: '',
    location: '',
    contact: '',
    remark: '',
    minDate: ''
  },

  onLoad(options) {
    const jobId = options.jobId;
    if (jobId) {
      const job = DataManager.getJobById(parseInt(jobId));
      if (job) {
        this.setData({
          jobId: parseInt(jobId),
          job: job,
          location: job.location || ''
        });
      }
    }

    // 设置最小日期为今天
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.setData({
      minDate: `${year}-${month}-${day}`
    });
  },

  /**
   * 轮次改变
   */
  onRoundChange(e) {
    const index = e.detail.value;
    this.setData({
      roundIndex: index,
      round: this.data.rounds[index]
    });
  },

  /**
   * 形式改变
   */
  onFormChange(e) {
    const index = e.detail.value;
    this.setData({
      formIndex: index,
      form: this.data.forms[index]
    });
  },

  /**
   * 日期改变
   */
  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  /**
   * 时间改变
   */
  onTimeChange(e) {
    this.setData({
      time: e.detail.value
    });
  },

  /**
   * 提交表单
   */
  onSubmit(e) {
    const formData = e.detail.value;

    // 表单验证
    if (!formData.round || !formData.date || !formData.time || !formData.form) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      });
      return;
    }

    // 构建面试数据
    const interview = {
      jobId: this.data.jobId,
      company: this.data.job.company,
      position: this.data.job.position,
      round: formData.round,
      date: formData.date,
      time: formData.time,
      form: formData.form,
      location: formData.location,
      contact: formData.contact,
      remark: formData.remark
    };

    // 生成AI准备清单
    const aiPrepList = AIHelper.generatePrepList(interview);
    interview.aiPrepList = aiPrepList;

    // 添加面试
    const newInterview = DataManager.addInterview(interview);

    if (newInterview) {
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1500
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } else {
      wx.showToast({
        title: '添加失败',
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
