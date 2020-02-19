import koaRouter from 'koa-router'
import path from 'path'
import fs from 'fs'
import request from 'superagent'
const router = koaRouter()

export default app => {

    //获取推荐的所有文章
    router.get('/article/index', async (ctx, next) => {
        ctx.body = require('./aritles.json')
    })

    //获取文章详情
    router.get('/article',async (ctx, next) => {
        ctx.body = require('./aritle.json')
    })

    //获取文章评论
    router.get('/article/comment-list',async (ctx, next) => {
        ctx.body = require('./comments.json')
    })

    //登录
    router.get('/sign-in', async (ctx, next) => {
        ctx.body = require('./sign.json')
    })

    //请求所有的文章标签
    router.get('/article-tag/popular-list', async (ctx, next) => {
        ctx.body = require('./tags.json')
    })

    //网站配置相关信息
    router.get('/website/info',async (ctx, next) => {
        ctx.body = require('./website.json')
    })

    router.get('/article/column-all',async (ctx, next) => {
        ctx.body = require('./clumn.json')
    })

    router.get('/getMovieList', async (ctx, next) => {
        ctx.body = require('./movies.json')
    })

    router.get('/getMovieDetail', async (ctx, next) => {
        let {id} = ctx.request.query
        const data = new Promise( (resolve, reject) => {
            request.get('http://api.douban.com/v2/movie/subject/'+id)
                .then( res => {
                    resolve(res.body)
                }).catch( e => {
                    console.log(e)
                    reject(e)
                })
        })
        ctx.body = await data
    })
    app.use(router.routes()).use(router.allowedMethods())
}

