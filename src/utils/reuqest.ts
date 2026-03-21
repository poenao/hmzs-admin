import { useUserStore } from "@/stores/user";
import axios, { type Method, type AxiosRequestConfig } from "axios";

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
  (error) => Promise.reject(error),
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 这里的 response.data 对应的是 Data<T> 结构
    return response.data;
  },
  (error) => Promise.reject(error),
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
