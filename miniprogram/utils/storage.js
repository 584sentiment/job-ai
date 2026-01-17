// utils/storage.js - 本地存储封装

class Storage {
  /**
   * 获取数据
   */
  static get(key) {
    try {
      const value = wx.getStorageSync(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  }

  /**
   * 设置数据
   */
  static set(key, value) {
    try {
      wx.setStorageSync(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  }

  /**
   * 删除数据
   */
  static remove(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  }

  /**
   * 清空所有数据
   */
  static clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  }
}

// 存储键名常量
const STORAGE_KEYS = {
  JOBS: 'jobs_data',
  INTERVIEWS: 'interviews_data',
  EXPERIENCES: 'experiences_data',
  SUMMARIES: 'summaries_data',
  CONVERSATIONS: 'conversations_data',
  USER_PROFILE: 'user_profile',
  SETTINGS: 'app_settings'
};

module.exports = {
  Storage,
  STORAGE_KEYS
};
