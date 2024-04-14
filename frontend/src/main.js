import { createApp } from 'vue'
import App from './App.vue'
import 'windi.css'
import store from './store'
import router from './router'
import 'animate.css'
import '@/assets/fonts/iconfont.css'
import EventEmitter from 'eventemitter3'

const init = async () => {
    await Promise.all([
        store.dispatch('getUserInfo'),
        store.dispatch('getUserConfig'),
        store.dispatch('getConfig')
    ])
    const app = createApp(App)
    app.config.globalProperties.$eventEmitter = new EventEmitter()
    app.use(router)
    app.use(store)
    app.mount('#app')
}

init()
