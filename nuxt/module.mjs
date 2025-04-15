import { defineNuxtModule, addPlugin, createResolver, addTypeTemplate } from '@nuxt/kit'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

export default defineNuxtModule({
  meta: {
    name: 'hisonvue',
    configKey: 'hisonvue'
  },
  setup(_, nuxt) {
    const resolver = createResolver(import.meta.url)
    addPlugin(resolver.resolve('./plugin.mjs'))

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
