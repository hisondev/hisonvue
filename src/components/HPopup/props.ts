import type { CSSProperties, PropType } from 'vue'
import { ScreenPosition, ScreenPositionValue, SCREEN_POSITION_VALUES } from '../../enums'

export const popupProps = {
    /**
     * Unique identifier for the popup instance.
     * - You can later retrieve its methods via `hison.component.getPopup(id)`
     * - Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },

    /**
     * Custom class applied to the popup wrapper scope.
     * - Accepts string/array/object (Vue class binding formats)
     * - You can use responsive tokens such as `hison-col-*`, `hison-size-*`, `hison-color-*`
     * - Processed internally to apply device-specific classes
     */
    class: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
        required: false,
    },

    /**
     * Inline style(s) for the popup **dialog element** (not the overlay nor the fixed wrapper).
     * - Accepts string, object, or array of objects (Vue style binding formats)
     * - Note: inline width/height here override `width`/`height` props
     */
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false,
    },

    /**
     * Initial visibility of the popup.
     * - Runtime visibility is controlled **only** via methods (`open/close/toggle/setVisible`)
     * - Default: `false`
     */
    visible: { type: Boolean, default: false },

    /**
     * Whether the popup has the thick border/topbar style.
     * - When `false`, the topbar background becomes “empty”
     * - Default: `true`
     */
    border: { type: Boolean, default: true },

    /**
     * Stacking order for this popup **wrapper** (fixed container).
     * - Applied to `.hison-popup-wrapper`; the overlay uses `zIndex - 1`
     * - Default: `1200`
     */
    zIndex: { type: Number, default: 1200 },

    /**
     * On-screen position of the **fixed wrapper** (where the popup is anchored).
     * - Tokens: 'top-left' | 'top-center' | 'top-right' |
     *           'middle-left' | 'middle-center' | 'middle-right' |
     *           'bottom-left' | 'bottom-center' | 'bottom-right'
     * - Default: `middle-center`
     * - Note: Ignored when `left`/`top` are provided (absolute mode)
     */
    position: {
        type: String as PropType<ScreenPosition | ScreenPositionValue>,
        default: ScreenPosition.middleCenter,
        validator: (v: any) => (SCREEN_POSITION_VALUES as readonly string[]).includes(v),
    },

    /**
     * Absolute X position in pixels for the wrapper.
     * - If either `left` or `top` is set, popup switches to **absolute mode**
     * - The missing axis defaults to `0`
     * - Overrides `popupPosition`
     */
    left: { type: Number as PropType<number | null>, default: null },

    /**
     * Absolute Y position in pixels for the wrapper.
     * - If either `left` or `top` is set, popup switches to **absolute mode**
     * - The missing axis defaults to `0`
     * - Overrides `popupPosition`
     */
    top:  { type: Number as PropType<number | null>, default: null },

    /**
     * Dialog width in pixels.
     * - If omitted, width is determined by content and/or responsive classes
     * - Inline `style.width` (if provided) takes precedence over this prop
     */
    width:  { type: Number as PropType<number | null>, default: null },

    /**
     * Dialog height in pixels.
     * - If omitted, height is determined by content
     * - Inline `style.height` (if provided) takes precedence over this prop
     */
    height: { type: Number as PropType<number | null>, default: null },

    /**
     * Enables dragging the popup by its topbar.
     * - When `false`, pointer down on topbar does not move the popup
     * - Default: `true`
     */
    draggable: { type: Boolean, default: true },

    /**
     * Whether the overlay (backdrop) is rendered at all.
     * - Default: `true`
     */
    showOverlay: { type: Boolean, default: true },

    /**
     * Whether clicking the overlay closes the popup.
     * - Default: `true`
     */
    closeClickOverlay: { type: Boolean, default: true },

    /**
     * Styles applied to the overlay element.
     * - Accepts string/object/array; merged with an internal `{ zIndex: (zIndex - 1) }`
     */
    overlayStyle: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false,
    },

    /**
     * Locks page scroll while the popup is open (reference-counted across nested overlays).
     * - Default: `true`
     */
    scrollLock: { type: Boolean, default: true },

    /**
     * Optional enter animation class for the dialog.
     * - Default: internal `'hison-popup-enter'` if not provided
     */
    enterAnimationClass: { type: String, required: false },

    /**
     * Optional leave animation class for the dialog.
     * - Default: internal `'hison-popup-leave'` if not provided
     */
    leaveAnimationClass: { type: String, required: false },
}
