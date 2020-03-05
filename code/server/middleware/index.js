import path from 'path'
import bodyParser from 'koa-bodyparser'
import staticFiles from 'koa-static'
import compress from 'koa-compress'
const cors = require('koa2-cors')
export default app => {
    app.use(async (ctx, next) => {
        console.log(ctx.url)
        if (ctx.url == 'static/favicon.ico') return
        await next()
    })

    app.use(cors({
        origin: function (ctx) {
            return "*"; // 允许来自所有域名请求
        },
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST', 'DELETE'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept','X-Requested-With','cookie'],
    }))

    //gzip压缩
    // app.use(compress())

    //post请求中间件
    app.use(bodyParser())

    //静态文件中间件
    app.use(staticFiles(path.resolve(__dirname, '../../../public')))
}

