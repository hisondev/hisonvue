import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'hisonvue',
    configKey: 'hisonvue'
  },
  setup(_, nuxt) {
    const resolver = createResolver(import.meta.url)
    addPlugin(resolver.resolve('./plugin.mjs'))
  }
})
