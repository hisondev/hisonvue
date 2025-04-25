import { App } from 'vue'
import type { Hison, HisonConfig } from './types'
import { createHison } from 'hisonjs'
import { getVg, getVn, setHisonConfig } from './plugins'
import { createSSRClientOnly, getDefaultHisonConfig } from './core'
import './styles/hisonvue.scss'
import { applyCssVariables } from './utils/styler'

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

    if (typeof window !== 'undefined') {
      applyCssVariables(config)
    }

    setHisonConfig(hison, config)
    const vn = getVn(config)
    const vg = getVg(config)
    hison.vue = {
      note: vn,
      grid: vg
    }
    
    app.provide('hisonvue-config', config)
    app.provide('hisonvue-vn', vn)
    app.provide('hisonvue-vg', vg)
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
