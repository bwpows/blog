import colors from 'vuetify/es5/util/colors'
export default {
  router: {
    mode: "hash", // 使用 "hash" 主要是为了适配以相对路径打开的静态站点， 必须使用 "hash" 否则路由跳转不生效

    base: process.env.NODE_ENV === "production" ? "./" : "/", // 使用 "./" 主要是为了适配以相对路径打开的静态站点

  },

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Bowei博客',
    title: 'Bowei',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'user-scalable=0,width=device-width, initial-scale=1.0' },
      { hid: 'description', name: 'description', content: 'bowei的博客，个人博客，优秀博客，简历' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "quill/dist/quill.core.css",
    "quill/dist/quill.snow.css",
    "quill/dist/quill.bubble.css",
    "highlight.js/styles/night-owl.css",
    "./assets/comment.css"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true
  },


  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          backgroundColor: '#f4f7fe'
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // analyze: true, 	
    assetFilter: function(assetFilename) {	    		
      return assetFilename.endsWith('.js');	    	
    }
  },
}
