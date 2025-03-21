import { App } from 'vue'
import { createSSRClientOnly } from './utils/createSSRClientOnly'

const HButton = createSSRClientOnly<typeof import('./components/HButton.vue').default>(
  () => import('./components/HButton.vue'),
  'HButton'
)

export const HisonVue = {
  install(app: App) {
    app.component('HButton', HButton)
  }
}

export {
  HButton
}
