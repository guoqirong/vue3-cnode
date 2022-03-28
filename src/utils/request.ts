import axios, { AxiosInstance } from 'axios'
import { Ref, ref } from 'vue';

interface httpRequestType {
  isLoading: Ref<boolean>;
  adornUrl: (actionName: string) => string;
  httpRequest: AxiosInstance;
}

export interface resDataType<T> {
  success: boolean;
  data?: T;
}

const useHttpRequest = (): httpRequestType => {
  const isLoading = ref<boolean>(false);

  // 处理请求链接
  const adornUrl = (actionName: string) => {
    return process.env.VUE_APP_API_BASE_Url + actionName
  };

  // 请求方法创建
  const httpRequest = axios.create({
    timeout: 1000 * 60,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });

  // 请求拦截
  httpRequest.interceptors.request.use(config => {
    isLoading.value = true;
    return config;
  })
  
  // 响应拦截
  httpRequest.interceptors.response.use(response => {
    if (response && response.status === 403) { // 403, token失效
      console.error('登录失败')
    } else if (response && response.status !== 200) { // 403, token失效
      console.error('请求失败')
    }
    isLoading.value = false;
    return response;
  }, error => {
    isLoading.value = false;
    return Promise.reject(error);
  });

  return {
    isLoading,
    adornUrl,
    httpRequest,
  };
}

export default useHttpRequest