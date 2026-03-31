<script setup lang="ts">
import { getRoleDetailAPI, getRoleListAPI, getTreeListAPI } from '@/apis/system'
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

// 点击角色切换索引高亮
const handleRoleClick = (index: number) => {
  activeIndex.value = index
  // TODO 获取当前角色权限点
  const roleId = roleList.value[index].roleId
  // 获取当前角色权限点
  if (roleId !== undefined) {
    getRoleDetail(roleId)
  }
}
// TODO 获取权限和成员列表
const treeList = ref<RoleData[]>([])
const getTreeList = async () => {
  const res = await getTreeListAPI()
  treeList.value = res.data
  // 调用函数添加disabled属性
  geTreeDisabled(treeList.value)
}
// 4. 在数据对象中添加disabled
const geTreeDisabled = (data: RoleData[]) => {
  // 递归遍历数据对象添加disabled属性
  data.forEach(item => {
    item.disabled = true
    // 如果有子节点，继续递归
    if (item.children) {
      // 递归调用函数参数是子节点数组
      geTreeDisabled(item.children)
    }
  })
}
// 5. 获取当前角色权限点
const perms = ref<number[]>([]) // 存储当前角色权限点
const getRoleDetail = async (roleId: number) => {
  const res = await getRoleDetailAPI(roleId)
  perms.value = res.data.perms
  // 获取树组件实例，调用setCheckedKeys方法设置选中节点
  treeRef.value?.forEach((tree: any, index: any) => {
    tree.setCheckedKeys(res.data.perms[index]) // 设置选中节点，参数是权限点数组
  })
}
const treeRef = ref() // 获取树组件tree实例
const activeName = ref<'tree' | 'member'>('tree') // 左侧切换组件默认选中树组件
const handleTabClick = (val: any) => {
  activeName.value = val // 切换组件时更新activeName的值
}
onMounted(async () => {
  await getTreeList()
  await getRolesList()
  // 默认选中第一个角色
  if (roleList.value.length > 0) {
    // 设置默认选中索引为0
    activeIndex.value = 0
    // 获取第一个角色的权限点
    const roleId = roleList.value[0].roleId
    if (roleId !== undefined) {
      getRoleDetail(roleId)
    }
  }
})
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
      <!-- 左侧切换组件 -->
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleTabClick"
      >
        <!-- 权限树组件 -->
        <el-tab-pane label="功能权限" name="tree">
          <div class="tree-wrapper">
            <div class="tree-item" v-for="item in treeList" :key="item.id">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="treeRef"
                :data="item.children"
                :props="{ label: 'title' }"
                node-key="id"
                show-checkbox
                default-expand-all
                :check-strictly="true"
              />
            </div>
          </div>
        </el-tab-pane>
        <!-- 成员列表组件 -->
        <el-tab-pane label="成员列表(100)" name="member">
          <div class="user-wrapper">成员管理</div>
        </el-tab-pane>
      </el-tabs>
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
