import { defineNuxtPlugin } from '#app'
import { HisonVue } from 'hisonvue'
import 'hisonvue/style.css'   // CSS 자동 불러오기

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    nuxtApp.vueApp.use(HisonVue)
  }
})
