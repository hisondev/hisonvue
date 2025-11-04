import type { CSSProperties, PropType } from 'vue'
import { BackgroundType, BackgroundTypeValue, BACKGROUND_TYPE_VALUES, TextAlign, TextAlignValue, TEXT_ALIGN_VALUES } from '../../enums'
import { HLabelAnchorAttrs } from '../../types'

export const labelProps = {
    /**
     * Unique identifier for the label.
     * - Access methods via `hison.component.getLabel(id)`
     * - Duplicate `id` will throw at mount time
     */
    id: { type: String, required: false },
    /**
     * Custom class applied to the label (string / array / object all supported).
     * - Works with responsive classes like `hison-col-*`, `hison-size-*`, etc.
     */
    class: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
        required: false
    },
    /**
     * Inline style for the label (string, object, or an array of objects).
     */
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false
    },
    /**
     * Controls visibility of the label.
     * - Boolean only. Use `:visible="false"` (with a colon).
     */
    visible: { type: Boolean, default: true },
    /**
     * Tooltip text shown on hover (maps to `title` attribute).
     */
    title: { type: String, required: false },
    /**
     * Text content of the label (alternative to default slot).
     */
    text: { type: String, required: false },
    /**
     * When provided (non-empty), label renders an <a> instead of <span>.
     */
    href: { type: String as PropType<string | null>, default: null },
    /**
     * Extra attributes forwarded to the underlying `<a>` element when `href` is set.
     * - Maps directly to native anchor/ARIA attributes (e.g., `target`, `rel`, `download`, `aria-label`, ...).
     * - Use this to control accessibility and advanced link behavior.
     *
     * Example:
     * { target: '_blank', rel: 'noopener noreferrer', download: true, 'aria-label': 'External link' }
     */
    anchorAttrs: {
        type: Object as PropType<Partial<HLabelAnchorAttrs> | Record<string, unknown>>,
        default: () => ({})
    },
    /**
     * Bold font style toggle.
     * - Boolean only
     * - Adds `hison-font-bold` class when enabled
     */
    fontBold: { type: Boolean, default: false },
    /**
     * Italic font style toggle.
     * - Boolean only
     * - Adds `hison-font-italic` class when enabled
     */
    fontItalic: { type: Boolean, default: false },
    /**
     * Strikethrough font style toggle.
     * - Boolean only
     * - Adds `hison-font-thruline` class when enabled
     */
    fontThruline: { type: Boolean, default: false },
    /**
     * Underline font style toggle.
     * - Boolean only
     * - Adds `hison-font-underline` class when enabled
     */
    fontUnderline: { type: Boolean, default: false },
    /**
     * Text alignment for the input’s display text.
     * - 'left' | 'center' | 'right'
     * - Accepts enum `TextAlign` or its literal strings
     */
    textAlign: {
        type: String as PropType<TextAlign | TextAlignValue>,
        default: null,
        validator: (v: any) => v == null || (TEXT_ALIGN_VALUES as readonly string[]).includes(v),
    },
    /**
     * Whether to show border (rendered as subtle box-shadow).
     * - Default: false (no border)
     */
    border: { type: Boolean, default: false },
    /**
     * Label background type.
     * - 'filled' | 'empty' | 'transparent'
     * - Default: 'empty'
     */
    backgroundType: {
        type: String as PropType<BackgroundType | BackgroundTypeValue>,
        default: BackgroundType.empty,
        validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
    },
    /**
     * ID of the target `HInput` (checkbox/radio) to toggle when the label is clicked or activated by keyboard.
     * - Links label interaction to an external input component.
     * - Default: `null`
     */
    toggleTarget: {
        type: String as PropType<string | null>,
        default: null,
    },
    /**
     * Prevent auto-translation by browsers or translation plugins.
     * - When false: adds `translate="no"` and `.notranslate` to the rendered element
     * - Default: true
     */
    translate: { type: Boolean, default: true },
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
