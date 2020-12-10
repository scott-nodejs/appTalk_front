import {createApp} from './app'
import api from '../api/server'

const isDev = process.env.NODE_ENV !== 'production'

function objToStr(cookies) {
    let cookie = ''
    var arrCookie = cookies.split(';') // 将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
    for (var i = 0; i < arrCookie.length; i++) { // 使用for循环查找cookie中的tips变量
        var arr = arrCookie[i].split('=') // 将单条cookie用"等号"为标识，将单条cookie保存为arr数组
        if ('accessToken' === arr[0]) { // 匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
            cookie = arr[1] // 将cookie的值赋给变量tips
            break // 终止for循环遍历
        }
    }
    return cookie
}

export default context => {
    // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
      // 以便服务器能够等待所有的内容在渲染前，
      // 就已经准备就绪。
    return new Promise((resolve, reject) => {
        const s = isDev && Date.now()
        const { app, router, store } = createApp()
        const { url } = context
        const { fullPath } = router.resolve(url).route

        // if (context.cookies) {
        //     store.state.cookies = context.cookies
        // }

        if (fullPath !== url && fullPath !== '/404') {
            return reject({ url: fullPath })
        }
        router.push(url)
        router.onReady(() => {

            // 设置服务器端 router 的位置
            // 等到 router 将可能的异步组件和钩子函数解析完
            const matchedComponents = router.getMatchedComponents()
            if (!matchedComponents.length) {
                return reject({ code: 404 })
            }
            // store.commit('global/SET_COOKIES', context.accessToken)
            // store.$api = store.state.$api = api(context.accessToken)
            api.setCookies(context.accessToken)
            Promise.all(matchedComponents.map( ({asyncData}) => asyncData && asyncData({
                store,
                route: router.currentRoute,
                accessToken: context.accessToken
            }))).then( () => {
                isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
                context.state = store.state
                resolve(app)
            }).catch(reject)

            // resolve(app)
        })
    })
}
