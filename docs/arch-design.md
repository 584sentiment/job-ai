# 架构设计文档

本文档记录项目的架构设计相关内容。

## 更新日志

- 2025-01-17: 初始创建文档文件
- 2025-01-17: 添加AI增强版产品架构设计
- 2025-01-30: 添加Web端架构设计
- 2025-01-30: 添加后端API架构设计

---

# AI增强版求职追踪助手 - 产品架构设计

## 一、产品定位

**产品名称**: 求职追踪助手 AI版
**产品类型**: 微信小程序（工具类 + AI辅助）
**目标用户**: 校招求职学生、社招求职人员
**核心差异**: 传统求职管理工具 + AI智能辅助，提升求职效率和质量

## 二、核心功能架构

### 2.1 功能模块总览

```
求职追踪助手 AI版
│
├── 1. 岗位管理模块（基础功能）
│   ├── 岗位录入（AI增强）
│   ├── 岗位列表（AI智能分析）
│   ├── 岗位详情（AI匹配度分析）
│   └── 状态管理与追踪
│
├── 2. 面试管理模块（AI增强）
│   ├── 面试安排记录
│   ├── 面试提醒
│   ├── AI面试准备清单
│   └── AI模拟面试
│
├── 3. 面经管理模块（基础功能）
│   ├── 面经录入
│   ├── 面经查询
│   ├── 面经收藏
│   └── 面经关联岗位
│
├── 4. 面试总结模块（AI增强）
│   ├── 关键词快速记录
│   ├── AI智能生成总结
│   ├── 总结模板
│   └── 总结管理与复用
│
├── 5. AI助手模块（核心AI功能）
│   ├── 智能对话
│   ├── 快速问题入口
│   ├── 简历优化建议
│   ├── 面试准备指导
│   └── 求职策略咨询
│
├── 6. 个人中心模块
│   ├── 用户信息管理
│   ├── 数据统计
│   ├── 收藏管理
│   └── 系统设置
│
└── 7. 消息提醒模块
    ├── 面试提醒
    ├── 状态过期提醒
    └── AI建议推送
```

### 2.2 AI功能增强点对比

| 功能模块 | 基础功能 | AI增强功能 |
|---------|---------|-----------|
| 岗位录入 | 手动填写表单 | AI智能解析JD，自动提取关键信息 |
| 岗位列表 | 筛选、搜索、状态管理 | AI智能分析面试数据，重点推荐 |
| 岗位详情 | 查看完整信息、进度时间线 | AI四维度匹配度分析（技能/经验/学历/薪资） |
| 面试准备 | 手动记录面试信息 | AI生成准备清单、AI模拟面试对话 |
| 面试总结 | 手动填写总结 | AI根据关键词智能生成结构化总结 |
| 通用功能 | 基础求职管理 | AI助手对话、简历优化、求职策略建议 |

## 三、详细功能设计

### 3.1 岗位管理模块

#### 3.1.1 岗位录入（AI增强）

**基础功能：**
- 必填字段：公司名称、岗位名称、投递渠道、投递日期
- 可选字段：工作地点、薪资范围、JD文本、简历版本、联系人、备注
- 快速录入模式 vs 完整录入模式
- 复制已有岗位信息
- JD拍照识别（OCR）

**AI增强功能：**
- **JD智能解析按钮**
  - 输入：JD文本或JD图片
  - AI提取：
    - 岗位职责（自动填充到备注）
    - 技能要求（自动提取并标签化）
    - 薪资范围（自动识别）
    - 工作地点（自动识别）
  - 减少70%手动输入时间

#### 3.1.2 岗位列表（AI增强）

**基础功能：**
- 卡片式布局展示
- 按投递日期倒序
- 状态筛选（待投递/已投递/面试中/已录用/已拒绝）
- 搜索（公司/岗位名称）
- 批量操作

**AI增强功能：**
- **AI智能分析卡片**（顶部显眼位置）
  - 统计分析：
    - 面试中的岗位数量
    - 本周投递/面试数据
  - 重点推荐：
    - 匹配度最高的岗位
    - 面试概率最大的岗位
    - 需要重点准备的岗位
  - 操作按钮：一键跳转准备/查看详情

#### 3.1.3 岗位详情（AI增强）

**基础功能：**
- 展示所有岗位信息
- 进度timeline
- 关联面经、总结
- 操作入口（编辑、删除、收藏）

