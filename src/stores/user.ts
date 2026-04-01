import { getProfileAPI } from '@/apis/user'
import type { Profile } from '@/types/user'
import { getLocalToken, setLocalToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('hm-user', () => {
  // 1. 定义状态 优先从本地获取token
  const token = ref(getLocalToken() || '')
  // 存储token到本地
  const setToken = (t: string) => {
    token.value = t
    // 存储token到本地
    setLocalToken(t)
  }
  // 定义一个清除用户信息的方法
  const clearUserInfo = () => {
    token.value = ''
    setLocalToken('')
  }

  // 2. 个人信息
  const profile = ref<Profile>({} as Profile)
  const getProfile = async () => {
    const res = await getProfileAPI()
    profile.value = res.data
  }

  return {
    token,
    setToken,
    clearUserInfo,
    profile,
    getProfile
  }
})
