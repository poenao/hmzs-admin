import type {
  ApifoxModel,
  CardDetail,
  CardListData,
  CardParams
} from '@/types/card'
import { request } from '@/utils/reuqest'

/**
 * 查看月卡信息列表
 * @param params
 */

export const getCardListApi = (params: ApifoxModel) => {
  // 假设后端响应格式为 { code, message, data: { rows: Rows[] } }
  return request<CardListData>('/parking/card/list', 'get', params)
}

/**
 * 添加月卡信息
 * @param data
 */
export const addCardApi = (data: CardParams) => {
  return request('/parking/card', 'post', data)
}

/**
 * 编辑月卡信息
 */

export const getCardDetailAPI = (id: string) => {
  return request<CardDetail>(`/parking/card/detail/${id}`, 'GET')
}

/**
 * 更新月卡
 * @param {*} data
 * @returns
 */
export const updateCardApi = (data: CardParams & { id: number }) => {
  return request('/parking/card/edit', 'PUT', data)
}
