# Web 端用户注册页面设计文档

**日期**: 2026-01-24
**设计者**: Claude Sonnet
**状态**: 已批准

## 1. 概述

### 1.1 目标
设计并实现符合当前项目风格的用户注册页面，提供简洁友好的注册体验。

### 1.2 技术栈
- Vue 3 (Composition API)
- Tailwind CSS
- Vue Router 4
- Pinia (状态管理)

### 1.3 设计原则
- 复用现有样式系统（玻璃卡片效果、颜色方案）
- 响应式设计（移动优先）
- 实时表单验证
- 用户友好的错误提示

---

## 2. 页面结构

### 2.1 布局设计
采用居中卡片式布局：

```
┌─────────────────────────────────────┐
│                                     │
│         创建账号                     │
│     开始使用求职追踪助手              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  glass-card 注册表单卡片        │ │
│  │                               │ │
│  │  昵称: [_____________]         │ │
│  │  手机号: [_____________]       │ │
│  │  密码: [_____________] [👁️]    │ │
│  │  确认密码: [_____________]     │ │
│  │  邮箱: [_____________] (可选)  │ │
│  │  [ ] 同意用户协议              │ │
│  │                               │ │
│  │  [     注册按钮        ]      │ │
│  │                               │ │
│  │  已有账号? 立即登录            │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### 2.2 布局特点
- 使用 `min-h-screen flex items-center justify-center` 实现垂直水平居中
- 最大宽度 `max-w-md`（约 448px）
- 响应式内边距 `px-4 py-12`
- 注册页独立显示（隐藏顶部和底部导航）

---

## 3. 表单字段

### 3.1 字段列表

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | text | 是 | 用户昵称 |
| phone | tel | 是 | 手机号码 |
| password | password | 是 | 登录密码（带显示/隐藏切换） |
| confirmPassword | password | 是 | 确认密码 |
| email | email | 否 | 邮箱地址 |
| agreeTerms | checkbox | 是 | 同意用户协议 |

### 3.2 字段顺序
1. 昵称（必填）
2. 手机号码（必填）
3. 密码（必填）
4. 确认密码（必填）
5. 邮箱（选填）
6. 用户协议（必填）

---

## 4. 表单验证

### 4.1 手机号码验证
- **正则表达式**: `/^1[3-9]\d{9}$/`
- **验证时机**: 失焦时（blur）和提交时
- **错误提示**: "请输入正确的手机号码"
- **唯一性**: 不验证（当前版本）

### 4.2 邮箱验证（选填）
- **正则表达式**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **验证时机**: 仅在填写时验证
- **错误提示**: "请输入正确的邮箱地址"
- **空值处理**: 允许为空

### 4.3 密码复杂度验证
- **正则表达式**: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/`
- **要求**:
  - 最小长度 6 位
  - 包含大写字母
  - 包含小写字母
  - 包含数字
  - 包含特殊字符 (@ $ ! % * ? &)
- **验证时机**: 实时验证
- **错误提示**: "密码必须包含大小写字母、数字和特殊字符"

### 4.4 确认密码验证
- **验证规则**: 必须与密码字段完全一致
- **验证时机**: 失焦时和提交时
- **错误提示**: "两次输入的密码不一致"

### 4.5 用户协议验证
- **验证规则**: 必须勾选
- **实现方式**: HTML required 属性

---

## 5. 样式系统

### 5.1 颜色方案
```css
--primary: #2563EB      /* 主色调 - 蓝色 */
--secondary: #3B82F6    /* 次要色 - 浅蓝色 */
--background: #F8FAFC   /* 背景色 - 浅灰色 */
--text: #1E293B         /* 文字颜色 - 深灰色 */
--border: #E2E8F0       /* 边框颜色 - 浅灰色 */
```

### 5.2 表单输入样式
```vue
<input
  class="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
/>
```

特点：
- 聚焦时显示蓝色外环（`focus:ring-2 focus:ring-primary/50`）
- 边框颜色过渡动画（200ms）
- 圆角 `rounded-lg`（8px）

### 5.3 玻璃卡片效果
```css
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid #E2E8F0;
}
```

---

## 6. 交互细节

### 6.1 密码显示/隐藏切换
- 使用 SVG 图标（eye/eye-off）
- 位于输入框右侧，绝对定位
- 点击切换 input type（text ↔ password）

### 6.2 密码强度指示器
实时显示密码强度，使用进度条和颜色区分：

| 强度 | 颜色 | 宽度 | 条件 |
|------|------|------|------|
| 弱 | bg-red-500 | 33% | 仅满足长度要求 |
| 中 | bg-yellow-500 | 66% | 满足 2-3 个条件 |
| 强 | bg-green-500 | 100% | 满足所有条件 |

### 6.3 按钮状态
- **默认**: 蓝色背景 `bg-primary`，悬停变 `bg-secondary`
- **Loading**: 半透明 `disabled:opacity-50`，显示"注册中..."
- **禁用**: `disabled:cursor-not-allowed`

