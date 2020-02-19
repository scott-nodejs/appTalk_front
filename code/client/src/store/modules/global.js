const state = () => ({
    cookies: {}
})

const actions = {}

const mutations = {
    SET_COOKIES (state, cookies) {
        state.cookies = cookies
    }
}

const getters = {
    ['get'](state) {
        return state
    }
}

export default {
    actions,
    state,
    mutations,
    getters
}