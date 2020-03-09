import axios from "../../utils/fetch";
import api from '@api/server'

const state = () => ({
  meta: {},
  config: {},
  notices: [],
  advertise: []
})

const mutations = {
  SET_WEBSITE_INFO (state, data) {
    //  设置网站信息
    state.meta = data
  },
  SET_WEBSITE_CONFIG (state, data) {
    //  设置网站信息
    state.config = data
  },
  SET_NOTICE_LIST (state, data) {
    //  设置网站通知信息
    let arr = []
    data.map(item => {
      arr.push(JSON.parse(item.optionValue))
    })
    state.notices = arr
  },
  SET_ADVERTISE_LIST (state, data) {
    //  设置网站通知信息
    let arr = []
    data.map(item => {
      arr.push(JSON.parse(item.option_value))
    })
    state.advertise = arr
  }
}

const actions = {
  async GET_WEBSITE_INFO ({ commit, dispatch, state }) {
    // 获取网站信息
      const result = await api.get('configs')
      commit('SET_WEBSITE_INFO', result.data.website)
      commit('SET_WEBSITE_CONFIG', result.data.config)
      commit('SET_NOTICE_LIST', result.data.notices)
      // commit('SET_ADVERTISE_LIST', result.data.advertise)
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
