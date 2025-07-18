import { createApp } from 'vue'
import App from './App.vue'
import { getDefaultHisonConfig, hisonvue, Size, type HisonConfig } from 'hisonvue'
import 'hisonvue/style.css'
import router from './router'

const app = createApp(App)

const hisonConfig: HisonConfig = getDefaultHisonConfig()
//hisonConfig.componentStyle.primaryColor = '#217346'
hisonConfig.componentStyle.size = Size.s
hisonConfig.componentStyle.primaryColor = '#123456'

console.log('### hisonConfig',hisonConfig);

const iconSpan = document.createElement('span')
iconSpan.classList.add('material-symbols-rounded')
iconSpan.textContent = 'auto_fix_high'
hisonConfig.component.note.iconSpanElement.boldButtonIcon = iconSpan

hisonConfig.event.cssEvent.input_onAfterBlur = (e) => {
    return true;
}

app.use(hisonvue, hisonConfig)
app.use(router)
app.mount('#app')
