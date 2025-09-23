import { defineNuxtPlugin } from '#app'
import { getDefaultHisonConfig, hisonvue, Size, type HisonConfig } from 'hisonvue'
import 'hisonvue/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  const hisonConfig: HisonConfig = getDefaultHisonConfig()
  hisonConfig.componentStyle.primaryColor = '#217346'
  hisonConfig.componentStyle.size = Size.s
  hisonConfig.componentStyle.invertColor = false

  console.log('hisonvue.client.ts hisonConfig!!!',hisonConfig)
  
  const iconSpan = document.createElement('span')
  iconSpan.classList.add('material-symbols-rounded')
  iconSpan.textContent = 'auto_fix_high'
  hisonConfig.component.note.iconSpanElement.boldButtonIcon = iconSpan

  nuxtApp.vueApp.use(hisonvue, hisonConfig)
})


