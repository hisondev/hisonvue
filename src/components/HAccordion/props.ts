import type { CSSProperties, PropType } from 'vue'
import { TEXT_ALIGN_VALUES, TextAlign, TextAlignValue } from '../../enums'

export const accordionProps = {
    /**
     * Unique identifier for the accordion.
     * - Retrieve methods via `hison.component.getAccordion(id)`
     * - ⚠️ Duplicate `id` will throw at mount time
     */
    id: { type: String, required: false },
    /**
     * Custom class applied to the root container.
     * - Supports responsive classes: `hison-col-*`, `hison-size-*`, `hison-color-*` with `-mb|-tb|-pc|-wd`
     */
    class: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
        required: false
    },
    /**
     * Inline style for the root.
     */
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false
    },
    /**
     * Inline style for header box.
     */
    headerStyle: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false
    },
    /**
     * Inline style for content box.
     */
    contentStyle: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false
    },
    /**
     * Visibility of the accordion.
     */
    visible: { type: Boolean, default: true },
    /**
     * Initial open state.
     */
    defaultOpen: { type: Boolean, default: false },
    /**
     * Header text (used when no `#title` slot is provided).
     */
    title: { type: String, default: '' },
    /**
     * Text alignment for the header title area.
     * - 'left' | 'center' | 'right'
     */
    textAlign: {
        type: String as PropType<TextAlign | TextAlignValue>,
        default: 'left',
        validator: (v: any) => (TEXT_ALIGN_VALUES as readonly string[]).includes(v),
    },
    /**
     * Animate expand/collapse.
     */
    animate: { type: Boolean, default: true },
    /**
     * Animation duration in ms.
     */
    duration: {
        type: Number,
        default: 220,
        validator: (n: any) => Number.isFinite(n) && n >= 0,
    },
    /**
     * CSS timing function (e.g., 'ease', 'linear', 'ease-in-out', 'cubic-bezier(...)', etc.)
     */
    easing: { type: String, default: 'ease' },
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
