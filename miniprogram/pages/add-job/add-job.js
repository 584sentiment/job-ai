// pages/add-job/add-job.js
const DataManager = require('../../utils/data-manager.js');
const AIHelper = require('../../utils/ai-helper.js');

Page({
  data: {
    company: '',
    position: '',
    channel: '',
    applyDate: '',
    jd: '',
    location: '',
    salary: '',
    contact: '',
    remark: '',
    channels: ['招聘网站', '企业官网', '内推', '宣讲会', '其他'],
    isCopyMode: false, // 是否为复制模式
    inputMode: 'full' // 录入模式：quick-快速，full-完整
  },

  onLoad(options) {
    // 设置默认日期为今天
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const data = {
      applyDate: `${year}-${month}-${day}`
    };

    // 检查是否为复制模式
    if (options.copy) {
      try {
        const jobData = JSON.parse(decodeURIComponent(options.copy));
        data.isCopyMode = true;
        data.company = jobData.company || '';
        data.position = jobData.position || '';
        data.channel = jobData.channel || '';
        data.location = jobData.location || '';
        data.salary = jobData.salary || '';
        data.jd = jobData.jd || '';
        data.contact = jobData.contact || '';
        data.remark = jobData.remark || '';

        // 提示用户已复制岗位
        wx.showToast({
          title: '已复制岗位信息',
          icon: 'success',
          duration: 2000
        });
      } catch (error) {
        console.error('解析岗位数据失败:', error);
      }
    }

    this.setData(data);
  },

  /**
   * 切换录入模式
   */
  onModeChange(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      inputMode: mode
    });

    wx.showToast({
      title: mode === 'quick' ? '已切换到快速模式' : '已切换到完整模式',
      icon: 'none',
      duration: 1500
    });
  },

  /**
   * 选择渠道
   */
  onChannelChange(e) {
    const index = e.detail.value;
    this.setData({
      channel: this.data.channels[index]
    });
  },

  /**
   * 选择日期
   */
  onDateChange(e) {
    this.setData({
      applyDate: e.detail.value
    });
  },

  /**
   * JD输入
   */
  onJDInput(e) {
    this.setData({
      jd: e.detail.value
    });
  },

  /**
   * AI解析JD
   */
  async onParseJD() {
    if (!this.data.jd) {
      wx.showToast({
        title: '请先输入JD内容',
        icon: 'none'
      });
      return;
    }

    try {
      wx.showLoading({ title: 'AI解析中...', mask: true });
      const result = await AIHelper.parseJD(this.data.jd);
      wx.hideLoading();

      // 自动填充表单字段
      this.setData({
        location: result.location || this.data.location,
        salary: result.salaryRange || this.data.salary
      });

      // 显示解析结果
      wx.showModal({
        title: '解析成功',
        content: `岗位职责：${result.responsibilities}\n\n技能要求：${result.skills.join('、')}\n\n已自动填充地点和薪资信息`,
        showCancel: false
      });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '解析失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 提交表单
   */
  onSubmit(e) {
    const formData = e.detail.value;

    if (!formData.company || !formData.position || !formData.channel) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      });
      return;
    }

    const job = {
      company: formData.company,
      position: formData.position,
      channel: formData.channel,
      location: formData.location || '',
      salary: formData.salary || '',
      applyDate: formData.applyDate,
      jd: formData.jd || '',
      contact: formData.contact || '',
      remark: formData.remark || '',
      status: 'pending'
    };

    const result = DataManager.addJob(job);

    if (result) {
      wx.showToast({
        title: '保存成功',
        icon: 'success'
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
