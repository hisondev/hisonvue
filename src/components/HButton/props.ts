import { CSSProperties, PropType } from 'vue'
import { BACKGROUND_TYPE_VALUES, BackgroundType, BackgroundTypeValue } from '../../enums'

export const buttonProps = {
    /**
     * Unique identifier for the button.
     * - You can later retrieve its methods via `hison.component.getButton(id)`
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },
    /**
     * Custom class applied to the button (string / array / object all supported).
     * - Works with responsive classes like `hison-col-*`, `hison-size-*`, etc.
     */
    class: {
        type: [String, Array, Object] as PropType<
        string | string[] | Record<string, boolean>
        >,
        required: false,
    },
    /**
     * Inline style for the button (string, object, or an array of objects).
     */
    style: {
        type: [String, Object, Array] as PropType<
        string | CSSProperties | CSSProperties[]
        >,
        required: false,
    },
    /**
     * Controls visibility of the button.
     * - Boolean only. Use `:visible="false"` (with a colon).
     */
    visible: { type: Boolean, default: true },
    /**
     * Whether the button is disabled.
     * - Boolean only. Use `:disable="true"` (with a colon).
     */
    disable: { type: Boolean, default: false },
    /**
     * Tooltip text shown on hover (maps to `title` attribute).
     */
    title: { type: String, required: false },
    /**
     * Text content of the button (alternative to default slot).
     */
    text: { type: String, required: false },
    /**
     * Minimum interval (ms) between button clicks.
     * - 0 disables the limit.
     */
    clickInterval: { type: Number, default: 0 },
    /**
     * Whether to show border (rendered as subtle box-shadow).
     * - Default: true (border)
     */
    border: { type: Boolean, default: true },
    /**
     * Button background type.
     * - 'filled' | 'empty' | 'transparent'
     */
    backgroundType: {
        type: String as PropType<BackgroundType | BackgroundTypeValue>,
        default: BackgroundType.filled,
        validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
    },
    /**
     * Controls keyboard focus order of the element.
     * - `0` enables natural tab navigation, positive numbers set custom order.
     * - `null` or `''` removes tabindex (not focusable).
     */
    tabIndex: {
        type: [Number, String] as PropType<number | string | null>,
        default: null,
        validator: (v: any) =>
        v === null || v === '' || (!isNaN(+v) && isFinite(+v))
    },
}
