import store from '@/store';
import { userStateType } from '@/store/modules/user';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

export let prefix = '';
if (window.__POWERED_BY_QIANKUN__) {
  prefix = '/vue3-cnode' // /vue3-cnode为主应用的activeRule
}

const routes: Array<RouteRecordRaw> = [
  {
    path: prefix + '/',
    name: 'index',
    component: () => import('@/views/index/index.vue')
  },
  {
    path: prefix + '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: prefix + '/detail',
    name: 'detail',
    component: () => import('@/views/detail/index.vue')
  },
  {
    path: prefix + '/add-topic',
    name: 'addTopic',
    meta: { requiredLogin: true },
    component: () => import('@/views/edit-topic/index.vue')
  },
  {
    path: prefix + '/edit-topic/:id',
    name: 'editTopic',
    meta: { requiredLogin: true },
    component: () => import('@/views/edit-topic/index.vue')
  },
  {
    path: prefix + '/message',
    name: 'message',
    meta: { requiredLogin: true },
    component: () => import('@/views/message/index.vue')
  },
  {
    path: prefix + '/collect',
    name: 'collect',
    meta: { requiredLogin: true },
    component: () => import('@/views/collect/index.vue')
  },
  {
    path: prefix + '/user/:userName',
    name: 'userDetail',
    meta: { requiredLogin: true },
    component: () => import('@/views/user-detail/index.vue')
  }
];

const router = createRouter({
  // 处理生产环境github上用的不是根目录的路由问题，history模式需要改项目nginx配置
  // history: createWebHistory(process.env.NODE_ENV === 'production' || window.__POWERED_BY_QIANKUN__ ? '/vue3-cnode' : process.env.BASE_URL),
  history: createWebHashHistory(process.env.NODE_ENV === 'production' || window.__POWERED_BY_QIANKUN__ ? '/vue3-cnode' : process.env.BASE_URL),
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