### 6.4 错误提示
- 文字颜色：`text-red-500`
- 字体大小：`text-sm`
- 位置：对应输入框下方，`mt-1`

### 6.5 过渡动画
- 所有交互使用 `duration-200`（200ms）
- 悬停效果：颜色变化、阴影变化

---

## 7. 状态管理

### 7.1 Auth Store
创建 `/web/src/store/auth.js`：

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)
  const token = ref(null)

  // 从 localStorage 恢复状态
  function loadState() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      isLoggedIn.value = true
    }
  }

  // 注册并自动登录
  function register(userData) {
    user.value = {
      id: Date.now(),
      nickname: userData.nickname,
      phone: userData.phone,
      email: userData.email || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.phone}`
    }
    isLoggedIn.value = true
    token.value = 'mock-token-' + Date.now()
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('token', token.value)
  }

  // 登出
  function logout() {
    user.value = null
    isLoggedIn.value = false
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return { user, isLoggedIn, token, register, logout, loadState }
})
```

### 7.2 注册流程
```
用户填写表单
    ↓
实时验证
    ↓
点击注册按钮
    ↓
显示 loading
    ↓
调用 authStore.register()
    ↓
保存到 localStorage
    ↓
自动登录
    ↓
跳转到首页
```

### 7.3 数据持久化
- **用户信息**: `localStorage.user`
- **Token**: `localStorage.token`
- **恢复时机**: 应用启动时调用 `loadState()`

---

## 8. 路由配置

### 8.1 注册路由
在 `/web/src/router/index.js` 中添加：

```javascript
{
  path: '/register',
  name: 'Register',
  component: () => import('@/views/Register.vue'),
  meta: {
    title: '用户注册',
    hideBottomNav: true,    // 隐藏底部导航
    hideNavBar: true        // 隐藏顶部导航
  }
}
```

### 8.2 导航集成
在 `NavBar.vue` 添加"注册"入口（未登录时显示）：
- 位置：右侧，用户头像位置
- 样式：`px-4 py-2 text-primary hover:bg-primary/5 rounded-lg`
- 已登录时：显示用户头像

### 8.3 路由跳转
- **注册成功**: `router.push('/')` 跳转到首页
- **已有账号**: `<router-link to="/login">`（暂时链接到首页）

---

## 9. 文件清单

### 9.1 需要创建的文件
1. `/web/src/views/Register.vue` - 注册页面组件
2. `/web/src/store/auth.js` - 用户认证状态管理

### 9.2 需要修改的文件
1. `/web/src/router/index.js` - 添加注册路由
2. `/web/src/components/NavBar.vue` - 添加注册入口（可选）

---

## 10. 验证测试

### 10.1 功能测试
- [ ] 注册页面可以正常访问（`/register`）
- [ ] 所有表单字段可以正常输入
- [ ] 手机号码格式验证正常
- [ ] 邮箱格式验证正常（如果填写）
- [ ] 密码复杂度验证正常
- [ ] 确认密码一致性验证正常
- [ ] 用户协议必须勾选才能提交
- [ ] 密码显示/隐藏功能正常
- [ ] 密码强度指示器显示正常
- [ ] 注册按钮禁用状态正常（loading 时）
- [ ] 注册成功后自动登录
- [ ] 注册成功后跳转到首页

### 10.2 样式测试
- [ ] 响应式布局正常（移动端和桌面端）
- [ ] 颜色方案与现有页面一致
- [ ] 字体系统与现有页面一致
- [ ] 玻璃卡片效果正常
- [ ] 过渡动画流畅
- [ ] 错误提示显示正常
- [ ] 按钮悬停效果正常

### 10.3 兼容性测试
- [ ] Chrome 浏览器正常
- [ ] Firefox 浏览器正常
- [ ] Safari 浏览器正常
- [ ] 移动端浏览器正常

---

## 11. 后续扩展

### 11.1 接入真实后端 API
- 替换模拟注册逻辑
- 添加 token 管理
- 实现 JWT 验证

### 11.2 添加验证码功能
- 图形验证码
- 短信验证码
- 邮箱验证码

### 11.3 第三方登录
- 微信登录
- QQ 登录
- GitHub 登录

### 11.4 忘记密码功能
- 创建忘记密码页面
- 手机号/邮箱验证
- 重置密码流程

---

## 12. 附录

### 12.1 参考文档
- 项目架构设计: `/docs/arch-design.md`
- 开发进度文档: `/docs/dev-progress.md`
- Tailwind CSS 文档: https://tailwindcss.com/
- Vue Router 文档: https://router.vuejs.org/
- Pinia 文档: https://pinia.vuejs.org/

### 12.2 设计决策
- **为什么自动登录？**: 提供更好的用户体验，减少注册后的额外操作
- **为什么验证密码复杂度？**: 提高账户安全性，防止弱密码
- **为什么使用玻璃卡片？**: 与项目整体设计风格保持一致
- **为什么选填邮箱？**: 降低注册门槛，邮箱信息可以在后续补充

---

**文档版本**: 1.0
**最后更新**: 2026-01-24
