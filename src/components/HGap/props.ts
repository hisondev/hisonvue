import type { CSSProperties, PropType } from 'vue'
import { BackgroundType, BackgroundTypeValue, BACKGROUND_TYPE_VALUES, H_GAP_RULE_VALUES, HGapLineStyleValue, HGapLineStyle, H_GAP_LINE_STYLE_VALUES, HGapLine, HGapLineValue } from '../../enums'

export const gapProps = {
    /**
     * Unique identifier for the gap.
     * - Access methods via `hison.component.getGap(id)`
     * - Duplicate `id` will throw at mount time
     */
    id: { type: String, required: false },
    /**
     * Custom class applied to the gap wrapper (string / array / object).
     * - Works with responsive classes like `hison-col-*`, `hison-size-*`, `hison-color-*`, `hison-pos-*`
     * - If no `hison-col-*` is provided, `hison-col-12` is added by default.
     */
    class: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
        required: false
    },
    /**
     * Inline style for the gap element (string, object, or an array of objects).
     */
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false
    },
    /**
     * Controls visibility of the gap.
     * - Boolean only. Use `:visible="false"`
     */
    visible: { type: Boolean, default: true },
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
    /**
     * Drawing rule of the gap:
     * - 'none' (default): renders empty space only
     * - 'horizontal': renders a horizontal line (like hr)
     * - 'vertical'  : renders a vertical line
     */
    line: {
        type: String as PropType<HGapLine | HGapLineValue>,
        default: 'none',
        validator: (v: any) => (H_GAP_RULE_VALUES as readonly string[]).includes(v),
    },
    /**
     * Style of the divider line.
     * - 'solid' (default)
     * - 'dashed'
     * - 'dotted'
     * - 'double'
     * - 'groove'
     * - 'ridge'
     * - 'inset'
     * - 'outset'
     */
    lineStyle: {
        type: String as PropType<HGapLineStyle | HGapLineStyleValue>,
        default: 'solid',
        validator: (v: any) => (H_GAP_LINE_STYLE_VALUES as readonly string[]).includes(v),
    },
    /**
     * Thickness of the divider line.
     * - Number → pixels (e.g. `2` → `2px`)
     * - String → any valid CSS unit (e.g. `'0.5rem'`)
     * - Default: 1
     */
    lineWidth: {
        type: [Number, String] as PropType<number | string>,
        default: 1, // number -> px
    },
    /**
     * Color of the divider line.
     * - Any valid CSS color string (hex, rgb, etc.)
     * - Empty string (`''`) uses theme auto color
     */
    lineColor: {
        type: String,
        default: '', // '' -> theme auto
    },
}
