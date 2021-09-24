import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import Vuetify from 'vuetify/lib'
import './auth'
Vue.config.productionTip = false
Vue.use(Vuetify);
new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
