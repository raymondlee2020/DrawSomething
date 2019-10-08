import Vue from 'vue'
import App from '@/App.vue'
import vuex from '@/store/index'
import router from '@/router/index'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

const s_obj = new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3000',
  vuex: {
      vuex,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  }
  // options: { path: "/my-app/" } //Optional options
})

Vue.use(s_obj)

new Vue({
  store: vuex,
  router,
  render: h => h(App),
}).$mount('#app')