**AI增强功能：**
- **AI岗位匹配度分析卡片**
  - 四维度评分：
    - 技能匹配度（0-100%）
    - 经验匹配度（0-100%）
    - 学历匹配度（0-100%）
    - 薪资匹配度（0-100%）
  - 总体匹配度计算
  - 优势分析（✅）
  - 改进建议（⚠️）
  - 详细分析按钮

### 3.2 面试管理模块

#### 3.2.1 面试记录与提醒

**基础功能：**
- 面试信息录入（时间、地点、形式、联系人）
- 面试倒计时
- 微信服务通知提醒
- 提醒时间自定义

#### 3.2.2 AI面试准备

**AI增强功能：**
- **AI智能准备清单**
  - 根据岗位JD自动生成
  - 包含：
    - 技术复习要点
    - 项目准备建议
    - 公司业务了解
    - 向面试官提问清单
  - 可交互勾选完成状态
  - 进度可视化

- **AI模拟面试**
  - 对话式模拟面试
  - AI扮演面试官
  - 针对岗位定制问题
  - 实时反馈与建议

### 3.3 面试总结模块

#### 3.3.1 总结录入（AI增强）

**基础功能：**
- 分模块引导填写
- 总结模板
- 关联岗位和面试轮次

**AI增强功能：**
- **AI智能生成总结**
  - 输入方式：
    - 关键词快速记录（如："Vue3响应式原理、diff算法、性能优化"）
    - 语音转文字快速记录
  - AI自动生成结构化总结：
    - 面试核心问题
    - 自身表现分析
    - 不足与改进方向
    - 重点考察内容
  - 一键生成，耗时<30秒

### 3.4 AI助手模块

#### 3.4.1 对话式AI助手

**核心功能：**
- **欢迎卡片**
  - 自我介绍
  - 快速入口（简历优化、面试准备、匹配分析）
  - 视觉：紫色渐变 + AI图标

- **快速问题入口**
  - 预设常见问题：
    - "如何准备XX岗位面试？"
    - "简历如何突出项目经验？"
    - "面试后如何跟进HR？"
    - "XX公司的面试流程是什么？"

- **智能对话**
  - 对话历史展示
  - 结构化回复（支持列表、按钮、链接）
  - 思考动画效果
  - 多轮对话支持

- **AI能力矩阵**
  | 能力类型 | 功能描述 | 触发场景 |
  |---------|---------|---------|
  | 简历优化 | 简历诊断、改进建议 | 用户上传简历/主动提问 |
  | 面试准备 | 准备清单、模拟面试 | 面试前3天触发/主动提问 |
  | 岗位分析 | 匹配度分析、优劣势 | 查看岗位详情时触发 |
  | 求职策略 | 投递策略、谈判技巧 | 主动提问/场景触发 |
  | 面经指导 | 面试经验总结 | 面试后触发/主动提问 |

## 四、页面结构设计

### 4.1 底部TabBar

```
┌─────────────────────────────────────────────────────┐
│  📋岗位   📅面试   📚面经   🤖AI助手   👤我的   │
└─────────────────────────────────────────────────────┘
```

- **岗位**: 岗位列表页（含AI智能分析卡片）
- **面试**: 面试列表页（含AI准备清单）
- **面经**: 面经管理页
- **AI助手**: AI对话页面（核心AI入口）
- **我的**: 个人中心

### 4.2 核心页面流程

```
首页（岗位列表）
├── 搜索栏 + 新增按钮
├── 状态筛选
├── AI智能分析卡片（顶部）
└── 岗位卡片列表
    └── 点击 → 岗位详情页
        ├── 基础信息
        ├── AI匹配度分析
        ├── 进度timeline
        └── 操作按钮
            ├── 添加面试 → 面试录入页
            │   ├── 基础信息
            │   └── AI准备清单按钮
            └── AI生成总结 → 总结生成页
                ├── 关键词输入
                └── AI生成结果

岗位录入页
├── 基础信息表单
├── JD输入区域
└── AI智能解析按钮（突出显示）

面试列表页
├── Tab切换（即将到来/已完成）
├── AI准备清单卡片（顶部）
└── 面试卡片列表
    └── 点击 → 面试详情
        └── AI准备清单 + 模拟面试入口

AI助手页（独立页面）
├── 欢迎卡片
├── 快速入口（3个）
├── 快速问题（3个）
├── 对话历史
└── 底部输入框
```

## 五、AI技术实现方案

### 5.1 AI能力需求

| AI功能 | 技术需求 | 优先级 |
|--------|---------|--------|
| JD智能解析 | NLP文本提取、实体识别 | P0 |
| 岗位匹配度分析 | 用户画像、岗位画像、相似度计算 | P0 |
| 准备清单生成 | 模板生成、知识库检索 | P1 |
| 模拟面试 | 对话式AI、上下文理解 | P1 |
| 总结生成 | 文本生成、结构化输出 | P1 |
| 智能问答 | 知识问答、建议生成 | P2 |

