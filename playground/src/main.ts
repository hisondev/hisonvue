import { createApp } from 'vue'
import App from './App.vue'
import { HisonVue, type HisonVueConfig } from 'hisonvue'
import 'hisonvue/style.css'

const app = createApp(App)

const hisonVueConfig: HisonVueConfig = {
    primaryColor: '#ccddcc',
    size: 's',
}
app.use(HisonVue, hisonVueConfig)
app.mount('#app')
