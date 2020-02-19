import axios from '../../utils/fetch'
import api from '../../../api/server'

const state = () => ({
  article: {
    article_list: [],
    column_en_name: '',
    count: 0,
    page: 0
  },
  popular_article_tag: []
})

const mutations = {
  SET_INIT_INDEX_ARTICLE_LIST (state, data) {
    // 初始化首页 专栏页 文章列表
    state.article = {
      article_list: [],
      column_en_name: '',
      count: 0,
      page: 0
    }
  },
  SET_INDEX_ARTICLE_LIST (state, { list, column_en_name, total, page }) {
      // 首页 专栏页 文章列表
      let _list = state.article.article_list
      state.article = { column_en_name, total, page }
      state.article.article_list = [..._list, ...list]
  },
  SET_POPULAR_ARTICLE_TAG (state, data) {
    // 设置热门文章标签
    state.popular_article_tag = data
  }
}

const actions = {
    async GET_INDEX_ARTICLE_LIST ({ commit, dispatch, rootState:{ $api } }, parameter) {
    // 获取首页 专栏页 文章列表
        const res = await api.get('article/pageList',parameter)
        commit('SET_INDEX_ARTICLE_LIST', res.data)
  },
  GET_POPULAR_ARTICLE_TAG ({ commit, dispatch, state }, parameter = {}) {
    // 获取热门文章标签
      return new Promise( (resolve, reject) => {
          axios.get('article-tag/popular-list')
              .then( res => {
                  commit('SET_POPULAR_ARTICLE_TAG', res.data.list)
                  resolve(res)
              }).catch(e =>{
              reject(e)
          })
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
