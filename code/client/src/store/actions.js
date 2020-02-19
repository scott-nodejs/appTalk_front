import { fetch } from '@request'
import axios from "../utils/fetch";
import api from '../../api/server'

export default {
  async PERSONAL_INFO ({ commit, dispatch, state }, parameter = {}) { // 登录用户的个人信息
    // console.log("info : "+JSON.stringify(parameter))
      const res = await api.get("user/info",parameter)
      commit('SET_PERSONAL_INFO',res.data)
  }
}
