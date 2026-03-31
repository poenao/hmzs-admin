import type { RoleParams } from '@/types/system'
import type { LoginParams, Profile } from '@/types/user'
import { request } from '@/utils/reuqest'

/**
 * @description: 登录函数
 * @param {*} data { mobile,password }
 * @return {*} promise
 */
export const loginAi = (data: LoginParams) => {
  return request<{ token: string }>('/park/login', 'POST', data)
}

/**
 * @description: 获取用户信息
 * @param {*} data {}
 * @return {*} promise
 */
export const getProfileAPI = () => {
  return request<Profile>('/park/user/profile')
}
