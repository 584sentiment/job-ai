import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/',
    name: 'JobList',
    component: () => import('@/views/JobList.vue'),
    meta: {
      title: '岗位列表',
      requiresAuth: true
    }
  },
  {
    path: '/add-job',
    name: 'AddJob',
    component: () => import('@/views/AddJob.vue'),
    meta: {
      title: '新增岗位',
      hideBottomNav: false,
      requiresAuth: true
    }
  },
  {
    path: '/job/:id',
    name: 'JobDetail',
    component: () => import('@/views/JobDetail.vue'),
    meta: {
      title: '岗位详情',
      hideBottomNav: true,
      requiresAuth: true
    }
  },
  {
    path: '/interviews',
    name: 'Interviews',
    component: () => import('@/views/Interviews.vue'),
    meta: {
      title: '面经管理',
      requiresAuth: true
    }
  },
  {
    path: '/summaries',
    name: 'Summaries',
    component: () => import('@/views/Summaries.vue'),
    meta: {
      title: '面试总结',
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      title: '个人中心',
      requiresAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      title: '用户注册',
      hideBottomNav: true,
      hideNavBar: true,
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '用户登录',
      hideBottomNav: true,
      hideNavBar: true,
      requiresAuth: false
    }
  },
  // 500 错误页面
  {
    path: '/500',
    name: 'ServerError',
    component: () => import('@/views/errors/500.vue'),
    meta: {
      title: '服务器错误',
      hideNavBar: true,
      hideBottomNav: true
    }
  },
  // 404 错误页面
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/errors/404.vue'),
    meta: {
      title: '页面未找到',
      hideNavBar: true,
      hideBottomNav: true
    }
  },
  // 通配符路由，匹配所有未定义的路径
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  // 使用 Vite 的 BASE_URL 环境变量，支持 GitHub Pages 部署
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫 - 检查登录状态和设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 求职追踪助手` : '求职追踪助手'

  // 检查是否需要认证
  if (to.meta.requiresAuth !== false) {
    // 需要认证，检查登录状态
    const authStore = useAuthStore()

    // 如果未登录，重定向到登录页
    if (!authStore.isLoggedIn) {
      // 保存原始目标路径，登录后可以跳转回来
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  // 已登录或不需要认证，允许访问
  next()
})

export default router
