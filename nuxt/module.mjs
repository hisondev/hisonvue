import {
  defineNuxtModule,
  addTemplate,
  addPlugin,
  createResolver,
  addTypeTemplate,
} from '@nuxt/kit'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

export default defineNuxtModule({
  meta: { name: 'hisonvue', configKey: 'hisonvue' },
  defaults: { autoInstall: true },
  setup(_options, nuxt) {

    const resolver = createResolver(import.meta.url)

    const tpl = addTemplate({
      filename: 'hisonvue.plugin.mjs',
      getContents: () => `
import { defineNuxtPlugin, useAppConfig, useRuntimeConfig } from '#app'
import { hisonvue, getDefaultHisonConfig } from 'hisonvue'

export default defineNuxtPlugin((nuxtApp) => {
  try {
    const installed = (nuxtApp.vueApp && (nuxtApp.vueApp)._context && (nuxtApp.vueApp)._context.installedPlugins)
    if (installed && installed.has(hisonvue)) return

    const cfg = getDefaultHisonConfig()
    try {
      const appCfg = (useAppConfig() || {}).hisonvue || {}
      const runtimeCfg = ((useRuntimeConfig() || {}).public || {}).hisonvue || {}
      Object.assign(cfg, appCfg, runtimeCfg)
    } catch {}

    nuxtApp.vueApp.use(hisonvue, cfg)
  } catch (err) {
    console.error('[hisonvue] plugin failed on', process.server ? 'SSR' : 'CSR', err)
  }
})
      `.trim()
    })

    addPlugin({ src: tpl.dst })

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const globalComponentsPath = resolve(__dirname, '../dist/hisonvue.d.ts')

    addTypeTemplate({
      filename: 'types/hisonvue-components.d.ts',
      getContents: () => readFileSync(globalComponentsPath, 'utf-8')
    })
    nuxt.hook('prepare:types', (opts) => {
      opts.references.push({ path: resolver.resolve('types/hisonvue-components.d.ts') })
    })
  }
})
