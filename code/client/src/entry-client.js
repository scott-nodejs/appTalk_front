import Vue from 'vue'
import {createApp} from './app'
import {api} from '../api/server'
import { loading } from './directive'
const {app, router, store} = createApp()

import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/default/img/loadingfail.png',
    loading: '/default/img/loadingimg.png',
    attempt: 1
})

Vue.mixin({
    beforeRouteUpdate (to, from, next) {
        const { asyncData } = this.$options
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            })
                .then(next)
                .catch(next)
        } else {
            next()
        }
    }
})

Vue.directive('loading', loading)

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
    store.$api = store.state.$api = api
}
router.onReady(() => {
    // 添加路由钩子函数，用于处理 asyncData.
    // 在初始路由 resolve 后执行，
    // 以便我们不会二次预取(double-fetch)已有的数据。
    // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to)
        const prevMatched = router.getMatchedComponents(from)

        // 我们只关心之前没有渲染的组件
        // 所以我们对比它们，找出两个匹配列表的差异组件
        let diffed = false
        const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c))
        })

        const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
        if (!asyncDataHooks.length) {
            return next()
        }
        // 这里如果有加载指示器(loading indicator)，就触发
        Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
            .then(() => {
                // 停止加载指示器(loading indicator)
                next()
            })
            .catch(next)
    })

    app.$mount('#container')
})
