/*
 * @Date: 2020-04-07 13:49:27
 * @LastEditors: zhlix <15127441165@163.com>
 * @LastEditTime: 2020-04-09 16:23:21
 * @FilePath: \frozen_food_mall\src\assets\request.js
 */
import axios from 'axios'

// Axios.defaults.baseURL = '/'
// Axios.defaults.withCredentials = true
// Axios.defaults.timeout = 100 * 1000

// Axios.interceptors.request.use(req => {
//   if (sessionStorage.getItem('authorization')) {
//     req.headers.authorization = `Bearer ${sessionStorage.getItem('authorization')}`
//   }

//   return req
// }, err => Promise.reject(err))

// Axios.interceptors.response.use(res => {
//   if (res.headers?.authorization) {
//     sessionStorage.setItem('authorization', res.headers.authorization)
//   }

//   return res.data
// }, err => Promise.reject(err))


// let formatParams = function (method = 'GET', params) {
//   //headers配置
//   const headers = { 'Content-Type': 'application/json;charset=utf-8', }
//   switch (method.toLocaleUpperCase()) {
//     case 'POST':
//       return { headers, method, data: params }
//     case 'PUT':
//       return { headers, method, data: params }
//     case 'DELETE':
//       return { headers, method, data: params }
//     case 'GET':
//       return { headers, method, params }
//     default:
//       return { headers, method, params }
//   }
// }

// let http = function (url, method = 'GET', params = {}) {
//   return Axios(Object.assign({ url }, formatParams(method, params)))
// }

// let _post = function (url, params = {}) {
//   return http(url, 'POST', params)
// }

// let _put = function (url, params = {}) {
//   return http(url, 'PUT', params)
// }

// let _delete = function (url, params = {}) {
//   return http(url, 'DELETE', params)
// }

// let _get = function (url, params = {}) {
//   return http(url, 'GET', params)
// }


// export default {
//   axios: Axios,
//   get: _get,
//   post: _post,
//   put: _put,
//   delete: _delete
// }

class Request {

    constructor(vm, config = {}) {
        this.$vm = vm
        // eslint-disable-next-line no-undef
        this.$axios = axios
        this.setConfig(config)
    }

    setVm (vm) {
        this.$vm = vm
    }

    setConfig (config = {}) {
        const obj = Object.assign({ withCredentials: false }, this.$axios.defaults, config)
        Object.keys(obj).forEach(k => {
            const tmp = obj[k]
            this.$axios.defaults[k] = tmp
        })
    }

    getConfig (name = null) {
        if (name) {
            return this.$axios.defaults[name]
        }
        return this.$axios.defaults
    }

    setInterceptors (interceptors = {}) {
        // this.$axios.interceptors = Object.assign({}, this.$axios.interceptors, interceptors)
        Object.keys(interceptors).forEach(k => {
            this.$axios.interceptors[k].use(interceptors[k], err => Promise.reject(err))
        })
    }

    formatParams (method = 'GET', params, header = {}, config = {}) {
        //headers配置
        const headers = Object.assign({ 'Content-Type': 'application/json;charset=utf-8', }, header)
        const type = method.toLocaleUpperCase()
        if (type == 'POST') return { headers, method, data: params, ...config }
        if (type == 'PUT') return { headers, method, data: params, ...config }
        if (type == 'DELETE') return { headers, method, data: params, ...config }
        if (type == 'GET') return { headers, method, params, ...config }

        return { headers, method, params, ...config }
    }

    http (url, method = 'GET', params = {}, header = {}, config = {}) {
        return this.$axios(Object.assign({ url }, this.formatParams(method, params, header, config)))
    }

    post (url, params = {}, header = {}, config = {}) {
        return this.http(url, 'POST', params, header, config)
    }

    put (url, params = {}, header = {}, config = {}) {
        return this.http(url, 'PUT', params, header, config)
    }

    delete (url, params = {}, header = {}, config = {}) {
        return this.http(url, 'DELETE', params, header, config)
    }

    get (url, params = {}, header = {}, config = {}) {
        return this.http(url, 'GET', params, header, config)
    }

}

const install = (Vue, vm) => {
    Vue.prototype.$request = new Request(vm)
}

export default { install, Request }