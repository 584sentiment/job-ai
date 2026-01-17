// app.js
App({
  onLaunch() {
    console.log('小程序启动');

    // 初始化本地存储
    this.initStorage();

    // 初始化用户信息
    this.initUserProfile();
  },

  /**
   * 初始化本地存储数据
   */
  initStorage() {
    const jobs = wx.getStorageSync('jobs_data');
    if (!jobs) {
      wx.setStorageSync('jobs_data', JSON.stringify([]));
    }

    const interviews = wx.getStorageSync('interviews_data');
    if (!interviews) {
      wx.setStorageSync('interviews_data', JSON.stringify([]));
    }

    const experiences = wx.getStorageSync('experiences_data');
    if (!experiences) {
      wx.setStorageSync('experiences_data', JSON.stringify([]));
    }

    const summaries = wx.getStorageSync('summaries_data');
    if (!summaries) {
      wx.setStorageSync('summaries_data', JSON.stringify([]));
    }

    const conversations = wx.getStorageSync('conversations_data');
    if (!conversations) {
      wx.setStorageSync('conversations_data', JSON.stringify([
        {
          id: 1,
          role: 'assistant',
          content: '欢迎使用AI求职助手！我可以帮你：\n\n1. 📝 简历优化\n2. 💡 面试准备\n3. 📊 岗位分析\n\n请告诉我你的需求~',
          createTime: new Date().toISOString()
        }
      ]));
    }
  },

  /**
   * 初始化用户信息
   */
  initUserProfile() {
    const userProfile = wx.getStorageSync('user_profile');
    if (!userProfile) {
      const defaultProfile = {
        nickname: '求职者',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jobseeker',
        phone: '',
        bio: '求职路上，AI与你同行',
        createTime: new Date().toISOString()
      };
      wx.setStorageSync('user_profile', JSON.stringify(defaultProfile));
    }
  },

  globalData: {
    userInfo: null
  }
});
