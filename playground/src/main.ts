import { createApp } from 'vue'
import App from './App.vue'
import HisonVue from '../../dist/hisonvue.es.js'

const app = createApp(App)
app.use(HisonVue)
app.mount('#app')