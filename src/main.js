// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/pt-br'
// import VeeValidate from 'vee-validate'
import 'vuetify/dist/vuetify.min.css'

// Vue.use(VeeValidate)
Vue.config.productionTip = false
Vue.use(Vuetify)

Vue.use(VueResource)
Vue.use(ElementUI, {locale})

Vue.http.options.root = process.env.API
Vue.router = router

/* Autenticação das rotas */

Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/vue-resource.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  rolesVar: 'type',
  loginData: {url: 'user_token', method: 'POST', redirect: '/', fetchUser: false},
  fetchData: {url: 'auth/user', method: 'GET'},
  refreshData: {url: 'auth/refresh', method: 'GET', atInit: false}
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
