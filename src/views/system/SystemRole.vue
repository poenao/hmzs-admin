<script setup lang="ts">
import {
  delRoleUserAPI,
  getRoleDetailAPI,
  getRoleListAPI,
  getRoleUserAPI,
  getTreeListAPI
} from '@/apis/system'
import type { Role, RoleData, RoleUser } from '@/types/system'
import { onMounted, ref } from 'vue'
import user from '@/assets/user.svg'
import activeUser from '@/assets/user-active.svg'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// ======================== 角色列表模块 ========================

// 角色列表数据
const roleList = ref<Role[]>([])
// 当前选中角色的索引（用于高亮显示）
const activeIndex = ref<number | null>(null)

/**
 * 获取角色列表
 * 调用接口获取所有角色数据并赋值给 roleList
 */
const getRolesList = async () => {
  const res = await getRoleListAPI()
  roleList.value = res.data
}

/**
 * 点击角色项 - 切换高亮 & 加载对应权限和成员
 * @param index 当前点击的角色索引
 */
const handleRoleClick = (index: number) => {
  activeIndex.value = index
  const roleId = roleList.value[index].roleId
  if (roleId !== undefined) {
    getRoleDetail(roleId)
    getRoleUserList(roleId)
  }
}

// ======================== 权限树模块 ========================

// 权限树数据
const treeList = ref<RoleData[]>([])
// 树组件实例引用（多个树，所以是数组）
const treeRef = ref()

/**
 * 获取权限树列表
 * 获取后递归添加 disabled 属性，使树节点默认不可编辑
 */
const getTreeList = async () => {
  const res = await getTreeListAPI()
  treeList.value = res.data
  setTreeDisabled(treeList.value)
}

/**
 * 递归设置树节点 disabled 属性
 * 使所有节点默认处于禁用（不可编辑）状态
 * @param data 树节点数组
 */
const setTreeDisabled = (data: RoleData[]) => {
  data.forEach(item => {
    item.disabled = true
    if (item.children) {
      setTreeDisabled(item.children)
    }
  })
}

// 当前角色的权限点 ID 集合
const perms = ref<number[]>([])

/**
 * 获取当前角色的权限详情
 * 请求接口后，通过 setCheckedKeys 回显选中的权限节点
 * @param roleId 角色 ID
 */
const getRoleDetail = async (roleId: number) => {
  const res = await getRoleDetailAPI(roleId)
  perms.value = res.data.perms
  // 遍历每棵树，分别设置对应的选中节点
  treeRef.value?.forEach((tree: any, index: any) => {
    tree.setCheckedKeys(res.data.perms[index])
  })
}

// ======================== Tab 切换模块 ========================

// 当前激活的 Tab 页签（tree: 功能权限 | member: 成员列表）
const activeName = ref<'tree' | 'member'>('tree')

/**
 * Tab 页签切换回调
 * @param val 切换后的页签名称
 */
const handleTabClick = (val: any) => {
  activeName.value = val
}

// ======================== 角色成员模块 ========================

// 当前角色的成员列表
const RoleUserList = ref<RoleUser[]>([])

/**
 * 获取当前角色的成员列表
 * @param roleId 角色 ID
 */
const getRoleUserList = async (roleId: number) => {
  const res = await getRoleUserAPI(roleId)
  RoleUserList.value = res.data.rows
}

// ======================== 页面初始化 ========================

/**
 * 页面挂载时：
 * 1. 获取权限树数据
 * 2. 获取角色列表
 * 3. 默认选中第一个角色并加载其权限详情
 */
onMounted(async () => {
  await getTreeList()
  await getRolesList()
  // 默认选中第一个角色
  if (roleList.value.length > 0) {
    activeIndex.value = 0
    const roleId = roleList.value[0].roleId
    if (roleId !== undefined) {
      getRoleDetail(roleId)
      getRoleUserList(roleId)
    }
  }
})
//删除角色
const handleDeleteRole = (roleId: number) => {
  ElMessageBox.confirm('确认删除该角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await delRoleUserAPI(roleId.toString())
    if (res.code === 10000) {
      ElMessage.success('删除成功')
      // 重新获取角色列表
      await getRolesList()
    } else {
      ElMessage.error('删除失败')
    }
  })
}
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
          <el-dropdown>
            <span class="el-dropdown-link">
              <img src="@/assets/more.svg" class="icon" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  @click="$router.push(`/roleAdd?roleId=${item.roleId}`)"
                  >编辑角色</el-dropdown-item
                >
                <el-dropdown-item
                  @click="
                    item.roleId !== undefined && handleDeleteRole(item.roleId)
                  "
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="small" @click="$router.push('/roleAdd')"
        >添加角色</el-button
      >
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
        <el-tab-pane :label="`成员列表(${RoleUserList.length})`" name="member">
          <div class="user-wrapper">
            <el-table :data="RoleUserList">
              <el-table-column type="index" width="250" label="序号" />
              <el-table-column prop="name" label="员工姓名" />
              <el-table-column prop="userName" label="登录账号" />
            </el-table>
          </div>
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
