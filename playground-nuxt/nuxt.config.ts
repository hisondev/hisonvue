import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  typescript: { strict: true },
  vite: {
    define: { 'process.env.DEBUG': false }
  },
  compatibilityDate: '2025-03-19',
  plugins: ['@/plugins/hisonvue.client.ts'],
  modules: ['hisonvue/nuxt'],
  components: true,
})
