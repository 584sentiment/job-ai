# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

求职追踪助手是一款专为求职人员打造的微信小程序工具，聚焦"岗位记录-进度追踪-面经收集-面试总结"全流程求职管理。

**当前状态**: 项目已完成框架搭建和核心页面开发（约60%完成度），使用原生微信小程序技术栈，采用本地存储方案，AI功能为模拟响应（为后续接入真实API做准备）。

## 常用命令

### 图标资源下载
项目使用 Node.js 脚本从 lucide.dev 下载 SVG 图标并转换为 PNG：

```bash
# 安装依赖（首次使用）
npm install sharp

# 下载并转换图标
node scripts/download-icons.js
```

**注意**: 需要安装 `sharp` 或 `ImageMagick` 进行 SVG 到 PNG 的转换。

### 微信小程序开发
```bash
# 在微信开发者工具中打开项目目录
# 项目路径: miniprogram/

# 开发者工具会自动编译和预览
# 无需额外的构建命令
```

## 核心架构

### 目录结构
```
miniprogram/
├── app.js                # 小程序入口，初始化存储和用户信息
├── app.json              # 全局配置（页面路由、TabBar、样式）
├── app.wxss              # 全局样式
├── pages/                # 页面目录（7个页面）
│   ├── index/            # 首页-岗位列表
│   ├── add-job/          # 添加岗位（含AI解析JD）
│   ├── job-detail/       # 岗位详情（含AI匹配度分析）
│   ├── interviews/       # 面试列表（含AI准备清单）
│   ├── experience/       # 面经管理（占位，待实现）
│   ├── ai-assistant/     # AI助手对话
│   └── profile/          # 个人中心
├── components/           # 组件目录（占位，待实现）
│   ├── job-card/
│   ├── filter-tags/
│   ├── status-badge/
│   └── ai-card/
├── utils/                # 工具函数库（核心模块）
│   ├── storage.js        # 存储封装（Storage类）
│   ├── data-manager.js   # 数据管理（DataManager）
│   ├── ai-helper.js      # AI功能封装（AIHelper）
│   ├── ai-mock.js        # AI模拟响应（AI_MOCK）
│   └── format.js         # 格式化工具（Format）
├── styles/               # 全局样式
│   └── variables.wxss    # CSS变量定义
└── assets/
    └── icons/            # 图标资源（12个PNG）
```

### 数据层架构

#### 1. 存储封装（`utils/storage.js`）
```javascript
const { Storage, STORAGE_KEYS } = require('../../utils/storage.js');

// 读取数据
const jobs = Storage.get(STORAGE_KEYS.JOBS);

// 写入数据
Storage.set(STORAGE_KEYS.JOBS, jobs);

// 存储键名常量
STORAGE_KEYS.JOBS           // 'jobs_data'
STORAGE_KEYS.INTERVIEWS     // 'interviews_data'
STORAGE_KEYS.EXPERIENCES    // 'experiences_data'
STORAGE_KEYS.SUMMARIES      // 'summaries_data'
STORAGE_KEYS.CONVERSATIONS  // 'conversations_data'
STORAGE_KEYS.USER_PROFILE   // 'user_profile'
```

**设计模式**: 单例模式，静态方法

#### 2. 数据管理（`utils/data-manager.js`）
统一的数据CRUD操作入口，所有数据操作应通过此模块：

```javascript
const DataManager = require('../../utils/data-manager.js');

// 岗位操作
const jobs = DataManager.getJobs(filter);  // 支持筛选: 'all', 'pending', 'applied', etc.
const job = DataManager.getJobById(id);
DataManager.addJob(job);
DataManager.updateJob(id, updates);
DataManager.deleteJob(id);
const results = DataManager.searchJobs(keyword);

// 面试操作
const interviews = DataManager.getInterviews();

// 用户信息
const profile = DataManager.getUserProfile();
DataManager.updateUserProfile(updates);
```

#### 3. AI功能模块（`utils/ai-helper.js`）
所有AI功能的统一入口，返回Promise便于后续接入真实API：

