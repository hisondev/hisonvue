import { defineNuxtPlugin } from '#app'
import { HisonVue, type HisonVueConfig } from 'hisonvue'
import 'hisonvue/style.css'

const hisonVueConfig: HisonVueConfig = {
  primaryColor: '#ccddcc',
  size: 's',
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(HisonVue, hisonVueConfig)
})
