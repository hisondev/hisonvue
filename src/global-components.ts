import type { 
  HButton,
  HEditor,
  HGrid,
} from './index'

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

    /**
     * HisonVue custom editor component.
     *
     * @prop dataId - note id
     * @prop mainColor - Primary color for the editor (hex RGB format, e.g., '#ffffff')
     * @prop sizeLevelDesktop - Size level (1 to 9) for editor UI scaling
     * @prop textareaHeight - Height of the textarea (e.g., '300px')
     * @example
     * <HEditor main-color="#00aa00" size-level-desktop="3" textarea-height="300px" />
     */
    HEditor: typeof HEditor

    /**
     * HisonVue custom grid component.
     */
    HGrid: typeof HGrid
  }
}
