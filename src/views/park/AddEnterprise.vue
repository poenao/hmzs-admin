<script setup lang="ts">
import {
  getIndustryListAPI,
  uploadAPI,
  createEnterpriseAPI,
  getEnterpriseDetailAPI,
  updateEnterpriseAPI
} from '@/apis/Enterprise';
import type { Industry, EnterpriseParams } from '@/types/enterprise';
import {
  ElMessage,
  type UploadRequestOptions,
  type UploadUserFile,
  type FormInstance,
  type FormRules
} from 'element-plus';
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { validMobile } from '@/utils/validate';

const router = useRouter();
const route = useRoute();
const ruleFormRef = ref<FormInstance>();

// 判断是编辑还是添加：检查 URL 参数中是否有 id
const enterpriseId = computed(() => route.query.id as string || '');
const isEdit = computed(() => !!enterpriseId.value);
const pageTitle = computed(() => (isEdit.value ? '编辑企业' : '添加企业'));

const addForm = ref({
  name: '',
  legalPerson: '',
  registeredAddress: '',
  industryCode: '',
  contact: '',
  contactNumber: '',
  businessLicenseUrl: '',
  businessLicenseId: ''
});
const industryList = ref<Industry[]>([]);

const validateContactNumber = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入联系人电话'));
  } else if (!validMobile(value)) {
    callback(new Error('手机号格式不正确'));
  } else {
    callback();
  }
};

const rules = ref<FormRules>({
  name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  legalPerson: [{ required: true, message: '请输入法人', trigger: 'blur' }],
  registeredAddress: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
  industryCode: [{ required: true, message: '请选择所在行业', trigger: 'change' }],
  contact: [{ required: true, message: '请输入企业联系人', trigger: 'blur' }],
  contactNumber: [{ required: true, validator: validateContactNumber, trigger: 'blur' }],
  businessLicenseId: [{ required: true, message: '请上传营业执照', trigger: 'change' }]
});

const getIndustryList = async () => {
  const res = await getIndustryListAPI();
  industryList.value = res.data;
};

const getEnterpriseDetail = async () => {
  try {
    const res = await getEnterpriseDetailAPI(enterpriseId.value);
    const detail = res.data;
    addForm.value = {
      name: detail.name,
      legalPerson: detail.legalPerson,
      registeredAddress: detail.registeredAddress,
      industryCode: detail.industryCode,
      contact: detail.contact,
      contactNumber: detail.contactNumber,
      businessLicenseUrl: detail.businessLicenseUrl,
      businessLicenseId: detail.businessLicenseId
    };
    if (detail.businessLicenseUrl) {
      fileList.value = [
        {
          name: '营业执照',
          url: detail.businessLicenseUrl
        }
      ];
    }
  } catch (error) {
    ElMessage.error('获取企业详情失败');
  }
};

const fileList = ref<UploadUserFile[]>([]);

const beforeUpload = (file: File) => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('营业执照仅支持 PNG/JPG/JPEG 格式！');
    return false;
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    ElMessage.error('营业执照大小不能超过 5MB！');
    return false;
  }

  return true;
};

const uploadRequest = async (options: UploadRequestOptions): Promise<any> => {
  const file = options.file;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('type', 'businessLicense');
  const res = await uploadAPI(fd);
  addForm.value.businessLicenseUrl = res.data.url || '';
  addForm.value.businessLicenseId = String(res.data.uid || '');
  fileList.value.push({
    name: file.name,
    url: res.data.url
  });
};

const handleRemove = () => {
  addForm.value.businessLicenseId = '';
  addForm.value.businessLicenseUrl = '';
  ruleFormRef.value?.validateField('businessLicenseId');
};

const submitForm = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const submitData: EnterpriseParams = {
          ...addForm.value
        };
        if (isEdit.value) {
          submitData.id = enterpriseId.value;
          await updateEnterpriseAPI(submitData);
          ElMessage.success('编辑成功');
        } else {
          await createEnterpriseAPI(submitData);
          ElMessage.success('添加成功');
        }
        router.back();
      } catch (error) {
        ElMessage.error(isEdit.value ? '编辑失败' : '添加失败');
      }
    }
  });
};

const resetForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();
  fileList.value = [];
  addForm.value.businessLicenseId = '';
  addForm.value.businessLicenseUrl = '';
};

onMounted(async () => {
  await getIndustryList();
  if (isEdit.value) {
    await getEnterpriseDetail();
  }
});
</script>

<template>
  <div class="add-enterprise">
    <header class="add-header">
      <el-page-header :content="pageTitle" @back="$router.back()" />
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
