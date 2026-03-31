<script setup lang="ts">
import {
  createEmployeeAPI,
  delEmployeeAPI,
  getEmployeeListAPI
} from '@/apis/employee'
import { getRoleListAPI } from '@/apis/system'
import type { Employee, EmployeeParams } from '@/types/employee'
import type { Role } from '@/types/system'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'

//员工列表数据
const employeeList = ref<Employee[]>([])
// 请求参数
const params = ref<EmployeeParams>({
  page: 1,
  pageSize: 2,
  userName: ''
})
// 页码
const total = ref(0)
// 获取员工列表
const getEmployeeList = async () => {
  const res = await getEmployeeListAPI(params.value)
  employeeList.value = res.data.rows
  total.value = res.data.total
}
// 页码改变
const pageChange = (page: number) => {
  params.value.page = page
  getEmployeeList()
}
// 添加员工 准备弹框和表单项
const dialogVisible = ref(false) // 控制弹框打开关闭
const roleList = ref<Role[]>([]) // 角色列表
// 添加员工表单数据
const addForm = ref({
  name: '',
  phonenumber: '',
  roleId: '',
  status: 1,
  userName: ''
})
const addFormRules = ref({
  name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
  phonenumber: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  roleId: [{ required: true, message: '请分配角色', trigger: 'blur' }],
  status: [{ required: true, message: '请选择员工状态', trigger: 'blur' }]
})
// 关闭弹框 数据清空
const closeDialog = () => {
  dialogVisible.value = false
  addForm.value = {
    name: '',
    phonenumber: '',
    roleId: '',
    status: 1,
    userName: ''
  }
}
// 打开添加员工弹框
const addEmployee = async () => {
  dialogVisible.value = true
  // 获取角色列表接口
  const res = await getRoleListAPI()
  roleList.value = res.data
}
// 发请求添加员工
const addEmployeeRequest = async () => {
  const res = await createEmployeeAPI(addForm.value as any)
  if (res.code === 10000) {
    dialogVisible.value = false
    getEmployeeList()
    ElMessage.success('添加员工成功')
  }
}
// 删除员工
const deleteEmployee = async (id: string) => {
  ElMessageBox.confirm('确定要删除该员工吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 这里发请求删除员工接口
      const res = await delEmployeeAPI(id)
      if (res.code === 10000) {
        getEmployeeList()
      }
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

onMounted(() => {
  getEmployeeList()
})
</script>

<template>
  <div class="employee-container">
    <!-- 搜索区域 -->

    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="addEmployee">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column align="center" type="index" label="序号" width="100" />
        <el-table-column
          align="center"
          label="员工姓名"
          width="180"
          prop="name"
        />
        <el-table-column
          align="center"
          label="登录账号"
          width="180"
          prop="userName"
        />
        <el-table-column
          align="center"
          label="联系方式"
          width="120"
          prop="phonenumber"
        />
        <el-table-column
          align="center"
          label="角色"
          width="120"
          prop="roleName"
        />
        <el-table-column align="center" label="状态">
          <template #default="scope">
            <div
              :class="
                scope.row.status === 1 ? 'status-enabled' : 'status-disabled'
              "
            >
              {{ scope.row.status === 1 ? '启用' : '' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="添加时间" prop="createTime" />
        <el-table-column align="center" label="操作" fixed="right" width="220">
          <template #default="scope">
            <el-button size="small" link type="primary">编辑</el-button>
            <el-button
              size="small"
              link
              type="primary"
              @click="deleteEmployee(scope.row.id)"
              >删除</el-button
            >
            <el-button size="small" link type="primary">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :page-size="params.pageSize"
        :total="total"
        @current-change="pageChange"
      />
    </div>
    <!-- 添加员工 -->
    <el-dialog
      title="添加员工"
      width="480px"
      v-model="dialogVisible"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form
          ref="addFormRef"
          :model="addForm"
          :rules="addFormRules"
          label-width="80px"
        >
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="addForm.phonenumber" />
          </el-form-item>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId!"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :value="0">禁用</el-radio>
              <el-radio :value="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addEmployeeRequest"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}

.create-container {
  margin: 10px 0px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}
.status-enabled {
  color: #67c23a;
  font-weight: 400;
}

.status-disabled {
  color: #f56c6c;
  font-weight: 400;
}

.form-container {
  padding: 0px 80px;
}
</style>
