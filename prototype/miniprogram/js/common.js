// 公共脚本文件

// 路由管理
const Router = {
  routes: {
    'index': 'index.html',
    'add-job': 'add-job.html',
    'job-detail': 'job-detail.html',
    'interviews': 'interviews.html',
    'experience': 'experience.html',
    'ai-assistant': 'ai-assistant.html',
    'profile': 'profile.html'
  },

  // 导航到指定页面
  navigateTo: (page, params = {}) => {
    const url = Router.routes[page];
    if (!url) {
      console.error('页面不存在:', page);
      return;
    }

    // 构建查询参数
    const query = new URLSearchParams(params).toString();
    const fullUrl = query ? `${url}?${query}` : url;

    // 保存当前页面状态到 sessionStorage
    sessionStorage.setItem('router_params', JSON.stringify(params));

    window.location.href = fullUrl;
  },

  // 获取路由参数
  getParams: () => {
    const params = sessionStorage.getItem('router_params');
    sessionStorage.removeItem('router_params');
    return params ? JSON.parse(params) : {};
  },

  // 从URL获取查询参数
  getQueryParams: () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  // 返回上一页
  goBack: () => {
    window.history.back();
  }
};

// Toast 提示
const Toast = {
  show: (message, duration = 2000) => {
    // 移除已存在的toast
    const existing = document.querySelector('.toast');
    if (existing) {
      existing.remove();
    }

    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      animation: fadeIn 0.3s;
    `;

    document.body.appendChild(toast);

    // 自动移除
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  },

  success: (message) => {
    Toast.show(message);
  },

  error: (message) => {
    Toast.show(message);
  },

  loading: (message = '加载中...') => {
    return Toast.show(message, 0); // 0 表示不自动消失
  },

  hideLoading: () => {
    const toast = document.querySelector('.toast');
    if (toast) {
      toast.remove();
    }
  }
};

// Modal 弹窗
const Modal = {
  show: (options = {}) => {
    const {
      title = '提示',
      content = '',
      showCancel = true,
      cancelText = '取消',
      confirmText = '确定',
      onConfirm = null,
      onCancel = null
    } = options;

    // 移除已存在的modal
    const existing = document.querySelector('.modal-overlay');
    if (existing) {
      existing.remove();
    }

    // 创建modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
      animation: fadeIn 0.2s;
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
      background: #fff;
      border-radius: 16px;
      width: 85%;
      max-width: 320px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    modal.innerHTML = `
      <div class="modal-title" style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #111827;">${title}</div>
      <div class="modal-content" style="font-size: 14px; color: #6B7280; margin-bottom: 20px; line-height: 1.5;">${content}</div>
      <div class="modal-actions" style="display: flex; gap: 12px;">
        ${showCancel ? `<button class="modal-btn cancel" style="flex: 1; padding: 12px; border: 1px solid #D1D5DB; background: #fff; border-radius: 8px; font-size: 15px; color: #374151; cursor: pointer;">${cancelText}</button>` : ''}
        <button class="modal-btn confirm" style="flex: 1; padding: 12px; border: none; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: #fff; border-radius: 8px; font-size: 15px; cursor: pointer;">${confirmText}</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 绑定事件
    const confirmBtn = modal.querySelector('.modal-btn.confirm');
    const cancelBtn = modal.querySelector('.modal-btn.cancel');

    confirmBtn.addEventListener('click', () => {
      overlay.remove();
      if (onConfirm) onConfirm();
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        overlay.remove();
        if (onCancel) onCancel();
      });
    }

    // 点击背景关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        if (onCancel) onCancel();
      }
    });

    return overlay;
  },

  alert: (title, content, onConfirm) => {
    return Modal.show({
      title,
      content,
      showCancel: false,
      onConfirm
    });
  },

  confirm: (title, content, onConfirm, onCancel) => {
    return Modal.show({
      title,
      content,
      showCancel: true,
      onConfirm,
      onCancel
    });
  }
};

