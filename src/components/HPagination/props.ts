import type { CSSProperties, PropType } from 'vue'
import { BACKGROUND_TYPE_VALUES, BackgroundType, BackgroundTypeValue } from '../../enums'

export const paginationProps = {
    /**
     * Unique identifier for the pagination component.
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },

    /**
     * Custom class applied to the pagination container.
     * - Works with responsive classes like `hison-col-*`, `hison-size-*`, `hison-color-*`
     */
    class: {
        type: [String, Array, Object] as PropType<
            string | string[] | Record<string, boolean>
        >,
        required: false,
    },

    /**
     * Inline style for the pagination container.
     * - Can be string, object, or array of objects
     */
    style: {
        type: [String, Object, Array] as PropType<
            string | CSSProperties | CSSProperties[]
        >,
        required: false,
    },

    /**
     * Controls visibility of the entire pagination.
     * - Boolean only. Use `:visible="false"` (with a colon).
     * - Default: true
     */
    visible: { type: Boolean, default: true },

    /**
     * Disables all navigation and page buttons.
     * - Boolean only. Use `:disable="true"`
     * - Default: false
     */
    disable: { type: Boolean, default: false },

    /**
     * Gap size between buttons.
     * - Accepts numbers (px) or CSS size strings (`rem`, `em`, etc.)
     * - Default: '0.25rem'
     */
    gap: {
        type: [Number, String] as PropType<number | string>,
        default: '0.25rem',
    },

    /**
     * Whether to show border on buttons (via `hison-border`).
     * - Default: true
     */
    border: { type: Boolean, default: true },

    /**
     * Button background type.
     * - 'filled' | 'empty' | 'transparent'
     * - Default: 'empty'
     */
    backgroundType: {
        type: String as PropType<BackgroundType | BackgroundTypeValue>,
        default: BackgroundType.empty,
        validator: (v: any) =>
            (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
    },

    /**
     * Minimum interval (ms) between button clicks.
     * - 0 disables the limit.
     */
    clickInterval: { type: Number, default: 0 },

    /**
     * Current page (v-model).
     * - 1-based index
     * - Always clamped to [1 .. totalPages]
     * - Default: 1
     */
    modelValue: { type: Number, default: 1 },

    /**
     * Total number of items (optional).
     * - Used together with `pageSize` to compute totalPages = ceil(totalItems / pageSize)
     * - If `totalPages` > 0, this value is ignored
     */
    totalItems: { type: Number, required: false, default: undefined },

    /**
     * Items per page.
     * - Used with `totalItems` to calculate totalPages
     * - Default: 10
     */
    pageSize: { type: Number, default: 10 },

    /**
     * Explicit total number of pages (optional).
     * - If provided (>0), this takes precedence over totalItems/pageSize calculation
     */
    totalPages: { type: Number, required: false, default: undefined },

    /**
     * Maximum number of page number buttons to display
     * (excluding prev/next/first/last).
     * - Minimum recommended: 3
     * - Default: 5
     */
    maxButtons: { type: Number, default: 5 },

    /**
     * Controls keyboard focus order of the element.
     * - `0` enables natural tab navigation, positive numbers set custom order.
     * - `null` or `''` removes tabindex (not focusable).
     */
    tabIndex: {
        type: [Number, String] as PropType<number | string | null>,
        default: null,
        validator: (v: any) =>
            v === null || v === '' || (!isNaN(+v) && isFinite(+v)),
    },

    /**
     * Toggles visibility of individual navigation buttons.
     * - First (`«`), Prev (`‹`), Next (`›`), Last (`»`)
     * - Default: true for all
     */
    showPrev: { type: Boolean, default: true },
    showNext: { type: Boolean, default: true },
    showFirst: { type: Boolean, default: true },
    showLast: { type: Boolean, default: true },
}