### 5.2 技术架构建议

**方案一：自建AI服务**
- 优势：数据可控、定制化强
- 劣势：开发成本高、维护复杂
- 适用：长期发展、数据安全要求高

**方案二：集成第三方AI API**
- 选项：
  - OpenAI API (GPT-4)
  - 百度文心一言API
  - 阿里通义千问API
  - 腾讯混元API
- 优势：快速上线、成本可控
- 劣势：数据需外传、定制化受限
- 适用：MVP阶段、快速验证

**方案三：混合方案（推荐）**
- 核心 AI 功能（JD解析、匹配度分析）：自建或定制AI服务
- 通用 AI 功能（对话、总结生成）：集成第三方API
- 优势：平衡成本与效果

### 5.3 数据流设计

```
用户输入数据
    ↓
数据预处理（清洗、结构化）
    ↓
AI模型处理
    ├── JD解析 → 提取实体
    ├── 匹配度分析 → 计算相似度
    ├── 清单生成 → 模板填充
    ├── 总结生成 → 文本生成
    └── 智能问答 → 知识检索
    ↓
结果后处理（格式化、优化）
    ↓
返回前端展示
```

## 六、视觉设计规范

### 6.1 色彩系统

**常规功能色彩：**
- 主色调：蓝色 #0369A1
- 次要色：#0EA5E9
- 强调色：橙色 #F97316
- 成功色：#10B981
- 警告色：#F59E0B
- 错误色：#EF4444

**AI功能专属色彩：**
- AI主题色：紫色渐变 #6366F1 → #8B5CF6
- AI卡片背景：#F5F3FF → #FAFAFF（浅紫渐变）
- AI边框：#8B5CF6
- AI文字：#6366F1

### 6.2 AI元素视觉特征

**渐变背景：**
```css
.ai-gradient {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
}
```

**微光动画：**
- 用于AI处理中的状态提示
- 增强科技感

**思考动画：**
- 三个跳动的圆点
- AI正在思考的视觉反馈

**卡片样式：**
- 左侧紫色边框（4px）
- 浅紫色背景渐变
- 圆角 12px-16px
- 轻微阴影

### 6.3 交互设计原则

- **一致性**: AI元素保持统一的紫色主题
- **识别性**: AI功能一眼可识别（渐变、图标、动画）
- **不干扰**: AI增强不影响基础功能使用
- **渐进增强**: 基础功能先行，AI增强可选

## 七、开发优先级与版本规划

### V1.0 - MVP版本（2-3个月）

**基础功能（P0）：**
- ✅ 用户登录（微信授权）
- ✅ 岗位录入/编辑/删除
- ✅ 状态管理与筛选
- ✅ 面试记录与提醒
- ✅ 面经录入与查看
- ✅ 面试总结（基础模板）

**AI功能（P0-P1）：**
- ✅ JD智能解析（核心AI功能）
- ✅ 岗位匹配度分析（四维度）
- ✅ AI助手对话（基础问答）

### V1.1 - 优化版本（1个月）

**AI功能增强：**
- ✅ AI准备清单生成
- ✅ AI智能生成总结
- ✅ AI智能分析卡片（首页）
- ✅ 面试模拟对话

### V2.0 - 拓展版本（2个月）

**功能拓展：**
- ✅ 简历管理（AI优化建议）
- ✅ 面经社区（AI推荐）
- ✅ Offer对比工具（AI辅助决策）
- ✅ 求职日历视图
- ✅ 数据统计可视化

## 八、技术栈建议

### 前端技术栈

**选项一：Taro + React（推荐）**
- 跨平台支持（微信小程序、H5、App）
- 组件化开发
- 生态成熟
- 适合团队熟悉React的场景

**选项二：uni-app + Vue**
- 跨平台支持
- Vue生态
- 学习曲线平缓
- 适合团队熟悉Vue的场景

### 后端技术栈

**选项一：云开发（推荐MVP）**
- 微信云开发
- 免运维
- 快速上线
- 成本低

**选项二：自建后端**
- Node.js + NestJS
- 数据库：MySQL + MongoDB
- 适合长期发展、定制化需求高

### AI技术选型

- **NLP处理**: jieba分词、BERT模型
- **对话AI**: 集成第三方API（GPT-4/文心一言）
- **推荐算法**: 协同过滤、内容相似度
- **知识库**: 向量数据库（Pinecone/Milvus）

