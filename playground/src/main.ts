import { createApp } from 'vue'
import App from './App.vue'
import { getDefaultHisonConfig, hisonvue, Size, type HisonConfig } from 'hisonvue'
import 'hisonvue/style.css'
import router from './router'

const app = createApp(App)

const hisonConfig: HisonConfig = getDefaultHisonConfig()
hisonConfig.primaryColor = '#ccddcc'
hisonConfig.size = Size.s

app.use(hisonvue, hisonConfig)
app.use(router)
app.mount('#app')
