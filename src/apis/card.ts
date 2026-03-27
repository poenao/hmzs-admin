import type { CarListParams } from '@/types/car'
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
/**
 * 删除月卡
 * @param {*} id
 * @returns
 */
export const deleteCardApi = (id: string) => {
  return request(`/parking/card/${id}`, 'DELETE')
}
/**
 * 批量删除月卡
 * @param {*} ids [1,2,3]
 * @returns
 */
export const delAllCardAPI = (ids: number[]) => {
  return request(`/parking/card/${ids.join(',')}`, 'DELETE')
}

/**
 * 月卡计算规则
 * @param {*} data
 */
export const calculateCardApi = (params: CarListParams) => {
  return request<CardListData>('/parking/rule/list', 'GET', params)
}
