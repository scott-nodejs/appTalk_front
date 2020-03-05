import api from '@api/server'

const state = () => ({
    appsList: {
        // blog 信息列表
        total: 0,
        list: [],
        pageNum: 1,
        pageSize: 25
    },
    app: {
        app: {},
        list: [],
        app_id: '',
        total: 0,
        pageNum: 1,
        pageSize: 25,
        subscribe_count: 0,
        tag_all: []
    },
    appsInfo: {
        url: '',
        name: '',
        description: ''
    }, // 小书的信息
    booksBookAll: [] // 小书的所有章节
})

const mutations = {
    SET_APPS_LIST (state, data) {
        // 设置小书列表
        state.appsList = data
    },
    SET_APPS_INFO (state, data) {
        // 设置小书列表
        state.appsInfo = data
    },
    SET_BOOKS_BOOK_ALL (state, data) {
        // 设置小书所有的章节
        state.booksBookAll = data
    },
    SET_ARTICLE_APP (state, data) {
        // 设置获取的文章tag
        state.app = data
    },
}

const actions = {
    async GET_APPS_LIST ({ commit, dispatch, state }, parameter) {
        // 获取小书
        const res = await api.get('/app/getAppList',parameter)
        console.log(res.data)
        commit('SET_APPS_LIST', res.data)
        return res
    },
    async GET_ARTICLE_APP ({ commit, dispatch, state }, parameter) {
        // 获取文章标签内容
        const res = await api.get('/app/articles/'+parameter.appid,parameter)
        commit('SET_ARTICLE_APP', res.data)
        return res
    },
    UPLOAD_BOOKS_COVER_IMG ({ commit, dispatch, state }, parameter) {
        // 上传小书封面图片
        return fetch({
            url: '/books/upload-books-picture',
            method: 'post',
            parameter: parameter
        })
    },
    async CREATE_APPS ({ commit, dispatch, state }, parameter) {
        // 创建APP
        const res = await api.postJson('api/app/add',parameter);
        return res
    },
    GET_USER_BOOKS_INFO: ({ commit, dispatch, state }, parameter) => {
        // 获取用户自己的小书
        return fetch({
            url: '/user-books/info',
            method: 'get',
            parameter: { params: parameter }
        })
    },
    UPDATE_BOOKS: ({ commit, dispatch, state }, parameter) => {
        // 更新小书
        return fetch({
            url: '/books/update',
            method: 'post',
            parameter: parameter
        })
    },
    DELETE_BOOKS: ({ commit, dispatch, state }, parameter) => {
        // 删除小书
        return fetch({
            url: '/books/delete',
            method: 'post',
            parameter: parameter
        })
    },
    async GET_APPS_INFO ({ commit, dispatch, state }, parameter) {
        // 获取小书
        const res = await api.get('/app/getApp/'+parameter.apps_id)
        commit('SET_APPS_INFO', res.data)
        return res
    },
    GET_BOOKS_BOOK_ALL: ({ commit, dispatch, state }, parameter) => {
        // 获取小书的所有章节列表
        return fetch({
            url: '/books/book-all',
            method: 'get',
            parameter: { params: parameter }
        }).then(result => {
            commit('SET_BOOKS_BOOK_ALL', result.data.list)
            return result
        })
    },
    // 小书评论开始
    BOOKS_COMMENT_LIST ({ commit, dispatch, state }, parameter) {
        // 获取小书评论列表
        return fetch({
            url: '/books-comment/list',
            method: 'get',
            parameter: { params: parameter }
        })
    },
    BOOKS_COMMENT_CREATE ({ commit, dispatch, state }, parameter) {
        // 获取小书评论列表
        return fetch({
            url: '/books-comment/create',
            method: 'post',
            parameter: parameter
        })
    },
    BOOKS_COMMENT_DELETE ({ commit, dispatch, state }, parameter) {
        // 删除小书评论
        return fetch({
            url: '/books-comment/delete',
            method: 'post',
            parameter: parameter
        })
    },
    GET_COLLECT_BOOKS_LIST ({ commit, dispatch, state }, parameter) {
        // 收藏的小书列表
        return fetch({
            url: '/collect/books-list',
            method: 'get',
            parameter: { params: parameter }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}