## 九、数据模型设计

### 9.1 核心数据实体

```
User（用户）
├── userId
├── openid
├── nickname
├── avatar
└── createdAt

Job（岗位）
├── jobId
├── userId
├── companyName
├── positionName
├── jdText（JD原文）
├── jdParsed（AI解析结果）
│   ├── responsibilities
│   ├── skills[]
│   ├── salaryRange
│   └── location
├── status
├── applyChannel
├── applyDate
└── aiMatchScore（AI匹配度）

Interview（面试）
├── interviewId
├── jobId
├── round（轮次）
├── interviewTime
├── location
├── form（形式）
├── aiPrepList（AI准备清单）
└── createdAt

Experience（面经）
├── expId
├── jobId[]
├── content
├── isAnonymous
├── tags[]
└── createdAt

Summary（总结）
├── summaryId
├── interviewId
├── keywords
├── aiGenerated（AI生成内容）
├── manualEdited
└── createdAt

AIConversation（AI对话）
├── conversationId
├── userId
├── messages[]
├── context
└── createdAt
```

## 十、非功能性需求

### 10.1 性能要求

- 小程序启动时间 ≤ 3秒
- 页面切换时间 ≤ 1秒
- AI响应时间 ≤ 5秒（复杂分析）
- AI响应时间 ≤ 2秒（简单问答）
- 支持离线缓存核心数据

### 10.2 安全与隐私

- 用户数据加密存储
- AI处理数据脱敏
- 明确隐私政策
- 用户可控数据删除
- 符合《个人信息保护法》

### 10.3 可用性

- AI功能降级方案（AI服务不可用时，基础功能仍可用）
- 容错机制（AI解析失败时，回退到手动输入）
- 用户反馈渠道（AI结果不准确时，可手动修正）

## 十一、风险与应对

| 风险点 | 应对方案 |
|--------|---------|
| AI效果不达预期 | 分阶段上线，收集用户反馈，持续优化模型；提供手动修正功能 |
| AI成本过高 | 混合方案，核心功能自建，通用功能调用API；设置调用限额 |
| 用户不信任AI | 提供AI推理过程透明化；允许用户手动调整AI结果 |
| 数据安全风险 | 数据脱敏处理；明确隐私政策；通过安全认证 |
| 技术依赖过重 | AI作为增强功能，不影响基础流程；降级方案完善 |

## 十二、成功指标

### 12.1 产品指标

- DAU（日活）：≥ 1000（上线3个月）
- 留存率：次日留存 ≥ 40%，7日留存 ≥ 20%
- 岗位录入率：人均录入岗位数 ≥ 10个
- AI功能使用率：≥ 60%用户使用过AI功能

### 12.2 AI效果指标

- JD解析准确率：≥ 85%
- 岗位匹配度满意度：≥ 70%
- AI准备清单有用性：≥ 75%
- 面试总结生成满意度：≥ 70%

---

**文档版本**: V1.0
**更新时间**: 2025-01-17
**维护人**: 产品团队

---

# Web端架构设计

## 一、技术栈

### 前端框架
- **Vue 3**: 组合式API (Composition API)
- **Vite**: 构建工具
- **Vue Router 4**: 路由管理
- **Pinia**: 状态管理

### UI和样式
- **Tailwind CSS**: 实用优先的CSS框架
- **PostCSS**: CSS处理器
- **Autoprefixer**: CSS浏览器前缀自动补全
- **响应式设计**: 桌面端 + 移动端适配

### 富文本编辑器
- **Tiptap**: 基于 ProseMirror 的富文本编辑器
- **lowlight**: 代码语法高亮

### 其他依赖
- **@headlessui/vue**: 无样式UI组件
- **naive-ui**: Vue 3 组件库
- **crypto-js**: 加密库
- **node-fetch**: HTTP请求库

### 开发工具
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **Vite Plugin**: Vue支持、HTML重写

## 二、项目结构

