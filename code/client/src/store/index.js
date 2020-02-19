import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)


export const createStore = () => {
    const store = new Vuex.Store({
    	// modules: {
    	// 	app
    	// },
        state: {
            personalInfo: {
                islogin: false,
                user: {}
            }, // 登录后的用户个人信息
            home_banner: [] //home banner
        },
        actions,
        mutations,
        getters,
        modules
    })
    return store
}
