<script setup lang="ts">
import { computed } from 'vue'
import {  useRoute } from 'vue-router'
import SliderBarItem from './SliderBarItem.vue'
import { useMenuStore } from '@/stores/menu'

const route = useRoute()
const defaultActive = computed(() => {
  return route.meta.activePath ? route.meta.activePath : route.path
})

const store = useMenuStore()
// 为什么这个地方要用计算属性?
// 有缓存, 计算属性依赖的数据发生变化, 计算属性会重新计算
const routes = computed(() => {
  // return router.options.routes // 路由规则数组
  return store.menuList
})
</script>

<template>
  <div class="slider-bar">
    <div class="logo"></div>
    <el-scrollbar>
      <el-menu :default-active="defaultActive" router style="border: none">
        <!-- 菜单中的每一项 -->
        <SliderBarItem
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.slider-bar {
  .logo {
    height: 60px;
    background: #fff url('@/assets/hmzs-logo.png') no-repeat center / contain;
  }
  :deep(.el-menu-item.is-active) {
    background-color: var(--el-menu-hover-bg-color);
  }
  :deep(.el-menu-item:not(.is-active)) {
    &:hover {
      background-color: #fff !important;
      color: var(--el-color-primary);
    }
  }
  :deep(.el-sub-menu__title) {
    &:hover {
      background-color: #fff !important;
      color: var(--el-color-primary);
    }
  }
}
</style>
