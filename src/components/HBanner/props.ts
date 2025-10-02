import type { CSSProperties, PropType } from 'vue'
import { BACKGROUND_TYPE_VALUES, BackgroundType, BackgroundTypeValue } from '../../enums'

export const bannerProps = {
    /**
     * Unique identifier for the banner.
     * - Access runtime methods via `hison.component.getBanner(id)`
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },

    /**
     * Custom class string applied to the banner container.
     * - Supports `hison-col-*`, `hison-size-*`, `hison-color-*`, etc.
     * - Processed by hison responsive extractor
     */
    class: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
        required: false,
    },

    /**
     * Inline style for the banner container.
     */
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false,
    },

    /**
     * Controls visibility of the banner (entire frame).
     */
    visible: { type: Boolean, default: true },

    /**
     * Background type of the banner frame.
     * - 'filled' | 'empty' | 'transparent'
     */
    backgroundType: {
        type: String as PropType<BackgroundType | BackgroundTypeValue>,
        default: BackgroundType.transparent,
        validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
    },

    /**
     * Whether to show border (rendered as subtle box-shadow).
     * - Default: false (no border)
     */
    border: { type: Boolean, default: false },

    /**
     * Zero-based index of the slide to show first.
     * - Applied on mount.
     * - If this prop changes later, the banner will navigate to that index.
     *
     * @default 0
     */
    initialIndex: { type: Number, default: 0 },

    /**
     * Transition duration in milliseconds for slide movement.
     */
    transitionMs: { type: Number, default: 600 },

    /**
     * Navigation button style: 'chevron' | 'triangle'
     */
    navButtonStyle: {
        type: String as PropType<'chevron' | 'triangle'>,
        default: 'chevron',
        validator: (v: any) => v === 'chevron' || v === 'triangle',
    },

    /**
     * Whether to show prev/next navigation buttons.
     */
    showNavButtons: { type: Boolean, default: true },

    /**
     * Whether to show page indicators (● ● ●).
     */
    showIndicators: { type: Boolean, default: true },

    /**
     * Position of the page indicators (dots).
     * - 'bottom': below the banner (outside)
     * - 'overlay': overlaid inside the banner near the bottom edge
     *
     * @default 'bottom'
     */
    indicatorsPosition: {
        type: String as PropType<'bottom' | 'overlay'>,
        default: 'bottom',
        validator: (v: any) => v === 'bottom' || v === 'overlay',
    },

    /**
     * Whether indicators are clickable.
     */
    indicatorClickable: { type: Boolean, default: true },

    /**
     * Autoplay interval in ms.
     * - < 100 disables autoplay.
     */
    autoIntervalMs: { type: Number, default: 0 },

    /**
     * Autoplay direction: 'next' or 'prev'.
     */
    autoDirection: {
        type: String as PropType<'next' | 'prev'>,
        default: 'next',
        validator: (v: any) => v === 'next' || v === 'prev',
    },

    /**
     * Whether to loop at edges.
     * - If true: goes from last → first, first → last
     * - If false: disables navigation at edges
     */
    loop: { type: Boolean, default: true },

    /**
     * Whether to pause autoplay when mouse hovering on banner.
     */
    pauseOnHover: { type: Boolean, default: true },
}
