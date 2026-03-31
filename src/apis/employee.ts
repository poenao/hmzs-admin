import type { Employee, EmployeeData, EmployeeParams } from '@/types/employee'
import { request } from '@/utils/reuqest'

/**
 * 获取员工列表
 * @param { page, pageSize, name} params
 * @returns
 */
export const getEmployeeListAPI = (params: EmployeeParams) => {
  return request<EmployeeData>('/park/sys/user', 'GET', params)
}

/**
 * 添加员工
 * @returns
 */
export const createEmployeeAPI = (data: Employee) => {
  return request('/park/sys/user', 'POST', data)
}

/**
 * 删除员工
 * @returns
 */
export const delEmployeeAPI = (id: string) => {
  return request(`/park/sys/user/${id}`, 'DELETE')
}