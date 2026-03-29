import type { Role } from '@/types/system'
import { request } from '@/utils/reuqest'

/**
 * 获取角色列表
 * @returns
 */
export const getRoleListAPI = () => {
  return request<Role[]>('/park/sys/role')
}
