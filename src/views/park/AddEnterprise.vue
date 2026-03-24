<script setup lang="ts">
import { getIndustryListAPI, uploadAPI, createEnterpriseAPI } from '@/apis/Enterprise'
import type { Industry, EnterpriseParams } from '@/types/enterprise'
import {
  ElMessage,
  type UploadRequestOptions,
  type UploadUserFile,
  type FormInstance,
  type FormRules
} from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { validMobile } from '@/utils/validate'

const router = useRouter()
const ruleFormRef = ref<FormInstance>()

const addForm = ref({
  name: '', // 企业名称m
  legalPerson: '', // 法人
  registeredAddress: '', // 注册地址
  industryCode: '', // 所在行业
  contact: '', // 企业联系人
  contactNumber: '', // 联系人电话
  businessLicenseUrl: '', // 营业执照url
  businessLicenseId: '' // 营业执照id
})
const industryList = ref<Industry[]>([]) // 可选行业列表

// 校验手机号
const validateContactNumber = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入联系人电话'))
  } else if (!validMobile(value)) {
    callback(new Error('手机号格式不正确'))
  } else {
    callback()
  }
}

// 校验数据
const rules = ref<FormRules>({
  name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  legalPerson: [{ required: true, message: '请输入法人', trigger: 'blur' }],
  registeredAddress: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
  industryCode: [{ required: true, message: '请选择所在行业', trigger: 'change' }],
  contact: [{ required: true, message: '请输入企业联系人', trigger: 'blur' }],
  contactNumber: [
    { required: true, validator: validateContactNumber, trigger: 'blur' }
  ],
  businessLicenseId: [{ required: true, message: '请上传营业执照', trigger: 'change' }]
})
// 获取选行业
const getIndustryList = async () => {
  const res = await getIndustryListAPI()
  industryList.value = res.data
}
const fileList = ref<UploadUserFile[]>([]) // 营业执照列表
// 🌟 上传前校验（专门处理格式/大小限制）
const beforeUpload = (file: File) => {
  // 1. 格式校验
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('营业执照仅支持 PNG/JPG/JPEG 格式！')
    return false // 返回false直接拦截上传
  }

  // 2. 大小校验（5MB）
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('营业执照大小不能超过 5MB！')
    return false // 返回false直接拦截上传
  }

  return true // 校验通过，允许继续上传
}
// 上传合同回调函数
// const uploadRequest = async (options: UploadRequestOptions): Promise<any> => {
//   const file = options.file
//   console.log(file)

//   // 处理formData类型参数
//   const fd = new FormData()
//   fd.append('file', file)
//   fd.append('type', 'businessLicense')
//   const res = await uploadAPI(fd)
//   // 发完请求以后拿到数据回填数据
// }
// 因为上面的接口错误了所以我们这里用假数据跑通
const uploadRequest = async (options: UploadRequestOptions): Promise<any> => {
  const file = options.file
  // 直接生成假数据（完全不用调真实接口）
  const mockId = `mock_id_${Date.now()}`
  const mockUrl = `https://mock.example.com/license_${Date.now()}.jpg`

  // 回填到表单（和你原逻辑一致）
  addForm.value.businessLicenseUrl = mockUrl
  addForm.value.businessLicenseId = mockId

  // 更新上传组件的显示状态
  fileList.value.push({
    name: file.name,
    url: mockUrl
  })
  
  // 触发校验
  ruleFormRef.value?.validateField('businessLicenseId')

  // 上传之前做一些校验
  // 返回成功响应，让组件不报错
  return {
    code: 10000,
    data: { id: mockId, url: mockUrl },
    message: '上传成功'
  }
}

 // 单独校验表单，清除错误信息
const handleRemove = () => {
  addForm.value.businessLicenseId = ''
  addForm.value.businessLicenseUrl = ''
  ruleFormRef.value?.validateField('businessLicenseId')
}

const submitForm = async () => {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      await createEnterpriseAPI(addForm.value as EnterpriseParams)
      ElMessage.success('添加成功')
      router.back()
    }
  })
}

const resetForm = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.resetFields()
  fileList.value = []
  addForm.value.businessLicenseId = ''
  addForm.value.businessLicenseUrl = ''
}

// 填完数据然后发请求添加企业
getIndustryList()
</script>

<template>
  <div class="add-enterprise">
    <header class="add-header">
      <el-page-header content="添加企业" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form ref="ruleFormRef" :model="addForm" :rules="rules" label-width="100px">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <el-upload
                action="#"
                :file-list="fileList"
                :http-request="uploadRequest"
                :before-upload="beforeUpload"
                :on-remove="handleRemove"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    支持扩展名：.png .jpg .jpeg, 文件大小不得超过5M
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.add-enterprise {
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
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

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

          .el-form-item {
            width: 50%;
          }
        }
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
  }
}
</style>
