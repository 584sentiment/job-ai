# 求职追踪助手

> 一款专为求职人员打造的求职管理工具，提供**微信小程序**和**Web端**双平台支持，聚焦"岗位记录-进度追踪-面经收集-面试总结"全流程求职管理，配备 AI 智能辅助功能。

## ✨ 功能特性

### 🎯 核心功能

- **岗位管理**
  - 快速录入岗位信息（公司、岗位、渠道、地点、薪资等）
  - JD 文本粘贴保存 + AI 智能解析
  - 投递状态管理（7种状态追踪）
  - 岗位搜索与多维度筛选
  - 岗位编辑与删除
  - AI 岗位匹配度分析（四维度评分：技能、经验、学历、薪资）

- **面试管理**
  - 添加面试安排（轮次、日期、时间、地点、形式、联系人）
  - AI 面试准备清单自动生成
  - 准备清单交互勾选与进度追踪
  - 面试记录功能
  - 面试状态管理（即将到来/已完成/已取消）
  - 面试倒计时提醒

- **面经管理**（开发中）
  - 面经录入与分类
  - 面经搜索与收藏
  - 面经与岗位关联

- **面试总结**（开发中）
  - 结构化总结记录
  - 关键词标签
  - 总结搜索与复用

- **AI 助手**
  - 智能对话咨询
  - 简历优化建议
  - 面试准备指导
  - 岗位分析服务

- **个人中心**
  - 用户信息管理
  - 数据统计展示
  - 内容管理入口

### 🤖 AI 功能亮点

- **JD 智能解析**：自动提取岗位职责、技能要求、薪资范围
- **岗位匹配度分析**：多维度评估岗位匹配度，提供优劣势分析
- **面试准备清单**：根据岗位和面试信息自动生成个性化准备清单
- **智能对话助手**：提供求职全流程咨询服务

## 🛠 技术栈

### 微信小程序端

- **前端框架**：原生微信小程序（WXML + WXSS + JavaScript）
- **数据存储**：微信小程序本地存储（wx.setStorage/wx.getStorage）
- **UI 设计**：双色系统设计（蓝色常规功能 + 紫色 AI 功能）
- **图标资源**：Lucide Icons（SVG → PNG）
- **开发模式**：纯前端开发，AI 功能为模拟响应

### Web 端

- **前端框架**：Vue 3 + Vite
- **状态管理**：Pinia
- **路由管理**：Vue Router 4
- **CSS 框架**：Tailwind CSS
- **开发模式**：SPA 单页应用，响应式设计
- **设计还原**：1:1 还原 HTML 原型设计

## 📁 项目结构

### 微信小程序端

```
miniprogram/
├── app.js                    # 小程序入口
├── app.json                  # 全局配置
├── app.wxss                  # 全局样式
├── sitemap.json              # 搜索配置
│
├── pages/                    # 页面目录
│   ├── index/                # 首页-岗位列表
│   ├── add-job/              # 添加岗位
│   ├── edit-job/             # 编辑岗位
│   ├── job-detail/           # 岗位详情
│   ├── interviews/           # 面试列表
│   ├── add-interview/        # 添加面试
│   ├── interview-detail/     # 面试详情
│   ├── experience/           # 面经管理（开发中）
│   ├── ai-assistant/         # AI助手
│   └── profile/              # 个人中心
│
├── components/               # 组件目录（待实现）
│   ├── job-card/
│   ├── filter-tags/
│   ├── status-badge/
│   └── ai-card/
│
├── utils/                    # 工具函数库
│   ├── storage.js            # 存储封装
│   ├── data-manager.js       # 数据管理
│   ├── ai-helper.js          # AI功能封装
│   ├── ai-mock.js            # AI模拟响应
│   └── format.js             # 格式化工具
│
├── styles/                   # 全局样式
│   └── variables.wxss        # CSS变量定义
│
└── assets/                   # 静态资源
    └── icons/                # 图标资源
```

### Web 端

