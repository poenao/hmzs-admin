<script lang="ts" setup>
import { calculateCardApi } from '@/apis/card'
import type { Card } from '@/types/card'
import { onMounted, ref } from 'vue'

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
  res.data.rows = ruleList.value
  // 总条数
  total.value = res.data.total
}
onMounted(() => {
  // 获取计费规则列表
  getRuleList()
})
</script>

<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary">增加停车计费规则</el-button>
      <el-button>导出Excel</el-button>
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
            {{ scope.row.chargeType }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template>
            <el-button size="small" type="text">编辑</el-button>
            <el-button size="small" type="text">删除</el-button>
          </template>
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
