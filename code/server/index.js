import Koa from 'koa'
import ip from 'ip'
import router from './router/index'
import middleware from './middleware'
import conf from './config'
const proxyMiddleWare = require('./middleware/proxyMiddleWare')
import SSR from './ssr'
const app = new Koa()

//使用中间件
middleware(app)

// 接口
// router(app)

// vue-ssr
SSR(app)

app.use(proxyMiddleWare())



app.listen(conf.app.port, () => {
    console.log(`server is running at http://${ip.address()}:${conf.app.port}`);
})

