import type { CSSProperties, PropType } from 'vue'

export type DrawerPosition = 'top' | 'bottom' | 'left' | 'right'
export const DRAWER_POSITION_VALUES = ['top','bottom','left','right'] as const

export const drawerProps = {
    /**
     * Unique identifier for the drawer instance.
     * - Retrieve runtime methods via `hison.component.getDrawer(id)`
     * - Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },

    /**
     * Custom class applied to the drawer wrapper scope.
     * - Accepts string/array/object (Vue class binding formats)
     * - You can use responsive tokens such as `hison-col-*`, `hison-size-*`, `hison-color-*`
     * - Processed internally to apply device-specific classes
     */
    class: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
        required: false,
    },

    /**
     * Inline style(s) for the drawer **dialog element** (not the overlay nor the fixed wrapper).
     * - Accepts string, object, or array of objects (Vue style binding formats)
     * - Note: inline width/height here override `width`/`height` props
     */
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false,
    },

    /**
     * Initial visibility of the drawer.
     * - Runtime visibility is controlled **only** via methods (`open/close/toggle/setVisible`)
     * - Default: `false`
     */
    visible: { type: Boolean, default: false },

    /**
     * Whether the drawer has border/shadow styling.
     * - Default: `true`
     */
    border: { type: Boolean, default: true },

    /**
     * Stacking order for this drawer **wrapper** (fixed container).
     * - Applied to `.hison-drawer-wrapper`; the overlay uses `zIndex - 1`
     * - Default: `1100`
     */
    zIndex: { type: Number, default: 1100 },

    /**
     * On-screen position of the drawer (anchored to screen edge).
     * - Tokens: 'top' | 'bottom' | 'left' | 'right'
     * - Default: `'bottom'`
     */
    position: {
        type: String as PropType<DrawerPosition>,
        default: 'bottom',
        validator: (v: any) => (DRAWER_POSITION_VALUES as readonly string[]).includes(v),
    },

    /**
     * Drawer width in pixels.
     * - For left/right drawers: applied as horizontal size
     * - For top/bottom drawers: default is `100vw`, but explicit `width` overrides it
     * - Inline `style.width` (if provided) takes precedence over this prop
     */
    width:  { type: Number as PropType<number | null>, default: null },

    /**
     * Drawer height in pixels.
     * - For top/bottom drawers: applied as vertical size
     * - For left/right drawers: default is `100vh`, but explicit `height` overrides it
     * - Inline `style.height` (if provided) takes precedence over this prop
     */
    height: { type: Number as PropType<number | null>, default: null },

    /**
     * Whether an internal close button is shown (top-right inside drawer).
     * - Default: `true`
     */
    closeButtonVisible: { type: Boolean, default: true },

    /**
     * Label text for the close button.
     * - Default: `'X'`
     */
    closeButtonText: { type: String, default: 'X' },

    /**
     * Title attribute (tooltip) for the close button.
     * - Default: `'close'`
     */
    closeButtonTitle: { type: String, default: 'close' },

    /**
     * Enables swipe-to-close gestures.
     * - Top: swipe down closes
     * - Bottom: swipe up closes
     * - Left: swipe left closes
     * - Right: swipe right closes
     * - Default: `true`
     */
    swipeClose: { type: Boolean, default: true },

    /**
     * Whether the overlay (backdrop) is rendered at all.
     * - Default: `true`
     */
    showOverlay: { type: Boolean, default: true },

    /**
     * Whether clicking the overlay closes the drawer.
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
     * Locks page scroll while the drawer is open (reference-counted across nested overlays).
     * - Default: `true`
     */
    scrollLock: { type: Boolean, default: true },

    /**
     * Optional enter animation class for the drawer.
     * - Default: chosen internally by `position` if not provided
     */
    enterAnimationClass: { type: String, required: false },

    /**
     * Optional leave animation class for the drawer.
     * - Default: chosen internally by `position` if not provided
     */
    leaveAnimationClass: { type: String, required: false },
}
