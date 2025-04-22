import { defineNuxtPlugin } from '#app'
import { hisonVue } from 'hisonvue'
import 'hisonvue/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    nuxtApp.vueApp.use(hisonVue)
  }
})
