require('dotenv').config();
export default {
  ssr: false,

  env: {
    appName: process.env.APP_NAME || 'Sayarat',
    serverUrl: process.env.APP_URL,
    apiUrl: process.env.API_URL,
    appLocale: process.env.APP_LOCALE || 'es',
    secretaryDomain: process.env.SECRETARY_DOMAIN,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.APP_NAME,
    titleTemplate: '%s - ' + process.env.APP_NAME,
    htmlAttrs: {
      lang: 'es'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: `Salam, ${process.env.APP_NAME}` },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  // <a href="https://www.flaticon.com/free-icons/notepad" title="notepad icons">Notepad icons created by Freepik - Flaticon</a>
  loading: { color: '#007bff' },

  router: {
    middleware: ['locale', 'check-auth']
  },

  css: [
    { src: '~assets/scss/app.scss', lang: 'scss' }
  ],

  pwa: {
    meta: {
      title: process.env.APP_NAME,
      mobileAppIOS: true,
      theme_color: '#007bff'
    },

    manifest: {
      name: process.env.APP_NAME,
      short_name: process.env.APP_NAME,
      lang: 'es',
      display: 'standalone',
      theme_color: '#007bff',
      icon: '/icon.png'
      // useWebmanifestExtension:true,
    },
    workbox: {},
  },

  ngrok: {
    ngrokauth: process.env.NGROK_AUTH
  },

  plugins: [
    '~plugins/i18n',
    '~plugins/vform',
    '~plugins/axios',
    '~plugins/custom.js',
    '~plugins/n-formatter.js',
    '~plugins/roles.js',
    '~plugins/nuxt-client-init',
    { src: '~plugins/bootstrap', mode: 'client' }
  ],

  components: true,

  buildModules: [
    '@nuxtjs/moment',
  ],

  modules: [
    '@nuxtjs/router',
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/ngrok',
  ],

  build: {
    extractCSS: true,
    postcss: null,
  },

  generate: {
    fallback: 'index.html'
  },
}
