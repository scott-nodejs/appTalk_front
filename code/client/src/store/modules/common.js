import { fetch } from '@request'
import api from '@api/server'

const state = () => ({})

const mutations = {}

const actions = {
  SET_ATTENTION ({ commit, dispatch, state }, parameter) {
    // 设置关注
    return fetch({
      url: '/common/attention',
      method: 'post',
      parameter: parameter
    })
  },
  SET_LIKE ({ commit, dispatch, state }, parameter) {
    // 设置喜欢
    return fetch({
      url: '/common/like',
      method: 'post',
      parameter: parameter
    })
  },
  SET_COLLECT ({ commit, dispatch, state }, parameter) {
    // 设置收藏
    return fetch({
      url: '/common/collect',
      method: 'post',
      parameter: parameter
    })
  },
  async SET_THUMB ({ commit, dispatch, state }, parameter) {
    // 设置点赞
    const res = await api.post("article/applaud/"+parameter.associate_id,parameter)
    return res
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
