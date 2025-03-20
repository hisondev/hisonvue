import { createApp } from 'vue'
import App from './App.vue'
import { HisonVue } from 'hisonvue'
import 'hisonvue/style.css'

const app = createApp(App)
app.use(HisonVue)
app.mount('#app')
