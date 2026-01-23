import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'JobList',
    component: () => import('@/views/JobList.vue'),
    meta: {
      title: '岗位列表'
    }
  },
  {
    path: '/add-job',
    name: 'AddJob',
    component: () => import('@/views/AddJob.vue'),
    meta: {
      title: '新增岗位',
      hideBottomNav: true
    }
  },
  {
    path: '/job/:id',
    name: 'JobDetail',
    component: () => import('@/views/JobDetail.vue'),
    meta: {
      title: '岗位详情',
      hideBottomNav: true
    }
  },
  {
    path: '/interviews',
    name: 'Interviews',
    component: () => import('@/views/Interviews.vue'),
    meta: {
      title: '面经管理'
    }
  },
  {
    path: '/summaries',
    name: 'Summaries',
    component: () => import('@/views/Summaries.vue'),
    meta: {
      title: '面试总结'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      title: '个人中心'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      title: '用户注册',
      hideBottomNav: true,
      hideNavBar: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 求职追踪助手` : '求职追踪助手'
  next()
})

export default router
