import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    redirect: '/workbench',
    meta: { hidden: true }
  },
  {
    path: '/workbench',
    component: MainLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/workbench/WorkbenchPage.vue'),
        meta: { title: '工作台', icon: 'workbench' }
      }
    ]
  },
  // 新增月卡管理
  {
    path: '/cardAdd',
    component: () => import('@/views/car/CarAdd.vue'),
    meta: { hidden: true }
  },
  // 添加企业管理
  {
    path: '/exterpriseAdd',
    component: () => import('@/views/park/AddEnterprise.vue')
  },
  {
    path: '/exterpriseDetail',
    component: () => import('@/views/park/EnterpriseDetail.vue')
  },
  {
    path: '/roleAdd',
    component: () => import('@/views/system/AddRole.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound.vue'),
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes
})
/** 重置路由 */
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}
export default router
