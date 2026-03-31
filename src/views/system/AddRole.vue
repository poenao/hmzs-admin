<script setup lang="ts">
import { getTreeListAPI } from '@/apis/system'
import { ElMessage, type ElTree } from 'element-plus'
import { el } from 'element-plus/es/locales.mjs'
import { onMounted, ref } from 'vue'
const activeStep = ref<number>(0) //状态码
// 角色信息表单
const roleForm = ref({
  roleName: '', // 角色名称
  remark: '', // 角色描述
  permissions: [] as (string | number)[] // 角色权限
})
// 角色信息表单校验规则
const roleRules = ref({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
})
// 角色信息表单ref
const roleFormRef = ref()
//权限树ref
const treeRef = ref()
//上一步
const decreseStep = () => {
  if (activeStep.value === 0) return
  activeStep.value--
}
//下一步
const increaseStep = () => {
  if (activeStep.value === 2) return
  //第一步校验表单收集信息再下一步
  if (activeStep.value === 0) {
    roleFormRef.value.validate((valid: boolean) => {
      if (valid) {
        activeStep.value++
      }
    })
  } else if (activeStep.value === 1) {
    //收集权限树选中项
    //树实例获取树选中项的id数组
    treeRef.value.forEach((tree: InstanceType<typeof ElTree>) => {
      //遍历数据之前先清空权限数组，避免重复添加
      roleForm.value.permissions = []
      // 获取选中项的id数组 通过.getCheckedKeys()方法获取
      const checkedKeys = tree.getCheckedKeys()
      roleForm.value.permissions?.push(...checkedKeys)
      if (roleForm.value.permissions.flat().length === 0) {
        //如果没有选中任何权限，提示用户至少选择一个权限
        ElMessage.error('请至少选择一个权限')
      } else {
        activeStep.value++
      }
    })
  } else if (activeStep.value === 2) {
  }
}

// 权限树所有数据
const treeList = ref<any[]>([])
// 拿到权限树所有数据
const getTreeList = async () => {
  const { data } = await getTreeListAPI()
  treeList.value = data
}

onMounted(() => {
  getTreeList()
})
</script>

<template>
  <div class="add-role">
    <header class="add-header">
      <el-page-header content="添加角色" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="activeStep">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div class="form-container" v-show="activeStep === 0">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form
            ref="roleFormRef"
            class="form-box"
            :model="roleForm"
            :rules="roleRules"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述" prop="remark">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container" v-show="activeStep === 1">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div
              class="tree-item"
              v-for="(item, index) in treeList"
              :key="index"
            >
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="treeRef"
                :data="item.children"
                show-checkbox
                default-expand-all
                node-key="id"
                highlight-current
                :props="{ label: 'title' }"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="form-container" v-show="activeStep === 2">
        <div class="title">检查并完成</div>
        <div class="form">检查并完成内容</div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="decreseStep" v-if="activeStep > 0">上一步</el-button>
        <el-button @click="increaseStep" v-if="activeStep < 2" type="primary"
          >下一步</el-button
        >
        <el-button v-if="activeStep === 2" type="primary">确认添加</el-button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 30px;
    display: flex;

    .step-container {
      height: 400px;
      width: 200px;
    }

    .form-container {
      flex: 1;
      background-color: #fff;
      overflow-y: auto;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;
        }

        .info {
          font-size: 14px;
          color: #666;

          .form-item {
            margin-bottom: 20px;
          }
        }
      }

      .form-box {
        width: 600px;
        display: flex;
        flex-direction: column;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
    z-index: 10001;
  }

  .tree-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .tree-item {
      flex: 1;
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
}
</style>
