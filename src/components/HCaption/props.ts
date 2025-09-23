import type { CSSProperties, PropType } from 'vue'
import {
  BackgroundType, BackgroundTypeValue, BACKGROUND_TYPE_VALUES,
  TextAlign, TextAlignValue, TEXT_ALIGN_VALUES
} from '../../enums'

export const captionProps = {
    /**
     * Unique identifier for the caption.
     * - Access methods via `hison.component.getCaption(id)`
     * - Duplicate `id` will throw at mount time
     */
    id: { type: String, required: false },
    /**
     * Custom class applied to the caption wrapper (string / array / object).
     * - Works with responsive classes like `hison-col-*`, `hison-size-*`, `hison-color-*`, `hison-pos-*`
     */
    class: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
        required: false
    },
    /**
     * Inline style for the caption element (string, object, or an array of objects).
     * - Keep styles minimal; prefer class-based styling
     */
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false
    },
    /**
     * Controls visibility of the caption.
     * - Boolean only. Use `:visible="false"`
     */
    visible: { type: Boolean, default: true },
    /**
     * Tooltip text shown on hover (maps to `title` attribute).
     */
    title: { type: String, required: false },
    /**
     * Text content of the caption (alternative to slot).
     * - If default slot is pure text nodes, it is absorbed and treated as `text`
     */
    text: { type: String, required: false },
    /**
     * Heading level: 1~6 (rendered as <h1>~<h6>).
     * - Default: 3
     */
    level: {
        type: Number as PropType<1 | 2 | 3 | 4 | 5 | 6 | number>,
        default: 3,
        validator: (v: any) => Number.isFinite(v) && v >= 1 && v <= 6
    },
    /**
     * Bold font style toggle.
     * - Boolean only
     * - Adds `hison-font-bold-important` class when enabled
     */
    fontBold: { type: Boolean, default: true },
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
     * Text alignment of the caption.
     * - 'left' | 'center' | 'right'
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
     * Background type.
     * - 'filled' | 'empty' | 'transparent'
     * - Default: 'empty'
     */
    backgroundType: {
        type: String as PropType<BackgroundType | BackgroundTypeValue>,
        default: BackgroundType.empty,
        validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
    },
}
