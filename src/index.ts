import { App } from 'vue'
import { createSSRClientOnly } from './utils/createSSRClientOnly'
import type { HisonVue, HisonVueConfig } from './types'
import { getVanillanote, getVanillanoteConfig, type Vanillanote } from 'vanillanote2'
import { getVanillagrid, getVanillagridConfig, type Vanillagrid } from 'vanillagrid2'
import { createHison } from 'hisonjs'

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

export let hison: HisonVue;
export const hisonVue = {
  install(app: App, config?: HisonVueConfig) {
    hison = createHison() as HisonVue;
    
    const vnConfig = getVanillanoteConfig();
    const vgConfig = getVanillagridConfig();
    const vn = getVanillanote(vnConfig);
    const vg = getVanillagrid(vgConfig);

    hison.vue = {
      note: vn,
      grid: vg
    };
    
    app.provide('hisonvue-config', config || {});
    app.provide('hisonvue-vn', vn);
    app.provide('hisonvue-vg', vg);
    app.provide('hison', hison);
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

export type { HisonVue, HisonVueConfig } from './types'
