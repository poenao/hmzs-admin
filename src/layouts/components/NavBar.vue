<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { removeLocalToken } from "@/utils/auth";

const logout = () => {
  // 删除本地token
  removeLocalToken();
  // 清空store中的token
  const stroe = useUserStore();
  stroe.setToken("");
  // 跳转到登录页
  router.push("/login");
};

// 打开GitHub项目地址
const openGithub = () => {
  // 使用 window.open 打开新标签页
  window.open("https://github.com/poenao/hmzs-admin", "_blank");
};
</script>

<template>
  <div class="nav-bar">
    <!-- breadcrumb -->
    <div></div>
    <!-- dropdown -->
    <el-dropdown>
      <div class="user-wrapper">黑马管理员</div>
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
