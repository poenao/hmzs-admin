<script setup lang="ts">
import { downloadRentAPI, getRentDetailAPI } from '@/apis/Enterprise'
import type { EnterpriseDetail } from '@/types/enterprise'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

// 页面id
const route = useRoute()
const previewURL = 'https://view.officeapps.live.com/op/view.aspx?src=' // 预览地址
const rentId = route.query.id
const getEnterpriseRentDetail = ref<EnterpriseDetail | null>(null)
// 获取企业合同数据
const getEnterpriseRentList = async () => {
  const res = await getRentDetailAPI(rentId as string)
  res.data.rent.forEach (item => {
    // 获取合同URL 如果是pdf文件，直接预览，如果是office文件，拼接预览地址
    const url = item.contractUrl
    // 获取文件扩展名
    const extName = url!.slice(url!.lastIndexOf('.'))
    // 如果是pdf文件，直接预览
    if (extName === '.doc') {
      // 拼接预览地址
      item.contractUrl = previewURL + url
    }
  })
  // 将数据赋值给响应式变量
  getEnterpriseRentDetail.value = res.data
}
// 下载文件
// 根据合同的id 到后端去请请求
// 让后端以Blob的形式返回文件流
// 前端拿到文件流后，通过window.URL.createObjectURL()得到一个临时的URL地址
// 手动的创建一个a标签，给a标签加一个href属性，加一个download属性，模拟点击a标签，就可以下载文件了
const downloadContract = (row: any) => {
  const data: any = downloadRentAPI(row.contractId)
  // 处理文件流
  const url = window.URL.createObjectURL(data)
  // 创建a标签
  const a = document.createElement('a')
  a.href = url
  a.download = row.contractName
  // 模拟点击a标签
  a.click()
}

getEnterpriseRentList()
</script>

<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="查看企业" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">租赁记录</div>
        <div class="table-container">
          <el-table
            :data="getEnterpriseRentDetail?.rent"
            style="width: 100%"
            border
          >
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="buildingName" label="租赁楼宇" width="180" />
            <el-table-column label="租赁起止时间" width="280">
              <template #default="{ row }">
                {{ row.startTime }} - {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column label="租赁合同(点击预览)">
              <template #default="{ row }">
                <el-button type="text">
                  <a :href="row.contractUrl"> {{ row.contractName }}</a>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="录入时间" />
            <el-table-column prop="address" label="操作">
              <template #default="{ row }">
                <el-button type="text" @click="downloadContract(row)"
                  >合同下载</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.detail-enterprise {
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
      margin-bottom: 20px;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
    }

    .table-container {
      padding: 20px;
    }

    .preview {
      img {
        width: 100px;
      }
    }
  }
}
</style>
