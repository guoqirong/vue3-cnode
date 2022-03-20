import store from '@/store';
import { userStateType } from '@/store/modules/user';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/detail/index.vue')
  },
  {
    path: '/message',
    name: 'message',
    meta: { requiredLogin: true },
    component: () => import('@/views/message/index.vue')
  },
  {
    path: '/collect',
    name: 'collect',
    meta: { requiredLogin: true },
    component: () => import('@/views/collect/index.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 路由守卫
router.beforeEach((to, _, next) => {
  if (to.name === 'login' && !!(store.state as { user: userStateType }).user.token) {
    next('/');
  } else if (to.meta.requiredLogin && !(store.state as { user: userStateType }).user.token) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