```
web/
├── public/                      # 静态资源
├── src/
│   ├── main.js                  # 应用入口
│   ├── App.vue                  # 根组件
│   │
│   ├── router/                  # 路由配置
│   │   └── index.js            # 路由定义、守卫
│   │
│   ├── store/                   # Pinia状态管理
│   │   ├── auth.js             # 用户认证状态
│   │   ├── jobs.js             # 岗位数据状态
│   │   ├── interviews.js       # 面试数据状态
│   │   ├── experiences.js      # 面经数据状态
│   │   └── summaries.js        # 总结数据状态
│   │
│   ├── views/                   # 页面组件
│   │   ├── JobList.vue         # 岗位列表
│   │   ├── AddJob.vue          # 添加岗位
│   │   ├── JobDetail.vue       # 岗位详情
│   │   ├── Interviews.vue      # 面试记录
│   │   ├── Experiences.vue     # 面经管理
│   │   ├── AddExperience.vue   # 添加面经
│   │   ├── ExperienceDetail.vue # 面经详情
│   │   ├── Summaries.vue       # 面试总结
│   │   ├── AIAssistant.vue     # AI助手
│   │   ├── Profile.vue         # 个人中心
│   │   ├── Register.vue        # 用户注册
│   │   ├── Login.vue           # 用户登录
│   │   └── errors/             # 错误页面
│   │       ├── 404.vue
│   │       └── 500.vue
│   │
│   ├── components/              # 共享组件
│   │   ├── NavBar.vue          # 顶部导航栏
│   │   ├── BottomNav.vue       # 底部导航栏
│   │   ├── JobForm.vue         # 岗位表单组件
│   │   ├── TiptapEditor.vue    # 富文本编辑器
│   │   ├── StatusUpdateDialog.vue # 状态更新对话框
│   │   └── InterviewRecordDialog.vue # 面试记录对话框
│   │
│   ├── api/                     # API接口
│   │   ├── index.js            # API实例配置
│   │   ├── auth.js             # 认证接口
│   │   ├── jobs.js             # 岗位接口
│   │   ├── interviews.js       # 面试接口
│   │   ├── experiences.js      # 面经接口
│   │   ├── comments.js         # 评论接口
│   │   └── summaries.js        # 总结接口
│   │
│   ├── types/                   # TypeScript类型定义
│   ├── constants/               # 常量定义
│   └── utils/                   # 工具函数
│
├── index.html                   # HTML入口
├── package.json                 # 项目配置
├── vite.config.js              # Vite配置
├── tailwind.config.js          # Tailwind配置
└── postcss.config.js           # PostCSS配置
```

## 三、核心设计模式

### 3.1 路由设计

**路由守卫**:
- 检查用户登录状态
- 未登录自动重定向到登录页
- 保存原始目标路径,登录后跳转回原页面
- 动态设置页面标题

**路由结构**:
```
/ → 岗位列表(需认证)
/register → 用户注册(公开)
/login → 用户登录(公开)
/add-job → 添加岗位(需认证)
/job/:id → 岗位详情(需认证)
/interviews → 面试记录(需认证)
/experiences → 面经管理(需认证)
/add-experience → 添加面经(需认证)
/experience-detail → 面经详情(需认证)
/summaries → 面试总结(需认证)
/ai-assistant → AI助手(需认证)
/profile → 个人中心(需认证)
/404 → 404错误页
/500 → 500错误页
```

### 3.2 状态管理(Pinia)

**认证状态 (auth.js)**:
```javascript
{
  user: {},              // 用户信息
  token: '',             // JWT token
  isLoggedIn: false,     // 登录状态

  // Actions
  register(credentials),    // 注册
  login(credentials),       // 登录
  logout(),                // 登出
  fetchUserProfile(),      // 获取用户信息
  updateProfile(data),     // 更新用户信息
  changePassword(data)     // 修改密码
}
```

**岗位状态 (jobs.js)**:
```javascript
{
  jobs: [],              // 岗位列表
  currentFilter: 'all',  // 当前筛选状态

  // Actions
  fetchJobs(),           // 获取岗位列表
  addJob(job),           // 添加岗位
  updateJob(id, data),   // 更新岗位
  deleteJob(id),         // 删除岗位
  searchJobs(keyword),   // 搜索岗位
  filterJobs(status)     // 筛选岗位
}
```

**面经状态 (experiences.js)**:
```javascript
{
  experiences: [],       // 面经列表
  currentFilter: 'all',  // 当前筛选

  // Actions
  fetchExperiences(),      // 获取面经列表
  addExperience(exp),      // 添加面经
  updateExperience(id, data),
  deleteExperience(id),
  toggleFavorite(id),      // 收藏/取消收藏
  searchExperiences(keyword)
}
```

### 3.3 API设计

