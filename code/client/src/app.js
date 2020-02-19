import Vue from 'vue'
import App from './App.vue'
import { sync } from 'vuex-router-sync'
import {createRouter} from './router'
import {createStore} from './store'

import { Message, Confirm } from './components'
import cookie from 'vue-cookie'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import './assets/css/box_layout.scss'
import './assets/css/reset.scss'
import './assets/css/other.scss'
import './assets/fonts/icon.scss'

Vue.prototype.$cookie = cookie;
Vue.prototype.$confirm = Confirm.install
Vue.use(Message)
Vue.use(mavonEditor)

export const createApp = () => {
    const router = createRouter()
    const store = createStore()
    sync(store, router)
    const app = new Vue({
        store,
	    router,
	    render: h => h(App)
	})
    return { app, router, store }
}