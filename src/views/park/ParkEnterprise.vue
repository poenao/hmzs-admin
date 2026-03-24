<template>
  <div class="building-container">
    <div class="search-container">
      <el-form inline>
        <el-form-item label="企业名称：">
          <el-input
            v-model="params.name"
            clearable
            placeholder="请输入内容"
            class="search-main"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="create-container">
      <el-button type="primary" @click="$router.push('/exterpriseAdd')"
        >添加企业</el-button
      >
    </div>

    <div class="table">
      <el-table :data="exterpriseList" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column
          align="center"
          prop="name"
          label="企业名称"
          min-width="250"
        />
        <el-table-column align="center" prop="contact" label="联系人" />
        <el-table-column align="center" prop="contactNumber" label="联系电话" />
        <el-table-column align="center" label="操作" width="350">
          <template #default="scope">
            <el-button link type="primary" @click="addContract(scope.row.id)"
              >添加合同</el-button
            >
            <el-button link type="primary">查看</el-button>
            <el-button link type="primary" @click="editEnterprise(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              link
              type="primary"
              @click="deleteEnterprise(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page-container" style="float: left">
      <el-pagination
        layout="total,prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </div>
  </div>
  <div>
    <!-- 关键修改：添加了 v-model="dialogVisible" -->
    <el-dialog v-model="dialogVisible" title="添加合同" width="580px">
      <!-- 表单区域：建议 div 写成闭合标签，虽然在 vue 模板中单标签有时不报错，但双标签更规范 -->
      <div class="form-container">
        <el-form
          label-position="top"
          :model="rentForm"
          :rules="rentRules"
        >
          <!-- 1. 租赁楼宇 -->
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select
              v-model="rentForm.buildingId"
              placeholder="请选择"
              style="width: 260px"
            >
              <el-option
                v-for="building in buildingList"
                :key="building.id"
                :label="building.name"
                :value="building.id"
              />
            </el-select>
          </el-form-item>

          <!-- 2. 租赁起止日期 -->
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 380px"
            />
          </el-form-item>

          <!-- 3. 租赁合同上传 -->
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              action="#"
              :auto-upload="false"
              accept=".doc,.docx,.pdf"
              :limit="1"
              :file-list="rentForm.contractUrl"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
            >
              <el-button plain class="upload-btn">上传合同文件</el-button>
              <template #tip>
                <div class="upload-tip">
                  支持扩展名：.doc .pdf，文件大小不超过5M
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <!-- 添加点击事件，点击取消时关闭弹窗 -->
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { getEnterpriseInfoApi, deleteEnterpriseAPI, getRentBuildListAPI, uploadAPI } from '@/apis/Enterprise'
import type { EnterpriseItem, EnterpriseQueryParams } from '@/types/enterprise'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage, type FormRules, type UploadFile } from 'element-plus'

const router = useRouter()
const params = ref<EnterpriseQueryParams>({
  name: '',
  page: 1,
  pageSize: 2
})
const total = ref(0)
const exterpriseList = ref<EnterpriseItem[]>([])

const getExterpriseList = async () => {
  const res = await getEnterpriseInfoApi(params.value)
  exterpriseList.value = res.data.rows
  total.value = res.data.total
}

const pageChange = (val: number) => {
  params.value.page = val
  getExterpriseList()
}

const doSearch = () => {
  params.value.page = 1
  getExterpriseList()
}

const editEnterprise = (id: number) => {
  router.push({
    path: '/exterpriseAdd',
    query: { id }
  })
}

