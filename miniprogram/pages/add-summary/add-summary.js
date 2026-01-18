// pages/add-summary/add-summary.js
const DataManager = require('../../utils/data-manager.js');

Page({
  data: {
    summaryId: null,
    mode: 'add', // add 或 edit
    jobId: null,
    jobText: '',
    jobIndex: -1,
    jobOptions: [],
    rounds: ['一面', '二面', '三面', '终面', 'HR面'],
    round: '',
    roundIndex: -1,
    date: '',
    maxDate: '',
    questions: '',
    weaknesses: '',
    improvements: '',
    highlights: '',
    notes: '',
    tags: ''
  },

  onLoad(options) {
    const mode = options.mode || 'add';
    const summaryId = options.id;
    const jobId = options.jobId;

    this.setData({ mode: mode });

    // 编辑模式：加载现有总结数据
    if (mode === 'edit' && summaryId) {
      const summary = DataManager.getSummaryById(parseInt(summaryId));
      if (summary) {
        // 加载所有岗位供选择
        const jobs = DataManager.getJobs();
        const jobOptions = jobs.map(job => ({
          value: job.id,
          label: `${job.company} - ${job.position}`
        }));

        // 找到当前关联的岗位索引
        const jobIndex = summary.jobId ?
          jobOptions.findIndex(j => j.value === summary.jobId) : -1;

        // 处理标签
        const tagsText = summary.tags || [];

        this.setData({
          summaryId: parseInt(summaryId),
          jobId: summary.jobId,
          jobText: jobIndex >= 0 ? jobOptions[jobIndex].label : '',
          jobOptions: jobOptions,
          jobIndex: jobIndex,
          round: summary.round,
          roundIndex: this.data.rounds.indexOf(summary.round),
          date: summary.date.split(' ')[0],
          questions: summary.questions || '',
          weaknesses: summary.weaknesses || '',
          improvements: summary.improvements || '',
          highlights: summary.highlights || '',
          notes: summary.notes || '',
          tags: Array.isArray(tagsText) ? tagsText.join(' ') : tagsText
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
            jobText: `${job.company} - ${job.position}`,
            jobIndex: 0,
            jobOptions: [{ value: job.id, label: `${job.company} - ${job.position}` }]
          });
        }
      }

      // 加载所有岗位供选择
      const jobs = DataManager.getJobs();
      const jobOptions = jobs.map(job => ({
        value: job.id,
        label: `${job.company} - ${job.position}`
      }));

      this.setData({
        jobOptions: jobOptions,
        jobIndex: this.data.jobId ? 0 : -1
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
      jobId: option.value,
      jobText: option.label
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
   * 日期改变
   */
  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  /**
   * 问题输入
   */
  onQuestionsInput(e) {
    this.setData({
      questions: e.detail.value
    });
  },

  /**
   * 不足输入
   */
  onWeaknessesInput(e) {
    this.setData({
      weaknesses: e.detail.value
    });
  },

  /**
   * 改进输入
   */
  onImprovementsInput(e) {
    this.setData({
      improvements: e.detail.value
    });
  },

  /**
   * 关注点输入
   */
  onHighlightsInput(e) {
    this.setData({
      highlights: e.detail.value
    });
  },

  /**
   * 备注输入
   */
  onNotesInput(e) {
    this.setData({
      notes: e.detail.value
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
    if (!formData.jobId || !formData.round || !formData.date) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      });
      return;
    }

    // 至少填写一个总结模块
    if (!this.data.questions && !this.data.weaknesses && !this.data.improvements &&
        !this.data.highlights && !this.data.notes) {
      wx.showToast({
        title: '请至少填写一个总结模块',
        icon: 'none'
      });
      return;
    }

    // 处理标签
    const tagsArray = this.data.tags ? this.data.tags.split(' ').filter(tag => tag.trim()) : [];

    // 构建总结数据
    const summary = {
      jobId: this.data.jobId,
      round: this.data.round,
      date: this.data.date,
      questions: this.data.questions,
      weaknesses: this.data.weaknesses,
      improvements: this.data.improvements,
      highlights: this.data.highlights,
      notes: this.data.notes,
      tags: tagsArray
    };

    // 编辑模式：更新现有总结
    if (this.data.mode === 'edit') {
      const success = DataManager.updateSummary(this.data.summaryId, summary);
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
      // 添加模式：添加新总结
      const newSummary = DataManager.addSummary(summary);

      if (newSummary) {
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
