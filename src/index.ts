import { App } from 'vue'
import { createSSRClientOnly } from './utils/createSSRClientOnly'
import type { HisonVueConfig } from './types'

const HButton = createSSRClientOnly<typeof import('./components/HButton.vue').default>(
  () => import('./components/HButton.vue'),
  'HButton'
)

const HEditor = createSSRClientOnly<typeof import('./components/HEditor.vue').default>(
  () => import('./components/HEditor.vue'),
  'HEditor'
)

const HGrid = createSSRClientOnly<typeof import('./components/HGrid.vue').default>(
  () => import('./components/HGrid.vue'),
  'HGrid'
)

const HProvider = createSSRClientOnly<typeof import('./components/HProvider.vue').default>(
  () => import('./components/HProvider.vue'),
  'HProvider'
)

export const HisonVue = {
  install(app: App, config?: HisonVueConfig) {
    app.provide('hisonvue-config', config || {});
    app.component('HButton', HButton);
    app.component('HEditor', HEditor);
    app.component('HGrid', HGrid);
    app.component('HProvider', HProvider);
  }
}

export {
  HButton,
  HEditor,
  HGrid,
  HProvider,
}

export type { HisonVueConfig } from './types'
