import { defineNuxtPlugin } from '#app'
import { getDefaultHisonConfig, hisonvue, Size, type HisonConfig } from 'hisonvue'
import 'hisonvue/style.css'

const hisonConfig: HisonConfig = getDefaultHisonConfig()
hisonConfig.primaryColor = '#ccddcc'
hisonConfig.size = Size.xl

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(hisonvue, hisonConfig)
})
