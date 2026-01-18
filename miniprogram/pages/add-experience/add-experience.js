// pages/add-experience/add-experience.js
const DataManager = require('../../utils/data-manager.js');

Page({
  data: {
    experienceId: null,
    mode: 'add', // add 或 edit
    jobId: null,
    jobText: '',
    jobIndex: -1,
    jobOptions: [],
    company: '',
    position: '',
    rounds: ['笔试', '一面', '二面', '三面', '终面', 'HR面'],
    round: '',
    roundIndex: 0,
    date: '',
    maxDate: '',
    content: '',
    tags: '',
    isAnonymous: false
  },

  onLoad(options) {
    const mode = options.mode || 'add'; // add 或 edit
    const experienceId = options.id;
    const jobId = options.jobId;

    // 设置模式
    this.setData({ mode: mode });

    // 编辑模式：加载现有面经数据
    if (mode === 'edit' && experienceId) {
      const experience = DataManager.getExperienceById(parseInt(experienceId));
      if (experience) {
        // 加载所有岗位供选择
        const jobs = DataManager.getJobs();
        const jobOptions = [
          { value: 0, label: '不关联岗位' },
          ...jobs.map(job => ({
            value: job.id,
            label: `${job.company} - ${job.position}`
          }))
        ];

        // 找到当前关联的岗位索引
        const jobIndex = experience.jobId ?
          jobOptions.findIndex(j => j.value === experience.jobId) : 0;

        // 处理标签
        const tagsText = experience.tags || [];

        this.setData({
          experienceId: parseInt(experienceId),
          jobId: experience.jobId,
          company: experience.company,
          position: experience.position,
          round: experience.round,
          date: experience.date.split(' ')[0], // 只取日期部分
          jobText: jobIndex > 0 ? jobOptions[jobIndex].label : '不关联岗位',
          jobOptions: jobOptions,
          jobIndex: jobIndex,
          roundIndex: this.data.rounds.indexOf(experience.round),
          content: experience.content,
          tags: tagsText,
          isAnonymous: experience.isAnonymous === 1
        });
      }
    }

    // 添加模式或从岗位详情页进入
    if (mode === 'add') {
      if (jobId) {
        const job = DataManager.getJobById(parseInt(jobId));
        if (job) {
          this.setData({
            jobId: parseInt(jobId),
            company: job.company,
            position: job.position,
            jobText: `${job.company} - ${job.position}`,
            jobIndex: 0,
            jobOptions: [{ value: job.id, label: `${job.company} - ${job.position}` }]
          });
        }
      }

      // 加载所有岗位供选择
      const jobs = DataManager.getJobs();
      const jobOptions = [
        { value: 0, label: '不关联岗位' },
        ...jobs.map(job => ({
          value: job.id,
          label: `${job.company} - ${job.position}`
        }))
      ];

      this.setData({
        jobOptions: jobOptions,
        jobIndex: 0
      });
    }

    // 设置默认日期为今天
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.setData({
      date: `${year}-${month}-${day}`,
      maxDate: `${year + 1}-${month}-${day}`
    });
  },

  /**
   * 关联岗位改变
   */
  onJobChange(e) {
    const index = e.detail.value;
    const option = this.data.jobOptions[index];
    this.setData({
      jobIndex: index,
      jobId: option.value === 0 ? null : option.value,
      jobText: option.label
    });

    // 如果选择了岗位，自动填充公司和岗位
    if (option.value !== 0) {
      const job = DataManager.getJobById(option.value);
      if (job) {
        this.setData({
          company: job.company,
          position: job.position
        });
      }
    }
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
   * 日期改变
   */
  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  /**
   * 内容输入
   */
  onContentInput(e) {
    this.setData({
      content: e.detail.value
    });
  },

  /**
   * 标签输入
   */
  onTagsInput(e) {
    this.setData({
      tags: e.detail.value
    });
  },

  /**
   * 提交表单
   */
  onSubmit(e) {
    const formData = e.detail.value;

    // 表单验证
    if (!formData.company || !formData.position || !formData.round || !formData.date || !formData.content) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      });
      return;
    }

    // 处理标签
    const tagsArray = formData.tags ? formData.tags.split(' ').filter(tag => tag.trim()) : [];

    // 构建面经数据
    const experience = {
      jobId: this.data.jobId,
      company: formData.company,
      position: formData.position,
      round: formData.round,
      date: formData.date,
      content: formData.content,
      tags: tagsArray,
      isAnonymous: formData.isAnonymous ? 1 : 0
    };

    // 编辑模式：更新现有面经
    if (this.data.mode === 'edit') {
      const success = DataManager.updateExperience(this.data.experienceId, experience);
      if (success) {
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 1500
        });

        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        });
      }
    } else {
      // 添加模式：添加新面经
      const newExperience = DataManager.addExperience(experience);

      if (newExperience) {
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
    }
  },

  /**
   * 取消
   */
  onCancel() {
    wx.navigateBack();
  }
});
