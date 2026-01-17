// utils/data-manager.js - 数据管理
const { Storage, STORAGE_KEYS } = require('./storage.js');

const DataManager = {
  /**
   * 获取所有岗位
   */
  getJobs(filter = 'all') {
    const jobs = Storage.get(STORAGE_KEYS.JOBS) || [];
    if (filter === 'all') return jobs;
    return jobs.filter(job => job.status === filter);
  },

  /**
   * 根据ID获取岗位
   */
  getJobById(id) {
    const jobs = Storage.get(STORAGE_KEYS.JOBS) || [];
    return jobs.find(job => job.id === id);
  },

  /**
   * 添加岗位
   */
  addJob(job) {
    const jobs = Storage.get(STORAGE_KEYS.JOBS) || [];
    const newJob = {
      id: Date.now(),
      ...job,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    jobs.unshift(newJob);
    Storage.set(STORAGE_KEYS.JOBS, jobs);
    return newJob;
  },

  /**
   * 更新岗位
   */
  updateJob(id, updates) {
    const jobs = Storage.get(STORAGE_KEYS.JOBS) || [];
    const index = jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      jobs[index] = {
        ...jobs[index],
        ...updates,
        updateTime: new Date().toISOString()
      };
      Storage.set(STORAGE_KEYS.JOBS, jobs);
      return true;
    }
    return false;
  },

  /**
   * 删除岗位
   */
  deleteJob(id) {
    const jobs = Storage.get(STORAGE_KEYS.JOBS) || [];
    const filtered = jobs.filter(j => j.id !== id);
    Storage.set(STORAGE_KEYS.JOBS, filtered);
    return true;
  },

  /**
   * 搜索岗位
   */
  searchJobs(keyword) {
    const jobs = Storage.get(STORAGE_KEYS.JOBS) || [];
    return jobs.filter(job =>
      job.company.includes(keyword) ||
      job.position.includes(keyword)
    );
  },

  /**
   * 获取所有面试
   */
  getInterviews() {
    return Storage.get(STORAGE_KEYS.INTERVIEWS) || [];
  },

  /**
   * 获取所有面经
   */
  getExperiences() {
    return Storage.get(STORAGE_KEYS.EXPERIENCES) || [];
  },

  /**
   * 获取用户信息
   */
  getUserProfile() {
    return Storage.get(STORAGE_KEYS.USER_PROFILE);
  },

  /**
   * 更新用户信息
   */
  updateUserProfile(updates) {
    const profile = Storage.get(STORAGE_KEYS.USER_PROFILE) || {};
    const updated = { ...profile, ...updates };
    Storage.set(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  }
};

module.exports = DataManager;
