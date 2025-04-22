import { createApp } from 'vue'
import App from './App.vue'
import { hisonVue, type HisonVueConfig } from 'hisonvue'
import 'hisonvue/style.css'
import router from './router'

const app = createApp(App)

const hisonVueConfig: HisonVueConfig = {
    primaryColor: '#ccddcc',
    size: 's',
}
app.use(hisonVue, hisonVueConfig)
app.use(router)
app.mount('#app')
