<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header
        :content="cardId ? '编辑月卡' : '增加月卡'"
        @back="$router.back()"
      />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form
            ref="formRef"
            :model="carInfoForm"
            :rules="carInfoRules"
            label-width="100px"
          >
            <el-form-item label="车主姓名" prop="personName">
              <el-input
                v-model="carInfoForm.personName"
                placeholder="请输入车主姓名"
              />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input
                v-model="carInfoForm.phoneNumber"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
            <el-form-item label="车牌号码" prop="carNumber">
              <el-input
                v-model="carInfoForm.carNumber"
                placeholder="请输入车牌号码"
              />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input
                v-model="carInfoForm.carBrand"
                placeholder="请输入车辆品牌"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form
            ref="feeFormRef"
            :model="feeForm"
            :rules="feeFormRules"
            label-width="100px"
          >
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="feeForm.payTime"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input
                v-model="feeForm.paymentAmount"
                placeholder="请输入支付金额"
                clearable
              />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select
                v-model="feeForm.paymentMethod"
                placeholder="请选择支付方式"
              >
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { addCardApi, getCardDetailAPI, updateCardApi } from '@/apis/card'
import router from '@/router'
import type { PaymentMethod, CardDetail } from '@/types/card'
import { ElMessage } from 'element-plus'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// ========== 修复1：路由参数类型安全处理 ==========
const route = useRoute()
// 用computed确保拿到的是string类型的id，过滤空值/数组
const cardId = computed(() => {
  const id = route.query.id
  return typeof id === 'string' ? id : undefined
})
// 存储接口返回的必填id字段，编辑时必须传给后端
const carInfoId = ref<number>()
const rechargeId = ref<number>()

// ========== 表单定义 ==========
const formRef = ref()
const feeFormRef = ref()

// 车辆信息表单
const carInfoForm = ref({
  personName: '',
  phoneNumber: '',
  carNumber: '',
  carBrand: ''
})

// 缴费信息表单
const feeForm = ref({
  payTime: [] as string[],
  paymentAmount: '',
  paymentMethod: ''
})

// ========== 校验规则 ==========
const carInfoRules = ref({
  personName: [
    { required: true, message: '请输入车主姓名', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '姓名长度应在 2 到 20 个字符之间',
      trigger: 'blur'
    },
    {
      pattern: /^[\u4e00-\u9fa5]{2,10}$/,
      message: '请输入正确的中文姓名',
      trigger: 'blur'
    }
  ],
  phoneNumber: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的11位手机号码',
      trigger: 'blur'
    }
  ],
  carNumber: [
    { required: true, message: '请输入车牌号码', trigger: 'blur' },
    {
      pattern:
        /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
      message: '请输入规范的中国大陆车牌号码',
      trigger: 'blur'
    }
  ],
  carBrand: [
    {
      required: true,
      message: '请输入/选择车辆品牌',
      trigger: ['blur', 'change']
    }
  ]
})

const feeFormRules = ref({
  payTime: [
    { required: true, message: '请选择完整的有效日期', trigger: 'change' },
    {
      validator: (rule: any, value: string[], callback: any) => {
        if (!value || value.length !== 2) {
          callback(new Error('请选择开始和结束日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  paymentAmount: [
    { required: true, message: '请输入支付金额', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: '请输入正确的金额，最多两位小数',
      trigger: 'blur'
    }
  ],
  paymentMethod: [
    { required: true, message: '请选择支付方式', trigger: 'change' }
  ]
})

// 支付方式列表
const payMethodList = [
  { id: 'Alipay', name: '支付宝' },
  { id: 'WeChat', name: '微信' },
  { id: 'Cash', name: '线下' }
]

// ========== 核心修复2：提交表单，完全匹配接口文档 ==========
const submitForm = async () => {
  if (!formRef.value || !feeFormRef.value) return

  try {
    // 表单校验
    await Promise.all([formRef.value.validate(), feeFormRef.value.validate()])

    // 通用参数构造，统一转成接口要求的类型
    const baseParams = {
      personName: carInfoForm.value.personName.trim(),
      phoneNumber: carInfoForm.value.phoneNumber.trim(),
      carNumber: carInfoForm.value.carNumber.trim().toUpperCase(),
      carBrand: carInfoForm.value.carBrand.trim(),
      cardStartDate: feeForm.value.payTime[0],
      cardEndDate: feeForm.value.payTime[1],
      paymentMethod: feeForm.value.paymentMethod as PaymentMethod,
      paymentAmount: Number(feeForm.value.paymentAmount) // 统一转数字，匹配接口要求
    }

    // ========== 修复3：正确判断编辑/新增逻辑 ==========
    if (cardId.value) {
      // 编辑模式：必须传入后端要求的必填字段
      if (!carInfoId.value || !rechargeId.value) {
        ElMessage.error('缺少车辆信息ID，无法编辑')
        return
      }

      const editParams = {
        ...baseParams,
        // 接口要求的必填ID字段，必须传入
        carInfoId: carInfoId.value,
        rechargeId: rechargeId.value
      }

      console.log('编辑提交参数：', editParams)
      const res = await updateCardApi(editParams as any )

      if (res.code === 10000) {
        ElMessage.success('月卡编辑成功')
        router.back()
      } else {
        ElMessage.error(res.message || '月卡编辑失败')
      }
    } else {
      // 新增模式
      console.log('新增提交参数：', baseParams)
      const res = await addCardApi(baseParams as any)

      if (res.code === 10000) {
        ElMessage.success('月卡添加成功')
        router.back()
      } else {
        ElMessage.error(res.message || '月卡添加失败')
      }
    }
  } catch (error) {
    console.warn('表单校验未通过，请检查红字提示', error)
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  feeFormRef.value?.resetFields()
}

// ========== 核心修复4：详情回显，给必填ID赋值 ==========
const getCardDetail = async () => {
  if (!cardId.value) return

  try {
    const res = await getCardDetailAPI(cardId.value)
    if (res.code === 10000) {
      const data: CardDetail = res.data

      // 车辆信息回显
      carInfoForm.value = {
        personName: data.personName,
        phoneNumber: data.phoneNumber,
        carNumber: data.carNumber,
        carBrand: data.carBrand
      }

      // 缴费信息回显
      feeForm.value = {
        payTime: [data.cardStartDate, data.cardEndDate],
        paymentAmount: data.paymentAmount.toString(),
        paymentMethod: data.paymentMethod
      }

      // 【关键修复】给编辑必填的ID字段赋值，提交时必须传给后端
      carInfoId.value = data.carInfoId
      rechargeId.value = data.rechargeId
    } else {
      ElMessage.error(res.message || '获取月卡详情失败')
    }
  } catch (error) {
    ElMessage.error('获取月卡详情异常')
    console.error('获取详情失败：', error)
  }
}

// 页面加载时，有ID就获取详情
onMounted(() => {
  if (cardId.value) {
    getCardDetail()
  }
})
// 删除月卡
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;
  padding-bottom: 80px;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      border-radius: 4px;
      margin-bottom: 20px;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
        font-weight: bold;
        border-bottom: 1px solid #f0f0f0;
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
    left: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  }
}
</style>
