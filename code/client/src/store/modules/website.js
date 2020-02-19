import axios from "../../utils/fetch";

const state = () => ({
  meta: {},
  config: {},
  notice: [],
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
      arr.push(JSON.parse(item.option_value))
    })
    state.notice = arr
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
  GET_WEBSITE_INFO ({ commit, dispatch, state }) {
    // 获取网站信息
      return new Promise( (resolve, reject) => {
          axios.get('website/info')
              .then( result => {
                  commit('SET_WEBSITE_INFO', result.data.website)
                  commit('SET_WEBSITE_CONFIG', result.data.config)
                  commit('SET_NOTICE_LIST', result.data.notice)
                  commit('SET_ADVERTISE_LIST', result.data.advertise)
                  resolve(result)
              }).catch(e =>{
              reject(e)
          })
      }).catch(error => console.log('caught', error))
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
