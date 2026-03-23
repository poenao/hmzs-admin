<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input
        clearable
        placeholder="请输入内容"
        class="search-main"
        v-model="params.carNumber"
      />
      <span class="search-label">车主姓名：</span>
      <el-input
        clearable
        placeholder="请输入内容"
        class="search-main"
        v-model="params.personName"
      />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus" style="width: 240px">
        <el-option
          :label="item.name"
          v-for="item in cardStatusList"
          :key="item.id"
          :value="item.id!"
        />
      </el-select>
      <el-button type="primary" class="search-btn" @click="onSearch()"
        >查询</el-button
      >
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/cardAdd')"
        >添加月卡</el-button
      >
      <el-button>批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="cardList">
        <el-table-column align="center" type="index" label="序号" width="100" />
        <el-table-column align="center" label="车主名称" prop="personName" />
        <el-table-column align="center" label="联系方式" prop="phoneNumber" />
        <el-table-column align="center" label="车牌号码" prop="carNumber" />
        <el-table-column align="center" label="车辆品牌" prop="carBrand" />
        <el-table-column
          align="center"
          label="剩余有效天数"
          prop="totalEffectiveDate"
          :formatter="formatStatus"
        />
        />
        <el-table-column label="操作" align="center" fixed="right" width="300">
          <template #default="scope">
            <el-button size="small" type="text">续费</el-button>
            <el-button size="small" type="text">查看</el-button>
            <el-button size="small" type="text">编辑</el-button>
            <el-button size="small" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination
        layout="total,sizes, prev, pager, next,jumper"
        :total="total"
        :page-sizes="[2, 5, 10, 15]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCardListApi } from '@/apis/card'
import type { ApifoxModel, Card } from '@/types/card'
import { ref } from 'vue'

// 请求列表数据
const params = ref<ApifoxModel>({
  cardStatus: '', // 状态 '0':可用，'1':已过期
  carNumber: '', // 车牌号
  page: '1', // 页数
  pageSize: '5', // 条数，默认5条
  personName: '' // 车主姓名
})
// 返回月卡管理数据列表
const cardList = ref<Card[]>([])
// 总条数
const total = ref(0)
const cardStatusList = [
  {
    id: -1,
    name: '全部'
  },
  {
    id: 0,
    name: '可用'
  },
  {
    id: 1,
    name: '已过期'
  }
]
// 获取列表数据
const getCardList = async () => {
  const res = await getCardListApi(params.value)
  cardList.value = res.data.rows
  total.value = res.data.total
}
//适配状态显示
const formatStatus = (row: Card) => {
  return row.cardStatus === '0' ? '可用' : '已过期'
}
//监听每页条数变化，触发 handleSizeChange 方法。
const handleSizeChange = (val: number) => {
  // 更新每页条数参数
  params.value.pageSize = val.toString()
  // 重新获取列表数据
  getCardList()
}
// 监听当前页码变化，触发 handleCurrentChange 方法。
const handleCurrentChange = (val: number) => {
  // 把点击的页数赋值给请求参数页数
  params.value.page = val.toString()
  // 重新获取列表数据
  getCardList()
}
// 搜索请求
const onSearch = () => {
  // 点击搜索时，建议先回到第一页
  params.value.page = '1'
  // 调用接口获取数据
  getCardList()
}
getCardList()
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
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
