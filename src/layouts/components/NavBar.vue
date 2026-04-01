<script setup lang="ts">
import router from '@/router'
import { useMenuStore } from '@/stores/menu'
import { useUserStore } from '@/stores/user' // Adjust the path to where Profile is defined
import type { Profile } from '@/types/user'
import { removeLocalToken } from '@/utils/auth'
import { ElMessageBox } from 'element-plus'

const logout = () => {
  // 退出提示
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // 确认退出
      // 删除本地token
      removeLocalToken()
      // 清空store中的token
      const stroe = useUserStore()
      const menuStore = useMenuStore()
      menuStore.clearMenuList()
      stroe.setToken('')
      // 清空store中的用户信息
      stroe.profile = {} as Profile
      // 跳转到登录页
      router.push('/login')
    })
    .catch(() => {
      // 取消退出
      ElMessageBox.close()
    })
}

// 打开GitHub项目地址
const openGithub = () => {
  // 使用 window.open 打开新标签页
  window.open('https://github.com/poenao/hmzs-admin', '_blank')
}
// 个人数据
const store = useUserStore()
</script>

<template>
  <div class="nav-bar">
    <!-- breadcrumb -->
    <div></div>
    <!-- dropdown -->
    <el-dropdown>
      <div class="user-wrapper">{{ store.profile.name }}</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>首页</el-dropdown-item>
          <el-dropdown-item @click="openGithub()">项目地址</el-dropdown-item>
          <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.nav-bar {
  height: 60px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .user-wrapper {
    outline: none;
    cursor: default;
    color: var(--el-color-black);
  }
}
</style>
