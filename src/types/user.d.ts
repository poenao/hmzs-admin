/**
 * 登录请求参数
 */
export interface LoginParams {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 记住我 */
  remember?: boolean
}

export interface Profile {
  /**
   * 主键
   */
  id: number
  menus: string[]
  /**
   * 员工姓名
   */
  name: string
  /**
   * 用户权限集合
   */
  permissions: string[]
  /**
   * 用户的角色id
   */
  roleId: number
  /**
   * 用户角色名称
   */
  roleName: string
}