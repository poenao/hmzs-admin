import type { ApifoxModel, CardListData } from '@/types/card'
import { request } from '@/utils/reuqest'

/**
 * 查看月卡信息列表
 * @param params
 */

export const getCardListApi = (params: ApifoxModel) => {
  // 假设后端响应格式为 { code, message, data: { rows: Rows[] } }
  return request<CardListData>('/parking/card/list', 'get', params)
}
