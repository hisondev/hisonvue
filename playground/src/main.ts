import { createApp } from 'vue'
import App from './App.vue'
import { hisonvueApp, type HisonvueConfig } from 'hisonvue'
import 'hisonvue/style.css'
import router from './router'

const app = createApp(App)

const hisonvueConfig: HisonvueConfig = {
    primaryColor: '#ccddcc',
    size: 's',
}
app.use(hisonvueApp, hisonvueConfig)
app.use(router)
app.mount('#app')
