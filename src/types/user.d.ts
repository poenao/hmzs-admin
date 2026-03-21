/**
 * 登录请求参数
 */
export interface LoginParams {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 记住我 */
  remember?: boolean;
}
