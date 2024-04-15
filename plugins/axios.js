import Vue from "vue"
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);
import Swal from 'sweetalert2'

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export default ({ app, store, redirect }) => {
  axios.defaults.baseURL = process.env.apiUrl

  if (process.server) {
    return
  }

  // Request interceptor
  axios.interceptors.request.use((request) => {
    request.baseURL = process.env.apiUrl

    const token = store.getters['auth/token']

    if (token) {
      request.headers.common.Authorization = `Bearer ${token}`
    }

    const locale = store.getters['lang/locale']
    if (locale) {
      request.headers.common['Accept-Language'] = locale
    }

    return request
  })

  // Response interceptor
  axios.interceptors.response.use(response => response, (error) => {
    const { status } = error.response || {}

    if (status >= 500) {
      Swal.fire({
        icon: 'error',
        title: app.i18n.t('page.error_alert_title'),
        text: app.i18n.t('page.error_alert_text'),
        reverseButtons: true,
        confirmButtonText: app.i18n.t('page.ok'),
        cancelButtonText: app.i18n.t('page.cancel')
      })
    }

    if (status === 400 && error.response.data.message) {
      Swal.fire({
        icon: 'error',
        text: error.response.data.message,
        reverseButtons: true,
        confirmButtonText: app.i18n.t('page.ok'),
        cancelButtonText: app.i18n.t('page.cancel')
      })
    }

    if (status === 401 && store.getters['auth/check']) {
      Swal.fire({
        icon: 'warning',
        title: app.i18n.t('page.token_expired_alert_title'),
        text: app.i18n.t('page.token_expired_alert_text'),
        reverseButtons: true,
        confirmButtonText: app.i18n.t('page.ok'),
        cancelButtonText: app.i18n.t('page.cancel')
      }).then(() => {
        store.commit('auth/LOGOUT')

        redirect({ name: 'login' })
      })
    }

    if (status === 403 && error.response.data && error.response.data.message == 'google2fa_error') {
      redirect({name: '2fa'});
    }
    if (status === 403) {
      Swal.fire({
        icon: 'warning',
        title: app.i18n.t('message.site_disabled'),
        text: app.i18n.t('message.you_must_wait_until_admin_activate'),
        showCancelButton: false,
        confirmButtonText: app.i18n.t('page.ok'),
      }).then((result) => {
        error({ statusCode: 404, message: 'Page not found' })
      })
    }
    if (status === 406) {
      window.location.reload()
    }

    return Promise.reject(error)
  })
}
