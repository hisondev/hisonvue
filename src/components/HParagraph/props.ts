import { CSSProperties, PropType } from "vue";
import { BACKGROUND_TYPE_VALUES, BackgroundType, BackgroundTypeValue, TEXT_ALIGN_VALUES, TextAlign, TextAlignValue, VERTICAL_ALIGN_VALUES, VerticalAlign, VerticalAlignValue, WHITE_SPACE_VALUES, WhiteSpace, WhiteSpaceValue } from "../../enums";

export const paragraphProps = {
    /**
     * Unique identifier for the paragraph.
     * - Access methods via `hison.component.getParagraph(id)`
     * - Duplicate `id` will throw at mount time
     */
    id: { type: String, required: false },

    /**
     * Custom class applied to the wrapper/paragraph (string / array / object supported).
     * - Works with responsive classes like `hison-col-*`, `hison-size-*`, `hison-color-*`, etc.
     */
    class: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
        required: false,
    },

    /**
     * Inline style for the content element (string, object, or an array of objects).
     */
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false,
    },

    /**
     * Controls visibility of the paragraph.
     * - Boolean only. Use `:visible="false"` (with a colon).
     */
    visible: { type: Boolean, default: true },

    /**
     * Tooltip text shown on hover (maps to the `title` attribute).
     */
    title: { type: String, required: false },

    /**
     * Text content (used when there is NO element slot).
     * - Rendered as plain text (no HTML injection)
     * - Newlines/whitespace are preserved according to `whiteSpace` (default: `'pre-wrap'`)
     */
    text: { type: String, required: false },

    /**
     * Bold font style toggle.
     * - Adds `hison-font-bold` when enabled
     */
    fontBold: { type: Boolean, default: false },

    /**
     * Italic font style toggle.
     * - Adds `hison-font-italic` when enabled
     */
    fontItalic: { type: Boolean, default: false },

    /**
     * Strikethrough font style toggle.
     * - Adds `hison-font-thruline` when enabled
     */
    fontThruline: { type: Boolean, default: false },

    /**
     * Underline font style toggle.
     * - Adds `hison-font-underline` when enabled
     */
    fontUnderline: { type: Boolean, default: false },

    /**
     * Horizontal text alignment.
     * - 'left' | 'center' | 'right'
     * - Accepts enum `TextAlign` or its literal strings
     */
    textAlign: {
        type: String as PropType<TextAlign | TextAlignValue>,
        default: null,
        validator: (v: any) => v == null || (TEXT_ALIGN_VALUES as readonly string[]).includes(v),
    },

    /**
     * Vertical alignment (effective when the paragraph has vertical space).
     * - 'top' | 'middle' | 'bottom'
     * - Implemented by flex utility classes internally
     */
    verticalAlign: {
        type: String as PropType<VerticalAlign | VerticalAlignValue>,
        default: VerticalAlign.top,
        validator: (v: any) => (VERTICAL_ALIGN_VALUES as readonly string[]).includes(v),
    },

    /**
     * Whether to show border (rendered as subtle box-shadow).
     * - Default: false (no border)
     */
    border: { type: Boolean, default: false },

    /**
     * Background type for the paragraph.
     * - 'filled' | 'empty' | 'transparent'
     * - Default: 'empty'
     */
    backgroundType: {
        type: String as PropType<BackgroundType | BackgroundTypeValue>,
        default: BackgroundType.empty,
        validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
    },

    /**
     * Whitespace rendering policy.
     * - 'normal' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | null
     * - When null, the component defaults to `'pre-wrap'`
     */
    whiteSpace: {
        type: String as PropType<WhiteSpace | WhiteSpaceValue | null>,
        default: null,
        validator: (v: any) => v == null || (WHITE_SPACE_VALUES as readonly string[]).includes(v),
    },

    /**
     * Enables content copy.
     * - When true: Ctrl/Cmd+C works on focus; `copy()` API is available
     */
    copyEnabled: { type: Boolean, default: true },

    /**
     * Shows the copy button on the top-right corner.
     * - Only visible when `copyEnabled` is true
     */
    showCopyButton: { type: Boolean, default: false },

    /**
     * Copy button label (also used for accessibility).
     */
    copyButtonText: { type: String, default: 'copy' },
};