```javascript
const AIHelper = require('../../utils/ai-helper.js');

// JD智能解析（1.5秒延迟）
const result = await AIHelper.parseJD(jdText);

// 岗位匹配度分析（即时）
const matchScore = AIHelper.analyzeJob(job, userProfile);

// 面试准备清单生成（即时）
const prepList = AIHelper.generatePrepList(interview);

// AI助手对话（1秒延迟）
const response = await AIHelper.chat(message);
```

**关键特性**:
- 所有AI方法返回Promise
- 模拟网络延迟（1-1.5秒）
- 调用 `ai-mock.js` 生成模拟数据
- 为接入真实API预留接口

### 样式系统

#### CSS变量（`styles/variables.wxss`）
项目使用CSS变量统一管理样式，支持双色系统：

```css
/* 常规功能（蓝色） */
--primary-blue: #0369A1;
--secondary-blue: #0EA5E9;

/* AI功能（紫色） */
--ai-primary: #6366F1;
--ai-secondary: #8B5CF6;
--ai-gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);

/* 状态标签配色 */
--status-pending-bg: #FEF3C7;      /* 待投递 */
--status-applied-bg: #DBEAFE;      /* 已投递 */
--status-interview-bg: #E0E7FF;    /* 面试中 */
--status-offered-bg: #D1FAE5;      /* 已录用 */
--status-rejected-bg: #FEE2E2;     /* 已拒绝 */
```

#### AI卡片样式
AI功能使用特殊的卡片样式，视觉上与常规功能区分：

```xml
<view class="card ai-card">
  <view class="ai-header">
    <text>AI分析</text>
  </view>
  <view class="ai-content">
    <!-- 内容 -->
  </view>
</view>
```

### 页面路由与导航

#### TabBar页面（底部切换）
```javascript
// 岗位、面试、面经、我的
wx.switchTab({
  url: '/pages/index/index'
})
```

#### 非TabBar页面
```javascript
// 跳转（保留当前页）
wx.navigateTo({
  url: '/pages/add-job/add-job'
})

// 跳转（关闭当前页）
wx.redirectTo({
  url: '/pages/job-detail/job-detail?id=' + jobId
})

// 返回上一页
wx.navigateBack()
```

#### 路由传参
```javascript
// 传递参数
wx.navigateTo({
  url: '/pages/job-detail/job-detail?id=' + jobId
})

// 接收参数
Page({
  onLoad(options) {
    const jobId = parseInt(options.id);
    const job = DataManager.getJobById(jobId);
  }
})
```

### 数据模型

#### 岗位数据模型
```javascript
{
  id: Date.now(),                    // 时间戳ID
  company: "字节跳动",
  position: "前端工程师",
  channel: "招聘网站",
  location: "北京",
  salary: "25-40K",
  applyDate: "2025-01-17",
  jd: "负责产品前端开发...",
  contact: "",
  remark: "",
  status: "applied",                 // pending/applied/interview/offered/rejected

  // AI增强字段
  aiMatchScore: {
    overall: 85,
    skills: 90,
    experience: 80,
    education: 100,
    salary: 75,
    advantages: ["学历完全符合要求"],
    suggestions: ["补充更多项目经验"]
  },

  // 时间线
  timeline: [{
    status: "已投递",
    date: "2025-01-17",
    desc: "投递成功"
  }],

  createTime: "2025-01-17T08:00:00.000Z",
  updateTime: "2025-01-17T08:00:00.000Z"
}
```

#### 面试数据模型
```javascript
{
  id: Date.now(),
  jobId: 1705478400000,              // 关联岗位ID
  company: "字节跳动",
  position: "前端工程师",
  round: "一面",
  date: "2025-01-20",
  time: "14:00",
  location: "北京海淀区",
  form: "现场面试",
  status: "upcoming",                // upcoming/completed/cancelled

  // AI准备清单
  aiPrepList: [
    { id: 1, text: "复习前端核心技能", completed: false },
    { id: 2, text: "准备项目经验介绍", completed: false }
  ],

  createTime: "2025-01-17T08:00:00.000Z"
}
```

