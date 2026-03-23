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
            <el-button link type="primary">添加合同</el-button>
            <el-button link type="primary">查看</el-button>
            <el-button link type="primary">编辑</el-button>
            <el-button link type="primary">删除</el-button>
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
</template>
<script setup lang="ts">
import { getEnterpriseInfoApi } from '@/apis/Enterprise'
import type { EnterpriseItem, EnterpriseQueryParams } from '@/types/enterprise'
import { ref } from 'vue'
// 这里的 params 是为了后续接口调用准备的，目前还没有用到
const params = ref<EnterpriseQueryParams>({
  name: '', // 企业名称
  page: 1, // 当前页码
  pageSize: 2 // 每页条数
})
// 总条数
const total = ref(0)
// 企业列表数据，后续会通过接口获取并赋值
const exterpriseList = ref<EnterpriseItem[]>([])

// 获取企业列表的函数，后续会通过接口实现
const getExterpriseList = async () => {
  const res = await getEnterpriseInfoApi(params.value)
  exterpriseList.value = res.data.rows
  total.value = res.data.total
}
// 1. 通过事件拿到当前页数
//2. 以当前页数作为参数发送数据请求获取当前页数据
//3. 重新把列表交给buildingList
const pageChange = (val: number) => {
  //拿到事件获取的当前页数然后赋值给响应式页码
  params.value.page = val
  // 重新发请求
  getExterpriseList()
}
// 模糊搜索
const doSearch = () => {
  // 页面回到第一页
  params.value.page = 1
  getExterpriseList()
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
