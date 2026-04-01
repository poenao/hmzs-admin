// 权限控制
import router from '@/router'
import { getLocalToken } from './utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from './stores/user'

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

// 设置白名单
const whiteList = ['/login', '/404'] // 不重定向白名单
// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  // 判断是否有 token
  const token = getLocalToken()
  // 如果有 token
  if (token) {
    // 如果有token 就放行
    NProgress.start() // 开始进度条
    // 获取用户信息
    const store = useUserStore()
    await store.getProfile()
    // 一级路由权限
    const res = getFirstRoutePerms(store.profile.permissions)
    console.log(res)
    // 二级路由权限
    const secondRes = getSecondRoutePerms(store.profile.permissions)
    console.log(secondRes)

    next()
  } else {
    // 没有 token判断是否在免登录的白名单中
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录的白名单中，直接进入
      NProgress.done() // 结束进度条
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面。
      NProgress.done() // 结束进度条
      next('/login')
    }
  }
})

// 路由后置守卫
router.afterEach(() => {
  NProgress.done() // 结束进度条
})
