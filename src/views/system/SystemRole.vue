<script setup lang="ts">
import { getRoleListAPI, getTreeListAPI } from '@/apis/system'
import type { Role, RoleData } from '@/types/system'
import { onMounted, ref } from 'vue'
import user from '@/assets/user.svg'
import activeUser from '@/assets/user-active.svg'
const roleList = ref<Role[]>([])
// 索引高亮标记
const activeIndex = ref<number | null>(null)
// 角色列表
const getRolesList = async () => {
  // TODO 获取角色列表
  const res = await getRoleListAPI()
  roleList.value = res.data
}
getRolesList()

// 点击角色切换索引高亮
const handleRoleClick = (index: number) => {
  activeIndex.value = index
}
// TODO 获取权限和成员列表
const treeList = ref<RoleData[]>([])
const getTreeList = async () => {
  const res = await getTreeListAPI()
  treeList.value = res.data
}
getTreeList()
</script>

<template>
  <div class="role-container">
    <!-- 左侧 -->
    <div class="left-wrapper">
      <div
        class="role-item"
        v-for="(item, index) in roleList"
        :key="item.roleId"
        @click="handleRoleClick(index)"
        :class="{ active: activeIndex === index }"
      >
        <div class="role-info">
          <img :src="activeIndex === index ? activeUser : user" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <img src="@/assets/more.svg" class="icon" />
        </div>
      </div>
      <el-button class="addBtn" size="small">添加角色</el-button>
    </div>
    <!-- 右侧权限和成员 -->
    <div class="right-wrapper">
      <div class="tree-wrapper">
        <div class="tree-item" v-for="item in treeList" :key="item.id">
          <div class="tree-title">{{ item.title }}</div>
          <el-tree
            :data="item.children"
            :props="{ label: 'title' }"
            node-key="id"
            show-checkbox
            default-expand-all
            :check-strictly="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;

  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
        width: 20px;
      }
    }

    .more {
      display: flex;
      align-items: center;
      .icon {
        width: 15px;
      }
    }

    .addBtn {
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;

        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper {
      padding: 20px;
    }
  }
}
</style>