**API实例配置**:
```javascript
// api/index.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000
})

// 请求拦截器 - 自动添加token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Token过期,自动登出
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

**API模块化**:
- `api/auth.js` - 认证相关接口
- `api/jobs.js` - 岗位管理接口
- `api/interviews.js` - 面试管理接口
- `api/experiences.js` - 面经管理接口
- `api/comments.js` - 评论管理接口
- `api/summaries.js` - 总结管理接口

### 3.4 组件设计

**布局组件**:
- **NavBar.vue**: 顶部导航栏(桌面端显示)
- **BottomNav.vue**: 底部导航栏(移动端显示)
- 响应式切换: 移动端(<768px)显示底部导航,桌面端显示顶部导航

**共享组件**:
- **JobForm.vue**: 岗位表单组件(添加/编辑共用)
- **TiptapEditor.vue**: 富文本编辑器组件(支持Markdown、代码高亮)
- **StatusUpdateDialog.vue**: 状态更新对话框
- **InterviewRecordDialog.vue**: 面试记录对话框

### 3.5 样式系统

**Tailwind CSS配置**:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#0369A1',
        secondary: '#0EA5E9',
        ai: {
          primary: '#6366F1',
          secondary: '#8B5CF6'
        }
      }
    }
  },
  plugins: []
}
```

**玻璃卡片效果**:
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

**响应式断点**:
- 移动端: <768px
- 平板: 768px - 1024px
- 桌面: >1024px

## 四、数据流

### 4.1 用户认证流程

```
用户注册
  ↓
Register.vue (表单验证)
  ↓
auth API → POST /users/register
  ↓
后端创建用户并返回token
  ↓
存储到localStorage
  ↓
自动登录并跳转首页
```

### 4.2 数据获取流程

```
页面加载
  ↓
onMounted生命周期
  ↓
调用Pinia store的action
  ↓
store调用API模块
  ↓
API发送HTTP请求
  ↓
响应拦截器处理
  ↓
更新store状态
  ↓
组件自动响应更新
```

### 4.3 数据持久化

**LocalStorage**:
- token: JWT认证令牌
- user: 用户基本信息

**后端数据库**:
- 所有业务数据存储在后端PostgreSQL数据库
- 通过API进行CRUD操作

## 五、性能优化

### 5.1 路由懒加载
```javascript
const JobList = () => import('@/views/JobList.vue')
```

### 5.2 组件缓存
使用`<keep-alive>`缓存频繁切换的页面

### 5.3 防抖和节流
搜索输入使用防抖,减少API请求频率

### 5.4 虚拟滚动
长列表使用虚拟滚动(待实现)

---

# 后端API架构设计

## 一、技术栈

### 核心框架
- **Node.js**: 运行时环境
- **Express.js**: Web应用框架
- **TypeScript**: 类型安全的JavaScript超集

### 数据库
- **PostgreSQL**: 关系型数据库
- **Prisma ORM**: 类型安全的ORM

### 认证和安全
- **JWT**: JSON Web Token认证
- **bcrypt**: 密码加密
- **Helmet**: HTTP安全头
- **CORS**: 跨域资源共享
- **express-rate-limit**: 请求限流

### 日志和验证
- **Winston**: 日志系统
- **Joi**: 数据验证

### 开发工具
- **tsx**: TypeScript执行器
- **tsc**: TypeScript编译器
- **nodemon**: 文件监听(开发时)

## 二、项目结构

```
backend/
├── src/
│   ├── index.ts                 # 主入口文件
│   ├── app.ts                   # Express应用配置
│   │
│   ├── config/                  # 配置文件
│   │   └── database.ts         # 数据库配置
│   │
│   ├── routes/                  # 路由定义
│   │   ├── index.ts            # 路由入口
│   │   ├── user.routes.ts      # 用户路由
│   │   ├── position.routes.ts  # 岗位路由
│   │   ├── interview.routes.ts # 面试路由
│   │   ├── experience.routes.ts# 面经路由
│   │   ├── comment.routes.ts   # 评论路由
│   │   ├── summary.routes.ts   # 总结路由
│   │   └── ai.routes.ts        # AI功能路由
│   │
│   ├── controllers/             # 控制器(业务逻辑)
│   │   ├── user.controller.ts
│   │   ├── position.controller.ts
│   │   ├── interview.controller.ts
│   │   ├── experience.controller.ts
│   │   ├── comment.controller.ts
│   │   ├── summary.controller.ts
│   │   └── ai.controller.ts
│   │
│   ├── services/                # 服务层(复杂业务逻辑)
│   │   ├── auth.service.ts
│   │   ├── position.service.ts
│   │   └── ...
│   │
│   ├── middlewares/             # 中间件
│   │   ├── auth.middleware.ts  # 认证中间件
│   │   ├── error.middleware.ts # 错误处理中间件
│   │   └── validate.middleware.ts # 数据验证中间件
│   │
│   ├── types/                   # TypeScript类型定义
│   │   └── index.ts
│   │
│   ├── constants/               # 常量定义
│   │   └── index.ts
│   │
│   └── utils/                   # 工具函数
│       ├── logger.ts           # 日志工具
│       └── helpers.ts          # 辅助函数
│
├── prisma/
│   ├── schema.prisma           # 数据库模型定义
│   └── seed.ts                 # 种子数据
│
├── logs/                        # 日志文件
├── dist/                        # 编译输出
├── package.json
├── tsconfig.json               # TypeScript配置
└── .env                        # 环境变量
```

