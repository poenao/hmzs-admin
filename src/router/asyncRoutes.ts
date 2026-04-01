import MainLayout from '@/layouts/MainLayout.vue'
import type { RouteRecordRaw } from 'vue-router'

// 1. 动态路由: 需要做权限控制 可以根据不同的权限 数量上的变化
// 2. 静态路由: 不需要做权限控制 每一个用户都可以看到 初始化的时候初始化一次

// 动态路由表
export const asyncRoutes: RouteRecordRaw[] = [
  {
    name: 'park',
    path: '/park',
    component: MainLayout,
    meta: {
      title: '园区管理',
      icon: 'park',
      permission: 'park'
    },
    children: [
      {
        name: 'building',
        path: 'building',
        meta: { title: '楼宇管理', permission: 'park:building' },
        component: () => import('@/views/park/ParkBuilding.vue')
      },
      {
        name: 'enterprise',
        path: 'enterprise',
        meta: { title: '企业管理', permission: 'park:enterprise' },
        component: () => import('@/views/park/ParkEnterprise.vue')
      }
    ]
  },
  {
    name: 'parking',
    path: '/parking',
    component: MainLayout,
    meta: { title: '行车管理', icon: 'car', permission: 'parking' },
    children: [
      {
        name: 'area',
        path: 'area',
        component: () => import('@/views/car/CarArea.vue'),
        meta: { title: '区域管理', permission: 'parking:area' }
      },
      {
        name: 'card',
        path: 'card',
        component: () => import('@/views/car/CarCard.vue'),
        meta: { title: '月卡管理', permission: 'parking:card' }
      },
      {
        name: 'pay',
        path: 'pay',
        component: () => import('@/views/car/CarPay.vue'),
        meta: { title: '停车缴费管理', permission: 'parking:payment' }
      },
      {
        name: 'rule',
        path: 'rule',
        component: () => import('@/views/car/CarRule.vue'),
        meta: { title: '计费规则管理', permission: 'parking:rule' }
      }
    ]
  },
  {
    name: 'propety',
    path: '/propety',
    component: MainLayout,
    meta: { permission: 'property', title: '物业费管理', icon: 'property' },
    children: [
      {
        name: 'cost',
        path: 'cost',
        component: () => import('@/views/property/PropertyPage.vue'),
        meta: {
          title: '物业费管理',
          icon: 'property',
          permission: 'property:propertyFee'
        }
      }
    ]
  },
  {
    name: 'pole',
    path: '/pole',
    component: MainLayout,
    meta: {
      title: '一体杆管理',
      icon: 'rod',
      permission: 'pole'
    },
    children: [
      {
        name: 'info',
        path: 'info',
        component: () => import('@/views/rod/RodManage.vue'),
        meta: { title: '一体杆管理', permission: 'pole:info' }
      },
      {
        name: 'waring',
        path: 'waring',
        component: () => import('@/views/rod/RodWarn.vue'),
        meta: { title: '告警记录', permission: 'pole:warning' }
      }
    ]
  },
  {
    name: 'sys',
    path: '/sys',
    component: MainLayout,
    meta: { title: '系统管理', icon: 'system', permission: 'sys' },
    children: [
      {
        name: 'role',
        path: 'role',
        component: () => import('@/views/system/SystemRole.vue'),
        meta: { title: '角色管理', permission: 'sys:role' }
      },
      {
        name: 'user',
        path: 'user',
        component: () => import('@/views/system/SystemEmployee.vue'),
        meta: { title: '员工管理', permission: 'sys:user' }
      }
    ]
  }
]
