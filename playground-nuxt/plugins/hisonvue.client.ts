import { defineNuxtPlugin } from '#app'
import { getDefaultHisonConfig, hisonvue, Size, type HisonConfig } from 'hisonvue'
import 'hisonvue/style.css'

const hisonConfig: HisonConfig = getDefaultHisonConfig()
hisonConfig.componentStyle.primaryColor = '#123456'
hisonConfig.componentStyle.size = Size.s
hisonConfig.componentStyle.invertColor = true

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(hisonvue, hisonConfig)
})
