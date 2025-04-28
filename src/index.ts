import { App } from 'vue'
import type { Hison, HisonConfig } from './types'
import { createHison } from 'hisonjs'
import { setHisonFromHisonConfig } from './plugins'
import { applyCssVariables, createSSRClientOnly, getDefaultHisonConfig, hisonCloser, setHisonCloserFromHisonConfig } from './core'
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
    setHisonCloserFromHisonConfig(config)
    setHisonFromHisonConfig(hison, config)
    hison.cssEvent = {
      setButtonOnBefoerClick(func: ((e: MouseEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeClick = func},
      setButtonOnAfterClick(func: ((e: MouseEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterClick = func},
      setButtonOnBeforeMouseover(func: ((e: MouseEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeMouseover = func},
      setButtonOnAfterMouseover(func: ((e: MouseEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterMouseover = func},
      setButtonOnBeforeMouseout(func: ((e: MouseEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeMouseout = func},
      setButtonOnAfterMouseout(func: ((e: MouseEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterMouseout = func},
      setButtonOnBeforeTouchstart(func: ((e: TouchEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeTouchstart = func},
      setButtonOnAfterTouchstart(func: ((e: TouchEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterTouchstart = func},
      setButtonOnBeforeTouchend(func: ((e: TouchEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeTouchend = func},
      setButtonOnAfterTouchend(func: ((e: TouchEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterTouchend = func}
    }
    console.log(hisonCloser);
    (hison as any).note = {};
    hison.note.getNote = (noteId: string) => { return hisonCloser.note.getNote(noteId) }
    (hison as any).grid = {};
    hison.grid.getGrid = (gridId: string) => { return hisonCloser.grid.getGrid(gridId) }

    //window setting
    if (typeof window !== 'undefined') {
      applyCssVariables(config)
    }
    
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
