import { fetch } from '@request'
import api from '@api/server'
import qs from 'qs'
import axios from "../../utils/fetch";
import http from "../../utils/http";

const state = () => ({})

const mutations = {}

const actions = {
  SIGN_SEND_CODE: ({ commit, dispatch, state }, params) => {
    // 注册发送验证码
      const res = api.get('/user/sendCode',params)
      return res
  },
  LOGIN: ({ commit, dispatch, state }, parameter) => {
    // 登录 post
      return fetch({
          url: '/login',
          method: 'post',
          parameter
      })
  },
  async REGISTER ({ commit, dispatch, state }, parameter) {
    // 注册 post
    const res = await api.postJson('/user/save',parameter)
    return res.data
  },
  RESET_PASSWORD_CODE: ({ commit, dispatch, state }, parameter) => {
    // 重置密码发送验证码
      const res = api.get('/user/sendCode',parameter)
      return res
  },
  async RESET_PASSWORD ({ commit, dispatch, state }, parameter) {
    // 重置密码
    const res = await api.postJson('user/findPassword',parameter)
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
