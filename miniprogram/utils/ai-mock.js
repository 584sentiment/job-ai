// utils/ai-mock.js - AI功能模拟

const AI_MOCK = {
  /**
   * JD解析模拟
   */
  parseJD: (jdText) => {
    return {
      responsibilities: "负责产品前端开发，参与技术方案设计，优化用户体验",
      skills: ["Vue.js", "React", "TypeScript", "Node.js", "微信小程序"],
      location: "北京",
      salaryRange: "25-40K"
    };
  },

  /**
   * 岗位匹配度分析模拟
   */
  analyzeMatch: (job, userProfile) => {
    const randomScore = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      overall: randomScore(75, 95),
      skills: randomScore(80, 95),
      experience: randomScore(70, 90),
      education: 100,
      salary: randomScore(75, 90),
      advantages: ["学历完全符合要求", "技术栈匹配度高"],
      suggestions: ["补充更多项目经验", "加强算法能力"]
    };
  },

  /**
   * AI助手对话模拟
   */
  respond: (message) => {
    const responses = {
      "面试准备": {
        content: "面试准备建议：\n1. 复习基础知识点\n2. 准备项目介绍\n3. 了解公司业务",
        actions: [
          { text: "查看准备指南", action: "view_guide" },
          { text: "开始模拟面试", action: "mock_interview" }
        ]
      },
      "简历优化": {
        content: "简历优化建议：\n1. 突出项目经验\n2. 量化成果\n3. 使用STAR法则",
        actions: [
          { text: "查看简历模板", action: "view_template" },
          { text: "简历诊断", action: "diagnose_resume" }
        ]
      },
      "岗位分析": {
        content: "岗位分析要点：\n1. 对比技能要求\n2. 分析岗位职责\n3. 评估匹配度",
        actions: []
      }
    };

    // 关键词匹配
    for (let key in responses) {
      if (message.includes(key)) {
        return responses[key];
      }
    }

    // 默认回复
    return {
      content: "我可以帮你：\n1. 📝 简历优化\n2. 💡 面试准备\n3. 📊 岗位分析\n\n请告诉我你的需求~",
      actions: []
    };
  },

  /**
   * 面试准备清单生成
   */
  generatePrepList: (interview) => {
    return [
      { id: 1, text: `复习${interview.position}核心技能`, completed: false },
      { id: 2, text: "准备项目经验介绍", completed: false },
      { id: 3, text: `了解${interview.company}业务`, completed: false },
      { id: 4, text: "准备常见面试问题", completed: false },
      { id: 5, text: "准备向面试官提问", completed: false }
    ];
  }
};

module.exports = AI_MOCK;
