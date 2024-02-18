import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default {
    state: {
        toolbarSelect:1
    },
    mutations: {
        updateToolbarSelectState(state, current) {
            state.toolbarSelect = current
        },
    },
    actions: {},
    modules: {},
    plugins: [
        createPersistedState({
            storage: window.sessionStorage
        })
    ]
}
