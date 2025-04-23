import { defineNuxtPlugin } from '#app'
import { hisonvueApp, type HisonvueConfig } from 'hisonvue'
import 'hisonvue/style.css'

const hisonvueConfig: HisonvueConfig = {
  primaryColor: '#ccddcc',
  size: 's',
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(hisonvueApp, hisonvueConfig)
})
