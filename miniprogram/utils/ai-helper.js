// utils/ai-helper.js - AI辅助函数
const AI_MOCK = require('./ai-mock.js');

const AIHelper = {
  /**
   * 解析JD
   */
  async parseJD(jdText) {
    return new Promise((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        const result = AI_MOCK.parseJD(jdText);
        resolve(result);
      }, 1500);
    });
  },

  /**
   * 分析岗位匹配度
   */
  analyzeJob(job, userProfile) {
    return AI_MOCK.analyzeMatch(job, userProfile);
  },

  /**
   * 生成面试准备清单
   */
  generatePrepList(interview) {
    return AI_MOCK.generatePrepList(interview);
  },

  /**
   * AI对话
   */
  async chat(message) {
    return new Promise((resolve) => {
      // 模拟思考时间
      setTimeout(() => {
        const response = AI_MOCK.respond(message);
        resolve(response);
      }, 1000);
    });
  }
};

module.exports = AIHelper;
