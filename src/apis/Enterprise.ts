import type {
  EnterpriseQueryParams,
  EnterprisePageData,
  Industry,
  EnterpriseParams
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
 * @returns
 */
export const uploadAPI = (data: FormData) => {
  return request<UploadUserFile>('/upload', 'POST', data)
}

/**
 * 创建公司
 * @param {*} data
 * @returns
 */
export const createEnterpriseAPI = (data: EnterpriseParams) => {
  return request('/park/enterprise', 'POST', data)
}
