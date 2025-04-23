import { defineNuxtPlugin } from '#app'
import { hisonvueApp } from 'hisonvue'
import 'hisonvue/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    nuxtApp.vueApp.use(hisonvueApp)
  }
})
