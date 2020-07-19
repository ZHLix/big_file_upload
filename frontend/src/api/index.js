import Request from '../common/request'

Request = Request.Request

class Api {
    constructor(vm) {
        this.$vm = vm
        // this.$request = request
        this.$request = new Request(vm, { baseURL: this.$vm.$store.state.baseUrl })

        this.$request.setConfig({ withCredentials: true })

        this.$request.setInterceptors({
            request: req => {
                // if (sessionStorage.getItem('authorization')) {
                //     req.headers.authorization = `Bearer ${sessionStorage.getItem('authorization')}`
                // }

                return req
            },
            response: res => {
                // if (res.headers?.authorization) {
                //     sessionStorage.setItem('authorization', res.headers.authorization)
                // }

                if (res.data.code == 400 && res.data.msg == '未登录，禁止访问') {
                    this.$vm.$message.warning('登录已失效，请重新登录')
                    this.$vm.$nextTick(() => {
                        this.Login.logout()
                    })
                }

                return res.data
            }
        })


        const files = require.context('.', true, /\.js$/)
        files.keys().forEach(v => {
            if (v === './index.js' || v === './base.js') return
            let key = v.match(/\.\/(.*)\.js/)[1].split('/')
            key = key.filter((v, k) => k === 0 || v !== 'index').map(v => v.replace(v[0], v[0].toUpperCase())).join('')
            const item = files(v).default
            this[key] = new item(this)
        })

    }
}

const install = (Vue, vm) => {
    Vue.prototype.$api = new Api(vm)
}

export default {
    install
}