import { App } from 'vue'
import type { Hison, HisonConfig } from './types'
import { createHison } from 'hisonjs'
import { createSSRClientOnly, getDefaultHisonConfig, createHisonCloser, setHison } from './core'
import './styles/hisonvue.scss'

const HButton = createSSRClientOnly<typeof import('./components/HButton/HButton.vue').default>(
  () => import('./components/HButton/HButton.vue'),
  'HButton'
)
const HNote = createSSRClientOnly<typeof import('./components/HNote/HNote.vue').default>(
  () => import('./components/HNote/HNote.vue'),
  'HNote'
)
const HGrid = createSSRClientOnly<typeof import('./components/HGrid/HGrid.vue').default>(
  () => import('./components/HGrid/HGrid.vue'),
  'HGrid'
)

export const hison = createHison() as Hison
export const hisonvue = {
  install(app: App, config?: HisonConfig) {
    const defaultHisonConfig = getDefaultHisonConfig()
    if(config) {
      Object.keys(defaultHisonConfig).forEach((key) => {
        if (!(key in config!)) {
          (config as any)[key] = defaultHisonConfig[key as keyof HisonConfig]
        }
      })
    }
    else {
      config = getDefaultHisonConfig()
    }
    createHisonCloser(config)
    setHison(hison, config)
    
    app.provide('hisonvue-config', config)
    app.provide('hison', hison)
    app.component('HButton', HButton)
    app.component('HNote', HNote)
    app.component('HGrid', HGrid)
  }
}

export {
  HButton,
  HNote,
  HGrid,
  getDefaultHisonConfig,
}
export type { Hison, HisonConfig, HGridColumn } from './types'
export * from './enums'
