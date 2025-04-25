import type { 
  HButton,
  HNote,
  HGrid,
} from './index'

declare module 'vue' {
  export interface GlobalComponents {
    /**
     * Hisonvue custom button component.
     *
     * @prop textColor - Button text color (hex RGB format, e.g., '#ffffff')
     * @example
     * <HButton text-color="#ff0000" @click="onClick">Click Me</HButton>
     *
     * @event click - Fired when the button is clicked
     */
    HButton: typeof HButton

    /**
     * Hisonvue custom editor component.
     *
     * @prop dataId - note id
     * @prop mainColor - Primary color for the editor (hex RGB format, e.g., '#ffffff')
     * @prop sizeLevelDesktop - Size level (1 to 9) for editor UI scaling
     * @prop textareaHeight - Height of the textarea (e.g., '300px')
     * @example
     * <HNote main-color="#00aa00" size-level-desktop="3" textarea-height="300px" />
     */
    HNote: typeof HNote

    /**
     * Hisonvue custom grid component.
     *
     * @prop dataId - Required grid ID
     * @prop columns - Column definitions for the grid
     * @prop height - Grid height in CSS format (e.g., "300px")
     * @example
     * <HGrid data-id="grid1" :columns="columns" height="300px" />
     */
    HGrid: typeof HGrid
  }
}
