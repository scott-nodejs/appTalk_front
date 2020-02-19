import { fetch } from '@request'
import axios from '../../utils/fetch'
import api from '@api/server'

const state = () => ({})

const mutations = {}

const actions = {
  async PERSONAL_UPLOAD_AVATAR ({ commit, dispatch, state }, parameter) {
    // 上传用户头像
    const res = await api.get('/api/image/getToken')
    return res
  },
  async PERSONAL_UPLOAD_INFO ({ commit, dispatch, state }, parameter) {
    // 更新用户信息
      const res = await api.postJson('/api/user/update',parameter)
      return res.data
  }
  ,
  async PERSONAL_UPLOAD_PASSWORD ({ commit, dispatch, state }, parameter) {
    // 更新用户密码
    const res = await api.postJson('/api/user/pwd',parameter)
    return res.data
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
