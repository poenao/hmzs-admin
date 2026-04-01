export interface EmployeeParams {
  /**
   * 姓名，按照姓名模糊查询
   */
  userName?: string
  /**
   * 当前页数，默认1
   */
  page?: number
  /**
   * 每页大小，默认是10
   */
  pageSize?: number
}

/**
 * 报文数据
 */
export interface EmployeeData {
  /**
   * 分页数据
   */
  rows: Employee[]
  /**
   * 总条数
   */
  total: number
}

export interface Employee {
  /**
   * 主键
   */
  id?: number
  /**
   * 员工姓名
   */
  name?: string
  /**
   * 联系方式手机号
   */
  phonenumber: string
  /**
   * 角色Id
   */
  roleId?: number
  /**
   * 角色名称
   */
  roleName: string
  /**
   * 停用状态 0未启用 1启用
   */
  status?: number
  /**
   * 登录账号
   */
  userName?: string
}