// AI 模拟响应
const AI = {
  // AI思考动画时间
  thinkTime: 1500,

  // 模拟AI响应
  async respond(question, context = {}) {
    // 显示思考动画
    return new Promise((resolve) => {
      setTimeout(() => {
        // 根据问题类型返回不同响应
        let response = '';

        if (question.includes('面试') && question.includes('准备')) {
          response = {
            type: 'interview_prep',
            content: `
## 面试准备建议

### 技术准备
- 复习核心基础（JavaScript、CSS、HTML）
- 熟悉所用框架原理（Vue/React）
- 准备2-3个代表性项目
- 刷算法题（LeetCode 50+）

### 材料准备
- 打印简历（3-5份）
- 准备作品集/项目演示
- 整理证书和成绩单

### 软技能
- STAR法则介绍项目
- 准备自我介绍（1-3分钟）
- 思考职业规划
            `,
            actions: [
              { text: '查看详细指南', action: 'view_guide' },
              { text: '开始模拟面试', action: 'mock_interview' }
            ]
          };
        } else if (question.includes('简历')) {
          response = {
            type: 'resume_advice',
            content: `
## 简历优化建议

### 项目经验突出技巧
1. **用数据说话**
   - "优化性能" → "优化页面加载速度，提升50%"

2. **STAR法则**
   - Situation（情境）
   - Task（任务）
   - Action（行动）
   - Result（结果）

3. **突出技术栈**
   - 按重要性排序
   - 标注熟练程度

4. **量化成果**
   - 性能提升百分比
   - 用户增长数据
   - 代码覆盖率
            `,
            actions: [
              { text: '查看简历模板', action: 'view_template' },
              { text: '诊断我的简历', action: 'diagnose_resume' }
            ]
          };
        } else if (question.includes('跟进') || question.includes('HR')) {
          response = {
            type: 'follow_up',
            content: `
## 面试后跟进建议

### 最佳时机
- 面试后24-48小时内
- 工作日10:00-11:00 或 14:00-16:00

### 跟进方式
1. **邮件（推荐）**
   - 主题：面试感谢 + 岗位名称
   - 内容：感谢 + 重申兴趣 + 补充信息

2. **微信/短信**
   - 简洁表达感谢
   - 询问下一步安排

### 模板
"尊敬的XX，感谢您昨天的时间。通过面试，我对XX岗位更加期待。如有任何需要补充的信息，请随时联系。期待您的回复！"
            `,
            actions: [
              { text: '查看邮件模板', action: 'view_email_template' }
            ]
          };
        } else {
          response = {
            type: 'general',
            content: `
我理解你的问题。以下是一些建议：

1. **提前准备** - 充分的准备是成功的关键
2. **保持自信** - 相信自己的能力
3. **持续学习** - 不断提升技术能力
4. **积极心态** - 把每次面试当作学习机会

需要更具体的建议吗？可以告诉我具体的场景和问题。
            `,
            actions: []
          };
        }

        resolve(response);
      }, AI.thinkTime);
    });
  },

  // 模拟JD解析
  async parseJD(jdText) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {
          responsibilities: '负责公司核心产品的前端开发和维护',
          skills: ['Vue3', 'React', 'TypeScript', 'Node.js', 'Webpack'],
          salaryRange: '20-35K',
          location: '北京',
          experience: '3-5年'
        };
        resolve(result);
      }, 2000);
    });
  },

  // 模拟匹配度分析
  async analyzeMatch(jobData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {
          overall: 85 + Math.floor(Math.random() * 10),
          skills: 80 + Math.floor(Math.random() * 15),
          experience: 85 + Math.floor(Math.random() * 10),
          education: 100,
          salary: 70 + Math.floor(Math.random() * 20),
          advantages: [
            '学历完全符合要求',
            '技术栈匹配度高',
            '项目经验相关'
          ],
          suggestions: [
            '可补充更多性能优化经验',
            '建议加强架构设计能力'
          ]
        };
        resolve(result);
      }, 2500);
    });
  },

  // 模拟准备清单生成
  async generatePrepList(jobData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = [
          { id: 1, text: `复习 ${jobData.skills ? jobData.skills[0] : '核心技能'} 基础`, completed: false },
          { id: 2, text: '准备项目介绍（STAR法则）', completed: false },
          { id: 3, text: `了解${jobData.company}企业文化`, completed: false },
          { id: 4, text: '准备向面试官提问的问题', completed: false },
          { id: 5, text: '复习常见算法题', completed: false },
          { id: 6, text: '准备自我介绍', completed: false }
        ];
        resolve(result);
      }, 2000);
    });
  },

  // 模拟总结生成
  async generateSummary(keywords) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = `
## 面试总结

### 核心问题
${keywords.split('、').map(k => `- ${k}`).join('\n')}

### 自身表现
- ✅ 技术回答较准确
- ✅ 项目介绍清晰
- ⚠️ 部分深度问题回答不够完整

### 不足与改进
- **技术深度**：加强对底层原理的理解
- **项目经验**：准备更多细节和数据
- **表达能力**：练习简洁准确地表达

### 重点考察内容
面试官重点关注了技术深度和项目经验，建议下次提前准备。
        `;
        resolve(result);
      }, 2000);
    });
  }
};

// 日期格式化
const DateFormat = {
  format: (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute);
  },

  relative: (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = d - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今天';
    if (days === 1) return '明天';
    if (days === -1) return '昨天';
    if (days > 1) return `${days}天后`;
    if (days < -1) return `${Math.abs(days)}天前`;
    return DateFormat.format(date);
  }
};

// 状态映射
const StatusMap = {
  'pending': { text: '待投递', class: 'pending' },
  'applied': { text: '已投递', class: 'applied' },
  'interview': { text: '面试中', class: 'interview' },
  'offered': { text: '已录用', class: 'offered' },
  'rejected': { text: '已拒绝', class: 'rejected' }
};

// 页面初始化
const App = {
  init: (callback) => {
    document.addEventListener('DOMContentLoaded', () => {
      if (callback) callback();
    });
  },

  // 获取当前页面名称
  getCurrentPage: () => {
    const path = window.location.pathname;
    const match = path.match(/\/([^/]+)\.html$/);
    return match ? match[1] : 'index';
  }
};

// 导出到全局
window.Router = Router;
window.Toast = Toast;
window.Modal = Modal;
window.AI = AI;
window.DateFormat = DateFormat;
window.StatusMap = StatusMap;
window.App = App;
