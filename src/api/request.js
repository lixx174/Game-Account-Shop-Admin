import axios from 'axios'
import { message } from 'ant-design-vue'

const request = axios.create({
  baseURL: '/admin',
  timeout: 10000,
})

request.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== 200) {
      message.error(data.msg || '请求失败')
      return Promise.reject(new Error(data.msg))
    }
    return data.data
  },
  (error) => {
    message.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request
