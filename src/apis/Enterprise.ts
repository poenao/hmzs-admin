import type {
  EnterpriseQueryParams,
  EnterprisePageData,
  Industry,
  EnterpriseParams,
  EnterpriseDetail,
  EnterpriseFile,
  Rent
} from '@/types/enterprise'
import { request } from '@/utils/reuqest'
import type { UploadUserFile } from 'element-plus'

/**
 *获取企业数据
 * @param params
 * @returns
 */
export const getEnterpriseInfoApi = (params: EnterpriseQueryParams) => {
  // 正确写法：告诉 TS 接口返回分页对象
  return request<EnterprisePageData>('/park/enterprise', 'GET', params)
}

/**
 * 获取行业列表
 * @returns
 */
export const getIndustryListAPI = () => {
  return request<Industry[]>('/park/industry')
}
/**
 * 上传合同
 * @param data FormData格式的文件数据
 * @returns 返回上传文件的id和url
 */
export const uploadAPI = (data: FormData) => {
  return request<EnterpriseFile>('/upload', 'POST', data)
}

/**
 * 创建公司
 * @param {*} data
 * @returns
 */
export const createEnterpriseAPI = (data: EnterpriseParams) => {
  return request<any>('/park/enterprise', 'POST', data)
}

/**
 * 获取企业详情
 * @param {*} id
 * @returns
 */
export const getEnterpriseDetailAPI = (id: string) => {
  return request<EnterpriseDetail>(`/park/enterprise/${id}`)
}
/**
 * 编辑企业
 * @param {*} data
 * @returns
 */
export const updateEnterpriseAPI = (data: EnterpriseParams) => {
  return request('/park/enterprise', 'PUT', data)
}
/**
 * 删除企业
 * @param {*} id
 * @returns
 */
export const delEnterpriseAPI = (id: string) => {
  return request(`/park/enterprise/${id}`, 'DELETE')
}

/**
 * 删除企业
 * @param id 企业ID
 * @returns
 */
export const deleteEnterpriseAPI = (id: string) => {
  return request(`/park/enterprise/${id}`, 'DELETE')
}
/**
 * 获取空置中楼宇列表（未租赁）
 * @param {*}
 * @returns
 */
export const getRentBuildListAPI = () => {
  return request<{ id: string; name: string }[]>('/park/rent/building')
}

/**
 * 给当前企业添加合同
 * @param {*} data
 * @returns
 */
export const createRentAPI = (data: Rent) => {
  return request('/park/enterprise/rent', 'POST', data)
}