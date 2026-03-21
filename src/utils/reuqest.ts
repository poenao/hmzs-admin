import router from "@/router";
import { useUserStore } from "@/stores/user";
import axios, { type Method, type AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";

// 1. 定义后端返回的标准格式
export type Data<T> = {
  code: number;
  message: string;
  data: T;
};

const service = axios.create({
  baseURL: "https://api-hmzs.itheima.net/tj",
  timeout: 5000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 这里可以统一加 token
    // 如果有token，可以在这里添加到请求头
    const stroe = useUserStore();
    const token = stroe.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  //1. 接口报错的时候提示用户到底是哪里错误
  //2. 接口数量很多 统一管控  不管哪个接口报错了 都能监控到 而且给出提示
  (error) => {
    ElMessage.error(error.response.data.msg);
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 这里的 response.data 对应的是 Data<T> 结构
    return response.data;
  },
  (error) => {
    ElMessage.error(error.response.data.msg);
    // 这里可以统一处理错误，比如 token 过期，直接跳转到登录页
    if (error.response.data.code === 401) {
      // 处理 token 过期的逻辑
      const stroe = useUserStore();
      // 清除用户信息
      stroe.clearUserInfo();
      // 跳转到登录页
      router.push("/login");
    }

    return Promise.reject(error);
  },
);

/**
 * 4. 请求工具函数
 * @param url 请求地址
 * @param method 请求方式
 * @param submitData 请求数据 (GET用params, POST用data)
 * @param config 额外的配置 (比如想改 headers)
 */
const request = <T>(
  url: string,
  method: Method = "get",
  submitData?: any,
  config?: AxiosRequestConfig, // 增加一个可选配置参数，提高灵活性
) => {
  return service.request<any, Data<T>>({
    url,
    method,
    // 你的核心逻辑：自动判断传参位置
    [method.toLowerCase() === "get" ? "params" : "data"]: submitData,
    ...config, // 合并额外配置
  });
};

export { request };