#### AI对话数据模型
```javascript
{
  id: Date.now(),
  role: "assistant",                 // user/assistant
  content: "欢迎使用AI求职助手...",
  actions: [                         // 可选的操作按钮
    { text: "查看准备指南", action: "view_guide" },
    { text: "开始模拟面试", action: "mock_interview" }
  ],
  createTime: "2025-01-17T08:00:00.000Z"
}
```

### 页面间数据同步

**方案**: 使用 `onShow` 生命周期实现数据同步

```javascript
// 场景: add-job页添加岗位后返回index页

// add-job.js
onSubmit() {
  DataManager.addJob(job);
  wx.navigateBack();  // 返回上一页
}

// index.js
onShow() {
  this.loadJobs();  // 重新加载数据，实现同步
}
```

## AI功能开发指南

### 当前实现方式
所有AI功能都是模拟响应，通过 `setTimeout` 延迟返回数据：

```javascript
// utils/ai-helper.js
async parseJD(jdText) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = AI_MOCK.parseJD(jdText);
      resolve(result);
    }, 1500);  // 1.5秒延迟
  });
}
```

### 接入真实API
当需要接入真实AI服务时，只需修改 `utils/ai-helper.js`：

```javascript
async parseJD(jdText) {
  try {
    // 调用真实API
    const res = await wx.request({
      url: 'https://your-api.com/parse-jd',
      method: 'POST',
      data: { jdText }
    });
    return res.data;
  } catch (error) {
    console.error('AI API调用失败:', error);
    // 降级到模拟数据
    return AI_MOCK.parseJD(jdText);
  }
}
```

**优势**: 数据结构已固定，Promise接口已预留，替换实现即可。

### AI功能延迟时间
- JD解析: 1.5秒
- AI对话: 1秒
- 匹配度分析: 即时
- 准备清单生成: 即时

## 开发注意事项

### 性能优化
1. 避免频繁的 `setData` 操作，尽量批量更新
2. 长列表考虑使用虚拟列表或分页加载
3. 图片资源使用压缩后的PNG格式

### 布局与滚动规范

#### 1. 使用 scroll-view 实现滚动内容
当页面内容可能超出可视区域需要滚动显示时，**必须**使用 `<scroll-view>` 组件，而不是让整个页面滚动。

**使用方法**：
```xml
<!-- 垂直滚动 -->
<scroll-view scroll-y class="scroll-container">
  <!-- 内容 -->
</scroll-view>

<!-- 水平滚动 -->
<scroll-view scroll-x class="scroll-container">
  <!-- 内容 -->
</scroll-view>

<!-- 同时支持水平和垂直滚动 -->
<scroll-view scroll-x scroll-y class="scroll-container">
  <!-- 内容 -->
</scroll-view>
```

**CSS 设置**：
```css
.scroll-container {
  height: 100vh;           /* 必须设置固定高度 */
  width: 100%;             /* 或固定宽度 */
}
```

**注意事项**：
- `scroll-view` 必须设置固定的高度（如 `height: 100vh`）
- 水平滚动时，子元素需要设置 `white-space: nowrap` 或使用 `display: inline-block`
- 不要在 `scroll-view` 内部嵌套过多的滚动容器，避免性能问题

#### 2. 开启怪异盒模型防止布局溢出
**所有容器元素必须开启怪异盒模型**（border-box），防止内外边距（padding/margin）导致内容超出可视区，出现横向滚动条。

**全局设置**（推荐）：
```css
/* 在 app.wxss 或全局样式中 */
* {
  box-sizing: border-box;
}

/* 或针对特定容器 */
.container {
  box-sizing: border-box;
  padding: 16px;
  margin: 0;
}
```

**为什么需要怪异盒模型**：
- **标准盒模型**（content-box）：`width` 只包含内容宽度，padding 和 border 会额外增加元素总宽度
- **怪异盒模型**（border-box）：`width` 包含内容 + padding + border，元素总宽度不会超出设定值

**示例对比**：
```css
/* 标准盒模型（可能溢出） */
.container {
  width: 100%;
  padding: 20px;  /* 总宽度 = 100% + 40px，会溢出 */
  box-sizing: content-box;
}

/* 怪异盒模型（不会溢出） */
.container {
  width: 100%;
  padding: 20px;  /* 总宽度 = 100%，padding 包含在内 */
  box-sizing: border-box;
}
```

