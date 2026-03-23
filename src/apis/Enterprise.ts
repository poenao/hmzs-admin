import type {
  EnterpriseQueryParams,
  EnterprisePageData
} from '@/types/enterprise'
import { request } from '@/utils/reuqest'

export const getEnterpriseInfoApi = (params: EnterpriseQueryParams) => {
  // 正确写法：告诉 TS 接口返回分页对象
  return request<EnterprisePageData>('/park/enterprise', 'GET', params)
}
