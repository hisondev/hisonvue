import { defineNuxtPlugin } from '#app'
import { HisonVue, type HisonVueConfig } from 'hisonvue'
import 'hisonvue/style.css'

const hisonVueConfig: HisonVueConfig = {
  primaryColor: '#00aa00',
  size: 's',
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(HisonVue, hisonVueConfig)
})
