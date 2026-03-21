import { getLocalToken, setLocalToken } from "@/utils/auth";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("hm-user", () => {
  // 1. 定义状态 优先从本地获取token
  const token = ref(getLocalToken() || "");
  // 2.存储token到本地
  const setToken = (t: string) => {
    token.value = t;
    // 存储token到本地
    setLocalToken(t);
  };
  // 3. 定义一个清除用户信息的方法
  const clearUserInfo = () => {
    // 清除token
    token.value = "";
    // 清除本地存储的token
    setLocalToken("");
  };

  return {
    token,
    setToken,
    clearUserInfo,
  };
});