```
web/
├── index.html                 # HTML入口
├── package.json              # 项目配置
├── vite.config.js           # Vite配置
├── tailwind.config.js       # Tailwind配置
├── postcss.config.js        # PostCSS配置
│
└── src/
    ├── main.js              # 应用入口
    ├── App.vue              # 根组件
    │
    ├── router/              # 路由配置
    │   └── index.js
    │
    ├── store/               # Pinia状态管理
    │   ├── jobs.js          # 岗位数据
    │   ├── interviews.js    # 面经数据
    │   └── summaries.js     # 总结数据
    │
    ├── views/               # 页面组件
    │   ├── JobList.vue      # 岗位列表
    │   ├── AddJob.vue       # 添加岗位
    │   ├── JobDetail.vue    # 岗位详情
    │   ├── Interviews.vue   # 面经管理
    │   ├── Summaries.vue    # 面试总结
    │   └── Profile.vue      # 个人中心
    │
    ├── components/          # 共享组件
    │   ├── NavBar.vue       # 顶部导航
    │   └── BottomNav.vue    # 底部导航
    │
    └── assets/              # 静态资源
        └── styles/
            └── main.css     # 全局样式

docs/                         # 项目文档
├── arch-design.md            # 架构设计文档
├── dev-progress.md           # 开发进度文档
└── bug-fix.md                # 问题修复日志

job-ui/                       # Web端HTML原型
├── index.html               # 岗位列表原型
├── add-job.html             # 添加岗位原型
├── job-detail.html          # 岗位详情原型
├── interviews.html          # 面经管理原型
├── summaries.html           # 面试总结原型
└── profile.html             # 个人中心原型
```

## 🚀 快速开始

### 环境要求

**微信小程序端**
- 微信开发者工具（最新版）
- Node.js 14+ （用于图标下载）
- npm 或 yarn

**Web 端**
- Node.js 16+
- npm 或 yarn
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装步骤

#### 方式一：运行微信小程序

1. **克隆项目**
```bash
git clone https://github.com/584sentiment/job-ai.git
cd job-ai
```

2. **安装图标下载依赖**（可选）
```bash
npm install sharp
```

3. **下载图标资源**（可选）
```bash
node scripts/download-icons.js
```

4. **打开项目**
   - 启动微信开发者工具
   - 选择"导入项目"
   - 选择项目目录：`job-ai/miniprogram`
   - 填写项目名称：求职追踪助手
   - 点击"导入"

#### 方式二：运行 Web 端

