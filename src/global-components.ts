import type { HButton } from './index'

declare module 'vue' {
  export interface GlobalComponents {
    /**
     * HisonVue custom button component.
     *
     * @prop textColor - Button text color (hex RGB format, e.g., '#ffffff')
     * @example
     * <HButton text-color="#ff0000" @click="onClick">Click Me</HButton>
     *
     * @event click - Fired when the button is clicked
     */
    HButton: typeof HButton
  }
}
