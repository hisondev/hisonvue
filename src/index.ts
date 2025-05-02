import { App } from 'vue'
import type { Hison, HisonCloser, HisonConfig } from './types'
import { createHison } from 'hisonjs'
import { createSSRClientOnly, getDefaultHisonConfig, createHisonCloser, setHison, applyCssVariables } from './core'
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

export const hisonCloser = {
  event : {
    cssEvent: {
      button_onBeforeClick: (e: MouseEvent) => { return true },
      button_onAfterClick: (e: MouseEvent) => {},
      button_onBeforeMouseover: (e: MouseEvent) => { return true },
      button_onAfterMouseover: (e: MouseEvent) => {},
      button_onBeforeMouseout: (e: MouseEvent) => { return true },
      button_onAfterMouseout: (e: MouseEvent) => {},
      button_onBeforeTouchstart: (e: TouchEvent) => { return true },
      button_onAfterTouchstart: (e: TouchEvent) => {},
      button_onBeforeTouchend: (e: TouchEvent) => { return true },
      button_onAfterTouchend: (e: TouchEvent) => {},
    }
  }
} as HisonCloser

export const hison = createHison() as Hison
export const hisonvue = {
  install(app: App, hisonConfig?: HisonConfig) {
    const defaultHisonConfig = getDefaultHisonConfig()
    if(hisonConfig) {
      Object.keys(defaultHisonConfig).forEach((key) => {
        if (!(key in hisonConfig!)) {
          (hisonConfig as any)[key] = defaultHisonConfig[key as keyof HisonConfig]
        }
      })
    }
    else {
      hisonConfig = getDefaultHisonConfig()
    }
    

    createHisonCloser(hisonConfig)
    setHison(hison, hisonConfig)

    //window setting
    if (typeof window !== 'undefined') {
      applyCssVariables()
    }
    
    //사용자 설정값을 적용하기 위해 두번 실행해야함
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
export type {
  Hison,
  HisonConfig,
  HGridColumn,
  HButtonMethods,
} from './types'
export * from './enums'