**最佳实践**：
```css
/* 全局启用怪异盒模型 */
page {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

/* 容器示例 */
.page-container {
  width: 100%;
  height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
  overflow: hidden;  /* 防止内容溢出 */
}
```

**常见问题排查**：
如果页面出现横向滚动条，检查：
1. 是否所有容器都使用了 `box-sizing: border-box`
2. 是否有元素宽度超过 100%（如设置了 padding 但未使用 border-box）
3. 是否有固定宽度的元素总和超过父容器宽度

### 存储限制
微信小程序本地存储有大小限制（通常10MB），当前实现使用JSON序列化，注意控制数据量。

### 组件化开发
虽然组件目录已创建，但组件尚未实现。后续优化方向：
- 抽取 `job-card` 为独立组件
- 抽取 `filter-tags` 为独立组件
- 抽取 `status-badge` 为独立组件
- 抽取 `ai-card` 为独立组件

### 待完成功能
- 面经管理页（当前为占位）
- 岗位编辑功能
- 面试添加功能
- 面试详情页
- 组件系统实现
- 下拉刷新功能

## 参考文档

### 产品需求文档 (PRD)
- **文件**: `求职追踪助手微信小程序产品需求文档（PRD）.md`
- **内容**: 完整的产品功能需求、用户痛点分析、核心功能定义

### 页面原型设计
- **目录**: `job-ui/` - Web 版页面原型 (用于设计参考)
- **目录**: `prototype/` - AI 版可交互原型 (用于设计参考)

**注意**: 这些 HTML 文件仅为设计参考原型，展示 UI/UX 设计思路，并非项目实际源代码。

### 查看原型设计
```bash
# macOS
open job-ui/index.html
open prototype/index.html

# 或启动本地服务器
python3 -m http.server 8000
# 访问 http://localhost:8000/prototype/
```

## 文档规范

项目文档统一存放在 `/docs/` 目录：

- **`/docs/arch-design.md`** - 架构设计文档（技术方案、系统设计）
- **`/docs/dev-progress.md`** - 开发进度文档（功能完成情况、里程碑）
- **`/docs/bug-fix.md`** - 问题修复日志（Bug描述、根因分析、解决方案）

**文档更新原则**:
- 尽量使用现有三个文档文件，避免随意添加新文档
- 每次更新需标注更新时间（YYYY-MM-DD）
- 保持简洁，使用清晰的章节结构

## Git 提交规范

每个功能实现完成之后必须进行 commit。

**Commit Message 格式**：
```
<类型>: <开发阶段>-<页面>/<功能>: <简要描述>
```

**示例**：
- `feat: 阶段二-核心页/首页/岗位列表: 实现岗位列表展示和筛选功能`
- `feat: 阶段二-核心页/添加岗位/AI解析: 实现AI智能解析JD功能`
- `fix: 阶段二-核心页/添加岗位/表单验证: 修复表单验证问题`
- `style: 阶段一-框架/通用/样式调整: 优化全局样式`

**Commit 类型**：
- `feat`: 新功能
- `fix`: Bug 修复
- `refactor`: 代码重构
- `style`: 样式调整
- `docs`: 文档更新
- `test`: 测试相关
- `chore`: 构建/工具链相关
- `opt`: 优化

## 功能完成检查清单

每个功能完成后执行：

- [ ] 代码已实现所有功能点
- [ ] 代码已 commit（使用规范的 commit message）
- [ ] 更新 `/docs/dev-progress.md`（记录功能完成情况）
- [ ] 如有设计变更，更新 `/docs/arch-design.md`
- [ ] 如遇到问题，记录到 `/docs/bug-fix.md`
- [ ] 基本测试通过，无明显错误

## 开发工作流

```
开始开发
    ↓
选择当前阶段任务
    ↓
实现功能代码
    ↓
[功能测试]
    ↓
[Git Commit] → 使用规范 commit message
    ↓
[更新文档] → /docs/dev-progress.md
    ↓
[检查是否有遗漏功能]
    ↓ 是 → 继续下一个功能
    ↓ 否
[所有功能是否完成?]
    ↓ 否 → 返回选择任务
    ↓ 是
[交互联通性检查]
    ↓
[项目完成]
```

