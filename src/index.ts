import { App } from 'vue'
import { createSSRClientOnly } from './utils/createSSRClientOnly'
import type { HisonVueConfig } from './types'
import { getVanillanote } from 'vanillanote2'
import vg from 'vanillagrid';

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

export const HisonVue = {
  install(app: App, config?: HisonVueConfig) {
    const _vn = getVanillanote();
    const _vg = vg;
    app.provide('hisonvue-config', config || {});
    app.provide('hisonvue-vn', _vn);
    app.provide('hisonvue-vg', _vg);
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

export type { HisonVueConfig } from './types'