1. **克隆项目**
```bash
git clone https://github.com/584sentiment/job-ai.git
cd job-ai/web
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
   - 打开浏览器访问 http://localhost:3000
   - 即可在浏览器中使用应用

### 运行项目

**微信小程序**
在微信开发者工具中点击"编译"按钮即可在模拟器中预览。

**Web 端**
运行 `npm run dev` 后,访问 http://localhost:3000 即可。

### 真机调试

**微信小程序**
1. 在微信开发者工具中点击"预览"
2. 使用微信扫描二维码
3. 在手机微信中打开小程序

**Web 端**
1. 运行 `npm run build` 构建生产版本
2. 运行 `npm run preview` 预览构建结果
3. 或将 `dist` 目录部署到静态服务器

## 📊 开发进度

### ✅ 微信小程序端已完成（阶段一 + 阶段二）

**框架层**
- [x] 项目框架搭建
- [x] 全局样式系统（CSS 变量）
- [x] 工具函数库（5 个模块）
- [x] 本地存储封装

**岗位管理**
- [x] 岗位列表展示
- [x] 添加岗位功能
- [x] 岗位详情查看
- [x] 岗位编辑功能
- [x] 岗位删除功能
- [x] 搜索与筛选
- [x] 下拉刷新
- [x] 分页加载
- [x] AI 匹配度分析

**面试管理**
- [x] 面试列表展示（Tab 切换）
- [x] 添加面试功能
- [x] 面试详情页
- [x] AI 准备清单生成
- [x] 准备清单交互
- [x] 面试记录功能
- [x] 面试状态管理
- [x] 下拉刷新
- [x] 空状态优化

**AI 助手**
- [x] 对话界面
- [x] 欢迎卡片
- [x] 快速问题入口
- [x] 异步对话模拟

**个人中心**
- [x] 用户信息展示
- [x] 数据统计
- [x] 功能入口

### ✅ Web 端已完成

**核心功能**
- [x] Vue 3 + Vite 项目搭建
- [x] Vue Router 路由配置
- [x] Pinia 状态管理
- [x] Tailwind CSS 样式系统
- [x] 响应式布局设计

**岗位管理**
- [x] 岗位列表展示（支持搜索筛选）
- [x] 添加新岗位
- [x] 岗位详情查看
- [x] 岗位删除功能
- [x] 投递状态管理

**面经管理**
- [x] 面经列表展示
- [x] 搜索和筛选功能
- [x] 收藏/取消收藏
- [x] 面经详情查看

**面试总结**
- [x] 总结列表展示
- [x] 统计数据展示
- [x] 改进状态管理
- [x] 搜索和筛选功能

**个人中心**
- [x] 用户信息展示
- [x] 数据统计
- [x] 快捷入口
- [x] 功能菜单

**设计还原**
- [x] 1:1 还原 HTML 原型设计
- [x] 玻璃卡片效果
- [x] 平滑过渡动画
- [x] 移动端底部导航
- [x] 桌面端顶部导航

### ⏳ 开发中

**面经管理（小程序端）**
- [ ] 面经列表页
- [ ] 添加面经功能
- [ ] 面经详情页
- [ ] 搜索与筛选
- [ ] 收藏功能

**面试总结（小程序端）**
- [ ] 总结列表页
- [ ] 添加总结功能
- [ ] 总结详情页
- [ ] 标签系统

### 📋 待实现

- [ ] 组件系统重构（job-card、filter-tags、status-badge、ai-card）
- [ ] 面经与岗位关联
- [ ] 总结与面试关联
- [ ] 数据统计图表
- [ ] 用户信息编辑
- [ ] 系统设置
- [ ] 下拉刷新全页面覆盖
- [ ] 性能优化（虚拟列表、图片懒加载）
- [ ] 后端服务搭建
- [ ] 真实 AI API 接入
- [ ] Web 端数据持久化（localStorage/后端API）

## 🎨 页面展示

### 双色系统设计

- **常规功能（蓝色系）**：岗位管理、面试记录、面经收藏
- **AI 功能（紫色系）**：JD 解析、匹配度分析、准备清单、AI 助手

### 页面截图

> 待补充

## 📖 开发规范

### Git 提交规范

```
<类型>: <开发阶段>-<页面>/<功能>: <简要描述>
```

**示例**：
- `feat: 核心功能-岗位和面试管理模块完成`
- `fix: 阶段二-核心页/添加岗位/表单验证: 修复表单验证问题`
- `style: 阶段一-框架/通用/样式调整: 优化全局样式`

**Commit 类型**：
- `feat`: 新功能
- `fix`: Bug 修复
- `refactor`: 代码重构
- `style`: 样式调整
- `docs`: 文档更新
- `opt`: 优化

### 代码规范

- **变量命名**：驼峰命名法（`searchKeyword`）
- **函数命名**：驼峰命名法，动词开头（`loadJobs`）
- **文件命名**：短横线命名法（`edit-job/`）
- **组件命名**：短横线命名法（`job-card/`）

### 布局规范

1. **使用 scroll-view**：内容需要滚动时必须使用 `<scroll-view>` 并设置 `scroll-x` 或 `scroll-y`
2. **怪异盒模型**：所有容器开启 `box-sizing: border-box` 防止布局溢出
3. **全局设置**：
```css
* {
  box-sizing: border-box;
}
```

## 🔧 开发指南

### 数据管理

所有数据操作通过 `DataManager` 统一管理：

```javascript
const DataManager = require('../../utils/data-manager.js');

// 岗位操作
const jobs = DataManager.getJobs(filter);
const job = DataManager.getJobById(id);
DataManager.addJob(job);
DataManager.updateJob(id, updates);
DataManager.deleteJob(id);

// 面试操作
const interviews = DataManager.getInterviews();
DataManager.addInterview(interview);
DataManager.updateInterview(id, updates);
```

### AI 功能使用

```javascript
const AIHelper = require('../../utils/ai-helper.js');

// JD 智能解析（1.5秒延迟）
const result = await AIHelper.parseJD(jdText);

// 岗位匹配度分析（即时）
const matchScore = AIHelper.analyzeJob(job, userProfile);

// 面试准备清单生成（即时）
const prepList = AIHelper.generatePrepList(interview);

