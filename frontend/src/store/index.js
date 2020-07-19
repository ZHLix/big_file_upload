import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        baseUrl: '', // 'http://localhost:8001', // 'https://peixun.mulgore.cn',
        /**
         * 是否登录
         */
        isLogin: false,

        /**
         * 是否隐藏导航
         */
        isCollapse: true,

        /**
         * 导航菜单
         */
        nav: [],
    },
    mutations: {
        /**
         * 数据更新 默认方法（大部分）
         * @param state
         * @param k
         * @param v
         */
        update: (state, { key: k, value: v }) => {
            // console.log(k, v)
            if (state[k] !== v) state[k] = v
        }
    },
    actions: {
        isLogin (context, data) {
            context.commit('update', { key: 'isLogin', value: data })
        },
        isCollapse (context, data) {
            context.commit('update', { key: 'isCollapse', value: data })
            localStorage.setItem('isCollapse', data)
        },
        nav (context, data) {
            context.commit('update', { key: 'nav', value: data })
        },
    },
    modules: {}
})
