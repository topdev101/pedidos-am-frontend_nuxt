import axios from 'axios'
import Cookies from 'js-cookie'

// state
export const state = () => ({
  user: null,
  token: null,
  allowed_ips: [],
  ip: '',
})

// getters
export const getters = {
  user: state => state.user,
  token: state => state.token,
  allowed_ips: state => state.allowed_ips,
  ip: state => state.ip,
  check: state => state.user !== null
}

// mutations
export const mutations = {
  SET_TOKEN (state, token) {
    state.token = token
  },

  FETCH_USER_SUCCESS (state, user) {
    state.user = user
  },

  FETCH_USER_FAILURE (state) {
    state.token = null
  },

  SET_ALLOWED_IPS (state, data) {
    state.allowed_ips = data
  },

  LOGOUT (state) {
    state.user = null
    state.token = null
  },

  UPDATE_USER (state, { user }) {
    state.user = user
  },

  SET_IP (state, { ip }) {
    state.ip = ip
  }
}

// actions
export const actions = {
  async saveToken ({ commit }, { token, remember }) {
    commit('SET_TOKEN', token);
    Cookies.set('token', token, { expires: remember ? 365 : null });
  },

  async fetchUser ({ commit }) {
    try {
      const { data } = await axios.get('/user')

      commit('FETCH_USER_SUCCESS', data)
    } catch (e) {
      Cookies.remove('token')

      commit('FETCH_USER_FAILURE')
    }
  },

  updateUser ({ commit }, payload) {
    commit('UPDATE_USER', payload)
  },

  async logout ({ commit }) {
    try {
      await axios.post('/logout')
    } catch (e) { }

    Cookies.remove('token')

    commit('LOGOUT')
  },
}
