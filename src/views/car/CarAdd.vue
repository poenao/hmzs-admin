<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header content="增加月卡" @back="$router.back()" />
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
import { addCardApi } from '@/apis/card'
import router from '@/router'
import type { PaymentMethod } from '@/types/card'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

// 1. 添加月卡
// 车辆信息表单
const formRef = ref() // 用于获取表单实例
const carInfoForm = ref({
  personName: '', // 车主姓名
  phoneNumber: '', // 联系方式
  carNumber: '', // 车牌号码
  carBrand: '' // 车辆品牌
})
// 车辆信息校验
const carInfoRules = ref({
  personName: [
    { required: true, message: '请输入车主姓名', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '姓名长度应在 2 到 20 个字符之间',
      trigger: 'blur'
    },
    // 如果你需要严格限制只能输入中文，可以解除下面这行的注释：
    {
      pattern: /^[\u4e00-\u9fa5]{2,10}$/,
      message: '请输入正确的中文姓名',
      trigger: 'blur'
    }
  ],
  phoneNumber: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/, // 匹配1开头的11位大陆手机号
      message: '请输入正确的11位手机号码',
      trigger: 'blur'
    }
  ],
  carNumber: [
    { required: true, message: '请输入车牌号码', trigger: 'blur' },
    {
      // 该正则同时兼容普通蓝牌（如 粤B12345）、新能源绿牌（如 粤BA12345）以及挂学警等特殊车牌
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
// 最近一此缴费月卡信息表单
const feeFormRef = ref()
const feeForm = ref({
  payTime: [] as string[], // 支付时间
  paymentAmount: '', // 支付金额
  paymentMethod: '' // 支付方式
})
// 缴费规则
const feeFormRules = ref({
  payTime: [
    {
      required: true,
      message: '请选择支付时间'
    }
  ],
  paymentAmount: [
    {
      required: true,
      message: '请输入支付金额',
      trigger: 'blur'
    }
  ],
  paymentMethod: [
    {
      required: true,
      message: '请选择支付方式',
      trigger: 'change'
    }
  ]
})
// 支付方式列表
const payMethodList = [
  {
    id: 'Alipay',
    name: '支付宝'
  },
  {
    id: 'WeChat',
    name: '微信'
  },
  {
    id: 'Cash',
    name: '线下'
  }
]
// 提交表单
const submitForm = async () => {
  // 确保两个表单实例都已挂载
  if (!formRef.value || !feeFormRef.value) return
  // 同时验证两个表单
  try {
    // 使用 Promise.all 来同时验证两个表单
    await Promise.all([formRef.value.validate(), feeFormRef.value.validate()])
    // 如果验证通过，执行提交逻辑
    console.log('车辆信息表单数据:', carInfoForm.value)
    console.log('缴费信息表单数据:', feeForm.value)
    // 这里可以调用API接口提交数据
    // 1. 将 payTime 数组[开始日期, 结束日期] 解构为两个单独的变量
    const payload = {
      paymentAmount: feeForm.value.paymentAmount,
      // 校验通过后一定有值，加类型断言告诉TS
      paymentMethod: feeForm.value.paymentMethod as PaymentMethod,
      personName: carInfoForm.value.personName,
      phoneNumber: carInfoForm.value.phoneNumber,
      carNumber: carInfoForm.value.carNumber,
      carBrand: carInfoForm.value.carBrand,
      cardStartDate: feeForm.value.payTime[0],
      cardEndDate: feeForm.value.payTime[1]
    }
    const res = await addCardApi(payload)
    if (res.code === 10000) {
      ElMessage.success('月卡添加成功')
      // 可以选择跳转回之前列表页
      router.back()
    } else {
      ElMessage.error(res.message || '月卡添加失败')
    }
  } catch (error) {
    // 只要有任意一个表单校验未通过，就会走到 catch 里
    console.warn('表单校验未通过，请检查红字提示', error)
    // Element Plus 会自动在界面上标红提示错误信息，这里一般不需要额外处理
  }
}
// 重置表单
const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
  if (feeFormRef.value) feeFormRef.value.resetFields()
}
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
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

    .preview {
      img {
        width: 100px;
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
