import { fetch } from '@request'
import api from "../../../api/server";

const state = () => ({})

const mutations = {}

const actions = {
  async GET_USER_BLOG ({ commit, dispatch, state }, { uid }) {
    // 获取文章专题
    const res = await api.get('/api/column/all')
    return res
  },
  CREATE_ARTICLE_BLOG: ({ commit, dispatch, state }, data) => {
    return fetch({
      url: '/personal/create-article-blog',
      method: 'post',
      parameter: { ...data }
    })
  },
  UPLOAD_ARTICLE_PICTURE: ({ commit, dispatch, state }, data) => {
    return fetch({
      url: '/article/upload-article-picture',
      method: 'post',
      parameter: data
    })
  },
  SAVE_ARTICLE: ({ commit, dispatch, state }, data) => {
    return fetch({
      url: '/api/article/add',
      method: 'post',
      parameter: data
    })
  },
  async GET_USER_ARTICLE ({ commit, dispatch, state }, parameter) {
    // 获取文章
      const res = await api.get('article/detail/'+parameter.id)
      return res
  },
  async UPDATE_ARTICLE({ commit, dispatch, state }, data) {
    const res = api.postJson('api/article/update',data)
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
