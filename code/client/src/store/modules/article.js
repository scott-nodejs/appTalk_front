import { fetch } from '@request'
import api from '../../../api/server'

const state = () => ({
  article: {}
})

const mutations = {
  SET_ARTICLE (state, data) {
    // 设置文章
    state.article = data
  }
}

const actions = {
  async GET_ARTICLE ({ commit, dispatch }, parameter) {
      // 获取文章
      const res = await api.get('article/detail/'+parameter.id)
      commit('SET_ARTICLE', res.data)
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
