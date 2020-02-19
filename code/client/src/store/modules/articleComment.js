import { fetch } from '@request'
import api from '@api/server'

const state = () => ({})

const actions = {
  ARTICLE_COMMENT_LIST ({ commit, dispatch, state }, parameter) {
    // 获取文章评论列表
    return fetch({
      url: 'comment/pageList/'+parameter.id,
      method: 'get',
      parameter: { params: parameter }
    })
  },
  async ARTICLE_COMMENT_CREATE ({ commit, dispatch, state }, parameter) {
    // 新增评论
    const res = await api.postJson("api/comment/add",parameter)
    return res.data
  },
  ARTICLE_COMMENT_DELETE ({ commit, dispatch, state }, parameter) {
    // 删除文章评论
    return fetch({
      url: '/article/comment-delete',
      method: 'post',
      parameter: parameter
    })
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  actions,
  getters
}
