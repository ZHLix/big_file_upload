import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Api from './api'
import Utils from './common/utils'

// element ui
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import CForm from './components/Form'
import CTable from './components/Table'

Vue.component('c-form', CForm)
Vue.component('c-table', CTable)

// element ui
Vue.use(ElementUi)

Vue.config.productionTip = false

const app = new Vue({
    router,
    store,
    render: h => h(App)
})

Vue.use(Api, app)
Vue.use(Utils, app)

app.$mount('#app')

