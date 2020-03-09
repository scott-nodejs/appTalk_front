import { fetch } from '@request'
import api from '@api/server'

const state = () => ({
  searchArticle: {
    list: [],
    total: 0,
    page: 1,
    pageSize: 25,
    search: '',
    tag_all: []
  }
})

const mutations = {
  SET_ARTICLE_SEARCH (state, data) {
    // 设置搜索的文章
    state.searchArticle = data
  }
}

const actions = {
  async GET_ARTICLE_SEARCH ({ commit, dispatch, state }, parameter) {
    // 获取搜索的文
      const result = await api.get('/article/search',parameter);
      commit('SET_ARTICLE_SEARCH', result.data)
      return result
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
