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
   * 根据ID获取面试
   */
  getInterviewById(id) {
    const interviews = Storage.get(STORAGE_KEYS.INTERVIEWS) || [];
    return interviews.find(interview => interview.id === id);
  },

  /**
   * 根据岗位ID获取面试列表
   */
  getInterviewsByJobId(jobId) {
    const interviews = Storage.get(STORAGE_KEYS.INTERVIEWS) || [];
    return interviews.filter(interview => interview.jobId === jobId);
  },

  /**
   * 添加面试
   */
  addInterview(interview) {
    const interviews = Storage.get(STORAGE_KEYS.INTERVIEWS) || [];
    const newInterview = {
      id: Date.now(),
      ...interview,
      status: interview.status || 'upcoming',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    interviews.unshift(newInterview);
    Storage.set(STORAGE_KEYS.INTERVIEWS, interviews);

    // 更新关联的岗位状态为"面试中"
    if (interview.jobId) {
      this.updateJob(interview.jobId, {
        status: 'interview',
        timeline: [
          ...(this.getJobById(interview.jobId).timeline || []),
          {
            status: '面试中',
            date: new Date().toISOString().split('T')[0],
            desc: `安排${interview.round}面试`
          }
        ]
      });
    }

    return newInterview;
  },

  /**
   * 更新面试
   */
  updateInterview(id, updates) {
    const interviews = Storage.get(STORAGE_KEYS.INTERVIEWS) || [];
    const index = interviews.findIndex(i => i.id === id);
    if (index !== -1) {
      interviews[index] = {
        ...interviews[index],
        ...updates,
        updateTime: new Date().toISOString()
      };
      Storage.set(STORAGE_KEYS.INTERVIEWS, interviews);

      // 如果状态变更为已完成，更新关联岗位状态
      if (updates.status === 'completed' && interviews[index].jobId) {
        const job = this.getJobById(interviews[index].jobId);
        if (job) {
          this.updateJob(job.id, {
            timeline: [
              ...(job.timeline || []),
              {
                status: '面试完成',
                date: new Date().toISOString().split('T')[0],
                desc: `${interviews[index].round}面试完成`
              }
            ]
          });
        }
      }

      return true;
    }
    return false;
  },

  /**
   * 删除面试
   */
  deleteInterview(id) {
    const interviews = Storage.get(STORAGE_KEYS.INTERVIEWS) || [];
    const filtered = interviews.filter(i => i.id !== id);
    Storage.set(STORAGE_KEYS.INTERVIEWS, filtered);
    return true;
  },

  /**
   * 获取所有面经
   */
  getExperiences() {
    return Storage.get(STORAGE_KEYS.EXPERIENCES) || [];
  },

  /**
   * 根据ID获取面经
   */
  getExperienceById(id) {
    const experiences = Storage.get(STORAGE_KEYS.EXPERIENCES) || [];
    return experiences.find(exp => exp.id === id);
  },

  /**
   * 添加面经
   */
  addExperience(experience) {
    const experiences = Storage.get(STORAGE_KEYS.EXPERIENCES) || [];
    const newExperience = {
      id: Date.now(),
      ...experience,
      isAnonymous: experience.isAnonymous || false,
      isFavorite: false,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    experiences.unshift(newExperience);
    Storage.set(STORAGE_KEYS.EXPERIENCES, experiences);
    return newExperience;
  },

  /**
   * 更新面经
   */
  updateExperience(id, updates) {
    const experiences = Storage.get(STORAGE_KEYS.EXPERIENCES) || [];
    const index = experiences.findIndex(exp => exp.id === id);
    if (index !== -1) {
      experiences[index] = {
        ...experiences[index],
        ...updates,
        updateTime: new Date().toISOString()
      };
      Storage.set(STORAGE_KEYS.EXPERIENCES, experiences);
      return true;
    }
    return false;
  },

  /**
   * 删除面经
   */
  deleteExperience(id) {
    const experiences = Storage.get(STORAGE_KEYS.EXPERIENCES) || [];
    const filtered = experiences.filter(exp => exp.id !== id);
    Storage.set(STORAGE_KEYS.EXPERIENCES, filtered);
    return true;
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite(id) {
    const experiences = Storage.get(STORAGE_KEYS.EXPERIENCES) || [];
    const experience = experiences.find(exp => exp.id === id);
    if (experience) {
      experience.isFavorite = !experience.isFavorite;
      experience.updateTime = new Date().toISOString();
      Storage.set(STORAGE_KEYS.EXPERIENCES, experiences);
      return experience;
    }
    return null;
  },

  /**
   * 搜索面经
   */
  searchExperiences(keyword) {
    const experiences = Storage.get(STORAGE_KEYS.EXPERIENCES) || [];
    return experiences.filter(exp =>
      exp.company.includes(keyword) ||
      exp.position.includes(keyword) ||
      (exp.content && exp.content.includes(keyword))
    );
  },

  /**
   * 获取收藏的面经
   */
  getFavoriteExperiences() {
    const experiences = Storage.get(STORAGE_KEYS.EXPERIENCES) || [];
    return experiences.filter(exp => exp.isFavorite);
  },

  /**
   * 根据岗位ID获取面经
   */
  getExperiencesByJobId(jobId) {
    const experiences = Storage.get(STORAGE_KEYS.EXPERIENCES) || [];
    return experiences.filter(exp => exp.jobId === jobId);
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
    const profile = storage.get(STORAGE_KEYS.USER_PROFILE) || {};
    const updated = { ...profile, ...updates };
    Storage.set(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  },

  /**
   * 获取所有总结
   */
  getSummaries() {
    return Storage.get(STORAGE_KEYS.SUMMARIES) || [];
  },

  /**
   * 根据ID获取总结
   */
  getSummaryById(id) {
    const summaries = Storage.get(STORAGE_KEYS.SUMMARIES) || [];
    return summaries.find(summary => summary.id === id);
  },

  /**
   * 添加总结
   */
  addSummary(summary) {
    const summaries = Storage.get(STORAGE_KEYS.SUMMARIES) || [];
    const newSummary = {
      id: Date.now(),
      ...summary,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    summaries.unshift(newSummary);
    Storage.set(STORAGE_KEYS.SUMMARIES, summaries);
    return newSummary;
  },

  /**
   * 更新总结
   */
  updateSummary(id, updates) {
    const summaries = Storage.get(STORAGE_KEYS.SUMMARIES) || [];
    const index = summaries.findIndex(s => s.id === id);
    if (index !== -1) {
      summaries[index] = {
        ...summaries[index],
        ...updates,
        updateTime: new Date().toISOString()
      };
      Storage.set(STORAGE_KEYS.SUMMARIES, summaries);
      return true;
    }
    return false;
  },

  /**
   * 删除总结
   */
  deleteSummary(id) {
    const summaries = Storage.get(STORAGE_KEYS.SUMMARIES) || [];
    const filtered = summaries.filter(s => s.id !== id);
    Storage.set(STORAGE_KEYS.SUMMARIES, filtered);
    return true;
  },

  /**
   * 根据岗位ID获取总结
   */
  getSummariesByJobId(jobId) {
    const summaries = Storage.get(STORAGE_KEYS.SUMMARIES) || [];
    return summaries.filter(s => s.jobId === jobId);
  },

  /**
   * 搜索总结
   */
  searchSummaries(keyword) {
    const summaries = Storage.get(STORAGE_KEYS.SUMMARIES) || [];
    return summaries.filter(s =>
      (s.questions && s.questions.includes(keyword)) ||
      (s.weaknesses && s.weaknesses.includes(keyword)) ||
      (s.improvements && s.improvements.includes(keyword)) ||
      (s.highlights && s.highlights.includes(keyword)) ||
      (s.notes && s.notes.includes(keyword))
    );
  },

  /**
   * 根据面试ID获取总结
   */
  getSummariesByInterviewId(interviewId) {
    const summaries = Storage.get(STORAGE_KEYS.SUMMARIES) || [];
    return summaries.filter(s => s.interviewId === interviewId);
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