const deleteEnterprise = (id: number) => {
  ElMessageBox.confirm('确认删除该企业吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await deleteEnterpriseAPI(id.toString())
      getExterpriseList()
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const buildingList = ref<{ id: string; name: string }[]>([])
const dialogVisible = ref(false)

const getBuildingList = async () => {
  try {
    const res = await getRentBuildListAPI()
    buildingList.value = res.data
  } catch (error) {
    ElMessage.error('获取楼宇列表失败')
  }
}

const addContract = (enterpriseId: number) => {
  dialogVisible.value = true
  getBuildingList()
  // 重置表单数据
  resetRentForm()
  rentForm.value.enterpriseId = enterpriseId
}

// 重置表单数据
const resetRentForm = () => {
  rentForm.value = {
    buildingId: undefined,
    contractId: undefined,
    contractUrl: [],
    contractName: '',
    enterpriseId: undefined,
    type: 0,
    rentTime: []
  }
}

const rentForm = ref({
  buildingId: undefined as string | undefined,
  contractId: undefined as string | undefined,
  contractUrl: [] as any[],
  contractName: '' as string, // 合同文件名
  enterpriseId: undefined as number | undefined,
  type: 0,
  rentTime: [] as string[]
})

// 定义单独的表单校验规则
const rentRules = ref<FormRules>({
  buildingId: [
    { required: true, message: '请选择租赁楼宇', trigger: 'change' }
  ],
  rentTime: [
    { required: true, message: '请选择租赁起止日期', trigger: 'change' }
  ],
  contractUrl: [
    { required: true, message: '请上传合同文件', trigger: 'change' }
  ]
})

// 处理文件选择 - 上传FormData格式的文件
const handleFileChange = async (file: UploadFile) => {
  // 前端文件校验
  const fileValidation = validateContractFile(file)
  if (!fileValidation.valid) {
    ElMessage.error(fileValidation.message)
    return
  }

  // 上传文件
  if (file.raw) {
    try {
      // 创建FormData对象
      const formData = new FormData()
      formData.append('file', file.raw)

      // 调用上传API
      const res = await uploadAPI(formData)

      // 保存返回的合同ID和URL
      rentForm.value.contractId = res.data.id
      rentForm.value.contractUrl = [file]
      rentForm.value.contractName = res.data.name || file.name || ''

      ElMessage.success('合同文件上传成功')
    } catch (error) {
      ElMessage.error('合同文件上传失败')
      // 移除失败的文件
      rentForm.value.contractUrl = []
      rentForm.value.contractId = undefined
    }
  }
}

// 单独的合同文件校验函数
const validateContractFile = (file: UploadFile) => {
  // 检查文件是否存在
  if (!file || !file.raw) {
    return { valid: false, message: '文件获取失败，请重新上传' }
  }

  // 检查文件大小（5M）
  const maxSize = 5 * 1024 * 1024
  if (file.raw.size > maxSize) {
    return { valid: false, message: '文件大小不超过5M' }
  }

  // 检查文件类型
  const allowedExtensions = ['doc', 'docx', 'pdf']
  const fileName = file.name || ''
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || ''

  if (!allowedExtensions.includes(fileExtension)) {
    return { valid: false, message: '仅支持上传 .doc .docx .pdf 文件' }
  }

  return { valid: true, message: '' }
}

const handleFileRemove = () => {
  rentForm.value.contractUrl = []
  rentForm.value.contractId = undefined
  rentForm.value.contractName = ''
}

// 2. 点击确定的处理逻辑
const handleConfirm = async () => {
  // 单独校验合同文件字段
  if (!rentForm.value.contractId) {
    ElMessage.error('请上传合同文件')
    return
  }

  if (!rentForm.value.buildingId) {
    ElMessage.error('请选择租赁楼宇')
    return
  }

  if (!rentForm.value.rentTime || rentForm.value.rentTime.length === 0) {
    ElMessage.error('请选择租赁起止日期')
    return
  }

  try {
    // 这里是你的提交逻辑，包含已上传的合同ID和URL
    console.log('提交的合同数据:', {
      buildingId: rentForm.value.buildingId,
      contractId: rentForm.value.contractId,
      contractName: rentForm.value.contractName,
      rentTime: rentForm.value.rentTime
    })

    ElMessage.success('合同添加成功')
    dialogVisible.value = false
    resetRentForm()
  } catch (error) {
    ElMessage.error('合同添加失败')
  }
}

getExterpriseList()
</script>

<style lang="scss" scoped>
.building-container {
  padding: 20px;
}

.search-container {
  // 使用 el-form-item 后，基本不需要自己写 flex 布局了
  border-bottom: 1px solid rgba(237, 237, 237, 0.9);
  margin-bottom: 15px;

  // 深度选择器微调 form 的间距
  :deep(.el-form-item) {
    margin-bottom: 15px;
  }
}

.create-container {
  margin: 10px 0;
}

.page-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end; // 代替 text-align: right，兼容性更好
}
</style>
