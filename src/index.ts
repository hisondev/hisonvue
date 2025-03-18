import HButton from './components/HButton.vue'

export const HisonVue = {
  install(app: any) {
    app.component('HButton', HButton)
  }
}

export { HButton }
