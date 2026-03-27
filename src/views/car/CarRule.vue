<script lang="ts" setup>
import { calculateCardApi } from '@/apis/card'
import type { Card } from '@/types/card'
import { ru } from 'element-plus/es/locales.mjs'
import { onMounted, ref } from 'vue'
import * as XLSX from 'xlsx'

// 计费规则列表
const ruleList = ref<Card[]>([])
// 请求参数
const params = ref({
  page: 1,
  pageSize: 5
})
// 总条数
const total = ref(0)
// 获取计费规则列表
const getRuleList = async () => {
  const res = await calculateCardApi(params.value)
  // 赋值
  ruleList.value = res.data.rows
  // 总条数
  total.value = res.data.total
}
onMounted(() => {
  // 获取计费规则列表
  getRuleList()
})
// 计费方式
const chargeType: any = {
  duration: '时长收费',
  turn: '按次收费',
  partition: '分段消费'
}
// 导出Excel 下载xlsx插件
const exportToExcel = () => {
  //1.创建一个新的工作簿
  const workbook = XLSX.utils.book_new()
  //2.将数据转换为工作表
  const tableHeaderKeys = [
    'id',
    'ruleNumber',
    'ruleName',
    'freeDuration',
    'chargeCeiling',
    'chargeType',
    'ruleNameView'
  ]
  // 以excel表格的顺序调整后端数据（过滤）
  const sheetData = ruleList.value.map((item: any) => {
    // 创建一个新的对象，按照表头顺序添加属性
    const obj = {} as any
    tableHeaderKeys.forEach(key => {
      // 将对应的属性值添加到新对象中
      if (item.chargeType === 'chargeType') {
        // 将枚举值转换为对应的文本
        obj[key] = chargeType[item[key]]
      } else {
        obj[key] = item[key]
      }
      // 返回新的对象
      return obj
    })
  })
  const worksheet = XLSX.utils.json_to_sheet(sheetData)
  //3.将工作表添加到工作簿中
  XLSX.utils.book_append_sheet(workbook, worksheet, '计费规则')
  // 改写表头
  const header = [
    '编号',
    '计费规则编号',
    '计费规则名称',
    '免费时长(分钟)',
    '收费上限(元)',
    '计费方式',
    '计费规则'
  ]
  XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' })
  //4.生成Excel文件并触发下载
  XLSX.writeFile(workbook, '计费规则.xlsx')
}
</script>

<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary">增加停车计费规则</el-button>
      <el-button @click="exportToExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上限(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式">
          <template #default="scope">
            {{ chargeType[scope.row.chargeType] }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" width="300" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="240">
          <templat #default="scope">
            <el-button size="small" type="text">编辑</el-button>
            <el-button size="small" type="text">删除</el-button>
          </templat>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.rules .el-form-item {
  padding: 0 10px;
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

.form-container {
  padding: 0px 80px;
}
</style>
