import type { CSSProperties, PropType } from 'vue'
import { ScreenPosition, ScreenPositionValue, SCREEN_POSITION_VALUES, SpinnerType, SpinnerTypeValue } from '../../enums'

export const spinnerProps = {
    /**
     * Unique identifier for the spinner instance.
     * - You can later retrieve its methods via `hison.component.getSpinner(id)`
     * - Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },

    /**
     * Custom class applied to the spinner wrapper scope.
     * - Accepts string/array/object (Vue class binding formats)
     * - You can use responsive tokens such as `hison-col-*`, `hison-size-*`, `hison-color-*`
     * - Processed internally to apply device-specific classes
     */
    class: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
        required: false,
    },

    /**
     * Inline style(s) for the spinner **box element** (not the overlay nor the fixed wrapper).
     * - Accepts string, object, or array of objects (Vue style binding formats)
     * - Use this for width/height/padding of the spinner container
     */
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false,
    },

    /**
     * Initial visibility of the spinner.
     * - Runtime visibility is controlled **only** via methods (`open/close/toggle/setVisible`)
     * - Default: `false`
     */
    visible: { type: Boolean, default: false },

    /**
     * Stacking order for this spinner **wrapper** (fixed container).
     * - Applied to `.hison-spinner-wrapper`; the overlay uses `zIndex - 1`
     * - Default: `1500`
     */
    zIndex: { type: Number, default: 1500 },

    /**
     * On-screen position of the **fixed wrapper** (where the spinner is anchored).
     * - Tokens: 'top-left' | 'top-center' | 'top-right' |
     *           'middle-left' | 'middle-center' | 'middle-right' |
     *           'bottom-left' | 'bottom-center' | 'bottom-right'
     * - Default: `middle-center`
     */
    position: {
        type: String as PropType<ScreenPosition | ScreenPositionValue>,
        default: ScreenPosition.middleCenter,
        validator: (v: any) => (SCREEN_POSITION_VALUES as readonly string[]).includes(v),
    },

    /**
     * Styles applied to the overlay element.
     * - Overlay is **always rendered** and blocks pointer events behind the spinner
     * - Accepts string/object/array; merged with an internal `{ zIndex: (zIndex - 1) }`
     * - Example: `overlay-style="{ backgroundColor: 'rgba(0,0,0,.25)' }"`
     */
    overlayStyle: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false,
    },

    /**
     * Auto-hide timeout in milliseconds.
     * - `0` disables the timeout (spinner stays until closed programmatically)
     * - When > 0, spinner will close automatically after the specified duration
     * - Default: `0`
     */
    timeoutMs: { type: Number, default: 0 },

    /**
     * Built-in spinner renderer type.
     * - One of: `'ring' | 'dots' | 'bars' | 'pulse'`
     * - Default: `'ring'`
     * - Ignored when a custom `#spinner` slot is provided
     */
    spinnerType: {
        type: String as PropType<SpinnerType | SpinnerTypeValue>,
        default: 'ring',
        validator: (v: any) => ['ring','dots','bars','pulse'].includes(v),
    },
}