## 三、数据库设计

### 3.1 数据模型

**User(用户表)**:
```prisma
model User {
  id            String    @id @default(uuid())
  phone         String    @unique
  password      String    // bcrypt加密
  nickname      String
  avatar        String?
  bio           String?
  email         String?
  createTime    BigInt    @default(0)
  updateTime    BigInt    @default(0)

  // 关联关系
  positions        Position[]
  interviews       Interview[]
  experiences      Experience[]
  experienceComments ExperienceComment[]
  summaries        Summary[]
}
```

**Position(岗位表)**:
```prisma
model Position {
  id              String    @id @default(uuid())
  userId          String

  companyName     String
  positionName    String
  deliveryChannel String
  deliveryDate    BigInt
  workLocation    String?
  salaryRange     String?
  jobDescription  String?   @db.Text

  contactName     String?
  contactPhone    String?
  remarks         String?   @db.Text

  status          String    @default("pending")
  isCollected     Int       @default(0)

  createTime      BigInt    @default(0)
  updateTime      BigInt    @default(0)

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  interviews      Interview[]
  experiences     Experience[]
  summaries       Summary[]
}
```

**Interview(面试表)**:
```prisma
model Interview {
  id                String    @id @default(uuid())
  positionId        String
  userId            String

  interviewRound    String
  interviewTime     BigInt
  interviewLocation String
  interviewForm     String
  interviewerInfo   String?   @db.Text

  remarks           String?   @db.Text
  status            Int       @default(0)

  createTime        BigInt    @default(0)
  updateTime        BigInt    @default(0)

  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  position          Position  @relation(fields: [positionId], references: [id], onDelete: Cascade)
  summaries         Summary[]
}
```

**Experience(面经表)**:
```prisma
model Experience {
  id              String    @id @default(uuid())
  positionId      String?
  userId          String

  companyName     String
  positionName    String
  interviewRound  String
  interviewDate   BigInt

  content         String    @db.Text
  contentType     String    @default("markdown")

  tags            String[]  @default([])

  isFavorite      Int       @default(0)
  isAnonymous     Int       @default(0)

  views           Int       @default(0)
  comments        Int       @default(0)

  createTime      BigInt    @default(0)
  updateTime      BigInt    @default(0)

  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  position        Position?         @relation(fields: [positionId], references: [id], onDelete: SetNull)
  commentList     ExperienceComment[]
}
```

**ExperienceComment(评论表)**:
```prisma
model ExperienceComment {
  id             String    @id @default(uuid())
  experienceId   String
  userId         String

  parentId       String?
  replyToUserId  String?

  content        String    @db.Text

  likes          Int       @default(0)

  createTime     BigInt    @default(0)
  updateTime     BigInt    @default(0)

  user           User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  experience     Experience        @relation(fields: [experienceId], references: [id], onDelete: Cascade)
  replyToUser    User?             @relation("CommentReplies", fields: [replyToUserId], references: [id])
  parent         ExperienceComment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies        ExperienceComment[] @relation("CommentReplies")
}
```

**Summary(总结表)**:
```prisma
model Summary {
  id              String    @id @default(uuid())
  positionId      String?
  interviewId     String?
  userId          String

  companyName     String
  positionName    String
  interviewRound  String?

  content         Json      // 结构化数据
  round           String?
  date            BigInt?

  createTime      BigInt    @default(0)
  updateTime      BigInt    @default(0)

  user            User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  interview       Interview? @relation(fields: [interviewId], references: [id], onDelete: SetNull)
  position        Position?  @relation(fields: [positionId], references: [id], onDelete: SetNull)
}
```

### 3.2 索引设计

- **用户索引**: `userId` (所有业务表)
- **岗位索引**: `status`, `userId`
- **面试索引**: `interviewTime`, `positionId`
- **面经索引**: `interviewDate`, `createTime`, `isFavorite`

## 四、API设计

### 4.1 RESTful API规范

**基础URL**: `/api`

**认证方式**: JWT Bearer Token

**响应格式**:
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

