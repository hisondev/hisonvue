import { createApp } from 'vue'
import App from './App.vue'
import { getDefaultHisonConfig, hisonvue, Size, type HisonConfig } from 'hisonvue'
import 'hisonvue/style.css'
import router from './router'

const app = createApp(App)

const hisonConfig: HisonConfig = getDefaultHisonConfig()
console.log('33333', hisonConfig.componentStyle.primaryColor)
hisonConfig.componentStyle.primaryColor = '#217346'
hisonConfig.componentStyle.size = Size.s
hisonConfig.event.cssEvent.button_onBeforeClick = (e: MouseEvent) => {console.log('button_onBeforeClick');return true}
console.log('44444', hisonConfig.componentStyle.primaryColor)

app.use(hisonvue, hisonConfig)
app.use(router)
app.mount('#app')
