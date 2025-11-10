//nuxt/plugin.mjs
import { defineNuxtPlugin, useAppConfig, useRuntimeConfig } from '#app'
import { hisonvue, getDefaultHisonConfig } from 'hisonvue'
import 'hisonvue/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) return

  const installed = (nuxtApp.vueApp && (nuxtApp.vueApp)._context && (nuxtApp.vueApp)._context.installedPlugins)
  if (installed && installed.has(hisonvue)) {
    return
  }

  const cfg = getDefaultHisonConfig()
  try {
    const appCfg = (useAppConfig() || {}).hisonvue || {}
    const runtimeCfg = ((useRuntimeConfig() || {}).public || {}).hisonvue || {}
    Object.assign(cfg, appCfg, runtimeCfg)
  } catch (_) { }

  nuxtApp.vueApp.use(hisonvue, cfg)
})