**错误格式**:
```json
{
  "success": false,
  "error": "错误信息",
  "code": "ERROR_CODE"
}
```

### 4.2 API路由清单

**用户认证** (`/users`):
- `POST /users/register` - 用户注册
- `POST /users/login` - 用户登录
- `GET /users/profile` - 获取用户信息
- `PUT /users/profile` - 更新用户信息
- `POST /users/change-password` - 修改密码
- `POST /users/logout` - 用户登出

**岗位管理** (`/positions`):
- `GET /positions` - 获取岗位列表
- `GET /positions/:id` - 获取岗位详情
- `POST /positions` - 创建岗位
- `PUT /positions/:id` - 更新岗位
- `DELETE /positions/:id` - 删除岗位
- `GET /positions/search` - 搜索岗位

**面试管理** (`/interviews`):
- `GET /interviews` - 获取面试列表
- `GET /interviews/:id` - 获取面试详情
- `POST /interviews` - 创建面试
- `PUT /interviews/:id` - 更新面试
- `DELETE /interviews/:id` - 删除面试

**面经管理** (`/experiences`):
- `GET /experiences` - 获取面经列表
- `GET /experiences/:id` - 获取面经详情
- `POST /experiences` - 创建面经
- `PUT /experiences/:id` - 更新面经
- `DELETE /experiences/:id` - 删除面经
- `POST /experiences/:id/favorite` - 收藏/取消收藏
- `GET /experiences/search` - 搜索面经

**评论管理** (`/comments`):
- `GET /experiences/:id/comments` - 获取评论列表
- `POST /experiences/:id/comments` - 创建评论
- `PUT /comments/:id` - 更新评论
- `DELETE /comments/:id` - 删除评论
- `POST /comments/:id/like` - 点赞评论

**总结管理** (`/summaries`):
- `GET /summaries` - 获取总结列表
- `GET /summaries/:id` - 获取总结详情
- `POST /summaries` - 创建总结
- `PUT /summaries/:id` - 更新总结
- `DELETE /summaries/:id` - 删除总结

**AI功能** (`/ai`):
- `POST /ai/parse-jd` - JD智能解析
- `POST /ai/analyze-match` - 岗位匹配度分析
- `POST /ai/generate-prep-list` - 生成面试准备清单
- `POST /ai/generate-summary` - 生成面试总结

## 五、中间件设计

### 5.1 认证中间件

```typescript
// middlewares/auth.middleware.ts
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: '未提供认证令牌' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded

    next()
  } catch (error) {
    res.status(401).json({ error: '无效的认证令牌' })
  }
}
```

### 5.2 错误处理中间件

```typescript
// middlewares/error.middleware.ts
export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack)

  res.status(err.status || 500).json({
    success: false,
    error: err.message || '服务器内部错误',
    code: err.code || 'INTERNAL_SERVER_ERROR'
  })
}
```

### 5.3 数据验证中间件

```typescript
// middlewares/validate.middleware.ts
import Joi from 'joi'

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }

    next()
  }
}
```

## 六、安全设计

### 6.1 认证和授权

- **JWT**: 无状态认证机制
- **Token过期时间**: 7天
- **密码加密**: bcrypt加盐哈希
- **HTTPS**: 生产环境强制HTTPS

### 6.2 数据验证

- **输入验证**: 使用Joi进行schema验证
- **SQL注入防护**: Prisma ORM自动参数化查询
- **XSS防护**: 输入转义和CSP头

### 6.3 请求限流

```typescript
import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制100个请求
  message: '请求过于频繁,请稍后再试'
})
```

### 6.4 安全头

```typescript
import helmet from 'helmet'

app.use(helmet())
```

## 七、日志系统

### 7.1 Winston日志配置

```typescript
// utils/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export default logger
```

### 7.2 日志级别

- **error**: 错误日志
- **warn**: 警告日志
- **info**: 信息日志
- **debug**: 调试日志

## 八、部署架构

### 8.1 环境变量

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/job_tracker"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

### 8.2 部署方案

**开发环境**:
- 本地PostgreSQL数据库
- nodemon热重载
- tsx实时编译TypeScript

**生产环境**:
- Vercel部署
- Vercel Postgres数据库
- Prisma自动迁移
- Winston日志记录

### 8.3 数据库迁移

```bash
# 开发环境迁移
npx prisma migrate dev

# 生产环境迁移
npx prisma migrate deploy

# 生成Prisma Client
npx prisma generate
```

---

**文档版本**: V2.0
**更新时间**: 2025-01-30
**维护人**: 技术团队
