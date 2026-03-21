// 权限控制

import router from "@/router";
import { getLocalToken } from "./utils/auth";

// 设置白名单
const whiteList = ["/login", "/404"]; // 不重定向白名单
// 路由守卫
router.beforeEach((to, from, next) => {
  // 判断是否有 token
  const token = getLocalToken();
  // 如果有 token
  if (token) {
    // 如果有token 就放行
    next();
  } else {
    // 没有 token判断是否在免登录的白名单中
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录的白名单中，直接进入
      next();
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面。
      next("/login");
    }
  }
});