// AI 助手对话（1秒延迟）
const response = await AIHelper.chat(message);
```

### 样式变量

项目使用 CSS 变量统一管理样式：

```css
/* 常规功能 */
--primary-blue: #0369A1;
--secondary-blue: #0EA5E9;

/* AI 功能 */
--ai-primary: #6366F1;
--ai-secondary: #8B5CF6;
--ai-gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);

/* 状态标签 */
--status-pending-bg: #FEF3C7;      /* 待投递 */
--status-applied-bg: #DBEAFE;      /* 已投递 */
--status-interview-bg: #E0E7FF;    /* 面试中 */
--status-offered-bg: #D1FAE5;      /* 已录用 */
--status-rejected-bg: #FEE2E2;     /* 已拒绝 */
```

## 🤝 贡献指南

欢迎贡献代码、提出建议或报告问题！

### 贡献流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 开发建议

- 遵循项目的代码规范
- 添加必要的注释说明
- 确保代码经过测试
- 更新相关文档

## 📝 更新日志

### [2025-01-24] Web 端完成

**新增功能**
- ✅ 创建 Vue 3 + Vite + Tailwind CSS 项目
- ✅ 实现 6 个核心页面（岗位列表、添加岗位、详情、面经、总结、个人中心）
- ✅ Pinia 状态管理（岗位、面经、总结数据）
- ✅ 响应式设计（桌面端 + 移动端）
- ✅ 1:1 还原 HTML 原型设计

**技术实现**
- ✅ Vue Router 路由配置
- ✅ 组件化设计（NavBar、BottomNav）
- ✅ 实时搜索和筛选功能
- ✅ 收藏功能交互
- ✅ 统计数据展示

### [2025-01-18] 核心功能完成

**岗位管理模块**
- ✅ 岗位编辑功能
- ✅ 岗位删除功能
- ✅ 岗位列表优化（下拉刷新、分页加载、空状态）

**面试管理模块**
- ✅ 添加面试功能
- ✅ 面试详情页
- ✅ 面试列表优化

**技术实现**
- ✅ DataManager 扩展面试相关方法
- ✅ 创建 3 个新页面（edit-job、add-interview、interview-detail）
- ✅ 所有操作同步更新岗位 timeline

### [2025-01-17] 阶段二完成

- ✅ 首页-岗位列表
- ✅ 添加岗位页
- ✅ 岗位详情页
- ✅ 面试列表页
- ✅ AI 助手页
- ✅ 个人中心页

### [2025-01-16] 阶段一完成

- ✅ 项目框架搭建
- ✅ 全局样式系统
- ✅ 工具函数库
- ✅ 本地存储封装

---

## 📚 文档导航

### 快速开始
- **[文档索引](docs/INDEX.md)** - 📖 所有文档的分类索引
- **[CLAUDE.md](CLAUDE.md)** - 📖 项目开发指南（必读）

### 配置指南
- **[docs/QUICK_START.md](docs/QUICK_START.md)** - 快速开始
- **[docs/QUICK_START_LOCAL_DB.md](docs/QUICK_START_LOCAL_DB.md)** - 本地数据库配置
- **[docs/LOCAL_DB_SETUP_DONE.md](docs/LOCAL_DB_SETUP_DONE.md)** - 配置完成总结

### 项目文档
- **[docs/MONOREPO_SUMMARY.md](docs/MONOREPO_SUMMARY.md)** - Monorepo 优化总结
- **[docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md)** - 项目状态报告
- **[docs/TESTING_SUMMARY.md](docs/TESTING_SUMMARY.md)** - 测试总结

### 部署文档
- **[docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)** - 部署检查清单

### 脚本工具
- 所有脚本位于 **[scripts/](scripts/)** 目录
- **[scripts/setup-local-db.sh](scripts/setup-local-db.sh)** - 本地数据库配置
- **[scripts/test-backend.sh](scripts/test-backend.sh)** - 后端测试

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

**584sentiment**

- GitHub: [@584sentiment](https://github.com/584sentiment)

## 🙏 致谢

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Lucide Icons](https://lucide.dev/) - 图标资源

---

如果这个项目对您有帮助，请给它一个 ⭐️ Star！
