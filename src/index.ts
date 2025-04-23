import { App } from 'vue'
import { createSSRClientOnly } from './utils/createSSRClientOnly'
import type { Hisonvue, HisonvueConfig } from './types'
import { getVanillanote, getVanillanoteConfig } from 'vanillanote2'
import { getVanillagrid, getVanillagridConfig } from 'vanillagrid2'
import { createHison } from 'hisonjs'

const HButton = createSSRClientOnly<typeof import('./components/HButton/HButton.vue').default>(
  () => import('./components/HButton/HButton.vue'),
  'HButton'
)

const HEditor = createSSRClientOnly<typeof import('./components/HEditor/HEditor.vue').default>(
  () => import('./components/HEditor/HEditor.vue'),
  'HEditor'
)

const HGrid = createSSRClientOnly<typeof import('./components/HGrid/HGrid.vue').default>(
  () => import('./components/HGrid/HGrid.vue'),
  'HGrid'
)

export let hisonvue: Hisonvue;
export const hisonvueApp = {
  install(app: App, config?: HisonvueConfig) {
    hisonvue = createHison() as Hisonvue;
    
    const vnConfig = getVanillanoteConfig();
    const vgConfig = getVanillagridConfig();
    const vn = getVanillanote(vnConfig);
    const vg = getVanillagrid(vgConfig);

    hisonvue.vue = {
      note: vn,
      grid: vg
    };
    
    app.provide('hisonvue-config', config || {});
    app.provide('hisonvue-vn', vn);
    app.provide('hisonvue-vg', vg);
    app.provide('hison-vue', hisonvue);
    app.component('HButton', HButton);
    app.component('HEditor', HEditor);
    app.component('HGrid', HGrid);
  }
}

export {
  HButton,
  HEditor,
  HGrid,
}

export type { Hisonvue, HisonvueConfig } from './types'
