// 权限控制
import router from '@/router'
import { getLocalToken } from './utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from './stores/user'
import { asyncRoutes } from './router/asyncRoutes'
import type { RouteRecordRaw } from 'vue-router'
import { useMenuStore } from './stores/menu'

// 处理后端返回的一级路由权限 数组
const getFirstRoutePerms = (perm: string[]) => {
  // 通过冒号分割权限字符串，获取一级路由
  const newArr = perm.map(item => {
    return item.split(':')[0]
  })
  // 使用 Set 数据结构去重
  return [...new Set(newArr)]
}

//拿到二级路由

const getSecondRoutePerms = (perm: string[]) => {
  // 通过冒号分割权限字符串，获取二级路由
  const newArr = perm.map(item => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  // 使用 Set 数据结构去重
  return [...new Set(newArr)]
}

// 过滤动态路由表
// ...existing code...

// 过滤动态路由表
const getRoutes = (
  firstRoutePerms: string[],
  secondRoutePerms: string[],
  routes: any[]
) => {
  // 如果是管理员
  if (firstRoutePerms.includes('*')) {
    return [...routes]
  }
  // 过滤一级路由
  const firstRoutes = routes.filter((route: RouteRecordRaw) => {
    return (
      route.meta?.permission && firstRoutePerms.includes(route.meta.permission)
    )
  })
  // 过滤最终路由
  const lastRoutes = firstRoutes.map((item: RouteRecordRaw) => {
    return {
      ...item,
      children: item.children?.filter((child: RouteRecordRaw) => {
        return (
          child.meta?.permission &&
          secondRoutePerms.includes(child.meta.permission)
        )
      })
    }
  })
  return lastRoutes
}

// ...existing code...
// 设置白名单
const whiteList = ['/login', '/404'] // 不重定向白名单
// 路由前置守卫
// 2. 路由全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 2.0 开启进度条
  NProgress.start()
  // 2.1 获取token
  const token = getLocalToken()
  // 2.2 判断是否有token
  if (token) {
    // 2.2.1 判断去的页面是否是登录页, 如果是则拦截到首页
    if (to.path === '/login') {
      next('/')
    } else {
      // 2.2.2 获取用户权限数据
      const store = useUserStore()
      if (!store.profile.id) {
        await store.getProfile()
        const res = store.profile || {}
        console.log(res, '2222')
        const menu = getFirstRoutePerms(res.permissions || [])
        console.log(menu)
        const sMenu = getSecondRoutePerms(res.permissions)
        console.log(sMenu)
        const perRoutes = getRoutes(menu, sMenu, asyncRoutes)
        // 4. 把动态路由表加入到路由系统中（当浏览器中访问路由的路径 显示渲染出来对应的组件）
        perRoutes.push({
          path: '/:pathMatch(.*)*',
          component: () => import('@/views/NotFound.vue'),
          meta: { hidden: true },
          children: []
        })
        perRoutes.forEach((route: any) => {
          router.addRoute(route)
        })
        // 5. 存入Pinia渲染左侧菜单
        const menuStore = useMenuStore()
        menuStore.setMenuList(perRoutes as any)
        next({ ...to })
      }
      next()
    }
  } else {
    // 2.2.2 判断是否在白名单
    if (!whiteList.includes(to.path)) {
      next('/login')
    } else {
      next()
    }
  }
})

// 路由后置守卫
router.afterEach(() => {
  NProgress.done() // 结束进度条
})
