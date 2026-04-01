// 心思路：左侧的菜单应该和路由是同步的，使用的同一份数据，因为要动态变化渲染，所以可以通过Pinia进行维护
// 1. pinia新增一个模块，menu模块，先以静态的路由表作为初始值
// 2. 在得到过滤之后的动态路由表之后，和之前的静态做一个结合
// 3. 在组件中结合v-for指令做使用pinia中的数据做渲染

import { resetRouter, routes } from '@/router'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const useMenuStore = defineStore('hm-menu', () => {
  const menuList = ref<RouteRecordRaw[]>([...routes])
  const setMenuList = (filterRoutes: RouteRecordRaw[]) => {
    menuList.value = [...menuList.value, ...filterRoutes]
  }
  //路由重置和动态路由添加的区别在于，重置是把之前的动态路由清除掉，回到初始状态，而动态路由添加是把新的动态路由添加到之前的静态路由上
  const clearMenuList = () => {
    menuList.value = [...routes] // 回到初始状态，清除掉之前添加的动态路由
    resetRouter() // 重置路由，清除掉之前添加的动态路由
  }
  return { menuList, setMenuList, clearMenuList }
})