## 项目完成检查清单

**所有功能开发完成后**，必须执行以下检查：

### 编译与类型检查
- [ ] 项目能够正常编译/构建
- [ ] 无微信小程序开发者工具报错

### 功能完整性检查
- [ ] 所有页面均可正常访问
- [ ] 所有核心功能均已实现
- [ ] AI 功能模拟响应正常
- [ ] 数据存储读写正常

### 交互联通性检查
- [ ] 页面跳转路由正常
- [ ] Tab 切换功能正常
- [ ] 表单提交后数据流转正常
- [ ] 搜索/筛选功能联动正常
- [ ] 详情页数据展示正确
- [ ] 操作按钮（编辑/删除/添加）响应正常
- [ ] Toast 提示显示正常
- [ ] 空状态页面显示正常

### 兼容性测试
- [ ] 微信开发者工具预览正常
- [ ] 真机预览功能正常（iOS）
- [ ] 真机预览功能正常（Android）
- [ ] 不同屏幕尺寸适配正常

## 代码规范

### 命名规范
- **变量命名**: 驼峰命名法（`searchKeyword`, `currentFilter`）
- **函数命名**: 驼峰命名法，动词开头（`loadJobs`, `onSearchInput`）
- **文件命名**: 短横线命名法（`add-job/`, `data-manager.js`）

### 代码注释
```javascript
/**
 * 加载岗位列表
 */
loadJobs() {
  const jobs = DataManager.getJobs(this.data.currentFilter);
  this.setData({ jobs });
}
```

### AI 功能开发规范
- 所有 AI 功能调用需有 loading 状态
- 模拟响应延迟 1-2 秒，模拟真实感
- 错误情况有降级处理
- 为后续接入真实 API 预留接口

## 核心功能模块（已实现）

### 1. 岗位管理
- ✅ 快速录入岗位信息（公司、岗位、渠道、地点、薪资等）
- ✅ JD 文本粘贴保存 + AI智能解析
- ✅ 投递状态管理（待投递、已投递、面试中、已录用、已拒绝等）
- ✅ 岗位列表筛选与搜索
- ✅ 岗位详情查看 + AI匹配度分析
- ⏳ 岗位编辑功能（待实现）

### 2. 面试管理
- ✅ 面试列表展示（Tab切换：即将到来/已完成）
- ✅ AI准备清单生成（可交互勾选）
- ✅ 面试倒计时
- ⏳ 添加面试功能（待实现）
- ⏳ 面试详情页（待实现）

### 3. 面经管理
- ⏳ 面经管理页（占位，待实现）
- ⏳ 面经录入与分类（待实现）
- ⏳ 面经搜索与收藏（待实现）
- ⏳ 面经与岗位关联（待实现）

### 4. 面试总结
- ⏳ 结构化总结记录（待实现）
- ⏳ 总结与面试轮次关联（待实现）
- ⏳ 总结搜索与复用（待实现）

### 5. AI助手
- ✅ 欢迎卡片（首次进入显示）
- ✅ 快速问题入口（3个预设问题）
- ✅ 对话历史展示
- ✅ 底部输入框
- ✅ 异步对话（1秒延迟模拟思考）

### 6. 个人中心
- ✅ 用户信息卡片（头像、昵称、简介）
- ✅ 数据统计（全部岗位、面试中、面经、收藏）
- ✅ 功能入口（我的岗位、我的面试、面经收藏、系统设置）

## 技术亮点

### 1. 模块化架构
- 存储封装
- 数据管理
- AI功能封装（AIHelper）
- 格式化工具
- 职责清晰，易于维护

### 2. 双色系统设计
- 蓝色常规功能 + 紫色AI功能
- CSS变量统一管理
- 视觉识别度高

### 3. AI功能预留设计
- 所有AI方法返回Promise
- 异步操作不阻塞UI
- 数据结构固定
- 便于接入真实API

### 4. 本地化存储方案
- 统一的Storage封装
- 存储键名常量化
- 自动初始化默认数据
