import { App } from 'vue'
import { createSSRClientOnly } from './utils/createSSRClientOnly'
import { DefineComponent } from 'vue'

/**
 * hisonvue custom button component
 */
const HButton: DefineComponent<{}, {}, any> = createSSRClientOnly(() => import('./components/HButton.vue'), 'HButton')

export const HisonVue = {
  install(app: App) {
    app.component('HButton', HButton)
  }
}

export { HButton }
