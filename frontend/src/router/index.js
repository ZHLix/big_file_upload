import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import routes from './routes'

Vue.use(VueRouter)

let is_login = sessionStorage.getItem('authorization') && sessionStorage.getItem('username')

if (is_login) store.dispatch('isLogin', Boolean(is_login))

const IndexIndex = routes.findIndex(v => v.name === 'index')
routes[IndexIndex] = Object.assign(routes[IndexIndex], { redirect: '/statistics/class/index' })

const router = new VueRouter({
    mode: 'hash',
    // eslint-disable-next-line no-undef
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    // 未登录
    if (!store.state.isLogin && to.name !== 'login') {
        next({ name: 'login' })
        return false
    }

    // 登录后访问登录页面 跳转回主页面
    if (store.state.isLogin && to.name === 'login') {
        next({ name: from.name ?? 'index' })
        return false
    }

    // 默认访问
    next()
})

export default router
