import { fetch } from '@request'
import { gqlfetch } from '@fetch'
import api from '../../../api/server'
const state = () => ({
  otherUserAttentionCount: 0,
  userArticleCount: 0,
  userAttentionCount: 0,
  dynamicCount: 0,
  allLikeDynaicId: [], // 关注的所有动态ID
  allRssDynamicTopicId: [], // 订阅的所有动态话题ID
  user_info: {},
  user: {},
  user_article_blog: [], // 用户的文章专题
    attentionMessageCount: 0, // 用户未读
  messageCount: 0, // 用户未读
  associateInfo: {
    articleThumdId: [],
    userAttentionId: []
  }
})

const mutations = {
  SET_USER_INFO_ALL (state, data) {
    // 获取用户的全部信息
    state.otherUserAttentionCount = data.otherUserAttentionCount
    state.userArticleCount = data.userArticleCount
    state.userAttentionCount = data.userAttentionCount
    state.dynamicCount = data.dynamicCount
    state.allLikeDynaicId = data.allLikeDynaicId // 关注的所有动态ID
    state.allRssDynamicTopicId = data.allRssDynamicTopicId // 订阅的所有动态话题ID
    state.user_info = data.userInfo
    state.user = data.user
    state.recommendArticle = data.recommendArticle
  },
  SET_USER_ARTICLE_BLOG_ALL (state, data) {
    // 设置获取的全部的个人文章专栏
    state.user_article_blog = data.list
  },
  SET_UNREAD_MESSAGE_COUNT (state, data) {
    // 用户消息数量
    state.attentionMessageCount = data.attentionMessageCount
    state.messageCount = data.messageCount
  },
  SET_ASSOCIATE_INFO (state, data) {
    // 用户关联
    state.associateInfo = data || {}
  }
}

const actions = {
  async GET_USER_INFO_ALL ({ commit, dispatch, state }, parameter) {
    // 获取用户信息
      const res = await api.get('/user/'+parameter.uid)
      commit('SET_USER_INFO_ALL', res.data)
      return res
  },

  async  GET_UNREAD_MESSAGE_COUNT ({ commit, dispatch, state }, data){
        // 获取用户未读消息数量
        const res = await api.get('/attentionMessage/count')
        commit('SET_UNREAD_MESSAGE_COUNT', res.data)
    },

    GET_USER_INFO ({ commit, dispatch, state }, parameter) {
        // 获取用户信息
        return fetch({
            url: '/user/'+parameter.uid,
            method: 'get',
        })
    },
  GET_USER_ARTICLE_BLOG_ALL: ({ commit, dispatch, state }, { uid }) => {
    // 获取文章专题 all
    return fetch({
      url: '/user/blgs',
      method: 'get',
      parameter: { params: { uid } }
    }).then(result => {
      commit('SET_USER_ARTICLE_BLOG_ALL', result.data)
      return result
    })
  },
  CREATE_ARTICLE_BLOG: ({ commit, dispatch, state }, data) => {
    // 创建用户个人文章专题
    return fetch({
      url: '/personal/create-article-blog',
      method: 'post',
      parameter: { ...data }
    })
  },
  UPDATE_ARTICLE_BLOG: ({ commit, dispatch, state }, data) => {
    // 更新用户个人文章专题
    return fetch({
      url: '/personal/update-article-blog',
      method: 'post',
      parameter: { ...data }
    })
  },
  async DELETE_ARTICLE ({ commit, dispatch, state }, data) {
    // 删除用户个人文章专题
    const res = api.delete('api/article/'+data.id)
    return res
  },
  DELETE_ARTICLE_BLOG: ({ commit, dispatch, state }, data) => {
    // 删除用户个人文章专题
    return fetch({
      url: '/personal/delete-article-blog',
      method: 'post',
      parameter: { ...data }
    })
  },
  USER_MY_ARTICLE: ({ commit, dispatch, state }, data) => {
    // 获取用户自己的文章
    return fetch({
      url: '/user/my-article',
      method: 'get',
      parameter: { params: data }
    })
  },
  GET_USER_ATTENTION_LIST: ({ commit, dispatch, state }, data) => {
    // 获取用户关注
    return fetch({
      url: '/user/attention-list',
      method: 'get',
      parameter: { params: data }
    })
  },
  GET_USER_LIKE_ARTICLE_LIST: ({ commit, dispatch, state }, data) => {
    // 获取用户like
    return fetch({
      url: '/user/like-article-list',
      method: 'get',
      parameter: { params: data }
    })
  },
  async GET_USER_MESSAGE_LIST({ commit, dispatch, state }, data) {
    // 获取用户消息
    const res = await api.get('/api/message/pageList',data)
    return res
  },
  async GET_ATTENTION_MESSAGE_LIST ({ commit, dispatch, state }, params){
    // 获取关注
    const res = await api.get('api/attentionMessage/pageList',params)
    return res
  },
  DELETE_USER_MESSAGE: ({ commit, dispatch, state }, data) => {
    // 删除用户消息
    return fetch({
      url: '/personal/message-delete',
      method: 'delete',
      parameter: { params: data }
    })
  },
  GET_USER_ROLE_ALL: ({ commit, dispatch, state }, data) => {
    // 获取所有用户标签
    return fetch({
      url: '/user/role-all',
      method: 'get',
      parameter: { params: data }
    })
  },
  GET_PERSONAL_DYNAMIC_LIST ({ commit, dispatch, state }, parameter) {
    // 获取动态列表
    return fetch({
      url: '/personal/dynamic-list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  GET_USER_ARTICLE_BLOG_LIST ({ commit, dispatch, state }, parameter) {
    // 获取用户的个人专栏列表
    return fetch({
      url: '/personal/article-blog-list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  GET_BOOKS_LIST ({ commit, dispatch, state }, parameter) {
    // 获取用户的个人专栏列表
    return fetch({
      url: '/personal/books-list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  async GET_ASSOCIATE_INFO ({ commit, dispatch, state }, parameter) {
      // 获取用户关联信息
    const res = await api.get('/user/relate/count')
    commit('SET_ASSOCIATE_INFO',res.data)
    return  res
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
