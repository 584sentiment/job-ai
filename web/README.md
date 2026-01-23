# 求职追踪助手 Web端

基于 Vue 3 + Vite + Tailwind CSS 构建的求职追踪管理应用,1:1还原设计原型。

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 新一代前端构建工具
- **Vue Router** - Vue.js官方路由
- **Pinia** - Vue的状态管理库
- **Tailwind CSS** - 实用优先的CSS框架

## 项目结构

```
web/
├── index.html              # HTML入口文件
├── package.json            # 项目依赖配置
├── vite.config.js          # Vite配置
├── tailwind.config.js      # Tailwind配置
├── postcss.config.js       # PostCSS配置
└── src/
    ├── main.js             # 应用入口
    ├── App.vue             # 根组件
    ├── router/             # 路由配置
    │   └── index.js
    ├── store/              # Pinia状态管理
    │   ├── jobs.js         # 岗位数据store
    │   ├── interviews.js   # 面经数据store
    │   └── summaries.js    # 总结数据store
    ├── views/              # 页面组件
    │   ├── JobList.vue     # 岗位列表页
    │   ├── AddJob.vue      # 添加岗位页
    │   ├── JobDetail.vue   # 岗位详情页
    │   ├── Interviews.vue  # 面经管理页
    │   ├── Summaries.vue   # 面试总结页
    │   └── Profile.vue     # 个人中心页
    ├── components/         # 共享组件
    │   ├── NavBar.vue      # 顶部导航栏
    │   └── BottomNav.vue   # 底部导航栏
    └── assets/             # 静态资源
        └── styles/
            └── main.css     # 全局样式
```

## 功能特性

### 已实现功能

✅ **岗位管理**
- 岗位列表展示(支持搜索和筛选)
- 添加新岗位
- 岗位详情查看
- 岗位删除功能
- 投递状态管理

✅ **面经管理**
- 面经列表展示
- 搜索和筛选功能
- 收藏功能
- 面经详情查看

✅ **面试总结**
- 总结列表展示
- 统计数据展示
- 改进状态管理
- 搜索和筛选功能

✅ **个人中心**
- 用户信息展示
- 数据统计
- 快捷入口
- 功能菜单

### 设计特点

- 🎨 **1:1还原设计原型** - 完全按照HTML原型设计实现
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🚀 **现代化技术栈** - 使用Vue 3 Composition API
- 💾 **本地状态管理** - 使用Pinia进行状态管理
- 🎯 **TypeScript就绪** - 项目结构支持后续引入TypeScript

## 快速开始

### 安装依赖

```bash
cd web
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 即可查看应用

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 岗位列表 | 主页,展示所有岗位 |
| `/add-job` | 添加岗位 | 添加新的岗位记录 |
| `/job/:id` | 岗位详情 | 查看岗位详细信息 |
| `/interviews` | 面经管理 | 管理面试经验 |
| `/summaries` | 面试总结 | 管理面试总结 |
| `/profile` | 个人中心 | 个人信息中心 |

## 数据存储

当前版本使用Pinia进行内存状态管理,数据在刷新后会重置。如需持久化存储,可以:

1. 集成 `localStorage`/`sessionStorage`
2. 接入后端API
3. 使用本地数据库(如IndexedDB)

## 待开发功能

- [ ] 岗位编辑功能
- [ ] 添加面试功能
- [ ] 面经详情页
- [ ] 总结详情页
- [ ] 数据持久化
- [ ] 导出功能
- [ ] 深色模式
- [ ] 多语言支持

## 开发说明

### 添加新页面

1. 在 `src/views/` 创建新的Vue组件
2. 在 `src/router/index.js` 添加路由配置
3. 根据需要在导航栏中添加链接

### 修改样式

- 全局样式: 编辑 `src/assets/styles/main.css`
- 组件样式: 在组件中使用 `<style scoped>` 或Tailwind类名
- Tailwind配置: 编辑 `tailwind.config.js`

### 状态管理

- 所有状态存储在 `src/store/` 目录
- 使用Composition API风格定义store
- 通过 `useXxxStore()` 在组件中使用

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 联系方式

如有问题或建议,欢迎提Issue或PR。
