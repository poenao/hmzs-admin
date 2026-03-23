import type {
  EnterpriseQueryParams,
  EnterprisePageData,
  Industry
} from '@/types/enterprise'
import { request } from '@/utils/reuqest'

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