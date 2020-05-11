/**
 *
 * http配置
 *
 */

import axios from 'axios'
import router from '../router/index'
import { Message } from 'element-ui'

// 超时时间
axios.defaults.timeout = 300000
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// HTTPrequest拦截
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})
// HTTPresponse拦截
axios.interceptors.response.use(data => {
  return data
}, error => {
  const errMsg = error.toString()
  console.log(errMsg)
  const code = errMsg.substr(errMsg.indexOf('code') + 5)
  Message({
    message: '未知错误',
    type: 'error'
  })
  if (parseInt(code) === 401) {
    store.dispatch('FedLogOut').then(() => {
      router.push({ path: '/login' })
    })
  }
  return Promise.reject(new Error(error))
})

export default axios
